import { Skeleton, ProductCardSkeleton } from "@/components/ui/Skeleton";

export default function DashboardLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
      {/* Header Skeleton */}
      <div className="flex items-center gap-4 mb-12">
        <Skeleton className="w-16 h-16 rounded-full" />
        <div>
          <Skeleton className="w-64 h-8 mb-2" />
          <Skeleton className="w-48 h-4" />
        </div>
      </div>

      <div className="space-y-16">
        {/* Saved Deals Skeleton */}
        <section>
          <div className="flex items-center gap-2 mb-8">
            <Skeleton className="w-6 h-6 rounded-full" />
            <Skeleton className="w-40 h-8" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </section>

        {/* Price Alerts Skeleton */}
        <section>
          <div className="flex items-center gap-2 mb-8">
            <Skeleton className="w-6 h-6 rounded-full" />
            <Skeleton className="w-48 h-8" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="glass-card p-5 flex gap-4">
                <Skeleton className="w-16 h-16 rounded-xl shrink-0" />
                <div className="w-full">
                  <Skeleton className="w-3/4 h-5 mb-2" />
                  <Skeleton className="w-1/2 h-4 mb-2" />
                  <Skeleton className="w-16 h-4" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
