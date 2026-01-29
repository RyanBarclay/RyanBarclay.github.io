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
  const { config, updateConfig } = useTerrainContext();

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Noise Settings
      </Typography>

      {/* Octaves Slider */}
      <Typography variant="body2" gutterBottom>
        Octaves: {config.octaves}
      </Typography>
      <Slider
        value={config.octaves}
        onChange={(_, value) => updateConfig({ octaves: value as number })}
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
        Persistence: {config.persistence.toFixed(2)}
      </Typography>
      <Slider
        value={config.persistence}
        onChange={(_, value) => updateConfig({ persistence: value as number })}
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
        Lacunarity: {config.lacunarity.toFixed(2)}
      </Typography>
      <Slider
        value={config.lacunarity}
        onChange={(_, value) => updateConfig({ lacunarity: value as number })}
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
        Frequency: {config.frequency.toFixed(2)}
      </Typography>
      <Slider
        value={config.frequency}
        onChange={(_, value) => updateConfig({ frequency: value as number })}
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
