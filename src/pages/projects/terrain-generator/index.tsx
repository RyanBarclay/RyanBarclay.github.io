/**
 * Procedural Terrain Generator - Project Detail Page
 *
 * Showcases AI-assisted development with custom noise algorithms,
 * LOD optimization, and real-time 3D terrain visualization.
 *
 * Phase F - Complete
 */

import React from "react";
import { Box, Typography } from "@mui/material";
import { TerrainProvider } from "./context/TerrainContext";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";
import ProjectDetailLayout from "../../../components/layout/ProjectDetailLayout";
import { getProjectById } from "../../../data/projects";
import TerrainCanvas from "./TerrainCanvas";
import ControlPanel from "./components/controls/ControlPanel";

const TerrainGeneratorProject = () => {
  const projectData = getProjectById("terrain-generator");

  const sections = [
    {
      title: "Overview",
      content: (
        <Typography paragraph>
          A real-time 3D terrain generator showcasing modern AI-assisted
          development. Built entirely through structured collaboration between
          human oversight and GitHub Copilot with Claude Sonnet 4.5, this
          project demonstrates the power of systematic AI-driven software
          engineering. Features custom implementations of Simplex noise, fractal
          Brownian motion, and an advanced LOD system with quadtree spatial
          partitioning for optimal performance.
        </Typography>
      ),
    },
    {
      title: "AI-Driven Development Process",
      content: (
        <>
          <Typography paragraph>
            This project represents a new paradigm in software development:
            human-AI collaboration with structured quality gates. The entire
            codebase (~3,800 lines across 35+ files) was created through
            systematic coordination of specialized AI sub-agents.
          </Typography>
          <Typography paragraph>
            <strong>Development Workflow:</strong>
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            <Typography component="li">
              <strong>PRD Generation:</strong> Google's Gemini created a
              comprehensive Product Requirements Document defining architecture,
              data structures, and six implementation phases
            </Typography>
            <Typography component="li">
              <strong>Parallel Execution:</strong> Each phase divided into
              concurrent groups executed by specialized sub-agents, maximizing
              development velocity
            </Typography>
            <Typography component="li">
              <strong>Quality Gates:</strong> Architecture audits after each
              phase ensured alignment with the original plan
            </Typography>
            <Typography component="li">
              <strong>Zero External Dependencies:</strong> All algorithms
              implemented from scratch to demonstrate deep algorithmic
              understanding
            </Typography>
          </Box>
        </>
      ),
    },
    {
      title: "Technical Implementation",
      content: (
        <>
          <Typography paragraph>
            The terrain generator implements advanced procedural generation and
            optimization techniques:
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            <Typography component="li">
              <strong>Custom Simplex Noise:</strong> 2D gradient noise with 12
              directional gradients, implemented from scratch without external
              libraries
            </Typography>
            <Typography component="li">
              <strong>Fractal Brownian Motion (fBm):</strong> Multiple octaves
              of noise summed with decreasing amplitude for realistic terrain
              elevation
            </Typography>
            <Typography component="li">
              <strong>Quadtree LOD System:</strong> Distance-based
              level-of-detail with O(log n) spatial queries, reducing triangles
              by 75% at maximum distance
            </Typography>
            <Typography component="li">
              <strong>Multi-Format Export:</strong> OBJ (3D modeling), STL (3D
              printing), PNG heightmap (game engines), RAW binary (scientific
              visualization)
            </Typography>
            <Typography component="li">
              <strong>BC Nature Color Palette:</strong> Integrated British
              Columbia's official color scheme (Forest Green, Coastal Waters)
            </Typography>
          </Box>
        </>
      ),
    },
    {
      title: "Performance Optimizations",
      content: (
        <Typography paragraph>
          Achieves 60 FPS on 256×256 terrain through multiple optimization
          strategies: LOD system with dynamic triangle reduction, geometry
          disposal on regeneration preventing memory leaks, frame-skipped LOD
          updates (every 2 frames) reducing computational overhead, local state
          management in controls for instant slider feedback, and BufferGeometry
          with typed arrays for GPU efficiency.
        </Typography>
      ),
    },
    {
      title: "Development Insights",
      content: (
        <>
          <Typography paragraph>
            This project demonstrates the transformative potential of
            AI-assisted development:
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            <Typography component="li">
              <strong>Speed:</strong> ~3,800 lines implemented in hours, not
              days
            </Typography>
            <Typography component="li">
              <strong>Quality:</strong> Comprehensive JSDoc, TypeScript strict
              mode, clean architecture with zero compiler errors
            </Typography>
            <Typography component="li">
              <strong>Learning:</strong> Each sub-agent implemented best
              practices for React hooks, Three.js optimization, and algorithm
              implementation
            </Typography>
            <Typography component="li">
              <strong>Documentation:</strong> Auto-generated USAGE.md,
              PERFORMANCE.md, and comprehensive README.md
            </Typography>
          </Box>
          <Typography paragraph sx={{ mt: 2 }}>
            The structured approach with PRD, phases, and audits ensured
            architectural integrity while leveraging AI's code generation
            capabilities. This represents a blueprint for future AI-assisted
            projects where human oversight guides systematic AI execution.
          </Typography>
        </>
      ),
    },
  ];

  if (!projectData) return null;

  return (
    <ErrorBoundary>
      <TerrainProvider>
        <ProjectDetailLayout
          title={projectData.title}
          tags={projectData.tags}
          sections={sections}
          technologies={projectData.technologies}
          additionalContent={
            <Box
              sx={{
                position: "relative",
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: { xs: 0, md: 2 },
                width: "100%",
                minHeight: { xs: "70vh", md: "600px" },
              }}
            >
              {/* 3D Visualization Canvas */}
              <Box
                sx={{
                  flex: 1,
                  height: { xs: "70vh", md: "600px" },
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <TerrainCanvas />
              </Box>

              {/* Control Panel - Desktop Only (Mobile uses drawer) */}
              <Box
                sx={{
                  display: { xs: "none", md: "block" },
                  width: "320px",
                  flexShrink: 0,
                }}
              >
                <ControlPanel />
              </Box>

              {/* Mobile Control Panel (rendered inside TerrainCanvas as floating button) */}
              <Box sx={{ display: { xs: "block", md: "none" } }}>
                <ControlPanel />
              </Box>
            </Box>
          }
        />
      </TerrainProvider>
    </ErrorBoundary>
  );
};

export default TerrainGeneratorProject;
