import React from "react";
import { Box, Typography, Paper, Button, Container, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { GitHub, LinkedIn } from "@mui/icons-material";
import Hero from "../components/ui/Hero";

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <Hero />
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Grid container spacing={3}>
          <Grid>
            <Paper sx={{ p: 3, height: "100%" }}>
              <Typography variant="h5" gutterBottom>
                Latest Project
              </Typography>
              <Typography paragraph>
                Check out my N-Body Simulation - an interactive physics
                simulation that models gravitational interactions between
                multiple bodies in space. Built with React and TypeScript.
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate("/projects/NBodySimulation")}
              >
                View Project
              </Button>
            </Paper>
          </Grid>

          <Grid>
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
      </Container>
    </>
  );
};

export default Home;
