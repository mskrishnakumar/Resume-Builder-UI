export default function ExperienceStep({ value, onChange }) {
  const hasExperience = value.hasExperience;

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
          onClick={() => onChange({ hasExperience: true })}
        >
          Yes, I have
        </button>

        <button
          className={`flex-1 py-4 px-6 rounded-xl font-medium transition-all border-2 ${hasExperience === false
              ? "bg-blue-600 text-white border-blue-600 shadow-md"
              : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
            }`}
          onClick={() => onChange({ hasExperience: false })}
        >
          No, I haven't
        </button>
      </div>

      {hasExperience && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
            <input
              className="w-full border-2 border-gray-200 rounded-xl p-4 text-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
              placeholder="e.g. Sales Assistant"
              value={value.role || ""}
              onChange={(e) =>
                onChange({ ...value, role: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">What did you do?</label>
            <textarea
              className="w-full border-2 border-gray-200 rounded-xl p-4 text-base focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
              placeholder="Describe your main tasks..."
              rows={3}
              value={value.details || ""}
              onChange={(e) =>
                onChange({ ...value, details: e.target.value })
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
