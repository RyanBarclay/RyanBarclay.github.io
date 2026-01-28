# Ryan Barclay Portfolio - AI Coding Agent Instructions

## Project Overview

Personal portfolio website built with React 19, TypeScript, Vite, and Material-UI v7. Deployed to GitHub Pages using HashRouter for client-side routing.

## Tech Stack

- **Build**: Vite with SWC for fast React compilation
- **UI**: Material-UI v7 with custom dark/light themes via MUI's theming system
- **3D Graphics**: React Three Fiber + Drei for interactive N-body physics simulation
- **Routing**: React Router v6 with HashRouter (required for GitHub Pages)
- **State**: React Context API (no Redux/Zustand)

## Architecture Pattern: Modern Horizontal Navigation System

### Core Navigation Data Structure

All routes and navigation items are defined in a **single source of truth**: [src/config/routes.tsx](src/config/routes.tsx)

The `ComponentLinkInfo` interface uses a **flat structure** (no nesting) for horizontal navigation:

```tsx
// Example structure from routes.tsx
export interface ComponentLinkInfo {
  [key: string]: {
    label: string;
    icon?: React.JSX.Element;
    to: string;
    component: React.JSX.Element;
  };
}

const componentLinkInfo: ComponentLinkInfo = {
  Home: { to: "/", label: "Home", icon: <HomeIcon />, component: <Home /> },
  Projects: {
    to: "/projects",
    label: "Projects",
    icon: <Build />,
    component: <Projects />,
  },
  // ... other top-level routes
};
```

**When adding new pages:**

1. Create component in `src/pages/` (top-level) or `src/pages/projects/` (project detail pages)
2. Add entry to `componentLinkInfo` in [routes.tsx](src/config/routes.tsx)
3. Import component at top of routes.tsx
4. Navigation automatically updates in Navbar - no manual changes needed

### Layout Architecture

- **Navbar** ([Navbar.tsx](src/components/layout/Navbar.tsx)): Horizontal navigation bar at top with:
  - Transparent frosted glass effect when at page top
  - Solid background with rounded pill edges when scrolled
  - Responsive mobile drawer (SwipeableDrawer) on smaller screens
  - MUI `useScrollTrigger` for scroll detection
- **MainContent** ([MainContent.tsx](src/components/layout/MainContent.tsx)): Full-width content area that renders routes
- **Hero** ([Hero.tsx](src/components/ui/Hero.tsx)): Full-viewport hero section with video background and parallax scroll effect

Navigation state is minimal - only tracks current route via React Router's `useLocation`.

## Context Providers

Two contexts wrap the app via [AppProvider.tsx](src/contexts/AppProvider.tsx):

1. **ThemeContext**: Dark/light mode toggle, initializes from system preference via `useMediaQuery`
2. **NavigationContext**: Simplified to track current route (legacy - may be removed)

## Component Organization

**This project follows standard React conventions with clear separation of concerns:**

```
src/
├── components/        # Reusable UI components
│   ├── layout/       # Layout components (Navbar, MainContent)
│   └── ui/          # Generic UI components (ThemeButton, Hero)
├── pages/           # Route-based pages (follows Next.js convention)
│   ├── Home.tsx
│   ├── About.tsx
│   ├── Contact.tsx
│   └── projects/    # Project pages with self-contained features
│       ├── index.tsx (Projects overview)
│       ├── NBodySimulation/
│       ├── Randomizer/
│       └── ...other project files
├── config/          # Configuration files
│   └── routes.tsx   # Navigation/routing configuration
├── contexts/        # React Context providers
└── theme/          # MUI theme configuration
```

### Directory Guidelines

- **`pages/`**: One folder/file per route. Co-locate related features together.
- **`components/`**: Only truly reusable UI components. Avoid over-abstracting.
- **`components/layout/`**: App-wide layout components (Navbar, MainContent).
- **`components/ui/`**: Generic, reusable UI elements (buttons, inputs, Hero, etc.).
- **`config/`**: Configuration and route definitions - single source of truth for navigation.

### Naming Conventions

- Use semantic names: `Navbar` (not `TopBar`), `MainContent` (not `Content`), `Hero` (descriptive)
- Lowercase folder names: `components/`, `pages/`, `config/`
- PascalCase for component files: `ThemeButton.tsx`, `Navbar.tsx`

## Key Developer Workflows

### Development

```bash
npm run dev          # Start dev server (Vite)
npm run build        # TypeScript check + production build
npm run preview      # Preview production build locally
```

### Deployment

```bash
npm run deploy       # Build + copy CNAME + deploy to gh-pages branch
```

**Important**: `CNAME` file is manually copied to `dist/` during deploy for custom domain support.

## Material-UI Customization

### Theme Configuration ([theme/theme.tsx](src/theme/theme.tsx))

- Custom color palettes for dark/light modes
- Reduced font size (12px base)
- Typography variant mapping: All headings map to `<h2>`, body text to `<span>` (accessibility override)

### Styling Pattern

Use MUI's `sx` prop for component-specific styles. Avoid external CSS files except [index.css](src/index.css) for global resets.

## Special Components

### N-Body Simulation ([pages/projects/NBodySimulation/](src/pages/projects/NBodySimulation/))

Uses React Three Fiber for WebGL-based gravitational physics. State management includes:

- Particle generation with configurable bounds
- Play/pause/reset controls
- File import/export for particle configurations
- Separate `simulationStep.ts` for physics calculations

### Randomizer ([pages/projects/Randomizer/](src/pages/projects/Randomizer/))

Multi-set randomization tool with:

- Context-based state ([RandomizerContext.tsx](src/pages/projects/Randomizer/RandomizerContext.tsx))
- File upload/download utilities ([fileUtils.ts](src/pages/projects/Randomizer/fileUtils.ts))
- Drag-and-drop via react-dropzone

## TypeScript Configuration

Strict mode enabled with:

- `target: ESNext`
- `jsx: react-jsx` (new JSX transform)
- No `allowJs` - TypeScript only
- Separate [tsconfig.node.json](tsconfig.node.json) for Vite config files

## Common Pitfalls

- **Routes not working**: Check HashRouter is used (not BrowserRouter) - required for GitHub Pages
- **Navigation not updating**: Ensure new pages are added to `componentLinkInfo` in [routes.tsx](src/config/routes.tsx)
- **Theme not applying**: Verify component is inside ThemeProvider tree (wrapped by AppProvider)
- **Build fails**: Run `npm run tsc` first to catch TypeScript errors before `vite build`
- **Import errors after refactoring**: Always run `npm run tsc` to catch broken imports early

## Project Structure Best Practices

This project follows modern React conventions (similar to Next.js/Remix):

1. **Pages vs Components**: If it renders on a route, it goes in `pages/`. If it's reusable UI, it goes in `components/`.
2. **Feature Co-location**: Related code lives together (e.g., `Randomizer/` contains component, context, utils, types).
3. **Flat Component Structure**: No Atomic Design (Atom/Molecule). Use semantic folders: `layout/`, `ui/`, `navigation/`.
4. **Single Source of Truth**: All routes defined in [routes.tsx](src/config/routes.tsx) - modify this file to add new pages.

When refactoring or restructuring, always verify with `npm run tsc` and `npm run build`.

---

## Maintaining These Instructions

**IMPORTANT**: After making architectural changes, refactoring, or discovering new patterns:

1. **Update this file** ([`.github/copilot-instructions.md`](.github/copilot-instructions.md)) to reflect the changes
2. Verify file paths and examples are still accurate
3. Document any new conventions or patterns discovered
4. Update the "Component Organization" section if directory structure changes
5. Add new pitfalls to "Common Pitfalls" if encountered during work

**This should be the LAST STEP** after completing any significant refactoring or architectural changes. These instructions serve as the authoritative guide for AI agents working on this codebase - keep them current!
