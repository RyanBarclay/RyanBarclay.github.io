/**
 * ControlPanel.tsx
 *
 * Material-UI control panel for terrain generation parameters.
 *
 * Features:
 * - Modular control sections (TerrainParameters, NoiseSettings, PresetSelector, AnimationControls)
 * - Wireframe toggle
 * - Generate button (sticky at bottom)
 * - Responsive: drawer on mobile, sidebar on desktop
 *
 * Follows Material-UI v7 patterns from portfolio project.
 */

import React, { useState } from "react";
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
  IconButton,
  Drawer,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useTerrainContext } from "../../context/TerrainContext";
import { useTerrainGen } from "../../hooks/useTerrainGen";
import TerrainParameters from "./TerrainParameters";
import NoiseSettings from "./NoiseSettings";
import PresetSelector from "./PresetSelector";
import AnimationControls from "./AnimationControls";
import WaterControls from "./WaterControls";
import ExportPanel from "../ui/ExportPanel";

/**
 * ControlPanel component - Responsive controls for terrain generation
 *
 * Desktop: Fixed sidebar
 * Mobile: Drawer with toggle button
 */
export default function ControlPanel() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { config, updateConfig, applyPendingConfig } = useTerrainContext();
  const { generate, isGenerating } = useTerrainGen();

  const handleGenerate = () => {
    applyPendingConfig(); // Apply pending changes first
    generate(); // Then trigger generation
    if (isMobile) setDrawerOpen(false);
  };

  const controlsContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Header with close button (mobile only) */}
      {isMobile && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Typography variant="h6">Terrain Controls</Typography>
          <IconButton onClick={() => setDrawerOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      )}

      {/* Scrollable content */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
        }}
      >
        {!isMobile && (
          <>
            <Typography variant="h6" gutterBottom>
              Terrain Controls
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </>
        )}

        {/* Collapsible Control Sections */}
        <Accordion defaultExpanded disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Terrain Parameters</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0 }}>
            <TerrainParameters />
          </AccordionDetails>
        </Accordion>

        <Accordion disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Noise Settings</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0 }}>
            <NoiseSettings />
          </AccordionDetails>
        </Accordion>

        <Accordion disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Presets</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0 }}>
            <PresetSelector />
          </AccordionDetails>
        </Accordion>

        <Accordion disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Animation</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0 }}>
            <AnimationControls />
          </AccordionDetails>
        </Accordion>

        <Accordion disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Water</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0 }}>
            <WaterControls />
          </AccordionDetails>
        </Accordion>

        <Accordion disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Export</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0 }}>
            <ExportPanel />
          </AccordionDetails>
        </Accordion>

        {/* Wireframe Toggle */}
        <Box sx={{ mt: 2 }}>
          <Divider sx={{ mb: 2 }} />
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
      </Box>

      {/* Sticky Generate Button */}
      <Box
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: "divider",
          backgroundColor: "background.paper",
        }}
      >
        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? "Generating..." : "Generate Terrain"}
        </Button>
      </Box>
    </Box>
  );

  // Mobile: Drawer with toggle button
  if (isMobile) {
    return (
      <>
        {/* Floating toggle button */}
        <IconButton
          onClick={() => setDrawerOpen(true)}
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            zIndex: 1000,
            backgroundColor: "background.paper",
            boxShadow: 2,
            "&:hover": {
              backgroundColor: "action.hover",
            },
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Drawer */}
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          PaperProps={{
            sx: {
              width: "85vw",
              maxWidth: 400,
            },
          }}
        >
          {controlsContent}
        </Drawer>
      </>
    );
  }

  // Desktop: Fixed sidebar
  return (
    <Paper
      sx={{
        width: 320,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRight: 1,
        borderColor: "divider",
      }}
      elevation={0}
    >
      {controlsContent}
    </Paper>
  );
}
