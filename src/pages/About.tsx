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
import {
  GitHub,
  LinkedIn,
  Twitter,
  Email,
  Palette,
  Storage,
  Cloud,
} from "@mui/icons-material";
import PageHero from "../components/ui/PageHero";

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
                background: "linear-gradient(135deg, #a8e6cf 0%, #7dd3c0 100%)",
                borderRadius: 3,
                p: 6,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 400,
              }}
            >
              <Avatar
                sx={{
                  width: 250,
                  height: 250,
                  bgcolor: "primary.main",
                  fontSize: "6rem",
                }}
              >
                👨‍💻
              </Avatar>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Box>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
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
                    bgcolor: "#333",
                    color: "white",
                    "&:hover": { bgcolor: "#555" },
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
                    bgcolor: "#0077b5",
                    color: "white",
                    "&:hover": { bgcolor: "#005885" },
                  }}
                >
                  <LinkedIn sx={{ fontSize: 24 }} />
                </IconButton>
                <IconButton
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 1.5,
                    bgcolor: "#1DA1F2",
                    color: "white",
                    "&:hover": { bgcolor: "#0d8bd9" },
                  }}
                >
                  <Twitter sx={{ fontSize: 24 }} />
                </IconButton>
                <IconButton
                  href="mailto:work@ryanbarclay.ca"
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 1.5,
                    bgcolor: "#00897b",
                    color: "white",
                    "&:hover": { bgcolor: "#00695c" },
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
          <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
            What I Do
          </Typography>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  bgcolor: "rgba(0, 163, 158, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                <Palette sx={{ fontSize: 28, color: "primary.main" }} />
              </Box>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontWeight: 600, mb: 1 }}
              >
                UI/UX Development
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Creating beautiful, intuitive interfaces that users love. I
                focus on accessibility and responsive design principles.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  bgcolor: "rgba(0, 163, 158, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                <Storage sx={{ fontSize: 28, color: "primary.main" }} />
              </Box>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontWeight: 600, mb: 1 }}
              >
                Backend Systems
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Building scalable, secure backend systems with clean
                architecture and efficient databases.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  bgcolor: "rgba(0, 163, 158, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                <Cloud sx={{ fontSize: 28, color: "primary.main" }} />
              </Box>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontWeight: 600, mb: 1 }}
              >
                Cloud Solutions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Deploying and managing cloud infrastructure for high
                availability applications.
              </Typography>
            </Grid>
          </Grid>
        </Card>

        {/* My Core Values Section */}
        <Card sx={{ mb: 8, p: 4, bgcolor: "rgba(168, 230, 207, 0.2)" }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
            My Core Values
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper sx={{ p: 3, height: "100%" }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  💡 Innovation
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Always exploring new technologies and approaches to solve
                  problems in creative ways.
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper sx={{ p: 3, height: "100%" }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  🤝 Collaboration
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Believing that the best solutions come from diverse teams
                  working together.
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper sx={{ p: 3, height: "100%" }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  📚 Continuous Learning
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Committed to staying current with industry trends and
                  expanding my skill set.
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper sx={{ p: 3, height: "100%" }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  🌱 Sustainability
                </Typography>
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
          <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
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
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
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
                  background:
                    "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 2,
                  mb: 2,
                }}
              >
                <Typography sx={{ fontSize: "8rem" }}>📖</Typography>
              </Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
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
            background: "linear-gradient(135deg, #00a39e 0%, #00897b 100%)",
            color: "white",
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Let's Work Together
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
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
