import { createTheme } from "@mui/material/styles";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#7b5800",
    },
    secondary: {
      main: "#6c5c41",
    },
    background: {
      default: "#1E1B16",
    },
  },
});

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#7b5800",
    },
    secondary: {
      main: "#6c5c41",
    },
    background: {
      default: "#FFFBFF",
    },
  },
});
