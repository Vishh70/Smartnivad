export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-gray-200/60 rounded-xl relative overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="glass-card p-4 space-y-4">
      <Skeleton className="w-full h-48 rounded-2xl" />
      <Skeleton className="w-3/4 h-6" />
      <Skeleton className="w-1/2 h-4" />
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
        <Skeleton className="w-20 h-8" />
        <Skeleton className="w-24 h-10 rounded-xl" />
      </div>
    </div>
  );
}
