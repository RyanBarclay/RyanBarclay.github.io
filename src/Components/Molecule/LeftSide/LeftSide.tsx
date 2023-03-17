import { Drawer, List } from "@mui/material";
import { useContext, useMemo } from "react";
import { ThemeContext } from "../../../Context/DarkModeContext";
import { NavigationContext } from "../../../Context/NavigationContext";
import ThemeButton from "../../Atom/ThemeButton/ThemeButton";
import componentLinkInfo from "../SharedLogic/navigationLogic";
import { makeTree } from "./navigationUtils";

export const maxDrawerWidth = "20vw";

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
    <nav>
      <Drawer
        variant="permanent"
        PaperProps={{
          sx: {
            paddingTop: "5vh",
            gap: "10vh",
            maxWidth: maxDrawerWidth,
          },
        }}
      >
        <ThemeButton
          isDarkTheme={isDarkTheme}
          toggleTheme={toggleTheme}
          sx={{
            borderRadius: "50rem",
            width: "-webkit-fill-available",
            marginX: "2vw",
          }}
        />
        <List>{ListItems}</List>
      </Drawer>
    </nav>
  );
};

export default LeftSide;
