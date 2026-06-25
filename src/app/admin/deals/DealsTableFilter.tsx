"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, List } from "lucide-react";
import { useState, useEffect, useTransition } from "react";

export function DealsTableFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentStatus = searchParams.get("status") || "ALL";
  const currentQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(currentQuery);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query !== currentQuery) {
        startTransition(() => {
          const params = new URLSearchParams(searchParams.toString());
          if (currentStatus && currentStatus !== "ALL")
            params.set("status", currentStatus);
          else params.delete("status");

          if (query) params.set("q", query);
          else params.delete("q");

          router.push(`?${params.toString()}`);
        });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query, currentQuery, currentStatus, searchParams, router]);

  const updateFilters = (status: string, q: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (status && status !== "ALL") params.set("status", status);
      else params.delete("status");

      if (q) params.set("q", q);
      else params.delete("q");

      router.push(`?${params.toString()}`);
    });
  };

  return (
    <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex gap-2">
        {(["ALL", "PUBLISHED", "DRAFT"] as const).map((status) => (
          <button
            key={status}
            onClick={() => updateFilters(status, query)}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition shadow-sm ${
              currentStatus === status
                ? "bg-white text-[var(--color-primary)] border border-blue-200 shadow-md"
                : "bg-transparent text-gray-500 border border-transparent hover:text-gray-900 hover:bg-gray-200"
            }`}
          >
            {status === "ALL"
              ? "All Deals"
              : status === "PUBLISHED"
                ? "Published"
                : "Drafts"}
          </button>
        ))}
      </div>
      <div className="flex gap-2 items-center w-full sm:w-auto">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search deals..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
          />
        </div>
        <button
          className="p-1.5 border border-gray-200 bg-white rounded-md hover:bg-gray-100 transition shadow-sm flex items-center justify-center text-gray-500 hover:text-gray-900"
          title="Filter Options"
        >
          <List size={16} />
        </button>
      </div>
    </div>
  );
}
