/**
 * Procedural Terrain Generator - Project Detail Page
 *
 * Showcases AI-assisted development with custom noise algorithms,
 * LOD optimization, and real-time 3D terrain visualization.
 *
 * Phase F - Complete
 */

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Fullscreen as FullscreenIcon,
  Close as CloseIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { TerrainProvider } from "./context/TerrainContext";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";
import ProjectDetailLayout from "../../../components/layout/ProjectDetailLayout";
import { getProjectById } from "../../../data/projects";
import TerrainCanvas from "./TerrainCanvas";
import ControlPanel from "./components/controls/ControlPanel";

const TerrainGeneratorProject = () => {
  const projectData = getProjectById("terrain-generator");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [controlsOpen, setControlsOpen] = useState(false);

  const sections = [
    {
      title: "Overview",
      content: (
        <>
          <Typography paragraph>
            A real-time 3D terrain generator I designed and built using
            structured multi-agent AI workflows. I architected the full system —
            algorithms, data structures, and phased implementation plan — then
            coordinated specialized Claude Code agents to execute each phase
            under quality gates. The result: ~3,800 lines across 35+ files, 60
            FPS on 256×256 meshes, and four export formats.
          </Typography>
          <Typography paragraph>
            Features custom Simplex noise, fractal Brownian motion, and a
            quadtree LOD system — all implemented from scratch without external
            algorithm libraries.
          </Typography>
        </>
      ),
    },
    {
      title: "AI-Driven Development Process",
      content: (
        <>
          <Typography paragraph>
            I designed the system architecture and directed specialized Claude
            Code agents through a phased build process with audits between each
            phase. The codebase (~3,800 lines across 35+ files) was executed by
            AI agents under my technical oversight — not co-generated, but
            directed.
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
            <>
              {/* Desktop: Side-by-side layout (unchanged) */}
              {!isMobile && (
                <Box
                  sx={{
                    position: "relative",
                    display: "flex",
                    gap: 2,
                    width: "100%",
                    minHeight: "600px",
                  }}
                >
                  {/* 3D Visualization Canvas */}
                  <Box
                    sx={{
                      flex: 1,
                      height: "600px",
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 1,
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <TerrainCanvas />
                  </Box>

                  {/* Control Panel - Desktop sidebar */}
                  <Box
                    sx={{
                      width: "320px",
                      flexShrink: 0,
                    }}
                  >
                    <ControlPanel />
                  </Box>
                </Box>
              )}

              {/* Mobile: Preview with full-screen modal */}
              {isMobile && (
                <>
                  {/* Preview Canvas with Open Button */}
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: "50vh",
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 1,
                      overflow: "hidden",
                    }}
                  >
                    <TerrainCanvas />

                    {/* Overlay button to open full-screen */}
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 72,
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 100,
                      }}
                    >
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<FullscreenIcon />}
                        onClick={() => setIsFullScreen(true)}
                        sx={{
                          boxShadow: 3,
                          "&:hover": {
                            boxShadow: 6,
                          },
                        }}
                      >
                        Open Full-Screen Demo
                      </Button>
                    </Box>
                  </Box>

                  {/* Full-Screen Modal */}
                  <Dialog
                    fullScreen
                    open={isFullScreen}
                    onClose={() => setIsFullScreen(false)}
                    sx={{
                      "& .MuiDialog-paper": {
                        backgroundColor: "background.default",
                      },
                    }}
                  >
                    {/* Close Button */}
                    <IconButton
                      onClick={() => setIsFullScreen(false)}
                      sx={{
                        position: "absolute",
                        top: 16,
                        left: 16,
                        zIndex: 1300,
                        backgroundColor: "background.paper",
                        boxShadow: 2,
                        "&:hover": {
                          backgroundColor: "action.hover",
                        },
                      }}
                    >
                      <CloseIcon />
                    </IconButton>

                    {/* Controls Menu Button */}
                    <IconButton
                      onClick={() => setControlsOpen(true)}
                      sx={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        zIndex: 1300,
                        backgroundColor: "background.paper",
                        boxShadow: 2,
                        "&:hover": {
                          backgroundColor: "action.hover",
                        },
                      }}
                    >
                      <MenuIcon />
                    </IconButton>

                    {/* Full-Screen Canvas */}
                    <Box
                      sx={{
                        width: "100%",
                        height: controlsOpen ? "40vh" : "100vh",
                        transition: "height 0.3s ease-in-out",
                      }}
                    >
                      <TerrainCanvas />
                    </Box>

                    {/* Controls Drawer (only shown when controlsOpen is true) */}
                    {controlsOpen && (
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: "60vh",
                          backgroundColor: "background.paper",
                          borderTopLeftRadius: 16,
                          borderTopRightRadius: 16,
                          boxShadow: 24,
                          zIndex: 1200,
                          overflow: "hidden",
                        }}
                      >
                        <ControlPanel
                          hideToggleButton={true}
                          onClose={() => setControlsOpen(false)}
                        />
                      </Box>
                    )}
                  </Dialog>
                </>
              )}
            </>
          }
        />
      </TerrainProvider>
    </ErrorBoundary>
  );
};

export default TerrainGeneratorProject;
