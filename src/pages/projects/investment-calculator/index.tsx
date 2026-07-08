import { Typography } from "@mui/material";
import ProjectDetailLayout from "../../../components/layout/ProjectDetailLayout";
import { getProjectById } from "../../../data/projects";
import CalculatorContainer from "./components/CalculatorContainer";

const InvestmentCalculatorProject = () => {
  const projectData = getProjectById("investment-calculator");
  if (!projectData) return null;

  const sections = [
    {
      title: "Overview",
      content: (
        <>
          <Typography paragraph>
            A three-mode financial calculator built for the Canadian
            context. Investment mode projects compound growth with real
            TFSA/RRSP contribution-room tracking — including CRA's
            historical TFSA limits and inflation-indexed future limits.
            Mortgage mode builds a full amortization schedule with
            semi-annual compounding, CMHC insurance below 20% down, and
            accelerated payment frequencies. Combined mode answers the
            big question — rent or buy? One monthly budget, two
            universes: pay rent and invest the rest (down payment
            included), or pay the mortgage and ownership costs and
            invest what's left.
          </Typography>
          <Typography paragraph>
            Every projection can be viewed in nominal or
            inflation-adjusted (present-day) dollars, charted as
            toggleable multi-line series, and exported as CSV.
          </Typography>
        </>
      ),
    },
  ];

  return (
    <ProjectDetailLayout
      title={projectData.title}
      tags={projectData.tags}
      sections={sections}
      technologies={projectData.technologies}
      additionalContent={<CalculatorContainer />}
    />
  );
};

export default InvestmentCalculatorProject;
