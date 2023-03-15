import { List, Paper } from "@mui/material";
import { useContext, useMemo, useState } from "react";
import { ThemeContext } from "../../../../Context/DarkModeContext";
import ThemeButton from "../../../Atom/ThemeButton/ThemeButton";
import componentLinkInfo from "../../../Logic/navigationLogic";
import { makeTree } from "./navigationUtils";

const LeftSide = (): JSX.Element => {
  const { isDarkTheme, toggleTheme } = useContext(ThemeContext);

  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const handleListItemClick = (id: string) => {
    if (expandedItems.includes(id)) {
      setExpandedItems(expandedItems.filter((item) => item !== id));
    } else {
      setExpandedItems([...expandedItems, id]);
    }
  };

  const ListItems = useMemo(() => {
    return makeTree(componentLinkInfo, expandedItems, handleListItemClick);
  }, [expandedItems]);

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
