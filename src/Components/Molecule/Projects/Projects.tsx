import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  Chip,
  CardActions,
  Button,
} from "@mui/material";
import { GitHub, Launch } from "@mui/icons-material";

type Project = {
  title: string;
  tag: string;
  description: string;
  technologies: string[];
  links?: {
    github?: string;
    live?: string;
  };
};

const projects: Project[] = [
  {
    title: "N-Body Simulation",
    tag: "PROJ",
    description:
      "An interactive 3D physics simulation that models gravitational interactions between multiple bodies in space. The simulation uses the Barnes-Hut algorithm to efficiently approximate gravitational forces between large numbers of particles, making it possible to simulate complex systems like galaxies and star clusters.",
    technologies: [
      "React Three Fiber",
      "React",
      "TypeScript",
      "Barnes-Hut Algorithm",
      "Octree",
    ],
    links: {
      github: "TBD",
      live: "TBD",
    },
  },
  {
    title: "Battlesnake 2019",
    tag: "EVNT",
    description:
      "A competitive programming game where you build an AI web server to play snake against other players. Used AI, web servers, deployment, and networking.",
    technologies: [
      "Python 2.7.13",
      "Gunicorn",
      "Bottle",
      "Numpy",
      "JSON",
      "Pyenv",
      "Heroku",
      "Git",
    ],
    links: {
      github: "https://github.com/RyanBarclay/striper-snake",
      live: "https://play.battlesnake.com",
    },
  },
  {
    title: "Personal Server",
    tag: "PROJ",
    description:
      "Built and configured a personal server for NAS, SFTP, SSH and ML training. Features 4TB RAID 5 storage, 6 core CPU and serves as a development environment.",
    technologies: [
      "Ubuntu Server 16.04",
      "RAID 5",
      "SSH",
      "SFTP",
      "Python",
      "Machine Learning",
    ],
  },
  {
    title: "Spookathon 2019",
    tag: "HACK",
    description:
      "Won 2nd place at UVic's 3-hour hackathon. Built a movie recommendation system that filters out movies containing disliked actors using facial recognition.",
    technologies: [
      "Python 3",
      "Git",
      "Pip3",
      "Numpy",
      "PIL",
      "Face Recognition",
    ],
    links: {
      github: "https://github.com/RyanBarclay/Spookathon-2019-Face-Recognition",
    },
  },
  {
    title: "21 Day JavaScript Challenge",
    tag: "CHAL",
    description:
      "Participated in Lighthouse Labs' JavaScript challenge. Team ranked in top 8 while building fundamental JS skills.",
    technologies: ["JavaScript", "Git"],
    links: {
      github:
        "https://github.com/RyanBarclay/Lighthouse-Labs-21-Day-Coding-Challenge",
    },
  },
];

const Projects = () => {
  return (
    <Box sx={{ width: "100%", padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Projects
      </Typography>
      <Grid spacing={3}>
        {projects.map((project) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={project.title}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <CardHeader
                title={project.title}
                subheader={<Chip label={project.tag} size="small" />}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography paragraph>{project.description}</Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {project.technologies.map((tech) => (
                    <Chip
                      key={tech}
                      label={tech}
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Box>
              </CardContent>
              {project.links && (
                <CardActions>
                  {project.links.github && (
                    <Button
                      size="small"
                      startIcon={<GitHub />}
                      href={project.links.github}
                      target="_blank"
                    >
                      Code
                    </Button>
                  )}
                  {project.links.live && (
                    <Button
                      size="small"
                      startIcon={<Launch />}
                      href={project.links.live}
                      target="_blank"
                    >
                      Live Demo
                    </Button>
                  )}
                </CardActions>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Projects;
