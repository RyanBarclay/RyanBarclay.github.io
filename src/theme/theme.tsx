import { createTheme } from "@mui/material/styles";

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
    fontSize: 12, // smaller font size
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
