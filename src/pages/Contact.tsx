import React from "react";
import { Box, Container, Typography, Paper, Grid, Button } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { GitHub, LinkedIn, Email, Description } from "@mui/icons-material";
import PageHero from "../components/ui/PageHero";

interface ContactItem {
  name: string;
  icon: React.ReactElement;
  link: string;
  description: string;
  color: string;
}

const Contact = () => {
  const contacts: ContactItem[] = [
    {
      name: "GitHub",
      icon: <GitHub />,
      link: "http://www.github.com/ryanbarclay",
      description: "Check out my code repositories and projects",
      color: "social.github",
    },
    {
      name: "LinkedIn",
      icon: <LinkedIn />,
      link: "https://www.linkedin.com/in/ryan-barclay",
      description: "Connect with me professionally and view my work experience",
      color: "social.linkedin",
    },
    {
      name: "Email",
      icon: <Email />,
      link: "mailto:work@ryanbarclay.ca",
      description: "Send me an email at work@ryanbarclay.ca",
      color: "primary.main",
    },
    {
      name: "Resume",
      icon: <Description />,
      link: "/resume",
      description: "View my professional experience and skills",
      color: "secondary.main",
    },
  ];

  return (
    <>
      <PageHero
        title="Get In Touch"
        subtitle="Let's connect and build something amazing together"
      />
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={3}>
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
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: 2,
                      bgcolor: (theme) =>
                        alpha(
                          contact.name === "GitHub"
                            ? theme.palette.social.github
                            : contact.name === "LinkedIn"
                              ? theme.palette.social.linkedin
                              : contact.name === "Email"
                                ? theme.palette.primary.main
                                : theme.palette.secondary.main,
                          0.12
                        ),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2,
                    }}
                  >
                    {contact.name === "GitHub" ? (
                      <GitHub sx={{ fontSize: 26, color: "social.github" }} />
                    ) : contact.name === "LinkedIn" ? (
                      <LinkedIn sx={{ fontSize: 26, color: "social.linkedin" }} />
                    ) : contact.name === "Email" ? (
                      <Email sx={{ fontSize: 26, color: "primary.main" }} />
                    ) : (
                      <Description sx={{ fontSize: 26, color: "secondary.main" }} />
                    )}
                  </Box>
                  <Typography variant="h6" gutterBottom>
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
                    contact.name !== "Resume"
                      ? "noopener noreferrer"
                      : undefined
                  }
                >
                  Connect on {contact.name}
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default Contact;
