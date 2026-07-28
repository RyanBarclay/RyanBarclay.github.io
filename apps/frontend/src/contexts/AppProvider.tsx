import React from "react";
import ThemeProvider from "./DarkModeContext";
import NavigationProvider from "./NavigationContext";

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
