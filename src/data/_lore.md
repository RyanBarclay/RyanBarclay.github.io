# data/ Layer

## Purpose
This layer is the application's content database — static TypeScript files that hold all structured content displayed in the portfolio. It owns the list of projects (`projects.ts`) and the full resume content (`resume.ts`). Components read from this layer; they never write to it. Updating portfolio content means editing these files, not touching component code.

## Files in this Layer
- `projects.ts` — Exports `projectsData` (the full ordered array of `ProjectData` records), plus helper functions `getFeaturedProjects()` and `getProjectById()`.
- `resume.ts` — Defines and exports `resumeData` (typed as `ResumeData`) along with all the interfaces that describe its shape: `ResumeExperience`, `ResumeRole`, `ResumeSkillCategory`, `ResumeLeadership`, `ResumeEducation`.

## Key Patterns & Contracts

- **`id` is the system's primary key for projects**: The `id` string in each `projectsData` entry must match the key in `src/config/projectRoutes.tsx` and the directory name under `src/pages/projects/<id>/`. If these three diverge, routing silently breaks. There is no runtime check — the join is purely by convention.
- **`featured` flag controls home page visibility**: `getFeaturedProjects()` filters on this boolean. Setting `featured: false` (or omitting it) hides the project from the home grid while keeping its detail page accessible via direct URL.
- **Array order is display order**: Projects render in the order they appear in `projectsData`. Reordering the array changes the card grid order on the Projects page and the home page featured section.
- **`sections` array drives rich project detail content**: Each `ProjectSection` (title + content) is rendered as an expandable or inline block on the project detail page. Not all projects have sections — older/simpler projects omit this field.
- **`resume.ts` owns its own interfaces**: Unlike projects (which use the shared `src/types/project.ts`), resume interfaces are co-located in `resume.ts` itself. This is because the resume shape is consumed only by the Resume page and has no cross-cutting use. There is no need to move these interfaces to `src/types/` unless another consumer emerges.
- **No external data fetching**: All content is hard-coded TypeScript. There is no API, no CMS, no `fetch` call. This is intentional — the site is a static GitHub Pages deployment with no backend. Adding content means editing source files and redeploying.
- **Unsplash images via URL**: Project card images are Unsplash URLs, not local assets. Hero images (`heroImage`) are local paths under `/assets/images/`. This split is intentional: local hero images allow custom photography; card thumbnails use Unsplash to avoid storing large images in the repo.

## What Belongs Here
Static content arrays and their TypeScript interfaces when that interface is only used within this layer. Data that is fetched at runtime, user-generated, or owned by a specific project feature does not belong here.
