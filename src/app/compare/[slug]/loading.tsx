import { Skeleton, ProductCardSkeleton } from "@/components/ui/Skeleton";

export default function CompareLoading() {
  return (
    <div className="w-full relative overflow-hidden bg-gray-50 pb-32">
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-blue-50 to-gray-50 -z-10" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
        <Skeleton className="w-32 h-6 mb-8" />

        <div className="text-center mb-16 flex flex-col items-center">
          <Skeleton className="w-32 h-8 rounded-full mb-6" />
          <Skeleton className="w-3/4 max-w-2xl h-12 mb-4" />
          <Skeleton className="w-1/2 max-w-xl h-6" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <ProductCardSkeleton />
          <ProductCardSkeleton />
        </div>

        <div className="glass-card p-8">
          <Skeleton className="w-64 h-8 mb-8 mx-auto" />
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex justify-between items-center border-b border-gray-100 pb-4">
                <Skeleton className="w-1/3 h-6" />
                <Skeleton className="w-16 h-8 rounded-full" />
                <Skeleton className="w-1/3 h-6" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
