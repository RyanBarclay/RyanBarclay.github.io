import { Box, Chip, Paper, Typography } from "@mui/material";
import React from "react";

const SpookathonProject = () => {
  return (
    <Box sx={{ width: "100%", padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        2019 UVIC Spookathon
      </Typography>
      <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
        <Chip label="2nd Place" color="primary" />
        <Chip label="Hackathon" />
        <Chip label="Machine Learning" />
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Overview
        </Typography>
        <Typography paragraph>
          In October 2019, I participated in the Web Dev club's 3-hour Hackathon
          at the University of Victoria. As a solo participant, I was thrilled
          to win 2nd place in this independently supported event.
        </Typography>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          The Problem & Solution
        </Typography>
        <Typography paragraph>
          The challenge was to design and implement a product within just 3
          hours. I tackled a unique problem in movie selection: helping users
          avoid movies featuring actors they dislike.
        </Typography>
        <Typography paragraph>
          My solution was an innovative system that uses facial recognition to
          identify and filter out movies containing specified actors. The
          insight came from realizing that viewers often know which actors they
          don't enjoy watching, but might not discover their presence until
          partway through a movie.
        </Typography>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Technical Implementation
        </Typography>
        <Typography paragraph>
          The software performed excellently in its alpha state. I leveraged
          open-source facial recognition libraries to handle the core
          functionality, which allowed me to focus on product development rather
          than building the recognition system from scratch.
        </Typography>
        <Typography paragraph>
          The backend was designed to match movie frames against uploaded actor
          photos stored in the root directory. Despite the time constraints, the
          technical implementation was sophisticated enough to secure a top 10
          position among the contestants.
        </Typography>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Results
        </Typography>
        <Typography paragraph>
          The demo phase was particularly successful, with flawless execution of
          the concept. While first place went to an impressive Goosebumps-style
          choose-your-own-adventure with text-to-speech, securing second place
          validated the innovative approach and technical implementation of my
          project.
        </Typography>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Technology Stack
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {[
            "Python 3",
            "Git",
            "Pip3",
            "Numpy",
            "Python Image Library",
            "Face Recognition",
          ].map((tech) => (
            <Chip key={tech} label={tech} variant="outlined" />
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default SpookathonProject;
