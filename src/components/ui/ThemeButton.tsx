import { DarkMode, LightMode } from "@mui/icons-material";
import { IconButton, IconButtonProps } from "@mui/material";
import React from "react";

type ThemeButtonProps = Omit<IconButtonProps, "onClick"> & {
  isDarkTheme: boolean;
  toggleTheme: () => void;
};

const ThemeButton = (props: ThemeButtonProps): React.JSX.Element => {
  const { isDarkTheme, toggleTheme, ...rest } = props;
  return (
    <IconButton
      onClick={toggleTheme}
      sx={{
        color: "inherit",
        ...rest.sx,
      }}
      {...rest}
    >
      {isDarkTheme ? <LightMode /> : <DarkMode />}
    </IconButton>
  );
};

export default ThemeButton;
