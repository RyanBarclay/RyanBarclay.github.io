/**
 * Color Mapper for Terrain
 * 
 * Maps elevation values to colors based on color scheme.
 * Supports BC Nature palette and grayscale schemes with smooth interpolation.
 * 
 * Uses elevation thresholds to create realistic terrain coloring:
 * - Deep water → Sand → Grass → Forest → Rock → Snow (BC Nature)
 * - Dark → Light gradient (Grayscale)
 */

import type { ColorScheme } from '../../types';
import {
  BC_NATURE_PALETTE_THREE,
  GRAYSCALE_PALETTE_THREE,
  ELEVATION_THRESHOLDS,
  lerpColor
} from './bcPalette';

/**
 * Create color array from heightmap
 * 
 * Maps normalized elevation values (0-1) to RGB colors using the specified
 * color scheme. Returns a flat Float32Array with 3 values per vertex (RGB).
 * 
 * @param heightmap - Normalized height values (0-1 range)
 * @param colorScheme - Color scheme to use ('bc-nature' or 'grayscale')
 * @returns Float32Array with RGB values (3 floats per vertex, range 0-1)
 * 
 * @example
 * const heightmap = new Float32Array([0.2, 0.5, 0.8, 1.0]);
 * const colors = createColorArray(heightmap, 'bc-nature');
 * // Returns: [r1, g1, b1, r2, g2, b2, r3, g3, b3, r4, g4, b4]
 */
export function createColorArray(
  heightmap: Float32Array,
  colorScheme: ColorScheme = 'bc-nature'
): Float32Array {
  const vertexCount = heightmap.length;
  const colors = new Float32Array(vertexCount * 3);
  
  for (let i = 0; i < vertexCount; i++) {
    const elevation = heightmap[i]; // Already normalized to [0, 1]
    const color = getColorForElevation(elevation, colorScheme);
    
    // Store RGB values
    const offset = i * 3;
    colors[offset] = color[0];
    colors[offset + 1] = color[1];
    colors[offset + 2] = color[2];
  }
  
  return colors;
}

/**
 * Get color for a specific elevation value
 * 
 * Uses elevation thresholds to determine color zones and smoothly
 * interpolates between adjacent colors for natural transitions.
 * 
 * @param elevation - Normalized elevation (0-1)
 * @param colorScheme - Color scheme to use
 * @returns RGB color as [r, g, b] in 0-1 range
 */
function getColorForElevation(
  elevation: number,
  colorScheme: ColorScheme
): [number, number, number] {
  // Clamp elevation to [0, 1] range
  const e = Math.max(0, Math.min(1, elevation));
  
  if (colorScheme === 'bc-nature') {
    return getBCNatureColor(e);
  } else {
    return getGrayscaleColor(e);
  }
}

/**
 * Get BC Nature palette color for elevation
 * 
 * Elevation zones (with smooth transitions):
 * - 0.00 - 0.30: Deep water
 * - 0.30 - 0.35: Deep water → Sand (beach)
 * - 0.35 - 0.50: Sand → Grass (lowlands)
 * - 0.50 - 0.70: Grass → Forest (foothills)
 * - 0.70 - 0.85: Forest → Rock (mountains)
 * - 0.85 - 1.00: Rock → Snow (peaks)
 * 
 * @param elevation - Normalized elevation (0-1)
 * @returns RGB color
 */
function getBCNatureColor(elevation: number): [number, number, number] {
  const thresholds = ELEVATION_THRESHOLDS;
  const palette = BC_NATURE_PALETTE_THREE;
  
  // Deep water zone
  if (elevation <= thresholds.deepWater) {
    return palette.deepWater;
  }
  
  // Beach transition (deep water → sand)
  if (elevation <= thresholds.sand) {
    const t = (elevation - thresholds.deepWater) / (thresholds.sand - thresholds.deepWater);
    return lerpColor(palette.deepWater, palette.sand, t);
  }
  
  // Lowlands transition (sand → grass)
  if (elevation <= thresholds.grass) {
    const t = (elevation - thresholds.sand) / (thresholds.grass - thresholds.sand);
    return lerpColor(palette.sand, palette.grass, t);
  }
  
  // Foothills transition (grass → forest)
  if (elevation <= thresholds.forest) {
    const t = (elevation - thresholds.grass) / (thresholds.forest - thresholds.grass);
    return lerpColor(palette.grass, palette.forest, t);
  }
  
  // Mountain transition (forest → rock)
  if (elevation <= thresholds.rock) {
    const t = (elevation - thresholds.forest) / (thresholds.rock - thresholds.forest);
    return lerpColor(palette.forest, palette.rock, t);
  }
  
  // Peak transition (rock → snow)
  if (elevation <= thresholds.snow) {
    const t = (elevation - thresholds.rock) / (thresholds.snow - thresholds.rock);
    return lerpColor(palette.rock, palette.snow, t);
  }
  
  // Above highest threshold
  return palette.snow;
}

/**
 * Get grayscale color for elevation
 * 
 * Maps elevation to 8-step grayscale gradient:
 * - 0.00 - 0.125: Darkest
 * - 0.125 - 0.25: Darker
 * - 0.25 - 0.375: Dark
 * - 0.375 - 0.5: Medium
 * - 0.5 - 0.625: Light
 * - 0.625 - 0.75: Lighter
 * - 0.75 - 0.875: Lightest
 * - 0.875 - 1.0: White
 * 
 * @param elevation - Normalized elevation (0-1)
 * @returns RGB color (grayscale)
 */
function getGrayscaleColor(elevation: number): [number, number, number] {
  const palette = GRAYSCALE_PALETTE_THREE;
  
  // 8 zones with smooth interpolation
  if (elevation <= 0.125) {
    const t = elevation / 0.125;
    return lerpColor(palette.darkest, palette.darker, t);
  }
  
  if (elevation <= 0.25) {
    const t = (elevation - 0.125) / 0.125;
    return lerpColor(palette.darker, palette.dark, t);
  }
  
  if (elevation <= 0.375) {
    const t = (elevation - 0.25) / 0.125;
    return lerpColor(palette.dark, palette.medium, t);
  }
  
  if (elevation <= 0.5) {
    const t = (elevation - 0.375) / 0.125;
    return lerpColor(palette.medium, palette.light, t);
  }
  
  if (elevation <= 0.625) {
    const t = (elevation - 0.5) / 0.125;
    return lerpColor(palette.light, palette.lighter, t);
  }
  
  if (elevation <= 0.75) {
    const t = (elevation - 0.625) / 0.125;
    return lerpColor(palette.lighter, palette.lightest, t);
  }
  
  if (elevation <= 0.875) {
    const t = (elevation - 0.75) / 0.125;
    return lerpColor(palette.lightest, palette.white, t);
  }
  
  // Above 0.875
  const t = (elevation - 0.875) / 0.125;
  return lerpColor(palette.lightest, palette.white, t);
}

/**
 * Apply radial mask to heightmap for island generation
 * 
 * Multiplies height values by a distance-based falloff function.
 * Creates circular islands with smooth coastlines.
 * 
 * @param heightmap - Original height values (0-1 range)
 * @param size - Grid size (width = height)
 * @param radius - Island radius (0-1, where 1 = full size)
 * @param falloff - Falloff steepness (higher = sharper edges)
 * @returns Modified heightmap with radial mask applied
 * 
 * @example
 * const masked = applyRadialMask(heightmap, 128, 0.7, 2.0);
 */
export function applyRadialMask(
  heightmap: Float32Array,
  size: number,
  radius: number = 0.7,
  falloff: number = 2.0
): Float32Array {
  const masked = new Float32Array(heightmap.length);
  const center = size / 2;
  const maxDistance = (size / 2) * radius;
  
  for (let z = 0; z < size; z++) {
    for (let x = 0; x < size; x++) {
      const index = z * size + x;
      
      // Calculate distance from center
      const dx = x - center;
      const dz = z - center;
      const distance = Math.sqrt(dx * dx + dz * dz);
      
      // Calculate mask value (1 at center, 0 at edge)
      let mask = 1.0 - Math.pow(distance / maxDistance, falloff);
      mask = Math.max(0, Math.min(1, mask));
      
      // Apply mask
      masked[index] = heightmap[index] * mask;
    }
  }
  
  return masked;
}

/**
 * Normalize heightmap to 0-1 range
 * 
 * Useful when heightmap values are not already normalized.
 * Finds min/max values and scales all heights to [0, 1].
 * 
 * @param heightmap - Original height values
 * @returns Normalized heightmap with values in [0, 1] range
 */
export function normalizeHeightmap(heightmap: Float32Array): Float32Array {
  let min = Infinity;
  let max = -Infinity;
  
  // Find min and max
  for (let i = 0; i < heightmap.length; i++) {
    const value = heightmap[i];
    if (value < min) min = value;
    if (value > max) max = value;
  }
  
  // Normalize
  const range = max - min;
  const normalized = new Float32Array(heightmap.length);
  
  if (range === 0) {
    // All values are the same, return all zeros
    return normalized;
  }
  
  for (let i = 0; i < heightmap.length; i++) {
    normalized[i] = (heightmap[i] - min) / range;
  }
  
  return normalized;
}
