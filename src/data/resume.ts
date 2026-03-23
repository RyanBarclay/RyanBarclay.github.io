export interface ResumeRole {
  title: string;
  startDate: string;
  endDate: string;
  type?: string;
  bullets: string[];
}

export interface ResumeExperience {
  company: string;
  companyNote?: string;
  location: string;
  roles: ResumeRole[];
}

export interface ResumeSkillCategory {
  category: string;
  skills: string[];
}

export interface ResumeLeadership {
  organization: string;
  role: string;
  period: string;
  description: string;
}

export interface ResumeEducation {
  institution: string;
  degree: string;
  field: string;
  period: string;
}

export interface ResumeData {
  name: string;
  title: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  summary: string;
  experience: ResumeExperience[];
  education: ResumeEducation[];
  skills: ResumeSkillCategory[];
  leadership: ResumeLeadership[];
}

export const resumeData: ResumeData = {
  name: "Ryan Barclay",
  title: "Software Engineer",
  location: "North Vancouver, BC, Canada",
  email: "work@ryanbarclay.ca",
  github: "github.com/ryanbarclay",
  linkedin: "linkedin.com/in/ryan-barclay",

  summary:
    "Full-stack software engineer based in North Vancouver with 5+ years of experience across frontend, backend, and DevOps. Currently building at scale at Rokt, a global tech unicorn, after navigating two successful acquisitions (Beanworks, AfterSell). I operate at the intersection of engineering depth and cross-functional communication — equally comfortable in a code review, a technical discovery call, or coordinating multi-agent AI workflows. In the current AI landscape, I function as a force multiplier: I bring the best practices, architecture instincts, and quality gates that turn AI tooling from a curiosity into a production accelerant.",

  experience: [
    {
      company: "Rokt",
      companyNote: "Global e-commerce tech unicorn (via AfterSell acquisition)",
      location: "Vancouver, BC",
      roles: [
        {
          title: "Software Engineer L3A — FDSE",
          startDate: "Jan 2026",
          endDate: "Present",
          type: "Hybrid",
          bullets: [
            "Driving partner integrations — helping merchants and developers embed Rokt's platform into their existing tech stacks",
            "Building automation tools for Sales and BD workflows to eliminate manual steps in the go-live process",
            "Consulting on and implementing fixes to the sales pipeline with a goal of reducing average time-to-launch from 48 days to 4",
          ],
        },
        {
          title: "Software Engineer L2B",
          startDate: "Aug 2025",
          endDate: "Jan 2026",
          type: "Hybrid",
          bullets: [
            "Full-stack engineering on Rokt's e-commerce platform serving enterprise merchants globally",
            "Primary technical voice for SMB department — translating complex API and architecture decisions into clear partner value",
            "Leading technical discovery and cross-functional alignment across engineering and GTM teams",
          ],
        },
        {
          title: "Software Engineer L2",
          startDate: "Nov 2024",
          endDate: "Aug 2025",
          type: "Hybrid",
          bullets: [
            "Built and maintained features across Rokt's Shopify app ecosystem post-acquisition",
            "Contributed to stability and performance improvements during integration with Rokt's platform",
          ],
        },
        {
          title: "Operations Engineer L3A",
          startDate: "Feb 2024",
          endDate: "Nov 2024",
          type: "Hybrid",
          bullets: [
            "Led technical support for eCommerce merchants on AfterSell / Rokt Shopify apps following acquisition",
            "Expanded role to work closely with engineering team — identifying, scoping, and implementing patches and stability updates",
            "Contributed to successful integration of Rokt's network offers within the AfterSell ecosystem",
          ],
        },
        {
          title: "Support Engineer (Pre-acquisition at AfterSell)",
          startDate: "Nov 2023",
          endDate: "Feb 2024",
          type: "Remote",
          bullets: [
            "Led technical support for eCommerce merchants — reported directly to Customer Success Manager and Co-founder/CTO",
            "Contributed to a double-digit reduction in customer churn through scalable solutions and direct merchant engagement",
            "Investigated and resolved custom technical requests; created and deployed patches to improve app stability",
            "Assisted in recruitment and onboarding of new Support Engineers",
            "Navigated the team through the AfterSell acquisition by Rokt Inc., maintaining service quality throughout the transition",
          ],
        },
      ],
    },
    {
      company: "Quadient Accounts Payable Automation by Beanworks",
      companyNote: "AP automation SaaS (acquired by Quadient)",
      location: "Vancouver, BC",
      roles: [
        {
          title: "Engineering Intern",
          startDate: "Dec 2021",
          endDate: "Dec 2022",
          type: "Co-op",
          bullets: [
            "Spearheaded development of a next-generation UI module using React, MUI v5, and TypeScript",
            "Implemented AWS CodeBuild parallelization — achieved 500% improvement in CI build time",
            "Automated engineering metric reporting pipeline, streamlining data collection and team visibility",
            "Integrated GraphQL for optimized data fetching; built and documented UI components in Storybook",
            "Conducted unit testing with Jest and contributed to Cypress E2E test suite",
          ],
        },
        {
          title: "Product Intern",
          startDate: "Jul 2021",
          endDate: "Dec 2021",
          type: "Co-op, On-site",
          bullets: [
            "Collaborated with VP of Product to redesign the mobile app using data-driven user insights",
            "Used Figma for UI prototyping; partnered with UX/UI designers on interface improvements",
            "Assisted migration to Pendo for enhanced user analytics and informed product decisions",
            "Developed strategic roadmaps for MVP transition aligned with business goals",
          ],
        },
      ],
    },
    {
      company: "Quandri",
      location: "Vancouver, BC (Remote)",
      roles: [
        {
          title: "Software Engineer",
          startDate: "Jul 2021",
          endDate: "Sep 2021",
          type: "Contract Part-time",
          bullets: [
            "Automated a Salesforce CRM system for a major insurance client using Python and Robocorp, reducing manual effort significantly",
            "Developed Python/Regex scripts for data manipulation and real-time CRM updates via email scraping",
          ],
        },
      ],
    },
  ],

  education: [
    {
      institution: "University of Victoria",
      degree: "Bachelor of Science",
      field: "Computer Science",
      period: "2019 – Oct 2023",
    },
  ],

  skills: [
    {
      category: "Languages",
      skills: ["TypeScript", "JavaScript", "Python", "Go", "Ruby", "C++", "Java", "Bash"],
    },
    {
      category: "Frontend",
      skills: ["React", "React Three Fiber", "MUI", "HTML/CSS", "Apollo GraphQL", "Storybook", "Figma"],
    },
    {
      category: "Backend",
      skills: ["Node.js", "Express.js", "GraphQL", "REST APIs", "MongoDB", "SQL", "Shopify Platform"],
    },
    {
      category: "Cloud & DevOps",
      skills: [
        "AWS (S3, CodeBuild)",
        "GCP (Cloud Run, Compute Engine)",
        "Docker",
        "CI/CD",
        "DataDog",
      ],
    },
    {
      category: "AI & Agentic Tools",
      skills: [
        "Claude Code",
        "GitHub Copilot",
        "Multi-agent orchestration",
        "LLM workflow design",
        "Prompt engineering",
      ],
    },
    {
      category: "CS Fundamentals",
      skills: ["OOP", "Functional Programming", "Distributed Systems", "Software Design"],
    },
    {
      category: "Methods & Practices",
      skills: [
        "Agile Scrum",
        "Technical Scoping",
        "Product Ownership",
        "Sales Discovery",
        "Cross-functional alignment",
      ],
    },
  ],

  leadership: [
    {
      organization: "VikeLabs — UVic's largest software club (500+ members)",
      role: "Admin",
      period: "Aug 2020 – Apr 2022",
      description:
        "Led organizational operations for the largest software engineering club at UVic. Managed full transition from in-person to online during COVID-19. Responsibilities spanned recruitment, onboarding, QA support, and UX.",
    },
    {
      organization: "VikeLabs",
      role: "Director of Community",
      period: "Jan 2020 – Aug 2020",
      description:
        "Conceived and executed community events including a $500-prize hackathon. Focused on cross-team engagement and connecting entrepreneurial students across the club.",
    },
    {
      organization: "University of Victoria Rowing",
      role: "Race Course Coordinator",
      period: "Oct 2016 – Oct 2018",
      description:
        "Volunteered at all UVic men's rowing events including Head of the Gorge, Monster Erg, and Brown Cup. Managed race course logistics and coordination.",
    },
  ],
};
