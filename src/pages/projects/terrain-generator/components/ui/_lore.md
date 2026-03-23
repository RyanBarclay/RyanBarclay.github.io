# components/ui Layer

## Purpose
This layer contains overlay and safety components that sit at the boundary between the R3F canvas and the DOM. It owns the performance HUD (both its data collection inside the canvas and its display outside), the terrain export UI, and the React error boundary that catches WebGL or generation failures. These components are not terrain-specific widgets — they provide infrastructure that any complex R3F project would need.

## Files in this Layer
- `PerformanceHUDWrapper.tsx` — Invisible R3F component inside the canvas; collects WebGL stats every N frames and writes them to `TerrainContext` via `setPerfStats`
- `PerformanceHUD.tsx` — DOM overlay component (not used in current setup; superseded by the inline stats in `TerrainCanvas.tsx`)
- `ExportPanel.tsx` — MUI panel listing the four export formats; delegates all export logic to `useTerrainExport`
- `ErrorBoundary.tsx` — Class component that catches render errors anywhere in the terrain subtree and shows a recovery UI

## Key Patterns & Contracts

**The HUD crosses the canvas boundary via context.** WebGL renderer info (`gl.info`) is only accessible inside a `<Canvas>`. To display stats as a regular DOM `Paper` element positioned over the canvas, `PerformanceHUDWrapper` runs inside the canvas, reads `gl.info`, and writes to `TerrainContext.setPerfStats`. The DOM overlay in `TerrainCanvas.tsx` then reads `perfStats` from context. This indirect path is necessary because `Html` from `@react-three/drei` (which can render DOM inside a canvas) was not used here in favor of simpler absolute positioning.

**`PerformanceHUD.tsx` is effectively dormant.** The current architecture renders the stats overlay directly in `TerrainCanvas.tsx` using context values. `PerformanceHUD.tsx` calls `usePerformance` independently (inside canvas) and renders via `Paper` — this would require being inside the canvas or using `Html`. It exists as a self-contained alternative if the architecture changes to use `drei`'s `Html` wrapper.

**Frame skipping is synchronized.** `PerformanceHUDWrapper` uses the same 30-frame update interval as the display in `TerrainCanvas.tsx`. Both read from the same context slot, so no duplicate polling occurs.

**`ExportPanel` has zero generation logic.** It only renders a static list of format options and calls `useTerrainExport().exportTerrain(format)`. The `canExport` flag (which disables all buttons) comes from whether geometry exists in context. `ExportPanel` is embedded as an Accordion section inside `ControlPanel`.

**`ErrorBoundary` must be a class component.** React's `componentDidCatch` lifecycle is not available as a hook. The class resets by calling `window.location.reload()` rather than attempting to recover in place, because WebGL context loss or corrupted geometry state is difficult to recover from cleanly.

**`ErrorBoundary` wraps the entire `TerrainProvider`.** Placing it outside the provider means errors in the provider itself are caught. The provider holds geometry references that, if corrupted, could cause cascading failures — the boundary ensures the user always has a recovery path.

## What Belongs Here
Overlay components that bridge the R3F/DOM boundary, export UI, and error recovery infrastructure. Not terrain controls, not generation logic.
