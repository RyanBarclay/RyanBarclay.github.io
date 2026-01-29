/**
 * TerrainMesh.tsx
 * 
 * React Three Fiber component for rendering procedural terrain with LOD.
 * 
 * Features:
 * - Dynamic LOD chunks based on camera distance
 * - Automatic regeneration on terrain size changes
 * - Performance-optimized with frame-skipped updates
 * - Backward compatible with Phase B interface
 * 
 * Phase C implementation - LOD system integrated
 */

import { useEffect } from 'react';
import { useTerrainContext } from '../../context/TerrainContext';
import { useLODSystem } from '../../hooks/useLODSystem';
import LODChunk from './LODChunk';

/**
 * TerrainMesh component
 * 
 * Renders the procedural terrain using dynamic LOD chunks.
 * Replaces single-mesh approach with distance-based detail levels.
 * 
 * @returns R3F group containing multiple LODChunk components
 * 
 * @example
 * <Canvas>
 *   <TerrainMesh />
 * </Canvas>
 */
export default function TerrainMesh() {
  const { config } = useTerrainContext();
  
  // Initialize LOD system with terrain parameters
  const { chunks, reset } = useLODSystem({
    terrainSize: config.size,
    maxLODLevel: 3,  // Reduced from 4 to 3 for smoother transitions
    updateInterval: 4, // Update every 4 frames (was 2) - reduces popping
    enabled: true
  });

  // Reset LOD system when terrain size changes
  // This rebuilds the quadtree for new dimensions
  useEffect(() => {
    reset();
  }, [config.size, reset]);

  return (
    <group>
      {chunks.map((chunk) => (
        <LODChunk
          key={`${chunk.bounds.minX}-${chunk.bounds.minZ}-${chunk.lodLevel}`}
          bounds={chunk.bounds}
          lodLevel={chunk.lodLevel}
          heightScale={config.heightScale}
          wireframe={config.wireframe}
          colorScheme={config.colorScheme}
        />
      ))}
    </group>
  );
}
