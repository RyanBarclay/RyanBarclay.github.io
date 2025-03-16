import { Box, Chip, Paper, Typography } from "@mui/material";
import React from "react";

const JSChallenge = () => {
  return (
    <Box sx={{ width: "100%", padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        21 Day JavaScript Challenge
      </Typography>
      <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
        <Chip label="JavaScript" />
        <Chip label="Team Competition" />
        <Chip label="Top 8" color="primary" />
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Overview
        </Typography>
        <Typography paragraph>
          In May 2019, I participated in Lighthouse Labs' 21-day JavaScript
          challenge as part of the University of Victoria's Web Dev Club team.
          The challenge was designed to build fundamental JavaScript skills
          through daily coding exercises.
        </Typography>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Team Achievement
        </Typography>
        <Typography paragraph>
          Our Web Dev Club team performed exceptionally well, ranking in the top
          8 teams by the end of the competition. This achievement highlighted
          both our collaborative abilities and our rapid learning capacity.
        </Typography>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Learning Experience
        </Typography>
        <Typography paragraph>
          The challenge provided an excellent structured approach to learning
          JavaScript, particularly valuable for developers with prior
          programming experience in other languages. Each day brought new
          concepts and challenges, building upon previous lessons.
        </Typography>
        <Typography paragraph>
          Unfortunately, due to technical issues on Lighthouse Labs' server, the
          21st day's challenge was not posted. However, the first 20 days
          provided comprehensive coverage of essential JavaScript concepts and
          practical programming challenges.
        </Typography>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Impact
        </Typography>
        <Typography paragraph>
          This challenge proved to be an excellent entry point into JavaScript
          development, providing a solid foundation for future web development
          projects. The team-based approach also helped in developing
          collaborative coding skills and understanding different
          problem-solving approaches.
        </Typography>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Technology Stack
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {[
            "JavaScript",
            "Git",
            "Node.js",
            "Problem Solving",
            "Team Collaboration",
          ].map((tech) => (
            <Chip key={tech} label={tech} variant="outlined" />
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default JSChallenge;
