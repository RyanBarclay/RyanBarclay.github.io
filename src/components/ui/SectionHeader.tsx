import { Box, Typography } from "@mui/material";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

const SectionHeader = ({ title, subtitle }: SectionHeaderProps) => (
  <Box sx={{ textAlign: "center", mb: 6 }}>
    <Typography
      variant="h3"
      sx={{
        display: "inline-block",
        borderBottom: "3px solid",
        borderColor: "primary.main",
        pb: 1,
        mb: subtitle ? 2 : 0,
      }}
    >
      {title}
    </Typography>
    {subtitle && (
      <Typography
        variant="body1"
        sx={{
          color: "text.secondary",
          maxWidth: "800px",
          mx: "auto",
          display: "block",
        }}
      >
        {subtitle}
      </Typography>
    )}
  </Box>
);

export default SectionHeader;
