# utils/lod Layer

## Purpose
This layer implements the spatial data structures and distance-to-detail calculations that power the LOD system. It provides the quadtree that partitions terrain space and a set of pure utility functions for computing LOD levels, camera distances, and hysteresis. The `useLODSystem` hook in `hooks/` is the React integration point; this layer contains only pure TypeScript with no React dependencies.

## Files in this Layer
- `quadtree.ts` — `Quadtree` class: builds a fixed-depth tree of `QuadtreeNode`s, updates LOD levels per-node based on camera distance, and returns the leaf nodes to render
- `lodCalculator.ts` — Pure functions: LOD level from distance, default LOD thresholds scaled to terrain size, camera-to-chunk AABB distance, hysteresis adjustment

## Key Patterns & Contracts

**The quadtree is pre-built to full depth, not adaptive.** `buildFullTree()` subdivides every node to `maxLevel` regardless of camera position. This gives a fixed number of leaf chunks (`4^maxLevel`). With `maxLevel=3`, that is 64 leaf chunks. The LOD level assigned to each leaf changes per frame, but the tree structure itself is static between terrain size changes. This trades some over-subdivision at distant nodes for simplicity and predictability.

**LOD levels are assigned from the center of each node, not the AABB nearest point.** `updateLODRecursive` computes `distance = sqrt((node.center.x - cameraX)^2 + (node.center.z - cameraZ)^2)`. The LOD calculator also provides `getCameraChunkDistance` which uses AABB clamping for more accurate edge-proximity calculation, but it is not used by the quadtree's own update path. The center-based approach is less accurate near chunk edges but faster.

**The coordinate system is centered at origin.** The root node bounds go from `-terrainSize/2` to `+terrainSize/2` on both axes. All chunk bounds, camera positions passed to `updateLOD`, and world positions in `LODChunk` use this centered coordinate system. The grid helper in `TerrainCanvas` is also centered at `[0, -0.1, 0]`.

**LOD distance thresholds scale with terrain size.** `getDefaultLODLevels` uses `baseScale = terrainSize / 256` so that a 512-unit terrain has twice the view distances as a 256-unit one. The current thresholds (200, 600, infinity) were deliberately widened from earlier values (50, 150) to reduce visible LOD popping. Narrowing these values causes more aggressive quality reduction closer to the camera.

**`shouldTransitionLOD` and `applyDistanceHysteresis` are available but not used.** The quadtree update path applies LOD thresholds directly without hysteresis. These functions exist for a future refinement where LOD transitions are stabilized by adding distance buffers. Wiring them in would require the quadtree to track each node's previous LOD level.

**`getVisibleChunks` returns all leaf nodes.** There is no frustum culling — all 64 chunks are returned regardless of camera direction. The comment in the source notes that frustum culling was planned for a later phase. Adding it here would reduce draw calls when the camera is zoomed in.

**`Quadtree.clear()` only clears the root's children.** It does not null out the entire tree recursively. This works because `buildFullTree()` always rebuilds from root, so the old child references are replaced and garbage collected.

## What Belongs Here
Pure spatial partitioning data structures and LOD distance math. No React, no Three.js, no rendering concerns.
