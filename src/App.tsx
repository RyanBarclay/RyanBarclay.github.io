import { Box, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { useContext } from "react";
import { HashRouter } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import MainContent from "./components/layout/MainContent";
import { ThemeContext } from "./contexts/DarkModeContext";
import { darkTheme, lightTheme } from "./theme/theme";

function App() {
  const { isDarkTheme } = useContext(ThemeContext);

  return (
    <HashRouter>
      <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
        <CssBaseline />
        <Navbar />
        <MainContent />
      </ThemeProvider>
    </HashRouter>
  );
}

export default App;
