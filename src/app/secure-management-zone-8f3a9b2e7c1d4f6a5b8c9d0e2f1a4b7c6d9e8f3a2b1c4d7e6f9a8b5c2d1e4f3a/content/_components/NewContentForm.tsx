/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createContentDraftAction } from "../actions";
import { ContentType } from "@prisma/client";

export function NewContentForm({
  deals,
}: {
  deals: { id: string; title: string; store: { name: string } }[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const type = formData.get("type") as ContentType;
    const brief = formData.get("brief") as string;
    const dealIds = formData.getAll("dealIds") as string[];

    if (!title || !type || !brief || dealIds.length === 0) {
      setError("Please fill out all fields and select at least one deal.");
      setLoading(false);
      return;
    }

    try {
      const res = await createContentDraftAction({
        title,
        type,
        brief,
        dealIds,
      });
      if (res.success) {
        router.push(
          `/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/content/${res.id}/review`,
        );
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while generating content.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium">Title</label>
        <input
          name="title"
          type="text"
          required
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="e.g. Best Developer Laptops 2026"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Type</label>
        <select
          name="type"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="LISTICLE">Listicle</option>
          <option value="REVIEW">Single Review</option>
          <option value="GUIDE">Buying Guide</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Brief / Instructions</label>
        <textarea
          name="brief"
          required
          rows={4}
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="e.g. Focus on battery life and M-series chips for developers. Mention weight..."
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Select Products / Deals to Feature (Facts Source)
        </label>
        <div className="max-h-60 overflow-y-auto border rounded-md p-2 space-y-2">
          {deals.map((deal) => (
            <label
              key={deal.id}
              className="flex items-start space-x-3 p-2 hover:bg-muted/50 rounded cursor-pointer"
            >
              <input
                type="checkbox"
                name="dealIds"
                value={deal.id}
                className="mt-1 h-4 w-4 rounded border-primary text-primary focus:ring-primary"
              />
              <div>
                <p className="text-sm font-medium leading-none">{deal.title}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {deal.store.name}
                </p>
              </div>
            </label>
          ))}
          {deals.length === 0 && (
            <p className="text-sm text-muted-foreground p-2">
              No deals available. Create deals first.
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 mt-4"
      >
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Generating Draft with AI (Takes ~10s)...
          </>
        ) : (
          "Generate Content Draft"
        )}
      </button>
    </form>
  );
}
