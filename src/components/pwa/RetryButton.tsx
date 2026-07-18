"use client";

import { RotateCw } from "lucide-react";

export function RetryButton() {
  return (
    <button
      onClick={() => window.location.reload()}
      className="flex items-center justify-center gap-2 bg-gray-900 text-white hover:bg-gray-800 h-10 px-4 py-2 rounded-md font-medium transition-colors w-full sm:w-auto"
    >
      <RotateCw className="w-4 h-4" />
      Retry Connection
    </button>
  );
}
