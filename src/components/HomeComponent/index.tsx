import { Paper } from "@mui/material";
import styled from "@emotion/styled";

const StyledPaper = styled(Paper)`
  height: 200vh;
`;
const HomeComponent = (): JSX.Element => {
  return (
    <StyledPaper>
      <svg></svg>
    </StyledPaper>
  );
};

export default HomeComponent;
