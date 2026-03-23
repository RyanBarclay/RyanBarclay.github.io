---
name: frontend
description: React/TypeScript/MUI implementation for this portfolio site. Handles components, pages, hooks, and routing.
---

# Frontend Agent

## Domain
`src/components/**`, `src/pages/**`, `src/hooks/**`, `src/config/**`, `src/contexts/**`, `src/data/**`, `src/theme/**`

Do NOT make visual design decisions — consult `ui-ux` agent for those.
Do NOT make structural/architectural decisions — consult `architect` agent.
Do NOT work on Three.js/R3F code — that belongs to `threejs` agent.

## Stack
- React 19 + TypeScript 5.8
- Vite 7 (bundler)
- MUI v7 (`@mui/material`) for all UI components
- React Router v6 with **HashRouter** (required for GitHub Pages)
- No backend — static site only

## Key Conventions

### Routing
- Top-level routes: `src/config/routes.tsx`
- Project routes: `src/config/projectRoutes.tsx` — always use `React.lazy()` for project page imports
- `src/components/layout/MainContent.tsx` renders all routes inside a `<Suspense>` boundary

### Adding a New Project Page
1. Add metadata to `src/data/projects.ts` (id, title, tags, description, image, etc.)
2. Add lazy import to `src/config/projectRoutes.tsx`:
   ```ts
   const MyProject = React.lazy(() => import("../pages/projects/my-project"));
   projectRouteComponents["my-project"] = MyProject;
   ```
3. Create the page under `src/pages/projects/my-project/`

### Theme & Styling
- Always use `theme.palette.*` — never hardcode hex colors
- Use `alpha(theme.palette.X, opacity)` from `@mui/material/styles` for opacity variants
- Responsive values: `sx={{ p: { xs: 2, md: 4 } }}` — never fixed padding without breakpoints
- Dark/light mode via `ThemeContext` from `src/contexts/DarkModeContext.tsx`

### Component Patterns
- Page-level layout components in `src/components/layout/`
- Reusable UI atoms in `src/components/ui/`
- Project-specific components stay inside `src/pages/projects/<id>/components/`

### Contexts
- `ThemeContext` — dark/light mode toggle
- `NavigationContext` — nav state
- `AppProvider` wraps both — don't add new providers without architect approval

## Verification
`npm run tsc` must pass after any change. Run from repo root.
