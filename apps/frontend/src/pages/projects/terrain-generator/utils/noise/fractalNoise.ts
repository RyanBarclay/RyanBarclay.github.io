/**
 * Fractal Brownian Motion (fBm) Noise Implementation
 *
 * Combines multiple octaves of Simplex noise to create detailed, natural-looking terrain.
 *
 * Algorithm:
 * E(x, z) = Σ(i=0 to octaves-1) [ amplitude * persistence^i * noise(frequency * lacunarity^i * x, z) ]
 *
 * Key Parameters:
 * - octaves: Number of noise layers (more = more detail)
 * - persistence: How much each octave contributes (amplitude decay)
 * - lacunarity: How much detail is added per octave (frequency multiplier)
 * - frequency: Base frequency of the noise
 *
 * Based on Perlin's original fBm algorithm (1985)
 */

import { SimplexNoise } from "./simplexNoise";

/**
 * Generate fractal Brownian motion noise at a given point
 *
 * @param simplex - SimplexNoise instance (with seed initialized)
 * @param x - X coordinate in noise space
 * @param y - Y coordinate in noise space (z in 3D space)
 * @param octaves - Number of noise layers (1-8 recommended)
 * @param persistence - Amplitude decay per octave (0.1-1.0)
 * @param lacunarity - Frequency increase per octave (1.5-4.0)
 * @param frequency - Base noise frequency (0.5-5.0)
 * @returns Noise value normalized to range [0, 1]
 */
export function getFractalNoise(
  simplex: SimplexNoise,
  x: number,
  y: number,
  octaves: number,
  persistence: number,
  lacunarity: number,
  frequency: number,
): number {
  let total = 0;
  let amplitude = 1;
  let maxValue = 0; // Used for normalization
  let freq = frequency;

  // Accumulate multiple octaves of noise
  for (let i = 0; i < octaves; i++) {
    // Sample noise at current frequency
    // SimplexNoise.noise returns values in [-1, 1]
    const noiseValue = simplex.noise(x * freq, y * freq);

    // Add weighted contribution
    total += noiseValue * amplitude;

    // Track maximum possible value for normalization
    maxValue += amplitude;

    // Decay amplitude and increase frequency for next octave
    amplitude *= persistence;
    freq *= lacunarity;
  }

  // Normalize to [0, 1] range
  // total is in range [-maxValue, maxValue]
  // First normalize to [-1, 1], then to [0, 1]
  const normalized = (total / maxValue + 1) * 0.5;

  // Clamp to [0, 1] to handle floating point precision issues
  return Math.max(0, Math.min(1, normalized));
}

/**
 * Generate fBm noise with ridged characteristics (inverted valleys)
 * Useful for creating canyons, erosion features, and sharp ridges
 *
 * @param simplex - SimplexNoise instance
 * @param x - X coordinate
 * @param y - Y coordinate
 * @param octaves - Number of octaves
 * @param persistence - Amplitude decay
 * @param lacunarity - Frequency multiplier
 * @param frequency - Base frequency
 * @returns Ridged noise value in range [0, 1]
 */
export function getRidgedNoise(
  simplex: SimplexNoise,
  x: number,
  y: number,
  octaves: number,
  persistence: number,
  lacunarity: number,
  frequency: number,
): number {
  let total = 0;
  let amplitude = 1;
  let maxValue = 0;
  let freq = frequency;

  for (let i = 0; i < octaves; i++) {
    // Get noise value and invert
    let noiseValue = simplex.noise(x * freq, y * freq);

    // Create ridges by taking absolute value and inverting
    noiseValue = 1 - Math.abs(noiseValue);

    // Square the value to sharpen ridges
    noiseValue = noiseValue * noiseValue;

    total += noiseValue * amplitude;
    maxValue += amplitude;

    amplitude *= persistence;
    freq *= lacunarity;
  }

  // Normalize to [0, 1]
  return Math.max(0, Math.min(1, total / maxValue));
}

/**
 * Generate fBm noise with turbulence (absolute values)
 * Creates billowy, cloud-like patterns
 *
 * @param simplex - SimplexNoise instance
 * @param x - X coordinate
 * @param y - Y coordinate
 * @param octaves - Number of octaves
 * @param persistence - Amplitude decay
 * @param lacunarity - Frequency multiplier
 * @param frequency - Base frequency
 * @returns Turbulent noise value in range [0, 1]
 */
export function getTurbulentNoise(
  simplex: SimplexNoise,
  x: number,
  y: number,
  octaves: number,
  persistence: number,
  lacunarity: number,
  frequency: number,
): number {
  let total = 0;
  let amplitude = 1;
  let maxValue = 0;
  let freq = frequency;

  for (let i = 0; i < octaves; i++) {
    // Take absolute value to create turbulence
    const noiseValue = Math.abs(simplex.noise(x * freq, y * freq));

    total += noiseValue * amplitude;
    maxValue += amplitude;

    amplitude *= persistence;
    freq *= lacunarity;
  }

  // Normalize to [0, 1]
  return Math.max(0, Math.min(1, total / maxValue));
}

/**
 * Generate domain-warped fBm noise
 * Applies fBm to distort the sampling coordinates, creating organic distortion
 *
 * @param simplex - SimplexNoise instance
 * @param x - X coordinate
 * @param y - Y coordinate
 * @param octaves - Number of octaves
 * @param persistence - Amplitude decay
 * @param lacunarity - Frequency multiplier
 * @param frequency - Base frequency
 * @param warpStrength - Strength of coordinate distortion (0-1)
 * @returns Domain-warped noise value in range [0, 1]
 */
export function getWarpedNoise(
  simplex: SimplexNoise,
  x: number,
  y: number,
  octaves: number,
  persistence: number,
  lacunarity: number,
  frequency: number,
  warpStrength: number = 0.5,
): number {
  // Generate offset noise for X and Y coordinates
  const offsetX = getFractalNoise(
    simplex,
    x + 100, // Offset to decorrelate from main noise
    y + 100,
    octaves,
    persistence,
    lacunarity,
    frequency,
  );

  const offsetY = getFractalNoise(
    simplex,
    x + 200,
    y + 200,
    octaves,
    persistence,
    lacunarity,
    frequency,
  );

  // Apply warping to coordinates
  // Convert [0, 1] offsets to [-1, 1] and scale by warpStrength
  const warpedX = x + (offsetX * 2 - 1) * warpStrength;
  const warpedY = y + (offsetY * 2 - 1) * warpStrength;

  // Sample noise at warped coordinates
  return getFractalNoise(
    simplex,
    warpedX,
    warpedY,
    octaves,
    persistence,
    lacunarity,
    frequency,
  );
}
