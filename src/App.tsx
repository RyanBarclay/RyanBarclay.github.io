import { Box, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { useContext } from "react";
import { BrowserRouter, HashRouter } from "react-router-dom";
import RightSide from "./Components/Molecule/RightSide/RightSide";
import LeftSide from "./Components/Molecule/LeftSide/LeftSide";
import { ThemeContext } from "./Context/DarkModeContext";
import { darkTheme, lightTheme } from "./theme/theme";

function App() {
  const { isDarkTheme } = useContext(ThemeContext);

  return (
    <HashRouter>
      <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
          }}
        >
          <LeftSide />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: "2vh",
              alignItems: "center",
              width: "-webkit-fill-available",
              gap: "2vh",
            }}
          >
            <RightSide />
          </Box>
        </Box>
      </ThemeProvider>
    </HashRouter>
  );
}

export default App;
