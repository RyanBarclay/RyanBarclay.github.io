import * as THREE from 'three';

/**
 * Export terrain geometry to binary STL format
 * 
 * Binary STL structure:
 * - 80 byte header
 * - 4 byte uint32 triangle count
 * - For each triangle:
 *   - 12 bytes: normal vector (3 float32)
 *   - 12 bytes: vertex 1 (3 float32)
 *   - 12 bytes: vertex 2 (3 float32)
 *   - 12 bytes: vertex 3 (3 float32)
 *   - 2 bytes: attribute byte count (unused, set to 0)
 * 
 * @param geometry - Three.js BufferGeometry to export
 * @param filename - Output filename (default: "terrain.stl")
 * @returns Binary STL data as ArrayBuffer
 */
export function exportToSTL(
  geometry: THREE.BufferGeometry,
  filename: string = 'terrain.stl'
): ArrayBuffer {
  const positions = geometry.attributes.position;
  const normals = geometry.attributes.normal;
  const indices = geometry.index;

  // Calculate triangle count
  const triangleCount = indices ? indices.count / 3 : positions.count / 3;

  // Create ArrayBuffer: 80 (header) + 4 (count) + 50 * triangles
  const bufferSize = 80 + 4 + 50 * triangleCount;
  const buffer = new ArrayBuffer(bufferSize);
  const view = new DataView(buffer);
  
  let offset = 0;

  // Write 80-byte header
  const header = 'Binary STL exported from Terrain Generator';
  for (let i = 0; i < 80; i++) {
    view.setUint8(offset++, i < header.length ? header.charCodeAt(i) : 0);
  }

  // Write triangle count
  view.setUint32(offset, triangleCount, true); // little-endian
  offset += 4;

  // Write triangles
  if (indices) {
    for (let i = 0; i < indices.count; i += 3) {
      const i1 = indices.getX(i);
      const i2 = indices.getX(i + 1);
      const i3 = indices.getX(i + 2);

      // Calculate face normal (or use existing)
      let nx = 0, ny = 0, nz = 0;
      if (normals) {
        // Average vertex normals for face normal
        nx = (normals.getX(i1) + normals.getX(i2) + normals.getX(i3)) / 3;
        ny = (normals.getY(i1) + normals.getY(i2) + normals.getY(i3)) / 3;
        nz = (normals.getZ(i1) + normals.getZ(i2) + normals.getZ(i3)) / 3;
        
        // Normalize
        const length = Math.sqrt(nx * nx + ny * ny + nz * nz);
        if (length > 0) {
          nx /= length;
          ny /= length;
          nz /= length;
        }
      }

      // Write normal
      view.setFloat32(offset, nx, true); offset += 4;
      view.setFloat32(offset, ny, true); offset += 4;
      view.setFloat32(offset, nz, true); offset += 4;

      // Write vertices
      const vertices = [
        [positions.getX(i1), positions.getY(i1), positions.getZ(i1)],
        [positions.getX(i2), positions.getY(i2), positions.getZ(i2)],
        [positions.getX(i3), positions.getY(i3), positions.getZ(i3)]
      ];

      for (const [x, y, z] of vertices) {
        view.setFloat32(offset, x, true); offset += 4;
        view.setFloat32(offset, y, true); offset += 4;
        view.setFloat32(offset, z, true); offset += 4;
      }

      // Write attribute byte count (unused, always 0)
      view.setUint16(offset, 0, true); offset += 2;
    }
  } else {
    // Non-indexed geometry
    for (let i = 0; i < positions.count; i += 3) {
      // Calculate face normal
      let nx = 0, ny = 0, nz = 0;
      if (normals) {
        nx = (normals.getX(i) + normals.getX(i + 1) + normals.getX(i + 2)) / 3;
        ny = (normals.getY(i) + normals.getY(i + 1) + normals.getY(i + 2)) / 3;
        nz = (normals.getZ(i) + normals.getZ(i + 1) + normals.getZ(i + 2)) / 3;
        
        const length = Math.sqrt(nx * nx + ny * ny + nz * nz);
        if (length > 0) {
          nx /= length;
          ny /= length;
          nz /= length;
        }
      }

      // Write normal
      view.setFloat32(offset, nx, true); offset += 4;
      view.setFloat32(offset, ny, true); offset += 4;
      view.setFloat32(offset, nz, true); offset += 4;

      // Write vertices
      for (let j = 0; j < 3; j++) {
        const idx = i + j;
        view.setFloat32(offset, positions.getX(idx), true); offset += 4;
        view.setFloat32(offset, positions.getY(idx), true); offset += 4;
        view.setFloat32(offset, positions.getZ(idx), true); offset += 4;
      }

      // Attribute byte count
      view.setUint16(offset, 0, true); offset += 2;
    }
  }

  return buffer;
}

/**
 * Download STL file to user's computer
 * 
 * @param geometry - Three.js BufferGeometry to export
 * @param filename - Output filename (default: "terrain.stl")
 */
export function downloadSTL(
  geometry: THREE.BufferGeometry,
  filename: string = 'terrain.stl'
): void {
  const stlBuffer = exportToSTL(geometry, filename);
  const blob = new Blob([stlBuffer], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  
  URL.revokeObjectURL(url);
}
