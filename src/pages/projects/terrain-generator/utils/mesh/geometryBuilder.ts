/**
 * Terrain Geometry Builder
 *
 * Creates Three.js BufferGeometry from heightmap data.
 * Generates positions, indices, normals, and colors for terrain mesh.
 *
 * Performance optimized:
 * - Uses typed arrays (Float32Array, Uint16Array/Uint32Array)
 * - Pre-allocates all arrays
 * - Efficient index buffer selection based on vertex count
 */

import * as THREE from "three";
import { calculateNormals } from "./normalCalculator";

/**
 * Build Three.js BufferGeometry from heightmap data
 *
 * Creates a grid-based terrain mesh with:
 * - Vertex positions based on heightmap
 * - Triangle indices (2 triangles per quad)
 * - Smooth vertex normals for lighting
 * - Per-vertex color attributes
 *
 * @param heightmap - Height values as flat array (size × size)
 * @param size - Grid size (number of vertices per side)
 * @param heightScale - Vertical scale multiplier for heights
 * @param colorArray - Pre-computed vertex colors (RGB, 3 floats per vertex)
 * @param worldSize - Optional world space size for chunks (if omitted, uses size)
 * @returns Three.js BufferGeometry ready for rendering
 *
 * @example
 * const geometry = buildTerrainGeometry(heightmap, 128, 20.0, colors);
 * const mesh = new THREE.Mesh(geometry, material);
 */
export function buildTerrainGeometry(
  heightmap: Float32Array,
  size: number,
  heightScale: number,
  colorArray: Float32Array,
  worldSize?: number,
): THREE.BufferGeometry {
  const vertexCount = size * size;
  const triangleCount = (size - 1) * (size - 1) * 2;

  // Allocate arrays
  const positions = new Float32Array(vertexCount * 3); // x, y, z per vertex
  const indices =
    vertexCount > 65536
      ? new Uint32Array(triangleCount * 3) // Use 32-bit indices for large meshes
      : new Uint16Array(triangleCount * 3); // Use 16-bit for small meshes (memory efficient)

  // Generate vertex positions
  // For chunks: worldSize defines physical size, grid starts at (0,0)
  // For full terrain: centers at origin if worldSize not provided
  const actualWorldSize = worldSize ?? size;
  const centerOffset = worldSize ? 0 : size / 2; // Only center if not a chunk
  const spacing = actualWorldSize / (size - 1);

  let posIndex = 0;

  for (let z = 0; z < size; z++) {
    for (let x = 0; x < size; x++) {
      const heightIndex = z * size + x;
      const height = heightmap[heightIndex] * heightScale;

      // Position: Y-up orientation (XZ plane is horizontal)
      // X = horizontal, Y = height, Z = depth
      positions[posIndex++] = x * spacing - centerOffset;
      positions[posIndex++] = height; // Y is up
      positions[posIndex++] = z * spacing - centerOffset;
    }
  }

  // Generate triangle indices
  // Each quad is split into 2 triangles (CCW winding for front face)
  let indexCount = 0;

  for (let z = 0; z < size - 1; z++) {
    for (let x = 0; x < size - 1; x++) {
      // Vertex indices for current quad
      const topLeft = z * size + x;
      const topRight = topLeft + 1;
      const bottomLeft = (z + 1) * size + x;
      const bottomRight = bottomLeft + 1;

      // First triangle (top-left, bottom-left, top-right)
      indices[indexCount++] = topLeft;
      indices[indexCount++] = bottomLeft;
      indices[indexCount++] = topRight;

      // Second triangle (top-right, bottom-left, bottom-right)
      indices[indexCount++] = topRight;
      indices[indexCount++] = bottomLeft;
      indices[indexCount++] = bottomRight;
    }
  }

  // Calculate smooth normals for lighting
  const normals = calculateNormals(positions, indices, size, size);

  // Create BufferGeometry and add attributes
  const geometry = new THREE.BufferGeometry();

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colorArray, 3));
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));

  // Compute bounding sphere for frustum culling
  geometry.computeBoundingSphere();

  return geometry;
}

/**
 * Build simplified terrain geometry for LOD (Level of Detail)
 *
 * Creates a lower-resolution version of the terrain by skipping vertices.
 * Used for distant terrain chunks to improve performance.
 *
 * @param heightmap - Original full-resolution heightmap
 * @param fullSize - Original grid size
 * @param lodResolution - Target resolution (must be power of 2, <= fullSize)
 * @param heightScale - Vertical scale multiplier
 * @param colorArray - Original full-resolution color array
 * @returns Simplified BufferGeometry with reduced vertex count
 *
 * @example
 * // Create 64x64 LOD from 256x256 terrain
 * const lodGeometry = buildLODGeometry(heightmap, 256, 64, 20.0, colors);
 */
export function buildLODGeometry(
  heightmap: Float32Array,
  fullSize: number,
  lodResolution: number,
  heightScale: number,
  colorArray: Float32Array,
): THREE.BufferGeometry {
  // Calculate skip factor (sample every nth vertex)
  const skipFactor = Math.floor(fullSize / lodResolution);
  const size = lodResolution;
  const vertexCount = size * size;
  const triangleCount = (size - 1) * (size - 1) * 2;

  // Allocate arrays
  const positions = new Float32Array(vertexCount * 3);
  const colors = new Float32Array(vertexCount * 3);
  const indices =
    vertexCount > 65536
      ? new Uint32Array(triangleCount * 3)
      : new Uint16Array(triangleCount * 3);

  // Sample vertices at reduced resolution
  const halfSize = fullSize / 2;
  let posIndex = 0;
  let colorIndex = 0;

  for (let z = 0; z < size; z++) {
    for (let x = 0; x < size; x++) {
      // Map LOD coordinate to full-resolution coordinate
      const fullX = x * skipFactor;
      const fullZ = z * skipFactor;
      const heightIndex = fullZ * fullSize + fullX;
      const height = heightmap[heightIndex] * heightScale;

      // Position
      positions[posIndex++] = fullX - halfSize;
      positions[posIndex++] = height;
      positions[posIndex++] = fullZ - halfSize;

      // Color (sample from original color array)
      const colorOffset = heightIndex * 3;
      colors[colorIndex++] = colorArray[colorOffset];
      colors[colorIndex++] = colorArray[colorOffset + 1];
      colors[colorIndex++] = colorArray[colorOffset + 2];
    }
  }

  // Generate indices (same logic as full resolution)
  let indexCount = 0;

  for (let z = 0; z < size - 1; z++) {
    for (let x = 0; x < size - 1; x++) {
      const topLeft = z * size + x;
      const topRight = topLeft + 1;
      const bottomLeft = (z + 1) * size + x;
      const bottomRight = bottomLeft + 1;

      indices[indexCount++] = topLeft;
      indices[indexCount++] = bottomLeft;
      indices[indexCount++] = topRight;

      indices[indexCount++] = topRight;
      indices[indexCount++] = bottomLeft;
      indices[indexCount++] = bottomRight;
    }
  }

  // Calculate normals
  const normals = calculateNormals(positions, indices, size, size);

  // Create geometry
  const geometry = new THREE.BufferGeometry();

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));

  geometry.computeBoundingSphere();

  return geometry;
}

/**
 * Update existing geometry with new heightmap data (in-place update)
 * More efficient than rebuilding geometry when only heights change
 *
 * @param geometry - Existing BufferGeometry to update
 * @param heightmap - New height values
 * @param size - Grid size
 * @param heightScale - Vertical scale multiplier
 * @param colorArray - New color array
 */
export function updateTerrainGeometry(
  geometry: THREE.BufferGeometry,
  heightmap: Float32Array,
  size: number,
  heightScale: number,
  colorArray: Float32Array,
): void {
  const positions = geometry.getAttribute("position") as THREE.BufferAttribute;
  const colors = geometry.getAttribute("color") as THREE.BufferAttribute;
  const indices = geometry.getIndex() as THREE.BufferAttribute;

  // Update positions (only Y coordinate changes)
  const halfSize = size / 2;
  let posIndex = 0;

  for (let z = 0; z < size; z++) {
    for (let x = 0; x < size; x++) {
      const heightIndex = z * size + x;
      const height = heightmap[heightIndex] * heightScale;

      // Update Y coordinate (X and Z remain unchanged)
      positions.setY(posIndex, height);
      posIndex++;
    }
  }

  // Update colors
  colors.set(colorArray);

  // Recalculate normals
  const posArray = positions.array as Float32Array;
  const indexArray = indices.array as Uint32Array | Uint16Array;
  const normals = calculateNormals(posArray, indexArray, size, size);

  const normalAttr = geometry.getAttribute("normal") as THREE.BufferAttribute;
  normalAttr.set(normals);

  // Mark attributes as needing update
  positions.needsUpdate = true;
  colors.needsUpdate = true;
  normalAttr.needsUpdate = true;

  // Recompute bounding sphere
  geometry.computeBoundingSphere();
}
