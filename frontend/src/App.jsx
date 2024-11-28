import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Recruiter from "./pages/Recruiter";
import CandidateUpload from "./pages/CandidateUpload";
import RoundSelection from "./pages/RoundSelection";
import AptitudeInfo from "./pages/AptitudeInfo";
import TechnicalInfo from "./pages/TechnicalInfo";
import HRRoundInfo from "./pages/HrRoundInfo";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/recruiter" element={<Recruiter />} />
        <Route path="/aptitudeInfo" element={<AptitudeInfo />} />
        <Route path="/technicalInfo" element={<TechnicalInfo />} />
        <Route path="/hrInfo" element={<HRRoundInfo />} />
        <Route path="/candidateUpload" element={<CandidateUpload />} />
        <Route path="/roundSelection" element={<RoundSelection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
};

export default App;
