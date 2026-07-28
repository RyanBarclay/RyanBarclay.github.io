import { useState } from "react";
import {
  Container,
  Grid,
  Button,
  Collapse,
  Typography,
  Box,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PageHero from "../../components/ui/PageHero";
import ProjectCard from "../../components/ui/ProjectCard";
import { projectsData } from "../../data/projects";

const Projects = () => {
  const [showArchived, setShowArchived] = useState(false);

  const activeProjects = projectsData.filter((p) => p.tag !== "ARCHIVED");
  const archivedProjects = projectsData.filter((p) => p.tag === "ARCHIVED");

  return (
    <>
      <PageHero
        title="My Projects"
        subtitle="Explore my work in software development and innovation"
      />
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {activeProjects.map((project) => (
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

        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => setShowArchived((prev) => !prev)}
            endIcon={
              showArchived ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />
            }
            sx={{ color: "text.secondary", borderColor: "divider" }}
          >
            {showArchived
              ? "Hide Archived Projects"
              : `Show Archived Projects (${archivedProjects.length})`}
          </Button>
        </Box>

        <Collapse in={showArchived}>
          <Typography
            variant="overline"
            color="text.secondary"
            sx={{ display: "block", mt: 6, mb: 3, letterSpacing: "0.1em" }}
          >
            Archived Projects
          </Typography>
          <Grid container spacing={4}>
            {archivedProjects.map((project) => (
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
        </Collapse>
      </Container>
    </>
  );
};

export default Projects;
