/**
 * Normal Calculator for Terrain Mesh
 * 
 * Calculates smooth vertex normals for proper lighting on terrain geometry.
 * Uses face normal accumulation and normalization for smooth shading.
 * 
 * Performance optimized with typed arrays and minimal allocations.
 */

/**
 * Calculate smooth normals for terrain mesh vertices
 * 
 * Algorithm:
 * 1. Initialize normals array (3 floats per vertex: x, y, z)
 * 2. For each triangle, calculate face normal using cross product
 * 3. Accumulate face normals to all three vertices of the triangle
 * 4. Normalize each vertex normal to create unit vectors
 * 
 * @param positions - Vertex positions as flat array [x1, y1, z1, x2, y2, z2, ...]
 * @param indices - Triangle indices as flat array [i1, i2, i3, i4, i5, i6, ...]
 * @param width - Grid width (number of vertices per row)
 * @param height - Grid height (number of vertices per column)
 * @returns Float32Array of normalized vertex normals [nx1, ny1, nz1, nx2, ny2, nz2, ...]
 */
export function calculateNormals(
  positions: Float32Array,
  indices: Uint32Array | Uint16Array,
  width: number,
  height: number
): Float32Array {
  const vertexCount = positions.length / 3;
  
  // Initialize normals array with zeros
  const normals = new Float32Array(vertexCount * 3);
  
  // Temporary vectors for cross product calculation
  const v1 = { x: 0, y: 0, z: 0 };
  const v2 = { x: 0, y: 0, z: 0 };
  const normal = { x: 0, y: 0, z: 0 };
  
  // Process each triangle
  for (let i = 0; i < indices.length; i += 3) {
    const i1 = indices[i];
    const i2 = indices[i + 1];
    const i3 = indices[i + 2];
    
    // Get vertex positions
    const p1x = positions[i1 * 3];
    const p1y = positions[i1 * 3 + 1];
    const p1z = positions[i1 * 3 + 2];
    
    const p2x = positions[i2 * 3];
    const p2y = positions[i2 * 3 + 1];
    const p2z = positions[i2 * 3 + 2];
    
    const p3x = positions[i3 * 3];
    const p3y = positions[i3 * 3 + 1];
    const p3z = positions[i3 * 3 + 2];
    
    // Calculate edge vectors
    v1.x = p2x - p1x;
    v1.y = p2y - p1y;
    v1.z = p2z - p1z;
    
    v2.x = p3x - p1x;
    v2.y = p3y - p1y;
    v2.z = p3z - p1z;
    
    // Calculate face normal using cross product: v1 × v2
    normal.x = v1.y * v2.z - v1.z * v2.y;
    normal.y = v1.z * v2.x - v1.x * v2.z;
    normal.z = v1.x * v2.y - v1.y * v2.x;
    
    // Accumulate face normal to all three vertices
    // This creates smooth shading by averaging normals at shared vertices
    normals[i1 * 3]     += normal.x;
    normals[i1 * 3 + 1] += normal.y;
    normals[i1 * 3 + 2] += normal.z;
    
    normals[i2 * 3]     += normal.x;
    normals[i2 * 3 + 1] += normal.y;
    normals[i2 * 3 + 2] += normal.z;
    
    normals[i3 * 3]     += normal.x;
    normals[i3 * 3 + 1] += normal.y;
    normals[i3 * 3 + 2] += normal.z;
  }
  
  // Normalize all vertex normals to unit vectors
  for (let i = 0; i < vertexCount; i++) {
    const nx = normals[i * 3];
    const ny = normals[i * 3 + 1];
    const nz = normals[i * 3 + 2];
    
    // Calculate magnitude
    const length = Math.sqrt(nx * nx + ny * ny + nz * nz);
    
    // Normalize (divide by magnitude to get unit vector)
    if (length > 0) {
      normals[i * 3]     = nx / length;
      normals[i * 3 + 1] = ny / length;
      normals[i * 3 + 2] = nz / length;
    } else {
      // Fallback to up vector if normal is zero (shouldn't happen)
      normals[i * 3]     = 0;
      normals[i * 3 + 1] = 1;
      normals[i * 3 + 2] = 0;
    }
  }
  
  return normals;
}

/**
 * Calculate flat (per-face) normals for hard-edge shading
 * 
 * Unlike smooth normals, each triangle face gets its own normal vector,
 * creating sharp edges between triangles. Useful for low-poly aesthetics.
 * 
 * @param positions - Vertex positions as flat array
 * @param indices - Triangle indices as flat array
 * @returns Float32Array of flat normals (3 normals per triangle, 9 floats per triangle)
 */
export function calculateFlatNormals(
  positions: Float32Array,
  indices: Uint32Array | Uint16Array
): Float32Array {
  const triangleCount = indices.length / 3;
  const normals = new Float32Array(triangleCount * 9); // 3 vertices × 3 components per triangle
  
  for (let i = 0; i < indices.length; i += 3) {
    const i1 = indices[i];
    const i2 = indices[i + 1];
    const i3 = indices[i + 2];
    
    // Get vertex positions
    const p1x = positions[i1 * 3];
    const p1y = positions[i1 * 3 + 1];
    const p1z = positions[i1 * 3 + 2];
    
    const p2x = positions[i2 * 3];
    const p2y = positions[i2 * 3 + 1];
    const p2z = positions[i2 * 3 + 2];
    
    const p3x = positions[i3 * 3];
    const p3y = positions[i3 * 3 + 1];
    const p3z = positions[i3 * 3 + 2];
    
    // Calculate edge vectors
    const v1x = p2x - p1x;
    const v1y = p2y - p1y;
    const v1z = p2z - p1z;
    
    const v2x = p3x - p1x;
    const v2y = p3y - p1y;
    const v2z = p3z - p1z;
    
    // Calculate face normal using cross product
    const nx = v1y * v2z - v1z * v2y;
    const ny = v1z * v2x - v1x * v2z;
    const nz = v1x * v2y - v1y * v2x;
    
    // Normalize
    const length = Math.sqrt(nx * nx + ny * ny + nz * nz);
    const normalX = length > 0 ? nx / length : 0;
    const normalY = length > 0 ? ny / length : 1;
    const normalZ = length > 0 ? nz / length : 0;
    
    // Assign same normal to all three vertices of the triangle
    const baseIndex = (i / 3) * 9;
    
    // Vertex 1 normal
    normals[baseIndex]     = normalX;
    normals[baseIndex + 1] = normalY;
    normals[baseIndex + 2] = normalZ;
    
    // Vertex 2 normal
    normals[baseIndex + 3] = normalX;
    normals[baseIndex + 4] = normalY;
    normals[baseIndex + 5] = normalZ;
    
    // Vertex 3 normal
    normals[baseIndex + 6] = normalX;
    normals[baseIndex + 7] = normalY;
    normals[baseIndex + 8] = normalZ;
  }
  
  return normals;
}
