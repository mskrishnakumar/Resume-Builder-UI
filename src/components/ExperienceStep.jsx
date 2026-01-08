export default function ExperienceStep({ value, onChange }) {
  const hasExperience = value.hasExperience;
  const experiences = value.experiences || [];

  const addExperience = () => {
    const newExperience = {
      id: Date.now(),
      company: "",
      role: "",
      startDate: "",
      endDate: "",
      details: ""
    };
    onChange({ ...value, experiences: [...experiences, newExperience] });
  };

  const updateExperience = (id, field, fieldValue) => {
    const updated = experiences.map((exp) =>
      exp.id === id ? { ...exp, [field]: fieldValue } : exp
    );
    onChange({ ...value, experiences: updated });
  };

  const removeExperience = (id) => {
    const updated = experiences.filter((exp) => exp.id !== id);
    onChange({ ...value, experiences: updated });
  };

  const handleHasExperienceChange = (hasExp) => {
    if (hasExp && experiences.length === 0) {
      // Add first experience entry when user says "Yes"
      onChange({
        hasExperience: hasExp,
        experiences: [{
          id: Date.now(),
          company: "",
          role: "",
          startDate: "",
          endDate: "",
          details: ""
        }]
      });
    } else {
      onChange({ ...value, hasExperience: hasExp });
    }
  };

  return (
    <div>
      <h2 className="font-medium mb-3">
        Have you worked before?
      </h2>

      <div className="flex gap-4 mb-6">
        <button
          className={`flex-1 py-4 px-6 rounded-xl font-medium transition-all border-2 ${hasExperience === true
              ? "bg-blue-600 text-white border-blue-600 shadow-md"
              : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
            }`}
          onClick={() => handleHasExperienceChange(true)}
        >
          Yes, I have
        </button>

        <button
          className={`flex-1 py-4 px-6 rounded-xl font-medium transition-all border-2 ${hasExperience === false
              ? "bg-blue-600 text-white border-blue-600 shadow-md"
              : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
            }`}
          onClick={() => handleHasExperienceChange(false)}
        >
          No, I haven't
        </button>
      </div>

      {hasExperience && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
          {experiences.map((exp, index) => (
            <div key={exp.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-700">
                  Experience {index + 1}
                </h3>
                {experiences.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeExperience(exp.id)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <input
                      className="w-full border-2 border-gray-200 rounded-xl p-3 text-base focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none bg-white"
                      placeholder="e.g. ABC Corp"
                      value={exp.company || ""}
                      onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                    <input
                      className="w-full border-2 border-gray-200 rounded-xl p-3 text-base focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none bg-white"
                      placeholder="e.g. Sales Assistant"
                      value={exp.role || ""}
                      onChange={(e) => updateExperience(exp.id, "role", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="month"
                      className="w-full border-2 border-gray-200 rounded-xl p-3 text-base focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none bg-white"
                      value={exp.startDate || ""}
                      onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="month"
                      className="w-full border-2 border-gray-200 rounded-xl p-3 text-base focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none bg-white"
                      placeholder="Leave empty if current"
                      value={exp.endDate || ""}
                      onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">What did you do?</label>
                  <textarea
                    className="w-full border-2 border-gray-200 rounded-xl p-3 text-base focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none bg-white"
                    placeholder="Describe your main tasks and achievements..."
                    rows={3}
                    value={exp.details || ""}
                    onChange={(e) => updateExperience(exp.id, "details", e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addExperience}
            className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors font-medium"
          >
            + Add Another Experience
          </button>
        </div>
      )}
    </div>
  );
}
