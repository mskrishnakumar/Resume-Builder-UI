import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Builder from "./pages/Builder";
import InterviewCoach from "./pages/InterviewCoach";
import JobSkills from "./pages/JobSkills";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/builder" element={<Builder />} />
        <Route path="/interview-coach" element={<InterviewCoach />} />
        <Route path="/job-skills" element={<JobSkills />} />
      </Routes>
    </Router>
  );
}

export default App;
