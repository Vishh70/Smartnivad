import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { Plus, Edit2, Trash2 } from "lucide-react";

export const metadata = {
  title: "Manage Stores | Admin",
};

export default async function AdminStoresPage() {
  const stores = await prisma.store.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { deals: true, coupons: true } } },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Stores</h1>
          <p className="text-gray-600">View, edit, and create affiliate stores.</p>
        </div>
        <Link href="/admin/stores/new">
          <GlowButton variant="primary" className="flex items-center gap-2">
            <Plus size={18} /> Add New Store
          </GlowButton>
        </Link>
      </div>

      <GlassCard className="!p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="bg-black/5 text-xs uppercase text-gray-600 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-semibold">Store</th>
                <th className="px-6 py-4 font-semibold">Website</th>
                <th className="px-6 py-4 font-semibold">Items</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {stores.map((store) => (
                <tr key={store.id} className="hover:bg-black/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {store.logoUrl ? (
                        <div className="w-10 h-10 rounded bg-black/10 flex-shrink-0 relative overflow-hidden flex items-center justify-center p-1">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={store.logoUrl} alt={store.name} className="max-w-full max-h-full object-contain" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded bg-black/10 flex-shrink-0 flex items-center justify-center font-bold text-gray-600">
                          {store.name[0]}
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-gray-900">{store.name}</div>
                        <div className="text-xs text-gray-500">{store.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {store.website ? (
                      <a href={store.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                        {new URL(store.website).hostname.replace('www.', '')}
                      </a>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-gray-600">{store._count.deals} Deals</span>
                      <span className="text-xs text-gray-600">{store._count.coupons} Coupons</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-gray-600 hover:text-blue-400 transition-colors" title="Edit Store">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-red-400 transition-colors" title="Delete Store">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {stores.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    No stores found. Click &quot;Add New Store&quot; to create one.
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
