import React from "react";
import { Container, Grid } from "@mui/material";
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
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {projectsData.map((project) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={project.title}>
              <ProjectCard
                title={project.title}
                description={project.description}
                image={project.image}
                technologies={project.technologies}
                detailPage={project.detailPage}
                tag={project.tag}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default Projects;
