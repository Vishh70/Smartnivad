import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { Plus, Edit2, Trash2, Eye } from "lucide-react";

export const metadata = {
  title: "Manage Blog Posts | Admin",
};

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Manage Blog Posts
          </h1>
          <p className="text-gray-600">View, edit, and create articles.</p>
        </div>
        <Link href="/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/blog/new">
          <GlowButton variant="primary" className="flex items-center gap-2">
            <Plus size={18} /> Add New Post
          </GlowButton>
        </Link>
      </div>

      <GlassCard className="!p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="bg-black/5 text-xs uppercase text-gray-600 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-semibold">Title</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Views</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {posts.map((post) => (
                <tr
                  key={post.id}
                  className="hover:bg-black/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div
                      className="font-medium text-gray-900 max-w-xs truncate"
                      title={post.title}
                    >
                      {post.title}
                    </div>
                    <div className="text-xs text-gray-500 max-w-xs truncate">
                      {post.slug}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${post.status === "PUBLISHED" ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-600"}`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Eye size={14} className="text-gray-500" />
                      <span>{post.views}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="p-2 text-gray-600 hover:text-blue-400 transition-colors"
                        title="Edit Post"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="p-2 text-gray-600 hover:text-red-400 transition-colors"
                        title="Delete Post"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No blog posts found. Click &quot;Add New Post&quot; to
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
