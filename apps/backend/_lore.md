# Backend Layer

## Purpose
The Cloud Run service (Hono on Node). v1 is deliberately minimal — `/health`
only — because its job is to prove the pipeline (monorepo → bundle → Docker →
Cloud Run → FE wiring). Real endpoints arrive when projects need them. This
file is the architecture contract; decisions here were made deliberately —
re-litigate with Ryan before deviating.

## Files in this Layer
- `src/index.ts` — entry: `@hono/node-server` on `PORT` (Cloud Run injects it;
  8080 local convention).
- `src/app.ts` — the Hono app, exported separately so tests hit `app.request()`
  with no server. CORS allowlist (production domain + localhost dev/preview),
  `/health`, JSON 404, and an error handler that logs stack traces at ERROR
  severity (Cloud Error Reporting picks those up automatically).
- `src/logger.ts` — structured JSON logging: one object per line with a
  `severity` field, which Cloud Logging parses natively. Never `console.log`
  raw strings in this app; always the logger.
- `src/app.test.ts` — Vitest against `app.request()`: health (validated
  against the shared schema), 404, CORS allow + deny.
- `tsup.config.ts` — bundles the service AND all dependencies (`noExternal`)
  into ONE minified file (~350KB). The runtime image ships no node_modules —
  this is the cold-start strategy, not an aesthetic choice.
- `Dockerfile` — two stages: pnpm workspace build → distroless nodejs22
  (nonroot) with just the bundle. Works from the repo root or a
  `turbo prune backend --docker` context.

## Key Patterns & Contracts
- **Responses conform to `@repo/shared-types` by construction**: handlers
  parse their responses through the shared Zod schema (see `/health` with
  `healthResponseSchema`). Every future endpoint follows this pattern — the
  schema goes in `packages/shared-types` first, then both sides consume it.
- **`/health` is load-bearing**: it's the target of the frontend's warm-up
  ping (`apps/frontend/src/config/api.ts`, production-only, fires on app
  mount, plus a `preconnect` in index.html). Don't rename or slow it down.
- **CORS is not auth**: the API is public; the allowlist just stops arbitrary
  sites embedding calls. Anything genuinely sensitive needs real auth (none
  exists yet, by design).
- **Config & secrets convention**: FE config lives in committed `.env` files
  (`VITE_` prefix = inlined into the public bundle → PUBLIC values only). BE
  config comes via Cloud Run env vars; anything sensitive via **Secret
  Manager references** — never committed, never in the image. No secrets
  exist yet.

## Infrastructure Reference (GCP — set up & verified July 2026)

- **Live service**: `https://backend-6q35zrinhq-uw.a.run.app` (us-west1).
  URL is stable for the service's lifetime; the FE bakes it in via
  `apps/frontend/.env.production` (`VITE_API_URL`) — one line to change if it
  ever moves (or when `api.ryanbarclay.ca` domain mapping is added, which is
  free).
- **Project** `portfolio-491515` (number `904728242302`), billing-linked,
  **$1 CAD/month budget tripwire** (alerts at 50/90/100/150%). Kill switch:
  delete the project or detach billing → $0 instantly.
- **Artifact Registry** `backend` @ us-west1, cleanup policy keep-latest-3 /
  delete-older-than-30d (storage can't creep past the free 0.5GB).
- **Identities**: `backend-runtime` SA (**zero roles by design**);
  `github-deployer` SA (run.admin + artifactregistry.writer +
  serviceAccountUser on backend-runtime only).
- **Keyless deploys (WIF)**: pool `github`, provider `github-oidc`, locked to
  repo `RyanBarclay/RyanBarclay.github.io`. **No service-account keys exist
  and none may ever be created** (`gcloud iam service-accounts keys create`
  is forbidden).
- **Deploys are manual and deliberate**: `pnpm run deploy:backend` dispatches
  `.github/workflows/deploy-backend.yml` and watches it to green; it refuses
  unless local HEAD == origin/master (CI deploys from origin). `pnpm run
  deploy` = backend (waited) then frontend, so new endpoints are live before
  the site that calls them. Merging to master never auto-ships.
- **Load-bearing Cloud Run flags**: `--min-instances=0` (the $0 posture — one
  idle instance ≈ 4× the free compute grant), `--max-instances=2` (**the cost
  ceiling**), `--cpu-boost` (faster cold starts, free). Measured cold start:
  ~400ms end-to-end.
- **Free-tier watch**: Billing → Reports → filter Cloud Run → group by SKU
  (Usage vs 2M requests / 180k vCPU-s / 360k GiB-s / ~1GB egress per month;
  cost shows $0.00 while inside the tier).
- **Observability split**: PostHog for humans (FE-direct), Cloud Logging +
  Error Reporting for the machine. Never ops logs into PostHog; never product
  analytics via Cloud Logging.

## Roadmap Triggers (additive; none require rework)
1. PostHog reverse proxy + `api.ryanbarclay.ca` — only if FE analytics look
   ad-blocker-thinned; re-do session-replay egress math at that point
   (replay is fine FE-direct; proxied replay eats the ~1GB free egress).
2. Server-side product events — when a real endpoint has user behavior.
3. Feature flags (local evaluation) — first private key → Secret Manager.
4. Service split (`ingest` vs `api`) — when API deploys become frequent.
5. Firestore — when a project needs state.
6. `min-instances=1` — a latency purchase (~$3–8/mo), not a re-architecture.

## What Belongs Here
Service code only. Deployment identity (WIF, service accounts), Artifact
Registry, and Cloud Run config live in GCP as described above; the deploy
pipeline is `.github/workflows/deploy-backend.yml` + `scripts/deploy-backend.sh`.
