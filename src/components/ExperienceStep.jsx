export default function ExperienceStep({ value, onChange }) {
  const hasExperience = value.hasExperience;

  return (
    <div>
      <h2 className="font-medium mb-3">
        Have you worked before?
      </h2>

      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${
            hasExperience === true
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => onChange({ hasExperience: true })}
        >
          Yes
        </button>

        <button
          className={`px-4 py-2 rounded ${
            hasExperience === false
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => onChange({ hasExperience: false })}
        >
          No
        </button>
      </div>

      {hasExperience && (
        <div className="space-y-3">
          <input
            className="w-full border p-2 rounded"
            placeholder="Job title"
            onChange={(e) =>
              onChange({ ...value, role: e.target.value })
            }
          />
          <input
            className="w-full border p-2 rounded"
            placeholder="What work did you do?"
            onChange={(e) =>
              onChange({ ...value, details: e.target.value })
            }
          />
        </div>
      )}
    </div>
  );
}
