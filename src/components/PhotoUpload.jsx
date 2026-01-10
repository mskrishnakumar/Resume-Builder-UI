import { useRef } from "react";

export default function PhotoUpload({ value, onChange }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    // Convert to base64 with compression
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Max dimensions (e.g., 500px)
        const maxWidth = 500;
        const maxHeight = 500;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob/dataURL with high compression
        // jpeg format with 0.7 quality is very small
        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.7);
        onChange(compressedDataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Passport Photo (optional)
      </label>

      <div className="flex items-start gap-4">
        {/* Photo Preview / Upload Area */}
        <div
          onClick={!value ? triggerFileInput : undefined}
          className={`relative w-32 h-40 rounded-lg border-2 border-dashed overflow-hidden flex items-center justify-center
            ${!value ? "border-gray-300 hover:border-blue-400 cursor-pointer bg-gray-50 hover:bg-blue-50" : "border-gray-200 bg-white"}
            transition-colors`}
        >
          {value ? (
            <img
              src={value}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 mx-auto text-gray-400 mb-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              <span className="text-xs text-gray-500">Upload Photo</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={triggerFileInput}
            className="px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
          >
            {value ? "Change Photo" : "Select Photo"}
          </button>

          {value && (
            <button
              type="button"
              onClick={handleRemove}
              className="px-3 py-2 text-sm font-medium text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              Remove
            </button>
          )}

          <p className="text-xs text-gray-400 mt-1">
            JPG, PNG. Max 5MB.<br />
            Passport size (35x45mm)
          </p>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Future AI enhancement placeholder */}
      {value && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>AI Enhancement coming soon</span>
          </div>
        </div>
      )}
    </div>
  );
}
