import { createTheme, ThemeOptions } from "@mui/material/styles";

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
      fontWeight: 400,
      fontSize: "3rem",
      lineHeight: 1.2,
      letterSpacing: "0.02em",
    },
    h2: {
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
      main: "#BB86FC",
      light: "#EE99FF",
      dark: "#3700B3",
    },
    secondary: {
      main: "#03DAC6",
      light: "#BFFAF3",
      dark: "#018786",
    },
    mode: "dark",
  },
});

export const lightTheme = createTheme({
  ...sharedTheme,
  palette: {
    primary: {
      main: "#6200EE",
      light: "#9D4EDD",
      dark: "#3700B3",
    },
    secondary: {
      main: "#03DAC6",
      light: "#BFFAF3",
      dark: "#018786",
    },
    mode: "light",
  },
});
