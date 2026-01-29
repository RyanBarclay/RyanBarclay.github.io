/**
 * useTerrainGen Hook
 *
 * React hook for terrain generation logic.
 * Integrates fractal noise, color mapping, and geometry building.
 *
 * Workflow:
 * 1. Read config from TerrainContext
 * 2. Generate heightmap using fractal noise
 * 3. Apply radial mask if preset is 'islands'
 * 4. Create color array from heightmap
 * 5. Build BufferGeometry with colors
 * 6. Store results in context
 */

import { useCallback, useState, useEffect } from "react";
import * as THREE from "three";
import { useTerrainContext } from "../context/TerrainContext";
import { SimplexNoise } from "../utils/noise/simplexNoise";
import { getFractalNoise } from "../utils/noise/fractalNoise";
import { createColorArray, applyRadialMask } from "../utils/color/colorMapper";
import { buildTerrainGeometry } from "../utils/mesh/geometryBuilder";
import type { HeightmapData } from "../types";

/**
 * Hook return type
 */
interface UseTerrainGenReturn {
  heightmap: Float32Array | null;
  geometry: THREE.BufferGeometry | null;
  isGenerating: boolean;
  generate: () => void;
}

/**
 * Terrain generation hook
 *
 * Provides terrain generation functionality with loading states.
 * Integrates with TerrainContext for config and state management.
 *
 * @returns Terrain generation state and controls
 *
 * @example
 * const { heightmap, geometry, isGenerating, generate } = useTerrainGen();
 *
 * // Trigger generation
 * <button onClick={generate} disabled={isGenerating}>
 *   Generate Terrain
 * </button>
 */
export function useTerrainGen(): UseTerrainGenReturn {
  const { config, setHeightmap, setGeometry } = useTerrainContext();
  const [localHeightmap, setLocalHeightmap] = useState<Float32Array | null>(
    null,
  );
  const [localGeometry, setLocalGeometry] =
    useState<THREE.BufferGeometry | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  /**
   * Generate terrain
   *
   * Main generation pipeline:
   * 1. Initialize simplex noise with seed
   * 2. Generate heightmap using fractal Brownian motion
   * 3. Apply island mask if needed
   * 4. Create color array from heightmap
   * 5. Build geometry with positions, normals, and colors
   * 6. Update context
   */
  const generate = useCallback(() => {
    setIsGenerating(true);

    // Use setTimeout to allow UI to update (show loading state)
    setTimeout(() => {
      try {
        const {
          size,
          heightScale,
          seed,
          octaves,
          persistence,
          lacunarity,
          frequency,
          preset,
          colorScheme,
          animation,
        } = config;

        // Step 1: Initialize noise generator with seed
        const simplex = new SimplexNoise(seed);

        // Get animation time offset for morphing (scaled down for subtle effect)
        const timeOffset = (animation?.time || 0) * 0.05;

        // Step 2: Generate heightmap using fractal noise
        const heightmap = new Float32Array(size * size);
        let minHeight = Infinity;
        let maxHeight = -Infinity;

        for (let z = 0; z < size; z++) {
          for (let x = 0; x < size; x++) {
            const index = z * size + x;

            // Normalize coordinates to 0-1 range
            const nx = x / size;
            const nz = z / size;

            // Generate fractal noise value with time offset for animation
            const height = getFractalNoise(
              simplex,
              nx + timeOffset,
              nz + timeOffset,
              octaves,
              persistence,
              lacunarity,
              frequency,
            );

            heightmap[index] = height;

            // Track min/max for metadata
            if (height < minHeight) minHeight = height;
            if (height > maxHeight) maxHeight = height;
          }
        }

        // Step 3: Apply radial mask for island preset
        let finalHeightmap: Float32Array = heightmap;

        if (preset === "islands") {
          // Apply radial falloff to create circular islands
          const maskedHeightmap = applyRadialMask(heightmap, size, 0.7, 2.0);
          finalHeightmap = new Float32Array(maskedHeightmap);

          // Recalculate min/max after masking
          minHeight = Infinity;
          maxHeight = -Infinity;

          for (let i = 0; i < finalHeightmap.length; i++) {
            const h = finalHeightmap[i];
            if (h < minHeight) minHeight = h;
            if (h > maxHeight) maxHeight = h;
          }
        }

        // Step 4: Create color array from heightmap
        const colorArray = createColorArray(finalHeightmap, colorScheme);

        // Step 5: Build geometry
        const geometry = buildTerrainGeometry(
          finalHeightmap,
          size,
          heightScale,
          colorArray,
        );

        // Step 6: Create heightmap data structure
        const heightmapData: HeightmapData = {
          width: size,
          height: size,
          data: finalHeightmap,
          minHeight,
          maxHeight,
        };

        // Update local state
        setLocalHeightmap(finalHeightmap);
        setLocalGeometry(geometry);

        // Update context
        setHeightmap(heightmapData);
        setGeometry(geometry);
      } catch (error) {
        console.error("Terrain generation failed:", error);

        // Reset on error
        setLocalHeightmap(null);
        setLocalGeometry(null);
        setHeightmap(null);
        setGeometry(null);
      } finally {
        setIsGenerating(false);
      }
    }, 0);
  }, [config, setHeightmap, setGeometry]);

  /**
   * Auto-regenerate when animation is playing
   * Regenerates every ~0.5 seconds of animation time for smooth morphing
   */
  useEffect(() => {
    if (config.animation?.enabled && config.animation.time > 0) {
      // Regenerate every time the animation time crosses a 0.5 second boundary
      const timeThreshold = Math.floor(config.animation.time / 0.5);
      const prevThreshold = Math.floor((config.animation.time - 0.1) / 0.5);

      if (timeThreshold > prevThreshold) {
        generate();
      }
    }
  }, [config.animation?.enabled, config.animation?.time, generate]);

  return {
    heightmap: localHeightmap,
    geometry: localGeometry,
    isGenerating,
    generate,
  };
}

/**
 * Generate heightmap only (without geometry)
 *
 * Useful for scenarios where you only need the height data,
 * such as exporting heightmap images or analysis.
 *
 * @param config - Terrain configuration
 * @returns Heightmap data structure
 *
 * @example
 * const heightmapData = generateHeightmapOnly(config);
 * exportHeightmapToPNG(heightmapData);
 */
export function generateHeightmapOnly(config: {
  size: number;
  seed: string;
  octaves: number;
  persistence: number;
  lacunarity: number;
  frequency: number;
  preset: string;
}): HeightmapData {
  const { size, seed, octaves, persistence, lacunarity, frequency, preset } =
    config;

  // Initialize noise generator
  const simplex = new SimplexNoise(seed);

  // Generate heightmap
  const heightmap = new Float32Array(size * size);
  let minHeight = Infinity;
  let maxHeight = -Infinity;

  for (let z = 0; z < size; z++) {
    for (let x = 0; x < size; x++) {
      const index = z * size + x;
      const nx = x / size;
      const nz = z / size;

      const height = getFractalNoise(
        simplex,
        nx,
        nz,
        octaves,
        persistence,
        lacunarity,
        frequency,
      );

      heightmap[index] = height;
      if (height < minHeight) minHeight = height;
      if (height > maxHeight) maxHeight = height;
    }
  }

  // Apply island mask if needed
  let finalHeightmap: Float32Array = heightmap;

  if (preset === "islands") {
    const maskedHeightmap = applyRadialMask(heightmap, size, 0.7, 2.0);
    finalHeightmap = new Float32Array(maskedHeightmap);

    minHeight = Infinity;
    maxHeight = -Infinity;

    for (let i = 0; i < finalHeightmap.length; i++) {
      const h = finalHeightmap[i];
      if (h < minHeight) minHeight = h;
      if (h > maxHeight) maxHeight = h;
    }
  }

  return {
    width: size,
    height: size,
    data: finalHeightmap,
    minHeight,
    maxHeight,
  };
}
