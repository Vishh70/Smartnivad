"use client";

import { useState } from "react";
import { GlowButton } from "@/components/ui/GlowButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { createDeal, updateDeal } from "../actions";
import { Sparkles, Loader2 } from "lucide-react";

interface DealFormInitialData {
  id: string;
  title: string;
  description: string | null;
  currentPrice: number;
  originalPrice: number;
  affiliateUrl: string;
  categoryId: string;
  storeId: string;
  dealType: string;
  isFeatured: boolean;
  imageUrl: string | null;
  aiSummary: string | null;
  pros: string | null;
  cons: string | null;
  tags: string[];
  seoTitle: string | null;
  seoDesc: string | null;
}

interface DealFormProps {
  categories: { id: string; name: string }[];
  stores: { id: string; name: string }[];
  initialData?: DealFormInitialData;
}

export function DealForm({ categories, stores, initialData }: DealFormProps) {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");

  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || "",
  );
  const [currentPrice, setCurrentPrice] = useState(
    initialData?.currentPrice || "",
  );
  const [originalPrice, setOriginalPrice] = useState(
    initialData?.originalPrice || "",
  );

  // AI fields
  const [aiSummary, setAiSummary] = useState(initialData?.aiSummary || "");
  const [pros, setPros] = useState(
    initialData?.pros ? initialData.pros.split("||").join("\n") : "",
  );
  const [cons, setCons] = useState(
    initialData?.cons ? initialData.cons.split("||").join("\n") : "",
  );
  const [tags, setTags] = useState(initialData?.tags?.join(", ") || "");
  const [seoTitle, setSeoTitle] = useState(initialData?.seoTitle || "");
  const [seoDesc, setSeoDesc] = useState(initialData?.seoDesc || "");

  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isGeneratingSeo, setIsGeneratingSeo] = useState(false);
  const [scrapeUrl, setScrapeUrl] = useState("");
  const [isScraping, setIsScraping] = useState(false);

  const handleScrape = async () => {
    if (!scrapeUrl) return alert("Please enter a URL to scrape.");
    setIsScraping(true);
    try {
      const res = await fetch(
        `/api/admin/scrape?url=${encodeURIComponent(scrapeUrl)}`,
      );
      if (!res.ok) throw new Error("Failed to scrape URL");
      const data = await res.json();

      if (data.title) setTitle(data.title);
      if (data.description) setDescription(data.description);
      if (data.image) setImageUrl(data.image);
      if (data.price) {
        setCurrentPrice(data.price.toString());
        setOriginalPrice(data.price.toString());
      }
    } catch (err: unknown) {
      alert(
        "Scraping failed: " +
          (err instanceof Error ? err.message : "Unknown error"),
      );
    } finally {
      setIsScraping(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    // Simulate Cloudinary upload delay
    await new Promise((r) => setTimeout(r, 1500));
    // Provide a placeholder image URL for testing
    setImageUrl(
      "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
    );
    setUploading(false);
  };

  const handleGenerateSummary = async () => {
    if (!title) return alert("Please enter a title first");
    setIsSummarizing(true);
    try {
      const res = await fetch("/api/ai/summarize", {
        method: "POST",
        body: JSON.stringify({
          productTitle: title,
          productDescription: description,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setAiSummary(data.summary || "");
      setPros((data.pros || []).join("\n"));
      setCons((data.cons || []).join("\n"));
      setTags((data.tags || []).join(", "));
    } catch (err: unknown) {
      alert(
        "AI Generation failed: " +
          (err instanceof Error ? err.message : "Unknown error"),
      );
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleGenerateSeo = async () => {
    if (!title) return alert("Please enter a title first");
    setIsGeneratingSeo(true);
    try {
      const res = await fetch("/api/ai/seo", {
        method: "POST",
        body: JSON.stringify({
          productTitle: title,
          description: aiSummary || description,
          price: currentPrice,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setSeoTitle(data.seoTitle || "");
      setSeoDesc(data.seoDescription || "");
      if (data.keywords) {
        setTags(data.keywords.join(", "));
      }
    } catch (err: unknown) {
      alert(
        "AI SEO Generation failed: " +
          (err instanceof Error ? err.message : "Unknown error"),
      );
    } finally {
      setIsGeneratingSeo(false);
    }
  };

  return (
    <GlassCard className="max-w-4xl">
      <form
        action={initialData ? updateDeal : createDeal}
        className="space-y-8"
      >
        {initialData && (
          <input type="hidden" name="dealId" value={initialData.id} />
        )}

        <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-2xl mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <Sparkles size={18} className="text-blue-500" />
            Auto-Fill from Link
          </h3>
          <p className="text-sm text-blue-700 mb-4">
            Paste an Amazon or Flipkart URL to automatically extract the title,
            description, and images.
          </p>
          <div className="flex gap-3">
            <input
              type="url"
              placeholder="https://amazon.in/..."
              value={scrapeUrl}
              onChange={(e) => setScrapeUrl(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-white border border-blue-200 text-gray-900 focus:border-blue-500 outline-none"
            />
            <button
              type="button"
              onClick={handleScrape}
              disabled={isScraping}
              className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              {isScraping ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                "Scrape Deal"
              )}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deal Title *
            </label>
            <input
              type="text"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 focus:border-[var(--color-primary)] outline-none"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 focus:border-[var(--color-primary)] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Price (₹) *
            </label>
            <input
              type="number"
              step="0.01"
              name="currentPrice"
              value={currentPrice}
              onChange={(e) => setCurrentPrice(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 focus:border-[var(--color-primary)] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Original Price (₹) *
            </label>
            <input
              type="number"
              step="0.01"
              name="originalPrice"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 focus:border-[var(--color-primary)] outline-none"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Affiliate URL *
            </label>
            <input
              type="url"
              name="affiliateUrl"
              defaultValue={initialData?.affiliateUrl}
              required
              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 focus:border-[var(--color-primary)] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              name="categoryId"
              defaultValue={initialData?.categoryId}
              required
              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 focus:border-[var(--color-primary)] outline-none"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Store *
            </label>
            <select
              name="storeId"
              defaultValue={initialData?.storeId}
              required
              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 focus:border-[var(--color-primary)] outline-none"
            >
              {stores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deal Type *
            </label>
            <select
              name="dealType"
              defaultValue={initialData?.dealType || "LIVE"}
              required
              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 focus:border-[var(--color-primary)] outline-none"
            >
              <option value="LIVE">Live Deal</option>
              <option value="HOT">Hot Deal</option>
            </select>
          </div>

          <div className="flex items-center gap-3 pt-8">
            <input
              type="checkbox"
              name="isFeatured"
              id="isFeatured"
              defaultChecked={initialData?.isFeatured}
              className="w-5 h-5 accent-[var(--color-primary)]"
            />
            <label
              htmlFor="isFeatured"
              className="text-sm font-medium text-gray-700"
            >
              Feature on Homepage
            </label>
          </div>

          <div className="col-span-2 mt-4 p-6 border border-dashed border-gray-300 rounded-xl bg-gray-50">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Product Image
            </label>
            {imageUrl ? (
              <div className="space-y-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="Uploaded preview"
                  className="h-40 object-contain rounded"
                />
                <input type="hidden" name="imageUrl" value={imageUrl} />
                <button
                  type="button"
                  onClick={() => setImageUrl("")}
                  className="text-sm text-red-400 hover:text-red-300"
                >
                  Remove Image
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <GlowButton
                  type="button"
                  variant="secondary"
                  disabled={uploading}
                >
                  {uploading ? "Uploading to Cloudinary..." : "Upload Image"}
                </GlowButton>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 mt-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">
              AI Enhanced Details
            </h3>
            <button
              type="button"
              onClick={handleGenerateSummary}
              disabled={isSummarizing || !title}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)]/20 text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary)]/30 transition-colors text-sm font-medium disabled:opacity-50"
            >
              {isSummarizing ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Sparkles size={16} />
              )}
              Auto-Generate Details
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AI Summary
              </label>
              <textarea
                name="aiSummary"
                value={aiSummary}
                onChange={(e) => setAiSummary(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 focus:border-[var(--color-primary)] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pros (one per line)
              </label>
              <textarea
                name="pros"
                value={pros}
                onChange={(e) => setPros(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 focus:border-[var(--color-primary)] outline-none"
                placeholder="Great battery life\nStunning display"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cons (one per line)
              </label>
              <textarea
                name="cons"
                value={cons}
                onChange={(e) => setCons(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 focus:border-[var(--color-primary)] outline-none"
                placeholder="Expensive\nNo charger included"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                name="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 focus:border-[var(--color-primary)] outline-none"
                placeholder="smartphone, apple, 5g"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 mt-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">
              SEO Metadata
            </h3>
            <button
              type="button"
              onClick={handleGenerateSeo}
              disabled={isGeneratingSeo || !title}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)]/20 text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary)]/30 transition-colors text-sm font-medium disabled:opacity-50"
            >
              {isGeneratingSeo ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Sparkles size={16} />
              )}
              Auto-Generate SEO
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SEO Title
              </label>
              <input
                type="text"
                name="seoTitle"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 focus:border-[var(--color-primary)] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SEO Description
              </label>
              <textarea
                name="seoDesc"
                value={seoDesc}
                onChange={(e) => setSeoDesc(e.target.value)}
                rows={2}
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 focus:border-[var(--color-primary)] outline-none"
              />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200 flex justify-end">
          <GlowButton type="submit" variant="primary">
            {initialData ? "Update Deal" : "Publish Deal"}
          </GlowButton>
        </div>
      </form>
    </GlassCard>
  );
}
