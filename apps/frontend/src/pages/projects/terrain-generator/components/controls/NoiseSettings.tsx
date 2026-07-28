/**
 * NoiseSettings Component - Advanced noise parameter controls
 *
 * Provides sliders for controlling fractal noise generation:
 * - Octaves: Number of noise layers (1-8)
 * - Persistence: Amplitude decrease per octave (0.1-1.0)
 * - Lacunarity: Frequency multiplier per octave (1.5-4.0)
 * - Frequency: Base noise scale (0.5-5.0)
 *
 * Part of Phase D - Group 1B: Advanced Terrain Controls
 */

import { Box, Typography, Slider } from "@mui/material";
import { useTerrainContext } from "../../context/TerrainContext";

export default function NoiseSettings() {
  const { pendingConfig, updatePendingConfig } = useTerrainContext();

  return (
    <Box>
      {/* Octaves Slider */}
      <Typography variant="body2" gutterBottom>
        Octaves: {pendingConfig.octaves}
      </Typography>
      <Slider
        value={pendingConfig.octaves}
        onChange={(_, value) =>
          updatePendingConfig({ octaves: value as number })
        }
        min={1}
        max={8}
        step={null}
        marks={[
          { value: 1, label: "1" },
          { value: 2, label: "2" },
          { value: 4, label: "4" },
          { value: 6, label: "6" },
          { value: 8, label: "8" },
        ]}
        valueLabelDisplay="auto"
      />

      {/* Persistence Slider */}
      <Typography variant="body2" gutterBottom sx={{ mt: 2 }}>
        Persistence: {pendingConfig.persistence.toFixed(2)}
      </Typography>
      <Slider
        value={pendingConfig.persistence}
        onChange={(_, value) =>
          updatePendingConfig({ persistence: value as number })
        }
        min={0.1}
        max={1.0}
        step={null}
        marks={[
          { value: 0.1, label: "0.1" },
          { value: 0.3, label: "0.3" },
          { value: 0.5, label: "0.5" },
          { value: 0.7, label: "0.7" },
          { value: 1.0, label: "1.0" },
        ]}
        valueLabelDisplay="auto"
      />

      {/* Lacunarity Slider */}
      <Typography variant="body2" gutterBottom sx={{ mt: 2 }}>
        Lacunarity: {pendingConfig.lacunarity.toFixed(2)}
      </Typography>
      <Slider
        value={pendingConfig.lacunarity}
        onChange={(_, value) =>
          updatePendingConfig({ lacunarity: value as number })
        }
        min={1.5}
        max={4.0}
        step={null}
        marks={[
          { value: 1.5, label: "1.5" },
          { value: 2.0, label: "2.0" },
          { value: 2.5, label: "2.5" },
          { value: 3.0, label: "3.0" },
          { value: 4.0, label: "4.0" },
        ]}
        valueLabelDisplay="auto"
      />

      {/* Frequency Slider */}
      <Typography variant="body2" gutterBottom sx={{ mt: 2 }}>
        Frequency: {pendingConfig.frequency.toFixed(2)}
      </Typography>
      <Slider
        value={pendingConfig.frequency}
        onChange={(_, value) =>
          updatePendingConfig({ frequency: value as number })
        }
        min={0.5}
        max={5.0}
        step={null}
        marks={[
          { value: 0.5, label: "0.5" },
          { value: 1.0, label: "1.0" },
          { value: 2.0, label: "2.0" },
          { value: 3.0, label: "3.0" },
          { value: 5.0, label: "5.0" },
        ]}
        valueLabelDisplay="auto"
      />
    </Box>
  );
}
