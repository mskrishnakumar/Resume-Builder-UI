import { useState } from "react";
import Question from "../components/Question";
import SkillsSelector from "../components/SkillsSelector";
import ExperienceStep from "../components/ExperienceStep";
import LivePreview from "../components/LivePreview";

const SECTIONS = [
  { id: "personal", title: "Personal Details" },
  { id: "education", title: "Education" },
  { id: "skills", title: "Skills & Expertise" },
  { id: "experience", title: "Work Experience" },
];

// Chevron Icon Component
const ChevronDown = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

export default function Builder() {
  const [activeSection, setActiveSection] = useState("personal");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    education: "",
    skills: [],
    experience: { hasExperience: null },
    jobTarget: ""
  });

  const toggleSection = (id) => {
    setActiveSection(activeSection === id ? null : id);
  };

  const updateField = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans">

      {/* Navbar */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold">R</div>
            <span className="font-bold text-xl text-gray-800 tracking-tight">Resume<span className="text-blue-600">Coach</span></span>
          </div>
          <button
            className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2 rounded-lg font-medium text-sm transition-colors shadow-lg shadow-gray-200"
            onClick={() => alert("This would trigger the PDF download logic!")}
          >
            Download PDF
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* LEFT COLUMN - ACCORDION EDITOR */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-lg font-semibold text-gray-500 mb-4 px-2">Builder</h2>

          {/* Personal Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all">
            <button
              onClick={() => toggleSection("personal")}
              className="w-full flex items-center justify-between p-5 text-left font-medium text-gray-800 hover:bg-gray-50 transition-colors"
            >
              <span>Personal Details</span>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${activeSection === "personal" ? "rotate-180" : ""}`} />
            </button>

            {activeSection === "personal" && (
              <div className="p-5 pt-0 space-y-4 animate-in fade-in slide-in-from-top-1">
                <Question
                  label="Full Name"
                  value={formData.name}
                  onChange={(v) => updateField("name", v)}
                />
                <Question
                  label="Phone Number"
                  value={formData.phone}
                  onChange={(v) => updateField("phone", v)}
                />
                <Question
                  label="Current Location"
                  value={formData.location}
                  onChange={(v) => updateField("location", v)}
                />
              </div>
            )}
          </div>

          {/* Education */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <button
              onClick={() => toggleSection("education")}
              className="w-full flex items-center justify-between p-5 text-left font-medium text-gray-800 hover:bg-gray-50 transition-colors"
            >
              <span>Education</span>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${activeSection === "education" ? "rotate-180" : ""}`} />
            </button>
            {activeSection === "education" && (
              <div className="p-5 pt-0 animate-in fade-in slide-in-from-top-1">
                <Question
                  label="Highest Qualification"
                  value={formData.education}
                  onChange={(v) => updateField("education", v)}
                />
              </div>
            )}
          </div>

          {/* Skills */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <button
              onClick={() => toggleSection("skills")}
              className="w-full flex items-center justify-between p-5 text-left font-medium text-gray-800 hover:bg-gray-50 transition-colors"
            >
              <span>Skills</span>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${activeSection === "skills" ? "rotate-180" : ""}`} />
            </button>
            {activeSection === "skills" && (
              <div className="p-5 pt-0 animate-in fade-in slide-in-from-top-1">
                <SkillsSelector
                  value={formData.skills}
                  onChange={(v) => updateField("skills", v)}
                />
              </div>
            )}
          </div>

          {/* Experience */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <button
              onClick={() => toggleSection("experience")}
              className="w-full flex items-center justify-between p-5 text-left font-medium text-gray-800 hover:bg-gray-50 transition-colors"
            >
              <span>Experience</span>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${activeSection === "experience" ? "rotate-180" : ""}`} />
            </button>
            {activeSection === "experience" && (
              <div className="p-5 pt-0 animate-in fade-in slide-in-from-top-1">
                <ExperienceStep
                  value={formData.experience}
                  onChange={(v) => updateField("experience", v)}
                />
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Question
                    label="Target Job"
                    value={formData.jobTarget}
                    onChange={(v) => updateField("jobTarget", v)}
                  />
                </div>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN - PREVIEW */}
        <div className="hidden lg:block lg:col-span-7">
          <h2 className="text-lg font-semibold text-gray-500 mb-4 px-2">Live Preview</h2>
          <LivePreview data={formData} />
        </div>

      </main>
    </div>
  );
}
