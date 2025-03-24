// ImageUploader.js
"use client";

import { useCallback } from "react";

const ImageUploader = ({ onFileSelect, preview }) => {
  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  return (
    <div className="flex flex-col gap-2">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:text-blue-700
          file:bg-blue-900 dark:file:text-blue-100
          hover:file:bg-blue-800"
      />
      {preview && (
        <div className="mt-2">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;