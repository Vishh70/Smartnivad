import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/sections/ProductCard";
import Image from "next/image";
import { Bell, Heart, History, Trash2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

export const metadata = {
  title: "Dashboard - TechDeals AI",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/login");
  }

  const userId = session.user.id;

  const [savedDeals, viewHistory] = await Promise.all([
    prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        deal: {
          include: {
            store: true,
            brand: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.viewHistory.findMany({
      where: { userId },
      include: {
        deal: {
          include: {
            store: true,
            brand: true,
          }
        }
      },
      orderBy: { viewedAt: 'desc' },
      take: 10,
    })
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
      <div className="flex items-center gap-4 mb-12">
        {session.user.image ? (
          <Image src={session.user.image} alt={session.user.name || "User"} width={64} height={64} className="rounded-full border-4 border-white shadow-md" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white flex items-center justify-center text-2xl font-bold shadow-md">
            {session.user.name?.charAt(0) || "U"}
          </div>
        )}
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome back, {session.user.name?.split(" ")[0] || "User"}!</h1>
          <p className="text-gray-500 font-medium">{session.user.email}</p>
        </div>
      </div>

      <div className="space-y-16">
        {/* Saved Deals Section */}
        <section>
          <div className="flex items-center gap-2 mb-8">
            <Heart size={24} className="text-red-500" />
            <h2 className="text-2xl font-bold text-gray-900">Saved Deals</h2>
          </div>
          {savedDeals.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {savedDeals.map((item: any) => (
                <div key={item.id} className="h-full">
                  <ProductCard product={item.deal} initialSaved={true} />
                </div>
              ))}
            </div>
          ) : (
            <GlassCard className="p-12 text-center flex flex-col items-center justify-center border border-dashed border-gray-300">
              <Heart size={48} className="text-gray-300 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">No saved deals yet</h3>
              <p className="text-gray-500 mb-6">Keep track of the best offers by saving them to your wishlist.</p>
              <Link href="/deals" className="gradient-btn px-6 py-2.5 rounded-full font-bold">Browse Deals</Link>
            </GlassCard>
          )}
        </section>

        {/* View History Section */}
        {viewHistory.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-8">
              <History size={24} className="text-purple-500" />
              <h2 className="text-2xl font-bold text-gray-900">Recently Viewed</h2>
            </div>
            <div className="flex overflow-x-auto snap-x hide-scrollbar gap-6 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
              {viewHistory.map((historyItem: any) => (
                <div key={historyItem.id} className="shrink-0 w-[280px] snap-center h-full">
                  <ProductCard product={historyItem.deal} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
