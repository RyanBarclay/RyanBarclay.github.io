import { useCallback } from "react";
import { useTerrainContext } from "../context/TerrainContext";
import { downloadOBJ } from "../utils/export/objExporter";
import { downloadSTL } from "../utils/export/stlExporter";
import {
  exportHeightmapToPNG,
  exportHeightmapRAW,
  extractHeightmapFromGeometry,
} from "../utils/export/heightmapExporter";
import type { HeightmapData } from "../types";

export type ExportFormat = "obj" | "stl" | "heightmap-png" | "heightmap-raw";

interface UseTerrainExportReturn {
  exportTerrain: (format: ExportFormat, filename?: string) => void;
  canExport: boolean;
}

/**
 * Convert HeightmapData (Float32Array) to number[][] format for export
 *
 * @param heightmapData - Heightmap from TerrainContext
 * @returns 2D array of height values
 */
function convertHeightmapTo2DArray(heightmapData: HeightmapData): number[][] {
  const { width, height, data } = heightmapData;
  const result: number[][] = [];

  for (let y = 0; y < height; y++) {
    result[y] = [];
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      result[y][x] = data[idx];
    }
  }

  return result;
}

/**
 * Hook for exporting terrain to various formats
 *
 * Provides export functions for:
 * - OBJ: 3D mesh format (Wavefront OBJ)
 * - STL: 3D printing format (STereoLithography)
 * - PNG heightmap: Grayscale image (game engines)
 * - RAW heightmap: Binary Float32Array (advanced usage)
 *
 * @returns Export functions and state
 *
 * @example
 * ```tsx
 * const { exportTerrain, canExport } = useTerrainExport();
 *
 * // Export to OBJ with auto-generated filename
 * exportTerrain('obj');
 *
 * // Export to PNG with custom filename
 * exportTerrain('heightmap-png', 'my-terrain-heightmap.png');
 * ```
 */
export function useTerrainExport(): UseTerrainExportReturn {
  const { geometry, heightmap, config } = useTerrainContext();

  // Can only export if geometry exists
  const canExport = geometry !== null;

  const exportTerrain = useCallback(
    (format: ExportFormat, filename?: string) => {
      if (!geometry) {
        console.error("No terrain geometry available to export");
        return;
      }

      try {
        switch (format) {
          case "obj":
            downloadOBJ(
              geometry,
              filename || `terrain-${config.size}x${config.size}.obj`,
            );
            break;

          case "stl":
            downloadSTL(
              geometry,
              filename || `terrain-${config.size}x${config.size}.stl`,
            );
            break;

          case "heightmap-png": {
            // Try to use heightmap from context first, fallback to extracting from geometry
            const heightmapArray = heightmap
              ? convertHeightmapTo2DArray(heightmap)
              : extractHeightmapFromGeometry(geometry, config.size);

            exportHeightmapToPNG(
              heightmapArray,
              filename || `heightmap-${config.size}x${config.size}.png`,
            );
            break;
          }

          case "heightmap-raw": {
            // Try to use heightmap from context first, fallback to extracting from geometry
            const heightmapArray = heightmap
              ? convertHeightmapTo2DArray(heightmap)
              : extractHeightmapFromGeometry(geometry, config.size);

            exportHeightmapRAW(
              heightmapArray,
              filename || `heightmap-${config.size}x${config.size}.raw`,
            );
            break;
          }

          default:
            console.error(`Unknown export format: ${format}`);
        }
      } catch (error) {
        console.error(`Export failed: ${error}`);
      }
    },
    [geometry, heightmap, config.size],
  );

  return {
    exportTerrain,
    canExport,
  };
}
