import { Box, Fab, Stack, Typography } from "@mui/material";
import AnimationViewPort from "./AnimationViewPort";
import {
  Download,
  Pause,
  PlayArrow,
  Repeat,
  Upload,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Particle } from "./nBodyTypes";

const scalar = 2;

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
    radius: 1,
    mass: 1,
  },
  {
    position: { x: 0, y: 0, z: 0 },
    velocity: { x: 0.0001, y: 0, z: 0 },
    radius: 2,
    mass: 10000,
  },
];

const defaultParticles2: Particle[] = [
  {
    position: { x: scalar * 1, y: scalar * 1, z: scalar * 1 },
    velocity: { x: 0.0001, y: 0, z: 0 },
    radius: 2,
    mass: 10000,
  },
  {
    position: { x: scalar * 1, y: scalar * 1, z: scalar * -1 },
    velocity: { x: 0.0001, y: 0, z: 0 },
    radius: 2,
    mass: 10000,
  },
  {
    position: { x: scalar * 1, y: scalar * -1, z: scalar * 1 },
    velocity: { x: 0.0001, y: 0, z: 0 },
    radius: 2,
    mass: 10000,
  },
  {
    position: { x: scalar * 1, y: scalar * -1, z: scalar * -1 },
    velocity: { x: 0.0001, y: 0, z: 0 },
    radius: 2,
    mass: 10000,
  },
  {
    position: { x: scalar * -1, y: scalar * 1, z: scalar * 1 },
    velocity: { x: 0.0001, y: 0, z: 0 },
    radius: 2,
    mass: 10000,
  },
  {
    position: { x: scalar * -1, y: scalar * 1, z: scalar * -1 },
    velocity: { x: 0.0001, y: 0, z: 0 },
    radius: 2,
    mass: 10000,
  },
  {
    position: { x: scalar * -1, y: scalar * -1, z: scalar * 1 },
    velocity: { x: 0.0001, y: 0, z: 0 },
    radius: 2,
    mass: 10000,
  },
  {
    position: { x: scalar * -1, y: scalar * -1, z: scalar * -1 },
    velocity: { x: 0.0001, y: 0, z: 0 },
    radius: 2,
    mass: 10000,
  },
];

const defaultParticles3: Particle[] = [
  {
    position: { x: scalar * 1, y: scalar * 1, z: scalar * 1 },
    velocity: { x: 0.0001, y: 0, z: 0 },
    radius: 2,
    mass: -10000,
  },
  {
    position: { x: scalar * 1, y: scalar * 1, z: scalar * -1 },
    velocity: { x: 0.0001, y: 0, z: 0 },
    radius: 2,
    mass: -10000,
  },
  {
    position: { x: scalar * 1, y: scalar * -1, z: scalar * 1 },
    velocity: { x: 0.0001, y: 0, z: 0 },
    radius: 2,
    mass: -10000,
  },
  {
    position: { x: scalar * 1, y: scalar * -1, z: scalar * -1 },
    velocity: { x: 0.0001, y: 0, z: 0 },
    radius: 2,
    mass: -10000,
  },
  {
    position: { x: scalar * -1, y: scalar * 1, z: scalar * 1 },
    velocity: { x: 0.0001, y: 0, z: 0 },
    radius: 2,
    mass: -10000,
  },
  {
    position: { x: scalar * -1, y: scalar * 1, z: scalar * -1 },
    velocity: { x: 0.0001, y: 0, z: 0 },
    radius: 2,
    mass: -10000,
  },
  {
    position: { x: scalar * -1, y: scalar * -1, z: scalar * 1 },
    velocity: { x: 0.0001, y: 0, z: 0 },
    radius: 2,
    mass: -10000,
  },
  {
    position: { x: scalar * -1, y: scalar * -1, z: scalar * -1 },
    velocity: { x: 0.0001, y: 0, z: 0 },
    radius: 2,
    mass: -10000,
  },
];

const NBodySimulation = () => {
  const systemInUse = defaultParticles;

  const [paused, setPaused] = useState(true);
  const [particles, setParticles] = useState(systemInUse);
  const [simulationParticles, setSimulationParticles] =
    useState<Particle[]>(systemInUse);
  const [theta, setTheta] = useState(0.1);

  const updateSimulationParticles = (newParticles?: Particle[]) => {
    if (newParticles) setSimulationParticles(newParticles);
  };

  const downloadSimulationParticles = () => {
    // when button is clicked this will be called to download the current simulationParticles as a json file
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(simulationParticles, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", "particles.json");
    document.body.appendChild(link); // Required for FF
    link.click();
    link.remove();
  };
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
        updateSimulationParticles={updateSimulationParticles}
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
        <Fab
          onClick={downloadSimulationParticles}
          color="primary"
          variant="extended"
        >
          <Download />
        </Fab>
      </Box>
    </Box>
  );
};

export default NBodySimulation;
