import React from "react";
import { Typography } from "@mui/material";
import ProjectDetailLayout from "../../../components/layout/ProjectDetailLayout";

const JSChallenge = () => {
  const sections = [
    {
      title: "Overview",
      content: (
        <Typography paragraph>
          In May 2019, I participated in Lighthouse Labs' 21-day JavaScript
          challenge as part of the University of Victoria's Web Dev Club team.
          The challenge was designed to build fundamental JavaScript skills
          through daily coding exercises.
        </Typography>
      ),
    },
    {
      title: "Team Achievement",
      content: (
        <Typography paragraph>
          Our Web Dev Club team performed exceptionally well, ranking in the top
          8 teams by the end of the competition. This achievement highlighted
          both our collaborative abilities and our rapid learning capacity.
        </Typography>
      ),
    },
    {
      title: "Learning Experience",
      content: (
        <>
          <Typography paragraph>
            The challenge provided an excellent structured approach to learning
            JavaScript, particularly valuable for developers with prior
            programming experience in other languages. Each day brought new
            concepts and challenges, building upon previous lessons.
          </Typography>
          <Typography paragraph>
            Unfortunately, due to technical issues on Lighthouse Labs' server,
            the 21st day's challenge was not posted. However, the first 20 days
            provided comprehensive coverage of essential JavaScript concepts and
            practical programming challenges.
          </Typography>
        </>
      ),
    },
    {
      title: "Impact",
      content: (
        <Typography paragraph>
          This challenge proved to be an excellent entry point into JavaScript
          development, providing a solid foundation for future web development
          projects. The team-based approach also helped in developing
          collaborative coding skills and understanding different
          problem-solving approaches.
        </Typography>
      ),
    },
  ];

  return (
    <ProjectDetailLayout
      title="21 Day JavaScript Challenge"
      tags={["JavaScript", "Team Competition", "Top 8"]}
      sections={sections}
      technologies={[
        "JavaScript",
        "Git",
        "Node.js",
        "Problem Solving",
        "Team Collaboration",
      ]}
    />
  );
};

export default JSChallenge;
