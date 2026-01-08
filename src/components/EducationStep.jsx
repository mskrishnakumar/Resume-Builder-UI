import { useEffect, useRef } from "react";
import Question from "./Question";

export default function EducationStep({ value, onChange, error }) {
  // Ensure educations is always an array (handle legacy object format from localStorage)
  const educations = Array.isArray(value) ? value : [];
  const hasInitialized = useRef(false);

  // Auto-add first entry if empty (only once on mount)
  useEffect(() => {
    if (!hasInitialized.current && educations.length === 0) {
      hasInitialized.current = true;
      onChange([{
        id: Date.now(),
        qualification: "",
        institution: "",
        specialization: "",
        year: ""
      }]);
    }
  }, []);

  const createNewEducation = () => ({
    id: Date.now(),
    qualification: "",
    institution: "",
    specialization: "",
    year: ""
  });

  const addEducation = () => {
    onChange([...educations, createNewEducation()]);
  };

  const updateEducation = (id, field, fieldValue) => {
    const updated = educations.map((edu) =>
      edu.id === id ? { ...edu, [field]: fieldValue } : edu
    );
    onChange(updated);
  };

  const removeEducation = (id) => {
    const updated = educations.filter((edu) => edu.id !== id);
    onChange(updated);
  };

  // Show loading state while waiting for first entry to be added
  if (educations.length === 0) {
    return <div className="text-gray-400 text-sm py-4">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {educations.map((edu, index) => (
        <div key={edu.id || index} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-700">
              {index === 0 ? "Highest Qualification" : `Qualification ${index + 1}`}
            </h3>
            {educations.length > 1 && (
              <button
                type="button"
                onClick={() => removeEducation(edu.id)}
                className="text-red-500 hover:text-red-700 text-sm font-medium"
              >
                Remove
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <Question
                label="Degree / Qualification"
                value={edu.qualification || ""}
                onChange={(v) => updateEducation(edu.id, "qualification", v)}
              />
              {error && index === 0 && !edu.qualification?.trim() && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Question
                label="School / College (optional)"
                value={edu.institution || ""}
                onChange={(v) => updateEducation(edu.id, "institution", v)}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2020"
                  value={edu.year || ""}
                  onChange={(e) => updateEducation(edu.id, "year", e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl p-3 text-base focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none bg-white"
                />
              </div>
            </div>

            <Question
              label="Specialization / Major (optional)"
              value={edu.specialization || ""}
              onChange={(v) => updateEducation(edu.id, "specialization", v)}
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addEducation}
        className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors font-medium"
      >
        + Add Another Qualification
      </button>
    </div>
  );
}
