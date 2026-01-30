import React from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Container,
  Grid,
  Divider,
} from "@mui/material";
import { GitHub, LinkedIn } from "@mui/icons-material";
import Hero from "../components/ui/Hero";
import ProjectCard from "../components/ui/ProjectCard";
import { getFeaturedProjects } from "../data/projects";
import { useNavigation } from "../hooks/useNavigation";

const Home = () => {
  const handleLinkClick = useNavigation();
  const featuredProjects = getFeaturedProjects();

  return (
    <>
      <Hero />
      <Container maxWidth="xl" sx={{ py: 8 }}>
        {/* Featured Projects Section */}
        <Box sx={{ mb: 8 }}>
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography variant="h3" gutterBottom sx={{ mb: 2 }}>
              Featured Projects
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "text.secondary", maxWidth: "800px", mx: "auto" }}
            >
              Explore some of my latest work in software development, from
              interactive simulations to practical tools
            </Typography>
          </Box>
          <Grid container spacing={4} sx={{ mb: 4 }}>
            {featuredProjects.map((project) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={project.title}>
                <ProjectCard
                  title={project.title}
                  description={project.description}
                  image={project.image}
                  technologies={project.technologies}
                  detailPage={project.detailPage}
                />
              </Grid>
            ))}
          </Grid>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 8 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => handleLinkClick("/projects")}
            >
              View All Projects
            </Button>
          </Box>
        </Box>

        {/* Connect Section */}
        <Paper
          sx={{
            p: 6,
            textAlign: "center",
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.primary.dark}15 100%)`,
          }}
        >
          <Box sx={{ mb: 6 }}>
            <Typography variant="h3" gutterBottom sx={{ mb: 2 }}>
              Let's Connect
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "text.secondary", maxWidth: "800px", mx: "auto" }}
            >
              I'm always open to discussing new projects and opportunities
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <Button
              variant="contained"
              startIcon={<GitHub />}
              component="a"
              href="http://www.github.com/ryanbarclay"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </Button>
            <Button
              variant="contained"
              startIcon={<LinkedIn />}
              component="a"
              href="https://www.linkedin.com/in/ryan-barclay"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </Button>
          </Box>
        </Paper>

        {/* BC-Inspired Footer */}
        <Divider sx={{ mt: 8, mb: 4 }} />
        <Typography
          variant="body2"
          sx={{
            textAlign: "center",
            color: "text.secondary",
            fontStyle: "italic",
          }}
        >
          Inspired by British Columbia—the most beautiful place on earth
        </Typography>
      </Container>
    </>
  );
};

export default Home;
