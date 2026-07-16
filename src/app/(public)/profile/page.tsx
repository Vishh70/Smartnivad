import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/sections/ProductCard";
import { HeartCrack } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Saved Deals | SmartNivad",
  description: "View your saved tech deals and wishlists.",
};

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user || !user.id) {
    redirect("/login");
  }

  const wishlistedItems = await prisma.wishlistItem.findMany({
    where: { userId: user.id },
    include: {
      deal: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const savedDeals = wishlistedItems.map((item) => item.deal);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
          My Saved Deals
        </h1>
        <p className="text-gray-600">
          Keep track of your favorite tech deals here.
        </p>
      </div>

      {savedDeals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-[var(--color-glass-surface)] border border-[var(--color-glass-border)] rounded-2xl">
          <HeartCrack size={48} className="text-gray-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No deals saved yet
          </h2>
          <p className="text-gray-600 mb-6 max-w-md">
            You haven&apos;t added any deals to your wishlist. Start browsing
            and click the heart icon to save them here!
          </p>
          <Link
            href="/deals"
            className="px-6 py-3 bg-[var(--color-primary)] text-white font-semibold rounded-full hover:scale-105 transition-transform"
          >
            Explore Deals
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {savedDeals.map((deal) => (
            <ProductCard key={deal.id} product={deal} />
          ))}
        </div>
      )}
    </div>
  );
}
