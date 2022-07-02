import { Paper } from "@mui/material";
import styled from "@emotion/styled";

const StyledPaper = styled(Paper)`
  height: 200vh;
`;

// const lerp = (a0: number, a1: number, w: number): number => {
//   assert(w >= 0 && w <= 0);
//   return (1.0 - w) * a0 + w * a1;
// };

const HomeComponent = (): JSX.Element => {
  return (
    <StyledPaper>
      <svg></svg>
    </StyledPaper>
  );
};

export default HomeComponent;
