// src/components/SearchSpinner.jsx
"use client";

export function Spinner() {

    return(
    <div className="flex justify-center items-center min-h-screen">
    <div className="relative flex items-center justify-center">
      <div className="absolute h-12 w-12 border-4 border-slate-800 rounded-full animate-spin border-t-slate-600"></div>
    </div>
  </div>
    )}