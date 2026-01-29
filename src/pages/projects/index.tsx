import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Chip,
  CardActions,
  Button,
} from "@mui/material";
import { GitHub } from "@mui/icons-material";
import PageHero from "../../components/ui/PageHero";
import { projectsData } from "../../data/projects";
import { useNavigation } from "../../hooks/useNavigation";

const Projects = () => {
  const handleLinkClick = useNavigation();

  return (
    <>
      <PageHero
        title="My Projects"
        subtitle="Explore my work in software development and innovation"
      />
      <Box sx={{ width: "100%", padding: 4, maxWidth: "1400px", mx: "auto" }}>
        <Typography variant="h2" gutterBottom sx={{ mb: 2 }}>
          Featured Projects
        </Typography>
        <Typography variant="body1" sx={{ mb: 6, color: "text.secondary" }}>
          Explore my latest work in web development, from full-stack
          applications to innovative frontend solutions
        </Typography>
        {/**
         * ISSUE: Duplicate Card component logic from Home.tsx
         * FIX: Create shared ProjectCard component in components/ui/
         * MUI v7: Extract to styled component with props for onClick handling
         * FE Best Practice: Single source of truth for project card presentation
         */}
        <Grid container spacing={4}>
          {projectsData.map((project) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={project.title}>
              <Card
                onClick={() =>
                  project.detailPage && handleLinkClick(project.detailPage)
                }
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  cursor: project.detailPage ? "pointer" : "default",
                }}
              >
                {project.image && (
                  <CardMedia
                    component="img"
                    height="240"
                    image={project.image}
                    alt={project.title}
                    sx={{ objectFit: "cover" }}
                  />
                )}
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography
                    variant="h5"
                    component="h3"
                    gutterBottom
                    sx={{ fontWeight: 600, mb: 2 }}
                  >
                    {project.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    paragraph
                    sx={{ mb: 3 }}
                  >
                    {project.description}
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {project.technologies.map((tech) => (
                      <Chip
                        key={tech}
                        label={tech}
                        size="small"
                        variant="technology"
                      />
                    ))}
                  </Box>
                </CardContent>
                {project.links && (
                  <CardActions sx={{ p: 3, pt: 0, gap: 1 }}>
                    {project.links.github && (
                      <Button
                        variant="outlined"
                        size="medium"
                        startIcon={<GitHub />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLinkClick(project.links!.github!);
                        }}
                        sx={{ flex: 1 }}
                      >
                        Code
                      </Button>
                    )}
                    {project.links.live && (
                      <Button
                        variant="contained"
                        size="medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLinkClick(project.links!.live!);
                        }}
                        sx={{ flex: 1 }}
                      >
                        Demo
                      </Button>
                    )}
                  </CardActions>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default Projects;
