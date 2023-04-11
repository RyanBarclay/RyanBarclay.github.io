// new type point that has x,y,z coordinates and velocity
export type Particle = {
  position: Point;
  velocity: {
    x: number;
    y: number;
    z: number;
  };
  radius: number;
  mass: number;
};

export type Point = Vector3D;

export type Vector3D = {
  x: number;
  y: number;
  z: number;
};

export type OctalTree =
  | {
      centerOfMass: Point;
      totalMass: number;
      boundingBox: BoundingBox;
      children: (OctalTree | undefined)[] | undefined; // undefined means that the node is a leaf
      particle?: Particle; // undefined means that the node is either a branch or a leaf with no particles
    }
  | undefined;

export type BoundingBox = {
  frontLeftBottom: Point;
  frontRightBottom: Point;
  frontLeftTop: Point;
  frontRightTop: Point;
  backLeftBottom: Point;
  backRightBottom: Point;
  backLeftTop: Point;
  backRightTop: Point;
};
