import useMediaQuery from "@mui/material/useMediaQuery";
import React, { createContext, useState } from "react";

interface Props {
  children: React.ReactNode;
}

export const ThemeContext = createContext({
  isDarkTheme: false,
  toggleTheme: () => {},
});

const ThemeProvider: React.FC<Props> = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(
    useMediaQuery("(prefers-color-scheme: dark)")
  );

  const toggleTheme = (): void => {
    setIsDarkTheme(!isDarkTheme);
  };

  return (
    <ThemeContext.Provider value={{ isDarkTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
