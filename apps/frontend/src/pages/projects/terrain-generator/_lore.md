# terrain-generator Layer (Root)

## Purpose
This is the entry point and integration layer for the procedural terrain generator project. It owns the page shell, the responsive layout that switches between desktop sidebar and mobile full-screen modal, the provider wrapping, and the React Three Fiber canvas setup. Nothing here contains generation logic — it wires together all sub-layers and decides how the interactive demo is presented relative to the surrounding portfolio page.

## Files in this Layer
- `index.tsx` — Project detail page: renders the portfolio write-up sections, wraps everything in `TerrainProvider` and `ErrorBoundary`, and provides the responsive canvas/controls layout
- `TerrainCanvas.tsx` — R3F `<Canvas>` setup: camera, lighting, orbit controls, grid helper, and auto-generates terrain on first mount
- `types.ts` — Single source of truth for all TypeScript interfaces and type aliases used across every sub-layer

## Key Patterns & Contracts

**Responsive layout strategy.** `index.tsx` detects mobile with `useMediaQuery`. On desktop, canvas and `ControlPanel` sit side-by-side. On mobile, a preview canvas renders in-page at `50vh`, and a fullscreen `Dialog` with a bottom-sheet control panel is available via "Open Full-Screen Demo". The modal manages its own `controlsOpen` state and passes `hideToggleButton={true}` to `ControlPanel` to suppress the floating menu icon (the modal provides its own close button).

**Auto-generate on mount.** `TerrainCanvas` triggers the first terrain generation with a 100 ms delay (via `setTimeout`) to allow the UI to render the loading overlay before the synchronous generation blocks the thread. A `useRef` guard (`hasGenerated`) prevents double-generation when `geometry` resets.

**`types.ts` is the contract layer.** Every data structure that crosses layer boundaries — `TerrainConfig`, `HeightmapData`, `QuadtreeNode`, `LODLevel`, `ExportFormat`, etc. — is defined here. Adding a new config parameter starts here.

**`TerrainProvider` must wrap everything.** Both `TerrainCanvas` and `ControlPanel` call `useTerrainContext()`, which throws if used outside the provider. The provider is placed in `index.tsx`, above both consumers.

**Performance overlay is split.** The stats overlay is rendered as a DOM element in `TerrainCanvas` (not inside the R3F `<Canvas>`) because HTML overlays positioned absolutely over a canvas are simpler to style. The data is collected inside the canvas by `PerformanceHUDWrapper` and stored in context for the DOM overlay to read.

## What Belongs Here
The project page shell, responsive demo layout, R3F scene setup, and shared TypeScript types — not generation algorithms, hook logic, or UI controls.
