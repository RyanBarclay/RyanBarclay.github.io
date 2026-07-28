/**
 * WaterControls.tsx
 *
 * Controls for water visualization settings.
 *
 * Features:
 * - Enable/disable water
 * - Adjust water level (height)
 * - Adjust water opacity (transparency)
 */

import {
  Box,
  Typography,
  Slider,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useTerrainContext } from "../../context/TerrainContext";

export default function WaterControls() {
  const { pendingConfig, updatePendingConfig } = useTerrainContext();

  const handleToggleWater = (enabled: boolean) => {
    updatePendingConfig({
      water: {
        enabled,
        level: pendingConfig.water?.level ?? 50,
        opacity: pendingConfig.water?.opacity ?? 0.6,
      },
    });
  };

  const handleLevelChange = (_: Event, value: number | number[]) => {
    updatePendingConfig({
      water: {
        enabled: pendingConfig.water?.enabled ?? false,
        level: value as number,
        opacity: pendingConfig.water?.opacity ?? 0.6,
      },
    });
  };

  const handleOpacityChange = (_: Event, value: number | number[]) => {
    updatePendingConfig({
      water: {
        enabled: pendingConfig.water?.enabled ?? false,
        level: pendingConfig.water?.level ?? 50,
        opacity: value as number,
      },
    });
  };

  return (
    <Box>
      {/* Water Toggle */}
      <FormControlLabel
        control={
          <Switch
            checked={pendingConfig.water?.enabled || false}
            onChange={(e) => handleToggleWater(e.target.checked)}
          />
        }
        label="Enable Water"
      />

      {/* Water Level Slider */}
      <Typography variant="body2" gutterBottom sx={{ mt: 2 }}>
        Water Level: {pendingConfig.water?.level || 0}
      </Typography>
      <Slider
        value={pendingConfig.water?.level || 0}
        onChange={handleLevelChange}
        min={0}
        max={50}
        step={1}
        disabled={!pendingConfig.water?.enabled}
        valueLabelDisplay="auto"
        marks={[
          { value: 0, label: "0" },
          { value: 10, label: "10" },
          { value: 25, label: "25" },
          { value: 50, label: "50" },
        ]}
      />

      {/* Water Opacity Slider */}
      <Typography variant="body2" gutterBottom sx={{ mt: 2 }}>
        Water Opacity:{" "}
        {((pendingConfig.water?.opacity || 0.6) * 100).toFixed(0)}%
      </Typography>
      <Slider
        value={pendingConfig.water?.opacity || 0.6}
        onChange={handleOpacityChange}
        min={0.3}
        max={0.9}
        step={0.05}
        disabled={!pendingConfig.water?.enabled}
        valueLabelDisplay="auto"
        marks={[
          { value: 0.3, label: "30%" },
          { value: 0.5, label: "50%" },
          { value: 0.7, label: "70%" },
          { value: 0.9, label: "90%" },
        ]}
      />
    </Box>
  );
}
