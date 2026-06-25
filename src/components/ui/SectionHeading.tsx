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
    <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
      <HeadingTag className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900">
        {title}
      </HeadingTag>
      {subtitle && (
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
      <div className="w-24 h-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full mt-4" />
    </div>
  );
}
