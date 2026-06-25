import { prisma } from "@/lib/prisma";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  Tags,
  List,
  HelpCircle,
  FileText,
  TrendingUp,
  Eye,
  Activity,
  CheckCircle,
  AlertTriangle,
  Clock,
} from "lucide-react";

export const metadata = {
  title: "Admin Dashboard | SmartNivad",
};

export default async function AdminDashboard() {
  const [
    dealsCount,
    categoriesCount,
    quizzesCount,
    blogsCount,
    lastRun,
    totalChecked,
    totalUpdated,
    totalFailed,
    recentLogs,
    topDeals,
  ] = await Promise.all([
    prisma.deal.count(),
    prisma.category.count(),
    prisma.quizPost.count(),
    prisma.blogPost.count(),

    // Automation Stats
    prisma.automationLog.findFirst({ orderBy: { checkedAt: "desc" } }),
    prisma.automationLog.count({
      where: { checkedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
    }),
    prisma.automationLog.count({
      where: {
        status: "PriceUpdated",
        checkedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
    }),
    prisma.automationLog.count({
      where: {
        status: "Failed",
        checkedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
    }),
    prisma.automationLog.findMany({
      orderBy: { checkedAt: "desc" },
      take: 5,
      include: { deal: true },
    }),

    // Top Deals
    prisma.deal.findMany({
      orderBy: { clicks: "desc" },
      take: 5,
      select: { id: true, title: true, clicks: true, affiliateUrl: true },
    }),
  ]);

  const successRate =
    totalChecked > 0
      ? Math.round(((totalChecked - totalFailed) / totalChecked) * 100)
      : 0;

  const stats = [
    {
      label: "Total Deals",
      value: dealsCount,
      icon: <Tags className="text-blue-400" />,
    },
    {
      label: "Categories",
      value: categoriesCount,
      icon: <List className="text-purple-400" />,
    },
    {
      label: "Quizzes",
      value: quizzesCount,
      icon: <HelpCircle className="text-green-400" />,
    },
    {
      label: "Blog Posts",
      value: blogsCount,
      icon: <FileText className="text-orange-400" />,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard Overview
        </h1>
        <p className="text-gray-500">
          Welcome back. Here is what is happening today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <GlassCard
            key={stat.label}
            className="flex items-center gap-4 bg-white"
          >
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="bg-white">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-[var(--color-primary)]" />
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
          </div>
          <p className="text-gray-500 text-sm">
            No recent activity to display.
          </p>
        </GlassCard>

        <GlassCard className="bg-white">
          <div className="flex items-center gap-2 mb-6">
            <Eye className="text-[var(--color-primary)]" />
            <h2 className="text-xl font-bold text-gray-900">
              Top Performing Deals
            </h2>
          </div>
          {topDeals.length > 0 ? (
            <div className="space-y-4">
              {topDeals.map((deal) => (
                <div
                  key={deal.id}
                  className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100"
                >
                  <p className="text-sm font-medium text-gray-900 truncate max-w-[70%]">
                    {deal.title}
                  </p>
                  <span className="text-sm font-bold text-[var(--color-primary)]">
                    {deal.clicks} clicks
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Not enough data to display.</p>
          )}
        </GlassCard>
      </div>

      {/* Automation Dashboard */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Activity className="text-blue-500" /> Automation Engine (24h)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <GlassCard className="flex items-center gap-4 bg-white">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
              <Clock className="text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Last Run</p>
              <p className="text-lg font-bold text-gray-900">
                {lastRun
                  ? new Date(lastRun.checkedAt).toLocaleTimeString()
                  : "Never"}
              </p>
            </div>
          </GlassCard>
          <GlassCard className="flex items-center gap-4 bg-white">
            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
              <List className="text-purple-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Products Checked
              </p>
              <p className="text-xl font-bold text-gray-900">{totalChecked}</p>
            </div>
          </GlassCard>
          <GlassCard className="flex items-center gap-4 bg-white">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle className="text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Prices Updated
              </p>
              <p className="text-xl font-bold text-green-600">{totalUpdated}</p>
            </div>
          </GlassCard>
          <GlassCard className="flex items-center gap-4 bg-white">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
              <AlertTriangle className="text-red-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Failed / Success Rate
              </p>
              <p className="text-xl font-bold text-red-600">
                {totalFailed}{" "}
                <span className="text-sm text-gray-400">({successRate}%)</span>
              </p>
            </div>
          </GlassCard>
        </div>

        <GlassCard className="bg-white">
          <h3 className="font-bold text-gray-900 mb-4">Recent Scraper Logs</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="py-3 px-4 font-medium rounded-tl-xl">Time</th>
                  <th className="py-3 px-4 font-medium">Product</th>
                  <th className="py-3 px-4 font-medium">Store</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium rounded-tr-xl">
                    Duration
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentLogs.length > 0 ? (
                  recentLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50/50">
                      <td className="py-3 px-4">
                        {new Date(log.checkedAt).toLocaleTimeString()}
                      </td>
                      <td className="py-3 px-4 font-medium line-clamp-1 max-w-[200px]">
                        {log.deal.title}
                      </td>
                      <td className="py-3 px-4">{log.store}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold ${log.status === "PriceUpdated" ? "bg-green-100 text-green-700" : log.status === "Failed" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500">
                        {log.duration?.toFixed(2)}s
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-gray-500">
                      No logs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
