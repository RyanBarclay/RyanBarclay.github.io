/**
 * BC Nature Color Palette
 * 
 * Color scheme inspired by British Columbia's natural landscapes:
 * - Pacific coastal waters
 * - Sandy beaches
 * - Spring meadows
 * - Dense forests
 * - Rocky mountains
 * - Snow-capped peaks
 * 
 * Colors are defined in hex format with utilities to convert to Three.js-compatible
 * RGB formats (0-1 range).
 */

/**
 * BC Nature-inspired color palette
 */
export const BC_NATURE_PALETTE = {
  deepWater: "#5C9EAD",    // Coastal Waters - deep blue-green
  sand: "#FDE9C4",         // Beach - warm sand
  grass: "#6B9C5A",        // Spring Meadow - vibrant green
  forest: "#2C5530",       // Forest Green - deep evergreen
  rock: "#898785",         // Mountain Rock - gray stone
  snow: "#FFFFFF"          // Snow Peaks - pure white
};

/**
 * Elevation thresholds for terrain coloring
 * Values are normalized (0-1) relative to terrain height
 */
export const ELEVATION_THRESHOLDS = {
  deepWater: 0.30,   // Below this = deep water
  sand: 0.35,        // 0.30-0.35 = beach/shore
  grass: 0.50,       // 0.35-0.50 = grasslands
  forest: 0.70,      // 0.50-0.70 = forest
  rock: 0.85,        // 0.70-0.85 = rocky mountain
  snow: 1.00         // 0.85-1.00 = snow peaks
};

/**
 * RGB color representation (0-255 range)
 */
export interface RGB {
  r: number;
  g: number;
  b: number;
}

/**
 * Convert hex color string to RGB values (0-255 range)
 * 
 * @param hex - Hex color string (e.g., "#5C9EAD" or "5C9EAD")
 * @returns RGB object with r, g, b values (0-255)
 * 
 * @example
 * hexToRgb("#5C9EAD") // { r: 92, g: 158, b: 173 }
 */
export function hexToRgb(hex: string): RGB {
  // Remove # prefix if present
  const cleanHex = hex.replace(/^#/, '');
  
  // Parse hex string
  const bigint = parseInt(cleanHex, 16);
  
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
}

/**
 * Convert RGB (0-255) to Three.js color format (0-1 range)
 * 
 * @param r - Red component (0-255)
 * @param g - Green component (0-255)
 * @param b - Blue component (0-255)
 * @returns Array of [r, g, b] in 0-1 range
 * 
 * @example
 * rgbToThreeColor(92, 158, 173) // [0.361, 0.620, 0.678]
 */
export function rgbToThreeColor(r: number, g: number, b: number): [number, number, number] {
  return [
    r / 255,
    g / 255,
    b / 255
  ];
}

/**
 * Convert hex color directly to Three.js color format
 * 
 * @param hex - Hex color string (e.g., "#5C9EAD")
 * @returns Array of [r, g, b] in 0-1 range
 * 
 * @example
 * hexToThreeColor("#5C9EAD") // [0.361, 0.620, 0.678]
 */
export function hexToThreeColor(hex: string): [number, number, number] {
  const rgb = hexToRgb(hex);
  return rgbToThreeColor(rgb.r, rgb.g, rgb.b);
}

/**
 * Pre-converted BC Nature palette in Three.js format (0-1 range)
 * Use this for performance-critical rendering code
 */
export const BC_NATURE_PALETTE_THREE = {
  deepWater: hexToThreeColor(BC_NATURE_PALETTE.deepWater),
  sand: hexToThreeColor(BC_NATURE_PALETTE.sand),
  grass: hexToThreeColor(BC_NATURE_PALETTE.grass),
  forest: hexToThreeColor(BC_NATURE_PALETTE.forest),
  rock: hexToThreeColor(BC_NATURE_PALETTE.rock),
  snow: hexToThreeColor(BC_NATURE_PALETTE.snow)
};

/**
 * Linear interpolation between two colors
 * 
 * @param color1 - First color [r, g, b] in 0-1 range
 * @param color2 - Second color [r, g, b] in 0-1 range
 * @param t - Interpolation factor (0-1, where 0 = color1, 1 = color2)
 * @returns Interpolated color [r, g, b] in 0-1 range
 * 
 * @example
 * // Get color halfway between grass and forest
 * lerpColor(BC_NATURE_PALETTE_THREE.grass, BC_NATURE_PALETTE_THREE.forest, 0.5)
 */
export function lerpColor(
  color1: [number, number, number],
  color2: [number, number, number],
  t: number
): [number, number, number] {
  // Clamp t to 0-1 range
  const factor = Math.max(0, Math.min(1, t));
  
  return [
    color1[0] + (color2[0] - color1[0]) * factor,
    color1[1] + (color2[1] - color1[1]) * factor,
    color1[2] + (color2[2] - color1[2]) * factor
  ];
}

/**
 * Grayscale color palette (for alternative color scheme)
 */
export const GRAYSCALE_PALETTE = {
  darkest: "#1A1A1A",
  darker: "#333333",
  dark: "#4D4D4D",
  medium: "#808080",
  light: "#B3B3B3",
  lighter: "#CCCCCC",
  lightest: "#E6E6E6",
  white: "#FFFFFF"
};

/**
 * Pre-converted grayscale palette in Three.js format
 */
export const GRAYSCALE_PALETTE_THREE = {
  darkest: hexToThreeColor(GRAYSCALE_PALETTE.darkest),
  darker: hexToThreeColor(GRAYSCALE_PALETTE.darker),
  dark: hexToThreeColor(GRAYSCALE_PALETTE.dark),
  medium: hexToThreeColor(GRAYSCALE_PALETTE.medium),
  light: hexToThreeColor(GRAYSCALE_PALETTE.light),
  lighter: hexToThreeColor(GRAYSCALE_PALETTE.lighter),
  lightest: hexToThreeColor(GRAYSCALE_PALETTE.lightest),
  white: hexToThreeColor(GRAYSCALE_PALETTE.white)
};
