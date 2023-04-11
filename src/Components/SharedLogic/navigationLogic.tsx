import {
  AlternateEmail,
  Build,
  HistoryEdu,
  HistoryEduRounded,
  Home,
  Info,
} from "@mui/icons-material";
import { Paper } from "@mui/material";
import NBodySimulation from "../Molecule/NBody-Simulation/NBodySimulation";

export interface ComponentLinkInfo {
  [key: string]: {
    label: string;
    icon?: JSX.Element;
    to?: string;
    childListItems?: ComponentLinkInfo;
    component?: JSX.Element;
  } & (
    | { to: string; component: JSX.Element; childListItems?: never }
    | { to?: never; component?: never; childListItems: ComponentLinkInfo }
  );
}

const componentLinkInfo: ComponentLinkInfo = {
  Home: {
    to: "/",
    label: "Home",
    icon: <Home />,
    component: <Home />,
  },
  About: {
    to: "/about",
    label: "About Me",
    icon: <Info />,
    component: <Info />,
  },
  Resume: {
    to: "/resume",
    label: "Resume",
    icon: <HistoryEdu />,
    component: <HistoryEdu />,
  },
  Projects: {
    label: "Projects",
    icon: <Build />,
    childListItems: {
      Overview: {
        label: "Overview",
        to: "/projects",
        component: <Build />,
      },
      NBodySimulation: {
        label: "N-Body Simulation",
        to: "/projects/NBodySimulation",
        component: <NBodySimulation />,
      },
    },
  },
  Contact: {
    to: "/contact",
    label: "Contact Me",
    icon: <AlternateEmail />,
    component: <AlternateEmail />,
  },
};

export const findPathToKey = (
  to: string,
  obj = componentLinkInfo
): string[] => {
  const result: string[] = [];

  const traverse = (node: ComponentLinkInfo, parentPath: string): boolean => {
    for (const [key, value] of Object.entries(node)) {
      const path = parentPath ? parentPath + key : key;
      if (value.to === to) {
        result.push(path);
        return true;
      } else if (value.childListItems) {
        if (traverse(value.childListItems, path)) {
          result.push(path);
          return true;
        }
      }
    }
    return false;
  };

  traverse(obj, "");

  return result;
};

export default componentLinkInfo;
