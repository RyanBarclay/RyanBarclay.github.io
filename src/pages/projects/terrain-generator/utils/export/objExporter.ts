import * as THREE from "three";

/**
 * Export terrain geometry to Wavefront OBJ format
 *
 * OBJ format structure:
 * - v x y z (vertex positions)
 * - vn x y z (vertex normals)
 * - f v1/vt1/vn1 v2/vt2/vn2 v3/vt3/vn3 (faces)
 *
 * @param geometry - Three.js BufferGeometry to export
 * @param filename - Output filename (default: "terrain.obj")
 * @returns OBJ file content as string
 */
export function exportToOBJ(
  geometry: THREE.BufferGeometry,
  filename: string = "terrain.obj",
): string {
  const positions = geometry.attributes.position;
  const normals = geometry.attributes.normal;
  const indices = geometry.index;

  let objContent = `# Wavefront OBJ file exported from Terrain Generator\n`;
  objContent += `# Vertices: ${positions.count}\n`;
  objContent += `# Faces: ${indices ? indices.count / 3 : positions.count / 3}\n\n`;

  // Export vertices
  objContent += `# Vertex positions\n`;
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    const z = positions.getZ(i);
    objContent += `v ${x.toFixed(6)} ${y.toFixed(6)} ${z.toFixed(6)}\n`;
  }

  // Export normals
  if (normals) {
    objContent += `\n# Vertex normals\n`;
    for (let i = 0; i < normals.count; i++) {
      const nx = normals.getX(i);
      const ny = normals.getY(i);
      const nz = normals.getZ(i);
      objContent += `vn ${nx.toFixed(6)} ${ny.toFixed(6)} ${nz.toFixed(6)}\n`;
    }
  }

  // Export faces
  objContent += `\n# Faces\n`;
  if (indices) {
    for (let i = 0; i < indices.count; i += 3) {
      const v1 = indices.getX(i) + 1; // OBJ uses 1-based indexing
      const v2 = indices.getX(i + 1) + 1;
      const v3 = indices.getX(i + 2) + 1;

      if (normals) {
        objContent += `f ${v1}//${v1} ${v2}//${v2} ${v3}//${v3}\n`;
      } else {
        objContent += `f ${v1} ${v2} ${v3}\n`;
      }
    }
  } else {
    // Non-indexed geometry
    for (let i = 0; i < positions.count; i += 3) {
      const v1 = i + 1;
      const v2 = i + 2;
      const v3 = i + 3;
      objContent += `f ${v1} ${v2} ${v3}\n`;
    }
  }

  return objContent;
}

/**
 * Download OBJ file to user's computer
 *
 * @param geometry - Three.js BufferGeometry to export
 * @param filename - Output filename (default: "terrain.obj")
 */
export function downloadOBJ(
  geometry: THREE.BufferGeometry,
  filename: string = "terrain.obj",
): void {
  const objContent = exportToOBJ(geometry, filename);
  const blob = new Blob([objContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}
