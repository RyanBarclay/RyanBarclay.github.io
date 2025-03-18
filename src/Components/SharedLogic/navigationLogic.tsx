import {
  AlternateEmail,
  Build,
  HistoryEdu,
  Home as HomeIcon,
  Info,
} from "@mui/icons-material";
import Projects from "../Molecule/Projects/Projects";
import BattlesnakeProject from "../Molecule/Projects/BattlesnakeProject";
import SpookathonProject from "../Molecule/Projects/SpookathonProject";
import PersonalServer from "../Molecule/Projects/PersonalServer";
import JSChallenge from "../Molecule/Projects/JSChallenge";
import About from "../Molecule/About/About";
import Contact from "../Molecule/Contact/Contact";
import Home from "../Molecule/Home/Home";
import NBodyProject from "../Molecule/Projects/NBodyProject";
import Randomizer from "../Molecule/Randomizer/Randomizer";

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
    icon: <HomeIcon />,
    component: <Home />,
  },
  About: {
    to: "/about",
    label: "About Me",
    icon: <Info />,
    component: <About />,
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
        component: <Projects />,
      },
      Randomizer: {
        label: "Randomizer",
        to: "/projects/randomizer",
        component: <Randomizer />,
      },
      NBodySimulation: {
        label: "N-Body Simulation",
        to: "/projects/NBodySimulation",
        component: <NBodyProject />,
      },

      Battlesnake: {
        label: "Battlesnake 2019",
        to: "/projects/battlesnake",
        component: <BattlesnakeProject />,
      },
      Spookathon: {
        label: "Spookathon 2019",
        to: "/projects/spookathon",
        component: <SpookathonProject />,
      },
      PersonalServer: {
        label: "Personal Server",
        to: "/projects/personal-server",
        component: <PersonalServer />,
      },
      JSChallenge: {
        label: "21 Day JS Challenge",
        to: "/projects/js-challenge",
        component: <JSChallenge />,
      },
    },
  },
  Contact: {
    to: "/contact",
    label: "Contact Me",
    icon: <AlternateEmail />,
    component: <Contact />,
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
