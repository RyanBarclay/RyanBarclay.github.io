import React from "react";
import { Box, Typography, Paper, Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { GitHub, LinkedIn } from "@mui/icons-material";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ width: "100%", padding: 2 }}>
      <Grid spacing={3}>
        <Grid size={12}>
          <Paper
            sx={{
              p: 4,
              textAlign: "center",
              backgroundImage:
                "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(/assets/images/logo_transparent.png)",
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              minHeight: "300px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography variant="h2" component="h1" gutterBottom>
              Ryan Barclay
            </Typography>
            <Typography variant="h5" gutterBottom color="text.secondary">
              Software Developer | Problem Solver | Tech Enthusiast
            </Typography>
            <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/projects")}
              >
                View Projects
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate("/about")}
              >
                About Me
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h5" gutterBottom>
              Latest Project
            </Typography>
            <Typography paragraph>
              Check out my N-Body Simulation - an interactive physics simulation
              that models gravitational interactions between multiple bodies in
              space. Built with React and TypeScript.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/projects/NBodySimulation")}
            >
              View Project
            </Button>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h5" gutterBottom>
              Connect With Me
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button
                variant="outlined"
                startIcon={<GitHub />}
                href="http://www.github.com/ryanbarclay"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </Button>
              <Button
                variant="outlined"
                startIcon={<LinkedIn />}
                href="https://www.linkedin.com/in/ryan-barclay"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
