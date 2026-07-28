import { Box, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { ReactNode } from "react";

interface FeatureIconBoxProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const FeatureIconBox = ({ icon, title, description }: FeatureIconBoxProps) => {
  const theme = useTheme();
  return (
    <Box>
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: 2,
          bgcolor: alpha(theme.palette.primary.main, 0.15),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
        }}
      >
        {icon}
      </Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Box>
  );
};

export default FeatureIconBox;
