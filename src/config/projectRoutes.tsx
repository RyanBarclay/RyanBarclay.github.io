import React from "react";
import type { ProjectId } from "../data/projects";

/**
 * Centralized project route configuration
 * Maps project IDs to their lazy-loaded component implementations
 */
export const projectRouteComponents: Record<
  ProjectId,
  React.LazyExoticComponent<React.ComponentType>
> = {
  randomizer: React.lazy(
    () => import("../pages/projects/Randomizer/Randomizer")
  ),
  "nbody-simulation": React.lazy(
    () => import("../pages/projects/nbody-simulation")
  ),
  "terrain-generator": React.lazy(
    () => import("../pages/projects/terrain-generator")
  ),
  battlesnake: React.lazy(() => import("../pages/projects/battlesnake")),
  spookathon: React.lazy(() => import("../pages/projects/spookathon")),
  "personal-server": React.lazy(
    () => import("../pages/projects/personal-server")
  ),
  "js-challenge": React.lazy(() => import("../pages/projects/js-challenge")),
};

/**
 * Generate project routes from projectsData
 * This ensures routes stay in sync with project data
 */
export const generateProjectRoutes = () => {
  return Object.entries(projectRouteComponents).map(([id, Component]) => ({
    path: `/projects/${id}`,
    element: <Component />,
    key: id,
  }));
};
