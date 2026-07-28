# utils/color Layer

## Purpose
This layer maps normalized elevation values to RGB colors for vertex coloring of the terrain mesh. It owns the BC Nature and grayscale color palettes, the elevation threshold definitions, and the interpolation logic that produces smooth color transitions between terrain zones. The output is a flat `Float32Array` of RGB values (one per vertex, range 0–1) that is passed directly to the geometry builder as a vertex attribute.

## Files in this Layer
- `bcPalette.ts` — Color constants (BC Nature and grayscale), elevation threshold table, hex conversion utilities, and `lerpColor`
- `colorMapper.ts` — `createColorArray` (the primary export entry point), elevation-to-color dispatch, BC Nature zone mapping, grayscale zone mapping, `applyRadialMask`, and `normalizeHeightmap`

## Key Patterns & Contracts

**Colors are pre-converted to Three.js format at module load time.** `BC_NATURE_PALETTE_THREE` and `GRAYSCALE_PALETTE_THREE` call `hexToThreeColor` for each entry when the module is first imported. This means color lookups during generation are pure array reads — no hex parsing in the hot loop. New palettes should follow the same pattern: define hex constants, then pre-convert to `[r, g, b]` tuples in a `_THREE` export.

**Elevation thresholds are zone boundaries, not per-color.** `ELEVATION_THRESHOLDS` defines six boundary values (0.3, 0.35, 0.5, 0.7, 0.85, 1.0). The color at any elevation is determined by which zone it falls in, then linearly interpolated to the next zone's color via `lerpColor`. This produces smooth gradients without per-vertex discrete band artifacts.

**BC Nature zones reflect real British Columbia ecology.** The threshold-to-biome mapping is: `< 0.3` deep water (coastal blue-green), `0.30–0.35` sand (warm beach), `0.35–0.50` grass (spring meadow), `0.50–0.70` forest (dark evergreen), `0.70–0.85` rock (gray stone), `0.85–1.0` snow (white peaks). The `Forest Green (#2C5530)` value also appears as the center line color of the grid helper in `TerrainCanvas.tsx` for visual consistency.

**`colorMapper.ts` has its own `applyRadialMask` distinct from `presets.ts`.** The version in this file takes `(heightmap, size, radius, falloff)` where `radius` controls the island width as a fraction of `size/2`. The version in `presets.ts` takes `(heightmap, size, falloff)` and uses `center * sqrt(2)` for max distance. `useTerrainGen` imports from `colorMapper.ts`. The two implementations produce different shaped masks. This is a known duplication — see the noise layer lore.

**`createColorArray` is the only function called from outside this layer.** All other exports (`lerpColor`, `hexToRgb`, etc.) are palette utilities consumed internally or available for future tooling. `useTerrainGen` calls `createColorArray(finalHeightmap, colorScheme)` and passes the result to `buildTerrainGeometry`. `LODChunk` calls it again for its sub-region heightmap.

**Grayscale uses 8 fixed zones with linear interpolation.** Each zone spans 0.125 elevation units. Unlike BC Nature, grayscale has no semantic meaning per zone — it is a uniform dark-to-white gradient useful for heightmap visualization and debugging.

**`normalizeHeightmap` is available but not called in the current pipeline.** `getFractalNoise` already normalizes its output to `[0, 1]` before returning, so the heightmap passed to `createColorArray` is already in range. This utility is provided for external callers (e.g., if raw simplex values were used directly).

## What Belongs Here
Elevation-to-color mapping, palette definitions, and color interpolation utilities. No noise computation, no geometry building, no React.
