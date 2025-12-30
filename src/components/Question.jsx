export default function Question({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-gray-700 font-medium mb-2">
        {label}
      </label>
      <input
        className="w-full border border-gray-300 rounded-lg p-3"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your answer"
      />
    </div>
  );
}
