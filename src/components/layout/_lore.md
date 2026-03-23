# Layout Layer

## Purpose
This layer owns the structural shell of the application: the persistent navigation bar, the top-level route renderer, per-page scroll management, and the reusable scaffold for project detail pages. Nothing in this layer holds feature state — it exists solely to mount, position, and route between pages correctly.

## Files in this Layer
- `MainContent.tsx` — consumes both route configs (`routes.tsx` and `projectRoutes.tsx`) and renders the top-level `<Routes>` tree inside a top-padding Box
- `Navbar.tsx` — fixed app bar with glass-morphism on scroll, splits into a top-bar + swipeable bottom drawer on mobile and a three-column grid layout on desktop
- `ProjectDetailLayout.tsx` — reusable scaffold for project detail pages: renders a `PageHero`, a title + tag row, an array of titled `<Paper>` sections, a technology stack chip list, and an optional extra content slot
- `ScrollToTop.tsx` — renderless component that calls `window.scrollTo(0, 0)` on every `pathname` change

## Key Patterns & Contracts

### Navbar height compensation
`NAVBAR_HEIGHT_WITH_PADDING` (80 px, from `src/config/constants.ts`) is the single source of truth for the space the fixed Navbar occupies. `MainContent.tsx` applies it as `pt` on its root Box so every route starts below the bar. `Hero.tsx` in the UI layer also references this constant to offset its own full-viewport section — any change to the constant must be reflected in both places.

### Route rendering in MainContent
Routes are driven entirely by two configs, never hardcoded:
1. `componentLinkInfo` from `src/config/routes.tsx` — top-level pages, rendered eagerly
2. `generateProjectRoutes()` from `src/config/projectRoutes.tsx` — project sub-pages, each wrapped in `React.Suspense` with a centered `CircularProgress` fallback (the components are lazy-loaded)

Adding a new top-level page: add to `routes.tsx`. Adding a new project page: add to `projectRoutes.tsx`. Neither requires touching `MainContent.tsx`.

### Navbar scroll trigger and glass morphism
`useScrollTrigger({ disableHysteresis: true, threshold: 50 })` drives two visual modes:
- **At top (trigger = false):** transparent background, a subtle `GLASS_BORDER` (`1px solid rgba(255,255,255,0.2)`), text forced to `common.white` so it reads against hero imagery
- **Scrolled (trigger = true):** `blur(20px) saturate(180%)` backdrop filter, `alpha(background.paper, 0.85)` fill, MUI elevation shadow, text switches to `text.primary`

On desktop the bar additionally animates `border-radius` to `24px` when scrolled, creating a pill shape. Mobile skips this and uses a flat top bar.

### Mobile vs desktop split
The breakpoint is `theme.breakpoints.down("md")` — below `md` the Navbar renders a completely different layout: a minimal top bar (branding + hamburger) and a `SwipeableDrawer` anchored to the bottom with 56 px of bleed visible at all times. Navigation items and the theme toggle live inside the drawer list. Desktop renders a three-column CSS grid toolbar: name left, nav links center, theme toggle right.

### ProjectDetailLayout contract
Callers pass a `sections` array of `{ title, content }` objects. Each section becomes a `<Paper>` block, so content is open-ended (`React.ReactNode`). The `technologies` array always renders last as a fixed "Technology Stack" section — callers cannot reorder it. The `additionalContent` slot appends below the stack section and is the escape hatch for interactive project canvases or other non-section content.

### ScrollToTop placement
Must be rendered inside `<Router>` but outside `<Routes>` so it fires on every navigation. It returns `null` — it has no visual output and no props. It does not distinguish between forward navigation and browser back/forward; all route changes trigger a scroll reset.

## What Belongs Here
Structural chrome that wraps every page (navigation, scroll management, top-level routing) and generic page-level scaffolding that is reused across multiple project pages — not feature logic, not data fetching, not project-specific UI.
