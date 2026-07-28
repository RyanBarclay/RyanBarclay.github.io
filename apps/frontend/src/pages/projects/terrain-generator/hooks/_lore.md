# hooks Layer

## Purpose
This layer contains all stateful React logic that bridges context state with computation, animation, performance monitoring, and export. Hooks here are the only place that orchestrate multi-step workflows (generation pipeline, animation loop, LOD updates). They consume `TerrainContext` and external R3F APIs, and they produce derived state or side effects for components to render.

## Files in this Layer
- `useTerrainGen.ts` — Runs the full generation pipeline (noise → heightmap → geometry) and writes results into context
- `useLODSystem.ts` — Manages the quadtree and updates LOD levels per-frame using R3F's `useFrame`; must be called inside a `<Canvas>`
- `useAnimationLoop.ts` — Drives terrain morphing by incrementing `config.animation.time` via `requestAnimationFrame`
- `usePerformance.ts` — Reads WebGL renderer info every N frames and returns FPS/triangle/memory stats; must be called inside a `<Canvas>`
- `useTerrainExport.ts` — Wraps the export utilities with context access and format routing
- `useDebounce.ts` — Generic debounce utility; delays a value update by a configurable ms window

## Key Patterns & Contracts

**Terrain only regenerates on explicit user action — never live.** `useTerrainGen.generate()` is triggered by the "Generate Terrain" button (via `ControlPanel`), by the initial auto-generate in `TerrainCanvas`, and by the animation loop threshold check. Slider changes write to `pendingConfig` only and never call `generate()`. This is a deliberate performance constraint: a 512×512 terrain has 262,144 vertices and the noise calculation is synchronous on the main thread.

**`generate()` accepts an optional `overrideConfig`.** The control panel passes `pendingConfig` directly to `generate(pendingConfig)` to avoid a stale closure problem — `config` in context may not have updated to the newly committed value by the time `generate` is called in the same event handler. Always prefer the override path when calling from a button handler.

**Animation regeneration uses a time-threshold gate.** `useTerrainGen` checks whether `animation.time` has crossed a 0.5-second boundary since the last check. If it has, it calls `generate()`. This means terrain morphs in discrete steps at ~2 Hz, not every frame. The effect is subtle by design — see the tooltip in `AnimationControls`.

**`useLODSystem` and `usePerformance` require R3F canvas context.** Both use `useFrame` and `useThree`, which throw if called outside a `<Canvas>`. They must never be called from components rendered in the DOM layer.

**Frame skipping is the primary performance lever.** `useLODSystem` updates every 4 frames (configurable via `updateInterval`). `usePerformance` updates every 30 frames. `PerformanceHUDWrapper` matches the same 30-frame interval. Increasing these values reduces responsiveness; decreasing them increases CPU cost.

**`useAnimationLoop` uses `requestAnimationFrame`, not `useFrame`.** Animation time is a React state value stored in context, not a Three.js animation — so it's driven by a standard browser rAF loop, not the R3F render loop. This means it continues running even if the R3F canvas is paused.

**`useTerrainExport` falls back to geometry extraction.** If `heightmap` is null in context (unusual), the hook extracts height values by reading Y-coordinates from the geometry's position buffer. This fallback is less accurate than the stored Float32Array data.

**`useDebounce` is available but not currently used for sliders.** Controls use local state for instant feedback and write directly to `pendingConfig`. `useDebounce` exists for scenarios where debounced context writes are preferred over the two-state local/pending pattern.

## What Belongs Here
Stateful React logic that orchestrates terrain computation, per-frame updates, or asynchronous workflows. Pure utility functions with no React dependency belong in `utils/`.
