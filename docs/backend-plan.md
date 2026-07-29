# Backend & Monorepo Plan (Scoping — locked July 2026)

High-level scope for adding a backend (GCP Cloud Run) and restructuring this
repo into a monorepo. This is the alignment doc: decisions here were made
deliberately — re-litigate with Ryan before deviating.

**Sequencing:** Phase 0 (PostHog on the FE, direct) ships first and depends on
nothing below. Phase 1 is the monorepo migration. Phase 2 is backend v1.

---

## Goals

- A backend so future projects can be more complex than static-page tools.
- Product tracking via PostHog.
- **$0/month posture**: everything inside free tiers; every future cost must be
  an explicit, documented opt-in.
- Cold starts treated as a first-class design constraint, not an afterthought.

## Locked Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Workspace foundation | **pnpm workspaces** | The load-bearing choice; everything else layers on top |
| Task runner | **Turborepo** | QoL: one `turbo dev`, caching, and `prune --docker` for the Cloud Run image. Thin layer, near-zero exit cost. (Nx rejected for scale mismatch, not "weight" — revisit at ~5–6 apps or when generators/release tooling matter) |
| Backend framework | **Hono** (Node) + Zod | Tiny bundle → small image → fast cold start; `@hono/zod-validator` pairs with shared-types; portable off Cloud Run |
| Build | Bundle backend to a single JS file (esbuild/tsup), slim/distroless image, **<100MB target** | Image size ≈ cold-start time |
| Region | **us-west1** | Free-tier-eligible region closest to North Vancouver |
| Scaling | **min-instances=0** + startup CPU boost + concurrency 80 | One idle 512MiB instance ≈ 1.3M GiB-s/mo ≈ 4× the entire free compute grant — scale-to-zero is the $0 posture |
| Cold-start strategy | **FE warm-up ping on app mount** + `<link rel="preconnect">` | Warms exactly when a human is present; Cloud Run queues requests during boot so worst case is the cold start you'd have had anyway. Scheduler ping only if metrics later justify it |
| Deploy auth | **Workload Identity Federation** | Non-negotiable: no long-lived service-account JSON keys; least-privilege deploy SA (Artifact Registry writer + Cloud Run deployer) |
| Pages deploy | Keep the `gh-pages` package flow | One migration at a time; publish dir becomes `apps/frontend/dist`, CNAME copy path updated |
| Tracking topology | **FE → PostHog Cloud direct; BE → Cloud Logging** (see Observability) | Clean separation: analytics never depends on backend warmth/deploys. Ad-blocker undercount consciously accepted — reversible via `api_host` flip |

## Monorepo Layout (Phase 1)

```
├── apps/
│   ├── frontend/         # current app, git mv (preserve history) → GH Pages
│   └── backend/          # Hono service → Cloud Run (Docker)
├── packages/
│   ├── shared-types/     # Zod schemas: single source of truth for both sides
│   └── config/           # shared tsconfig / eslint bases
├── pnpm-workspace.yaml
└── turbo.json            # build / test / lint / dev pipelines
```

Migration notes: in-place (keeps git history + Pages config). npm → pnpm
lockfile swap. Vitest stays per-app. GH Pages is indifferent to all of this.

## Backend v1 (Phase 2)

- **Endpoints**: `/health` only (decided — contact form rejected; the first
  real endpoint arrives when a project needs one). Deliberately tiny; v1's
  job is proving the pipeline.
- **Explicitly NOT in v1**: PostHog proxy, database, auth, staging, custom
  domain, load balancer.
- **CI/CD**: two GitHub Actions workflows, graph-filtered:
  - FE: `turbo run build --filter=frontend` → `gh-pages` publish.
  - BE: `turbo prune backend --docker` → docker build → Artifact Registry →
    `gcloud run deploy`, authenticated via WIF.

## Observability (settled)

| Concern | Tool | Cost |
|---|---|---|
| FE product analytics | PostHog Cloud, direct, public `phc_` key — Web Analytics + Product Analytics products | Free ≤1M events/mo |
| FE session replay | PostHog Session Replay, direct mode, `maskAllInputs: true` (calculator holds personal finances) | Free ≤5k recordings/mo |
| FE errors | PostHog Error Tracking (`capture_exceptions: true`) | Free ≤100k exceptions/mo |
| BE ops logs & errors | Cloud Logging (automatic on Cloud Run) + Error Reporting; emit structured JSON with `severity` | Free ≤~50GiB/mo |
| BE product events (later) | PostHog server-side capture, same public key — ONLY for user-behavior facts (e.g. `contact_form_submitted`) | Same event quota |

Named FE events (beyond autocapture/pageviews): `resume_downloaded`,
`calculator_csv_exported` (`{ mode }`). Add sparingly — intent moments only.

Never send ops logs to PostHog; never do product analytics via Cloud Logging.

**On the public key**: PostHog project API keys (`phc_…`) are write-only
ingest keys designed to ship in client bundles (like a GA measurement ID).
Private keys (`phx_…`) can read/administer and only ever live in Secret
Manager, backend-side. A reverse proxy does not hide anything — ingestion is
untrusted-client by nature.

**Config & secrets convention (established now, inherited by the BE):**
- FE: config in the **committed `.env`** (`VITE_` prefix = inlined into the
  public bundle, therefore PUBLIC values only). No hardcoded keys in source.
- BE (Phase 2): config via Cloud Run env vars; anything sensitive via
  **Secret Manager references** — never committed, never `VITE_`-prefixed,
  never baked into the Docker image.

## Cost Guardrails (the $0 contract)

Free tier confirmed (account-wide, per month): 2M requests, 180k vCPU-s,
360k GiB-s, ~1GB NA egress — computed at Tier-1 region rates (us-west1 ✓).
Portfolio traffic sits ~two orders of magnitude inside this.

The four ways this accidentally costs money — all avoided by decision:
1. `min-instances ≥ 1` (~$3–8/mo) — don't, unless a project buys it deliberately.
2. A Global Load Balancer (~$18/mo) — never; use `run.app` URL, later free
   domain mapping for `api.ryanbarclay.ca`.
3. Artifact Registry image pileup past 0.5GB — add a cleanup policy on day one.
4. Session replay egress through a future proxy — replay is fine in DIRECT
   mode (current setup), but must be revisited before any proxy adoption:
   replay payloads are MBs/session and would eat the ~1GB free egress.

## Roadmap (all additive; none require rework)

1. PostHog reverse proxy (`api_host` flip) + `api.ryanbarclay.ca` domain
   mapping — adopt only if FE data looks blocker-thinned. ~50 stateless
   lines. **Re-do the replay egress math at this point.**
2. Server-side product events (contact form etc.).
3. Feature flags with local evaluation — first private key → Secret Manager.
4. Service split: `ingest` (stateless, never changes) vs `api` (changes often)
   — when API deploys become frequent.
5. Firestore when a project needs state.
6. `min-instances=1` on a specific service if a project needs consistent
   latency — a purchase, not a re-architecture.

## Out of Scope (v1)

Database, auth, staging env, preview deploys, Turbo remote caching (GH Actions
cache suffices), session replay, PostHog proxy, custom domain.

## GCP State (set up July 2026 — all verified via gcloud read-backs)

- Project `portfolio-491515` (number 904728242302), billing-linked, budget
  tripwire $1 CAD/mo with alerts at 50/90/100/150%.
- APIs: run, artifactregistry, iamcredentials, billingbudgets.
- Artifact Registry `backend` @ us-west1 with cleanup policy keep-latest-3 /
  delete-older-than-30d.
- Service accounts: `backend-runtime` (ZERO roles by design — the service
  needs no GCP powers) and `github-deployer` (run.admin +
  artifactregistry.writer + serviceAccountUser on backend-runtime only).
- WIF: pool `github`, provider `github-oidc`, attribute condition locked to
  repo `RyanBarclay/RyanBarclay.github.io`. NO service-account keys exist and
  none may ever be created (`keys create` is forbidden).
- Deploy workflow: `.github/workflows/deploy-backend.yml` — WIF auth, docker
  build from repo root, push, `gcloud run deploy` with min-instances=0,
  **max-instances=2 (the cost ceiling)**, cpu-boost, 512Mi, runtime SA.

## Deployed State (July 2026)

- **Live**: `https://backend-6q35zrinhq-uw.a.run.app` — /health verified in
  ~400ms including cold start; CORS confirmed for https://ryanbarclay.ca.
  First CI deploy succeeded on the first run (WIF auth green).
- **FE wiring**: `VITE_API_URL` in committed `.env.development`
  (localhost:8080) / `.env.production` (run.app URL); warm-up ping
  (`warmUpBackend()` in `src/config/api.ts`, production-only, fires on app
  mount) + `<link rel="preconnect">` injected via Vite env in index.html.

## Open Items

- Backend's first real endpoint — deferred until a project needs one
  (contact form was considered and rejected).
