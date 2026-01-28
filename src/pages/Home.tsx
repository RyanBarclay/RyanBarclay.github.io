import React from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Chip,
  Divider,
} from "@mui/material";
import { GitHub, LinkedIn } from "@mui/icons-material";
import Hero from "../components/ui/Hero";
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
                <Card
                  onClick={() => handleLinkClick(project.detailPage)}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                    transition:
                      "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={project.image}
                    alt={project.title}
                    sx={{ objectFit: "cover" }}
                  />
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography
                      variant="h6"
                      component="h3"
                      gutterBottom
                      sx={{ fontWeight: 600 }}
                    >
                      {project.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                      sx={{ mb: 2 }}
                    >
                      {project.description}
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {project.technologies.map((tech) => (
                        <Chip
                          key={tech}
                          label={tech}
                          size="small"
                          sx={{
                            backgroundColor: "primary.main",
                            color: "primary.contrastText",
                            fontWeight: 500,
                          }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
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
            background:
              "linear-gradient(135deg, rgba(0,163,161,0.1) 0%, rgba(0,137,123,0.1) 100%)",
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
              href="http://www.github.com/ryanbarclay"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </Button>
            <Button
              variant="contained"
              startIcon={<LinkedIn />}
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
