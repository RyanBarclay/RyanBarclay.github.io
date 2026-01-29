import React from "react";
import { Box, Chip, Paper, Typography } from "@mui/material";
import PageHero from "../ui/PageHero";

/**
 * ISSUE: Section interface tightly couples content to structure
 * FIX: Consider render props or children pattern for more flexibility
 * FE Best Practice: { title, render: () => ReactNode } allows dynamic content
 */
interface ProjectSection {
  title: string;
  content: React.ReactNode;
}

/**
 * ISSUE: Props interface lacks clear documentation and optional prop handling
 * FIX: Add JSDoc, mark truly optional props, provide sensible defaults
 * FE Best Practice: customContent naming is vague - consider 'additionalContent' or specific name
 *
 * ISSUE: heroImage and heroGradient should have defaults in props destructuring
 * FIX: Provide fallback values inline: heroImage = defaultHeroImage
 * PATTERN: Reduces conditional logic and makes defaults explicit
 */
interface ProjectDetailLayoutProps {
  title: string;
  tags: string[];
  sections: ProjectSection[];
  technologies: string[];
  customContent?: React.ReactNode;
  heroImage?: string;
  heroGradient?: string;
}

const ProjectDetailLayout: React.FC<ProjectDetailLayoutProps> = ({
  title,
  tags,
  sections,
  technologies,
  customContent,
  heroImage,
  heroGradient,
}) => {
  return (
    <>
      {/**
       * ISSUE: Empty title prop passed to PageHero (title="")
       * FIX: Either remove PageHero if no title needed or pass actual title
       * MUI v7: Empty semantic elements degrade accessibility
       * PATTERN: Conditionally render PageHero only if title exists
       */}
      <PageHero
        title=""
        variant="project"
        backgroundImage={heroImage}
        gradientOverlay={heroGradient}
      />
      {/**
       * ISSUE: Hardcoded padding: 2 instead of semantic spacing
       * FIX: Use theme-defined spacing for consistent layout
       * MUI v7: padding: { xs: 2, md: 4 } for responsive spacing
       * PATTERN: Container with maxWidth="lg" for content constraint
       */}
      <Box sx={{ width: "100%", padding: 2 }}>
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ display: "flex", gap: 1, mb: 3, flexWrap: "wrap" }}>
          {tags.map((tag) => (
            <Chip key={tag} label={tag} />
          ))}
        </Box>

        {/**
         * ISSUE: Array index as key is anti-pattern
         * FIX: Use section.title or unique id as key
         * React Best Practice: Index keys cause issues with reordering/filtering
         * PATTERN: sections.map(section => <Paper key={section.title}>)
         */}
        {sections.map((section, index) => (
          <Paper key={index} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              {section.title}
            </Typography>
            {section.content}
          </Paper>
        ))}

        <Paper sx={{ p: 3, mb: customContent ? 3 : 0 }}>
          <Typography variant="h5" gutterBottom>
            Technology Stack
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {technologies.map((tech) => (
              <Chip key={tech} label={tech} variant="outlined" />
            ))}
          </Box>
        </Paper>

        {customContent && <Box sx={{ mt: 3 }}>{customContent}</Box>}
      </Box>
    </>
  );
};

export default ProjectDetailLayout;
