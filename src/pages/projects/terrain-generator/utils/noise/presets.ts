/**
 * Predefined Terrain Presets
 * 
 * Provides carefully tuned configurations for different terrain types:
 * - Mountains: High peaks with sharp features
 * - Islands: Circular landmass with radial falloff
 * - Canyons: Sharp ridges and deep valleys
 * - Valleys: Rolling hills with gentle slopes
 */

import { TerrainConfig, TerrainPreset } from '../../types';

/**
 * Preset configuration for mountain terrain
 * 
 * Characteristics:
 * - High octaves (8) for detailed rocky features
 * - High persistence (0.65) to preserve detail at all scales
 * - High lacunarity (2.5) for varied peak heights
 * - Moderate frequency (1.2) for natural mountain spacing
 * - High height scale (80) for dramatic elevation changes
 */
const mountainsPreset: Partial<TerrainConfig> = {
  octaves: 8,
  persistence: 0.65,
  lacunarity: 2.5,
  frequency: 1.2,
  heightScale: 80,
  preset: 'mountains',
};

/**
 * Preset configuration for island terrain
 * 
 * Characteristics:
 * - Moderate octaves (6) for varied coastline
 * - Balanced persistence (0.5) for natural features
 * - Standard lacunarity (2.0) for organic shapes
 * - Base frequency (1.0) for island-scale features
 * - Moderate height scale (50) for gentle elevation
 * 
 * Note: Requires radial mask application for circular landmass
 */
const islandsPreset: Partial<TerrainConfig> = {
  octaves: 6,
  persistence: 0.5,
  lacunarity: 2.0,
  frequency: 1.0,
  heightScale: 50,
  preset: 'islands',
};

/**
 * Preset configuration for canyon terrain
 * 
 * Characteristics:
 * - High octaves (7) for detailed erosion patterns
 * - Moderate-high persistence (0.55) for sharp features
 * - High lacunarity (2.2) for varied canyon depths
 * - High frequency (1.5) for tight canyon formations
 * - High height scale (70) for deep valleys
 * 
 * Note: Should use ridged noise variant for characteristic canyon walls
 */
const canyonsPreset: Partial<TerrainConfig> = {
  octaves: 7,
  persistence: 0.55,
  lacunarity: 2.2,
  frequency: 1.5,
  heightScale: 70,
  preset: 'canyons',
};

/**
 * Preset configuration for valley terrain
 * 
 * Characteristics:
 * - Low octaves (3) for smooth, rolling hills
 * - Low persistence (0.4) for gentle slopes
 * - Standard lacunarity (2.0) for natural variation
 * - Low frequency (0.6) for large-scale features
 * - Low height scale (30) for subtle elevation changes
 */
const valleysPreset: Partial<TerrainConfig> = {
  octaves: 3,
  persistence: 0.4,
  lacunarity: 2.0,
  frequency: 0.6,
  heightScale: 30,
  preset: 'valleys',
};

/**
 * Get terrain configuration for a specific preset
 * 
 * @param preset - The terrain preset type
 * @returns Partial configuration object with preset-specific parameters
 * @throws Error if preset is 'custom' (custom has no preset config)
 */
export function getPresetConfig(preset: TerrainPreset): Partial<TerrainConfig> {
  switch (preset) {
    case 'mountains':
      return mountainsPreset;
    case 'islands':
      return islandsPreset;
    case 'canyons':
      return canyonsPreset;
    case 'valleys':
      return valleysPreset;
    case 'custom':
      throw new Error('Custom preset has no predefined configuration');
    default:
      // TypeScript exhaustiveness check
      const _exhaustive: never = preset;
      throw new Error(`Unknown preset: ${_exhaustive}`);
  }
}

/**
 * Apply radial distance-based mask to heightmap for island generation
 * 
 * Creates a circular falloff from center, useful for creating island landmasses
 * surrounded by water. Heights are multiplied by a gradient that goes from 1.0
 * at the center to 0.0 at the edges.
 * 
 * Algorithm:
 * - Calculate normalized distance from center [0, 1]
 * - Apply smoothstep falloff for natural transition
 * - Multiply original height by mask value
 * 
 * @param heightmap - Input height values (modified in place)
 * @param size - Grid size (width/height)
 * @param falloff - Falloff sharpness (0.1-2.0, higher = sharper edge)
 * @returns Modified heightmap with radial mask applied
 */
export function applyRadialMask(
  heightmap: Float32Array,
  size: number,
  falloff: number = 1.0
): Float32Array {
  const center = size / 2;
  const maxDistance = center * Math.sqrt(2); // Diagonal distance to corner
  
  for (let z = 0; z < size; z++) {
    for (let x = 0; x < size; x++) {
      const index = z * size + x;
      
      // Calculate distance from center
      const dx = x - center;
      const dz = z - center;
      const distance = Math.sqrt(dx * dx + dz * dz);
      
      // Normalize distance to [0, 1]
      const normalizedDist = distance / maxDistance;
      
      // Apply falloff with smoothstep for natural transition
      // smoothstep(edge0, edge1, x) = 3x² - 2x³ where x is clamped to [0, 1]
      const edge0 = 0.3; // Start falloff at 30% from center
      const edge1 = 1.0; // Complete falloff at edge
      
      let t = (normalizedDist - edge0) / (edge1 - edge0);
      t = Math.max(0, Math.min(1, t)); // Clamp to [0, 1]
      
      // Apply falloff power
      const smoothT = t * t * (3 - 2 * t); // Smoothstep formula
      const mask = 1.0 - Math.pow(smoothT, falloff);
      
      // Apply mask to height (reduces height near edges)
      heightmap[index] *= mask;
    }
  }
  
  return heightmap;
}

/**
 * All available preset configurations
 * Useful for preset selector UI components
 */
export const TERRAIN_PRESETS = {
  mountains: mountainsPreset,
  islands: islandsPreset,
  canyons: canyonsPreset,
  valleys: valleysPreset,
} as const;

/**
 * Get list of all available preset names
 * 
 * @returns Array of preset names (excludes 'custom')
 */
export function getPresetNames(): TerrainPreset[] {
  return ['mountains', 'islands', 'canyons', 'valleys'];
}

/**
 * Check if a preset requires special processing
 * 
 * @param preset - The terrain preset type
 * @returns Object indicating special requirements
 */
export function getPresetRequirements(preset: TerrainPreset): {
  useRidgedNoise: boolean;
  useRadialMask: boolean;
} {
  return {
    useRidgedNoise: preset === 'canyons',
    useRadialMask: preset === 'islands',
  };
}
