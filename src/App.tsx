import React, { useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import NavigationRail from "./components/NavigationRail";
import { ThemeProvider } from "@mui/material/styles";
import { darkTheme, lightTheme } from "./theme/theme";
import { CssBaseline } from "@mui/material";
import styled from "@emotion/styled";
import HomeComponent from "./components/HomeComponent";

const Page = styled.div`
  display: flex;
`;

const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 4;
  margin: 3vh;
`;

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [darkMode, setDarkMode] = useState(prefersDarkMode);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />

      <Page>
        <NavigationRail darkMode={darkMode} setDarkMode={setDarkMode} />
        <PageContent>
          <HomeComponent />
        </PageContent>
      </Page>
    </ThemeProvider>
  );
}

export default App;
