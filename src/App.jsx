import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Builder from "./pages/Builder";
import InterviewCoach from "./pages/InterviewCoach";
import JobSkills from "./pages/JobSkills";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/builder" element={
            <ProtectedRoute>
              <Builder />
            </ProtectedRoute>
          } />
          <Route path="/interview-coach" element={
            <ProtectedRoute>
              <InterviewCoach />
            </ProtectedRoute>
          } />
          <Route path="/job-skills" element={
            <ProtectedRoute>
              <JobSkills />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
