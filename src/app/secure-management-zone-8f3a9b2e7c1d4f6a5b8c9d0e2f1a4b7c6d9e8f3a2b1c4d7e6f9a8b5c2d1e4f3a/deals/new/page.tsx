import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { GlowButton } from "@/components/ui/GlowButton";
import { ArrowLeft } from "lucide-react";
import { DealForm } from "./DealForm";

export const metadata = {
  title: "Add New Deal | Admin",
};

export default async function NewDealPage() {
  const [categories, stores] = await Promise.all([
    prisma.category.findMany({ select: { id: true, name: true } }),
    prisma.store.findMany({ select: { id: true, name: true } }),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/deals">
          <GlowButton variant="secondary" className="!px-3 !py-3">
            <ArrowLeft size={20} />
          </GlowButton>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create New Deal
          </h1>
          <p className="text-gray-600">
            Add a new product deal to the platform.
          </p>
        </div>
      </div>

      <DealForm categories={categories} stores={stores} />
    </div>
  );
}
