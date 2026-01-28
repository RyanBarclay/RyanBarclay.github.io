import React from "react";
import BattlesnakeProject from "../pages/projects/battlesnake";
import SpookathonProject from "../pages/projects/spookathon";
import PersonalServer from "../pages/projects/personal-server";
import JSChallenge from "../pages/projects/js-challenge";
import NBodyProject from "../pages/projects/nbody-simulation";
import Randomizer from "../pages/projects/randomizer/Randomizer";

/**
 * Centralized project route configuration
 * Maps project IDs to their component implementations
 */
export const projectRouteComponents: Record<string, React.ReactElement> = {
  randomizer: <Randomizer />,
  "nbody-simulation": <NBodyProject />,
  battlesnake: <BattlesnakeProject />,
  spookathon: <SpookathonProject />,
  "personal-server": <PersonalServer />,
  "js-challenge": <JSChallenge />,
};

/**
 * Generate project routes from projectsData
 * This ensures routes stay in sync with project data
 */
export const generateProjectRoutes = () => {
  return Object.entries(projectRouteComponents).map(([id, component]) => ({
    path: `/projects/${id}`,
    element: component,
    key: id,
  }));
};
