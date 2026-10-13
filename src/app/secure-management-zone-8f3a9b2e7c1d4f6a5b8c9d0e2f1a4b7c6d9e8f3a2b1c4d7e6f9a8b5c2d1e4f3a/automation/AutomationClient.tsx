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
  Link2,
  ExternalLink,
  Inbox,
  CheckCircle2,
  AlertCircle,
  Zap,
  Sparkles,
} from "lucide-react";
import {
  triggerDiscoveryAction,
  triggerPriceRefreshAction,
  triggerManualImportAction,
  approveReviewDealAction,
  rejectReviewDealAction,
  triggerAmazonLinkImportAction,
  triggerOneLinkImportAction,
  retryImportQueueItemAction,
} from "./actions";
import { DiscoveryResult } from "@/lib/affiliate/discovery";
import {
  AmazonImportSummary,
  ImportCandidateAudit,
} from "@/lib/affiliate/import-service";

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
  importQueueItems?: Array<{
    id: string;
    sourceUrl: string;
    resolvedUrl?: string | null;
    asin?: string | null;
    status: string;
    pendingReason?: string | null;
    trackingTag?: string | null;
    isTrackingVerified: boolean;
    createdAt: Date | string;
  }>;
}

export function AutomationClient({
  providerStatuses,
  reviewQueueDeals,
  recentRuns,
  importQueueItems = [],
}: AutomationClientProps) {
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<
    "discovery" | "amazon-links" | "queue" | "import" | "review" | "history"
  >("amazon-links");
  const [discoveryResult, setDiscoveryResult] =
    useState<DiscoveryResult | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Amazon Link Import form states
  const DEFAULT_CANDIDATE_LINKS = `https://amzn.to/3VKp4AG
https://amzn.to/3TYvcVs
https://amzn.to/4yKV71P
https://amzn.to/3TYvdJ0
https://link.amazon/B05YNFlPW`;

  const [amazonLinksText, setAmazonLinksText] = useState(
    DEFAULT_CANDIDATE_LINKS,
  );
  const [linkDryRun, setLinkDryRun] = useState(false);
  const [linkAutoPublish, setLinkAutoPublish] = useState(true);
  const [linkImportResult, setLinkImportResult] =
    useState<AmazonImportSummary | null>(null);

  // One-Link Engine state
  const [importMode, setImportMode] = useState<"single" | "bulk">("single");
  const [singleLinkUrl, setSingleLinkUrl] = useState("");
  const [singleLinkResult, setSingleLinkResult] =
    useState<ImportCandidateAudit | null>(null);

  const handleSingleLinkImport = (overrideDryRun?: boolean) => {
    if (!singleLinkUrl.trim()) {
      setStatusMessage("Please enter an Amazon product URL.");
      return;
    }
    setStatusMessage(null);
    const useDryRun =
      overrideDryRun !== undefined ? overrideDryRun : linkDryRun;

    const formData = new FormData();
    formData.set("url", singleLinkUrl.trim());
    formData.set("dryRun", useDryRun ? "true" : "false");
    formData.set("autoPublish", linkAutoPublish ? "true" : "false");

    startTransition(async () => {
      try {
        const res = await triggerOneLinkImportAction(formData);
        setSingleLinkResult(res);
        setStatusMessage(res.statusReason || "Link processed successfully.");
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        setStatusMessage(`One-Link Import Error: ${msg}`);
      }
    });
  };

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

  const handleAmazonLinkImport = (overrideDryRun?: boolean) => {
    setStatusMessage(null);
    const useDryRun =
      overrideDryRun !== undefined ? overrideDryRun : linkDryRun;

    const formData = new FormData();
    formData.set("urls", amazonLinksText);
    formData.set("dryRun", useDryRun ? "true" : "false");
    formData.set("autoPublish", linkAutoPublish ? "true" : "false");

    startTransition(async () => {
      try {
        const res = await triggerAmazonLinkImportAction(formData);
        setLinkImportResult(res);
        setStatusMessage(res.message);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        setStatusMessage(`Import Error: ${msg}`);
      }
    });
  };

  const handleRetryQueueItem = (itemId: string) => {
    setStatusMessage(null);
    startTransition(async () => {
      try {
        const res = await retryImportQueueItemAction(itemId);
        setStatusMessage(`Item verification retried: ${res.message}`);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        setStatusMessage(`Retry Error: ${msg}`);
      }
    });
  };

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
          onClick={() => setActiveTab("amazon-links")}
          className={`pb-3 px-4 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "amazon-links"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <Link2 size={16} /> Amazon Link Import (5 URLs)
        </button>
        <button
          onClick={() => setActiveTab("queue")}
          className={`pb-3 px-4 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "queue"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <Inbox size={16} /> Import Queue ({importQueueItems.length})
        </button>
        <button
          onClick={() => setActiveTab("import")}
          className={`pb-3 px-4 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "import"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <PlusCircle size={16} /> Single Item Importer
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

      {/* ── TAB: One-Link Automatic Affiliate Deal Engine ── */}
      {activeTab === "amazon-links" && (
        <div className="space-y-6">
          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl w-fit">
            <button
              type="button"
              onClick={() => setImportMode("single")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                importMode === "single"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Zap
                size={14}
                className={
                  importMode === "single" ? "text-amber-500 fill-amber-500" : ""
                }
              />{" "}
              One-Link Instant Engine
            </button>
            <button
              type="button"
              onClick={() => setImportMode("bulk")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                importMode === "bulk"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Link2 size={14} /> Bulk Importer (5+ Links)
            </button>
          </div>

          {/* Mode 1: One-Link Instant Engine */}
          {importMode === "single" && (
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Zap className="text-amber-500 fill-amber-500" size={20} />
                    One-Link Automatic Affiliate Deal Engine
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Paste ONLY an Amazon affiliate link. SmartNivad
                    automatically resolves the ASIN, verifies tracking (
                    <strong>smartnivad-21</strong>), fetches authorized product
                    data, writes the AI summary & buying highlights, and
                    publishes the deal card.
                  </p>
                </div>
              </div>

              {/* Provider and Attribution Guardrails Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 text-xs">
                <div>
                  <span className="text-gray-500 block text-[10px] uppercase font-bold">
                    Target Marketplace
                  </span>
                  <strong className="text-blue-900">
                    www.amazon.in (India)
                  </strong>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px] uppercase font-bold">
                    Associate ID
                  </span>
                  <strong className="text-blue-900">
                    smartnivad-21 (Verified)
                  </strong>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px] uppercase font-bold">
                    Amazon Creators API
                  </span>
                  <span className="font-semibold text-amber-700">
                    OAuth 2.0 Ready
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px] uppercase font-bold">
                    AI Deal Engine
                  </span>
                  <strong className="text-emerald-700">
                    Automatic Highlights
                  </strong>
                </div>
              </div>

              {/* Single Link Input Box */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-gray-700 uppercase">
                  Paste Amazon Product or Affiliate Link
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <input
                      type="url"
                      value={singleLinkUrl}
                      onChange={(e) => setSingleLinkUrl(e.target.value)}
                      placeholder="Paste e.g. https://amzn.to/3TYvcVs or https://www.amazon.in/dp/B0B4KCH1LV"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSingleLinkImport(false)}
                    disabled={isPending || !singleLinkUrl.trim()}
                    className="py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 shrink-0"
                  >
                    {isPending ? (
                      <RefreshCw className="animate-spin" size={14} />
                    ) : (
                      <Sparkles size={14} />
                    )}
                    Auto-Import & Publish Deal
                  </button>
                </div>

                {/* Quick Test Chips */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[11px] text-gray-400 font-medium">
                    Quick Test Links:
                  </span>
                  <button
                    type="button"
                    onClick={() => setSingleLinkUrl("https://amzn.to/3TYvcVs")}
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md transition-colors"
                  >
                    SPARX Shoes (B0B4KCH1LV)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSingleLinkUrl("https://amzn.to/4yKV71P")}
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md transition-colors"
                  >
                    Zebronics Keyboard (B0B29G5SSW)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSingleLinkUrl("https://amzn.to/3TYvdJ0")}
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md transition-colors"
                  >
                    NIVEA Cream (B00E96N6O8)
                  </button>
                </div>

                {/* Import Controls */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-gray-100 text-xs">
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
                      <input
                        type="checkbox"
                        checked={linkDryRun}
                        onChange={(e) => setLinkDryRun(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300"
                      />
                      Dry Run (Preview resolution & AI analysis without saving)
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
                      <input
                        type="checkbox"
                        checked={linkAutoPublish}
                        onChange={(e) => setLinkAutoPublish(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300"
                      />
                      Auto-publish to public catalogue if clean
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSingleLinkImport(true)}
                    disabled={isPending || !singleLinkUrl.trim()}
                    className="py-1.5 px-3 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold transition-colors"
                  >
                    Run Dry Run Only
                  </button>
                </div>
              </div>

              {/* Single Link Result Card */}
              {singleLinkResult && (
                <div className="mt-5 p-5 rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50/50 to-white shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                        Pipeline Result
                      </span>
                      {singleLinkResult.importStatus === "IMPORTED" ||
                      singleLinkResult.dealStatus === "PUBLISHED" ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 flex items-center gap-1">
                          <CheckCircle2 size={12} /> Published (Live Deal)
                        </span>
                      ) : singleLinkResult.importStatus === "UPDATED" ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 flex items-center gap-1">
                          <CheckCircle2 size={12} /> Existing Deal Updated
                        </span>
                      ) : singleLinkResult.importStatus ===
                        "AWAITING_VERIFICATION" ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                          <Clock size={12} /> Preserved in Review Queue
                        </span>
                      ) : singleLinkResult.importStatus === "REJECTED" ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 flex items-center gap-1">
                          <AlertCircle size={12} /> Rejected (Test SKU)
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 flex items-center gap-1">
                          <AlertCircle size={12} /> Resolution Failed
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-gray-500">
                      ASIN: <strong>{singleLinkResult.asin || "N/A"}</strong> ·
                      Tracking:{" "}
                      <strong
                        className={
                          singleLinkResult.isTrackingVerified
                            ? "text-green-600"
                            : "text-amber-600"
                        }
                      >
                        {singleLinkResult.trackingTag || "Unverified"}
                      </strong>
                    </div>
                  </div>

                  {/* Product Details & AI Highlights */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                    {singleLinkResult.imageUrl && (
                      <div className="md:col-span-3 aspect-square rounded-xl bg-white p-3 border border-gray-100 flex items-center justify-center overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={singleLinkResult.imageUrl}
                          alt={singleLinkResult.title || "Product"}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    )}
                    <div
                      className={
                        singleLinkResult.imageUrl
                          ? "md:col-span-9 space-y-2.5"
                          : "md:col-span-12 space-y-2.5"
                      }
                    >
                      <h4 className="text-base font-bold text-gray-900 leading-snug">
                        {singleLinkResult.title || "Amazon Product Candidate"}
                      </h4>

                      {/* Pricing */}
                      {singleLinkResult.currentPrice && (
                        <div className="flex items-baseline gap-3">
                          <span className="text-2xl font-black text-gray-900">
                            ₹
                            {singleLinkResult.currentPrice.toLocaleString(
                              "en-IN",
                            )}
                          </span>
                          {singleLinkResult.originalPrice &&
                            singleLinkResult.originalPrice >
                              singleLinkResult.currentPrice && (
                              <>
                                <span className="text-sm text-gray-400 line-through">
                                  ₹
                                  {singleLinkResult.originalPrice.toLocaleString(
                                    "en-IN",
                                  )}
                                </span>
                                <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                                  {singleLinkResult.discount}% OFF
                                </span>
                              </>
                            )}
                          {singleLinkResult.categoryName && (
                            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded ml-2">
                              {singleLinkResult.categoryName}
                            </span>
                          )}
                        </div>
                      )}

                      {/* AI Summary */}
                      {singleLinkResult.aiSummary && (
                        <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-blue-900">
                          <strong className="block text-[10px] uppercase font-bold text-blue-600 mb-0.5">
                            AI Buying Summary
                          </strong>
                          {singleLinkResult.aiSummary}
                        </div>
                      )}

                      {/* Buying Highlights (Pros) */}
                      {singleLinkResult.pros &&
                        singleLinkResult.pros.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-bold text-gray-400 block">
                              Verified Highlights
                            </span>
                            <ul className="text-xs text-gray-700 space-y-0.5">
                              {singleLinkResult.pros.map((p, i) => (
                                <li
                                  key={i}
                                  className="flex items-center gap-1.5"
                                >
                                  <span className="text-emerald-500 font-bold">
                                    ✓
                                  </span>{" "}
                                  {p}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                      {/* Status Reason / Diagnostic Message */}
                      <p className="text-xs text-gray-500 italic pt-1">
                        {singleLinkResult.statusReason}
                      </p>
                    </div>
                  </div>

                  {/* Action Links */}
                  <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-gray-100">
                    {singleLinkResult.dealSlug && (
                      <>
                        <a
                          href={`/product/${singleLinkResult.dealSlug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-1.5"
                        >
                          <Eye size={14} /> View Public Product Page
                        </a>
                        <a
                          href={`/go/${singleLinkResult.dealSlug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs transition-colors flex items-center gap-1.5"
                        >
                          <ExternalLink size={14} /> Test /go Affiliate Redirect
                        </a>
                      </>
                    )}
                    {singleLinkResult.resolvedUrl && (
                      <a
                        href={singleLinkResult.resolvedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gray-500 hover:text-gray-700 underline truncate max-w-xs"
                      >
                        Amazon URL
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mode 2: Bulk Link Importer */}
          {importMode === "bulk" && (
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Link2 className="text-blue-600" size={20} /> Amazon Bulk
                    Link Importer
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Paste multiple URLs (one per line) to resolve, verify
                    attribution, detect duplicates, and queue or import in
                    batch.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAmazonLinksText(DEFAULT_CANDIDATE_LINKS)}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shrink-0 flex items-center gap-1.5"
                >
                  <RefreshCw size={12} /> Load 5 Candidate Links
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Amazon Product URLs (one per line)
                  </label>
                  <textarea
                    rows={6}
                    value={amazonLinksText}
                    onChange={(e) => setAmazonLinksText(e.target.value)}
                    placeholder="https://amzn.to/3VKp4AG&#10;https://amzn.to/3TYvcVs&#10;https://amzn.to/4yKV71P&#10;https://amzn.to/3TYvdJ0&#10;https://link.amazon/B05YNFlPW"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-6 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
                      <input
                        type="checkbox"
                        checked={linkDryRun}
                        onChange={(e) => setLinkDryRun(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300"
                      />
                      Dry Run (Preview resolution & validation without saving)
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
                      <input
                        type="checkbox"
                        checked={linkAutoPublish}
                        onChange={(e) => setLinkAutoPublish(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300"
                      />
                      Auto-publish if fully verified & clean
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleAmazonLinkImport()}
                      disabled={isPending}
                      className="py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-2"
                    >
                      {isPending ? (
                        <RefreshCw className="animate-spin" size={14} />
                      ) : (
                        <Play size={14} />
                      )}
                      Run Resolution & Verification
                    </button>

                    {linkImportResult?.isDryRun && (
                      <button
                        type="button"
                        onClick={() => handleAmazonLinkImport(false)}
                        disabled={isPending}
                        className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-2"
                      >
                        <PlusCircle size={14} /> Execute Live Import
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Import Results & Audit View */}
          {linkImportResult && (
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-6">
              <div>
                <h4 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <ShieldCheck className="text-blue-600" size={18} /> Import
                  Audit & Link Resolution Report
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Mode:{" "}
                  <strong
                    className={
                      linkImportResult.isDryRun
                        ? "text-amber-600"
                        : "text-green-600"
                    }
                  >
                    {linkImportResult.isDryRun
                      ? "DRY RUN (No database records written)"
                      : "LIVE IMPORT"}
                  </strong>
                </p>
              </div>

              {/* Summary Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 text-center">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">
                    Submitted
                  </span>
                  <div className="text-xl font-black text-gray-900 mt-0.5">
                    {linkImportResult.totalSubmitted}
                  </div>
                </div>
                <div className="bg-blue-50 rounded-xl p-3 border border-blue-100 text-center">
                  <span className="text-[10px] uppercase font-bold text-blue-600 block">
                    Resolved
                  </span>
                  <div className="text-xl font-black text-blue-700 mt-0.5">
                    {linkImportResult.successfullyResolved}
                  </div>
                </div>
                <div className="bg-green-50 rounded-xl p-3 border border-green-100 text-center">
                  <span className="text-[10px] uppercase font-bold text-green-600 block">
                    API Verified
                  </span>
                  <div className="text-xl font-black text-green-700 mt-0.5">
                    {linkImportResult.verifiedThroughProvider}
                  </div>
                </div>
                <div className="bg-amber-50 rounded-xl p-3 border border-amber-100 text-center">
                  <span className="text-[10px] uppercase font-bold text-amber-600 block">
                    Awaiting API
                  </span>
                  <div className="text-xl font-black text-amber-700 mt-0.5">
                    {linkImportResult.awaitingVerification}
                  </div>
                </div>
                <div className="bg-purple-50 rounded-xl p-3 border border-purple-100 text-center">
                  <span className="text-[10px] uppercase font-bold text-purple-600 block">
                    Duplicates
                  </span>
                  <div className="text-xl font-black text-purple-700 mt-0.5">
                    {linkImportResult.duplicates}
                  </div>
                </div>
                <div className="bg-red-50 rounded-xl p-3 border border-red-100 text-center">
                  <span className="text-[10px] uppercase font-bold text-red-600 block">
                    Invalid / 404
                  </span>
                  <div className="text-xl font-black text-red-700 mt-0.5">
                    {linkImportResult.invalidOrUnsupported}
                  </div>
                </div>
              </div>

              {/* Detailed Candidates Table */}
              <div className="overflow-x-auto border border-gray-200 rounded-xl">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[11px]">
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Source URL</th>
                      <th className="py-2.5 px-3">Identified ASIN</th>
                      <th className="py-2.5 px-3">
                        Attribution (smartnivad-21)
                      </th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Details / Audit Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {linkImportResult.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/60">
                        <td className="py-3 px-3 font-bold text-gray-400">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px] max-w-[200px] truncate">
                          <a
                            href={item.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center gap-1"
                          >
                            {item.sourceUrl} <ExternalLink size={10} />
                          </a>
                        </td>
                        <td className="py-3 px-3">
                          {item.asin ? (
                            <span className="px-2 py-0.5 rounded font-mono font-bold bg-gray-100 text-gray-800 text-[11px]">
                              {item.asin}
                            </span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          {item.isTrackingVerified ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800 flex items-center gap-1 w-max">
                              <CheckCircle2 size={10} /> Verified
                            </span>
                          ) : item.trackingStatus === "DIFFERENT_TAG" ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1 w-max">
                              <AlertCircle size={10} /> Tag: {item.trackingTag}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600 w-max">
                              Unverified
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          {item.importStatus === "IMPORTED" ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800">
                              Imported
                            </span>
                          ) : item.importStatus === "UPDATED" ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-800">
                              Updated
                            </span>
                          ) : item.importStatus === "AWAITING_VERIFICATION" ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                              Awaiting API
                            </span>
                          ) : item.importStatus === "DUPLICATE" ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                              Duplicate
                            </span>
                          ) : item.importStatus === "REJECTED" ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                              Rejected (Test SKU)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800">
                              HTTP Error
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-gray-600 text-[11px]">
                          {item.statusReason}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TAB: Import Queue ── */}
      {activeTab === "queue" && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
            <Inbox className="text-blue-600" size={20} /> Import Queue (
            {importQueueItems.length})
          </h3>
          <p className="text-xs text-gray-500 mb-6">
            Links preserved in queue awaiting Amazon Creators API credentials or
            administrator verification. You can retry individual items as API
            access is configured.
          </p>

          {importQueueItems.length === 0 ? (
            <div className="text-center py-12 text-gray-400 font-medium text-sm">
              No items currently pending in the import queue.
            </div>
          ) : (
            <div className="overflow-x-auto border border-gray-200 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-2.5 px-3">Source URL</th>
                    <th className="py-2.5 px-3">ASIN</th>
                    <th className="py-2.5 px-3">Attribution</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Pending Reason</th>
                    <th className="py-2.5 px-3">Added</th>
                    <th className="py-2.5 px-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {importQueueItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/60">
                      <td className="py-3 px-3 font-mono text-[11px] max-w-[180px] truncate">
                        <a
                          href={item.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1"
                        >
                          {item.sourceUrl} <ExternalLink size={10} />
                        </a>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-gray-800">
                        {item.asin || "—"}
                      </td>
                      <td className="py-3 px-3">
                        {item.isTrackingVerified ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800">
                            smartnivad-21
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600">
                            Unverified
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-gray-600 text-[11px] max-w-[260px] truncate">
                        {item.pendingReason || "Awaiting credentials"}
                      </td>
                      <td className="py-3 px-3 text-gray-400">
                        {new Date(item.createdAt).toLocaleDateString("en-IN")}
                      </td>
                      <td className="py-3 px-3">
                        <button
                          onClick={() => handleRetryQueueItem(item.id)}
                          disabled={isPending}
                          className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition-colors"
                        >
                          Retry
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
