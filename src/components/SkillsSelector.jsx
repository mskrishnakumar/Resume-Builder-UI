import { useState } from "react";

const SKILLS = [
  "Communication",
  "Customer Handling",
  "MS Word",
  "MS Excel",
  "Data Entry",
  "Teamwork",
  "Time Management"
];

export default function SkillsSelector({ value, onChange }) {
  const [customSkill, setCustomSkill] = useState("");

  const toggleSkill = (skill) => {
    if (value.includes(skill)) {
      onChange(value.filter((s) => s !== skill));
    } else {
      onChange([...value, skill]);
    }
  };

  const addCustomSkill = () => {
    const trimmed = customSkill.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setCustomSkill("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCustomSkill();
    }
  };

  // Separate predefined skills from custom skills
  const customSkills = value.filter((s) => !SKILLS.includes(s));

  return (
    <div>
      <h2 className="font-medium mb-3">
        Select skills you have
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {SKILLS.map((skill) => {
          const isSelected = value.includes(skill);
          return (
            <label
              key={skill}
              className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer border-2 transition-all ${isSelected
                  ? "border-blue-500 bg-blue-50 text-blue-700 font-medium"
                  : "border-gray-100 hover:border-blue-200 bg-white text-gray-700"
                }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? "border-blue-500 bg-blue-500" : "border-gray-300"
                }`}>
                {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <input
                type="checkbox"
                className="hidden"
                checked={isSelected}
                onChange={() => toggleSkill(skill)}
              />
              {skill}
            </label>
          );
        })}
      </div>

      {/* Custom Skills Display */}
      {customSkills.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-2">Custom skills:</p>
          <div className="flex flex-wrap gap-2">
            {customSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1.5 rounded-lg text-sm"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className="text-blue-400 hover:text-blue-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Add Custom Skill Input */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Add a custom skill
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={customSkill}
            onChange={(e) => setCustomSkill(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. Python, Project Management"
            className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-base focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
          />
          <button
            type="button"
            onClick={addCustomSkill}
            disabled={!customSkill.trim()}
            className="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
