import { createTheme, ThemeOptions, Theme } from "@mui/material/styles";
import "./fonts.css";

// Extend MUI theme types for custom palette tokens
declare module "@mui/material/styles" {
  interface Palette {
    gradient: {
      forest: string;
      ocean: string;
      sunset: string;
    };
    overlay: {
      light: string;
      dark: string;
    };
    social: {
      github: string;
      linkedin: string;
    };
  }
  interface PaletteOptions {
    gradient?: {
      forest?: string;
      ocean?: string;
      sunset?: string;
    };
    overlay?: {
      light?: string;
      dark?: string;
    };
    social?: {
      github?: string;
      linkedin?: string;
    };
  }
}

// Extend Chip component types for custom variant
declare module "@mui/material/Chip" {
  interface ChipPropsVariantOverrides {
    technology: true;
  }
}

/**
 * ISSUE: Type safety
 * FIX: Cast sharedTheme as ThemeOptions for proper TypeScript validation
 * MUI v7: Use proper typing to catch configuration errors at compile time
 */
// TODO: Type sharedTheme as ThemeOptions for better type safety
const sharedTheme = {
  mixins: {
    toolbar: {
      minHeight: 48,
    },
  },
  shape: {
    borderRadius: 12, // Centralized border radius token
  },
  components: {
    /**
     * ISSUE: Accessibility violation - All headings map to h2, flattening document structure
     * FIX: Use semantic HTML hierarchy: h1->h1, h2->h2, h3->h3, etc.
     * MUI v7: variantMapping should maintain semantic heading levels for screen readers and SEO
     * IMPACT: Screen readers cannot navigate document outline properly
     */
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          h1: "h1",
          h2: "h2",
          h3: "h3",
          h4: "h4",
          h5: "h5",
          h6: "h6",
          subtitle1: "h2",
          subtitle2: "h2",
          body1: "span",
          body2: "span",
        },
      },
    },
    /**
     * ISSUE: Magic numbers - Hardcoded borderRadius values repeated across components
     * FIX: Define theme.shape.borderRadius = 12, use theme.shape.borderRadius in styleOverrides
     * MUI v7: Centralize design tokens in theme configuration, not component overrides
     * PATTERN: theme.shape.borderRadius can be overridden per component if needed
     */
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          textTransform: "none",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.15)",
          },
        },
      },
    },
    MuiChip: {
      variants: [
        {
          props: { variant: "technology" as const },
          style: ({ theme }: { theme: Theme }) => ({
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            fontWeight: 500,
          }),
        },
      ],
    },
  },
  typography: {
    /**
     * ISSUE 1: Non-standard base fontSize breaks rem calculations across MUI
     * FIX: Use default 14px or adjust all components expecting standard sizing
     * MUI v7: fontSize 12 causes misalignment with default spacing/sizing (based on 14px)
     *
     * ISSUE 2: No responsive typography
     * FIX: Use theme.breakpoints with responsiveFontSizes() or manual breakpoint scales
     * MUI v7: Theme should define typography behavior across viewport sizes
     *
     * ISSUE 3: Mixing px and rem without clear strategy
     * FIX: Standardize on rem units, adjust htmlFontSize for base scaling
     * PATTERN: htmlFontSize: 10 makes 1rem = 10px for easy mental math
     */
    // TODO: Use rem units consistently instead of mixing rem with base fontSize of 12
    // MUI best practice: Keep default 14px base and scale with rem units
    // TODO: Consider adding responsive typography with theme.breakpoints
    fontSize: 12, // smaller font size
    fontFamily: [
      "BC Sans",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    /**
     * ISSUE: Custom font family with no fallback validation
     * FIX: Ensure GreatForest is loaded before usage, or provide better fallback
     * MUI v7: Custom fonts should be registered in theme.typography.fontFamily first
     * PATTERN: Define fontFamily hierarchy in base typography, reference in variants
     */
    h1: {
      fontFamily: "GreatForest, sans-serif",
      fontWeight: 400,
      fontSize: "3rem",
      lineHeight: 1.2,
      letterSpacing: "0.02em",
    },
    h2: {
      fontFamily: "GreatForest, sans-serif",
      fontWeight: 400,
      fontSize: "2.5rem",
      lineHeight: 1.3,
      letterSpacing: "0.02em",
    },
    h3: {
      fontWeight: 400,
      fontSize: "2rem",
      lineHeight: 1.3,
      letterSpacing: "0.02em",
    },
    h4: {
      fontWeight: 400,
      fontSize: "1.75rem",
      lineHeight: 1.4,
      letterSpacing: "0.02em",
    },
    h5: {
      fontWeight: 400,
      fontSize: "1.5rem",
      lineHeight: 1.4,
      letterSpacing: "0.02em",
    },
    h6: {
      fontWeight: 400,
      fontSize: "1.25rem",
      lineHeight: 1.5,
      letterSpacing: "0.02em",
    },
  },
};

/**
 * ISSUE: Duplicate theme configuration - dark and light themes manually defined
 * FIX: Use single theme with palette.mode and CSS variables (cssVariables: true)
 * MUI v7: Modern approach uses one theme with dynamic color scheme switching
 * BENEFIT: Reduces bundle size, enables seamless theme transitions, better performance
 *
 * ISSUE: Manual light/dark palette definition without shared tokens
 * FIX: Use augmentColor() to auto-generate light/dark/contrastText from main
 * MUI v7: theme.palette.augmentColor ensures proper tonal offset and contrast ratios
 * PATTERN: Define semantic color tokens once, reuse across both themes
 */
export const darkTheme = createTheme({
  ...sharedTheme,
  palette: {
    /**
     * ISSUE: No semantic colors (error, warning, info, success) defined
     * FIX: Add full semantic palette for Alert, Chip, Button color variants
     * MUI v7: Components rely on semantic colors for consistent theming
     */
    primary: {
      main: "#00A3A1", // BC teal - inspired by coastal waters
      light: "#4DD4D2",
      dark: "#007573",
    },
    secondary: {
      main: "#F58634", // Warm orange - inspired by BC sunsets
      light: "#FFB770",
      dark: "#C25A00",
    },
    error: {
      main: "#C13B2D", // Autumn Red Maple
      light: "#D96459",
      dark: "#8B291F",
    },
    warning: {
      main: "#D97D28", // Golden Larch (fall colors)
      light: "#E69952",
      dark: "#A65A1C",
    },
    info: {
      main: "#4E8A99", // Mountain Lake Blue
      light: "#6BA3B1",
      dark: "#35606C",
    },
    success: {
      main: "#6B9C5A", // Spring Meadow
      light: "#8BB47C",
      dark: "#4A6D3E",
    },
    /**
     * ISSUE: Low contrast between background.default and background.paper
     * FIX: Increase contrast for elevation hierarchy (at least 10-15 lightness difference)
     * MUI v7: Proper elevation shadow requires distinguishable background tones
     * WCAG: Aim for 3:1 minimum contrast for UI component distinction
     */
    background: {
      default: "#1a1a1a", // Dark background
      paper: "#242424", // Slightly lighter for cards/papers
    },
    gradient: {
      forest: "linear-gradient(135deg, #2C5530 0%, #4A7C59 100%)",
      ocean: "linear-gradient(135deg, #5C9EAD 0%, #3D6B7D 100%)",
      sunset: "linear-gradient(135deg, #D97D28 0%, #C13B2D 100%)",
    },
    overlay: {
      light: "rgba(245, 247, 245, 0.75)",
      dark: "rgba(42, 42, 42, 0.75)",
    },
    social: {
      github: "#333",
      linkedin: "#0077b5",
    },
    mode: "dark",
  },
});

export const lightTheme = createTheme({
  ...sharedTheme,
  palette: {
    primary: {
      main: "#00897B", // Forest green/teal - BC nature
      light: "#4EBAAA",
      dark: "#005B4F",
    },
    secondary: {
      main: "#FF6F3C", // Vibrant orange - BC outdoor adventure
      light: "#FFA270",
      dark: "#C53D0A",
    },
    error: {
      main: "#C13B2D",
      light: "#D96459",
      dark: "#8B291F",
    },
    warning: {
      main: "#D97D28",
      light: "#E69952",
      dark: "#A65A1C",
    },
    info: {
      main: "#4E8A99",
      light: "#6BA3B1",
      dark: "#35606C",
    },
    success: {
      main: "#6B9C5A",
      light: "#8BB47C",
      dark: "#4A6D3E",
    },
    background: {
      default: "#f8f9fa", // Subtle off-white background
      paper: "#ffffff", // White for cards/papers
    },
    gradient: {
      forest: "linear-gradient(135deg, #2C5530 0%, #4A7C59 100%)",
      ocean: "linear-gradient(135deg, #5C9EAD 0%, #3D6B7D 100%)",
      sunset: "linear-gradient(135deg, #D97D28 0%, #C13B2D 100%)",
    },
    overlay: {
      light: "rgba(245, 247, 245, 0.75)",
      dark: "rgba(42, 42, 42, 0.75)",
    },
    social: {
      github: "#333",
      linkedin: "#0077b5",
    },
    mode: "light",
  },
});
