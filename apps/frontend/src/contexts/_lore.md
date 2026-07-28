# contexts/ Layer

## Purpose
This layer owns the global React context providers that supply cross-cutting state to the entire component tree. Currently two concerns are managed here: theme mode (dark/light) and current navigation route tracking. All providers are composed in `AppProvider`, which is the single import that `main.tsx` needs to wrap the app with all global state.

## Files in this Layer
- `AppProvider.tsx` — Composes all context providers into one wrapper; the only file `main.tsx` imports from this layer.
- `DarkModeContext.tsx` — Provides `ThemeContext` with `isDarkTheme: boolean` and `toggleTheme()`; initializes from the OS `prefers-color-scheme` media query.
- `NavigationContext.tsx` — Provides `NavigationContext` with `currentRoute: string` and `setCurrentRoute(path)`; used by the Navbar to track active route for highlight state.

## Key Patterns & Contracts

- **`AppProvider` is the single composition point**: Adding a new context means creating a provider file and nesting it inside `AppProvider`. Nothing else should need to change in `main.tsx` or `App.tsx`.
- **Provider order in `AppProvider`**: `ThemeProvider` wraps `NavigationProvider`. This order matters if a provider ever needs to consume another context — the outer provider's context is available to the inner one, not vice versa. Currently neither depends on the other, so the order is conventional.
- **`ThemeContext` is consumed in `App.tsx`**: `App.tsx` reads `isDarkTheme` from `ThemeContext` to select between `darkTheme` and `lightTheme` from the theme layer. This is the only place where the context value is translated into an MUI theme object.
- **OS preference as initial state**: `DarkModeContext` seeds `isDarkTheme` from `useMediaQuery("(prefers-color-scheme: dark)")`. This runs once at mount — subsequent OS changes do not update the app state. The user's in-app toggle is the single source of truth after initial load.
- **No persistence**: Neither theme preference nor current route is persisted to `localStorage`. Refreshing the page resets theme to the OS preference. This is intentional simplicity — the portfolio does not need session continuity.
- **`NavigationContext` vs. React Router**: React Router already knows the active path. `NavigationContext` exists as a parallel signal because the Navbar needs to drive highlight state from a string it sets itself (e.g., before a navigation completes), not just from `useLocation`. If the Navbar is refactored to use `useLocation` directly, `NavigationContext` can be removed.

## What Belongs Here
Global state that multiple unrelated components need simultaneously (theme, auth state, locale, notifications). Do not put page-scoped or feature-scoped state here — that belongs inside the feature directory (e.g., `TerrainContext.tsx` lives inside the terrain-generator project folder).
