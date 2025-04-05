import React, { useState } from "react";

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
    <div className="ms-4 relative">
      <label className="cursor-pointer p-2 rounded-full hover:bg-gray-200 transition">
        
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 12V4m0 0L8 8m4-4l4 4"
          />
        </svg>

        <input
          type="file"
          onChange={handleFileChange}
          hidden
        />
      </label>

      {isUploading && (
        <div className="absolute top-0 right-0">
          <svg
            className="animate-spin h-4 w-4 text-gray-500 ml-1 mt-1"
            viewBox="0 0 24 24"
          >
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
