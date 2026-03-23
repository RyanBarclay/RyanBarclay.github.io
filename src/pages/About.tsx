import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Container,
  Card,
  Avatar,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  GitHub,
  LinkedIn,
  Email,
  IntegrationInstructions,
  Speed,
  RecordVoiceOver,
  Verified,
  Groups,
  EmojiEvents,
} from "@mui/icons-material";
import PageHero from "../components/ui/PageHero";
import FeatureIconBox from "../components/ui/FeatureIconBox";
import SectionHeader from "../components/ui/SectionHeader";

const About = () => {
  return (
    <>
      <PageHero title="About" />
      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Profile Section */}
        <Grid container spacing={6} sx={{ mb: 8 }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              sx={{
                background: (theme) =>
                  `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                borderRadius: 3,
                p: 6,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 400,
              }}
            >
              <Avatar
                src="/assets/images/ryan-headshot.jpg"
                sx={{ width: 250, height: 250 }}
                alt="Ryan Barclay"
              />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Box>
                <Typography variant="h4" gutterBottom>
                  Hello, I'm Ryan Barclay
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  I'm a full-stack software engineer currently building at Rokt
                  — a global e-commerce tech company — after navigating two
                  acquisitions (AfterSell by Rokt, Beanworks by Quadient). I
                  operate across the stack: from React frontends and Node
                  backends to DevOps pipelines and the AI workflows that tie
                  them together.
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Based in North Vancouver, I work at the intersection of
                  engineering depth and cross-functional communication. In the
                  current AI landscape, I focus on being a force multiplier —
                  bringing the architecture instincts and quality gates that
                  turn AI tooling from a curiosity into a production accelerant.
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  startIcon={<GitHub />}
                  href="http://www.github.com/ryanbarclay"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    bgcolor: (theme) => theme.palette.social.github,
                    borderRadius: 6,
                    "&:hover": { bgcolor: (theme) => theme.palette.social.githubHover },
                  }}
                >
                  GitHub
                </Button>
                <Button
                  variant="contained"
                  startIcon={<LinkedIn />}
                  href="https://www.linkedin.com/in/ryan-barclay"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    bgcolor: (theme) => theme.palette.social.linkedin,
                    borderRadius: 6,
                    "&:hover": { bgcolor: (theme) => theme.palette.social.linkedinHover },
                  }}
                >
                  LinkedIn
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Email />}
                  href="mailto:work@ryanbarclay.ca"
                  sx={{
                    bgcolor: "primary.main",
                    borderRadius: 6,
                    "&:hover": { bgcolor: (theme) => theme.palette.social.emailHover },
                  }}
                >
                  Email
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* What I Do Section */}
        <Card sx={{ mb: 8, p: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
            What I Do
          </Typography>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <FeatureIconBox
                icon={<IntegrationInstructions sx={{ fontSize: 28, color: "primary.main" }} />}
                title="Partner Integrations"
                description="Embedding Rokt's platform into merchant tech stacks — from Shopify apps to custom API integrations. I own the full integration lifecycle: scoping, implementation, and go-live."
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FeatureIconBox
                icon={<Speed sx={{ fontSize: 28, color: "primary.main" }} />}
                title="Full-Stack Velocity"
                description="React frontends, Node backends, DevOps pipelines — and now the AI workflows that multiply all of it. I move fast without breaking things that matter."
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FeatureIconBox
                icon={<RecordVoiceOver sx={{ fontSize: 28, color: "primary.main" }} />}
                title="Technical Discovery"
                description="Primary technical voice bridging engineering and GTM. I translate architecture decisions into partner value and turn a hard 'no' into a scoped 'yes' in a single call."
              />
            </Grid>
          </Grid>
        </Card>

        {/* My Core Values Section */}
        <Card
          sx={{
            mb: 8,
            p: 4,
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
            My Core Values
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper sx={{ p: 3, height: "100%" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 1.5,
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Speed sx={{ fontSize: 20, color: "primary.main" }} />
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ mb: 0 }}>
                    Move Fast
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Fast development is a feature. I ship quickly, iterate in
                  production, and use AI tooling to multiply output — without
                  sacrificing the architecture that keeps things moving at speed.
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper sx={{ p: 3, height: "100%" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 1.5,
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Verified sx={{ fontSize: 20, color: "primary.main" }} />
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ mb: 0 }}>
                    Best Practices First
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Speed without discipline is just chaos. I bring the quality
                  gates, code review instincts, and architecture patterns that
                  make fast sustainable.
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper sx={{ p: 3, height: "100%" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 1.5,
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Groups sx={{ fontSize: 20, color: "primary.main" }} />
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ mb: 0 }}>
                    In-Person Energy
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  The best alignment happens face-to-face. Sometimes a 10-minute
                  whiteboard conversation closes what 30 Slack threads couldn't.
                  I show up, push back, and get to yes.
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper sx={{ p: 3, height: "100%" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 1.5,
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <EmojiEvents sx={{ fontSize: 20, color: "primary.main" }} />
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ mb: 0 }}>
                    Compete to Win
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  From university rowing to production incidents: I'm wired to
                  go fast, break the right rules, and finish first. I bring that
                  competitive edge into every sprint and every partnership.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Card>

        {/* Beyond Code Section */}
        <Card sx={{ mb: 8, p: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
            Beyond Code
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  height: 250,
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: 2,
                  mb: 2,
                }}
              />
              <Typography variant="h6" gutterBottom>
                Outdoor Enthusiast
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Living in BC gives me access to incredible hiking, skiing, and
                outdoor adventures. I find that time in nature helps fuel my
                creativity.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  height: 250,
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&auto=format&fit=crop)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: 2,
                  mb: 2,
                }}
              />
              <Typography variant="h6" gutterBottom>
                Lifelong Learner
              </Typography>
              <Typography variant="body2" color="text.secondary">
                When I'm not coding, you'll find me reading tech blogs,
                experimenting with new frameworks, or exploring what's possible
                with AI-assisted development.
              </Typography>
            </Grid>
          </Grid>
        </Card>

        {/* CTA Section */}
        <Paper
          sx={{
            p: 6,
            textAlign: "center",
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: "white",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Let's Work Together
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, opacity: 0.9, display: "block" }}>
            I'm always interested in hearing about new projects and
            opportunities
          </Typography>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<GitHub />}
              href="http://www.github.com/ryanbarclay"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ bgcolor: "white", color: "grey.900", borderRadius: 6, "&:hover": { bgcolor: "grey.100" } }}
            >
              GitHub
            </Button>
            <Button
              variant="contained"
              size="large"
              startIcon={<LinkedIn />}
              href="https://www.linkedin.com/in/ryan-barclay"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ bgcolor: "white", color: "grey.900", borderRadius: 6, "&:hover": { bgcolor: "grey.100" } }}
            >
              LinkedIn
            </Button>
            <Button
              variant="contained"
              size="large"
              startIcon={<Email />}
              href="mailto:work@ryanbarclay.ca"
              sx={{ bgcolor: "white", color: "grey.900", borderRadius: 6, "&:hover": { bgcolor: "grey.100" } }}
            >
              Email
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default About;
