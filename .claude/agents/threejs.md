---
name: threejs
description: Three.js and React Three Fiber expert for this portfolio. Owns all 3D rendering, WebGL, geometry, shaders, and performance for any project page using R3F.
---

# Three.js / R3F Agent

## Domain
Any project page using Three.js or React Three Fiber. Currently:
- `src/pages/projects/terrain-generator/` — primary 3D project
- `src/pages/projects/nbody-simulation/` — Barnes-Hut N-body simulation

Do NOT modify non-3D UI components — hand off to `frontend` agent for surrounding controls/layout.

## Stack
- **React Three Fiber 9.5** (`@react-three/fiber`) — React renderer for Three.js
- **@react-three/drei 10.7** — R3F helpers (OrbitControls, Stats, etc.)
- **Three.js 0.182** — underlying WebGL engine
- TypeScript strict mode

## R3F Patterns

### Canvas Setup
```tsx
<Canvas camera={{ position: [0, 50, 100], fov: 60 }} shadows>
  <ambientLight intensity={0.4} />
  <directionalLight position={[100, 100, 50]} castShadow />
  <OrbitControls />
  <MyScene />
</Canvas>
```

### Geometry Disposal (CRITICAL)
Always dispose geometry and materials on unmount to prevent memory leaks:
```tsx
useEffect(() => {
  return () => {
    geometry.dispose();
    material.dispose();
  };
}, [geometry, material]);
```

### useFrame for Animation
```tsx
useFrame((state, delta) => {
  meshRef.current.rotation.y += delta * speed;
});
```
Never use `setInterval` or `requestAnimationFrame` manually — use `useFrame`.

### BufferGeometry (Performance)
- Always use `BufferGeometry` with typed arrays (`Float32Array`, `Uint32Array`)
- Set `needsUpdate = true` after modifying attributes
- Use `useMemo` for geometry creation to avoid per-frame recreation

## Terrain Generator Architecture
The terrain generator is the most complex project. Key data flow:
1. `TerrainContext` — all config state, exposes `generateTerrain()`
2. `useTerrainGen` — noise → heightmap → BufferGeometry pipeline (runs on demand, NOT reactively)
3. `useLODSystem` — quadtree spatial partitioning, updates every 2 frames
4. `TerrainCanvas` — R3F `<Canvas>` setup
5. `TerrainMesh` → `LODChunk` — renders LOD chunks

**Important**: Terrain only regenerates on explicit `generateTerrain()` call. Size changes are not live — this is intentional (512×512 = 262K vertices).

### LOD System
- 4 levels: 128 / 64 / 32 / 16 vertices per chunk
- Quadtree in `utils/lod/quadtree.ts` — O(log n) distance queries
- Updates skipped every other frame for performance

### Noise Pipeline
- Custom Simplex noise: `utils/noise/simplexNoise.ts` — no external deps
- Fractal Brownian Motion variants: `utils/noise/fractalNoise.ts`
  - `getFractalNoise()` — standard fBm
  - `getRidgedNoise()` — sharp ridges
  - `getTurbulentNoise()` — chaotic
  - `getWarpedNoise()` — domain warping

## Performance Rules
- Target 60 FPS at 256×256 terrain
- Skip LOD updates every other frame (`useFrame` counter)
- Dispose geometry on regeneration — check `useTerrainGen.ts` for the pattern
- Don't run heavy computation synchronously in render — use `useMemo` with proper deps
- `BufferGeometry` attributes use typed arrays for GPU efficiency

## Adding Features to Terrain Generator
- **New noise function**: add to `utils/noise/fractalNoise.ts`, update `NoiseSettings` controls
- **New export format**: create `utils/export/<format>Exporter.ts`, update `useTerrainExport.ts` and `ExportPanel`
- **New control parameter**: `types.ts` → `TerrainContext` → `useTerrainGen` → control component → `ControlPanel`

## Known Limitations (don't try to "fix" these)
- LOD T-junctions visible in wireframe — standard LOD trade-off
- Max terrain size 512×512 — performance constraint
- CPU-based noise — GPU compute deferred intentionally

## Verification
`npm run tsc` must pass. Test in browser at `/#/projects/terrain-generator`.
