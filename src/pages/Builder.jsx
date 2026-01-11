import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import { useAuth } from "../context/AuthContext";
import { auth } from "../firebase";
import Question from "../components/Question";
import PhotoUpload from "../components/PhotoUpload";
import SkillsSelector from "../components/SkillsSelector";
import LanguagesSelector from "../components/LanguagesSelector";
import ColorSchemeSelector from "../components/ColorSchemeSelector";
import EducationStep from "../components/EducationStep";
import ExperienceStep from "../components/ExperienceStep";
import LivePreview from "../components/LivePreview";

const STORAGE_KEY = "resume_builder_data";

// Encouraging messages that rotate
const ENCOURAGING_MESSAGES = [
  "You're doing great! Every section you complete brings you closer to your dream job.",
  "Keep going! A well-crafted resume opens doors to amazing opportunities.",
  "Nice progress! Your future employer will be impressed.",
  "Almost there! Your resume is shaping up beautifully.",
  "Great work! Each detail you add tells your unique story.",
  "You've got this! Your skills and experience deserve to shine.",
];

const SECTIONS = [
  { id: "personal", title: "Personal Details" },
  { id: "education", title: "Education" },
  { id: "skills", title: "Skills & Expertise" },
  { id: "experience", title: "Work Experience" },
  { id: "languages", title: "Languages Known" },
  { id: "customize", title: "Customize", optional: true },
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
    email: "",
    phone: "",
    location: "",
    photo: null,
    education: [],
    skills: [],
    languages: [],
    experience: { hasExperience: null, experiences: [] },
    jobTarget: "",
    colorScheme: "classic"
  };
};

// Check if a section is complete
const isSectionComplete = (sectionId, formData) => {
  switch (sectionId) {
    case "personal":
      return formData.name?.trim()?.length > 0;
    case "education":
      const educations = formData.education || [];
      return educations.length > 0 && educations[0]?.qualification?.trim()?.length > 0;
    case "skills":
      return formData.skills?.length > 0;
    case "experience":
      // Complete if they've made a choice (yes with entries OR no)
      return formData.experience?.hasExperience === false ||
        (formData.experience?.hasExperience === true && formData.experience?.experiences?.length > 0);
    case "languages":
      return formData.languages?.length > 0;
    case "customize":
      return formData.colorScheme && formData.colorScheme !== "classic";
    default:
      return false;
  }
};

// Tick icon component
const CheckIcon = () => (
  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

export default function Builder() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("personal");
  const [formData, setFormData] = useState(getInitialFormData);
  const [isCloudSaving, setIsCloudSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);
  const [errors, setErrors] = useState({});
  const [isDownloading, setIsDownloading] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [showMessage, setShowMessage] = useState(true);
  const previewRef = useRef(null);

  // Select one random message on mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * ENCOURAGING_MESSAGES.length);
    setCurrentMessage(randomIndex);
  }, []);

  // Count completed sections
  const completedSections = SECTIONS.filter(s => !s.optional && isSectionComplete(s.id, formData)).length;
  const totalRequiredSections = SECTIONS.filter(s => !s.optional).length;

  // Fetch data from Cloud on mount
  useEffect(() => {
    const loadFromCloud = async () => {
      if (!user) return;

      try {
        const token = await user.getIdToken();
        const response = await fetch('/api/GetResume', {
          headers: {
            'X-Firebase-Token': token
          }
        });

        if (response.ok) {
          const cloudData = await response.json();
          if (cloudData) {
            setFormData(prev => ({ ...prev, ...cloudData }));
            setLastSaved(new Date());
          }
        }
      } catch (error) {
        console.error("Failed to load resume:", error);
      }
    };

    if (!authLoading && user) {
      loadFromCloud();
    }
  }, [user, authLoading]);

  // Save to Cloud & LocalStorage
  // Debounced save for cloud, immediate for local
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));

    const saveToCloud = async () => {
      if (!user) return;

      setIsCloudSaving(true);
      setSaveError(null);
      try {
        const token = await user.getIdToken(true); // Force refresh
        const response = await fetch('/api/SaveResume', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Firebase-Token': token
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          setLastSaved(new Date());
          setSaveError(null);
        } else {
          const errorText = await response.text();
          console.error(`Cloud save failed (${response.status}):`, errorText);
          try {
            const errorData = JSON.parse(errorText);
            setSaveError(errorData.message || `Error ${response.status}`);
          } catch (e) {
            setSaveError(`Cloud Save Failed (${response.status})`);
          }
        }
      } catch (error) {
        console.error("Failed to auto-save:", error);
        setSaveError("Connection Error");
      } finally {
        setIsCloudSaving(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      if (user) saveToCloud();
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(debounceTimer);
  }, [formData, user]);

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
      margin: 0,
      filename: `${formData.name || "resume"}_resume.pdf`,
      image: { type: "jpeg", quality: 0.98 }, // JPEG reduces file size significantly compared to PNG
      html2canvas: {
        scale: 2, // Scale 2 is sufficient for crisp print (approx 192dpi) and keeps size down
        useCORS: true,
        logging: false,
        letterRendering: true
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
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
        email: "",
        phone: "",
        location: "",
        photo: null,
        education: [],
        skills: [],
        languages: [],
        experience: { hasExperience: null, experiences: [] },
        jobTarget: "",
        colorScheme: "classic"
      });
      setErrors({});
    }
  };

  const loadDemoData = () => {
    if (formData.name && !confirm("This will overwrite your current data. Continue?")) return;

    setFormData({
      name: "Alex Morgan",
      email: "alex.morgan@example.com",
      phone: "+91 98765 43210",
      location: "Bangalore, India",
      photo: null,
      education: [
        { id: 1, qualification: "Bachelor of Technology", specialization: "Computer Science", institution: "Indian Institute of Technology, Madras", year: "2023" }
      ],
      skills: ["React", "Node.js", "JavaScript", "Python", "AWS", "UI/UX Design"],
      languages: ["English", "Hindi", "Kannada"],
      experience: {
        hasExperience: true,
        experiences: [
          { id: 1, role: "Frontend Developer", company: "TechCorp India", startDate: "2023-06", endDate: "", details: "Built responsive web applications using React and TailwindCSS. Improved site performance by 40%." }
        ]
      },
      jobTarget: "Senior Frontend Engineer",
      colorScheme: "modern"
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans">

      {/* Navbar */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </Link>
            <div className="h-6 w-px bg-gray-200" />
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold">R</div>
              <span className="font-bold text-xl text-gray-800 tracking-tight">Resume<span className="text-blue-600">Builder</span></span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <>
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-sm font-bold text-gray-700 leading-none">
                    {user.displayName || "User"}
                  </span>
                  <span className="text-xs text-gray-500 leading-none mt-1">
                    {user.email}
                  </span>
                </div>
                <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
                  {user.displayName ? user.displayName[0].toUpperCase() : user.email[0].toUpperCase()}
                </div>
              </>
            )}
            <button
              onClick={() => auth.signOut()}
              className="text-sm text-gray-500 hover:text-gray-900 font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Encouraging Message Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div
            className={`text-center text-sm text-blue-700 transition-opacity duration-500 ${showMessage ? "opacity-100" : "opacity-0"}`}
          >
            <span className="inline-flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
              {ENCOURAGING_MESSAGES[currentMessage]}
            </span>
          </div>
        </div>
      </div>

      {/* Unified Sticky Toolbar */}
      <div className="sticky top-16 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 h-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* Left: Status & Progress (Matches Left Column) */}
          <div className="lg:col-span-12 xl:col-span-5 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <svg className="w-10 h-10 text-gray-100" viewBox="0 0 36 36">
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="blue" strokeWidth="4" strokeDasharray={`${(completedSections / totalRequiredSections) * 100}, 100`} className="text-blue-600 transition-all duration-1000 ease-out" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-gray-600">
                    {Math.round((completedSections / totalRequiredSections) * 100)}%
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Progress</span>
                  <span className="text-xs text-gray-500">{completedSections}/{totalRequiredSections} Steps</span>
                </div>
              </div>

              <div className="h-8 w-px bg-gray-200" />

              <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 transition-colors ${isCloudSaving ? "text-blue-600 bg-blue-50" :
                saveError ? "text-red-600 bg-red-50 font-bold" :
                  lastSaved ? "text-green-600 bg-green-50" :
                    "text-gray-500 bg-gray-100"
                }`}>
                {isCloudSaving ? (
                  <>
                    <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving to Cloud...
                  </>
                ) : saveError ? (
                  <>
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {saveError}
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {lastSaved ? "Sync Active" : "Local Save Only"}
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Right: Actions (Matches Right Column Layout) */}
          <div className="hidden lg:flex lg:col-span-12 xl:col-span-7 justify-center relative">
            {/* Inner container matches the Live Preview's width (max-w-[595px]) so buttons align perfectly */}
            <div className="w-full max-w-[595px] flex items-center justify-end gap-3">
              <button
                onClick={loadDemoData}
                className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Load Demo
              </button>

              <button
                onClick={clearData}
                className="text-sm font-medium text-gray-600 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition-all"
              >
                Clear
              </button>

              <div className="h-6 w-px bg-gray-200" />

              <button
                disabled
                className="text-gray-400 cursor-not-allowed px-2 flex items-center gap-1 text-sm font-medium"
                title="Coming Soon"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="hidden lg:inline">Email Me</span>
              </button>

              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-lg shadow-slate-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isDownloading ? (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                )}
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* LEFT COLUMN - ACCORDION EDITOR */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-4">
          {/* Section Headers Removed - Using Unified Bar */}

          {/* Personal Details */}
          <div className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all ${errors.name ? "border-red-300" : "border-gray-200"}`}>
            <button
              onClick={() => toggleSection("personal")}
              className="w-full flex items-center justify-between p-5 text-left font-medium text-gray-800 hover:bg-gray-50 transition-colors"
            >
              <span className="flex items-center gap-2">
                <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">1</span>
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
                  label="Email Address"
                  value={formData.email}
                  onChange={(v) => updateField("email", v)}
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
          <div className={`bg-white rounded-xl shadow-sm border overflow-hidden ${errors.education ? "border-red-300" : "border-gray-200"}`}>
            <button
              onClick={() => toggleSection("education")}
              className="w-full flex items-center justify-between p-5 text-left font-medium text-gray-800 hover:bg-gray-50 transition-colors"
            >
              <span className="flex items-center gap-2">
                <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">2</span>
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
                <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">3</span>
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
              <span className="flex items-center gap-2">
                <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                Experience
              </span>
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

          {/* Languages */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <button
              onClick={() => toggleSection("languages")}
              className="w-full flex items-center justify-between p-5 text-left font-medium text-gray-800 hover:bg-gray-50 transition-colors"
            >
              <span className="flex items-center gap-2">
                <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">5</span>
                Languages Known
              </span>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${activeSection === "languages" ? "rotate-180" : ""}`} />
            </button>
            {activeSection === "languages" && (
              <div className="p-5 pt-0 animate-in fade-in slide-in-from-top-1">
                <LanguagesSelector
                  value={formData.languages || []}
                  onChange={(v) => updateField("languages", v)}
                />
              </div>
            )}
          </div>

          {/* Optional Enhancements Section */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-3 px-2">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Optional Enhancements</h2>
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Optional</span>
            </div>

            {/* Customize / Color Scheme */}
            <div className="bg-white rounded-xl shadow-sm border border-dashed border-gray-300 overflow-hidden">
              <button
                onClick={() => toggleSection("customize")}
                className="w-full flex items-center justify-between p-5 text-left font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  Color Scheme
                </span>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${activeSection === "customize" ? "rotate-180" : ""}`} />
              </button>
              {activeSection === "customize" && (
                <div className="p-5 pt-0 animate-in fade-in slide-in-from-top-1">
                  <ColorSchemeSelector
                    value={formData.colorScheme || "classic"}
                    onChange={(v) => updateField("colorScheme", v)}
                  />
                </div>
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN - PREVIEW */}
        <div className="hidden lg:block lg:col-span-12 xl:col-span-7">
          <div className="sticky top-24">
            <LivePreview ref={previewRef} data={formData} />
          </div>
        </div>

      </main>
    </div>
  );
}
