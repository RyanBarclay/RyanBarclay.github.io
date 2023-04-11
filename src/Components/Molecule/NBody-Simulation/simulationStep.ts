import {
  BoundingBox,
  OctalTree,
  Particle,
  Point,
  Vector3D,
} from "./nBodyTypes";

const isInChild = (particle: Particle, boundingBox: BoundingBox): boolean => {
  // O(1) time complexity
  if (
    particle.position.x >= boundingBox.frontLeftBottom.x &&
    particle.position.x <= boundingBox.frontRightBottom.x &&
    particle.position.y >= boundingBox.frontLeftBottom.y &&
    particle.position.y <= boundingBox.frontLeftTop.y &&
    particle.position.z >= boundingBox.frontLeftBottom.z &&
    particle.position.z <= boundingBox.backLeftBottom.z
  ) {
    return true;
  }
  return false;
};

const getBoundingBox = (particles: Particle[]): BoundingBox => {
  // returns a axis aligned bounding box fora all the particles that are in the octal tree
  // https://en.wikipedia.org/wiki/Bounding_box

  // O(n) time complexity
  var bb: BoundingBox = {
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
      bb.frontLeftTop.x = particle.position.x;
      bb.backLeftBottom.x = particle.position.x;
      bb.backLeftTop.x = particle.position.x;
    }
    if (particle.position.x > bb.frontRightBottom.x) {
      bb.frontRightBottom.x = particle.position.x;
      bb.frontRightTop.x = particle.position.x;
      bb.backRightBottom.x = particle.position.x;
      bb.backRightTop.x = particle.position.x;
    }
    if (particle.position.y < bb.frontLeftBottom.y) {
      bb.frontLeftBottom.y = particle.position.y;
      bb.frontRightBottom.y = particle.position.y;
      bb.backLeftBottom.y = particle.position.y;
      bb.backRightBottom.y = particle.position.y;
    }
    if (particle.position.y > bb.frontLeftTop.y) {
      bb.frontLeftTop.y = particle.position.y;
      bb.frontRightTop.y = particle.position.y;
      bb.backLeftTop.y = particle.position.y;
      bb.backRightTop.y = particle.position.y;
    }
    if (particle.position.z < bb.frontLeftBottom.z) {
      bb.frontLeftBottom.z = particle.position.z;
      bb.frontRightBottom.z = particle.position.z;
      bb.frontLeftTop.z = particle.position.z;
      bb.frontRightTop.z = particle.position.z;
    }
    if (particle.position.z > bb.backLeftBottom.z) {
      bb.backLeftBottom.z = particle.position.z;
      bb.backRightBottom.z = particle.position.z;
      bb.backLeftTop.z = particle.position.z;
      bb.backRightTop.z = particle.position.z;
    }
  });
  return bb;
};

const initOctalTreeChildren = (
  boundingBox: BoundingBox,
  existingParticle: Particle
) => {
  // returns an array of 8 undefined octal trees that are the children of the bounding box
  // all the values will be initialized to a default value;
  // O(1) time complexity
  const children: OctalTree[] = [];
  // get the center of the bounding box
  const center: Point = {
    x: (boundingBox.frontLeftBottom.x + boundingBox.frontRightBottom.x) / 2,
    y: (boundingBox.frontLeftBottom.y + boundingBox.frontLeftTop.y) / 2,
    z: (boundingBox.frontLeftBottom.z + boundingBox.backLeftBottom.z) / 2,
  };

  for (const pointKey in boundingBox) {
    const pointOnBoundingBox = boundingBox[pointKey as keyof BoundingBox];
    const bb = getBoundingBox([
      {
        position: pointOnBoundingBox,
        velocity: { x: 0, y: 0, z: 0 },
        radius: 0,
        mass: 0,
      },
      { position: center, velocity: { x: 0, y: 0, z: 0 }, radius: 0, mass: 0 },
    ]);
    const centerOfBB: Point = {
      x: (bb.frontLeftBottom.x + bb.frontRightBottom.x) / 2,
      y: (bb.frontLeftBottom.y + bb.frontLeftTop.y) / 2,
      z: (bb.frontLeftBottom.z + bb.backLeftBottom.z) / 2,
    };
    if (isInChild(existingParticle, bb)) {
      children.push({
        centerOfMass: centerOfBB,
        totalMass: existingParticle.mass,
        particle: existingParticle,
        boundingBox: bb,
        children: undefined,
      });
      continue;
    } else {
      children.push({
        centerOfMass: centerOfBB,
        totalMass: 0,
        particle: undefined,
        boundingBox: bb,
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
  }
  for (let i = 0; i < 8; i++) {
    if (isInChild(particle, octalTree.children[i]!.boundingBox)) {
      return i;
    }
  }
  throw new Error("particle is not in any child");
};

const octInsert = (particle: Particle, octalTree: OctalTree): OctalTree => {
  /*
   https://people.eecs.berkeley.edu/~demmel/cs267/lecture26/lecture26.html
   procedure octInsert(i,n)   
     ... Try to insert particle i at node n in OctalTree
     ... By construction, each leaf will contain either 
     ... 1 or 0 particles
     if the subtree rooted at n contains more than 1 particle
        determine which child c of node n particle i lies in
          QuadInsert(i,c)
     else if the subtree rooted at n contains one particle 
        ... n is a leaf
        add n's four children to the OctalTree
        move the particle already in n into the child in which it lies
        let c be child in which particle i lies
        QuadInsert(i,c)
     else if the subtree rooted at n is empty        
        ... n is a leaf 
        store particle i in node n
     endif
    end procedure
  */

  // if the subtree rooted at n contains more than 1 particle
  if (octalTree === undefined) {
    // it's a leaf that's been cut off
    throw new Error("octalTree is undefined where it shouldn't be");
  } else if (
    octalTree.particle === undefined &&
    octalTree.children !== undefined
  ) {
    // if the subtree rooted at n contains more than 1 particle
    //     determine which child c of node n particle i lies in
    //       QuadInsert(i,c)
    const childIndex = getOctalTreeChild(particle, octalTree);
    octalTree.children[childIndex] = octInsert(
      particle,
      octalTree.children[childIndex]
    );
    return octalTree;
  } else if (
    octalTree.particle !== undefined &&
    octalTree.children === undefined
  ) {
    // else if the subtree rooted at n contains one particle
    // ... n is a leaf
    // add n's four children to the OctalTree
    // move the particle already in n into the child
    //    in which it lies
    // let c be child in which particle i lies
    // QuadInsert(i,c)

    // add n's four children to the OctalTree and move the particle already in n into the child in which it lies
    octalTree.children = initOctalTreeChildren(
      octalTree.boundingBox,
      octalTree.particle
    );
    // remove the particle from the node
    octalTree.particle = undefined;
    octalTree = octInsert(particle, octalTree);
    return octalTree;
  } else if (
    octalTree.particle === undefined &&
    octalTree.children === undefined
  ) {
    // else if the subtree rooted at n is empty
    // ... n is a leaf
    // store particle i in node n
    octalTree.particle = particle;
    return octalTree;
  }
};

const trimEmptyLeaves = (octalTree: OctalTree): OctalTree | undefined => {
  // traverse the tree and eliminate empty leaves in a tail recursive manner

  // O(n) time complexity i think, map is weird

  // if trimmed leaf
  if (octalTree === undefined) {
    return undefined;
  }
  // if the node is a leaf
  else if (octalTree.children === undefined) {
    return octalTree.particle ? octalTree : undefined;
  }
  // if the node is a branch
  else {
    // kill all the empty children
    // https://www.youtube.com/watch?v=Lgunjm9pJ-s&ab_channel=MemeFountain
    octalTree.children = octalTree.children.map((child) =>
      trimEmptyLeaves(child)
    );
    // if all the children are empty
    if (octalTree.children.every((child) => child === undefined)) {
      return undefined;
    }
    // if at least one child is not empty
    else {
      return octalTree;
    }
  }
};
const octTreeBuild = (particles: Particle[]): OctalTree => {
  /*
  https://people.eecs.berkeley.edu/~demmel/cs267/lecture26/lecture26.html
  procedure OctTreeBuild
     octTree = {empty}
       For i = 1 to n          ... loop over all particles
         octInsert(i, root)   ... insert particle i in octTree
       end for
       ... at this point, the octTree may have some empty 
       ... leaves, whose siblings are not empty
       Traverse the tree, eliminating empty leaves
       return octTree
  end procedure
  */
  // compute global bounding box
  const boundingBox: BoundingBox = getBoundingBox(particles);
  // https://en.wikipedia.org/wiki/Bounding_box
  let octalTree: OctalTree = {
    centerOfMass: { x: 0, y: 0, z: 0 },
    totalMass: 0,
    boundingBox: boundingBox,
    children: undefined,
    particle: undefined,
  };
  particles.forEach((particle) => {
    console.log({ particle });
    console.log({ octalTree });
    octalTree = octInsert(particle, octalTree);
  });

  // traverse the tree and eliminate empty leaves
  octalTree = trimEmptyLeaves(octalTree);
  // all children will either be undefined or have children
  return octalTree;
};
const octTreeComputeCenterOfMass = (octalTree: OctalTree): OctalTree => {
  /*
  https://people.eecs.berkeley.edu/~demmel/cs267/lecture26/lecture26.html
  ... Compute the center of mass and total mass 
  ... for particles in each subSquare
  ( mass, cm ) = Compute_Mass(root)   ... cm = center of mass

  function ( mass, cm ) = Compute_Mass(n)    
      ... Compute the mass and center of mass (cm) of 
      ... all the particles in the subtree rooted at n
      if n contains 1 particle
           ... the mass and cm of n are identical to 
           ... the particle's mass and position
           store ( mass, cm ) at n
           return ( mass, cm )
      else
           for all four children c(i) of n (i=1,2,3,4)
               ( mass(i), cm(i) ) = Compute_Mass(c(i))
           end for
           mass = mass(1) + mass(2) + mass(3) + mass(4) 
                ... the mass of a node is the sum of 
                ... the masses of the children
           cm = (  mass(1)*cm(1) + mass(2)*cm(2) 
                 + mass(3)*cm(3) + mass(4)*cm(4)) / mass
                ... the cm of a node is a weighted sum of 
                ... the cm's of the children
           store ( mass, cm ) at n
           return ( mass, cm )
      end
  end function
  */
  if (octalTree === undefined) {
    // if trimmed leaf
    return undefined;
  }
  // if the node is a leaf
  if (octalTree.children === undefined) {
    // if the node is a leaf and has a particle
    if (octalTree.particle !== undefined) {
      octalTree.centerOfMass = octalTree.particle.position;
      octalTree.totalMass = octalTree.particle.mass;
    } else {
      throw new Error("untrimmed leaf still in tree");
    }
    // if the node is a leaf and has no particle it would have been trimmed
  }
  // if the node is a branch
  else {
    // compute the center of mass for each child
    octalTree.children = octalTree.children.map((child) =>
      octTreeComputeCenterOfMass(child)
    );
    // compute the center of mass for the branch
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
    octalTree.centerOfMass = centerOfMass;
    octalTree.totalMass = totalMass;
  }
  return octalTree;
};

const calcForceBetweenParticles = (p: Particle, pb: Particle): Vector3D => {
  // F = G*m1*m2*( (pb - p) / R)
  // R = {x:(xcm - x)/(r^3), y:(ycm - y)/(r^3), z:(zcm - z)/(r^3)}
  // r = sqrt(   ( xcm - x )^2  + ( ycm - y )^2  + ( zcm - z )^2 )

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
    x: G * p.mass * pb.mass * Rx,
    y: G * p.mass * pb.mass * Ry,
    z: G * p.mass * pb.mass * Rz,
  };
  return force;
};

const calcForce = (
  particle: Particle,
  octTree: OctalTree,
  theta: number
): Vector3D => {
  /*
  https://people.eecs.berkeley.edu/~demmel/cs267/lecture26/lecture26.html
    function f = TreeForce(i,n)
          ... Compute gravitational force on particle i 
          ... due to all particles in the box at n
          f = 0
          if n contains one particle
              f = force computed using formula (*) above
          else 
              r = distance from particle i to 
                     center of mass of particles in n
              D = size of box n
              if D/r < theta
                  compute f using formula (*) above
              else
                  for all children c of n
                      f = f + TreeForce(i,c)
                  end for
              end if
          end if
  */
  let force: Vector3D = { x: 0, y: 0, z: 0 };

  if (octTree === undefined) {
    // if trimmed leaf
    return force;
  }

  // if the node is a leaf
  if (octTree.children === undefined) {
    if (octTree.particle !== undefined) {
      force = calcForceBetweenParticles(particle, octTree.particle);
    }
  } else {
    // if the node is a branch
    const r = Math.sqrt(
      (octTree.centerOfMass.x - particle.position.x) ** 2 +
        (octTree.centerOfMass.y - particle.position.y) ** 2 +
        (octTree.centerOfMass.z - particle.position.z) ** 2
    );
    // average distance between lines on the bounding box
    // TODO: this might make a big difference
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
  // calculate the force on each particle and update the velocity and position using the force and time step
  // https://en.wikipedia.org/wiki/Leapfrog_integration
  // a = F/m
  // vf = vi + a*dt
  // pf = pi + (vf + vi)/2*dt
  // D/R = size of box / distance to center of mass(pb)
  // if D/r < theta then use center of mass approximation
  // F = G*m1*m2*( (pb - p) / R^3)
  /* 
  https://people.eecs.berkeley.edu/~demmel/cs267/lecture26/lecture26.html
  step 3 of barnes hut algorithm
   ... For each particle, traverse the tree 
      ... to compute the force on it.
      For i = 1 to n
          f(i) = TreeForce(i,root)   
      end for
  */
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

const simulationStep = (
  dt: number,
  theta: number = 0.1,
  particles?: Particle[]
) => {
  // barnes-hut algorithm
  // https://people.eecs.berkeley.edu/~demmel/cs267/lecture26/lecture26.html
  // https://en.wikipedia.org/wiki/Barnes%E2%80%93Hut_simulation

  // construct octal tree
  // https://en.wikipedia.org/wiki/Octree
  if (particles === undefined) {
    return undefined;
  }
  let octalTree = octTreeBuild(particles);
  // for each sub-tree in octal tree compute the center of mass and total mass for all the particles in the sub-tree.
  octalTree = octTreeComputeCenterOfMass(octalTree);
  // update velocity and position of each particle
  particles = update_particles(particles, octalTree, dt, theta);
  // return new particles
  return particles;
};

export default simulationStep;
