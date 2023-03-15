import { AlternateEmail, SmsOutlined } from "@mui/icons-material";
import { Route, Routes } from "react-router-dom";

const RightSide = (): JSX.Element => {
  return (
    <Routes>
      <Route path="/about" element={<SmsOutlined />}></Route>
      <Route path="/resume" element={<AlternateEmail />}></Route>
    </Routes>
  );
};
export default RightSide;
