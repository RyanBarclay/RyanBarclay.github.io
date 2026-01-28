import React from "react";
import { Route, Routes } from "react-router-dom";
import componentLinkInfo from "../../config/routes";
import BattlesnakeProject from "../../pages/projects/BattlesnakeProject";
import SpookathonProject from "../../pages/projects/SpookathonProject";
import PersonalServer from "../../pages/projects/PersonalServer";
import JSChallenge from "../../pages/projects/JSChallenge";
import NBodyProject from "../../pages/projects/NBodyProject";
import Randomizer from "../../pages/projects/Randomizer/Randomizer";

const MainContent = (): React.JSX.Element => {
  return (
    <Routes>
      {/* Top-level routes from config */}
      {Object.entries(componentLinkInfo).map(([key, { to, component }]) => (
        <Route path={to} element={component} key={key} />
      ))}

      {/* Nested project routes */}
      <Route path="/projects/randomizer" element={<Randomizer />} />
      <Route path="/projects/NBodySimulation" element={<NBodyProject />} />
      <Route path="/projects/battlesnake" element={<BattlesnakeProject />} />
      <Route path="/projects/spookathon" element={<SpookathonProject />} />
      <Route path="/projects/personal-server" element={<PersonalServer />} />
      <Route path="/projects/js-challenge" element={<JSChallenge />} />
    </Routes>
  );
};

export default MainContent;
