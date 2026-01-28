import React from "react";
import { Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";
import componentLinkInfo from "../../config/routes";
import { generateProjectRoutes } from "../../config/projectRoutes";

const MainContent = (): React.JSX.Element => {
  const projectRoutes = generateProjectRoutes();

  return (
    <Box sx={{ pt: "80px" }}>
      <Routes>
        {/* Top-level routes from config */}
        {Object.entries(componentLinkInfo).map(([key, { to, component }]) => (
          <Route path={to} element={component} key={key} />
        ))}

        {/* Auto-generated project routes */}
        {projectRoutes.map(({ path, element, key }) => (
          <Route path={path} element={element} key={key} />
        ))}
      </Routes>
    </Box>
  );
};

export default MainContent;
