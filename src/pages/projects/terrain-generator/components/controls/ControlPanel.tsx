/**
 * ControlPanel.tsx
 *
 * Material-UI control panel for terrain generation parameters.
 *
 * Features:
 * - Modular control sections (TerrainParameters, NoiseSettings, PresetSelector, AnimationControls)
 * - Wireframe toggle
 * - Generate button
 *
 * Follows Material-UI v7 patterns from portfolio project.
 * References: src/pages/projects/randomizer/Randomizer.tsx
 */

import React from "react";
import {
  Box,
  Typography,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTerrainContext } from "../../context/TerrainContext";
import { useTerrainGen } from "../../hooks/useTerrainGen";
import TerrainParameters from "./TerrainParameters";
import NoiseSettings from "./NoiseSettings";
import PresetSelector from "./PresetSelector";
import AnimationControls from "./AnimationControls";
import ExportPanel from "../ui/ExportPanel";

/**
 * ControlPanel component
 *
 * Provides UI controls for terrain generation parameters using modular sub-components.
 * Integrates with TerrainContext for state management.
 *
 * @returns MUI control panel with terrain parameters
 */
export default function ControlPanel() {
  const { config, updateConfig } = useTerrainContext();
  const { generate, isGenerating } = useTerrainGen();

  return (
    <Paper
      sx={{
        width: 320,
        height: "100%",
        p: 3,
        overflowY: "auto",
        borderRight: 1,
        borderColor: "divider",
      }}
      elevation={0}
    >
      <Typography variant="h5" gutterBottom>
        Terrain Controls
      </Typography>

      <Divider sx={{ my: 2 }} />

      {/* Modular Control Sections - Collapsible */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Terrain Parameters</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TerrainParameters />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Noise Settings</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <NoiseSettings />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Presets</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <PresetSelector />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Animation</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <AnimationControls />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Export</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ExportPanel />
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ my: 2 }} />

      {/* Wireframe Toggle - Always Visible */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Visualization
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={config.wireframe}
              onChange={(e) => updateConfig({ wireframe: e.target.checked })}
            />
          }
          label="Wireframe Mode"
        />
      </Box>

      {/* Generate Button - Always Visible */}
      <Button
        variant="contained"
        fullWidth
        size="large"
        onClick={generate}
        disabled={isGenerating}
      >
        {isGenerating ? "Generating..." : "Generate Terrain"}
      </Button>
    </Paper>
  );
}
