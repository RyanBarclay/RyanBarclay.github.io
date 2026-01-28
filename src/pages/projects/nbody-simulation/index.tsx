import React from "react";
import { Box, Typography } from "@mui/material";
import NBodySimulation from "./Simulation";
import ProjectDetailLayout from "../../../components/layout/ProjectDetailLayout";

const NBodyProject = () => {
  const sections = [
    {
      title: "Overview",
      content: (
        <Typography paragraph>
          An interactive 3D physics simulation that models gravitational
          interactions between multiple bodies in space. The simulation uses the
          Barnes-Hut algorithm to efficiently approximate gravitational forces
          between large numbers of particles, making it possible to simulate
          complex systems like galaxies and star clusters.
        </Typography>
      ),
    },
    {
      title: "Technical Implementation",
      content: (
        <>
          <Typography paragraph>
            The simulation is built using React Three Fiber for 3D rendering and
            implements the Barnes-Hut algorithm with an octree data structure
            for efficient force calculations. This optimization reduces the
            computational complexity from O(n²) to O(n log n), allowing for
            smooth simulation of hundreds of particles.
          </Typography>
          <Typography paragraph>Key features include:</Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            <Typography component="li">
              Adaptive timestep integration for stable orbital dynamics
            </Typography>
            <Typography component="li">
              Interactive camera controls for exploring the simulation in 3D
            </Typography>
            <Typography component="li">
              Configurable simulation parameters including particle count,
              masses, and velocities
            </Typography>
            <Typography component="li">
              Ability to save and load simulation states
            </Typography>
            <Typography component="li">
              Real-time visualization with particle sizing and coloring
            </Typography>
          </Box>
        </>
      ),
    },
    {
      title: "Physics Engine",
      content: (
        <Typography paragraph>
          The simulation accurately models gravitational forces using Newton's
          law of universal gravitation. The Barnes-Hut approximation divides
          space into an octree structure, where distant groups of particles are
          approximated as single masses to reduce computational overhead while
          maintaining accuracy.
        </Typography>
      ),
    },
  ];

  return (
    <ProjectDetailLayout
      title="N-Body Simulation"
      tags={["Physics", "3D Graphics", "Interactive"]}
      sections={sections}
      technologies={[
        "React",
        "TypeScript",
        "Three.js",
        "React Three Fiber",
        "Material-UI",
        "Barnes-Hut Algorithm",
      ]}
      customContent={<NBodySimulation />}
    />
  );
};

export default NBodyProject;
