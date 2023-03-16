import { List, Paper } from "@mui/material";
import { useContext, useMemo } from "react";
import { ThemeContext } from "../../../Context/DarkModeContext";
import { NavigationContext } from "../../../Context/NavigationContext";
import ThemeButton from "../../Atom/ThemeButton/ThemeButton";
import componentLinkInfo from "../SharedLogic/navigationLogic";
import { makeTree } from "./navigationUtils";

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
    <Paper
      variant="outlined"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: " 10vh",
        width: "auto",
        height: "100%",
        alignItems: "center",
        paddingTop: "20px",
      }}
    >
      <ThemeButton
        isDarkTheme={isDarkTheme}
        toggleTheme={toggleTheme}
        sx={{
          borderRadius: "50rem",
          width: "-webkit-fill-available",
          margin: "12px 24px",
        }}
      />
      <List>{ListItems}</List>
    </Paper>
  );
};

export default LeftSide;
