import {
  Box,
  Fab,
  Typography,
  Slider,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
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

// Initial simulation bounds
const DEFAULT_SIMULATION_BOUNDS: SimulationBoundsType = {
  POSITION: {
    MIN: -75,
    MAX: 75,
  },
  VELOCITY: {
    MIN: -0.001,
    MAX: 0.001,
  },
  MASS: {
    TINY: 0.00001,
    SMALL: 10,
    MEDIUM: 100,
    LARGE: 1000,
    CENTRAL: 1000000,
  },
  RADIUS: {
    MIN: 0.5,
    MAX: 2,
    CENTRAL: 3,
  },
  PARTICLE_COUNT: 500,
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
    updates: Record<string, number>
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
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography>Simulation Parameters</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid item xs={12}>
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
          <Grid item xs={12}>
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
          <Grid item xs={12}>
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
          <Grid item xs={12}>
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
          <Grid item xs={12}>
            <Typography>Particle Mass Ranges</Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
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
              <Grid item xs={6}>
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
          <Grid item xs={12}>
            <Typography>Particle Radius</Typography>
            <Grid container spacing={1}>
              <Grid item xs={12}>
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
              <Grid item xs={12}>
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
          <Grid item xs={12}>
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
  );
};

const NBodySimulation = () => {
  const [simulationBounds, setSimulationBounds] =
    useState<SimulationBoundsType>(DEFAULT_SIMULATION_BOUNDS);
  const [paused, setPaused] = useState(true);
  const [particles, setParticles] = useState(() =>
    generateRandomParticles(simulationBounds)
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
          e.target?.result as string
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
          "Error parsing the uploaded file. Please make sure it has the correct JSON format for N-Body particles."
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
        alignItems: "center",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h4">N Body Simulation</Typography>
      <AnimationViewPort
        key={resetKey}
        isPaused={paused}
        theta={theta}
        particlesFromFile={particles}
        updateSimulationParticles={updateSimulationParticles}
      />

      <Box sx={{ display: "flex", gap: 2 }}>
        <Fab onClick={() => setPaused(false)}>
          <PlayArrow />
        </Fab>
        <Fab onClick={() => setPaused(true)}>
          <Pause />
        </Fab>
        <Fab
          color="secondary"
          onClick={regenerateParticles}
          title="Restart with current parameters"
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
        >
          <Shuffle />
        </Fab>
      </Box>

      <Box>
        {usingUploadedParticles
          ? "Using uploaded particles configuration"
          : `Using ${simulationBounds.PARTICLE_COUNT} randomly generated particles`}
      </Box>

      <Box sx={{ display: "flex", gap: 2 }}>
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
        >
          <Upload /> Upload
        </Fab>
        <Fab
          onClick={downloadSimulationParticles}
          color="primary"
          variant="extended"
        >
          <Download /> Download
        </Fab>
      </Box>
      <SimulationControls
        bounds={simulationBounds}
        setBounds={setSimulationBounds}
        onUpdate={regenerateParticles}
      />
    </Box>
  );
};

export default NBodySimulation;
