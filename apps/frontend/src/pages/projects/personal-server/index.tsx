import React from "react";
import { Typography, Box } from "@mui/material";
import ProjectDetailLayout from "../../../components/layout/ProjectDetailLayout";

const PersonalServer = () => {
  const sections = [
    {
      title: "Overview",
      content: (
        <Typography paragraph>
          Built from a retired insurance office NAS server, this project
          fulfilled my long-standing interest in hosting files and processing
          deep learning programs. The project involved hardware upgrades and
          configuration of various server applications.
        </Typography>
      ),
    },
    {
      title: "Hardware Specifications",
      content: (
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
      ),
    },
    {
      title: "Software Configuration",
      content: (
        <>
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
        </>
      ),
    },
    {
      title: "Applications",
      content: (
        <>
          <Typography paragraph>
            The server serves multiple purposes:
          </Typography>
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
        </>
      ),
    },
  ];

  return (
    <ProjectDetailLayout
      title="Personal Server"
      tags={["Server", "RAID", "Linux"]}
      sections={sections}
      technologies={[
        "Ubuntu Server 16.04",
        "RAID 5",
        "SSH",
        "SFTP",
        "NAS",
        "Python",
        "Machine Learning",
      ]}
    />
  );
};

export default PersonalServer;
