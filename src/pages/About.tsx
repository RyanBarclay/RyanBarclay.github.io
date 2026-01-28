import React from "react";
import { Box, Typography, Paper, Grid, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { GitHub, LinkedIn, Email, Description } from "@mui/icons-material";
import PageHero from "../components/ui/PageHero";

const About = () => {
  const theme = useTheme();

  return (
    <>
      <PageHero
        title="About Me"
        subtitle="Full-stack developer passionate about technology"
      />
      <Box sx={{ width: "100%", padding: 2 }}>
        <Grid spacing={3}>
          <Grid size={12}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h4" gutterBottom>
                About Me
              </Typography>
              <Typography paragraph>
                Hi, I'm Ryan Barclay! I'm a software developer passionate about
                creating efficient, scalable solutions and exploring new
                technologies. My experience spans from artificial intelligence
                and machine learning to full-stack web development and system
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

          <Grid size={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Skills & Technologies
              </Typography>
              <Grid spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    Languages
                  </Typography>
                  <Typography>
                    • Python • JavaScript/TypeScript • HTML/CSS • Shell
                    Scripting
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    Frameworks & Libraries
                  </Typography>
                  <Typography>
                    • React • Material-UI • Node.js • NumPy
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
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

          <Grid size={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Get In Touch
              </Typography>
              <Grid spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Button
                    variant="outlined"
                    startIcon={<GitHub />}
                    href="http://www.github.com/ryanbarclay"
                    target="_blank"
                    rel="noopener noreferrer"
                    fullWidth
                    sx={{ justifyContent: "flex-start", p: 2 }}
                  >
                    <Box sx={{ textAlign: "left", ml: 1 }}>
                      <Typography variant="subtitle1">GitHub</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Check out my code repositories
                      </Typography>
                    </Box>
                  </Button>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Button
                    variant="outlined"
                    startIcon={<LinkedIn />}
                    href="https://www.linkedin.com/in/ryan-barclay"
                    target="_blank"
                    rel="noopener noreferrer"
                    fullWidth
                    sx={{ justifyContent: "flex-start", p: 2 }}
                  >
                    <Box sx={{ textAlign: "left", ml: 1 }}>
                      <Typography variant="subtitle1">LinkedIn</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Connect with me professionally
                      </Typography>
                    </Box>
                  </Button>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Email />}
                    href="mailto:work@ryanbarclay.ca"
                    fullWidth
                    sx={{ justifyContent: "flex-start", p: 2 }}
                  >
                    <Box sx={{ textAlign: "left", ml: 1 }}>
                      <Typography variant="subtitle1">Email</Typography>
                      <Typography variant="caption" color="text.secondary">
                        work@ryanbarclay.ca
                      </Typography>
                    </Box>
                  </Button>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Description />}
                    href="/resume"
                    fullWidth
                    sx={{ justifyContent: "flex-start", p: 2 }}
                  >
                    <Box sx={{ textAlign: "left", ml: 1 }}>
                      <Typography variant="subtitle1">Resume</Typography>
                      <Typography variant="caption" color="text.secondary">
                        View my professional experience
                      </Typography>
                    </Box>
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default About;
