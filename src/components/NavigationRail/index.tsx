import { Drawer, Fab, Tab, Tabs } from "@mui/material";
import {
  AlternateEmail,
  AttachFile,
  DarkModeOutlined,
  Handyman,
  Home,
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

const DrawerContent = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 100%;
  height: 100%;
`;

const NavigationRail = (): JSX.Element => {
  return (
    <Drawer variant="permanent">
      <DrawerContent>
        <Fab>
          <DarkModeOutlined />
        </Fab>
        <StyledTabs orientation="vertical">
          <Tab icon={<Home />} label="Hello" />
          <Tab icon={<Person />} label="About" />
          <Tab icon={<AttachFile />} label="Resume" />
          <Tab icon={<Handyman />} label="Skills" />
          <Tab icon={<Science />} label="Projects" />
          <Tab icon={<AlternateEmail />} label="Contact" />
        </StyledTabs>
        <div />
      </DrawerContent>
    </Drawer>
  );
};

export default NavigationRail;
