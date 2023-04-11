import { Box, Fab, Stack, Typography } from "@mui/material";
import AnimationViewPort from "./AnimationViewPort";
import { Download, Pause, PlayArrow, Upload } from "@mui/icons-material";
import { useState } from "react";
import { Particle } from "./nBodyTypes";

const defaultParticles: Particle[] = [
  {
    position: { x: -10, y: -10, z: -10 },
    velocity: { x: 0, y: 0.0, z: 0.0 },
    radius: 1,
    mass: 1,
  },
  {
    position: { x: 10, y: 10, z: 10 },
    velocity: { x: 0.0, y: 0, z: 0 },
    radius: 1,
    mass: 1,
  },
  {
    position: { x: -10, y: 10, z: 10 },
    velocity: { x: 0.0, y: 0, z: 0 },
    radius: 1,
    mass: 1,
  },
  {
    position: { x: 10, y: -10, z: 10 },
    velocity: { x: 0.0, y: 0, z: 0 },
    radius: 1,
    mass: 1,
  },
  {
    position: { x: 10, y: 10, z: -10 },
    velocity: { x: 0.0, y: 0, z: 0 },
    radius: 2,
    mass: 10000,
  },
  {
    position: { x: 0, y: 0, z: 0 },
    velocity: { x: 0, y: 0, z: 0 },
    radius: 1,
    mass: 1,
  },
];

const NBodySimulation = () => {
  const [paused, setPaused] = useState(true);
  const [particles, setParticles] = useState(defaultParticles);
  const [theta, setTheta] = useState(0.1);

  return (
    <Box
      sx={
        //@ts-expect-error some weird typescript error ts(2590) from wrapping 3js with mui
        {
          display: "flex",
          width: "100%",
          alignItems: "center",
          flexDirection: "column",
          gap: 2,
        }
      }
    >
      <Typography variant="h4">N Body Simulation</Typography>
      <AnimationViewPort
        isPaused={paused}
        theta={theta}
        particlesFromFile={particles}
      />
      <Box sx={{ display: "flex", gap: 2 }}>
        <Fab
          onClick={() => {
            setPaused(false);
          }}
        >
          <PlayArrow />
        </Fab>
        <Fab
          onClick={() => {
            setPaused(true);
          }}
        >
          <Pause />
        </Fab>
      </Box>
      <Box>Particle summary will go here</Box>
      <Box>
        <Fab color="primary" variant="extended">
          <Upload />
        </Fab>
        <Fab color="primary" variant="extended">
          <Download />
        </Fab>
      </Box>
    </Box>
  );
};

export default NBodySimulation;
