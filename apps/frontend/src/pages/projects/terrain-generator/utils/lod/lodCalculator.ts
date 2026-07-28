/**
 * LOD Calculator - Distance-based Level-of-Detail calculation
 * Phase C - Group 1B: LOD Calculator
 */

import { LODLevel } from "../../types";

/**
 * Calculate LOD level based on distance from camera
 * @param distance - Distance from camera to chunk center
 * @param lodLevels - Array of LOD configurations with distance thresholds
 * @returns LOD level (0 = highest detail, 3+ = lowest)
 */
export function calculateLODLevel(
  distance: number,
  lodLevels: LODLevel[],
): number {
  // Sort by minDistance to ensure correct order (should already be sorted)
  const sortedLevels = [...lodLevels].sort(
    (a, b) => a.minDistance - b.minDistance,
  );

  // Find the appropriate LOD level based on distance
  for (let i = 0; i < sortedLevels.length; i++) {
    const level = sortedLevels[i];
    if (distance >= level.minDistance && distance < level.maxDistance) {
      return i;
    }
  }

  // If distance exceeds all thresholds, return the lowest detail level
  return sortedLevels.length - 1;
}

/**
 * Get default LOD configuration for terrain system
 * @param terrainSize - Size of terrain (e.g., 256)
 * @returns Array of LOD level configurations
 */
export function getDefaultLODLevels(terrainSize: number): LODLevel[] {
  // Scale LOD distances based on terrain size
  // Larger terrains need longer view distances
  // REDUCED to 3 levels with MUCH larger distance thresholds for smoother, less aggressive transitions
  const baseScale = terrainSize / 256;

  return [
    {
      resolution: Math.min(128, terrainSize / 2),
      minDistance: 0,
      maxDistance: 200 * baseScale, // Was 50 - now 4× farther
    },
    {
      resolution: Math.min(64, terrainSize / 4),
      minDistance: 200 * baseScale, // Was 50
      maxDistance: 600 * baseScale, // Was 150 - now 4× farther
    },
    {
      resolution: Math.min(32, terrainSize / 8),
      minDistance: 600 * baseScale, // Was 150
      maxDistance: Infinity, // Keep lowest LOD for very far terrain
    },
  ];
}

/**
 * Calculate distance from camera to chunk bounds
 * Uses closest point on AABB (Axis-Aligned Bounding Box) for accurate distance
 * @param cameraPos - Camera position [x, y, z]
 * @param chunkBounds - Chunk boundaries
 * @returns Distance in world units
 */
export function getCameraChunkDistance(
  cameraPos: [number, number, number],
  chunkBounds: { minX: number; maxX: number; minZ: number; maxZ: number },
): number {
  const [camX, _camY, camZ] = cameraPos;

  // Find the closest point on the chunk boundary to the camera
  // Clamp camera position to chunk bounds
  const closestX = Math.max(chunkBounds.minX, Math.min(camX, chunkBounds.maxX));
  const closestZ = Math.max(chunkBounds.minZ, Math.min(camZ, chunkBounds.maxZ));

  // Calculate Euclidean distance in XZ plane (ignore Y for terrain LOD)
  const dx = camX - closestX;
  const dz = camZ - closestZ;

  return Math.sqrt(dx * dx + dz * dz);
}

/**
 * Calculate grid resolution for LOD level
 * Resolution decreases exponentially with LOD level
 * @param lodLevel - LOD level (0-3)
 * @param chunkSize - Size of chunk
 * @returns Grid resolution (vertices per side)
 */
export function getLODResolution(lodLevel: number, chunkSize: number): number {
  // LOD 0: Full resolution (128 or chunkSize/2)
  // LOD 1: Half resolution (64)
  // LOD 2: Quarter resolution (32)
  // LOD 3: Eighth resolution (16)

  const baseResolution = Math.min(128, chunkSize / 2);
  const resolution = baseResolution / Math.pow(2, lodLevel);

  // Clamp to minimum of 4 vertices (to maintain triangle mesh)
  return Math.max(4, Math.floor(resolution));
}

/**
 * Determine if LOD transition should occur
 * Uses hysteresis to prevent flickering when camera is near LOD boundary
 * @param currentLOD - Current LOD level
 * @param targetLOD - Target LOD level based on current distance
 * @param hysteresis - Distance buffer to prevent flickering (default: 5)
 * @returns true if transition should occur
 */
export function shouldTransitionLOD(
  currentLOD: number,
  targetLOD: number,
  hysteresis: number = 5,
): boolean {
  // No transition needed if LODs match
  if (currentLOD === targetLOD) {
    return false;
  }

  // Transition to higher detail (lower LOD number): immediate
  if (targetLOD < currentLOD) {
    return true;
  }

  // Transition to lower detail (higher LOD number): apply hysteresis
  // Only transition if the distance is significantly beyond the threshold
  // This prevents rapid LOD switching when camera is near the boundary

  // Note: Hysteresis is handled in the distance calculation by the caller
  // This function just determines if the LOD values are different enough
  // to warrant a transition

  return Math.abs(targetLOD - currentLOD) >= 1;
}

/**
 * Calculate hysteresis-adjusted distance for LOD stability
 * Adds a buffer zone to prevent rapid LOD switching
 * @param distance - Raw distance from camera to chunk
 * @param currentLOD - Current LOD level
 * @param targetLOD - Target LOD level based on raw distance
 * @param hysteresis - Hysteresis buffer in world units
 * @returns Adjusted distance for LOD calculation
 */
export function applyDistanceHysteresis(
  distance: number,
  currentLOD: number,
  targetLOD: number,
  hysteresis: number = 5,
): number {
  // No adjustment if LODs match
  if (currentLOD === targetLOD) {
    return distance;
  }

  // Moving to lower detail (increasing LOD level)
  // Add hysteresis to make transition less eager
  if (targetLOD > currentLOD) {
    return distance - hysteresis;
  }

  // Moving to higher detail (decreasing LOD level)
  // Subtract hysteresis to make transition more eager
  return distance + hysteresis;
}

/**
 * Calculate chunk center position from bounds
 * @param chunkBounds - Chunk boundaries
 * @returns Center position [x, y, z]
 */
export function getChunkCenter(chunkBounds: {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}): [number, number, number] {
  const centerX = (chunkBounds.minX + chunkBounds.maxX) / 2;
  const centerZ = (chunkBounds.minZ + chunkBounds.maxZ) / 2;
  return [centerX, 0, centerZ];
}

/**
 * Get LOD level info for debugging
 * @param lodLevel - LOD level
 * @param lodLevels - Array of LOD configurations
 * @returns Human-readable LOD info
 */
export function getLODDebugInfo(
  lodLevel: number,
  lodLevels: LODLevel[],
): {
  level: number;
  resolution: number;
  distanceRange: string;
  vertexCount: number;
  triangleCount: number;
} {
  const config = lodLevels[lodLevel];
  const vertexCount = config.resolution * config.resolution;
  const triangleCount = (config.resolution - 1) * (config.resolution - 1) * 2;

  return {
    level: lodLevel,
    resolution: config.resolution,
    distanceRange: `${config.minDistance.toFixed(0)}-${
      config.maxDistance === Infinity ? "∞" : config.maxDistance.toFixed(0)
    }`,
    vertexCount,
    triangleCount,
  };
}
