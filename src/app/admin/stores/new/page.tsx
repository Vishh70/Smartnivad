"use client";

import { useState } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { ChevronLeft, Save, Loader2 } from "lucide-react";
import { createStore } from "../actions";

export default function NewStorePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    try {
      await createStore(formData);
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
      alert("Failed to create store");
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/stores" className="p-2 rounded-full bg-black/5 hover:bg-black/10 text-gray-600 hover:text-gray-900 transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Store</h1>
          <p className="text-sm text-gray-600">Create a new affiliate store.</p>
        </div>
      </div>

      <GlassCard>
        <form action={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">Store Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                placeholder="e.g., Amazon"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="logoUrl" className="text-sm font-medium text-gray-700">Logo URL</label>
              <input
                type="url"
                id="logoUrl"
                name="logoUrl"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="website" className="text-sm font-medium text-gray-700">Website URL</label>
              <input
                type="url"
                id="website"
                name="website"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                placeholder="https://amazon.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="affiliateBaseUrl" className="text-sm font-medium text-gray-700">Affiliate Base URL</label>
              <input
                type="url"
                id="affiliateBaseUrl"
                name="affiliateBaseUrl"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                placeholder="https://amzn.to/..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
              placeholder="Brief description of this store..."
            />
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
            <Link href="/admin/stores">
              <button type="button" className="px-6 py-2.5 rounded-xl border border-white/10 text-gray-900 hover:bg-black/5 transition-colors">
                Cancel
              </button>
            </Link>
            <GlowButton variant="primary" type="submit" disabled={isSubmitting} className="flex items-center gap-2">
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {isSubmitting ? "Saving..." : "Save Store"}
            </GlowButton>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
