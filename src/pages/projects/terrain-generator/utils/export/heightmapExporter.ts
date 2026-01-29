import * as THREE from 'three';

/**
 * Export heightmap data to PNG image
 * 
 * Heightmap format:
 * - Grayscale PNG (8-bit or 16-bit)
 * - White = highest elevation
 * - Black = lowest elevation
 * - Can be imported into game engines
 * 
 * @param heightmapData - Height values from terrain context
 * @param filename - Output filename (default: "heightmap.png")
 * @param bitDepth - 8 or 16 bit depth (default: 8)
 */
export function exportHeightmapToPNG(
  heightmapData: number[][],
  filename: string = 'heightmap.png',
  bitDepth: 8 | 16 = 8
): void {
  const height = heightmapData.length;
  const width = heightmapData[0]?.length || 0;

  if (width === 0 || height === 0) {
    throw new Error('Invalid heightmap data');
  }

  // Find min/max for normalization
  let min = Infinity;
  let max = -Infinity;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const value = heightmapData[y][x];
      if (value < min) min = value;
      if (value > max) max = value;
    }
  }

  const range = max - min;
  if (range === 0) {
    throw new Error('Heightmap has no variation');
  }

  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  // Create image data
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  // Convert heights to grayscale
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const heightValue = heightmapData[y][x];
      
      // Normalize to 0-255 (or 0-65535 for 16-bit, but canvas is 8-bit)
      const normalized = (heightValue - min) / range;
      const grayscale = Math.floor(normalized * 255);

      // RGBA (grayscale = same value for R, G, B)
      data[idx] = grayscale;     // R
      data[idx + 1] = grayscale; // G
      data[idx + 2] = grayscale; // B
      data[idx + 3] = 255;       // A (fully opaque)
    }
  }

  // Put image data on canvas
  ctx.putImageData(imageData, 0, 0);

  // Convert to blob and download
  canvas.toBlob((blob) => {
    if (!blob) {
      throw new Error('Failed to create blob');
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
}

/**
 * Export heightmap as raw data file (for advanced usage)
 * 
 * @param heightmapData - Height values
 * @param filename - Output filename (default: "heightmap.raw")
 */
export function exportHeightmapRAW(
  heightmapData: number[][],
  filename: string = 'heightmap.raw'
): void {
  const height = heightmapData.length;
  const width = heightmapData[0]?.length || 0;

  // Flatten to Float32Array
  const rawData = new Float32Array(width * height);
  let idx = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      rawData[idx++] = heightmapData[y][x];
    }
  }

  // Download
  const blob = new Blob([rawData.buffer], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Create heightmap data from BufferGeometry Y-coordinates
 * Helper function to extract heightmap from terrain geometry
 * 
 * @param geometry - Three.js BufferGeometry
 * @param resolution - Grid resolution (e.g., 256)
 * @returns 2D array of height values
 */
export function extractHeightmapFromGeometry(
  geometry: THREE.BufferGeometry,
  resolution: number
): number[][] {
  const positions = geometry.attributes.position;
  const heightmap: number[][] = [];

  for (let y = 0; y < resolution; y++) {
    heightmap[y] = [];
    for (let x = 0; x < resolution; x++) {
      const idx = y * resolution + x;
      const heightValue = positions.getY(idx); // Y = height
      heightmap[y][x] = heightValue;
    }
  }

  return heightmap;
}
