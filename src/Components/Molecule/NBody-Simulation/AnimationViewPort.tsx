import { Paper } from "@mui/material";
import {
  CubeCamera,
  OrbitControls,
  OrthographicCamera,
  PerspectiveCamera,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { Particle } from "./nBodyTypes";
import simulationStep from "./simulationStep";
type AnimationViewPortProps = {
  isPaused: boolean;
  theta: number;
  particlesFromFile: Particle[];
};

const Bodies = (props: { particles?: Particle[] }): JSX.Element => {
  const { particles } = props;
  if (!particles) {
    return <></>;
  }
  // console.log("rendering");
  const bodies = particles.map((particle, index) => {
    return <Body particle={particle} key={index} />;
  });
  return <>{bodies}</>;
};

const Body = (props: { particle: Particle }) => {
  const { particle } = props;
  const particleDetail = 10;

  return (
    <mesh
      position={[particle.position.x, particle.position.y, particle.position.z]}
    >
      <sphereGeometry
        args={[particle.radius, particleDetail, particleDetail / 2]}
      />
      <meshStandardMaterial color="red" />
    </mesh>
  );
};

const AnimationViewPort = (props: AnimationViewPortProps): JSX.Element => {
  const { isPaused, theta, particlesFromFile } = props;
  // barnes hut simulation

  const dt = 100; // 100ms
  const msPerFrame = 1000 / 60; // 60fps

  const [lastRendered, setLastRendered] = useState(msPerFrame);
  const [particles, setParticles] = useState<Particle[] | undefined>(
    particlesFromFile
  );
  const [renderedParticles, setRenderedParticles] = useState<
    Particle[] | undefined
  >(particles);

  useEffect(() => {
    if (lastRendered >= msPerFrame) {
      // console.log("prep rendering");
      setRenderedParticles(particles);
      setLastRendered(0);
    }
  }, [lastRendered, particles]);

  useEffect(() => {
    if (!isPaused) {
      const intervalId = setInterval(() => {
        // console.log("simulating");
        setParticles((particles) => {
          // return particles?.map((particle) => {
          //   return {
          //     position: {
          //       x: particle.position.x + particle.velocity.x * dt,
          //       y: particle.position.y + particle.velocity.y * dt,
          //       z: particle.position.z + particle.velocity.z * dt,
          //     },
          //     velocity: particle.velocity,
          //     radius: particle.radius,
          //     mass: particle.mass,
          //   };
          // });
          // });
          return simulationStep(dt, theta, particles);
        });
        setLastRendered((lastRendered) => (lastRendered += dt));
      }, dt); // 100ms
      return () => clearInterval(intervalId);
    }
    return;
  }, [isPaused]);

  return (
    <Paper sx={{ width: "100%", height: "70vh" }}>
      <Canvas frameloop="demand">
        <PerspectiveCamera makeDefault position={[20, 20, 60]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Bodies particles={renderedParticles} />
        <OrbitControls />
        <gridHelper args={[100, 100]} />
      </Canvas>
    </Paper>
  );
};

export default AnimationViewPort;
