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
 * Mobile: Drawer with toggle button (unless hideToggleButton is true)
 */
interface ControlPanelProps {
  hideToggleButton?: boolean;
  onClose?: () => void;
}

export default function ControlPanel({
  hideToggleButton = false,
  onClose,
}: ControlPanelProps = {}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { config, pendingConfig, updateConfig, applyPendingConfig, showStats, setShowStats } = useTerrainContext();
  const { generate, isGenerating } = useTerrainGen();

  const handleGenerate = () => {
    applyPendingConfig(); // Sync context state for other consumers
    generate(pendingConfig); // Pass pendingConfig directly to avoid stale closure
    if (isMobile) {
      setDrawerOpen(false);
      onClose?.(); // Call parent onClose if provided
    }
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
          <IconButton
            onClick={() => {
              setDrawerOpen(false);
              onClose?.(); // Call parent onClose handler
            }}
            size="small"
          >
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

        {/* Wireframe + Stats Toggles */}
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
          <FormControlLabel
            control={
              <Switch
                checked={showStats}
                onChange={(e) => setShowStats(e.target.checked)}
              />
            }
            label="Show Performance Stats"
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
        {/* Floating toggle button - only show if not in modal */}
        {!hideToggleButton && (
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
        )}

        {/* Drawer - only render if not using hideToggleButton (modal controls itself) */}
        {!hideToggleButton && (
          <Drawer
            anchor="bottom"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            PaperProps={{
              sx: {
                width: "100%",
                height: "90vh",
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
              },
            }}
          >
            {controlsContent}
          </Drawer>
        )}

        {/* When hideToggleButton is true, just render the controls content directly */}
        {hideToggleButton && controlsContent}
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
