import { ProjectData } from "../types/project";

export const projectsData: ProjectData[] = [
  {
    id: "randomizer",
    title: "Multi-Set Randomizer",
    tag: "TOOL",
    tags: ["React", "TypeScript", "Tool"],
    description:
      "A powerful web-based randomization tool for managing multiple item sets. Features drag-and-drop file upload, set management, customizable randomization options, and file export/import functionality. Perfect for creating random selections from multiple categories.",
    technologies: [
      "React",
      "TypeScript",
      "Material-UI",
      "Context API",
      "React-Dropzone",
    ],
    image:
      "https://images.unsplash.com/photo-1516849677043-ef67c9557e16?w=800&auto=format&fit=crop",
    detailPage: "/projects/randomizer",
    featured: true,
    year: "2024",
    links: {
      live: "/projects/randomizer",
    },
  },
  {
    id: "nbody-simulation",
    title: "N-Body Simulation",
    tag: "PROJ",
    tags: ["Physics", "3D Graphics", "Interactive"],
    description:
      "An interactive 3D physics simulation that models gravitational interactions between multiple bodies in space. The simulation uses the Barnes-Hut algorithm to efficiently approximate gravitational forces between large numbers of particles, making it possible to simulate complex systems like galaxies and star clusters.",
    technologies: [
      "React Three Fiber",
      "React",
      "TypeScript",
      "Barnes-Hut Algorithm",
      "Octree",
    ],
    image:
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&auto=format&fit=crop",
    detailPage: "/projects/nbody-simulation",
    featured: true,
    year: "2024",
    links: {
      live: "/projects/nbody-simulation",
    },
  },
  {
    id: "battlesnake",
    title: "Battlesnake 2019",
    tag: "EVNT",
    tags: ["Python", "AI", "Web Server"],
    description:
      "A competitive programming game where you build an AI web server to play snake against other players. Used AI, web servers, deployment, and networking.",
    technologies: [
      "Python 2.7.13",
      "Gunicorn",
      "Bottle",
      "Numpy",
      "JSON",
      "Pyenv",
      "Heroku",
      "Git",
    ],
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop",
    detailPage: "/projects/battlesnake",
    featured: true,
    year: "2019",
    links: {
      github: "https://github.com/RyanBarclay/striper-snake",
    },
  },
  {
    id: "personal-server",
    title: "Personal Server",
    tag: "PROJ",
    tags: ["Server", "RAID", "Linux"],
    description:
      "Built and configured a personal server for NAS, SFTP, SSH and ML training. Features 4TB RAID 5 storage, 6 core CPU and serves as a development environment.",
    technologies: [
      "Ubuntu Server 16.04",
      "RAID 5",
      "SSH",
      "SFTP",
      "Python",
      "Machine Learning",
    ],
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop",
    detailPage: "/projects/personal-server",
    year: "2018",
  },
  {
    id: "spookathon",
    title: "Spookathon 2019",
    tag: "HACK",
    tags: ["2nd Place", "Hackathon", "Machine Learning"],
    description:
      "Won 2nd place at UVic's 3-hour hackathon. Built a movie recommendation system that filters out movies containing disliked actors using facial recognition.",
    technologies: [
      "Python 3",
      "Git",
      "Pip3",
      "Numpy",
      "PIL",
      "Face Recognition",
    ],
    image:
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&auto=format&fit=crop",
    detailPage: "/projects/spookathon",
    heroImage: "/assets/images/Spookathon-Banner.jpg",
    heroGradient:
      "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6))",
    year: "2019",
    links: {
      github: "https://github.com/RyanBarclay/Spookathon-2019-Face-Recognition",
    },
  },
  {
    id: "js-challenge",
    title: "21 Day JavaScript Challenge",
    tag: "CHAL",
    tags: ["JavaScript", "Team Competition", "Top 8"],
    description:
      "Participated in Lighthouse Labs' JavaScript challenge. Team ranked in top 8 while building fundamental JS skills.",
    technologies: ["JavaScript", "Git"],
    image:
      "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&auto=format&fit=crop",
    detailPage: "/projects/js-challenge",
    year: "2019",
    links: {
      github:
        "https://github.com/RyanBarclay/Lighthouse-Labs-21-Day-Coding-Challenge",
    },
  },
];

export const getFeaturedProjects = () => projectsData.filter((p) => p.featured);

export const getProjectById = (id: string) =>
  projectsData.find((p) => p.id === id);
