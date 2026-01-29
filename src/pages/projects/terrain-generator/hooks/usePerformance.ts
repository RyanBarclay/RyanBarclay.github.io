import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";

/**
 * Performance statistics for the R3F scene
 */
interface PerformanceStats {
  /** Frames per second */
  fps: number;
  /** Total triangle count (estimated) */
  triangles: number;
  /** Render draw calls */
  drawCalls: number;
  /** GPU memory usage in MB (estimated) */
  memoryUsage: number;
  /** Total geometry count */
  geometries: number;
  /** Total texture count */
  textures: number;
}

/**
 * Configuration options for performance monitoring
 */
interface UsePerformanceOptions {
  /** Update stats every N frames (default: 30) */
  updateInterval?: number;
  /** Enable monitoring (default: true) */
  enabled?: boolean;
}

/**
 * Hook for monitoring React Three Fiber scene performance
 *
 * Tracks FPS, triangle count, draw calls, and memory usage using WebGL renderer info.
 * Updates stats at configurable intervals to minimize performance overhead.
 *
 * @param options - Performance monitoring configuration
 * @param options.updateInterval - How many frames between stat updates (default: 30)
 * @param options.enabled - Whether monitoring is active (default: true)
 *
 * @returns Current performance statistics
 *
 * @example
 * ```tsx
 * function TerrainScene() {
 *   const stats = usePerformance({ updateInterval: 30, enabled: true });
 *
 *   return (
 *     <div>
 *       <p>FPS: {stats.fps}</p>
 *       <p>Triangles: {stats.triangles.toLocaleString()}</p>
 *       <p>Draw Calls: {stats.drawCalls}</p>
 *       <p>Memory: {stats.memoryUsage.toFixed(1)} MB</p>
 *     </div>
 *   );
 * }
 * ```
 *
 * @remarks
 * - FPS is calculated from frame count over elapsed time
 * - Triangle count is estimated from geometry count (rough approximation)
 * - Memory usage is estimated from geometries and textures
 * - Uses frame skipping to reduce overhead (only updates every N frames)
 */
export function usePerformance(
  options: UsePerformanceOptions = {},
): PerformanceStats {
  const { updateInterval = 30, enabled = true } = options;
  const { gl } = useThree();

  const [stats, setStats] = useState<PerformanceStats>({
    fps: 60,
    triangles: 0,
    drawCalls: 0,
    memoryUsage: 0,
    geometries: 0,
    textures: 0,
  });

  // Track frame count since last update
  const frameCountRef = useRef(0);
  // Timestamp of last stats update
  const lastTimeRef = useRef(Date.now());
  // Frame count for FPS calculation
  const framesRef = useRef(0);

  useFrame(() => {
    if (!enabled) return;

    frameCountRef.current++;
    framesRef.current++;

    // Update stats every N frames to reduce overhead
    if (frameCountRef.current % updateInterval !== 0) return;

    const now = Date.now();
    const delta = (now - lastTimeRef.current) / 1000; // Convert to seconds

    // Calculate FPS from frames counted over elapsed time
    const fps = Math.round(framesRef.current / delta);

    // Get WebGL renderer info
    const info = gl.info;
    const memory = info.memory;
    const render = info.render;

    // Update all performance statistics
    setStats({
      fps,
      // Rough estimate: assume ~1000 triangles per geometry on average
      triangles: memory.geometries * 1000,
      drawCalls: render.calls,
      // Rough memory estimate: 0.5 MB per geometry + 2 MB per texture
      memoryUsage: memory.geometries * 0.5 + memory.textures * 2,
      geometries: memory.geometries,
      textures: memory.textures,
    });

    // Reset counters for next interval
    lastTimeRef.current = now;
    framesRef.current = 0;
  });

  return stats;
}
