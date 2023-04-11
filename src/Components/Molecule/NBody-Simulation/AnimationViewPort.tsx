import { Paper } from "@mui/material";
import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { Particle } from "./nBodyTypes";
import simulationStep from "./simulationStep";
type AnimationViewPortProps = {
  isPaused: boolean;
  theta: number;
  particlesFromFile: Particle[];
};

const Bodies = (props: { particles: Particle[] }): JSX.Element => {
  const { particles } = props;
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
    </mesh>
  );
};

const AnimationViewPort = (props: AnimationViewPortProps): JSX.Element => {
  const { isPaused, theta, particlesFromFile } = props;
  // barnes hut simulation

  const dt = 10; // 100ms
  const msPerFrame = 1000 / 20; // 60fps

  const [lastRendered, setLastRendered] = useState(msPerFrame);
  const [particles, setParticles] = useState<Particle[] | undefined>(
    particlesFromFile
  );
  const [renderedParticles, setRenderedParticles] = useState<
    Particle[] | undefined
  >(particles);

  console.log({ particles });

  useEffect(() => {
    if (lastRendered >= msPerFrame) {
      console.log("rendering");
      setRenderedParticles(particles);
      setLastRendered(0);
    }
  }, [lastRendered]);

  useEffect(() => {
    if (!isPaused) {
      const intervalId = setInterval(() => {
        console.log("simulating");
        setParticles((particles) => simulationStep(dt, theta, particles));
        setLastRendered((lastRendered) => (lastRendered += dt));
      }, dt); // 100zms
      return () => clearInterval(intervalId);
    }
    return;
  }, [isPaused]);

  const SimBodies = useMemo(() => {
    return <Bodies particles={renderedParticles!} />;
  }, [renderedParticles]);

  return (
    <Paper sx={{ width: "100%", height: "70vh" }}>
      <Canvas frameloop="demand">
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        {SimBodies}
        <OrbitControls />
      </Canvas>
    </Paper>
  );
};

export default AnimationViewPort;
