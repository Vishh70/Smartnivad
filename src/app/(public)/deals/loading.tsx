import { Skeleton, ProductCardSkeleton } from "@/components/ui/Skeleton";

export default function DealsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10 space-y-4">
        <Skeleton className="w-64 h-10" />
        <Skeleton className="w-96 h-5" />
        
        {/* Categories row */}
        <div className="flex gap-2 mt-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="w-32 h-10 rounded-full" />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {[...Array(12)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
