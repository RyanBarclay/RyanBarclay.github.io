# config/ Layer

## Purpose
This layer owns all static routing configuration and application-wide constants. It is the single source of truth for which top-level pages exist, which project IDs map to which lazy-loaded components, and what shared magic values (hero images, gradients, layout dimensions, simulation defaults) look like. Components read from this layer; they do not define these values themselves.

## Files in this Layer
- `routes.tsx` — Defines the top-level nav route map (`ComponentLinkInfo`) keyed by display name; each entry holds a `label`, MUI icon, path `to`, and rendered `component`. Also exports `findPathToKey` for reverse-lookup by path.
- `projectRoutes.tsx` — Maps project ID strings to `React.lazy()`-wrapped page components; exports `generateProjectRoutes()` which produces route objects consumable by React Router.
- `constants.ts` — Exports hero image URLs, gradient strings, `HERO_VARIANTS` presets, layout dimensions (`NAVBAR_HEIGHT`), glassmorphism tokens, and the N-Body simulation's default numeric bounds.

## Key Patterns & Contracts

- **Two-level routing split**: Top-level pages (Home, Projects, About, Resume) are in `routes.tsx`. Per-project sub-pages are in `projectRoutes.tsx`. `MainContent.tsx` consumes both to build the full `<Routes>` tree.
- **Lazy loading is mandatory for project pages**: Every entry in `projectRouteComponents` uses `React.lazy()`. This keeps the initial bundle small — heavy projects like the terrain generator (React Three Fiber, Three.js) are not loaded until the user navigates to them.
- **Project IDs are the join key**: The string key in `projectRouteComponents` must exactly match the `id` field in `src/data/projects.ts`. If they diverge, the route renders but the project detail page receives no data. There is no runtime enforcement of this — it is a convention constraint.
- **`constants.ts` is the home for magic values**: Any value used across more than one component (image URL, gradient string, pixel dimension) belongs here, not inlined. This prevents drift where two components reference slightly different gradient strings.
- **`HERO_VARIANTS` as const**: The `as const` assertion combined with `HeroVariant = keyof typeof HERO_VARIANTS` gives the `Hero` component a typed union of valid variant names, catching typos at compile time.
- **`DEFAULT_SIMULATION_BOUNDS` is specific to N-Body**: This is an intentional grouping in constants rather than inside the simulation directory because the bounds may be needed in tests or other tooling outside the page itself.

## What Belongs Here
Route definitions, component-to-path mappings, lazy import declarations, and app-wide constants that multiple layers share. No component JSX beyond route element declarations, no business logic.
