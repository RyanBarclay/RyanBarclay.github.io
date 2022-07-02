import { Drawer, Fab, Paper, Tab, Tabs } from "@mui/material";
import {
  AlternateEmail,
  AttachFile,
  DarkModeOutlined,
  Handyman,
  Home,
  LightModeOutlined,
  Person,
  Science,
} from "@mui/icons-material";
import React from "react";
import styled from "@emotion/styled";

const StyledTabs = styled(Tabs)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  gap: 4px;
`;

const DrawerContent = styled(Paper)`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 100vh;
  top: 0; /* this is required for "sticky" to work */
  position: sticky;
`;

type Props = {
  darkMode: boolean;
  setDarkMode: (arg0: boolean) => void;
};

const NavigationRail = ({ darkMode, setDarkMode }: Props): JSX.Element => {
  const ToggleDarkmode = darkMode ? LightModeOutlined : DarkModeOutlined;
  return (
    // <Drawer variant="permanent">
    <DrawerContent>
      <Fab onClick={() => setDarkMode(!darkMode)}>
        <ToggleDarkmode />
      </Fab>
      <StyledTabs orientation="vertical">
        <Tab icon={<Home />} label="Home" />
        <Tab icon={<Person />} label="About" />
        <Tab icon={<AttachFile />} label="Resume" />
        <Tab icon={<Handyman />} label="Skills" />
        <Tab icon={<Science />} label="Projects" />
        <Tab icon={<AlternateEmail />} label="Contact" />
      </StyledTabs>
      <div />
    </DrawerContent>
    // </Drawer>
  );
};

export default NavigationRail;
