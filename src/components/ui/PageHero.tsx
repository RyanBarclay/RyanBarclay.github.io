import { Box, Container, Typography } from "@mui/material";
import { HERO_VARIANTS, HeroVariant } from "../../config/constants";

/**
 * ISSUE: Props interface lacks JSDoc documentation
 * FIX: Add JSDoc comments for each prop explaining purpose and usage
 * FE Best Practice: Document component APIs for better developer experience
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
        /**
         * ISSUE: Hardcoded height values (40vh, -80px) not responsive
         * FIX: Use theme.spacing for margins, responsive height with breakpoints
         * MUI v7: { height: { xs: '30vh', md: '40vh' }, marginTop: -10 }
         * PATTERN: All spacing should use theme.spacing() multiplier
         */
        position: "relative",
        height: "40vh",
        width: "100%",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "-80px",
        mb: 4,
      }}
    >
      {/* Background Image */}
      {/**
       * ISSUE: Repeated Box pattern for background/overlay layers
       * FIX: Create styled components: HeroBackground, HeroOverlay, HeroContent
       * MUI v7: Reduces duplication and improves readability
       * FE Best Practice: Named components are easier to test and maintain
       */}
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
            /**
             * ISSUE: Inline styles overriding theme typography
             * FIX: Define hero-specific typography variant in theme
             * MUI v7: theme.typography.heroTitle = { fontWeight: 700, ... }
             * PATTERN: Use variant="heroTitle" instead of sx overrides
             */
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
