"use client";

import { useState } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { ChevronLeft, Save, Loader2 } from "lucide-react";
import { createQuiz } from "../actions";

export default function NewQuizPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    try {
      await createQuiz(formData);
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
      alert("Failed to create quiz");
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/quizzes" className="p-2 rounded-full bg-black/5 hover:bg-black/10 text-gray-600 hover:text-gray-900 transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Quiz</h1>
          <p className="text-sm text-gray-600">Create daily quiz answers.</p>
        </div>
      </div>

      <GlassCard>
        <form action={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="title" className="text-sm font-medium text-gray-700">Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                required
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                placeholder="e.g., Amazon Daily Quiz Answers Today"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="platform" className="text-sm font-medium text-gray-700">Platform</label>
              <select
                id="platform"
                name="platform"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 appearance-none"
              >
                <option value="AMAZON">Amazon</option>
                <option value="FLIPKART">Flipkart</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium text-gray-700">Status</label>
              <select
                id="status"
                name="status"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 appearance-none"
              >
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="prize" className="text-sm font-medium text-gray-700">Prize (Optional)</label>
              <input
                type="text"
                id="prize"
                name="prize"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                placeholder="e.g., Win ₹10,000 Amazon Pay Balance"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="qaPairs" className="text-sm font-medium text-gray-700">Q&A Pairs (JSON format) *</label>
              <textarea
                id="qaPairs"
                name="qaPairs"
                required
                rows={10}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 font-mono text-sm"
                defaultValue={JSON.stringify([
                  { question: "Sample Question 1?", answer: "Sample Answer 1" },
                  { question: "Sample Question 2?", answer: "Sample Answer 2" }
                ], null, 2)}
              />
              <p className="text-xs text-gray-500">Provide an array of objects with &quot;question&quot; and &quot;answer&quot; keys.</p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Settings (Optional)</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="seoTitle" className="text-sm font-medium text-gray-700">SEO Title</label>
                <input
                  type="text"
                  id="seoTitle"
                  name="seoTitle"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                  placeholder="Custom title for search engines"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="seoDesc" className="text-sm font-medium text-gray-700">SEO Description</label>
                <textarea
                  id="seoDesc"
                  name="seoDesc"
                  rows={2}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                  placeholder="Meta description..."
                />
              </div>
            </div>
          </div>

          <div className="pt-6 flex justify-end gap-4">
            <Link href="/admin/quizzes">
              <button type="button" className="px-6 py-2.5 rounded-xl border border-white/10 text-gray-900 hover:bg-black/5 transition-colors">
                Cancel
              </button>
            </Link>
            <GlowButton variant="primary" type="submit" disabled={isSubmitting} className="flex items-center gap-2">
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {isSubmitting ? "Saving..." : "Save Quiz"}
            </GlowButton>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
