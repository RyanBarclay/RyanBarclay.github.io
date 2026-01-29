/**
 * Core TypeScript interfaces for Procedural Terrain Generator
 */

/**
 * Preset terrain type options
 */
export type TerrainPreset = 'mountains' | 'islands' | 'canyons' | 'valleys' | 'custom';

/**
 * Color scheme options for terrain visualization
 */
export type ColorScheme = 'bc-nature' | 'grayscale';

/**
 * Animation configuration
 */
export interface AnimationConfig {
  enabled: boolean;
  speed: number;      // Animation speed multiplier (0.1 - 5.0)
  time: number;       // Current animation time
}

/**
 * Main terrain generation configuration
 */
export interface TerrainConfig {
  // Basic parameters
  size: number;              // Grid size: 16-512 (power of 2)
  heightScale: number;       // Height multiplier: 1-100
  seed: string;              // Random seed for reproducibility
  
  // Noise parameters
  octaves: number;           // Number of noise layers: 1-8
  persistence: number;       // Amplitude decay per octave: 0.1-1.0
  lacunarity: number;        // Frequency increase per octave: 1.5-4.0
  frequency: number;         // Base noise frequency: 0.5-5.0
  
  // Visual settings
  preset: TerrainPreset;
  colorScheme: ColorScheme;
  wireframe: boolean;
  
  // Animation
  animation: AnimationConfig;
}

/**
 * Level of Detail configuration
 */
export interface LODLevel {
  resolution: number;        // Grid density (vertices per side)
  minDistance: number;       // Minimum camera distance for this LOD
  maxDistance: number;       // Maximum camera distance for this LOD
}

/**
 * Performance statistics for monitoring
 */
export interface PerformanceStats {
  fps: number;               // Frames per second
  triangleCount: number;     // Total triangles rendered
  vertexCount: number;       // Total vertices
  drawCalls: number;         // Number of draw calls
  memoryUsage: number;       // Estimated GPU memory (MB)
  lastUpdateTime: number;    // Timestamp of last update
}

/**
 * Terrain chunk for LOD system
 */
export interface TerrainChunk {
  id: string;                // Unique identifier
  position: [number, number, number]; // World position [x, y, z]
  size: number;              // Chunk size
  lodLevel: number;          // Current LOD level (0 = highest detail)
  resolution: number;        // Grid resolution
  heightData: Float32Array;  // Height values
  visible: boolean;          // Visibility flag
}

/**
 * Quadtree node for spatial partitioning
 */
export interface QuadtreeNode {
  bounds: {
    minX: number;
    maxX: number;
    minZ: number;
    maxZ: number;
  };
  center: [number, number, number];
  size: number;
  depth: number;
  children: QuadtreeNode[] | null;  // null for leaf nodes
  chunk: TerrainChunk | null;       // null for parent nodes
}

/**
 * Noise preset configuration
 */
export interface NoisePreset {
  name: string;
  octaves: number;
  persistence: number;
  lacunarity: number;
  frequency: number;
  heightScale: number;
  description: string;
}

/**
 * Color mapping configuration
 */
export interface ColorMapping {
  elevation: number;         // Height threshold (0-1)
  color: string;             // Hex color
}

/**
 * Export format options
 */
export type ExportFormat = 'obj' | 'stl' | 'heightmap';

/**
 * Export configuration
 */
export interface ExportConfig {
  format: ExportFormat;
  filename: string;
  includeTexture: boolean;   // For OBJ format
  resolution: number;        // Export resolution (may differ from display)
}

/**
 * Gradient direction for 2D noise
 */
export interface Gradient2D {
  x: number;
  y: number;
}

/**
 * Simplex noise vertex contribution
 */
export interface SimplexContribution {
  x: number;
  y: number;
  t: number;               // Attenuation factor
  gradient: Gradient2D;
}

/**
 * Terrain context state
 */
export interface TerrainContextState {
  config: TerrainConfig;
  updateConfig: (partial: Partial<TerrainConfig>) => void;
  resetConfig: () => void;
  applyPreset: (preset: TerrainPreset) => void;
  regenerate: () => void;
  isGenerating: boolean;
}

/**
 * Heightmap data structure
 */
export interface HeightmapData {
  width: number;
  height: number;
  data: Float32Array;       // Height values in range [0, 1]
  minHeight: number;        // Actual minimum height
  maxHeight: number;        // Actual maximum height
}
