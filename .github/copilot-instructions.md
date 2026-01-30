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
4. **If creating a project detail page**, add route manually to [MainContent.tsx](src/components/layout/MainContent.tsx) nested routes section
5. Navigation automatically updates in Navbar - no manual changes needed

**Note**: Top-level routes (Home, Projects, About, Contact) are automatically rendered from `componentLinkInfo`. Project detail pages (e.g., `/projects/randomizer`) must be added to the nested routes in MainContent.tsx.

### Project Data Architecture

**Single Source of Truth**: [src/data/projects.ts](src/data/projects.ts) contains all project information in the `projectsData` array.

```tsx
// Import centralized project data
import {
  projectsData,
  getFeaturedProjects,
  getProjectById,
} from "../data/projects";

// Use helper functions
const featured = getFeaturedProjects(); // Returns 3 featured projects
const project = getProjectById("battlesnake"); // Returns specific project with all metadata
```

**Project Data Structure**: Each project includes:

- Basic info: `id`, `title`, `tag`, `tags`, `description`
- Assets: `image`, `heroImage`, `heroGradient`
- Navigation: `detailPage`, `links` (github, live)
- Content: `sections`, `technologies`
- Metadata: `featured`, `year`

**Project Routes**: Automatically generated from `projectsData` via [src/config/projectRoutes.tsx](src/config/projectRoutes.tsx). To add a new project route:

1. Create the component in `src/pages/projects/{project-name}/`
2. Add entry to `projectRouteComponents` in [projectRoutes.tsx](src/config/projectRoutes.tsx)
3. Add project data to [projects.ts](src/data/projects.ts)
4. Routes are auto-generated - no manual route configuration needed!

**Project Detail Pages**: Use the shared `ProjectDetailLayout` component ([src/components/layout/ProjectDetailLayout.tsx](src/components/layout/ProjectDetailLayout.tsx)) and pull data from centralized source:

```tsx
import ProjectDetailLayout from "../../../components/layout/ProjectDetailLayout";
import { getProjectById } from "../../../data/projects";

const MyProject = () => {
  const projectData = getProjectById("my-project-id");

  const sections = [
    {
      title: "Overview",
      content: <Typography paragraph>Project description...</Typography>,
    },
    // ... more sections
  ];

  if (!projectData) return null;

  return (
    <ProjectDetailLayout
      title={projectData.title}
      tags={projectData.tags}
      sections={sections}
      technologies={projectData.technologies}
      heroImage={projectData.heroImage} // Optional: uses default if not provided
      heroGradient={projectData.heroGradient} // Optional: uses default if not provided
      additionalContent={<OptionalCustomComponent />} // For special cases like NBodySimulation
    />
  );
};
```

**Navigation Hook**: Use [src/hooks/useNavigation.ts](src/hooks/useNavigation.ts) for consistent internal/external link handling:

```tsx
import { useNavigation } from "../../../hooks/useNavigation";

const MyComponent = () => {
  const handleLinkClick = useNavigation();

  return <Button onClick={() => handleLinkClick("/about")}>About</Button>;
};
```

### Layout Architecture

- **Navbar** ([Navbar.tsx](src/components/layout/Navbar.tsx)): Horizontal navigation bar at top with:
  - Transparent frosted glass effect when at page top
  - Solid background with rounded pill edges when scrolled
  - Responsive mobile drawer (SwipeableDrawer) on smaller screens
  - MUI `useScrollTrigger` for scroll detection
- **MainContent** ([MainContent.tsx](src/components/layout/MainContent.tsx)): Full-width content area that renders routes
- **Hero** ([Hero.tsx](src/components/ui/Hero.tsx)): Full-viewport hero section with video background and parallax scroll effect
- **PageHero** ([PageHero.tsx](src/components/ui/PageHero.tsx)): Reusable hero banner with optional background image and gradient overlay
- **ProjectDetailLayout** ([ProjectDetailLayout.tsx](src/components/layout/ProjectDetailLayout.tsx)): Shared layout for all project detail pages, renders PageHero, title, tags, sections, and technologies

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
│   ├── layout/       # Layout components (Navbar, MainContent, ProjectDetailLayout)
│   └── ui/          # Generic UI components (ThemeButton, Hero, PageHero)
├── config/          # Configuration files
│   ├── routes.tsx   # Top-level navigation/routing configuration
│   ├── projectRoutes.tsx  # Auto-generated project routes
│   └── constants.ts # Centralized constants (hero images, gradients, variants)
├── data/            # Centralized data files
│   └── projects.ts  # Single source of truth for all project data
├── hooks/           # Custom React hooks
│   └── useNavigation.ts  # Reusable navigation hook
├── pages/           # Route-based pages (follows Next.js convention)
│   ├── Home.tsx
│   ├── About.tsx
│   ├── Contact.tsx
│   └── projects/    # Project pages with self-contained features
│       ├── index.tsx (Projects overview)
│       ├── battlesnake/
│       ├── nbody-simulation/
│       ├── randomizer/
│       └── ...other project folders
├── contexts/        # React Context providers
├── theme/          # MUI theme configuration
└── types/          # TypeScript type definitions
    └── project.ts  # Project-related interfaces
```

### Directory Guidelines

- **`config/`**: Configuration and constants - single source of truth for navigation, routes, and shared values
  - `routes.tsx` - Top-level navigation routes
  - `projectRoutes.tsx` - Auto-generated project routes
  - `constants.ts` - Hero images, gradients, and PageHero variants
- **`data/`**: Centralized data files - single source of truth for content
- **`hooks/`**: Custom React hooks for reusable logic
- **`pages/`**: One folder/file per route. Co-locate related features together.
- **`components/`**: Only truly reusable UI components. Avoid over-abstracting.
- **`components/layout/`**: App-wide layout components (Navbar, MainContent, ProjectDetailLayout).
- **`components/ui/`**: Generic, reusable UI elements (buttons, inputs, Hero, PageHero, etc.).
- **`types/`**: Shared TypeScript interfaces and types

### Naming Conventions

- Use semantic names: `Navbar` (not `TopBar`), `MainContent` (not `Content`), `Hero` (descriptive)
- Lowercase folder names: `components/`, `pages/`, `config/`, `data/`, `hooks/`, `types/`
- PascalCase for component files: `ThemeButton.tsx`, `Navbar.tsx`
- camelCase for hook files: `useNavigation.ts`

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
- Custom font: BC Sans from BC Government fonts CDN

### Styling Pattern

Use MUI's `sx` prop for component-specific styles. Avoid external CSS files except [index.css](src/index.css) for global resets and [fonts.css](src/theme/fonts.css) for custom font imports.

### Known TODOs in Theme

The codebase has several documented improvements in [theme.tsx](src/theme/theme.tsx) and [Navbar.tsx](src/components/layout/Navbar.tsx):

- Consider using `styled()` API instead of large inline `sx` props
- Move hardcoded rgba values to theme.palette with alpha() helper
- Use responsive typography with theme.breakpoints
- Use semantic Typography components instead of Box for text

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
- **Project detail pages not found**: Add route manually to nested routes in [MainContent.tsx](src/components/layout/MainContent.tsx)
- **Theme not applying**: Verify component is inside ThemeProvider tree (wrapped by AppProvider)
- **Build fails**: Run `npm run tsc` first to catch TypeScript errors before `vite build`
- **Import errors after refactoring**: Always run `npm run tsc` to catch broken imports early
- **CNAME missing after deploy**: Ensure `CNAME` file exists in root - deploy script copies it to `dist/`

## Development Tools

### MCP (Model Context Protocol) Integration

The project uses MCP servers for enhanced AI development:

- **chrome-devtools**: Chrome DevTools MCP server for browser automation and testing
  - Use for inspecting DOM, debugging, network analysis, and performance profiling
  - **WARNING**: Avoid taking excessive screenshots/images - it can crash the session
- **mui-mcp**: Material-UI documentation server for component reference
  - Leverage this for up-to-date MUI v7 component API documentation
  - Use when implementing or debugging MUI components

Configuration: [../.vscode/mcp.json](../.vscode/mcp.json)

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
