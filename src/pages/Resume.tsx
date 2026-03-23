import React from "react";
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  Download,
  Email,
  GitHub,
  LinkedIn,
  LocationOn,
  School,
  Work,
  Groups,
} from "@mui/icons-material";
import PageHero from "../components/ui/PageHero";
import { resumeData } from "../data/resume";

const Resume = () => {
  const handleDownload = () => {
    window.print();
  };

  return (
    <>
      <Box className="resume-page-hero">
        <PageHero title="Resume" subtitle="Software Engineer — North Vancouver, BC" />
      </Box>

      {/* Fixed download button */}
      <Button
        className="resume-download-btn"
        variant="contained"
        size="large"
        startIcon={<Download />}
        onClick={handleDownload}
        sx={{
          position: "fixed",
          bottom: 32,
          right: 32,
          zIndex: 1200,
          borderRadius: 3,
          px: 3,
          py: 1.5,
          boxShadow: (theme) => theme.shadows[8],
          "&:hover": {
            boxShadow: (theme) => theme.shadows[12],
          },
        }}
      >
        Download PDF
      </Button>

      <Container maxWidth="lg" sx={{ py: 4, pb: 12 }}>
        {/* Header Card */}
        <Paper
          className="resume-section"
          sx={{
            p: { xs: 3, md: 5 },
            mb: 4,
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: "white",
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5 }}>
            {resumeData.name}
          </Typography>
          <Typography
            variant="h5"
            sx={{ fontWeight: 300, opacity: 0.9, mb: 3, display: "block" }}
          >
            {resumeData.title}
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <LocationOn sx={{ fontSize: 18, opacity: 0.8 }} />
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {resumeData.location}
              </Typography>
            </Box>
            <Box
              component="a"
              href={`mailto:${resumeData.email}`}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                color: "inherit",
                textDecoration: "none",
                opacity: 0.9,
                "&:hover": { opacity: 1 },
              }}
            >
              <Email sx={{ fontSize: 18 }} />
              <Typography variant="body2">{resumeData.email}</Typography>
            </Box>
            <Box
              component="a"
              href={`https://${resumeData.github}`}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                color: "inherit",
                textDecoration: "none",
                opacity: 0.9,
                "&:hover": { opacity: 1 },
              }}
            >
              <GitHub sx={{ fontSize: 18 }} />
              <Typography variant="body2">{resumeData.github}</Typography>
            </Box>
            <Box
              component="a"
              href={`https://${resumeData.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                color: "inherit",
                textDecoration: "none",
                opacity: 0.9,
                "&:hover": { opacity: 1 },
              }}
            >
              <LinkedIn sx={{ fontSize: 18 }} />
              <Typography variant="body2">{resumeData.linkedin}</Typography>
            </Box>
          </Box>
        </Paper>

        {/* Summary */}
        <Paper className="resume-section" sx={{ p: { xs: 3, md: 4 }, mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
            <Box
              sx={{
                width: 4,
                height: 28,
                bgcolor: "primary.main",
                borderRadius: 1,
              }}
            />
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Professional Summary
            </Typography>
          </Box>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ lineHeight: 1.8, display: "block" }}
          >
            {resumeData.summary}
          </Typography>
        </Paper>

        {/* Experience */}
        <Paper className="resume-section" sx={{ p: { xs: 3, md: 4 }, mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
            <Box
              sx={{
                width: 4,
                height: 28,
                bgcolor: "primary.main",
                borderRadius: 1,
              }}
            />
            <Work sx={{ color: "primary.main" }} />
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Experience
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {resumeData.experience.map((exp, ei) => (
              <Box key={ei}>
                {/* Company Header */}
                <Box
                  sx={{
                    borderLeft: "3px solid",
                    borderColor: "primary.main",
                    pl: 2,
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {exp.company}
                  </Typography>
                  {exp.companyNote && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontStyle: "italic", display: "block" }}
                    >
                      {exp.companyNote}
                    </Typography>
                  )}
                  <Typography variant="body2" color="text.secondary" sx={{ display: "block" }}>
                    {exp.location}
                  </Typography>
                </Box>

                {/* Roles */}
                <Box sx={{ pl: 2, display: "flex", flexDirection: "column", gap: 2.5 }}>
                  {exp.roles.map((role, ri) => (
                    <Box key={ri}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          flexWrap: "wrap",
                          gap: 0.5,
                          mb: 1,
                        }}
                      >
                        <Box>
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 600, display: "block" }}
                          >
                            {role.title}
                          </Typography>
                          {role.type && (
                            <Chip
                              label={role.type}
                              size="small"
                              variant="outlined"
                              sx={{ mt: 0.5, height: 20, fontSize: "0.7rem" }}
                            />
                          )}
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            fontStyle: "italic",
                            whiteSpace: "nowrap",
                            display: "block",
                          }}
                        >
                          {role.startDate} – {role.endDate}
                        </Typography>
                      </Box>
                      <Box
                        component="ul"
                        sx={{ m: 0, pl: 2.5, display: "flex", flexDirection: "column", gap: 0.5 }}
                      >
                        {role.bullets.map((bullet, bi) => (
                          <Typography
                            key={bi}
                            component="li"
                            variant="body2"
                            color="text.secondary"
                            sx={{ lineHeight: 1.7 }}
                          >
                            {bullet}
                          </Typography>
                        ))}
                      </Box>
                    </Box>
                  ))}
                </Box>

                {ei < resumeData.experience.length - 1 && (
                  <Divider sx={{ mt: 3 }} />
                )}
              </Box>
            ))}
          </Box>
        </Paper>

        {/* Skills */}
        <Paper className="resume-section" sx={{ p: { xs: 3, md: 4 }, mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
            <Box
              sx={{
                width: 4,
                height: 28,
                bgcolor: "primary.main",
                borderRadius: 1,
              }}
            />
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Skills
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {resumeData.skills.map((cat) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={cat.category}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
                    height: "100%",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 700,
                      color: "primary.main",
                      mb: 1.5,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      display: "block",
                    }}
                  >
                    {cat.category}
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                    {cat.skills.map((skill) => (
                      <Chip
                        key={skill}
                        label={skill}
                        size="small"
                        sx={{
                          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                          color: "text.primary",
                          fontWeight: 500,
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Education */}
        <Paper className="resume-section" sx={{ p: { xs: 3, md: 4 }, mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
            <Box
              sx={{
                width: 4,
                height: 28,
                bgcolor: "primary.main",
                borderRadius: 1,
              }}
            />
            <School sx={{ color: "primary.main" }} />
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Education
            </Typography>
          </Box>
          {resumeData.education.map((edu, i) => (
            <Box
              key={i}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {edu.institution}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ display: "block" }}>
                  {edu.degree} — {edu.field}
                </Typography>
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontStyle: "italic", display: "block" }}
              >
                {edu.period}
              </Typography>
            </Box>
          ))}
        </Paper>

        {/* Leadership */}
        <Paper className="resume-section" sx={{ p: { xs: 3, md: 4 } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
            <Box
              sx={{
                width: 4,
                height: 28,
                bgcolor: "primary.main",
                borderRadius: 1,
              }}
            />
            <Groups sx={{ color: "primary.main" }} />
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Leadership & Volunteering
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {resumeData.leadership.map((item, i) => (
              <Box key={i}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: 0.5,
                    mb: 0.75,
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, display: "block" }}>
                      {item.role}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="primary.main"
                      sx={{ fontWeight: 600, display: "block" }}
                    >
                      {item.organization}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontStyle: "italic", display: "block" }}
                  >
                    {item.period}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ lineHeight: 1.7, display: "block" }}
                >
                  {item.description}
                </Typography>
                {i < resumeData.leadership.length - 1 && <Divider sx={{ mt: 2 }} />}
              </Box>
            ))}
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default Resume;
