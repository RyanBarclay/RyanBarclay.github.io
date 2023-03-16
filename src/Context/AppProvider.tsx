import React, { useContext } from "react";
import ThemeProvider, { ThemeContext } from "./DarkModeContext";
import { Theme } from "@mui/system";
import { darkTheme, lightTheme } from "../theme/theme";
import NavigationProvider from "./NavigationContext";
// import ScrollToProvider from "./ScrollToComponentContext";

interface Props {
  children: React.ReactNode;
}

const AppProvider: React.FC<Props> = ({ children }) => {
  return (
    <ThemeProvider>
      <NavigationProvider>{children}</NavigationProvider>
    </ThemeProvider>
  );
};

export default AppProvider;
