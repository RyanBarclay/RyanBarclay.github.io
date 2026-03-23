import {
  AlternateEmail,
  Build,
  HistoryEdu,
  Home as HomeIcon,
  Info,
} from "@mui/icons-material";
import Projects from "../pages/projects/index";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Home from "../pages/Home";
import Resume from "../pages/Resume";

export interface ComponentLinkInfo {
  [key: string]: {
    label: string;
    icon?: React.JSX.Element;
    to: string;
    component: React.JSX.Element;
  };
}

const componentLinkInfo: ComponentLinkInfo = {
  Home: {
    to: "/",
    label: "Home",
    icon: <HomeIcon />,
    component: <Home />,
  },
  Projects: {
    to: "/projects",
    label: "Projects",
    icon: <Build />,
    component: <Projects />,
  },
  Resume: {
    to: "/resume",
    label: "Resume",
    icon: <HistoryEdu />,
    component: <Resume />,
  },
  About: {
    to: "/about",
    label: "About",
    icon: <Info />,
    component: <About />,
  },
};

export const findPathToKey = (
  to: string,
  obj = componentLinkInfo,
): string | null => {
  for (const [key, value] of Object.entries(obj)) {
    if (value.to === to) {
      return key;
    }
  }
  return null;
};

export default componentLinkInfo;
