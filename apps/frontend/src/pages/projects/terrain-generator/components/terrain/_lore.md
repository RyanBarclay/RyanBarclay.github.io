# components/terrain Layer

## Purpose
This layer contains the React Three Fiber components that render the 3D terrain scene. It owns the visible geometry — the LOD-divided terrain mesh and the water plane — and coordinates with the LOD system to determine which chunks to render at what detail level. All components here must run inside an R3F `<Canvas>` context.

## Files in this Layer
- `TerrainMesh.tsx` — Orchestrates LOD by consuming `useLODSystem` and mapping visible chunks to `LODChunk` components
- `LODChunk.tsx` — Renders a single terrain chunk: samples the stored heightmap for its bounds, builds geometry at LOD-appropriate resolution, and applies `heightScale` as a Y-axis transform
- `WaterPlane.tsx` — Renders a semi-transparent animated plane at `config.water.level` height; returns null when water is disabled

## Key Patterns & Contracts

**The terrain renders from the stored heightmap, not from re-running noise.** `LODChunk` reads `storedHeightmap` from context (set by `useTerrainGen` after generation). It does not call any noise functions. This is the critical separation: noise runs once when "Generate" is clicked, and the stored heightmap is what all chunks sample from for their sub-region geometry. If `storedHeightmap` is null, `LODChunk` returns an empty `BufferGeometry`.

**Bilinear interpolation at chunk boundaries.** Each `LODChunk` samples a rectangular sub-region of the full heightmap. Coordinates are mapped from world space to heightmap indices, and four-corner bilinear interpolation is used at non-integer sample positions. This prevents visible seams at LOD chunk boundaries.

**`heightScale` is applied as a Three.js Y-scale transform, not baked into geometry.** `LODChunk` always builds geometry with `heightScale=1` and then sets `scale={[1, heightScale, 1]}` on the mesh. This means changing `heightScale` in the control panel does not require rebuilding geometry on the next "Generate" click — it takes effect immediately at render time. This is intentional for responsiveness.

**LOD resolution uses bit-shifting.** The chunk's base resolution is its world-space width in units. Each LOD level halves this via `baseResolution >> lodLevel`. At `maxLODLevel=3`, resolutions step from full → half → quarter → eighth.

**`TerrainMesh` uses a stable chunk key.** Each `LODChunk` is keyed by `${minX}-${minZ}-${lodLevel}`. When a chunk's LOD level changes (camera moves), its key changes and React unmounts/remounts it. The `useEffect` cleanup in `LODChunk` calls `geometry.dispose()` on unmount, preventing geometry accumulation in GPU memory.

**`TerrainMesh` resets the quadtree on size changes.** A `useEffect` watching `config.size` calls `reset()` on the LOD system to rebuild the quadtree for the new terrain dimensions. Without this, the quadtree would retain stale bounds from the previous generation.

**`WaterPlane` animates via `useFrame`.** The vertical position of the water mesh oscillates with `Math.sin(time * 0.5) * 0.2` for a subtle wave effect. This runs every frame and does not trigger React state updates — the position is applied directly to the Three.js mesh ref.

**`LODChunk` memo dependencies are carefully chosen.** The `useMemo` for geometry depends on `bounds`, `lodLevel`, `colorScheme`, and `storedHeightmap` — but not on noise parameters (`octaves`, `persistence`, etc.). Noise parameters only matter during generation; after that, the stored heightmap is the source of truth.

## What Belongs Here
R3F components that render terrain geometry and effects within the Three.js scene. Components here must not contain MUI or DOM-layer rendering.
