import { Drawer, List, Paper, Typography } from "@mui/material";
import React, { useContext, useMemo } from "react";
import { ThemeContext } from "../../../contexts/DarkModeContext";
import { NavigationContext } from "../../../contexts/NavigationContext";
import ThemeButton from "../../Atom/ThemeButton/ThemeButton";
import componentLinkInfo from "../../SharedLogic/navigationLogic";
import { makeTree } from "./navigationUtils";

const widthNum = 20;
export const maxDrawerWidth: string = widthNum + "vw";

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
          paddingX: widthNum * 0.1 + "vw",
          gap: "10vh",
          maxWidth: maxDrawerWidth,
          alignItems: "center",
        },
      }}
    >
      <ThemeButton
        isDarkTheme={isDarkTheme}
        toggleTheme={toggleTheme}
        sx={{
          borderRadius: "50rem",
          width: "-webkit-fill-available",
          marginTop: "5vh",
        }}
      />
      <Paper
        sx={{
          display: "flex",
          alignContent: "center",
          flexDirection: "column",
          position: "sticky",
          top: 0,
          width: "100%",
          zIndex: 20,
        }}
        elevation={0}
      >
        <Typography align="center" variant="h6">
          Ryan Barclay's
        </Typography>
        <Typography align="center">Portfolio</Typography>
      </Paper>
      <List>{ListItems}</List>
    </Drawer>
  );
};

export default LeftSide;
