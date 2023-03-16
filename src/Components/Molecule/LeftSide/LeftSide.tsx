import { Box, Drawer, List, Paper } from "@mui/material";
import { useContext, useMemo } from "react";
import { ThemeContext } from "../../../Context/DarkModeContext";
import { NavigationContext } from "../../../Context/NavigationContext";
import ThemeButton from "../../Atom/ThemeButton/ThemeButton";
import componentLinkInfo from "../SharedLogic/navigationLogic";
import { makeTree } from "./navigationUtils";

const drawerWidth = 200;

const LeftSide = (): JSX.Element => {
  const { isDarkTheme, toggleTheme } = useContext(ThemeContext);

  const { expandedItems, toggleExpandedItems, currentItem } =
    useContext(NavigationContext);

  const ListItems = useMemo(() => {
    return makeTree(
      componentLinkInfo,
      expandedItems,
      toggleExpandedItems,
      currentItem
    );
  }, [expandedItems, currentItem]);

  return (
    <Drawer
      variant="permanent"
      PaperProps={{
        sx: {
          display: "flex",
          flexDirection: "column",
          paddingTop: "5vh",
          width: drawerWidth,
          boxSizing: "border-box",
          alignItems: "center",
          gap: " 10vh",
        },
      }}
      sx={{ flexShrink: 0, width: drawerWidth }}
    >
      <ThemeButton
        isDarkTheme={isDarkTheme}
        toggleTheme={toggleTheme}
        sx={{
          borderRadius: "50rem",
          width: drawerWidth * 0.9,
        }}
      />
      <List>{ListItems}</List>
    </Drawer>
  );
};

export default LeftSide;
