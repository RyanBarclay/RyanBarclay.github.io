# utils/mesh Layer

## Purpose
This layer converts raw heightmap data into Three.js `BufferGeometry` objects ready for GPU upload. It owns vertex position calculation, triangle index generation, and smooth normal computation. The output of this layer is the primary artifact that the rendering layer consumes.

## Files in this Layer
- `geometryBuilder.ts` — Three functions: `buildTerrainGeometry` (primary, used by `LODChunk`), `buildLODGeometry` (vertex-skipping LOD variant, currently unused in the active rendering path), `updateTerrainGeometry` (in-place mutation for animation, currently unused)
- `normalCalculator.ts` — `calculateNormals` (smooth, face-accumulation method) and `calculateFlatNormals` (per-face, for hard-edge shading, currently unused)

## Key Patterns & Contracts

**Index buffer type is chosen by vertex count.** Vertex counts above 65,536 require 32-bit indices (`Uint32Array`); below that, 16-bit (`Uint16Array`) is used for memory efficiency. A 256×256 terrain has 65,536 vertices — exactly on the boundary — so it uses 32-bit. This branch is automatic and transparent to callers.

**`worldSize` parameter enables chunk-relative positioning.** When `buildTerrainGeometry` is called without `worldSize`, the geometry is centered at origin (the full-terrain case). When `worldSize` is provided (the chunk case), vertices start at `(0, 0)` in local space and the chunk mesh is positioned via the `position` prop on the R3F mesh. The `centerOffset` variable implements this: `0` for chunks, `size/2` for full terrain.

**Height scale is not baked into geometry positions.** `geometryBuilder.ts` does apply `height * heightScale` to the Y coordinate when building positions. However, `LODChunk` calls it with `heightScale=1` and applies scale as a Three.js Y-transform instead. This means the geometry position data always has raw normalized heights (in the range `[0, heightScale]` when called from the non-chunk path, `[0, 1]` from the chunk path). Future callers should be aware of this convention divergence.

**Smooth normals use face-accumulation.** `calculateNormals` initializes all normals to zero, then for each triangle computes a face normal via cross product and adds it to all three vertices. After all triangles are processed, each vertex normal is normalized to a unit vector. This produces smooth shading (Gouraud-like) because shared-edge vertices accumulate normals from all adjacent faces. The fallback for zero-length normals is the up vector `[0, 1, 0]`.

**`buildLODGeometry` and `updateTerrainGeometry` are not in the active render path.** The current architecture has `LODChunk` build fresh geometry via `buildTerrainGeometry` (with resolution controlled by LOD level) rather than using `buildLODGeometry` (which subsamples a full-resolution heightmap). `updateTerrainGeometry` was intended for in-place animation updates but animation instead re-runs the full generation pipeline. These functions are well-implemented and could be adopted in future optimizations.

**Triangle winding is counter-clockwise.** The two triangles per quad use `(topLeft, bottomLeft, topRight)` and `(topRight, bottomLeft, bottomRight)` ordering. This defines front faces for Y-up orientation with a camera looking in the -Z direction. `LODChunk` uses `side={2}` (DoubleSide) to avoid culling from below, which is why winding direction has no visual consequence at runtime.

## What Belongs Here
Heightmap-to-geometry conversion: vertex positions, index generation, and normal calculation. No noise sampling, no React, no color mapping.
