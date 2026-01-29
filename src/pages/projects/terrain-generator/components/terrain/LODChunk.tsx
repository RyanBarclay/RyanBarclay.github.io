/**
 * LODChunk.tsx
 * 
 * Individual terrain chunk with specific Level of Detail (LOD).
 * 
 * Features:
 * - Renders a single chunk of terrain at a specific LOD level
 * - Dynamically generates geometry for chunk bounds
 * - Uses existing noise and geometry utilities from Phase A/B
 * - Performance optimized with useMemo caching
 * - Proper cleanup with geometry disposal
 * 
 * Phase C - Group 1C implementation
 */

import React, { useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useTerrainContext } from '../../context/TerrainContext';
import { buildTerrainGeometry } from '../../utils/mesh/geometryBuilder';
import { createColorArray } from '../../utils/color/colorMapper';
import type { ColorScheme } from '../../types';

/**
 * LODChunk component props
 */
interface LODChunkProps {
  /** Chunk bounds in world space */
  bounds: {
    minX: number;
    maxX: number;
    minZ: number;
    maxZ: number;
  };
  /** LOD level (0 = highest detail, 3 = lowest) */
  lodLevel: number;
  /** Terrain height multiplier */
  heightScale: number;
  /** Enable wireframe mode */
  wireframe: boolean;
  /** Color scheme for terrain */
  colorScheme: ColorScheme;
}

/**
 * LODChunk - Renders a single terrain chunk at specific LOD level
 * 
 * Generates heightmap and geometry for a specific chunk region.
 * Resolution decreases with higher LOD levels (128 → 64 → 32 → 16).
 * 
 * @param props - LODChunk configuration
 * @returns R3F mesh element
 * 
 * @example
 * <LODChunk
 *   bounds={{ minX: 0, maxX: 128, minZ: 0, maxZ: 128 }}
 *   lodLevel={1}
 *   heightScale={50}
 *   wireframe={false}
 *   colorScheme="bc-nature"
 * />
 */
export default function LODChunk({
  bounds,
  lodLevel,
  heightScale,
  wireframe,
  colorScheme
}: LODChunkProps) {
  const { config, heightmap: storedHeightmap } = useTerrainContext();
  
  /**
   * Generate chunk geometry with useMemo caching
   * Recalculates only when dependencies change
   * 
   * CRITICAL: Only depends on visual parameters (heightScale, colorScheme, wireframe)
   * and chunk structure (bounds, lodLevel). Does NOT depend on noise parameters
   * (octaves, persistence, etc.) - those only affect generation, not rendering.
   */
  const geometry = useMemo(() => {
    // If no heightmap generated yet, return empty geometry
    if (!storedHeightmap) {
      return new THREE.BufferGeometry();
    }
    
    // Calculate chunk dimensions
    const chunkWidth = bounds.maxX - bounds.minX;
    const chunkDepth = bounds.maxZ - bounds.minZ;
    
    // Calculate resolution based on CHUNK size and LOD level
    const baseResolution = Math.round(chunkWidth);
    const resolution = baseResolution >> lodLevel;
    
    // Sample heightmap for this chunk by reading from stored heightmap
    const chunkHeightmap = new Float32Array(resolution * resolution);
    const terrainSize = storedHeightmap.width;
    
    for (let z = 0; z < resolution; z++) {
      for (let x = 0; x < resolution; x++) {
        // Map grid coordinates to world coordinates within chunk bounds
        const worldX = bounds.minX + (x / (resolution - 1)) * chunkWidth;
        const worldZ = bounds.minZ + (z / (resolution - 1)) * chunkDepth;
        
        // Convert world coordinates to heightmap indices
        // Heightmap is centered at origin, so add halfSize to get [0, terrainSize] range
        const halfSize = terrainSize / 2;
        const hmapX = Math.floor((worldX + halfSize) / terrainSize * terrainSize);
        const hmapZ = Math.floor((worldZ + halfSize) / terrainSize * terrainSize);
        
        // Clamp to valid range and sample stored heightmap
        const clampedX = Math.max(0, Math.min(terrainSize - 1, hmapX));
        const clampedZ = Math.max(0, Math.min(terrainSize - 1, hmapZ));
        const hmapIndex = clampedZ * terrainSize + clampedX;
        
        chunkHeightmap[z * resolution + x] = storedHeightmap.data[hmapIndex];
      }
    }
    
    // Generate color array from heightmap
    const colorArray = createColorArray(chunkHeightmap, colorScheme);
    
    // Build Three.js BufferGeometry (with heightScale = 1, we'll apply scaling via transform)
    const geo = buildTerrainGeometry(
      chunkHeightmap,
      resolution,
      1, // Always use 1 for geometry, apply heightScale as transform
      colorArray,
      chunkWidth
    );
    
    return geo;
  }, [
    bounds.minX,
    bounds.maxX,
    bounds.minZ,
    bounds.maxZ,
    lodLevel,
    colorScheme,
    storedHeightmap, // Only regenerate when stored heightmap changes (i.e., Generate clicked)
  ]);
  
  /**
   * Cleanup geometry on unmount or when geometry changes
   */
  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);
  
  /**
   * Position mesh at chunk origin (bottom-left corner)
   * Geometry is built in Y-up orientation (XZ plane)
   * HeightScale applied as Y-scale transform (no geometry rebuild needed)
   */
  return (
    <mesh 
      geometry={geometry} 
      position={[bounds.minX, 0, bounds.minZ]}
      scale={[1, heightScale, 1]}  // Apply heightScale as Y-scale
    >
      <meshStandardMaterial 
        vertexColors              // Use vertex colors from geometry
        wireframe={wireframe}     // Toggle wireframe mode
        flatShading={false}       // Use smooth normals for lighting
        side={2}                  // DoubleSide rendering to prevent face culling
      />
    </mesh>
  );
}
