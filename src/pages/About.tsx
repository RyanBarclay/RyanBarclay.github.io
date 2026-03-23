import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Container,
  Card,
  CardContent,
  IconButton,
  Avatar,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  GitHub,
  LinkedIn,
  Email,
  Palette,
  Storage,
  Cloud,
  Lightbulb,
  Groups,
  AutoStories,
  EnergySavingsLeaf,
} from "@mui/icons-material";
import PageHero from "../components/ui/PageHero";
import FeatureIconBox from "../components/ui/FeatureIconBox";
import SectionHeader from "../components/ui/SectionHeader";

const About = () => {
  return (
    <>
      <PageHero title="About" />
      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Profile Section */}
        <Grid container spacing={6} sx={{ mb: 8 }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              sx={{
                background: (theme) =>
                  `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                borderRadius: 3,
                p: 6,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 400,
              }}
            >
              <Avatar
                src="/assets/images/ryan-headshot.jpg"
                sx={{ width: 250, height: 250 }}
                alt="Ryan Barclay"
              />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Box>
                <Typography variant="h4" gutterBottom>
                  Hello, I'm Ryan Barclay
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  I'm a full-stack software engineer based in beautiful British
                  Columbia. With a deep appreciation for both technology and
                  nature, I strive to create digital experiences that are as
                  elegant and functional as the natural world around us.
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  My journey in software development began over 5 years ago, and
                  since then, I've had the privilege of working on diverse
                  projects ranging from startups to enterprise applications. I
                  believe in writing clean, maintainable code and creating
                  products that truly make a difference.
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1.5 }}>
                <IconButton
                  href="http://www.github.com/ryanbarclay"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 1.5,
                    bgcolor: (theme) => theme.palette.social.github,
                    color: "white",
                    "&:hover": {
                      bgcolor: (theme) => theme.palette.social.githubHover,
                    },
                  }}
                >
                  <GitHub sx={{ fontSize: 24 }} />
                </IconButton>
                <IconButton
                  href="https://www.linkedin.com/in/ryan-barclay"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 1.5,
                    bgcolor: (theme) => theme.palette.social.linkedin,
                    color: "white",
                    "&:hover": {
                      bgcolor: (theme) => theme.palette.social.linkedinHover,
                    },
                  }}
                >
                  <LinkedIn sx={{ fontSize: 24 }} />
                </IconButton>
                <IconButton
                  href="mailto:work@ryanbarclay.ca"
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 1.5,
                    bgcolor: "primary.main",
                    color: "white",
                    "&:hover": {
                      bgcolor: (theme) => theme.palette.social.emailHover,
                    },
                  }}
                >
                  <Email sx={{ fontSize: 24 }} />
                </IconButton>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* What I Do Section */}
        <Card sx={{ mb: 8, p: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
            What I Do
          </Typography>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <FeatureIconBox
                icon={<Palette sx={{ fontSize: 28, color: "primary.main" }} />}
                title="UI/UX Development"
                description="Creating beautiful, intuitive interfaces that users love. I focus on accessibility and responsive design principles."
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FeatureIconBox
                icon={<Storage sx={{ fontSize: 28, color: "primary.main" }} />}
                title="Backend Systems"
                description="Building scalable, secure backend systems with clean architecture and efficient databases."
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FeatureIconBox
                icon={<Cloud sx={{ fontSize: 28, color: "primary.main" }} />}
                title="Cloud Solutions"
                description="Deploying and managing cloud infrastructure for high availability applications."
              />
            </Grid>
          </Grid>
        </Card>

        {/* My Core Values Section */}
        <Card
          sx={{
            mb: 8,
            p: 4,
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
            My Core Values
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper sx={{ p: 3, height: "100%" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 1.5,
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Lightbulb sx={{ fontSize: 20, color: "primary.main" }} />
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ mb: 0 }}>
                    Innovation
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Always exploring new technologies and approaches to solve
                  problems in creative ways.
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper sx={{ p: 3, height: "100%" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 1.5,
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Groups sx={{ fontSize: 20, color: "primary.main" }} />
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ mb: 0 }}>
                    Collaboration
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Believing that the best solutions come from diverse teams
                  working together.
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper sx={{ p: 3, height: "100%" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 1.5,
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <AutoStories sx={{ fontSize: 20, color: "primary.main" }} />
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ mb: 0 }}>
                    Continuous Learning
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Committed to staying current with industry trends and
                  expanding my skill set.
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper sx={{ p: 3, height: "100%" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 1.5,
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <EnergySavingsLeaf sx={{ fontSize: 20, color: "primary.main" }} />
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ mb: 0 }}>
                    Sustainability
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Writing efficient code and considering the environmental
                  impact of technology.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Card>

        {/* Beyond Code Section */}
        <Card sx={{ mb: 8, p: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
            Beyond Code
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  height: 250,
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: 2,
                  mb: 2,
                }}
              />
              <Typography variant="h6" gutterBottom>
                Outdoor Enthusiast
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Living in BC gives me access to incredible hiking, skiing, and
                outdoor adventures. I find that time in nature helps fuel my
                creativity.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  height: 250,
                  background: (theme) => theme.palette.gradient.hero,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 2,
                  mb: 2,
                }}
              >
                <AutoStories sx={{ fontSize: 120, color: "primary.contrastText", opacity: 0.9 }} />
              </Box>
              <Typography variant="h6" gutterBottom>
                Lifelong Learner
              </Typography>
              <Typography variant="body2" color="text.secondary">
                When I'm not coding, you'll find me reading tech blogs,
                experimenting with new frameworks, or contributing to open
                source projects.
              </Typography>
            </Grid>
          </Grid>
        </Card>

        {/* CTA Section */}
        <Paper
          sx={{
            p: 6,
            textAlign: "center",
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: "white",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Let's Work Together
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, opacity: 0.9, display: "block" }}>
            I'm always interested in hearing about new projects and
            opportunities
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<Email />}
            href="/contact"
            sx={{
              bgcolor: "white",
              color: "primary.main",
              "&:hover": { bgcolor: "grey.100" },
            }}
          >
            Get In Touch
          </Button>
        </Paper>
      </Container>
    </>
  );
};

export default About;
