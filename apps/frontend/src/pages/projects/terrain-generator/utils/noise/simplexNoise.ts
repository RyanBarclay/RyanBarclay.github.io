/**
 * Custom 2D Simplex Noise Implementation
 *
 * Based on Ken Perlin's Simplex Noise algorithm (2001).
 * Returns values in range [-1, 1] for continuous, smooth noise generation.
 *
 * Key Features:
 * - Uses triangular grid instead of square grid (fewer gradient evaluations)
 * - Employs skewing/unskewing for coordinate transformation
 * - 12 gradient directions for optimal spatial distribution
 *
 * Algorithm Overview:
 * 1. Skew input coordinates to simplicial grid
 * 2. Determine which simplex we're in
 * 3. Calculate contributions from three corners
 * 4. Unskew and sum contributions
 */

import type { Gradient2D } from "../../types";

/**
 * 12 gradient vectors uniformly distributed around a circle
 * These provide better isotropy than 8-directional gradients
 */
const GRADIENTS: Gradient2D[] = [
  { x: 1, y: 1 },
  { x: -1, y: 1 },
  { x: 1, y: -1 },
  { x: -1, y: -1 },
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
  { x: 1, y: 0.5 },
  { x: -1, y: 0.5 },
  { x: 0.5, y: 1 },
  { x: 0.5, y: -1 },
];

/**
 * Permutation table for pseudo-random gradient selection
 * 256 entries repeated to avoid modulo operations
 */
const PERM: number[] = [];
const PERM_MOD_12: number[] = [];

/**
 * Skewing factor for 2D: (sqrt(3) - 1) / 2
 * Used to transform square grid to simplicial grid
 */
const F2 = 0.5 * (Math.sqrt(3) - 1);

/**
 * Unskewing factor for 2D: (3 - sqrt(3)) / 6
 * Used to transform simplicial grid back to square grid
 */
const G2 = (3 - Math.sqrt(3)) / 6;

/**
 * Initialize permutation tables with a seed
 */
function initializePermutation(seed: string): void {
  // Generate deterministic random values from seed
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }

  // Create base permutation using seeded pseudo-random
  const p: number[] = [];
  for (let i = 0; i < 256; i++) {
    p[i] = i;
  }

  // Fisher-Yates shuffle with seeded random
  let random = Math.abs(hash);
  for (let i = 255; i > 0; i--) {
    random = (random * 16807) % 2147483647; // Park-Miller PRNG
    const j = Math.floor((random / 2147483647) * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }

  // Duplicate and create modulo-12 version
  for (let i = 0; i < 512; i++) {
    PERM[i] = p[i & 255];
    PERM_MOD_12[i] = PERM[i] % 12;
  }
}

/**
 * Calculate dot product of gradient and distance vector
 */
function dot(gradient: Gradient2D, x: number, y: number): number {
  return gradient.x * x + gradient.y * y;
}

/**
 * 2D Simplex Noise function
 *
 * @param x - X coordinate in noise space
 * @param y - Y coordinate in noise space
 * @returns Noise value in range [-1, 1]
 */
export function noise2D(x: number, y: number): number {
  // Noise contributions from the three corners
  let n0: number, n1: number, n2: number;

  // Skew the input space to determine which simplex cell we're in
  const s = (x + y) * F2;
  const i = Math.floor(x + s);
  const j = Math.floor(y + s);

  // Unskew the cell origin back to (x,y) space
  const t = (i + j) * G2;
  const X0 = i - t;
  const Y0 = j - t;

  // Distance from cell origin in (x,y) space
  const x0 = x - X0;
  const y0 = y - Y0;

  // Determine which simplex we are in (lower or upper triangle)
  // Offsets for second corner in (i,j) coords
  let i1: number, j1: number;
  if (x0 > y0) {
    // Lower triangle, XY order: (0,0)->(1,0)->(1,1)
    i1 = 1;
    j1 = 0;
  } else {
    // Upper triangle, YX order: (0,0)->(0,1)->(1,1)
    i1 = 0;
    j1 = 1;
  }

  // Offsets for middle corner in (x,y) unskewed coords
  const x1 = x0 - i1 + G2;
  const y1 = y0 - j1 + G2;

  // Offsets for last corner in (x,y) unskewed coords
  const x2 = x0 - 1 + 2 * G2;
  const y2 = y0 - 1 + 2 * G2;

  // Work out the hashed gradient indices of the three simplex corners
  const ii = i & 255;
  const jj = j & 255;
  const gi0 = PERM_MOD_12[ii + PERM[jj]];
  const gi1 = PERM_MOD_12[ii + i1 + PERM[jj + j1]];
  const gi2 = PERM_MOD_12[ii + 1 + PERM[jj + 1]];

  // Calculate the contribution from the three corners
  let t0 = 0.5 - x0 * x0 - y0 * y0;
  if (t0 < 0) {
    n0 = 0;
  } else {
    t0 *= t0;
    n0 = t0 * t0 * dot(GRADIENTS[gi0], x0, y0);
  }

  let t1 = 0.5 - x1 * x1 - y1 * y1;
  if (t1 < 0) {
    n1 = 0;
  } else {
    t1 *= t1;
    n1 = t1 * t1 * dot(GRADIENTS[gi1], x1, y1);
  }

  let t2 = 0.5 - x2 * x2 - y2 * y2;
  if (t2 < 0) {
    n2 = 0;
  } else {
    t2 *= t2;
    n2 = t2 * t2 * dot(GRADIENTS[gi2], x2, y2);
  }

  // Add contributions from each corner and scale to [-1, 1]
  // The scale factor is empirically determined to normalize output
  return 70 * (n0 + n1 + n2);
}

/**
 * SimplexNoise class for stateful noise generation with seed
 */
export class SimplexNoise {
  private seed: string;

  constructor(seed: string = "default") {
    this.seed = seed;
    initializePermutation(seed);
  }

  /**
   * Get 2D noise value at given coordinates
   */
  public noise(x: number, y: number): number {
    return noise2D(x, y);
  }

  /**
   * Update seed and reinitialize permutation table
   */
  public setSeed(seed: string): void {
    this.seed = seed;
    initializePermutation(seed);
  }

  /**
   * Get current seed
   */
  public getSeed(): string {
    return this.seed;
  }
}

/**
 * Create a new SimplexNoise instance with optional seed
 */
export function createNoise(seed?: string): SimplexNoise {
  return new SimplexNoise(seed);
}

/**
 * Generate 2D noise with default seed (stateless)
 * Use SimplexNoise class for better performance with repeated calls
 */
export function simpleNoise2D(
  x: number,
  y: number,
  seed: string = "default",
): number {
  initializePermutation(seed);
  return noise2D(x, y);
}
