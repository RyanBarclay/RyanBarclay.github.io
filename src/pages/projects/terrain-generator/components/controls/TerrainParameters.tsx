/**
 * TerrainParameters.tsx
 *
 * Phase D - Group 1A: Core terrain parameter controls
 * Phase F - Group 1B: Added local state for instant slider feedback
 *
 * Provides controls for:
 * - Size (16-512, step 16)
 * - Height Scale (1-100)
 * - Seed input with random generator
 *
 * Performance Optimization:
 * - Local state provides instant visual feedback on slider changes
 * - Context updates immediately (terrain regeneration triggered by Generate button)
 * - No debouncing needed - sliders update local state only
 *
 * Follows MUI v7 patterns from existing ControlPanel.
 */

import React, { useState, useEffect } from "react";
import { Box, Typography, Slider, TextField, Button } from "@mui/material";
import CasinoIcon from "@mui/icons-material/Casino";
import { useTerrainContext } from "../../context/TerrainContext";

/**
 * TerrainParameters Component
 *
 * Section for core terrain parameters with live updates to context.
 * Uses local state to ensure sliders respond instantly to user input
 * without lag from context updates.
 *
 * @returns MUI component section for terrain parameters
 */
export default function TerrainParameters() {
  const { config, updateConfig } = useTerrainContext();

  // Local state for immediate slider feedback
  const [localSize, setLocalSize] = useState(config.size);
  const [localHeight, setLocalHeight] = useState(config.heightScale);

  // Sync local state when config changes externally (preset selection, reset, etc.)
  useEffect(() => {
    setLocalSize(config.size);
    setLocalHeight(config.heightScale);
  }, [config.size, config.heightScale]);

  /**
   * Handle size slider changes with immediate visual feedback
   * Updates both local state (instant) and context (for Generate button)
   */
  const handleSizeChange = (_: Event, value: number | number[]) => {
    const newSize = value as number;
    setLocalSize(newSize);
    updateConfig({ size: newSize });
  };

  /**
   * Handle height scale slider changes with immediate visual feedback
   * Updates both local state (instant) and context (for Generate button)
   */
  const handleHeightChange = (_: Event, value: number | number[]) => {
    const newHeight = value as number;
    setLocalHeight(newHeight);
    updateConfig({ heightScale: newHeight });
  };

  /**
   * Generate random alphanumeric seed (8 characters)
   */
  const generateRandomSeed = () => {
    const seed = Math.random().toString(36).substring(2, 10);
    updateConfig({ seed });
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Terrain Parameters
      </Typography>

      {/* Size Slider */}
      <Typography variant="body2" gutterBottom>
        Size: {localSize}x{localSize}
      </Typography>
      <Slider
        value={localSize}
        onChange={handleSizeChange}
        min={16}
        max={512}
        step={null} // Allow free movement but snap to marks
        marks={[
          { value: 16, label: "16" },
          { value: 64, label: "64" },
          { value: 128, label: "128" },
          { value: 256, label: "256" },
          { value: 512, label: "512" },
        ]}
        valueLabelDisplay="auto"
      />

      {/* Height Scale Slider */}
      <Typography variant="body2" gutterBottom sx={{ mt: 2 }}>
        Height Scale: {localHeight}
      </Typography>
      <Slider
        value={localHeight}
        onChange={handleHeightChange}
        min={1}
        max={100}
        step={null}
        marks={[
          { value: 10, label: "10" },
          { value: 25, label: "25" },
          { value: 50, label: "50" },
          { value: 75, label: "75" },
          { value: 100, label: "100" },
        ]}
        valueLabelDisplay="auto"
      />

      {/* Seed Input */}
      <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
        <TextField
          label="Seed"
          value={config.seed}
          onChange={(e) => updateConfig({ seed: e.target.value })}
          size="small"
          fullWidth
        />
        <Button
          variant="outlined"
          onClick={generateRandomSeed}
          startIcon={<CasinoIcon />}
        >
          Random
        </Button>
      </Box>
    </Box>
  );
}
