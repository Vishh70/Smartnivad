import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { Plus, Edit2, Trash2 } from "lucide-react";

export const metadata = {
  title: "Manage Categories | Admin",
};

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { deals: true } } },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Manage Categories
          </h1>
          <p className="text-gray-600">
            View, edit, and create product categories.
          </p>
        </div>
        <Link href="/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/categories/new">
          <GlowButton variant="primary" className="flex items-center gap-2">
            <Plus size={18} /> Add New Category
          </GlowButton>
        </Link>
      </div>

      <GlassCard className="!p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="bg-black/5 text-xs uppercase text-gray-600 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Slug</th>
                <th className="px-6 py-4 font-semibold">Deals Count</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-black/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {cat.icon && <span className="text-2xl">{cat.icon}</span>}
                      <div className="font-medium text-gray-900">
                        {cat.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{cat.slug}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full bg-black/10 text-xs font-medium">
                      {cat._count.deals} Deals
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="p-2 text-gray-600 hover:text-blue-400 transition-colors"
                        title="Edit Category"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="p-2 text-gray-600 hover:text-red-400 transition-colors"
                        title="Delete Category"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No categories found. Click &quot;Add New Category&quot; to
                    create one.
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
