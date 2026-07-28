import { Box, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { useContext, useEffect } from "react";
import { HashRouter, useLocation } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import MainContent from "./components/layout/MainContent";
import ScrollToTop from "./components/layout/ScrollToTop";
import { ThemeContext } from "./contexts/DarkModeContext";
import { capturePageview } from "./config/analytics";
import { darkTheme, lightTheme } from "./theme/theme";

/** Captures a PostHog pageview per HashRouter navigation (incl. the first). */
const AnalyticsPageviews = () => {
  const location = useLocation();
  useEffect(() => {
    capturePageview(location.pathname);
  }, [location.pathname]);
  return null;
};

function App() {
  const { isDarkTheme } = useContext(ThemeContext);

  return (
    <HashRouter>
      <AnalyticsPageviews />
      <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
        <CssBaseline />
        <ScrollToTop />
        <Navbar />
        <MainContent />
      </ThemeProvider>
    </HashRouter>
  );
}

export default App;
