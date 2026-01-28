import { NavigationUrl } from "../hooks/useNavigation";

export interface ProjectSection {
  title: string;
  content: React.ReactNode;
}

export interface ProjectData {
  id: string;
  title: string;
  tag: string;
  tags: string[];
  description: string;
  technologies: string[];
  image: string;
  detailPage: NavigationUrl;
  featured?: boolean;
  sections?: ProjectSection[];
  links?: {
    github?: NavigationUrl;
    live?: NavigationUrl;
  };
  heroImage?: string;
  heroGradient?: string;
  year?: string;
}
