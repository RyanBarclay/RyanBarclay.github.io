/**
 * Quadtree spatial partitioning for LOD system
 *
 * Recursively subdivides 2D terrain space for efficient spatial queries
 * and level-of-detail management. Enables O(log n) lookups and dynamic
 * LOD updates based on camera distance.
 */

/**
 * Quadtree node structure for spatial partitioning
 */
export interface QuadtreeNode {
  bounds: {
    minX: number;
    maxX: number;
    minZ: number;
    maxZ: number;
  };
  center: { x: number; z: number };
  size: number;
  level: number; // Subdivision depth (0 = root)
  children: QuadtreeNode[] | null; // null if leaf, array of 4 if subdivided
  lodLevel: number; // 0 = highest detail, 3+ = lowest
}

/**
 * Quadtree-based spatial partitioning system for terrain LOD
 *
 * Subdivides terrain into hierarchical quadrants, enabling:
 * - Efficient spatial queries (O(log n))
 * - Distance-based LOD assignment
 * - Selective chunk rendering
 * - Memory-efficient terrain streaming
 *
 * @example
 * ```typescript
 * const quadtree = new Quadtree(256, 4);
 * quadtree.buildFullTree();
 * quadtree.updateLOD(cameraX, cameraZ, [50, 100, 200, 400]);
 * const chunks = quadtree.getVisibleChunks();
 * ```
 */
export class Quadtree {
  root: QuadtreeNode;
  maxLevel: number;

  /**
   * Creates a new Quadtree for terrain spatial partitioning
   *
   * @param terrainSize - Total terrain size in world units
   * @param maxLevel - Maximum subdivision depth (typically 3-5)
   */
  constructor(terrainSize: number, maxLevel: number) {
    this.maxLevel = maxLevel;

    // Create root node spanning entire terrain
    // Center terrain at origin: bounds go from -size/2 to +size/2
    const halfSize = terrainSize / 2;
    this.root = {
      bounds: {
        minX: -halfSize,
        maxX: halfSize,
        minZ: -halfSize,
        maxZ: halfSize,
      },
      center: { x: 0, z: 0 },
      size: terrainSize,
      level: 0,
      children: null,
      lodLevel: 3, // Default to lowest detail
    };
  }

  /**
   * Subdivides a node into 4 equal quadrants
   *
   * Creates children in order: [NW, NE, SW, SE]
   * Each child gets 1/4 of parent bounds
   *
   * @param node - Node to subdivide
   */
  subdivide(node: QuadtreeNode): void {
    // Don't subdivide beyond max level
    if (node.level >= this.maxLevel) {
      return;
    }

    // Already subdivided
    if (node.children !== null) {
      return;
    }

    const { minX, maxX, minZ, maxZ } = node.bounds;
    const midX = (minX + maxX) / 2;
    const midZ = (minZ + maxZ) / 2;
    const childSize = node.size / 2;
    const childLevel = node.level + 1;

    // Create 4 children: NW, NE, SW, SE
    node.children = [
      // Northwest
      {
        bounds: { minX, maxX: midX, minZ: midZ, maxZ },
        center: { x: (minX + midX) / 2, z: (midZ + maxZ) / 2 },
        size: childSize,
        level: childLevel,
        children: null,
        lodLevel: 3,
      },
      // Northeast
      {
        bounds: { minX: midX, maxX, minZ: midZ, maxZ },
        center: { x: (midX + maxX) / 2, z: (midZ + maxZ) / 2 },
        size: childSize,
        level: childLevel,
        children: null,
        lodLevel: 3,
      },
      // Southwest
      {
        bounds: { minX, maxX: midX, minZ, maxZ: midZ },
        center: { x: (minX + midX) / 2, z: (minZ + midZ) / 2 },
        size: childSize,
        level: childLevel,
        children: null,
        lodLevel: 3,
      },
      // Southeast
      {
        bounds: { minX: midX, maxX, minZ, maxZ: midZ },
        center: { x: (midX + maxX) / 2, z: (minZ + midZ) / 2 },
        size: childSize,
        level: childLevel,
        children: null,
        lodLevel: 3,
      },
    ];
  }

  /**
   * Recursively builds the complete tree to maxLevel depth
   *
   * Subdivides all nodes up to maxLevel, creating a uniform
   * grid of leaf nodes at the deepest level.
   */
  buildFullTree(): void {
    this.buildTreeRecursive(this.root);
  }

  /**
   * Recursive helper for building the full tree
   *
   * @param node - Current node to process
   */
  private buildTreeRecursive(node: QuadtreeNode): void {
    // Stop at max depth
    if (node.level >= this.maxLevel) {
      return;
    }

    this.subdivide(node);

    // Recursively subdivide children
    if (node.children) {
      for (const child of node.children) {
        this.buildTreeRecursive(child);
      }
    }
  }

  /**
   * Returns all leaf nodes (chunks that should be rendered)
   *
   * Only leaf nodes contain actual geometry - parent nodes
   * are purely organizational.
   *
   * @returns Array of leaf nodes
   */
  getLeafNodes(): QuadtreeNode[] {
    const leaves: QuadtreeNode[] = [];
    this.collectLeaves(this.root, leaves);
    return leaves;
  }

  /**
   * Recursively collects all leaf nodes
   *
   * @param node - Current node to check
   * @param leaves - Array to accumulate leaf nodes
   */
  private collectLeaves(node: QuadtreeNode, leaves: QuadtreeNode[]): void {
    if (node.children === null) {
      // This is a leaf node
      leaves.push(node);
    } else {
      // Recurse into children
      for (const child of node.children) {
        this.collectLeaves(child, leaves);
      }
    }
  }

  /**
   * Finds the node containing a specific point
   *
   * Performs efficient O(log n) spatial query by traversing
   * down the tree to the appropriate quadrant.
   *
   * @param x - X coordinate in world space
   * @param z - Z coordinate in world space
   * @param targetLevel - Optional: stop at specific level (default: leaf)
   * @returns Node containing the point, or null if out of bounds
   */
  findNode(x: number, z: number, targetLevel?: number): QuadtreeNode | null {
    return this.findNodeRecursive(this.root, x, z, targetLevel);
  }

  /**
   * Recursive helper for finding a node
   *
   * @param node - Current node to search
   * @param x - X coordinate
   * @param z - Z coordinate
   * @param targetLevel - Optional target depth
   * @returns Node containing the point, or null
   */
  private findNodeRecursive(
    node: QuadtreeNode,
    x: number,
    z: number,
    targetLevel?: number,
  ): QuadtreeNode | null {
    const { minX, maxX, minZ, maxZ } = node.bounds;

    // Check if point is within bounds
    if (x < minX || x > maxX || z < minZ || z > maxZ) {
      return null;
    }

    // If we've reached target level or a leaf, return this node
    if (
      (targetLevel !== undefined && node.level >= targetLevel) ||
      node.children === null
    ) {
      return node;
    }

    // Determine which quadrant contains the point
    const midX = (minX + maxX) / 2;
    const midZ = (minZ + maxZ) / 2;

    let childIndex: number;
    if (z >= midZ) {
      // North half
      childIndex = x < midX ? 0 : 1; // NW : NE
    } else {
      // South half
      childIndex = x < midX ? 2 : 3; // SW : SE
    }

    // Recurse into appropriate child
    return this.findNodeRecursive(node.children[childIndex], x, z, targetLevel);
  }

  /**
   * Updates LOD levels for all nodes based on camera distance
   *
   * Assigns higher detail (lower lodLevel) to nodes closer to camera.
   * Uses provided distance thresholds to determine LOD levels.
   *
   * @param cameraX - Camera X position in world space
   * @param cameraZ - Camera Z position in world space
   * @param lodThresholds - Distance thresholds for each LOD level
   *                        [lod0Max, lod1Max, lod2Max, ...] in world units
   *
   * @example
   * ```typescript
   * // LOD 0: 0-50 units, LOD 1: 50-100, LOD 2: 100-200, LOD 3: 200+
   * quadtree.updateLOD(cameraX, cameraZ, [50, 100, 200]);
   * ```
   */
  updateLOD(cameraX: number, cameraZ: number, lodThresholds: number[]): void {
    this.updateLODRecursive(this.root, cameraX, cameraZ, lodThresholds);
  }

  /**
   * Recursive helper for updating LOD levels
   *
   * @param node - Current node to update
   * @param cameraX - Camera X position
   * @param cameraZ - Camera Z position
   * @param lodThresholds - LOD distance thresholds
   */
  private updateLODRecursive(
    node: QuadtreeNode,
    cameraX: number,
    cameraZ: number,
    lodThresholds: number[],
  ): void {
    // Calculate distance from camera to node center
    const dx = node.center.x - cameraX;
    const dz = node.center.z - cameraZ;
    const distance = Math.sqrt(dx * dx + dz * dz);

    // Determine LOD level based on distance
    let lodLevel = lodThresholds.length; // Default to lowest detail
    for (let i = 0; i < lodThresholds.length; i++) {
      if (distance < lodThresholds[i]) {
        lodLevel = i;
        break;
      }
    }

    node.lodLevel = lodLevel;

    // Recursively update children
    if (node.children) {
      for (const child of node.children) {
        this.updateLODRecursive(child, cameraX, cameraZ, lodThresholds);
      }
    }
  }

  /**
   * Returns all visible chunks for rendering
   *
   * Currently returns all leaf nodes. In future phases, this can
   * be extended with frustum culling and occlusion detection.
   *
   * @returns Array of visible leaf nodes
   */
  getVisibleChunks(): QuadtreeNode[] {
    // For now, all leaf nodes are visible
    // Phase D can add frustum culling here
    return this.getLeafNodes();
  }

  /**
   * Gets statistics about the quadtree structure
   *
   * @returns Object containing tree statistics
   */
  getStats(): {
    totalNodes: number;
    leafNodes: number;
    maxDepth: number;
  } {
    let totalNodes = 0;
    let leafNodes = 0;

    const countNodes = (node: QuadtreeNode): void => {
      totalNodes++;
      if (node.children === null) {
        leafNodes++;
      } else {
        node.children.forEach(countNodes);
      }
    };

    countNodes(this.root);

    return {
      totalNodes,
      leafNodes,
      maxDepth: this.maxLevel,
    };
  }

  /**
   * Clears the entire tree (useful for rebuilding)
   */
  clear(): void {
    this.root.children = null;
    this.root.lodLevel = 3;
  }
}
