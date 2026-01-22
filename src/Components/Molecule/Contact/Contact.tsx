import React from "react";
import { Box, Typography, Paper, Grid, Button } from "@mui/material";
import { GitHub, LinkedIn, Email, Description } from "@mui/icons-material";

const Contact = () => {
  const contacts = [
    {
      name: "GitHub",
      icon: <GitHub />,
      link: "http://www.github.com/ryanbarclay",
      description:
        "Check out my code repositories and open source contributions",
    },
    {
      name: "LinkedIn",
      icon: <LinkedIn />,
      link: "https://www.linkedin.com/in/ryan-barclay",
      description: "Connect with me professionally and view my work experience",
    },
    {
      name: "Email",
      icon: <Email />,
      link: "mailto:mrryanbarclay@gmail.com",
      description: "Send me an email at mrryanbarclay@gmail.com",
    },
    {
      name: "Resume",
      icon: <Description />,
      link: "/resume",
      description: "View my professional experience and skills",
    },
  ];

  return (
    <Box sx={{ width: "100%", padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Contact Me
      </Typography>
      <Grid spacing={3}>
        {contacts.map((contact) => (
          <Grid size={{ xs: 12, sm: 6 }} key={contact.name}>
            <Paper
              sx={{
                p: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  {contact.icon}
                  {contact.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {contact.description}
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={contact.icon}
                href={contact.link}
                target={contact.name !== "Resume" ? "_blank" : undefined}
                rel={
                  contact.name !== "Resume" ? "noopener noreferrer" : undefined
                }
              >
                Connect on {contact.name}
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Contact;
