# hooks/ Layer

## Purpose
This layer owns shared React hooks — reusable stateful or side-effectful logic that is not tied to a specific page or feature. Currently it contains one hook: `useNavigation`, which provides a unified navigation function that transparently handles both internal SPA routes and external URLs. Feature-specific hooks (e.g., `useLODSystem`, `useTerrainGen`) live inside their respective project directories and are not part of this layer.

## Files in this Layer
- `useNavigation.ts` — Exports `useNavigation()`, the `NavigationUrl` union type, and its constituent branded types `ExternalLink` and `InternalPath`.

## Key Patterns & Contracts

- **Single navigation API for all link types**: Call sites do not need to decide between `navigate()` and `window.open()`. The hook inspects whether the URL starts with `"http"` and routes accordingly. External links always open in a new tab with `noopener,noreferrer` for security.
- **`NavigationUrl` is a branded union**: `ExternalLink = \`http${string}\`` and `InternalPath = \`/${string}\`` are template literal types. Passing an arbitrary string to `useNavigation()` is a compile-time error unless it matches one of those shapes. This prevents broken relative paths or protocol-relative URLs.
- **`NavigationUrl` is imported by `src/types/project.ts`**: The `ProjectData` interface uses `NavigationUrl` for its link fields. This means the types layer has a dependency on the hooks layer — an unusual direction that is intentional to keep the branded type definition in one place.
- **Requires `HashRouter` context**: `useNavigation` calls `useNavigate()` from React Router, which requires being rendered inside a Router. It cannot be called in `AppProvider` or other components that render above `HashRouter` in `App.tsx`.
- **No global navigation state**: This hook does not interact with `NavigationContext`. Route tracking for Navbar highlight state is a separate concern handled by `NavigationContext` and `useNavigation` is purely for imperative navigation.

## What Belongs Here
Hooks that are used by two or more unrelated pages or components. Hooks that are specific to a single page or feature should live in that feature's directory.
