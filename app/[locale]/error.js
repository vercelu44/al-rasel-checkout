
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { HiExclamation } from "react-icons/hi";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Next.js Error Boundary caught an error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 text-gray-800 px-4 py-16">
      <div className="flex flex-col items-center space-y-4 max-w-md text-center">
        <HiExclamation className="h-16 w-16 text-yellow-500" />
        <h2 className="text-2xl font-bold">Oops! Something went wrong</h2>
        <p className="text-gray-600 text-sm">
          We encountered an unexpected error while loading this page. Please try refreshing or go back to home.
        </p>
        <div className="flex flex-wrap gap-3 mt-4 justify-center">
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-slate-200 text-slate-800 rounded-lg text-sm font-medium hover:bg-slate-300 transition"
          >
            Refresh Page
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-white transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}