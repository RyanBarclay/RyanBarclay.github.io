import { Paper } from "@mui/material";
import styled from "@emotion/styled";
import { makeNoise2D } from "fast-simplex-noise";

const StyledPaper = styled(Paper)`
  height: 200vh;
`;

const mountian = (): JSX.Element => {
  const noise = makeNoise2D();
  const linePoints = (): string => {
    let stringOutput = "";
    for (let index = 400; index > 0; index--) {
      stringOutput = stringOutput.concat(
        "" + index + "," + noise(index, 0) * 50 + " "
      );
    }
    return stringOutput;
  };
  return <polygon points={linePoints()} />;
};

const HomeComponent = (): JSX.Element => {
  return (
    <StyledPaper>
      <svg style={{ height: "1000em", width: "1000em" }}>{mountian()}</svg>
    </StyledPaper>
  );
};

export default HomeComponent;
