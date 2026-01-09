export default function Question({ label, value, onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        className="w-full border-2 border-gray-200 rounded-xl p-3 text-base focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none bg-white"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your answer..."
      />
    </div>
  );
}
