# Projects Layer

## Purpose
This directory serves a dual role: `index.tsx` is the `/projects` list page that renders every project as a card, and the subdirectories beneath it each contain a self-contained project page mounted at `/projects/:id`. The list page is a pure view over `projectsData` from `src/data/projects.ts` — it never filters, sorts, or enriches data itself. All project metadata (title, description, image, technologies, `featured` flag, `detailPage` route) lives exclusively in `src/data/projects.ts`.

## Files in this Layer
- `index.tsx` — The `/projects` route: iterates `projectsData` and renders a responsive `ProjectCard` grid showing all projects regardless of `featured` status.

## Key Patterns & Contracts
- **Single source of truth**: `src/data/projects.ts` is the authoritative registry for all projects. Adding a project to `projectsData` is step 1; creating a subdirectory here is step 2; registering in `src/config/projectRoutes.tsx` is step 3. Skipping step 3 means the card links to a 404.
- **`featured` flag split**: `index.tsx` uses `projectsData` (all projects). `Home.tsx` uses `getFeaturedProjects()` (filtered to `featured: true`). The same `ProjectCard` component is used in both places — the flag only controls which page shows the card, not how the card renders.
- **`detailPage` is the routing contract**: Each entry in `projectsData` has a `detailPage` string like `"/projects/terrain-generator"`. `ProjectCard` navigates to this path via `useNavigation`. For projects without a live demo page, `detailPage` may still link to an external GitHub URL — check the entry before assuming it maps to a subdirectory here.
- **No state or data fetching**: `index.tsx` is a static render. It reads an in-memory array; there is no API call, loader, or suspense boundary.
- **Subdirectory contract**: Each project subdirectory is independent — it owns its own components, hooks, context, and types. Nothing inside a project subdirectory is imported by any file outside that subdirectory (except by `projectRoutes.tsx` which imports the page root component).

## What Belongs Here
The projects list page (`index.tsx`) and self-contained project page subdirectories, each isolated from one another with no cross-project imports.
