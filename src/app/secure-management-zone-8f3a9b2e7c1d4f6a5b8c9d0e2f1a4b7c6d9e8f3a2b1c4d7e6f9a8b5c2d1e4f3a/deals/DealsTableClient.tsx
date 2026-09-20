"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Power,
  Edit2,
  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Square,
} from "lucide-react";
import {
  deleteDeal,
  toggleDealStatus,
  bulkDeleteDeals,
  bulkUpdateDealStatus,
} from "./actions";

export function DealsTableClient({
  deals,
  currentPage,
  totalPages,
}: {
  deals: (import("@prisma/client").Deal & {
    category: import("@prisma/client").Category;
    store: import("@prisma/client").Store;
  })[];
  currentPage: number;
  totalPages: number;
}) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);

  const toggleSelectAll = () => {
    if (selectedIds.size === deals.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(deals.map((d) => d.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleBulkAction = async (action: "PUBLISH" | "DRAFT" | "DELETE") => {
    if (selectedIds.size === 0) return;
    const confirmMsg =
      action === "DELETE"
        ? "Are you sure you want to delete these deals?"
        : `Are you sure you want to ${action.toLowerCase()} these deals?`;
    if (!confirm(confirmMsg)) return;

    setIsProcessing(true);
    const ids = Array.from(selectedIds);
    try {
      if (action === "DELETE") {
        await bulkDeleteDeals(ids);
      } else {
        await bulkUpdateDealStatus(
          ids,
          action === "PUBLISH" ? "PUBLISHED" : "DRAFT",
        );
      }
      setSelectedIds(new Set());
    } catch {
      alert("Error performing bulk action");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col">
      {selectedIds.size > 0 && (
        <div className="bg-blue-50 border-b border-blue-100 p-3 flex items-center justify-between">
          <span className="text-sm font-medium text-blue-800">
            {selectedIds.size} deals selected
          </span>
          <div className="flex gap-2">
            <button
              disabled={isProcessing}
              onClick={() => handleBulkAction("PUBLISH")}
              className="px-3 py-1.5 bg-green-500 text-white text-xs font-bold rounded shadow-sm hover:bg-green-600 disabled:opacity-50 transition-colors"
            >
              Publish Selected
            </button>
            <button
              disabled={isProcessing}
              onClick={() => handleBulkAction("DRAFT")}
              className="px-3 py-1.5 bg-yellow-500 text-white text-xs font-bold rounded shadow-sm hover:bg-yellow-600 disabled:opacity-50 transition-colors"
            >
              Draft Selected
            </button>
            <button
              disabled={isProcessing}
              onClick={() => handleBulkAction("DELETE")}
              className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded shadow-sm hover:bg-red-600 disabled:opacity-50 transition-colors"
            >
              Delete Selected
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-700">
          <thead className="bg-white text-xs uppercase text-gray-500 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 w-12 text-center">
                <button
                  onClick={toggleSelectAll}
                  className="text-gray-400 hover:text-[var(--color-primary)]"
                >
                  {deals.length > 0 && selectedIds.size === deals.length ? (
                    <CheckSquare size={18} />
                  ) : (
                    <Square size={18} />
                  )}
                </button>
              </th>
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
                className={`${selectedIds.has(deal.id) ? "bg-blue-50/50" : "bg-white hover:bg-gray-50/50"} transition-colors`}
              >
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => toggleSelect(deal.id)}
                    className={`${selectedIds.has(deal.id) ? "text-[var(--color-primary)]" : "text-gray-400 hover:text-gray-600"}`}
                  >
                    {selectedIds.has(deal.id) ? (
                      <CheckSquare size={18} />
                    ) : (
                      <Square size={18} />
                    )}
                  </button>
                </td>
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
                  <div className="text-gray-900">{deal.category?.name}</div>
                  <div className="text-xs text-gray-500">
                    {deal.store?.name}
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
                  colSpan={6}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No deals found. Click &quot;Add New Deal&quot; to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-white">
          <p className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Link
              href={`?page=${Math.max(1, currentPage - 1)}`}
              className={`p-2 rounded border border-gray-200 hover:bg-gray-50 ${currentPage === 1 ? "pointer-events-none opacity-50" : ""}`}
            >
              <ChevronLeft size={18} />
            </Link>
            <Link
              href={`?page=${Math.min(totalPages, currentPage + 1)}`}
              className={`p-2 rounded border border-gray-200 hover:bg-gray-50 ${currentPage === totalPages ? "pointer-events-none opacity-50" : ""}`}
            >
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
