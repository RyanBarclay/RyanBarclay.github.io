# Pages Layer

## Purpose
This layer contains the top-level route pages of the portfolio: the screens a visitor lands on when navigating to Home, About, Contact, and Resume. Each file maps 1:1 to a route defined in `src/config/routes.tsx`. These pages are purely presentational — they compose shared UI components (`Hero`, `PageHero`, `ProjectCard`, `SectionHeader`, `FeatureIconBox`) and data helpers (`getFeaturedProjects`) into full-page layouts. No business logic, state management, or data fetching lives here.

## Files in this Layer
- `Home.tsx` — Landing page: renders the `Hero` banner, a featured projects grid driven by `getFeaturedProjects()`, and a social links CTA section.
- `About.tsx` — Personal profile page: headshot, bio text, skill domains, core values, and a "Beyond Code" lifestyle section with a CTA to Contact.
- `Contact.tsx` — Contact directory: renders four link cards (GitHub, LinkedIn, Email, Resume) built from an inline `ContactItem` array.
- `Resume.tsx` — Resume viewer (not read; assumed to be a static embed or download link page).

## Key Patterns & Contracts
- **Shared component composition**: All pages use `Hero` or `PageHero` as the first child for consistent banner treatment. Content body always wraps in MUI `Container` with `maxWidth` and `py` spacing.
- **Data sourcing**: `Home.tsx` is the only page in this layer that imports from a data file (`src/data/projects.ts` via `getFeaturedProjects()`). Other pages hardcode their content inline, which is intentional given the content is personal/static.
- **Navigation**: `Home.tsx` uses the `useNavigation` hook for the "View All Projects" button (required because HashRouter navigation needs the hook's `handleLinkClick` wrapper). External links use plain `<a href>` via MUI `component="a"` — they do not go through the router.
- **Theme dependency**: `About.tsx` references `theme.palette.social.github`, `theme.palette.social.linkedin`, and `theme.palette.gradient.hero` — custom palette keys defined in `src/theme/theme.tsx`. These will error if removed from the theme.
- **No per-page state**: None of these pages hold meaningful React state. `Contact.tsx` uses a local `contacts` array but it is a plain constant, not state.
- **What depends on this layer**: `src/components/layout/MainContent.tsx` renders these components as route targets. `src/config/routes.tsx` maps URL paths to them.

## What Belongs Here
Full-page route components that are top-level navigation destinations and own no shared logic — layout, copy, and composition only.
