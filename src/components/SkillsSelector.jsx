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
  const toggleSkill = (skill) => {
    if (value.includes(skill)) {
      onChange(value.filter((s) => s !== skill));
    } else {
      onChange([...value, skill]);
    }
  };

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
    </div>
  );
}
