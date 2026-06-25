import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { Plus, Edit2, Trash2 } from "lucide-react";

export const metadata = {
  title: "Manage Brands | Admin",
};

export default async function AdminBrandsPage() {
  const brands = await prisma.brand.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { deals: true } } },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Manage Brands
          </h1>
          <p className="text-gray-600">
            View, edit, and create product brands.
          </p>
        </div>
        <Link href="/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/brands/new">
          <GlowButton variant="primary" className="flex items-center gap-2">
            <Plus size={18} /> Add New Brand
          </GlowButton>
        </Link>
      </div>

      <GlassCard className="!p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="bg-black/5 text-xs uppercase text-gray-600 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-semibold">Brand</th>
                <th className="px-6 py-4 font-semibold">Deals Count</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {brands.map((brand) => (
                <tr
                  key={brand.id}
                  className="hover:bg-black/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {brand.logoUrl ? (
                        <div className="w-10 h-10 rounded bg-black/10 flex-shrink-0 relative overflow-hidden flex items-center justify-center p-1">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={brand.logoUrl}
                            alt={brand.name}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded bg-black/10 flex-shrink-0 flex items-center justify-center font-bold text-gray-600">
                          {brand.name[0]}
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-gray-900">
                          {brand.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {brand.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full bg-black/10 text-xs font-medium">
                      {brand._count.deals} Deals
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="p-2 text-gray-600 hover:text-blue-400 transition-colors"
                        title="Edit Brand"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="p-2 text-gray-600 hover:text-red-400 transition-colors"
                        title="Delete Brand"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {brands.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No brands found. Click &quot;Add New Brand&quot; to create
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
