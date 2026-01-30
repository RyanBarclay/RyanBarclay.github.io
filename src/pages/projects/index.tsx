import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import PageHero from "../../components/ui/PageHero";
import ProjectCard from "../../components/ui/ProjectCard";
import { projectsData } from "../../data/projects";

const Projects = () => {
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
        <Grid container spacing={4}>
          {projectsData.map((project) => (
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
      </Box>
    </>
  );
};

export default Projects;
