/**
 * useLODSystem.ts
 *
 * React hook for managing LOD (Level of Detail) system integration.
 *
 * Features:
 * - Manages quadtree state for spatial partitioning
 * - Updates LOD levels based on camera position (per-frame)
 * - Returns visible chunks ready for rendering
 * - Performance optimized with frame skipping and memoization
 * - Integrates seamlessly with React Three Fiber's useFrame
 *
 * Phase C - Sequential: useLODSystem Hook
 */

import { useState, useCallback, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Quadtree, type QuadtreeNode } from "../utils/lod/quadtree";
import { getDefaultLODLevels } from "../utils/lod/lodCalculator";

/**
 * Configuration options for useLODSystem hook
 */
export interface UseLODSystemOptions {
  /** Total terrain size in world units (e.g., 256) */
  terrainSize: number;

  /** Maximum LOD subdivision level (e.g., 4) */
  maxLODLevel: number;

  /** Frame skip interval for LOD updates (1 = every frame, 2 = every other frame)
   * Higher values improve performance but may cause visible LOD popping
   * @default 1
   */
  updateInterval?: number;

  /** Enable/disable LOD system
   * When disabled, hook still returns chunks but doesn't update LOD
   * @default true
   */
  enabled?: boolean;
}

/**
 * Statistics about the current LOD state
 */
export interface LODStats {
  /** Total number of chunks in the quadtree */
  totalChunks: number;

  /** Number of visible/rendered chunks */
  visibleChunks: number;

  /** Number of chunks at highest detail (LOD level 0) */
  highDetailChunks: number;

  /** Number of chunks at low detail (LOD level 2+) */
  lowDetailChunks: number;
}

/**
 * Return value from useLODSystem hook
 */
export interface UseLODSystemReturn {
  /** Array of visible chunks to render */
  chunks: QuadtreeNode[];

  /** Performance and LOD statistics */
  stats: LODStats;

  /** Manually trigger LOD update (usually handled by useFrame)
   * @param cameraPos - Camera position [x, y, z]
   */
  updateLOD: (cameraPos: [number, number, number]) => void;

  /** Reset quadtree to initial state */
  reset: () => void;
}

/**
 * React hook for managing terrain LOD system
 *
 * Manages quadtree spatial partitioning and automatically updates
 * LOD levels based on camera distance. Uses React Three Fiber's
 * useFrame for per-frame updates with optional frame skipping.
 *
 * **Must be called inside React Three Fiber <Canvas> context.**
 *
 * @param options - LOD system configuration
 * @returns Chunks to render, stats, and control functions
 *
 * @example
 * ```tsx
 * function TerrainMesh() {
 *   const { chunks, stats } = useLODSystem({
 *     terrainSize: 256,
 *     maxLODLevel: 4,
 *     updateInterval: 2, // Update every 2 frames
 *     enabled: true
 *   });
 *
 *   return (
 *     <>
 *       {chunks.map((chunk, i) => (
 *         <LODChunk
 *           key={i}
 *           bounds={chunk.bounds}
 *           lodLevel={chunk.lodLevel}
 *           heightScale={50}
 *           wireframe={false}
 *           colorScheme="bc-nature"
 *         />
 *       ))}
 *     </>
 *   );
 * }
 * ```
 */
export function useLODSystem(options: UseLODSystemOptions): UseLODSystemReturn {
  const {
    terrainSize,
    maxLODLevel,
    updateInterval = 1,
    enabled = true,
  } = options;

  // Initialize quadtree once (persists for component lifetime)
  const [quadtree] = useState(() => {
    const tree = new Quadtree(terrainSize, maxLODLevel);
    tree.buildFullTree();
    return tree;
  });

  // Track visible chunks for rendering
  const [visibleChunks, setVisibleChunks] = useState<QuadtreeNode[]>(() =>
    quadtree.getVisibleChunks(),
  );

  // Frame counter for update interval
  const frameCountRef = useRef(0);

  // Get LOD distance thresholds (cached)
  const lodThresholds = useMemo(
    () => getDefaultLODLevels(terrainSize).map((level) => level.maxDistance),
    [terrainSize],
  );

  /**
   * Manual LOD update function
   * Used internally by useFrame, but exposed for manual control
   */
  const updateLOD = useCallback(
    (cameraPos: [number, number, number]) => {
      if (!enabled) return;

      // Update quadtree LOD levels based on camera distance
      quadtree.updateLOD(cameraPos[0], cameraPos[2], lodThresholds);

      // Get updated visible chunks and trigger re-render
      setVisibleChunks(quadtree.getVisibleChunks());
    },
    [enabled, quadtree, lodThresholds],
  );

  /**
   * Reset quadtree to initial state
   * Useful when terrain configuration changes
   */
  const reset = useCallback(() => {
    quadtree.clear();
    quadtree.buildFullTree();
    setVisibleChunks(quadtree.getVisibleChunks());
  }, [quadtree]);

  /**
   * Automatic per-frame LOD updates
   * Uses React Three Fiber's useFrame for camera tracking
   */
  useFrame((state) => {
    if (!enabled) return;

    // Frame skipping for performance
    // updateInterval = 1: update every frame
    // updateInterval = 2: update every other frame
    frameCountRef.current++;
    if (frameCountRef.current % updateInterval !== 0) return;

    // Extract camera position from R3F state
    const camera = state.camera;
    const cameraPos: [number, number, number] = [
      camera.position.x,
      camera.position.y,
      camera.position.z,
    ];

    // Update LOD system
    updateLOD(cameraPos);
  });

  /**
   * Calculate LOD statistics
   * Memoized to avoid unnecessary recalculation
   */
  const stats: LODStats = useMemo(() => {
    const allLeaves = quadtree.getLeafNodes();

    return {
      totalChunks: allLeaves.length,
      visibleChunks: visibleChunks.length,
      highDetailChunks: visibleChunks.filter((c) => c.lodLevel === 0).length,
      lowDetailChunks: visibleChunks.filter((c) => c.lodLevel >= 2).length,
    };
  }, [visibleChunks, quadtree]);

  return {
    chunks: visibleChunks,
    stats,
    updateLOD,
    reset,
  };
}
