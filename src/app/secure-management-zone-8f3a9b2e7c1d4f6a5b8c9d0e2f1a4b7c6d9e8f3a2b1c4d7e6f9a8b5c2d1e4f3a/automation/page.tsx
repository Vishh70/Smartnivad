import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAllConfigStatuses } from "@/lib/affiliate/registry";
import { AutomationClient } from "./AutomationClient";
import { Bot } from "lucide-react";

export const metadata = {
  title: "Affiliate Deals & Price Automation | SmartNivad Admin",
};

export default async function AutomationAdminPage() {
  await requireAdmin();

  const [
    totalDiscovered,
    stalePricesCount,
    reviewQueueDeals,
    totalFailedLogs,
    recentRuns,
    categories,
    providerStatuses,
  ] = await Promise.all([
    prisma.deal.count({
      where: { provider: { in: ["AMAZON", "FLIPKART"] } },
    }),
    prisma.deal.count({
      where: { isPriceStale: true },
    }),
    prisma.deal.findMany({
      where: { reviewQueue: true },
      include: { store: true, category: true },
      take: 20,
      orderBy: { updatedAt: "desc" },
    }),
    prisma.automationLog.count({
      where: {
        status: { in: ["Failed", "Error", "CircuitBrokenExpired"] },
        checkedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
    }),
    prisma.discoveryRun.findMany({
      take: 15,
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      select: { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
    }),
    getAllConfigStatuses(),
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">
          <Bot size={14} /> Automated Affiliate Engine
        </div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          Affiliate Deals & Price Tracking Automation
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Official API integrations for Amazon Creators and Flipkart, automatic
          idempotent discovery, safe price monitoring, and review queue.
        </p>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
          <span className="text-xs text-gray-500 font-bold uppercase">
            Discovered Deals
          </span>
          <div className="text-2xl font-black text-gray-900 mt-1">
            {totalDiscovered}
          </div>
          <span className="text-[11px] text-gray-400">
            Amazon & Flipkart catalog
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
          <span className="text-xs text-gray-500 font-bold uppercase">
            Stale Prices
          </span>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {stalePricesCount}
          </div>
          <span className="text-[11px] text-gray-400">
            &gt;24 hrs unverified
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
          <span className="text-xs text-gray-500 font-bold uppercase">
            Review Queue
          </span>
          <div className="text-2xl font-black text-purple-600 mt-1">
            {reviewQueueDeals.length}
          </div>
          <span className="text-[11px] text-gray-400">
            Needs manual approval
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
          <span className="text-xs text-gray-500 font-bold uppercase">
            24h Check Errors
          </span>
          <div className="text-2xl font-black text-red-500 mt-1">
            {totalFailedLogs}
          </div>
          <span className="text-[11px] text-gray-400">
            Circuit-breaker backoff
          </span>
        </div>
      </div>

      {/* Main Interactive Client Interface */}
      <AutomationClient
        providerStatuses={providerStatuses}
        reviewQueueDeals={reviewQueueDeals}
        recentRuns={recentRuns}
        categories={categories}
      />
    </div>
  );
}
