import { DarkMode, LightMode } from "@mui/icons-material";
import { Fab } from "@mui/material";

const ThemeButtonIcon = (props: { isDarkTheme: boolean }) => {
  return props.isDarkTheme ? <DarkMode /> : <LightMode />;
};

const ThemeButton = (props: {
  isDarkTheme: boolean;
  toggleTheme: () => void;
}): JSX.Element => {
  return (
    <Fab
      onClick={() => {
        props.toggleTheme();
      }}
    >
      <ThemeButtonIcon isDarkTheme={props.isDarkTheme} />
    </Fab>
  );
};

export default ThemeButton;
