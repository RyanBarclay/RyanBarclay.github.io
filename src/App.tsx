import { Box, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { useContext } from "react";
import { BrowserRouter } from "react-router-dom";
import RightSide from "./Components/Molecule/RightSide/RightSide";
import LeftSide from "./Components/Molecule/SideBar/LeftSide/LeftSide";
import { ThemeContext } from "./Context/DarkModeContext";
import { darkTheme, lightTheme } from "./theme/theme";

function App() {
  const { isDarkTheme } = useContext(ThemeContext);
  return (
    <BrowserRouter>
      <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
        <CssBaseline />
        <Box sx={{ display: "flex", height: "100vh" }}>
          <LeftSide />
          <RightSide />
        </Box>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
