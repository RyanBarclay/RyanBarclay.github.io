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
    id: "terrain-generator",
    title: "Procedural Terrain Generator",
    tag: "PROJ",
    tags: ["React Three Fiber", "WebGL", "Algorithms", "AI-Generated"],
    description:
      "A showcase of AI-assisted development: Real-time 3D terrain generator built entirely through structured AI collaboration. Features custom Simplex noise, LOD optimization with quadtree spatial partitioning, and multi-format export. Developed using parallel sub-agents coordinated through a comprehensive PRD created by Google's Gemini.",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop",
    heroImage: "/assets/images/terrain-hero.jpg",
    heroGradient:
      "linear-gradient(135deg, rgba(44, 85, 48, 0.9), rgba(92, 158, 173, 0.8))",
    detailPage: "/projects/terrain-generator",
    links: {
      github:
        "https://github.com/RyanBarclay/RyanBarclay.github.io/tree/master/src/pages/projects/terrain-generator",
    },
    sections: [
      {
        title: "AI-Driven Development Process",
        content:
          "This project demonstrates modern AI-assisted software development using GitHub Copilot with Claude Sonnet 4.5. The entire codebase (~3,800 lines across 35+ files) was created through structured collaboration between human oversight and AI agents.",
      },
      {
        title: "Development Workflow",
        content:
          "1. **Planning Phase**: Google's Gemini created a comprehensive Product Requirements Document (PRD) defining architecture, data structures, and implementation phases.\n\n2. **Parallel Execution**: Each phase was divided into concurrent groups executed by specialized sub-agents, maximizing development velocity.\n\n3. **Quality Gates**: After each phase (A-F), architecture audits ensured alignment with the original plan and approved any necessary simplifications.\n\n4. **Zero External Dependencies**: All algorithms (Simplex noise, fractal Brownian motion, quadtree spatial partitioning) were implemented from scratch to demonstrate algorithmic understanding.",
      },
      {
        title: "Technical Implementation",
        content:
          "The terrain generator uses custom implementations of advanced algorithms:\n\n• **Simplex Noise**: 2D gradient noise with 12 directional gradients for natural terrain features\n• **Fractal Brownian Motion (fBm)**: Multiple octaves of noise summed with decreasing amplitude for realistic elevation\n• **Quadtree LOD System**: Distance-based level-of-detail with O(log n) spatial queries\n• **Four Export Formats**: OBJ (3D modeling), STL (3D printing), PNG heightmap (game engines), RAW binary (scientific)",
      },
      {
        title: "Performance Optimizations",
        content:
          "• 60 FPS on 256×256 terrain through LOD system (75% triangle reduction at distance)\n• Geometry disposal on regeneration prevents memory leaks\n• Frame-skipped LOD updates (every 2 frames) reduce computational overhead\n• Local state management in controls provides instant slider feedback\n• BufferGeometry with typed arrays for GPU efficiency",
      },
      {
        title: "Development Insights",
        content:
          "This project showcases the potential of AI-assisted development:\n\n✅ **Speed**: ~3,800 lines implemented in hours, not days\n✅ **Quality**: Comprehensive JSDoc, TypeScript strict mode, clean architecture\n✅ **Learning**: Each sub-agent implemented best practices (React hooks, Three.js optimization, algorithm implementation)\n✅ **Documentation**: Auto-generated USAGE.md, PERFORMANCE.md, and README.md\n\nThe structured approach with PRD, phases, and audits ensured architectural integrity while leveraging AI's code generation capabilities.",
      },
    ],
    technologies: [
      "React Three Fiber",
      "@react-three/drei",
      "Three.js",
      "TypeScript",
      "Material-UI v7",
      "Custom Simplex Noise",
      "Fractal Brownian Motion",
      "Quadtree LOD",
      "WebGL",
      "BufferGeometry",
      "GitHub Copilot (Claude Sonnet 4.5)",
      "Google Gemini (PRD Generation)",
    ],
    year: "2026",
    featured: true,
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
