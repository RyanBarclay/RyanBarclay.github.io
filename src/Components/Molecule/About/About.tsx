import React from "react";
import { Box, Typography, Paper, Grid, Avatar } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const About = () => {
  const theme = useTheme();

  return (
    <Box sx={{ width: "100%", padding: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h4" gutterBottom>
              About Me
            </Typography>
            <Typography paragraph>
              Hi, I'm Ryan Barclay! I'm a software developer passionate about
              creating efficient, scalable solutions and exploring new
              technologies. My experience spans from artificial intelligence and
              machine learning to full-stack web development and system
              administration.
            </Typography>
            <Typography paragraph>
              I thrive on challenges and enjoy participating in hackathons and
              coding competitions, where I've achieved notable successes like
              winning 2nd place in UVic's Spookathon. My approach combines
              technical expertise with creative problem-solving, whether I'm
              building AI-powered applications or configuring server
              infrastructure.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Skills & Technologies
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>
                  Languages
                </Typography>
                <Typography>
                  • Python • JavaScript/TypeScript • HTML/CSS • Shell Scripting
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>
                  Frameworks & Libraries
                </Typography>
                <Typography>• React • Material-UI • Node.js • NumPy</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>
                  Tools & Platforms
                </Typography>
                <Typography>
                  • Git • Linux/Unix • Docker • AWS/Heroku
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default About;
