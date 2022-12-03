import React, { useContext } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { darkTheme, lightTheme } from "./theme/theme";
import { Box, CssBaseline } from "@mui/material";
import { ThemeContext } from "./Context/DarkModeContext";
import LeftSide from "./Components/Molecule/SideBar/LeftSide";

function App() {
  const { isDarkTheme } = useContext(ThemeContext);
  return (
    <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
      <CssBaseline />
      <Box sx={{ display: "flex", gap: "10%" }}>
        <LeftSide />
        {/* <Content /> */}
      </Box>
    </ThemeProvider>
  );
}

export default App;
