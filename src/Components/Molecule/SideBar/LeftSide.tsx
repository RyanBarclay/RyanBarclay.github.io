import { Box, Drawer, List, ListItem } from "@mui/material";
import { useContext } from "react";
import { ThemeContext } from "../../../Context/DarkModeContext";
import ThemeButton from "../../Atom/ThemeButton/ThemeButton";

const LeftSide = (): JSX.Element => {
  const { isDarkTheme, toggleTheme } = useContext(ThemeContext);
  return (
    <Drawer variant="permanent">
      <Box sx={{ display: "flex", flexDirection: "column", gap: " 10vh" }}>
        <ThemeButton isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} />
        <List>
          <ListItem>test</ListItem>
          <ListItem>test</ListItem>
          <ListItem>test</ListItem>
          <ListItem>test</ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default LeftSide;
