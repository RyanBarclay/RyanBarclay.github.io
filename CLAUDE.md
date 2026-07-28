# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm install       # Install all workspace packages
pnpm dev           # Dev servers via Turborepo (frontend on http://localhost:5173)
pnpm build         # Build all packages (Turbo-cached)
pnpm tsc           # Type-check all packages (no emit)
pnpm test          # Run unit tests (Vitest)
pnpm preview       # Preview frontend production build locally
pnpm run deploy    # Build frontend + deploy to GitHub Pages (must be "run" — pnpm has a builtin "deploy")
```

Run a single package's task with `npx turbo run build --filter=frontend` (or `pnpm --filter frontend dev`).

Tests are Vitest, colocated as `*.test.ts` next to the code they cover (currently the investment-calculator financial math). TypeScript (`pnpm tsc`) remains the correctness check for everything untested.

## Monorepo Layout

pnpm workspaces + Turborepo (task runner/cache). See `docs/backend-plan.md` for the full architecture plan and locked decisions.

- `apps/frontend/` — the portfolio site (all `src/` paths in this file live under it)
- `packages/shared-types/` — DTOs/Zod schemas shared FE↔BE (consumed as TS source, no build step)
- `packages/config/` — shared tsconfig base (`@repo/config/tsconfig.base.json`)
- `apps/backend/` — Cloud Run service (Phase 2, not yet created)

pnpm is strict by design: a package may only import what its own `package.json` declares (no phantom dependencies). Internal packages are wired with `workspace:*`.

## Architecture Overview

This is a React 19 + TypeScript portfolio site deployed to GitHub Pages. Built with Vite, MUI v7, and React Router v6 using **HashRouter** (required for GitHub Pages compatibility).

### Routing

Two-level route config:
- `src/config/routes.tsx` — top-level nav routes (Home, Projects, About)
- `src/config/projectRoutes.tsx` — maps project IDs to page components under `/projects/:id`

`src/components/layout/MainContent.tsx` consumes both configs to render routes.

### Adding a New Project

1. Add an entry to `projectsData` in `src/data/projects.ts` with a unique `id`
2. Create the project page under `src/pages/projects/<id>/`
3. Register it in `src/config/projectRoutes.tsx` (maps `id` → component)

Project metadata (title, description, tags, links, `featured` flag) lives entirely in `projects.ts`. The `featured` flag controls visibility on the home page grid.

### Theme / Styling

- MUI theme defined in `src/theme/theme.tsx` with `darkTheme` / `lightTheme` variants
- Theme toggled via `ThemeContext` (`src/contexts/DarkModeContext.tsx`)
- `AppProvider` (`src/contexts/AppProvider.tsx`) wraps all contexts

### Terrain Generator Project (`src/pages/projects/terrain-generator/`)

The most complex project — a WebGL 3D terrain renderer using React Three Fiber. Key data flow:

1. `TerrainContext.tsx` holds all config state and exposes `generateTerrain()`
2. `useTerrainGen.ts` runs noise → heightmap → geometry pipeline on demand
3. `useLODSystem.ts` manages quadtree spatial partitioning for distance-based LOD
4. `TerrainCanvas.tsx` sets up the R3F `<Canvas>` with `TerrainMesh` and `WaterPlane`

**Important**: Terrain only regenerates when the user clicks "Generate Terrain" — size changes are not live because 512×512 vertex recalculation is expensive.

When adding a new control parameter: add to `TerrainConfig` in `types.ts` → initialize in `TerrainContext.tsx` → wire up in `useTerrainGen.ts` → add control component → import in `ControlPanel.tsx`.

### Analytics

PostHog (`posthog-js`), initialized in `src/config/analytics.ts`, configured via the **committed `.env`** (`VITE_POSTHOG_*`). Convention: `VITE_`-prefixed values are inlined into the public bundle — only ever public values in `.env` (the PostHog key is a public write-only ingest key); secrets never go there (backend secrets → GCP Secret Manager per `docs/backend-plan.md`). A missing key = analytics no-ops entirely. Analytics is production-build-gated (`import.meta.env.PROD`): `npm run dev` never sends events; `npm run preview` does (deliberate end-to-end verification). Products in use: Web Analytics, Product Analytics, Session Replay (`maskAllInputs` pinned — never unmask, the calculator holds personal finances), and Error Tracking. SPA pageviews are captured manually per HashRouter route change via `AnalyticsPageviews` in `App.tsx`; named intent events go through `captureEvent` (`resume_downloaded`, `calculator_csv_exported`). Tracking topology and the backend/monorepo roadmap live in `docs/backend-plan.md`.

### Deployment

The site deploys to `RyanBarclay.github.io` via `pnpm run deploy` from the repo root (the `run` is required — pnpm has a built-in `deploy` command that shadows the script) (builds via Turbo, copies `apps/frontend/CNAME` into `apps/frontend/dist/`, then `gh-pages` pushes that dist to the `gh-pages` branch to preserve the custom domain).
