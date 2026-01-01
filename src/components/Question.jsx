export default function Question({ label, value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-lg font-medium text-gray-800">
        {label}
      </label>
      <input
        className="w-full border-2 border-gray-200 rounded-xl p-4 text-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your answer..."
      />
    </div>
  );
}
