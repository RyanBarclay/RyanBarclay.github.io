/**
 * PresetSelector Component - Terrain type preset buttons
 *
 * Provides quick access to predefined terrain configurations:
 * - Mountains: High peaks with sharp features
 * - Islands: Circular landmass with radial falloff
 * - Canyons: Sharp ridges and deep valleys
 * - Valleys: Rolling hills with gentle slopes
 *
 * Features:
 * - 2x2 grid layout with emoji icons
 * - Visual feedback for active preset
 * - One-click terrain reconfiguration
 */

import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useTerrainContext } from "../../context/TerrainContext";
import { getPresetConfig } from "../../utils/noise/presets";
import type { TerrainPreset } from "../../types";

/**
 * Available preset configurations with display metadata
 */
const PRESETS = [
  { id: "mountains", label: "Mountains", icon: "⛰️" },
  { id: "islands", label: "Islands", icon: "🏝️" },
  { id: "canyons", label: "Canyons", icon: "🏜️" },
  { id: "valleys", label: "Valleys", icon: "🏞️" },
] as const;

/**
 * PresetSelector Component
 *
 * Renders a 2x2 grid of preset buttons that apply predefined
 * terrain configurations from Phase A presets.
 */
export default function PresetSelector() {
  const { pendingConfig, updatePendingConfig } = useTerrainContext();

  /**
   * Apply a preset configuration to the terrain
   *
   * Loads preset values from presets.ts and updates all
   * relevant noise parameters in the pending config.
   *
   * @param presetId - The preset type to apply
   */
  const applyPreset = (presetId: string) => {
    const presetConfig = getPresetConfig(presetId as TerrainPreset);
    if (presetConfig) {
      updatePendingConfig({
        preset: presetId as TerrainPreset,
        octaves: presetConfig.octaves,
        persistence: presetConfig.persistence,
        lacunarity: presetConfig.lacunarity,
        frequency: presetConfig.frequency,
        heightScale: presetConfig.heightScale,
      });
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 1,
        }}
      >
        {PRESETS.map((preset) => (
          <Button
            key={preset.id}
            variant={
              pendingConfig.preset === preset.id ? "contained" : "outlined"
            }
            onClick={() => applyPreset(preset.id)}
            startIcon={<span>{preset.icon}</span>}
            fullWidth
          >
            {preset.label}
          </Button>
        ))}
      </Box>
    </Box>
  );
}
