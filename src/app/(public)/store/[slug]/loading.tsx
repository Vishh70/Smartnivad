import { Skeleton, ProductCardSkeleton } from "@/components/ui/Skeleton";

export default function StoreLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Store Hero */}
      <div className="glass-card mb-12 p-8 sm:p-12 flex flex-col sm:flex-row items-center gap-8">
        <Skeleton className="w-24 h-24 rounded-full shrink-0" />
        <div className="flex-1 w-full space-y-4">
          <Skeleton className="w-64 h-10" />
          <Skeleton className="w-full max-w-xl h-6" />
          <div className="flex gap-3">
            <Skeleton className="w-32 h-8 rounded-full" />
            <Skeleton className="w-32 h-8 rounded-full" />
          </div>
        </div>
      </div>

      <div className="mb-8">
        <Skeleton className="w-64 h-8 mb-2" />
        <Skeleton className="w-32 h-4" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {[...Array(8)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
