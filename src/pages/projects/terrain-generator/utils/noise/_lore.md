# utils/noise Layer

## Purpose
This layer implements all procedural noise mathematics from scratch — no external noise libraries. It provides the raw noise primitive (`SimplexNoise`), four fBm variants built on top of it, and the preset parameter configurations that encode different terrain characters. The output of this layer is a stream of normalized `[0, 1]` float values that `useTerrainGen` samples into a heightmap.

## Files in this Layer
- `simplexNoise.ts` — Custom 2D Simplex Noise implementation: seeded permutation table, 12-gradient triangular grid, skew/unskew coordinate transform, and the `SimplexNoise` class
- `fractalNoise.ts` — Fractal Brownian Motion (fBm) built on `SimplexNoise`: standard fBm, ridged noise, turbulent noise, and domain-warped noise
- `presets.ts` — Tuned parameter configs for mountains/islands/canyons/valleys, plus the `applyRadialMask` function for island coastline shaping

## Key Patterns & Contracts

**`SimplexNoise` is stateful via a global permutation table.** The module-level `PERM` and `PERM_MOD_12` arrays are written to by `initializePermutation` on every `new SimplexNoise(seed)` call. This means the noise generator is not thread-safe and multiple instances are effectively the same instance — the last constructed seed wins. The current architecture always creates exactly one `SimplexNoise` per `generate()` call, so this is not a problem in practice, but it would become one if generation were parallelized or if two generators coexisted.

**Seeding uses Park-Miller PRNG with Fisher-Yates shuffle.** The seed string is hashed to an integer, then used to seed a multiplicative linear congruential generator (`random = (random * 16807) % 2147483647`) for the Fisher-Yates permutation shuffle. The same seed always produces the same terrain — reproducibility is a first-class feature.

**`noise2D` returns `[-1, 1]`; `getFractalNoise` returns `[0, 1]`.** The scale factor of 70 in `simplexNoise.ts` is empirically determined (standard for 2D simplex). `fractalNoise.ts` normalizes fBm output to `[0, 1]` via `(total / maxValue + 1) * 0.5`. Callers should treat simplex values as signed and fBm values as unsigned.

**Only `getFractalNoise` is used in production.** `useTerrainGen` calls only `getFractalNoise`. The other three variants (`getRidgedNoise`, `getTurbulentNoise`, `getWarpedNoise`) are implemented and available but not currently wired into any preset or generation path. The canyons preset was intended to use `getRidgedNoise` per the inline comment in `presets.ts`.

**`applyRadialMask` exists in two places with different signatures.** `colorMapper.ts` exports its own `applyRadialMask(heightmap, size, radius, falloff)`, while `presets.ts` exports `applyRadialMask(heightmap, size, falloff)` with different parameter semantics. `useTerrainGen` imports from `colorMapper.ts`. The version in `presets.ts` appears to be the original; `getPresetRequirements` in `presets.ts` also references it but is unused. This duplication should be resolved if either version is extended.

**Preset parameters do not change the noise variant.** Despite `getPresetRequirements` returning `{ useRidgedNoise: true }` for canyons, `useTerrainGen` does not check this — it always calls `getFractalNoise`. The preset system only adjusts octaves, persistence, lacunarity, frequency, and heightScale. Implementing variant-based generation would require changes to `useTerrainGen`.

## What Belongs Here
Pure mathematical noise functions and terrain preset parameter data. No React, no Three.js, no DOM access.
