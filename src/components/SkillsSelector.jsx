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

      <div className="grid grid-cols-2 gap-2">
        {SKILLS.map((skill) => (
          <label
            key={skill}
            className="flex items-center gap-2 border p-2 rounded cursor-pointer"
          >
            <input
              type="checkbox"
              checked={value.includes(skill)}
              onChange={() => toggleSkill(skill)}
            />
            {skill}
          </label>
        ))}
      </div>
    </div>
  );
}
