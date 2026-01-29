import React from "react";
import { Typography } from "@mui/material";
import ProjectDetailLayout from "../../../components/layout/ProjectDetailLayout";
import { getProjectById } from "../../../data/projects";
import SpookathonBanner from "./assets/Spookathon-Banner.jpg";

const SpookathonProject = () => {
  const projectData = getProjectById("spookathon");

  const sections = [
    {
      title: "Overview",
      content: (
        <Typography paragraph>
          In October 2019, I participated in the Web Dev club's 3-hour Hackathon
          at the University of Victoria. As a solo participant, I was thrilled
          to win 2nd place in this independently supported event.
        </Typography>
      ),
    },
    {
      title: "The Problem & Solution",
      content: (
        <>
          <Typography paragraph>
            The challenge was to design and implement a product within just 3
            hours. I tackled a unique problem in movie selection: helping users
            avoid movies featuring actors they dislike.
          </Typography>
          <Typography paragraph>
            My solution was an innovative system that uses facial recognition to
            identify and filter out movies containing specified actors. The
            insight came from realizing that viewers often know which actors
            they don't enjoy watching, but might not discover their presence
            until partway through a movie.
          </Typography>
        </>
      ),
    },
    {
      title: "Technical Implementation",
      content: (
        <>
          <Typography paragraph>
            The software performed excellently in its alpha state. I leveraged
            open-source facial recognition libraries to handle the core
            functionality, which allowed me to focus on product development
            rather than building the recognition system from scratch.
          </Typography>
          <Typography paragraph>
            The backend was designed to match movie frames against uploaded
            actor photos stored in the root directory. Despite the time
            constraints, the technical implementation was sophisticated enough
            to secure a top 10 position among the contestants.
          </Typography>
        </>
      ),
    },
    {
      title: "Results",
      content: (
        <Typography paragraph>
          The demo phase was particularly successful, with flawless execution of
          the concept. While first place went to an impressive Goosebumps-style
          choose-your-own-adventure with text-to-speech, securing second place
          validated the innovative approach and technical implementation of my
          project.
        </Typography>
      ),
    },
  ];

  if (!projectData) return null;

  return (
    <ProjectDetailLayout
      title={projectData.title}
      tags={projectData.tags}
      sections={sections}
      technologies={projectData.technologies}
      heroImage={SpookathonBanner}
      heroGradient={projectData.heroGradient}
    />
  );
};

export default SpookathonProject;
