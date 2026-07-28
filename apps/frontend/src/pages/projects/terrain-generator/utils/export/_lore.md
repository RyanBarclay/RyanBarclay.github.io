# utils/export Layer

## Purpose
This layer serializes the current terrain into files the user can download. It covers three export targets: 3D modeling formats (OBJ, STL), and heightmap image formats (PNG, RAW binary). All functions in this layer trigger immediate browser downloads via anchor-click; there is no server-side involvement.

## Files in this Layer
- `objExporter.ts` — Converts `THREE.BufferGeometry` to Wavefront OBJ text format; includes vertex positions, normals, and 1-based face indices
- `stlExporter.ts` — Converts `THREE.BufferGeometry` to binary STL format (80-byte header + per-triangle float32 data); suitable for 3D printing
- `heightmapExporter.ts` — Exports height data as grayscale PNG (via canvas API) or raw Float32Array binary; also provides `extractHeightmapFromGeometry` as a fallback when context heightmap is unavailable

## Key Patterns & Contracts

**All exporters accept Three.js geometry directly.** OBJ and STL receive `THREE.BufferGeometry` and traverse its buffer attributes (`position`, `normal`, `index`). They do not re-run noise or geometry building — they serialize the already-computed GPU-ready data. This means export reflects exactly what is currently rendered.

**OBJ uses text format; STL uses binary.** OBJ is human-readable and suitable for Blender/Maya import. STL binary is the standard for 3D printing slicers (Cura, PrusaSlicer). OBJ face indices are 1-based (OBJ spec requirement) — each face index is `bufferIndex + 1`.

**STL binary layout is exactly 50 bytes per triangle.** The format is: 12 bytes normal + 36 bytes (3 vertices × 12 bytes each) + 2 bytes attribute count (always 0). The exporter uses `DataView` with `true` (little-endian) for all float32 and uint32 writes. The attribute byte count field is required by the spec but universally ignored by parsers.

**PNG export goes through the Canvas API.** `exportHeightmapToPNG` creates an off-screen `<canvas>`, writes grayscale `ImageData` from normalized height values, then calls `canvas.toBlob('image/png')` asynchronously. The blob URL is then anchor-clicked. This is the only async export path. The `bitDepth` parameter accepts 8 or 16, but the implementation always uses 8-bit (canvas `ImageData` is always 8-bit RGBA) — the 16-bit path is a documented future enhancement.

**RAW export writes Float32Array directly.** Heights are flattened row-first into a single `Float32Array`, wrapped in a `Blob`, and downloaded. Values are in their original normalized `[0, 1]` range without min/max normalization. Consumers (game engines, scientific tools) must know the grid dimensions separately; the file is just raw floats with no header.

**`extractHeightmapFromGeometry` is a lossy fallback.** It reads Y-coordinates from the position buffer, which contain `height * heightScale` (not normalized `[0, 1]` values). This produces a heightmap in world units, not the `[0, 1]` range that the PNG exporter expects for accurate grayscale mapping. The `useTerrainExport` hook prefers the stored `HeightmapData` from context; this fallback fires only if `heightmap` is null (e.g., if the user loaded a session without regenerating).

**Download mechanism uses anchor-click with revokeObjectURL.** All download functions create a temporary `<a>` element, set `href` to a blob URL, call `.click()`, then immediately revoke the URL. This is the standard browser download pattern for in-memory data with no XHR or `fetch` involved.

## What Belongs Here
File serialization functions that convert in-memory terrain data to downloadable formats. No React hooks, no context access, no rendering.
