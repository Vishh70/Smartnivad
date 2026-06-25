import { Skeleton, ProductCardSkeleton } from "@/components/ui/Skeleton";

export default function CategoryLoading() {
  return (
    <div className="w-full min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Banner Skeleton */}
      <div className="mb-12 text-center p-12 rounded-3xl bg-[rgba(255,255,255,0.03)] border border-[var(--color-glass-border)] backdrop-blur-md flex flex-col items-center">
        <Skeleton className="w-16 h-16 rounded-full mb-4" />
        <Skeleton className="w-64 h-12 mb-4" />
        <Skeleton className="w-96 h-6 mb-6" />
        <div className="flex gap-4">
          <Skeleton className="w-48 h-10 rounded-full" />
          <Skeleton className="w-48 h-10 rounded-full" />
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
