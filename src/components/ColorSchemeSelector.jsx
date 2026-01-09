export const COLOR_SCHEMES = [
  {
    id: "classic",
    name: "Classic",
    primary: "#1f2937", // gray-800
    accent: "#374151", // gray-700
    description: "Professional black & white"
  },
  {
    id: "blue",
    name: "Ocean Blue",
    primary: "#1e40af", // blue-800
    accent: "#3b82f6", // blue-500
    description: "Calm and trustworthy"
  },
  {
    id: "green",
    name: "Forest Green",
    primary: "#166534", // green-800
    accent: "#22c55e", // green-500
    description: "Fresh and balanced"
  },
  {
    id: "purple",
    name: "Royal Purple",
    primary: "#581c87", // purple-800
    accent: "#a855f7", // purple-500
    description: "Creative and unique"
  },
  {
    id: "teal",
    name: "Teal",
    primary: "#115e59", // teal-800
    accent: "#14b8a6", // teal-500
    description: "Modern and clean"
  },
  {
    id: "rose",
    name: "Rose",
    primary: "#9f1239", // rose-800
    accent: "#f43f5e", // rose-500
    description: "Bold and confident"
  }
];

export default function ColorSchemeSelector({ value, onChange }) {
  const selectedScheme = value || "classic";

  return (
    <div>
      <h2 className="font-medium mb-3">Choose a color scheme</h2>
      <p className="text-sm text-gray-500 mb-4">
        This will subtly accent your resume headers and borders.
      </p>

      <div className="grid grid-cols-3 gap-3">
        {COLOR_SCHEMES.map((scheme) => {
          const isSelected = selectedScheme === scheme.id;
          return (
            <button
              key={scheme.id}
              type="button"
              onClick={() => onChange(scheme.id)}
              className={`relative p-3 rounded-xl border-2 transition-all text-left ${
                isSelected
                  ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              {/* Color preview circles */}
              <div className="flex gap-1.5 mb-2">
                <div
                  className="w-5 h-5 rounded-full border border-gray-200"
                  style={{ backgroundColor: scheme.primary }}
                />
                <div
                  className="w-5 h-5 rounded-full border border-gray-200"
                  style={{ backgroundColor: scheme.accent }}
                />
              </div>

              <div className="text-sm font-medium text-gray-900">
                {scheme.name}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {scheme.description}
              </div>

              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
