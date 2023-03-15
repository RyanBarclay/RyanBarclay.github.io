import {
  AlternateEmail,
  Build,
  HistoryEdu,
  Home,
  Info,
} from "@mui/icons-material";

export interface ComponentLinkInfo {
  [key: string]: {
    label: string;
    icon?: JSX.Element;
    to?: string;
    childListItems?: ComponentLinkInfo;
  } & (
    | { to: string; childListItems?: never }
    | { to?: never; childListItems: ComponentLinkInfo }
  );
}

const componentLinkInfo: ComponentLinkInfo = {
  Home: {
    to: "/",
    label: "Home",
    icon: <Home />,
  },
  About: {
    to: "/about",
    label: "About Me",
    icon: <Info />,
  },
  Resume: {
    to: "/resume",
    label: "Resume",
    icon: <HistoryEdu />,
  },
  Projects: {
    label: "Projects",
    icon: <Build />,
    childListItems: {
      Overview: {
        label: "Overview",
        to: "/projects",
      },
    },
  },
  Contact: {
    to: "/contact",
    label: "Contact Me",
    icon: <AlternateEmail />,
  },
};

export default componentLinkInfo;
