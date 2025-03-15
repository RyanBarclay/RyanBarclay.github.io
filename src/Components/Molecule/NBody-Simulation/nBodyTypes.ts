export type Point = Vector3D;

export type Vector3D = {
  x: number;
  y: number;
  z: number;
};

export type Particle = {
  position: Point;
  velocity: Vector3D;
  radius: number;
  mass: number;
  color?: string; // Optional to maintain compatibility with existing particle data
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
