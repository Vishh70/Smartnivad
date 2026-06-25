interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  as?: "h1" | "h2";
}

export function SectionHeading({
  title,
  subtitle,
  as = "h2",
}: SectionHeadingProps) {
  const HeadingTag = as;

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-3 sm:space-y-4 py-6 sm:py-8">
      <HeadingTag className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-gray-900 px-4">
        {title}
      </HeadingTag>
      {subtitle && (
        <p className="text-sm sm:text-lg md:text-xl text-gray-600 max-w-[280px] sm:max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
      <div className="w-24 h-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full mt-4" />
    </div>
  );
}
