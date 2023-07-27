import { Paper } from "@mui/material";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { useEffect, useState } from "react";
import { Particle } from "./nBodyTypes";
import simulationStep from "./simulationStep";
type AnimationViewPortProps = {
  isPaused: boolean;
  theta: number;
  particlesFromFile: Particle[];
  updateSimulationParticles: (particles?: Particle[]) => void;
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
  const { isPaused, theta, particlesFromFile, updateSimulationParticles } =
    props;
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
  }, [lastRendered]);

  useEffect(() => {
    if (!isPaused) {
      const intervalId = setInterval(() => {
        // console.log("simulating");
        // get nano seconds
        const now = performance.now() * 1_000_000; // 1_000_000 nanoseconds in a millisecond
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
        console.log(performance.now() * 1_000_000 - now + "ns");
        setLastRendered((lastRendered) => (lastRendered += dt));
      }, dt); // 100ms
      return () => clearInterval(intervalId);
    } else {
      updateSimulationParticles(particles);
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
