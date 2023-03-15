import React, { useContext } from "react";
import ThemeProvider, { ThemeContext } from "./DarkModeContext";
import { Theme } from "@mui/system";
import { darkTheme, lightTheme } from "../theme/theme";
// import ScrollToProvider from "./ScrollToComponentContext";

interface Props {
  children: React.ReactNode;
}

const AppProvider: React.FC<Props> = ({ children }) => {
  const { isDarkTheme } = useContext(ThemeContext);

  var theme: Theme = isDarkTheme ? darkTheme : lightTheme;
  return <ThemeProvider>{children}</ThemeProvider>;
};

export default AppProvider;
