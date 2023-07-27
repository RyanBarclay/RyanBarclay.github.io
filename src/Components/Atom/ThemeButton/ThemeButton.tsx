import { DarkMode, LightMode } from "@mui/icons-material";
import { Fab, FabProps } from "@mui/material";
import React from "react";

type ThemeButtonProps = FabProps & {
  isDarkTheme: boolean;
  toggleTheme: () => void;
};

const ThemeButtonIcon = (props: { isDarkTheme: boolean }) => {
  return props.isDarkTheme ? <LightMode /> : <DarkMode />;
};

const ThemeButton = (props: ThemeButtonProps): JSX.Element => {
  const { isDarkTheme, toggleTheme, ...rest } = props;
  return (
    <Fab onClick={toggleTheme} {...rest}>
      <ThemeButtonIcon isDarkTheme={isDarkTheme} />
    </Fab>
  );
};

export default ThemeButton;
