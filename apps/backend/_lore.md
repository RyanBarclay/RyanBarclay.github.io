# Backend Layer

## Purpose
The Cloud Run service (Hono on Node). v1 is deliberately minimal — `/health`
only — because its job is to prove the pipeline (monorepo → bundle → Docker →
Cloud Run → FE wiring). Real endpoints arrive when projects need them. The
architecture contract lives in `docs/backend-plan.md`; don't deviate from it
without re-litigating with Ryan.

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
  ping (cold-start strategy). Don't rename or slow it down.
- **CORS is not auth**: the API is public; the allowlist just stops arbitrary
  sites embedding calls. Anything genuinely sensitive needs real auth (none
  exists yet, by design).
- **No secrets in this app yet.** When the first one arrives it comes in as a
  Cloud Run env var backed by Secret Manager — never committed, never in the
  image (see the config convention in docs/backend-plan.md).

## What Belongs Here
Service code only. Deployment identity (WIF, service accounts), Artifact
Registry, and Cloud Run config are Phase-2 GCP setup — scripted at the repo
level, documented in docs/backend-plan.md.
