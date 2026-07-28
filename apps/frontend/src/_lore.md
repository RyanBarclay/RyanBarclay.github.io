# src/ Layer

## Purpose
The root source directory is the application entry point and shell. It owns the two files that bootstrap the React tree (`main.tsx`, `App.tsx`), the single global stylesheet (`index.css`), and the Vite environment type declaration. Nothing domain-specific lives here — this layer only wires together the context tree, the router, and the top-level layout components.

## Files in this Layer
- `main.tsx` — DOM mount point; wraps the app in `React.StrictMode` and `AppProvider` before rendering `App`
- `App.tsx` — Declares `HashRouter`, reads theme from `ThemeContext`, applies MUI `ThemeProvider`, and renders the two persistent layout components (`Navbar`, `MainContent`)
- `index.css` — Global CSS: smooth scroll behavior and print-media overrides (hides nav, forces white background, prevents section page-breaks)
- `vite-env.d.ts` — Single-line triple-slash reference that gives TypeScript visibility into Vite's `import.meta.env` types

## Key Patterns & Contracts

- **Mount order matters**: `AppProvider` (all React contexts) wraps `App`, and `App` wraps `HashRouter`. The MUI `ThemeProvider` lives inside `App` because it needs to read from `ThemeContext`, which is provided by `AppProvider`. This means the context tree is always: `AppProvider > App > HashRouter > ThemeProvider > layout`.
- **HashRouter is non-negotiable**: GitHub Pages serves static files without server-side routing. `HashRouter` uses the URL hash (`/#/path`) so all navigation works without a 404 fallback. Switching to `BrowserRouter` would break deployed routing. See `.claude/decisions/` for the ADR if one exists.
- **`index.css` is intentionally minimal**: All component-level styling goes through MUI's `sx` prop or theme overrides. The global stylesheet only handles things MUI cannot: `html` scroll behavior and print media queries.
- **Print styles are for the Resume page**: The `.resume-download-btn`, `.resume-section`, and `.resume-page-hero` selectors exist specifically to make the `/resume` route printable as a clean document.

## What Belongs Here
Only application bootstrap code — entry point, root component shell, and truly global CSS resets. No page logic, no data, no domain types.
