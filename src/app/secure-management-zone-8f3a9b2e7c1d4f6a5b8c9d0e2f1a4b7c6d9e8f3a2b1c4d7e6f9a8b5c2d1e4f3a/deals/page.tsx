import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { GlassCard } from "@/components/ui/GlassCard";
import { Power, Plus, Edit2, Trash2, ExternalLink } from "lucide-react";
import { deleteDeal, toggleDealStatus } from "./actions";
import { DealsTableFilter } from "./DealsTableFilter";

export const metadata = {
  title: "Manage Deals | Admin",
};

interface AdminDealsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminDealsPage({
  searchParams,
}: AdminDealsPageProps) {
  const resolvedParams = await searchParams;
  const status =
    typeof resolvedParams.status === "string" ? resolvedParams.status : "ALL";
  const query = typeof resolvedParams.q === "string" ? resolvedParams.q : "";
  const whereClause: import("@prisma/client").Prisma.DealWhereInput = {};
  if (status !== "ALL" && (status === "PUBLISHED" || status === "DRAFT")) {
    whereClause.status = status;
  }
  if (query) {
    whereClause.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { store: { name: { contains: query, mode: "insensitive" } } },
      { category: { name: { contains: query, mode: "insensitive" } } },
    ];
  }

  const deals = await prisma.deal.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    include: { category: true, store: true },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Manage Deals
          </h1>
          <p className="text-gray-500">
            View, edit, and create new tech deals.
          </p>
        </div>
        <Link
          href="/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/deals/new"
          className="relative inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-full transition-all duration-300 hover:-translate-y-1 bg-[var(--color-primary)] text-black shadow-[0_0_15px_rgba(0,229,255,0.4)] hover:shadow-[0_0_25px_rgba(0,229,255,0.7)] flex items-center gap-2"
        >
          <Plus size={18} /> Add New Deal
        </Link>
      </div>

      <GlassCard className="!p-0 overflow-hidden border-gray-200">
        <DealsTableFilter />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="bg-white text-xs uppercase text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Deal</th>
                <th className="px-6 py-4 font-semibold">Price</th>
                <th className="px-6 py-4 font-semibold">Category/Store</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {deals.map((deal) => (
                <tr
                  key={deal.id}
                  className="hover:bg-gray-50/50 transition-colors bg-white"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded bg-gray-50 flex-shrink-0 relative overflow-hidden flex items-center justify-center p-1 border border-gray-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={deal.imageUrl}
                          alt={deal.title}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <div
                        className="font-medium text-gray-900 max-w-xs truncate"
                        title={deal.title}
                      >
                        {deal.title}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-green-500">
                      ₹{deal.currentPrice}
                    </div>
                    {deal.originalPrice > deal.currentPrice && (
                      <div className="text-xs text-gray-400 line-through">
                        ₹{deal.originalPrice}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900">{deal.category.name}</div>
                    <div className="text-xs text-gray-500">
                      {deal.store.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${deal.status === "PUBLISHED" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}
                    >
                      {deal.status}
                    </span>
                    <span
                      className={`ml-2 px-2 py-1 rounded text-xs font-medium ${deal.dealType === "LIVE" ? "bg-blue-500/20 text-blue-400" : deal.dealType === "HOT" ? "bg-orange-500/20 text-orange-400" : "bg-gray-500/20 text-gray-600"}`}
                    >
                      {deal.dealType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={deal.affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
                        title="View Affiliate Link"
                      >
                        <ExternalLink size={16} />
                      </a>
                      <form action={toggleDealStatus}>
                        <input type="hidden" name="dealId" value={deal.id} />
                        <input
                          type="hidden"
                          name="currentStatus"
                          value={deal.status}
                        />
                        <button
                          type="submit"
                          className={`p-2 transition-colors ${deal.status === "PUBLISHED" ? "text-green-500 hover:text-green-600" : "text-gray-400 hover:text-green-500"}`}
                          title={
                            deal.status === "PUBLISHED"
                              ? "Disable Deal"
                              : "Publish Deal"
                          }
                        >
                          <Power size={16} />
                        </button>
                      </form>
                      <Link
                        href={`/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/deals/${deal.id}/edit`}
                        className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                        title="Edit Deal"
                      >
                        <Edit2 size={16} />
                      </Link>
                      <form action={deleteDeal}>
                        <input type="hidden" name="dealId" value={deal.id} />
                        <button
                          type="submit"
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete Deal"
                        >
                          <Trash2 size={16} />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {deals.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No deals found. Click &quot;Add New Deal&quot; to create
                    one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
