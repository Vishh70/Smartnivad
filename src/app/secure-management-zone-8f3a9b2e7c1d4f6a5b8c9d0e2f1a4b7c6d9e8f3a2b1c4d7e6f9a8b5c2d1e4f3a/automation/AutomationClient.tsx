"use client";

import { useState, useTransition } from "react";
import {
  Play,
  RefreshCw,
  PlusCircle,
  CheckCircle,
  AlertTriangle,
  Eye,
  Bot,
  ShieldCheck,
  Clock,
} from "lucide-react";
import {
  triggerDiscoveryAction,
  triggerPriceRefreshAction,
  triggerManualImportAction,
  approveReviewDealAction,
  rejectReviewDealAction,
} from "./actions";
import { DiscoveryResult } from "@/lib/affiliate/discovery";

interface AutomationClientProps {
  providerStatuses: Array<{
    provider: string;
    name: string;
    isConfigured: boolean;
    isPaused: boolean;
    statusMessage: string;
    trackingTag: string;
    marketplace: string;
    rateLimitPerSecond: number;
  }>;
  reviewQueueDeals: Array<{
    id: string;
    title: string;
    slug: string;
    currentPrice: number;
    discount: number;
    reviewReason?: string | null;
    store?: { name: string } | null;
  }>;
  recentRuns: Array<{
    id: string;
    provider: string;
    keyword?: string | null;
    foundCount: number;
    createdCount: number;
    updatedCount: number;
    status: string;
    durationMs: number;
    createdAt: Date | string;
  }>;
  categories: Array<{ id: string; name: string; slug: string }>;
}

export function AutomationClient({
  providerStatuses,
  reviewQueueDeals,
  recentRuns,
}: AutomationClientProps) {
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<
    "discovery" | "import" | "review" | "history"
  >("discovery");
  const [discoveryResult, setDiscoveryResult] =
    useState<DiscoveryResult | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Form states
  const [provider, setProvider] = useState("AMAZON");
  const [keywords, setKeywords] = useState(
    "gaming laptop, noise cancelling headphones",
  );
  const [batchSize, setBatchSize] = useState("10");
  const [dryRun, setDryRun] = useState(true);
  const [autoPublish, setAutoPublish] = useState(false);

  // Manual import form states
  const [importUrl, setImportUrl] = useState("");
  const [importTitle, setImportTitle] = useState("");
  const [importPrice, setImportPrice] = useState("");
  const [importOrigPrice, setImportOrigPrice] = useState("");
  const [importImage, setImportImage] = useState("");

  const handleRunDiscovery = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    setDiscoveryResult(null);

    const formData = new FormData();
    formData.set("provider", provider);
    formData.set("keywords", keywords);
    formData.set("batchSize", batchSize);
    formData.set("dryRun", dryRun ? "true" : "false");
    formData.set("autoPublish", autoPublish ? "true" : "false");

    startTransition(async () => {
      try {
        const res = await triggerDiscoveryAction(formData);
        setDiscoveryResult(res);
        setStatusMessage(res.message);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        setStatusMessage(`Discovery Error: ${msg}`);
      }
    });
  };

  const handlePriceRefresh = () => {
    setStatusMessage(null);
    startTransition(async () => {
      try {
        const res = await triggerPriceRefreshAction();
        setStatusMessage(
          `Price Monitoring Batch Finished: ${res.updated} updated, ${res.unchanged} unchanged, ${res.failed} failed.`,
        );
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        setStatusMessage(`Price refresh failed: ${msg}`);
      }
    });
  };

  const handleManualImport = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    const formData = new FormData();
    formData.set("urlOrAsin", importUrl);
    formData.set("store", provider === "AMAZON" ? "Amazon" : "Flipkart");
    if (importTitle) formData.set("title", importTitle);
    if (importPrice) formData.set("price", importPrice);
    if (importOrigPrice) formData.set("originalPrice", importOrigPrice);
    if (importImage) formData.set("imageUrl", importImage);

    startTransition(async () => {
      try {
        const res = await triggerManualImportAction(formData);
        setStatusMessage(
          `Successfully imported: ${res.createdCount} product created.`,
        );
        setImportUrl("");
        setImportTitle("");
        setImportPrice("");
        setImportOrigPrice("");
        setImportImage("");
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        setStatusMessage(`Import failed: ${msg}`);
      }
    });
  };

  const handleApproveDeal = (dealId: string) => {
    startTransition(async () => {
      try {
        await approveReviewDealAction(dealId);
        setStatusMessage("Deal approved and published successfully.");
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        setStatusMessage(`Approval failed: ${msg}`);
      }
    });
  };

  const handleRejectDeal = (dealId: string) => {
    startTransition(async () => {
      try {
        await rejectReviewDealAction(dealId);
        setStatusMessage("Deal rejected and deleted.");
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        setStatusMessage(`Rejection failed: ${msg}`);
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* ── Status Message Banner ── */}
      {statusMessage && (
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="text-blue-600 shrink-0" size={18} />
            <span className="text-sm font-medium">{statusMessage}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-xs text-blue-600 hover:underline font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ── Providers Status Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {providerStatuses.map((p) => (
          <div
            key={p.provider}
            className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-black text-gray-800">
                    {p.provider === "AMAZON" ? "AZ" : "FK"}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">
                      {p.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Marketplace: {p.marketplace}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 ${
                    p.isConfigured
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {p.isConfigured ? (
                    <>
                      <ShieldCheck size={12} /> API Connected
                    </>
                  ) : (
                    <>
                      <AlertTriangle size={12} /> Manual Import Ready
                    </>
                  )}
                </span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                {p.statusMessage}
              </p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs text-gray-500">
              <span>
                Tracking Tag:{" "}
                <strong className="text-gray-800">{p.trackingTag}</strong>
              </span>
              <span>Rate Limit: {p.rateLimitPerSecond} req/sec</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Tab Navigation ── */}
      <div className="flex border-b border-gray-200 gap-2">
        <button
          onClick={() => setActiveTab("discovery")}
          className={`pb-3 px-4 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "discovery"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <Bot size={16} /> Discovery Engine
        </button>
        <button
          onClick={() => setActiveTab("import")}
          className={`pb-3 px-4 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "import"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <PlusCircle size={16} /> Verified Product Importer
        </button>
        <button
          onClick={() => setActiveTab("review")}
          className={`pb-3 px-4 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "review"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <AlertTriangle size={16} /> Review Queue ({reviewQueueDeals.length})
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`pb-3 px-4 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "history"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <Clock size={16} /> Run History
        </button>
      </div>

      {/* ── TAB 1: Discovery Engine ── */}
      {activeTab === "discovery" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
              <Bot className="text-blue-600" size={20} /> Launch Product
              Discovery
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              Search authorized provider catalogs by keywords. Deduplication
              automatically preserves existing records and updates live pricing.
            </p>

            <form onSubmit={handleRunDiscovery} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Affiliate Provider
                  </label>
                  <select
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="AMAZON">
                      Amazon India (Creators / PA-API)
                    </option>
                    <option value="FLIPKART">Flipkart Affiliate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Batch Size (Bounded)
                  </label>
                  <select
                    value={batchSize}
                    onChange={(e) => setBatchSize(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="5">5 products</option>
                    <option value="10">10 products</option>
                    <option value="20">20 products</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Search Keywords (comma separated)
                </label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="e.g. macbook m3, sony headphones, smart watch"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dryRun}
                    onChange={(e) => setDryRun(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <div>
                    <span className="text-xs font-bold text-gray-800 block">
                      Dry Run Mode
                    </span>
                    <span className="text-[11px] text-gray-500">
                      Preview without writing to database
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoPublish}
                    onChange={(e) => setAutoPublish(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <div>
                    <span className="text-xs font-bold text-gray-800 block">
                      Auto-Publish
                    </span>
                    <span className="text-[11px] text-gray-500">
                      Publish immediately instead of draft
                    </span>
                  </div>
                </label>
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isPending ? (
                    <RefreshCw className="animate-spin" size={16} />
                  ) : (
                    <Play size={16} />
                  )}
                  {dryRun ? "Run Dry-Run Discovery" : "Execute Live Discovery"}
                </button>
              </div>
            </form>
          </div>

          {/* Quick Actions Column */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h4 className="font-bold text-gray-900 text-sm mb-2 flex items-center gap-2">
                <RefreshCw className="text-indigo-600" size={18} /> Price
                Refresh Batch
              </h4>
              <p className="text-xs text-gray-500 mb-4">
                Trigger an on-demand verified price check on the oldest checked
                products.
              </p>
              <button
                onClick={handlePriceRefresh}
                disabled={isPending}
                className="w-full py-2.5 px-4 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <RefreshCw
                  size={14}
                  className={isPending ? "animate-spin" : ""}
                />{" "}
                Run Price Check Batch (20 items)
              </button>
            </div>

            {discoveryResult && (
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 shadow-sm text-xs space-y-2">
                <h5 className="font-bold text-gray-800 uppercase tracking-wider text-[11px]">
                  Discovery Summary
                </h5>
                <div className="grid grid-cols-2 gap-2 text-gray-600">
                  <div className="bg-white p-2 rounded-lg border">
                    Candidates: <strong>{discoveryResult.foundCount}</strong>
                  </div>
                  <div className="bg-white p-2 rounded-lg border text-green-700">
                    Created: <strong>{discoveryResult.createdCount}</strong>
                  </div>
                  <div className="bg-white p-2 rounded-lg border text-blue-700">
                    Updated: <strong>{discoveryResult.updatedCount}</strong>
                  </div>
                  <div className="bg-white p-2 rounded-lg border text-amber-700">
                    Review: <strong>{discoveryResult.reviewQueueCount}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 2: Verified Product Importer ── */}
      {activeTab === "import" && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm max-w-2xl">
          <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
            <PlusCircle className="text-blue-600" size={20} /> Import Verified
            Product
          </h3>
          <p className="text-xs text-gray-500 mb-6">
            Enter an Amazon ASIN / URL or Flipkart URL. Affiliate tracking
            parameters will be formatted automatically.
          </p>

          <form onSubmit={handleManualImport} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Amazon ASIN or Product URL *
              </label>
              <input
                type="text"
                required
                value={importUrl}
                onChange={(e) => setImportUrl(e.target.value)}
                placeholder="e.g. B0BDK62PDX or https://www.amazon.in/dp/..."
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="pt-2 border-t border-gray-100">
              <span className="text-xs text-gray-400 font-semibold block mb-3">
                Optional Manual Verified Overrides (if API is unconfigured):
              </span>
              <div className="space-y-3">
                <input
                  type="text"
                  value={importTitle}
                  onChange={(e) => setImportTitle(e.target.value)}
                  placeholder="Verified Product Title"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    step="0.01"
                    value={importPrice}
                    onChange={(e) => setImportPrice(e.target.value)}
                    placeholder="Current Price (₹)"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                  />
                  <input
                    type="number"
                    step="0.01"
                    value={importOrigPrice}
                    onChange={(e) => setImportOrigPrice(e.target.value)}
                    placeholder="Original / MRP (₹)"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
                <input
                  type="url"
                  value={importImage}
                  onChange={(e) => setImportImage(e.target.value)}
                  placeholder="Product Image URL (https://...)"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 mt-4"
            >
              {isPending ? (
                <RefreshCw className="animate-spin" size={16} />
              ) : (
                <PlusCircle size={16} />
              )}
              Import & Publish Verified Deal
            </button>
          </form>
        </div>
      )}

      {/* ── TAB 3: Review Queue ── */}
      {activeTab === "review" && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
            <AlertTriangle className="text-amber-500" size={20} /> Admin Review
            Queue
          </h3>
          <p className="text-xs text-gray-500 mb-6">
            Products flagged due to suspicious pricing anomalies (e.g. &gt;85%
            discount), missing images, or 5+ consecutive provider check
            failures.
          </p>

          {reviewQueueDeals.length === 0 ? (
            <div className="text-center py-12 text-gray-400 font-medium text-sm">
              No products currently in review queue. All catalog deals verified!
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {reviewQueueDeals.map((deal) => (
                <div
                  key={deal.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm line-clamp-1">
                      {deal.title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                      <span>
                        Store: <strong>{deal.store?.name}</strong>
                      </span>
                      <span>
                        Price: <strong>₹{deal.currentPrice}</strong>
                      </span>
                      <span>
                        Discount: <strong>{deal.discount}%</strong>
                      </span>
                    </div>
                    {deal.reviewReason && (
                      <span className="inline-block mt-2 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                        Reason: {deal.reviewReason}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={`/product/${deal.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                      title="Preview Product"
                    >
                      <Eye size={16} />
                    </a>
                    <button
                      onClick={() => handleApproveDeal(deal.id)}
                      disabled={isPending}
                      className="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-bold transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleRejectDeal(deal.id)}
                      disabled={isPending}
                      className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TAB 4: Run History ── */}
      {activeTab === "history" && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="text-gray-600" size={20} /> Discovery & Worker
            Runs
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 uppercase tracking-wider font-bold">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Provider</th>
                  <th className="py-2.5 px-3">Keywords</th>
                  <th className="py-2.5 px-3">Found</th>
                  <th className="py-2.5 px-3">Created</th>
                  <th className="py-2.5 px-3">Updated</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentRuns.map((run) => (
                  <tr key={run.id} className="hover:bg-gray-50">
                    <td className="py-2.5 px-3 font-medium text-gray-700">
                      {new Date(run.createdAt).toLocaleString("en-IN")}
                    </td>
                    <td className="py-2.5 px-3 font-bold">{run.provider}</td>
                    <td className="py-2.5 px-3 text-gray-500 max-w-[200px] truncate">
                      {run.keyword || "—"}
                    </td>
                    <td className="py-2.5 px-3">{run.foundCount}</td>
                    <td className="py-2.5 px-3 text-green-600 font-bold">
                      {run.createdCount}
                    </td>
                    <td className="py-2.5 px-3 text-blue-600 font-bold">
                      {run.updatedCount}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800">
                        {run.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-gray-400">
                      {(run.durationMs / 1000).toFixed(2)}s
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
