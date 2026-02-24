"use client"; // if you plan to use client-side interactivity

import { HiExclamation } from "react-icons/hi";

export default function FallbackUI({ message }) {
  
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 text-gray-800 px-4">
      <div className="flex flex-col items-center space-y-4">
        <HiExclamation className="h-16 w-16 text-yellow-500" />
        <h1 className="text-2xl font-semibold">Oops! Something went wrong.</h1>
        <p className="text-center text-gray-600 max-w-md">
          {message || "We couldn't load the data. Please try again later."}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-slate-200 text-slate-900 rounded-lg transition"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
}