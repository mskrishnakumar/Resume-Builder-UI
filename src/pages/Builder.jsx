import { useState, useEffect, useRef } from "react";
import html2pdf from "html2pdf.js";
import Question from "../components/Question";
import PhotoUpload from "../components/PhotoUpload";
import SkillsSelector from "../components/SkillsSelector";
import EducationStep from "../components/EducationStep";
import ExperienceStep from "../components/ExperienceStep";
import LivePreview from "../components/LivePreview";

const STORAGE_KEY = "resume_builder_data";

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

const getInitialFormData = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // Invalid JSON, return default
    }
  }
  return {
    name: "",
    phone: "",
    location: "",
    photo: null,
    education: [],
    skills: [],
    experience: { hasExperience: null, experiences: [] },
    jobTarget: ""
  };
};

export default function Builder() {
  const [activeSection, setActiveSection] = useState("personal");
  const [formData, setFormData] = useState(getInitialFormData);
  const [errors, setErrors] = useState({});
  const [isDownloading, setIsDownloading] = useState(false);
  const previewRef = useRef(null);

  // Save to localStorage whenever formData changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const toggleSection = (id) => {
    setActiveSection(activeSection === id ? null : id);
  };

  const updateField = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    // Clear error when field is updated
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    const educations = formData.education || [];
    if (educations.length === 0 || !educations[0]?.qualification?.trim()) {
      newErrors.education = "At least one qualification is required";
    }

    if (formData.skills.length === 0) {
      newErrors.skills = "Please select at least one skill";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDownload = async () => {
    if (!validateForm()) {
      // Open the section with the first error
      if (errors.name) setActiveSection("personal");
      else if (errors.education) setActiveSection("education");
      else if (errors.skills) setActiveSection("skills");
      return;
    }

    if (!previewRef.current) return;

    setIsDownloading(true);

    const opt = {
      margin: 0.5,
      filename: `${formData.name || "resume"}_resume.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
    };

    try {
      await html2pdf().set(opt).from(previewRef.current).save();
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const clearData = () => {
    if (confirm("Are you sure you want to clear all data? This cannot be undone.")) {
      localStorage.removeItem(STORAGE_KEY);
      setFormData({
        name: "",
        phone: "",
        location: "",
        photo: null,
        education: [],
        skills: [],
        experience: { hasExperience: null, experiences: [] },
        jobTarget: ""
      });
      setErrors({});
    }
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
          <div className="flex items-center gap-3">
            <button
              className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium transition-colors"
              onClick={clearData}
            >
              Clear All
            </button>
            <button
              className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2 rounded-lg font-medium text-sm transition-colors shadow-lg shadow-gray-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
              onClick={handleDownload}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                "Download PDF"
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* LEFT COLUMN - ACCORDION EDITOR */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-lg font-semibold text-gray-500">Builder</h2>
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">Auto-saved</span>
          </div>

          {/* Personal Details */}
          <div className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all ${errors.name ? "border-red-300" : "border-gray-200"}`}>
            <button
              onClick={() => toggleSection("personal")}
              className="w-full flex items-center justify-between p-5 text-left font-medium text-gray-800 hover:bg-gray-50 transition-colors"
            >
              <span className="flex items-center gap-2">
                Personal Details
                {errors.name && <span className="text-red-500 text-xs font-normal">({errors.name})</span>}
              </span>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${activeSection === "personal" ? "rotate-180" : ""}`} />
            </button>

            {activeSection === "personal" && (
              <div className="p-5 pt-0 space-y-4 animate-in fade-in slide-in-from-top-1">
                <PhotoUpload
                  value={formData.photo}
                  onChange={(v) => updateField("photo", v)}
                />
                <div>
                  <Question
                    label="Full Name"
                    value={formData.name}
                    onChange={(v) => updateField("name", v)}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>
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
          <div className={`bg-white rounded-xl shadow-sm border overflow-hidden ${errors.education ? "border-red-300" : "border-gray-200"}`}>
            <button
              onClick={() => toggleSection("education")}
              className="w-full flex items-center justify-between p-5 text-left font-medium text-gray-800 hover:bg-gray-50 transition-colors"
            >
              <span className="flex items-center gap-2">
                Education
                {errors.education && <span className="text-red-500 text-xs font-normal">({errors.education})</span>}
              </span>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${activeSection === "education" ? "rotate-180" : ""}`} />
            </button>
            {activeSection === "education" && (
              <div className="p-5 pt-0 animate-in fade-in slide-in-from-top-1">
                <EducationStep
                  value={formData.education}
                  onChange={(v) => updateField("education", v)}
                  error={errors.education}
                />
              </div>
            )}
          </div>

          {/* Skills */}
          <div className={`bg-white rounded-xl shadow-sm border overflow-hidden ${errors.skills ? "border-red-300" : "border-gray-200"}`}>
            <button
              onClick={() => toggleSection("skills")}
              className="w-full flex items-center justify-between p-5 text-left font-medium text-gray-800 hover:bg-gray-50 transition-colors"
            >
              <span className="flex items-center gap-2">
                Skills
                {errors.skills && <span className="text-red-500 text-xs font-normal">({errors.skills})</span>}
              </span>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${activeSection === "skills" ? "rotate-180" : ""}`} />
            </button>
            {activeSection === "skills" && (
              <div className="p-5 pt-0 animate-in fade-in slide-in-from-top-1">
                <SkillsSelector
                  value={formData.skills}
                  onChange={(v) => updateField("skills", v)}
                />
                {errors.skills && (
                  <p className="text-red-500 text-sm mt-2">{errors.skills}</p>
                )}
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
          <LivePreview ref={previewRef} data={formData} />
        </div>

      </main>
    </div>
  );
}
