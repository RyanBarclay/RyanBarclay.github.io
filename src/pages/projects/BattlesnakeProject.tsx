import { Box, Chip, Paper, Typography } from "@mui/material";
import React from "react";

const BattlesnakeProject = () => {
  return (
    <Box sx={{ width: "100%", padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Battlesnake 2019
      </Typography>
      <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
        <Chip label="Python" />
        <Chip label="AI" />
        <Chip label="Web Server" />
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          What is Battlesnake?
        </Typography>
        <Typography paragraph>
          "A Battlesnake is a programmed web server that implements the
          Battlesnake HTTP API to play the game snake against other
          Battlesnakes. When a game is running, the Battlesnake Game Engine will
          make HTTP requests to your server, sending you game information and
          asking for your next move."
        </Typography>
        <Typography paragraph>
          In simpler terms, Battlesnake is a great way to kick in the door with
          AI, web servers, deployment, and networking.
        </Typography>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          What I Learned
        </Typography>
        <Typography paragraph>
          This was my entry into deployment, git, python, web servers, and
          hackathons. It was an incredible experience where I met many amazing
          people and companies. Going solo allowed me to connect with other
          competitors who were more than willing to help out.
        </Typography>
        <Typography paragraph>
          My software skills and problem-solving abilities were put to the test.
          In hindsight, my approach using physics and vector math limited my
          options when tackling complex challenges. During the event, I
          discovered BFS (Breadth-First Search) for pathfinding, which opened my
          eyes to better solution approaches.
        </Typography>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Technical Implementation
        </Typography>
        <Typography paragraph>
          The implementation started with parsing JSON responses from the game
          server's API. I then mapped this data to a 2D array for better
          visualization and algorithm efficiency. The snake's strategy was
          implemented using a game state approach, though without maintaining
          memory of past turns.
        </Typography>
        <Typography paragraph>
          While the code (~1000 lines) executed perfectly, the underlying
          strategy logic had room for improvement. This experience taught me
          valuable lessons about algorithm selection and strategic planning in
          competitive programming.
        </Typography>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Technology Stack
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {[
            "Python 2.7.13",
            "Gunicorn",
            "Bottle",
            "Numpy",
            "JSON",
            "Pyenv",
            "Virtual-Environment",
            "Heroku",
            "Git",
            "Pip",
            "Shell",
          ].map((tech) => (
            <Chip key={tech} label={tech} variant="outlined" />
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default BattlesnakeProject;
