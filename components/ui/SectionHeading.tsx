interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

export function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
      <div className="w-24 h-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full mt-4" />
    </div>
  );
}
