import React, { useState } from "react";
import { FiUploadCloud } from "react-icons/fi";

const FileUploader = ({ onSend }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    await onSend(file);
    setIsUploading(false);
  };

  return (
    <div className="ml-2 relative">
      <label className="cursor-pointer bg-indigo-500 text-white px-3 py-2 rounded hover:bg-indigo-600 transition">
        Fayl seç
        <input
          type="file"
          onChange={handleFileChange}
          hidden
        />
      </label>

      {isUploading && (
        <div className="absolute top-0 right-0">
          <svg className="animate-spin h-5 w-5 text-white ml-2 mt-2" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
