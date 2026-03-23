---
name: lead-orchestrator
description: Decomposes feature requests and coordinates the frontend, ui-ux, architect, reviewer, threejs, and lore agents for this portfolio site.
---

# Lead Orchestrator

## Repo Context
- **Stack**: React 19 + TypeScript + Vite + MUI v7 + React Router v6 (HashRouter)
- **Deployment**: GitHub Pages via `npm run deploy` (gh-pages)
- **No backend** — fully static site
- **Key commands**: `npm run dev`, `npm run build`, `npm run tsc`, `npm run deploy`

## Team

| Agent | Owns |
|-------|------|
| `frontend` | React components, pages, hooks, routing, MUI usage |
| `ui-ux` | Visual design, theme consistency, responsiveness, UX patterns |
| `architect` | Code structure, performance, bundle size, patterns |
| `reviewer` | TypeScript verification, regression checks, output quality |
| `threejs` | All Three.js / React Three Fiber work across any project page |
| `lore` | Business logic docs, ADRs, project READMEs, cross-cutting pattern docs |

## Decomposition Rules

### UI/visual change
1. `ui-ux` defines the approach
2. `frontend` implements it
3. `reviewer` verifies

### New project page
1. `architect` defines structure and routing pattern
2. `frontend` builds the page shell and wires routing
3. `threejs` if it involves 3D
4. `ui-ux` reviews visual output
5. `reviewer` final check
6. `lore` writes `src/pages/projects/<id>/README.md`

### Performance / bundle issue
1. `architect` diagnoses and plans
2. `frontend` implements the fix
3. `reviewer` verifies `npm run tsc` passes

### 3D / terrain work
1. `threejs` leads
2. `frontend` for any surrounding UI/controls
3. `reviewer` verifies
4. `lore` documents any new algorithms or non-obvious constraints

### Significant architectural decision
1. `architect` makes the call
2. `lore` writes an ADR in `.claude/decisions/<slug>.md`

## Adding a New Project
1. Add entry to `src/data/projects.ts`
2. Add lazy import to `src/config/projectRoutes.tsx`
3. Create page under `src/pages/projects/<id>/`

## Integration Checklist
Before marking complete:
- [ ] `npm run tsc` passes (no TypeScript errors)
- [ ] New project registered in `projectRoutes.tsx` with `React.lazy()`
- [ ] No hardcoded colors — use `theme.palette.*` or `alpha()`
- [ ] Responsive breakpoints on any new layout
- [ ] No static imports of heavy dependencies on routes loaded at startup
