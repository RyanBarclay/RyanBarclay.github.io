/**
 * PerformanceHUDWrapper.tsx
 *
 * Bridge component that connects R3F usePerformance hook to DOM-based PerformanceHUD.
 * Renders the HUD as a properly positioned HTML overlay.
 */

import { Html } from "@react-three/drei";
import { Paper, Typography, Box } from "@mui/material";
import { usePerformance } from "../../hooks/usePerformance";

interface PerformanceHUDWrapperProps {
  visible?: boolean;
  updateInterval?: number;
}

/**
 * Performance HUD that lives inside R3F Canvas
 * Uses Html component with transform={false} to prevent 3D positioning
 */
export default function PerformanceHUDWrapper({
  visible = true,
  updateInterval = 30,
}: PerformanceHUDWrapperProps) {
  const stats = usePerformance({ updateInterval, enabled: visible });

  if (!visible) return null;

  return (
    <Html
      transform={false}
      distanceFactor={0}
      occlude={false}
      zIndexRange={[900, 0]}
      style={{
        position: "fixed",
        top: "16px",
        right: "16px",
        pointerEvents: "none",
      }}
    >
      <Paper
        sx={{
          p: { xs: 1, sm: 1.5 },
          minWidth: { xs: 150, sm: 180 },
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          backdropFilter: "blur(10px)",
          color: "white",
          fontFamily: "monospace",
          fontSize: { xs: "0.7rem", sm: "0.75rem" },
        }}
        elevation={4}
      >
        <Typography variant="caption" fontWeight="bold" gutterBottom>
          Performance
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Typography variant="caption">
            FPS: <strong>{stats.fps}</strong>
          </Typography>

          <Typography variant="caption">
            Triangles: <strong>{stats.triangles.toLocaleString()}</strong>
          </Typography>

          <Typography variant="caption">
            Draw Calls: <strong>{stats.drawCalls}</strong>
          </Typography>

          <Typography variant="caption">
            Memory: <strong>{stats.memoryUsage.toFixed(1)} MB</strong>
          </Typography>

          <Typography variant="caption">
            Geometries: <strong>{stats.geometries}</strong>
          </Typography>
        </Box>
      </Paper>
    </Html>
  );
}
