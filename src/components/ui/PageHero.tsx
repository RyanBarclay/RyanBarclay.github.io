import { Box, Container, Typography } from "@mui/material";
import { HERO_VARIANTS, HeroVariant } from "../../config/constants";

/**
 * PageHero component displays a full-width hero section with background image and gradient overlay.
 * @param title - Main heading text
 * @param subtitle - Optional subheading text
 * @param backgroundImage - Custom background image URL (overrides variant default)
 * @param gradientOverlay - Custom gradient overlay (overrides variant default)
 * @param variant - Predefined style variant: 'default' | 'project' | 'dark'
 */
interface PageHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  gradientOverlay?: string;
  variant?: HeroVariant;
}

const PageHero = ({
  title,
  subtitle,
  backgroundImage,
  gradientOverlay,
  variant = "default",
}: PageHeroProps) => {
  const variantConfig = HERO_VARIANTS[variant];
  const finalBackgroundImage = backgroundImage || variantConfig.backgroundImage;
  const finalGradientOverlay = gradientOverlay || variantConfig.gradientOverlay;
  return (
    <Box
      sx={{
        position: "relative",
        height: { xs: "30vh", md: "40vh" },
        width: "100%",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: -10,
        mb: 4,
      }}
    >
      {/* Background Image */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          backgroundImage: `url(${finalBackgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Gradient Overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: finalGradientOverlay,
          zIndex: 1,
        }}
      />

      {/* Content */}
      <Container
        sx={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          color: "white",
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="h5"
            sx={{
              fontWeight: 300,
              textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Container>
    </Box>
  );
};

export default PageHero;
