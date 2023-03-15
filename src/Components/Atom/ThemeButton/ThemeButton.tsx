import { DarkMode, LightMode } from "@mui/icons-material";
import { Fab, FabProps } from "@mui/material";

type ThemeButtonProps = FabProps & {
  isDarkTheme: boolean;
  toggleTheme: () => void;
};

const ThemeButtonIcon = (props: { isDarkTheme: boolean }) => {
  return props.isDarkTheme ? <DarkMode /> : <LightMode />;
};

const ThemeButton = (props: ThemeButtonProps): JSX.Element => {
  const { isDarkTheme, toggleTheme, ...rest } = props;
  return (
    <Fab
      onClick={toggleTheme}
      color={isDarkTheme ? "primary" : "secondary"}
      {...rest}
    >
      <ThemeButtonIcon isDarkTheme={isDarkTheme} />
    </Fab>
  );
};

export default ThemeButton;
