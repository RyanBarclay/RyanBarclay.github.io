/**
 * PerformanceHUDWrapper.tsx
 *
 * Bridge component that connects R3F usePerformance hook to DOM-based PerformanceHUD.
 * This component lives inside the Canvas and uses useFrame/useThree hooks,
 * then renders the actual HUD as an HTML overlay via the Html component from drei.
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
 * Uses Html component from drei to render DOM overlay
 */
export default function PerformanceHUDWrapper({
  visible = true,
  updateInterval = 30,
}: PerformanceHUDWrapperProps) {
  const stats = usePerformance({ updateInterval, enabled: visible });

  if (!visible) return null;

  return (
    <Html
      position={[0, 0, 0]}
      style={{
        position: "fixed",
        top: "16px",
        right: "16px",
        pointerEvents: "none",
      }}
    >
      <Paper
        sx={{
          p: 2,
          minWidth: 200,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          backdropFilter: "blur(10px)",
          color: "white",
          fontFamily: "monospace",
        }}
        elevation={4}
      >
        <Typography variant="body2" fontWeight="bold" gutterBottom>
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
