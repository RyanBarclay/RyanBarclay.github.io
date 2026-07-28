import {
  Box,
  Fab,
  Typography,
  Slider,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
} from "@mui/material";
import {
  Download,
  Pause,
  PlayArrow,
  Upload,
  Refresh,
  Shuffle,
  ExpandMore,
} from "@mui/icons-material";
import { useRef, useState, useEffect } from "react";
import { Particle } from "./nBodyTypes";
import AnimationViewPort from "./AnimationViewPort";
import { DEFAULT_SIMULATION_BOUNDS } from "../../../config/constants";

// Define the simulation bounds type
type SimulationBoundsType = {
  POSITION: {
    MIN: number;
    MAX: number;
  };
  VELOCITY: {
    MIN: number;
    MAX: number;
  };
  MASS: {
    TINY: number;
    SMALL: number;
    MEDIUM: number;
    LARGE: number;
    CENTRAL: number;
  };
  RADIUS: {
    MIN: number;
    MAX: number;
    CENTRAL: number;
  };
  PARTICLE_COUNT: number;
};

// Generate random HSL color for visual distinction
const getRandomColor = () => {
  const hue = Math.random() * 360;
  return `hsl(${hue}, 70%, 50%)`;
};

const generateRandomParticles = (bounds: SimulationBoundsType): Particle[] => {
  const particles: Particle[] = [];

  // Helper function to get random number in range
  const randomInRange = (min: number, max: number): number => {
    return Math.random() * (max - min) + min;
  };

  // Add a massive central body with a fixed color
  particles.push({
    position: { x: 0, y: 0, z: 0 },
    velocity: { x: 0, y: 0, z: 0 },
    radius: bounds.RADIUS.CENTRAL,
    mass: bounds.MASS.CENTRAL,
    color: "#000000", // Black color for central body
  });

  // Generate the rest of the particles with random colors
  for (let i = 0; i < bounds.PARTICLE_COUNT - 1; i++) {
    const radius = randomInRange(bounds.RADIUS.MIN, bounds.RADIUS.MAX);
    const mass =
      Math.random() < 0.05
        ? randomInRange(bounds.MASS.MEDIUM, bounds.MASS.LARGE)
        : randomInRange(bounds.MASS.TINY, bounds.MASS.SMALL);

    particles.push({
      position: {
        x: randomInRange(bounds.POSITION.MIN, bounds.POSITION.MAX),
        y: randomInRange(bounds.POSITION.MIN, bounds.POSITION.MAX),
        z: randomInRange(bounds.POSITION.MIN, bounds.POSITION.MAX),
      },
      velocity: {
        x: randomInRange(bounds.VELOCITY.MIN, bounds.VELOCITY.MAX),
        y: randomInRange(bounds.VELOCITY.MIN, bounds.VELOCITY.MAX),
        z: randomInRange(bounds.VELOCITY.MIN, bounds.VELOCITY.MAX),
      },
      radius,
      mass,
      color: getRandomColor(),
    });
  }

  return particles;
};

const SimulationControls = ({
  bounds,
  setBounds,
  onUpdate,
}: {
  bounds: SimulationBoundsType;
  setBounds: (bounds: SimulationBoundsType) => void;
  onUpdate: () => void;
}) => {
  const handleChange = (
    section: keyof SimulationBoundsType,
    updates: Record<string, number>,
  ) => {
    setBounds({
      ...bounds,
      [section]: {
        ...(bounds[section] as Record<string, number>),
        ...updates,
      },
    });
  };

  return (
    <Paper>
      <Accordion defaultExpanded elevation={0}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">Simulation Parameters</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid spacing={2}>
            <Grid size={12}>
              <Typography>Particle Count: {bounds.PARTICLE_COUNT}</Typography>
              <Slider
                value={bounds.PARTICLE_COUNT}
                onChange={(_event: Event, value: number | number[]) =>
                  setBounds({ ...bounds, PARTICLE_COUNT: value as number })
                }
                min={10}
                max={2000}
                valueLabelDisplay="auto"
              />
            </Grid>
            <Grid size={12}>
              <Typography>
                Position Range: {bounds.POSITION.MIN} - {bounds.POSITION.MAX}
              </Typography>
              <Slider
                value={[bounds.POSITION.MIN, bounds.POSITION.MAX]}
                onChange={(_event: Event, value: number | number[]) => {
                  const [min, max] = Array.isArray(value)
                    ? value
                    : [value, value];
                  handleChange("POSITION", { MIN: min, MAX: max });
                }}
                min={-200}
                max={200}
                valueLabelDisplay="auto"
              />
            </Grid>
            <Grid size={12}>
              <Typography>
                Velocity Range: {bounds.VELOCITY.MIN.toFixed(4)} -{" "}
                {bounds.VELOCITY.MAX.toFixed(4)}
              </Typography>
              <Slider
                value={[bounds.VELOCITY.MIN, bounds.VELOCITY.MAX]}
                onChange={(_event: Event, value: number | number[]) => {
                  const [min, max] = Array.isArray(value)
                    ? value
                    : [value, value];
                  handleChange("VELOCITY", { MIN: min, MAX: max });
                }}
                min={-0.01}
                max={0.01}
                step={0.0001}
                valueLabelDisplay="auto"
              />
            </Grid>
            <Grid size={12}>
              <Typography>Central Mass: {bounds.MASS.CENTRAL}</Typography>
              <Slider
                value={bounds.MASS.CENTRAL}
                onChange={(_event: Event, value: number | number[]) =>
                  handleChange("MASS", { CENTRAL: value as number })
                }
                min={100000}
                max={10000000}
                step={100000}
                valueLabelDisplay="auto"
              />
            </Grid>
            <Grid size={12}>
              <Typography>Particle Mass Ranges</Typography>
              <Grid spacing={1}>
                <Grid size={6}>
                  <Typography>
                    Tiny to Small: {bounds.MASS.TINY.toExponential(2)} -{" "}
                    {bounds.MASS.SMALL}
                  </Typography>
                  <Slider
                    value={[bounds.MASS.TINY, bounds.MASS.SMALL]}
                    onChange={(_event: Event, value: number | number[]) => {
                      const [tiny, small] = Array.isArray(value)
                        ? value
                        : [value, value];
                      handleChange("MASS", { TINY: tiny, SMALL: small });
                    }}
                    min={0.00001}
                    max={10}
                    step={0.00001}
                    valueLabelDisplay="auto"
                  />
                </Grid>
                <Grid size={6}>
                  <Typography>
                    Medium to Large: {bounds.MASS.MEDIUM} - {bounds.MASS.LARGE}
                  </Typography>
                  <Slider
                    value={[bounds.MASS.MEDIUM, bounds.MASS.LARGE]}
                    onChange={(_event: Event, value: number | number[]) => {
                      const [medium, large] = Array.isArray(value)
                        ? value
                        : [value, value];
                      handleChange("MASS", { MEDIUM: medium, LARGE: large });
                    }}
                    min={10}
                    max={2000}
                    valueLabelDisplay="auto"
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid size={12}>
              <Typography>Particle Radius</Typography>
              <Grid spacing={1}>
                <Grid size={12}>
                  <Typography>
                    Min/Max Radius: {bounds.RADIUS.MIN} - {bounds.RADIUS.MAX}
                  </Typography>
                  <Slider
                    value={[bounds.RADIUS.MIN, bounds.RADIUS.MAX]}
                    onChange={(_event: Event, value: number | number[]) => {
                      const [min, max] = Array.isArray(value)
                        ? value
                        : [value, value];
                      handleChange("RADIUS", { MIN: min, MAX: max });
                    }}
                    min={0.1}
                    max={5}
                    step={0.1}
                    valueLabelDisplay="auto"
                  />
                </Grid>
                <Grid size={12}>
                  <Typography>
                    Central Body Radius: {bounds.RADIUS.CENTRAL}
                  </Typography>
                  <Slider
                    value={bounds.RADIUS.CENTRAL}
                    onChange={(_event: Event, value: number | number[]) =>
                      handleChange("RADIUS", { CENTRAL: value as number })
                    }
                    min={1}
                    max={10}
                    step={0.1}
                    valueLabelDisplay="auto"
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid size={12}>
              <Fab
                color="primary"
                onClick={onUpdate}
                variant="extended"
                size="small"
                sx={{ mt: 2 }}
              >
                Apply Parameters
              </Fab>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};

const NBodySimulation = () => {
  const [simulationBounds, setSimulationBounds] =
    useState<SimulationBoundsType>(DEFAULT_SIMULATION_BOUNDS);
  const [paused, setPaused] = useState(true);
  const [particles, setParticles] = useState(() =>
    generateRandomParticles(simulationBounds),
  );
  const [simulationParticles, setSimulationParticles] = useState(particles);
  const [theta, setTheta] = useState(0.1);
  const [usingUploadedParticles, setUsingUploadedParticles] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateSimulationParticles = (newParticles?: Particle[]) => {
    if (newParticles) setSimulationParticles(newParticles);
  };

  const regenerateParticles = () => {
    const newParticles = generateRandomParticles(simulationBounds);
    setParticles(newParticles);
    setSimulationParticles(newParticles);
    setResetKey((prev) => prev + 1);
    setPaused(true);
  };

  const downloadSimulationParticles = () => {
    // Download the current simulationParticles as a json file
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(simulationParticles, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", "particles.json");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Read the uploaded JSON file
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const uploadedParticles = JSON.parse(
          e.target?.result as string,
        ) as Particle[];

        // Validate the uploaded data has the correct structure
        if (!Array.isArray(uploadedParticles)) {
          throw new Error("Uploaded file must contain an array of particles");
        }

        // Check if each particle has the required properties
        const isValidParticle = (p: any): p is Particle => {
          return (
            p &&
            typeof p === "object" &&
            p.position &&
            typeof p.position === "object" &&
            typeof p.position.x === "number" &&
            typeof p.position.y === "number" &&
            typeof p.position.z === "number" &&
            p.velocity &&
            typeof p.velocity === "object" &&
            typeof p.velocity.x === "number" &&
            typeof p.velocity.y === "number" &&
            typeof p.velocity.z === "number" &&
            typeof p.radius === "number" &&
            typeof p.mass === "number"
          );
        };

        if (!uploadedParticles.every(isValidParticle)) {
          throw new Error("Some particles in the file have an invalid format");
        }

        // Store the original uploaded particles
        setParticles(uploadedParticles);
        setSimulationParticles(uploadedParticles);
        // Mark that we're using uploaded particles
        setUsingUploadedParticles(true);

        // Reset the file input so the same file can be uploaded again if needed
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        // Pause the simulation when new particles are loaded
        setPaused(true);
      } catch (error) {
        console.error("Error parsing uploaded file:", error);
        alert(
          "Error parsing the uploaded file. Please make sure it has the correct JSON format for N-Body particles.",
        );
      }
    };
    reader.readAsText(file);
  };

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h4" sx={{ textAlign: "center" }}>
        N Body Simulation
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          gap: 2,
          width: "100%",
        }}
      >
        {/* Viewport - Takes up more space */}
        <Box sx={{ flex: { xs: "1", lg: "2" }, minWidth: 0 }}>
          <AnimationViewPort
            key={resetKey}
            isPaused={paused}
            theta={theta}
            particlesFromFile={particles}
            updateSimulationParticles={updateSimulationParticles}
          />
        </Box>

        {/* Controls Panel - Sidebar */}
        <Box
          sx={{
            flex: { xs: "1", lg: "1" },
            display: "flex",
            flexDirection: "column",
            gap: 2,
            minWidth: { xs: "100%", lg: "300px" },
            maxWidth: { xs: "100%", lg: "450px" },
          }}
        >
          {/* Playback Controls */}
          <Paper sx={{ p: 2 }}>
            <Typography
              variant="subtitle2"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              Playback
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <Fab
                onClick={() => setPaused(false)}
                size="small"
                color="primary"
              >
                <PlayArrow />
              </Fab>
              <Fab onClick={() => setPaused(true)} size="small" color="primary">
                <Pause />
              </Fab>
              <Fab
                color="secondary"
                onClick={regenerateParticles}
                title="Restart with current parameters"
                size="small"
              >
                <Refresh />
              </Fab>
              <Fab
                color="secondary"
                onClick={() => {
                  setUsingUploadedParticles(false);
                  regenerateParticles();
                }}
                title="Generate new random particles"
                size="small"
              >
                <Shuffle />
              </Fab>
            </Box>
          </Paper>

          {/* Status */}
          <Paper sx={{ p: 2 }}>
            <Typography
              variant="subtitle2"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              Status
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {usingUploadedParticles
                ? "Using uploaded particles configuration"
                : `Using ${simulationBounds.PARTICLE_COUNT} randomly generated particles`}
            </Typography>
          </Paper>

          {/* File Controls */}
          <Paper sx={{ p: 2 }}>
            <Typography
              variant="subtitle2"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              Save/Load
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <input
                type="file"
                accept=".json"
                ref={fileInputRef}
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />
              <Fab
                color="primary"
                variant="extended"
                onClick={() => fileInputRef.current?.click()}
                size="small"
              >
                <Upload sx={{ mr: 1 }} /> Upload
              </Fab>
              <Fab
                onClick={downloadSimulationParticles}
                color="primary"
                variant="extended"
                size="small"
              >
                <Download sx={{ mr: 1 }} /> Download
              </Fab>
            </Box>
          </Paper>

          {/* Simulation Parameters */}
          <SimulationControls
            bounds={simulationBounds}
            setBounds={setSimulationBounds}
            onUpdate={regenerateParticles}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default NBodySimulation;
