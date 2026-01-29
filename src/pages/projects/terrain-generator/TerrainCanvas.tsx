/**
 * TerrainCanvas.tsx
 *
 * React Three Fiber canvas setup for 3D terrain visualization.
 *
 * Features:
 * - R3F Canvas with proper camera positioning
 * - Orbit controls for camera movement
 * - Scene lighting (ambient + directional)
 * - Grid helper for spatial reference
 * - Renders TerrainMesh component
 * - PerformanceHUD overlay for real-time stats
 * - Loading overlay when no terrain generated
 *
 * Phase F - Group 1A: Loading States & Error Boundaries
 */

import React, { useEffect, useRef } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GridHelper } from "three";
import TerrainMesh from "./components/terrain/TerrainMesh";
import PerformanceHUDWrapper from "./components/ui/PerformanceHUDWrapper";
import { useTerrainContext } from "./context/TerrainContext";
import { useTerrainGen } from "./hooks/useTerrainGen";

/**
 * TerrainCanvas component
 *
 * Provides the React Three Fiber canvas with complete scene setup.
 * Includes camera, lighting, controls, and terrain rendering.
 * Shows loading overlay when no terrain has been generated.
 *
 * @returns R3F Canvas with 3D scene and loading overlay
 *
 * @example
 * <TerrainProvider>
 *   <TerrainCanvas />
 * </TerrainProvider>
 */
export default function TerrainCanvas() {
  const { geometry, config } = useTerrainContext();
  const { generate } = useTerrainGen();
  const hasGenerated = useRef(false);
  const isLoading = geometry === null;

  // Auto-generate terrain on first load
  useEffect(() => {
    if (!hasGenerated.current && geometry === null) {
      hasGenerated.current = true;
      // Small delay to allow UI to render first
      setTimeout(() => generate(), 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geometry]); // Only depend on geometry, not generate (to avoid retriggering on config changes)

  // Terrain is now centered at origin (0, 0, 0)

  return (
    <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
      {/* Loading Overlay */}
      {isLoading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            zIndex: 10,
            backdropFilter: "blur(5px)",
          }}
        >
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2, color: "white" }}>
            Generate terrain to begin
          </Typography>
        </Box>
      )}

      {/* Canvas */}
      <Canvas
        camera={{
          position: [50, 100, 50], // Position above and offset from origin
          fov: 60,
        }}
        style={{
          height: "100%",
          width: "100%",
        }}
      >
        {/* Ambient lighting for base illumination */}
        <ambientLight intensity={0.4} />

        {/* Directional light for shadows and depth */}
        <directionalLight position={[50, 100, 50]} intensity={0.8} />

        {/* Camera controls with damping for smooth movement */}
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2} // Prevent camera from going below ground
          target={[0, 0, 0]} // Look at origin (terrain center)
        />

        {/* The procedural terrain mesh */}
        <TerrainMesh />

        {/* Ground grid for spatial reference - fixed at 128 size */}
        <primitive
          object={
            new GridHelper(
              128, // Fixed grid size at 128
              8, // Divisions: 16-unit squares
              0x2c5530, // Center line: Forest Green
              0x444444, // Grid lines: Dark gray
            )
          }
          position={[0, -0.1, 0]} // Centered at origin, slightly below terrain
        />

        {/* Performance HUD (inside Canvas - uses Html from drei) */}
        <PerformanceHUDWrapper visible={true} updateInterval={30} />
      </Canvas>
    </Box>
  );
}
