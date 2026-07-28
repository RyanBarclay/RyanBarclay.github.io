# context Layer

## Purpose
This layer is the single shared state store for the entire terrain generator. It owns all configuration state, all generated data (heightmap and geometry), and the signals that trigger regeneration. Every layer — controls, canvas, hooks, export — reads from or writes to this context. Nothing in this layer computes terrain; it only stores and coordinates.

## Files in this Layer
- `TerrainContext.tsx` — Provider, context value definition, all state setters, and the `useTerrainContext` hook

## Key Patterns & Contracts

**Two-config pattern (pending vs. committed).** There are two parallel `TerrainConfig` objects: `config` (the committed state used for rendering) and `pendingConfig` (a draft mutated by sliders and controls). Sliders call `updatePendingConfig` on every drag event. The committed `config` only changes when the user explicitly clicks "Generate Terrain," at which point `generateTerrain()` calls `setConfig(pendingConfig)` before incrementing `regenerationKey`. This is intentional: a 512×512 terrain recalculation is too expensive to run live.

**`updateConfig` vs. `updatePendingConfig`.** `updateConfig` writes directly to the committed config and is reserved for settings that take immediate effect without regeneration (wireframe toggle, animation playback state). All other controls must use `updatePendingConfig`.

**`generateTerrain()` is a coordinator, not a generator.** It disposes the old geometry, commits pending config, sets `isGenerating`, and increments `regenerationKey`. The actual noise/geometry pipeline runs inside `useTerrainGen`, which listens to the committed `config`. The `setTimeout(() => setIsGenerating(false), 100)` in `generateTerrain` is a stub from the original architecture — the real loading state is managed by `useTerrainGen`'s own `isGenerating` flag.

**Geometry disposal on regeneration.** Before setting new geometry, `generateTerrain` calls `geometry.dispose()` on the existing Three.js `BufferGeometry`. This is critical for preventing GPU memory leaks on repeated regeneration. Never bypass this by calling `setGeometry` directly from outside the context.

**Deep merge for nested objects.** Both `updateConfig` and `updatePendingConfig` detect partial updates to `animation` and `water` sub-objects and spread-merge them, preventing accidental erasure of sibling fields when only one property changes (e.g., toggling `animation.enabled` without touching `animation.speed`).

**`showStats` / `perfStats` live here for cross-boundary access.** The performance HUD data must cross the R3F canvas boundary (collected inside canvas, displayed outside). Context is the only practical bridge without a separate global store.

## What Belongs Here
Global terrain state, config management, geometry/heightmap storage, and regeneration coordination — not computation, not UI rendering.
