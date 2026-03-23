import React from "react";
import { Route, Routes } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import componentLinkInfo from "../../config/routes";
import { generateProjectRoutes } from "../../config/projectRoutes";
import { NAVBAR_HEIGHT_WITH_PADDING } from "../../config/constants";

const projectRoutesFallback = (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "60vh",
    }}
  >
    <CircularProgress />
  </Box>
);

const MainContent = (): React.JSX.Element => {
  const projectRoutes = generateProjectRoutes();

  return (
    <Box sx={{ pt: `${NAVBAR_HEIGHT_WITH_PADDING}px` }}>
      <Routes>
        {/* Top-level routes from config */}
        {Object.entries(componentLinkInfo).map(([key, { to, component }]) => (
          <Route path={to} element={component} key={key} />
        ))}

        {/* Auto-generated project routes */}
        {projectRoutes.map(({ path, element, key }) => (
          <Route
            path={path}
            element={
              <React.Suspense fallback={projectRoutesFallback}>
                {element}
              </React.Suspense>
            }
            key={key}
          />
        ))}
      </Routes>
    </Box>
  );
};

export default MainContent;
