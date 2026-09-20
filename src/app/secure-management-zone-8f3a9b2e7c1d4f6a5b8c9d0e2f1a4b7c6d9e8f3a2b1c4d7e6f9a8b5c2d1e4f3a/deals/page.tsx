import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { GlassCard } from "@/components/ui/GlassCard";
import { Plus } from "lucide-react";
import { DealsTableFilter } from "./DealsTableFilter";
import { DealsTableClient } from "./DealsTableClient";

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
  const pageStr =
    typeof resolvedParams.page === "string" ? resolvedParams.page : "1";
  const currentPage = parseInt(pageStr, 10) || 1;
  const limit = 20;
  const skip = (currentPage - 1) * limit;
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

  const [deals, totalCount] = await Promise.all([
    prisma.deal.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      include: { category: true, store: true },
      skip,
      take: limit,
    }),
    prisma.deal.count({
      where: whereClause,
    }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

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
        <DealsTableClient
          deals={deals}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </GlassCard>
    </div>
  );
}
