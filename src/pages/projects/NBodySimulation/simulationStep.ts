import {
  BoundingBox,
  OctalTree,
  Particle,
  Point,
  Vector3D,
} from "./nBodyTypes";

// O(1) time complexity
const isInChild = (particle: Particle, boundingBox: BoundingBox): boolean => {
  return (
    particle.position.x >= boundingBox.frontLeftBottom.x &&
    particle.position.x <= boundingBox.frontRightBottom.x &&
    particle.position.y >= boundingBox.frontLeftBottom.y &&
    particle.position.y <= boundingBox.frontLeftTop.y &&
    particle.position.z >= boundingBox.backLeftBottom.z &&
    particle.position.z <= boundingBox.frontLeftBottom.z
  );
};

// O(n) time complexity
// Returns an axis-aligned bounding box for all particles
// https://en.wikipedia.org/wiki/Bounding_box
const getBoundingBox = (particles: Particle[]): BoundingBox => {
  const bb: BoundingBox = {
    frontLeftBottom: { x: 0, y: 0, z: 0 },
    frontRightBottom: { x: 0, y: 0, z: 0 },
    frontLeftTop: { x: 0, y: 0, z: 0 },
    frontRightTop: { x: 0, y: 0, z: 0 },
    backLeftBottom: { x: 0, y: 0, z: 0 },
    backRightBottom: { x: 0, y: 0, z: 0 },
    backLeftTop: { x: 0, y: 0, z: 0 },
    backRightTop: { x: 0, y: 0, z: 0 },
  };

  particles.forEach((particle) => {
    if (particle.position.x < bb.frontLeftBottom.x) {
      bb.frontLeftBottom.x = particle.position.x;
      bb.backLeftBottom.x = particle.position.x;
      bb.frontLeftTop.x = particle.position.x;
      bb.backLeftTop.x = particle.position.x;
    }
    if (particle.position.x > bb.frontRightBottom.x) {
      bb.frontRightBottom.x = particle.position.x;
      bb.backRightBottom.x = particle.position.x;
      bb.frontRightTop.x = particle.position.x;
      bb.backRightTop.x = particle.position.x;
    }
    if (particle.position.y < bb.frontLeftBottom.y) {
      bb.frontLeftBottom.y = particle.position.y;
      bb.backLeftBottom.y = particle.position.y;
      bb.frontRightBottom.y = particle.position.y;
      bb.backRightBottom.y = particle.position.y;
    }
    if (particle.position.y > bb.frontLeftTop.y) {
      bb.frontLeftTop.y = particle.position.y;
      bb.backLeftTop.y = particle.position.y;
      bb.frontRightTop.y = particle.position.y;
      bb.backRightTop.y = particle.position.y;
    }
    if (particle.position.z < bb.backLeftBottom.z) {
      bb.backLeftBottom.z = particle.position.z;
      bb.backRightBottom.z = particle.position.z;
      bb.backLeftTop.z = particle.position.z;
      bb.backRightTop.z = particle.position.z;
    }
    if (particle.position.z > bb.frontLeftBottom.z) {
      bb.frontLeftBottom.z = particle.position.z;
      bb.frontRightBottom.z = particle.position.z;
      bb.frontLeftTop.z = particle.position.z;
      bb.frontRightTop.z = particle.position.z;
    }
  });
  return bb;
};

let initOctalTreeChildren = (
  boundingBox: BoundingBox,
  existingParticle: Particle
) => {
  // returns an array of 8 undefined octal trees that are the children of the bounding box
  // O(1) time complexity

  let children: OctalTree[] = [];
  // get the center of the bounding box
  const center: Point = {
    x: (boundingBox.frontLeftBottom.x + boundingBox.frontRightBottom.x) / 2,
    y: (boundingBox.frontLeftBottom.y + boundingBox.frontLeftTop.y) / 2,
    z: (boundingBox.frontLeftBottom.z + boundingBox.backLeftBottom.z) / 2,
  };

  // Create 8 child octants properly
  // Each child is one of the 8 octants around the center point

  // Create the 8 child bounding boxes
  const childBoxes: BoundingBox[] = [
    // Front upper right (+++): octant 0
    {
      frontLeftBottom: center,
      frontRightBottom: {
        x: boundingBox.frontRightBottom.x,
        y: center.y,
        z: center.z,
      },
      frontLeftTop: { x: center.x, y: boundingBox.frontLeftTop.y, z: center.z },
      frontRightTop: {
        x: boundingBox.frontRightTop.x,
        y: boundingBox.frontRightTop.y,
        z: center.z,
      },
      backLeftBottom: {
        x: center.x,
        y: center.y,
        z: boundingBox.backLeftBottom.z,
      },
      backRightBottom: {
        x: boundingBox.backRightBottom.x,
        y: center.y,
        z: boundingBox.backRightBottom.z,
      },
      backLeftTop: {
        x: center.x,
        y: boundingBox.backLeftTop.y,
        z: boundingBox.backLeftTop.z,
      },
      backRightTop: {
        x: boundingBox.backRightTop.x,
        y: boundingBox.backRightTop.y,
        z: boundingBox.backRightTop.z,
      },
    },
    // Front lower right (+--): octant 1
    {
      frontLeftBottom: {
        x: center.x,
        y: boundingBox.frontLeftBottom.y,
        z: center.z,
      },
      frontRightBottom: {
        x: boundingBox.frontRightBottom.x,
        y: boundingBox.frontRightBottom.y,
        z: center.z,
      },
      frontLeftTop: center,
      frontRightTop: {
        x: boundingBox.frontRightTop.x,
        y: center.y,
        z: center.z,
      },
      backLeftBottom: {
        x: center.x,
        y: boundingBox.backLeftBottom.y,
        z: boundingBox.backLeftBottom.z,
      },
      backRightBottom: {
        x: boundingBox.backRightBottom.x,
        y: boundingBox.backRightBottom.y,
        z: boundingBox.backRightBottom.z,
      },
      backLeftTop: { x: center.x, y: center.y, z: boundingBox.backLeftTop.z },
      backRightTop: {
        x: boundingBox.backRightTop.x,
        y: center.y,
        z: boundingBox.backRightTop.z,
      },
    },
    // Front upper left (+-+): octant 2
    {
      frontLeftBottom: {
        x: boundingBox.frontLeftBottom.x,
        y: center.y,
        z: center.z,
      },
      frontRightBottom: center,
      frontLeftTop: {
        x: boundingBox.frontLeftTop.x,
        y: boundingBox.frontLeftTop.y,
        z: center.z,
      },
      frontRightTop: {
        x: center.x,
        y: boundingBox.frontRightTop.y,
        z: center.z,
      },
      backLeftBottom: {
        x: boundingBox.backLeftBottom.x,
        y: center.y,
        z: boundingBox.backLeftBottom.z,
      },
      backRightBottom: {
        x: center.x,
        y: center.y,
        z: boundingBox.backRightBottom.z,
      },
      backLeftTop: {
        x: boundingBox.backLeftTop.x,
        y: boundingBox.backLeftTop.y,
        z: boundingBox.backLeftTop.z,
      },
      backRightTop: {
        x: center.x,
        y: boundingBox.backRightTop.y,
        z: boundingBox.backRightTop.z,
      },
    },
    // Front lower left (---): octant 3
    {
      frontLeftBottom: {
        x: boundingBox.frontLeftBottom.x,
        y: boundingBox.frontLeftBottom.y,
        z: center.z,
      },
      frontRightBottom: {
        x: center.x,
        y: boundingBox.frontRightBottom.y,
        z: center.z,
      },
      frontLeftTop: { x: boundingBox.frontLeftTop.x, y: center.y, z: center.z },
      frontRightTop: center,
      backLeftBottom: {
        x: boundingBox.backLeftBottom.x,
        y: boundingBox.backLeftBottom.y,
        z: boundingBox.backLeftBottom.z,
      },
      backRightBottom: {
        x: center.x,
        y: boundingBox.backRightBottom.y,
        z: boundingBox.backRightBottom.z,
      },
      backLeftTop: {
        x: boundingBox.backLeftTop.x,
        y: center.y,
        z: boundingBox.backLeftTop.z,
      },
      backRightTop: { x: center.x, y: center.y, z: boundingBox.backRightTop.z },
    },
    // Back upper right (-++): octant 4
    {
      frontLeftBottom: {
        x: center.x,
        y: center.y,
        z: boundingBox.frontLeftBottom.z,
      },
      frontRightBottom: {
        x: boundingBox.frontRightBottom.x,
        y: center.y,
        z: boundingBox.frontRightBottom.z,
      },
      frontLeftTop: {
        x: center.x,
        y: boundingBox.frontLeftTop.y,
        z: boundingBox.frontLeftTop.z,
      },
      frontRightTop: {
        x: boundingBox.frontRightTop.x,
        y: boundingBox.frontRightTop.y,
        z: boundingBox.frontRightTop.z,
      },
      backLeftBottom: {
        x: center.x,
        y: center.y,
        z: boundingBox.backLeftBottom.z,
      },
      backRightBottom: {
        x: boundingBox.backRightBottom.x,
        y: center.y,
        z: boundingBox.backRightBottom.z,
      },
      backLeftTop: {
        x: center.x,
        y: boundingBox.backLeftTop.y,
        z: boundingBox.backLeftTop.z,
      },
      backRightTop: {
        x: boundingBox.backRightTop.x,
        y: boundingBox.backRightTop.y,
        z: boundingBox.backRightTop.z,
      },
    },
    // Back lower right (-+-): octant 5
    {
      frontLeftBottom: {
        x: center.x,
        y: boundingBox.frontLeftBottom.y,
        z: boundingBox.frontLeftBottom.z,
      },
      frontRightBottom: {
        x: boundingBox.frontRightBottom.x,
        y: boundingBox.frontRightBottom.y,
        z: boundingBox.frontRightBottom.z,
      },
      frontLeftTop: { x: center.x, y: center.y, z: boundingBox.frontLeftTop.z },
      frontRightTop: {
        x: boundingBox.frontRightTop.x,
        y: center.y,
        z: boundingBox.frontRightTop.z,
      },
      backLeftBottom: {
        x: center.x,
        y: boundingBox.backLeftBottom.y,
        z: boundingBox.backLeftBottom.z,
      },
      backRightBottom: {
        x: boundingBox.backRightBottom.x,
        y: boundingBox.backRightBottom.y,
        z: boundingBox.backRightBottom.z,
      },
      backLeftTop: { x: center.x, y: center.y, z: boundingBox.backLeftTop.z },
      backRightTop: {
        x: boundingBox.backRightTop.x,
        y: center.y,
        z: boundingBox.backRightTop.z,
      },
    },
    // Back upper left (--+): octant 6
    {
      frontLeftBottom: {
        x: boundingBox.frontLeftBottom.x,
        y: center.y,
        z: boundingBox.frontLeftBottom.z,
      },
      frontRightBottom: {
        x: center.x,
        y: center.y,
        z: boundingBox.frontRightBottom.z,
      },
      frontLeftTop: {
        x: boundingBox.frontLeftTop.x,
        y: boundingBox.frontLeftTop.y,
        z: boundingBox.frontLeftTop.z,
      },
      frontRightTop: {
        x: center.x,
        y: boundingBox.frontRightTop.y,
        z: boundingBox.frontRightTop.z,
      },
      backLeftBottom: {
        x: boundingBox.backLeftBottom.x,
        y: center.y,
        z: boundingBox.backLeftBottom.z,
      },
      backRightBottom: {
        x: center.x,
        y: center.y,
        z: boundingBox.backRightBottom.z,
      },
      backLeftTop: {
        x: boundingBox.backLeftTop.x,
        y: boundingBox.backLeftTop.y,
        z: boundingBox.backLeftTop.z,
      },
      backRightTop: {
        x: center.x,
        y: boundingBox.backRightTop.y,
        z: boundingBox.backRightTop.z,
      },
    },
    // Back lower left (---): octant 7
    {
      frontLeftBottom: {
        x: boundingBox.frontLeftBottom.x,
        y: boundingBox.frontLeftBottom.y,
        z: boundingBox.frontLeftBottom.z,
      },
      frontRightBottom: {
        x: center.x,
        y: boundingBox.frontRightBottom.y,
        z: boundingBox.frontRightBottom.z,
      },
      frontLeftTop: {
        x: boundingBox.frontLeftTop.x,
        y: center.y,
        z: boundingBox.frontLeftTop.z,
      },
      frontRightTop: {
        x: center.x,
        y: center.y,
        z: boundingBox.frontRightTop.z,
      },
      backLeftBottom: {
        x: boundingBox.backLeftBottom.x,
        y: boundingBox.backLeftBottom.y,
        z: boundingBox.backLeftBottom.z,
      },
      backRightBottom: {
        x: center.x,
        y: boundingBox.backRightBottom.y,
        z: boundingBox.backRightBottom.z,
      },
      backLeftTop: {
        x: boundingBox.backLeftTop.x,
        y: center.y,
        z: boundingBox.backLeftTop.z,
      },
      backRightTop: { x: center.x, y: center.y, z: boundingBox.backRightTop.z },
    },
  ];

  // Check which octant the existing particle belongs to
  for (let i = 0; i < childBoxes.length; i++) {
    const childBox = childBoxes[i];
    if (isInChild(existingParticle, childBox)) {
      children.push({
        centerOfMass: {
          x: (childBox.frontLeftBottom.x + childBox.frontRightBottom.x) / 2,
          y: (childBox.frontLeftBottom.y + childBox.frontLeftTop.y) / 2,
          z: (childBox.frontLeftBottom.z + childBox.backLeftBottom.z) / 2,
        },
        totalMass: existingParticle.mass,
        particle: existingParticle,
        boundingBox: childBox,
        children: undefined,
      });
    } else {
      children.push({
        centerOfMass: {
          x: (childBox.frontLeftBottom.x + childBox.frontRightBottom.x) / 2,
          y: (childBox.frontLeftBottom.y + childBox.frontLeftTop.y) / 2,
          z: (childBox.frontLeftBottom.z + childBox.backLeftBottom.z) / 2,
        },
        totalMass: 0,
        particle: undefined,
        boundingBox: childBox,
        children: undefined,
      });
    }
  }

  return children;
};

const getOctalTreeChild = (
  particle: Particle,
  octalTree: OctalTree
): number => {
  // returns the index of the child that the particle belongs to
  if (octalTree === undefined) {
    throw new Error("octalTree is undefined where it shouldn't be");
  } else if (octalTree.children === undefined) {
    throw new Error("octalTree children is undefined where it shouldn't be");
  } else {
    for (let i = 0; i < octalTree.children.length; i++) {
      if (octalTree.children[i] !== undefined) {
        let found = isInChild(particle, octalTree.children[i]!.boundingBox);
        if (found) {
          return i;
        }
      }
    }
  }
  throw new Error("particle is not in any child");
};

const octInsert = (particle: Particle, octalTree: OctalTree): OctalTree => {
  // if the subtree rooted at n contains more than 1 particle
  if (octalTree === undefined) {
    throw new Error("octalTree is undefined where it shouldn't be");
  } else if (
    octalTree.particle === undefined &&
    octalTree.children !== undefined
  ) {
    const childIndex = getOctalTreeChild(particle, octalTree);

    let newOctalTree = {
      ...octalTree,
      children: octalTree.children.map((child, index) => {
        if (index === childIndex) {
          return octInsert(particle, child!);
        }
        return child;
      }),
    };
    return newOctalTree;
  } else if (
    octalTree.particle !== undefined &&
    octalTree.children === undefined
  ) {
    const children = initOctalTreeChildren(
      octalTree.boundingBox,
      octalTree.particle
    );
    let newOctalTree1: OctalTree = {
      centerOfMass: octalTree.centerOfMass,
      totalMass: octalTree.totalMass,
      boundingBox: octalTree.boundingBox,
      children: children,
      particle: undefined,
    };
    let newOctalTree = octInsert(particle, newOctalTree1);
    return newOctalTree;
  } else if (
    octalTree.particle === undefined &&
    octalTree.children === undefined
  ) {
    let newOctalTree = { ...octalTree, particle };
    return newOctalTree;
  }
};

const trimEmptyLeaves = (octalTree: OctalTree): OctalTree | undefined => {
  // traverse the tree and eliminate empty leaves in a tail recursive manner

  if (octalTree === undefined) {
    return undefined;
  } else if (octalTree.children === undefined) {
    return octalTree.particle ? octalTree : undefined;
  } else {
    octalTree.children = octalTree.children.map((child) =>
      trimEmptyLeaves(child)
    );
    if (octalTree.children.every((child) => child === undefined)) {
      return undefined;
    } else {
      return octalTree;
    }
  }
};

const octTreeBuild = (particles: Particle[]): OctalTree => {
  const boundingBox: BoundingBox = getBoundingBox(particles);
  let octalTree: OctalTree = {
    centerOfMass: { x: 0, y: 0, z: 0 },
    totalMass: 0,
    boundingBox: boundingBox,
    children: undefined,
    particle: undefined,
  };
  particles.forEach((particle) => {
    octalTree = octInsert(particle, octalTree);
  });

  octalTree = trimEmptyLeaves(octalTree);
  return octalTree;
};

const octTreeComputeCenterOfMass = (octalTree: OctalTree): OctalTree => {
  let newOctalTree: OctalTree;
  if (octalTree === undefined) {
    return newOctalTree;
  }

  if (octalTree.children === undefined) {
    if (octalTree.particle !== undefined) {
      newOctalTree = {
        centerOfMass: octalTree.particle.position,
        totalMass: octalTree.particle.mass,
        boundingBox: octalTree.boundingBox,
        children: undefined,
        particle: octalTree.particle,
      };
    } else {
      throw new Error("untrimmed leaf still in tree");
    }
  } else {
    let children = octalTree.children.map((child) =>
      octTreeComputeCenterOfMass(child)
    );
    const centerOfMass: Point = {
      x: 0,
      y: 0,
      z: 0,
    };
    let totalMass = 0;
    octalTree.children.forEach((child) => {
      if (child !== undefined) {
        centerOfMass.x += child.centerOfMass.x * child.totalMass;
        centerOfMass.y += child.centerOfMass.y * child.totalMass;
        centerOfMass.z += child.centerOfMass.z * child.totalMass;
        totalMass += child.totalMass;
      }
    });
    centerOfMass.x /= totalMass;
    centerOfMass.y /= totalMass;
    centerOfMass.z /= totalMass;
    newOctalTree = {
      centerOfMass: centerOfMass,
      totalMass: totalMass,
      boundingBox: octalTree.boundingBox,
      children: children,
      particle: undefined,
    };
  }
  return newOctalTree;
};

const calcForceBetweenParticles = (p: Particle, pb: Particle): Vector3D => {
  if (p === pb) {
    return { x: 0, y: 0, z: 0 };
  }

  const G = 6.67408e-11;
  const x1MinusX2 = p.position.x - pb.position.x;
  const y1MinusY2 = p.position.y - pb.position.y;
  const z1MinusZ2 = p.position.z - pb.position.z;
  const rCubed =
    Math.sqrt(x1MinusX2 ** 2 + y1MinusY2 ** 2 + z1MinusZ2 ** 2) ** 3;
  const Rx = x1MinusX2 / rCubed;
  const Ry = y1MinusY2 / rCubed;
  const Rz = z1MinusZ2 / rCubed;

  const force: Vector3D = {
    x: -G * p.mass * pb.mass * Rx,
    y: -G * p.mass * pb.mass * Ry,
    z: -G * p.mass * pb.mass * Rz,
  };
  return force;
};

const calcForce = (
  particle: Particle,
  octTree: OctalTree,
  theta: number
): Vector3D => {
  let force: Vector3D = { x: 0, y: 0, z: 0 };
  if (octTree === undefined) {
    return force;
  }

  if (octTree.children === undefined) {
    if (octTree.particle !== undefined) {
      force = calcForceBetweenParticles(particle, octTree.particle);
    }
  } else {
    const r = Math.sqrt(
      (octTree.centerOfMass.x - particle.position.x) ** 2 +
        (octTree.centerOfMass.y - particle.position.y) ** 2 +
        (octTree.centerOfMass.z - particle.position.z) ** 2
    );
    const D = Math.sqrt(
      (octTree.boundingBox.frontLeftBottom.x -
        octTree.boundingBox.frontRightBottom.x) **
        2 +
        (octTree.boundingBox.frontLeftBottom.y -
          octTree.boundingBox.frontRightBottom.y) **
          2 +
        (octTree.boundingBox.frontLeftBottom.z -
          octTree.boundingBox.frontRightBottom.z) **
          2
    );
    if (D / r < theta) {
      force = calcForceBetweenParticles(particle, {
        position: octTree.centerOfMass,
        mass: octTree.totalMass,
        velocity: { x: 0, y: 0, z: 0 },
        radius: 0,
      });
    } else {
      octTree.children.forEach((child) => {
        if (child !== undefined) {
          const childForce = calcForce(particle, child, theta);
          force = {
            x: force.x + childForce.x,
            y: force.y + childForce.y,
            z: force.z + childForce.z,
          };
        }
      });
    }
  }
  return force;
};

const update_particles = (
  particles: Particle[],
  octTree: OctalTree,
  dt: number,
  theta: number
): Particle[] => {
  for (let i = 0; i < particles.length; i++) {
    const particle = particles[i];
    const force: Vector3D = calcForce(particle, octTree, theta);
    const acceleration = {
      x: force.x / particle.mass,
      y: force.y / particle.mass,
      z: force.z / particle.mass,
    };
    const vfx = acceleration.x * dt + particle.velocity.x;
    const vfy = acceleration.y * dt + particle.velocity.y;
    const vfz = acceleration.z * dt + particle.velocity.z;

    particle.position.x =
      particle.position.x + ((vfx + particle.velocity.x) / 2) * dt;
    particle.position.y =
      particle.position.y + ((vfy + particle.velocity.y) / 2) * dt;
    particle.position.z =
      particle.position.z + ((vfz + particle.velocity.z) / 2) * dt;
    particle.velocity.x = vfx;
    particle.velocity.y = vfy;
    particle.velocity.z = vfz;
    particles[i] = particle;
  }
  return particles;
};

const collectAllBoundingBoxes = (octalTree: OctalTree): BoundingBox[] => {
  const boundingBoxes: BoundingBox[] = [];

  const traverse = (node: OctalTree) => {
    if (!node) return;
    boundingBoxes.push(node.boundingBox);
    if (node.children) {
      node.children.forEach((child) => child && traverse(child));
    }
  };

  traverse(octalTree);
  return boundingBoxes;
};

const simulationStep = (
  dt: number,
  theta: number = 0.1,
  particles?: Particle[]
): { particles: Particle[]; boundingBoxes: BoundingBox[] } | undefined => {
  if (!particles) return undefined;

  // Barnes-Hut algorithm
  // https://people.eecs.berkeley.edu/~demmel/cs267/lecture26/lecture26.html
  const octalTree = octTreeComputeCenterOfMass(octTreeBuild(particles));
  const newParticles = update_particles(particles, octalTree, dt, theta);
  const allBoundingBoxes = collectAllBoundingBoxes(octalTree);

  return {
    particles: newParticles,
    boundingBoxes: allBoundingBoxes,
  };
};

export default simulationStep;
