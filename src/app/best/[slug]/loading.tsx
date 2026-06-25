import { Skeleton } from "@/components/ui/Skeleton";

export default function BestOfLoading() {
  return (
    <div className="w-full relative overflow-hidden bg-white pb-32">
      {/* Premium Hero */}
      <div className="bg-gradient-to-br from-blue-900 via-[#1e3a8a] to-blue-950 pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex flex-col items-center">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px]" />

        <Skeleton className="w-48 h-8 rounded-full mb-6 z-10 opacity-30" />
        <Skeleton className="w-96 max-w-full h-16 mb-6 z-10 opacity-30" />
        <Skeleton className="w-3/4 max-w-2xl h-8 z-10 opacity-30" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="space-y-6">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="glass-card bg-white p-6 sm:p-8 flex flex-col md:flex-row gap-8"
            >
              <Skeleton className="w-full md:w-1/3 aspect-square rounded-2xl" />
              <div className="flex-1 space-y-4">
                <Skeleton className="w-24 h-8 rounded-full" />
                <Skeleton className="w-3/4 h-8" />
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-5/6 h-4" />
                <div className="pt-4 mt-4 border-t border-gray-100 flex justify-between">
                  <Skeleton className="w-24 h-8" />
                  <Skeleton className="w-32 h-10 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
