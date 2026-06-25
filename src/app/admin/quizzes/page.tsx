import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { Plus, Edit2, Trash2, Calendar } from "lucide-react";

export const metadata = {
  title: "Manage Quizzes | Admin",
};

export default async function AdminQuizzesPage() {
  const quizzes = await prisma.quizPost.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Quizzes</h1>
          <p className="text-gray-600">View, edit, and create daily quiz answers.</p>
        </div>
        <Link href="/admin/quizzes/new">
          <GlowButton variant="primary" className="flex items-center gap-2">
            <Plus size={18} /> Add New Quiz
          </GlowButton>
        </Link>
      </div>

      <GlassCard className="!p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="bg-black/5 text-xs uppercase text-gray-600 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-semibold">Title</th>
                <th className="px-6 py-4 font-semibold">Platform</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {quizzes.map((quiz) => (
                <tr key={quiz.id} className="hover:bg-black/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{quiz.title}</div>
                    {quiz.prize && <div className="text-xs text-yellow-500">{quiz.prize}</div>}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded bg-black/5 text-xs font-medium">
                      {quiz.platform}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Calendar size={14} />
                      <span>{new Date(quiz.quizDate).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${quiz.status === "PUBLISHED" ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-600"}`}>
                      {quiz.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-gray-600 hover:text-blue-400 transition-colors" title="Edit Quiz">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-red-400 transition-colors" title="Delete Quiz">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {quizzes.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No quizzes found. Click &quot;Add New Quiz&quot; to create one.
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
