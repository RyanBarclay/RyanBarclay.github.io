import React from "react";
import { Box, Chip, Paper, Typography } from "@mui/material";
import PageHero from "../ui/PageHero";

interface ProjectSection {
  title: string;
  content: React.ReactNode;
}

interface ProjectDetailLayoutProps {
  title: string;
  tags: string[];
  sections: ProjectSection[];
  technologies: string[];
  additionalContent?: React.ReactNode;
  heroImage?: string;
  heroGradient?: string;
}

const ProjectDetailLayout: React.FC<ProjectDetailLayoutProps> = ({
  title,
  tags,
  sections,
  technologies,
  additionalContent,
  heroImage,
  heroGradient,
}) => {
  return (
    <>
      <PageHero
        title=""
        variant="project"
        backgroundImage={heroImage}
        gradientOverlay={heroGradient}
      />
      <Box sx={{ width: "100%", padding: { xs: 2, md: 4 } }}>
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ display: "flex", gap: 1, mb: 3, flexWrap: "wrap" }}>
          {tags.map((tag) => (
            <Chip key={tag} label={tag} />
          ))}
        </Box>

        {sections.map((section) => (
          <Paper key={section.title} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              {section.title}
            </Typography>
            {section.content}
          </Paper>
        ))}

        <Paper sx={{ p: 3, mb: additionalContent ? 3 : 0 }}>
          <Typography variant="h5" gutterBottom>
            Technology Stack
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {technologies.map((tech) => (
              <Chip key={tech} label={tech} variant="outlined" />
            ))}
          </Box>
        </Paper>

        {additionalContent && <Box sx={{ mt: 3 }}>{additionalContent}</Box>}
      </Box>
    </>
  );
};

export default ProjectDetailLayout;
