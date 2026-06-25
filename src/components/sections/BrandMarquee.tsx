"use client";

interface BrandMarqueeProps {
  stores: { id: string; name: string; logoUrl: string | null }[];
}

export function BrandMarquee({ stores }: BrandMarqueeProps) {
  if (!stores.length) return null;

  // Duplicate for seamless loop
  const items = [...stores, ...stores];

  return (
    <section className="py-16">
      <div className="text-center mb-10">
        <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Trusted Partners</p>
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Shop From Top Stores</h2>
      </div>
      <div className="relative overflow-hidden">
        {/* Gradient masks */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="flex animate-marquee gap-8 w-max">
          {items.map((store, i) => (
            <div
              key={`${store.id}-${i}`}
              className="flex items-center justify-center px-8 py-5 bg-white/60 backdrop-blur-md border border-gray-100 rounded-2xl min-w-[180px] hover:shadow-lg hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 group"
            >
              {store.logoUrl ? (
                <img
                  src={store.logoUrl}
                  alt={store.name}
                  className="h-8 max-w-[120px] object-contain grayscale group-hover:grayscale-0 transition-all duration-300 opacity-60 group-hover:opacity-100"
                />
              ) : (
                <span className="text-lg font-bold text-gray-400 group-hover:text-gray-900 transition-colors">
                  {store.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
