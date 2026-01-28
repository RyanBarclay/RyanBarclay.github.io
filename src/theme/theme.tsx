import { createTheme, ThemeOptions } from "@mui/material/styles";
import "./fonts.css";

// TODO: Type sharedTheme as ThemeOptions for better type safety
const sharedTheme = {
  mixins: {
    toolbar: {
      minHeight: 48,
    },
  },
  components: {
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          h1: "h2",
          h2: "h2",
          h3: "h2",
          h4: "h2",
          h5: "h2",
          h6: "h2",
          subtitle1: "h2",
          subtitle2: "h2",
          body1: "span",
          body2: "span",
        },
      },
    },
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
        },
      },
    },
  },
  typography: {
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

export const darkTheme = createTheme({
  ...sharedTheme,
  palette: {
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
    background: {
      default: "#1a1a1a", // Dark background
      paper: "#242424", // Slightly lighter for cards/papers
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
    background: {
      default: "#f8f9fa", // Subtle off-white background
      paper: "#ffffff", // White for cards/papers
    },
    mode: "light",
  },
});
