import { Box, Chip, Paper, Typography } from "@mui/material";
import React from "react";

const PersonalServer = () => {
  return (
    <Box sx={{ width: "100%", padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Personal Server
      </Typography>
      <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
        <Chip label="Server" />
        <Chip label="RAID" />
        <Chip label="Linux" />
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Overview
        </Typography>
        <Typography paragraph>
          Built from a retired insurance office NAS server, this project
          fulfilled my long-standing interest in hosting files and processing
          deep learning programs. The project involved hardware upgrades and
          configuration of various server applications.
        </Typography>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Hardware Specifications
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography>
            • 6 Core, 8 Thread CPU (retained original due to system constraints)
          </Typography>
          <Typography>
            • 2 x 2 GB 800mHz DDR2 RAM (upgraded from original)
          </Typography>
          <Typography>
            • 4TB Storage in RAID 5 Configuration (4 HDDs)
          </Typography>
          <Typography>• Gigabit Network Card</Typography>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Software Configuration
        </Typography>
        <Typography paragraph>
          The server runs Ubuntu Server 16.04 and provides multiple services:
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography>• Network Attached Storage (NAS)</Typography>
          <Typography>• SFTP Server for secure file transfers</Typography>
          <Typography>• SSH Server for remote access</Typography>
          <Typography>
            • Dynamic DNS routing for remote access with non-static IP
          </Typography>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Applications
        </Typography>
        <Typography paragraph>The server serves multiple purposes:</Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography>
            • Training environment for machine learning Battlesnake projects
          </Typography>
          <Typography>
            • Complete backup solution for laptop and PC data
          </Typography>
          <Typography>• Centralized file storage and sharing</Typography>
          <Typography>• Development and testing environment</Typography>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Technology Stack
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {[
            "Ubuntu Server 16.04",
            "RAID 5",
            "SSH",
            "SFTP",
            "NAS",
            "Python",
            "Machine Learning",
          ].map((tech) => (
            <Chip key={tech} label={tech} variant="outlined" />
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default PersonalServer;
