# types/ Layer

## Purpose
This layer owns shared TypeScript interfaces and type aliases that are consumed by multiple layers. Currently it defines the data shape for project entries (`ProjectData`) and the structural type for project detail sections (`ProjectSection`). Any type that is not specific to a single file or feature belongs here.

## Files in this Layer
- `project.ts` — Defines `ProjectData` (the full project record shape) and `ProjectSection` (title + content pair used for project detail sections); also re-exports the `NavigationUrl` union type via import from `useNavigation`.

## Key Patterns & Contracts

- **`ProjectData` is the central contract**: Every project entry in `src/data/projects.ts` must conform to this interface. The project list page, project card components, and the detail page hero all read from this shape. Changing a field name here requires updating both the data file and all consumers.
- **`NavigationUrl` as a branded type**: `detailPage`, `links.github`, and `links.live` are typed as `NavigationUrl` (`ExternalLink | InternalPath`). This union is defined in `src/hooks/useNavigation.ts` and imported here — the types layer imports from the hooks layer in this one case to keep navigation typing consistent. This is intentional: the branded type enforces that all URLs passed to `useNavigation()` are well-formed.
- **Optional fields are intentional**: `featured`, `sections`, `links`, `heroImage`, `heroGradient`, and `year` are all optional. Not every project has a GitHub link, a custom hero, or rich sections. Consumers must guard for `undefined`.
- **`sections?: ProjectSection[]`**: The `content` field on `ProjectSection` is typed as `React.ReactNode`, allowing both plain strings and JSX. In practice the data file uses strings with markdown-style formatting, but the type allows richer content if needed.
- **No runtime validation**: There is no Zod schema or runtime guard for `ProjectData`. TypeScript compile-time checking is the only enforcement layer (matching the no-test-suite constraint documented in `CLAUDE.md`).

## What Belongs Here
Interfaces and type aliases used across two or more source directories. Single-file types (e.g., `TerrainConfig` in the terrain-generator) belong next to the code that owns them, not here.
