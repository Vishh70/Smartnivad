import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function DesignPreview() {
  return (
    <main className="min-h-screen p-8 md:p-16 lg:p-24 relative overflow-x-hidden">
      <AnimatedBackground />

      <SectionHeading 
        title="Design System Preview" 
        subtitle="Premium Dark Glassmorphism Theme for TechDeals AI" 
      />

      <section className="mt-16 space-y-8 max-w-7xl mx-auto">
        <h3 className="text-2xl font-semibold text-white border-b border-[var(--color-glass-border)] pb-4">
          GlassCards
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <GlassCard>
            <h4 className="text-xl font-bold text-white mb-2">Standard Card</h4>
            <p className="text-gray-400">
              This card features a backdrop blur, soft borders, and hover lift effects.
            </p>
          </GlassCard>
          <GlassCard className="h-48 flex items-center justify-center text-center">
            <h4 className="text-xl font-bold text-white">Centered Content</h4>
          </GlassCard>
          <GlassCard>
            <h4 className="text-xl font-bold text-[var(--color-primary)] mb-2">Accent Text</h4>
            <p className="text-gray-400">
              Works perfectly with primary and secondary accent colors.
            </p>
          </GlassCard>
        </div>
      </section>

      <section className="mt-16 space-y-8 max-w-7xl mx-auto">
        <h3 className="text-2xl font-semibold text-white border-b border-[var(--color-glass-border)] pb-4">
          GlowButtons
        </h3>
        <div className="flex flex-wrap gap-6 items-center">
          <GlowButton variant="primary">Primary Glow</GlowButton>
          <GlowButton variant="secondary">Secondary Glow</GlowButton>
          <GlowButton variant="outline">Outline Hover</GlowButton>
        </div>
      </section>

      <div className="mt-24">
        <SectionHeading 
          title="Another Section" 
          subtitle="Showing that section headings are consistent and reusable." 
        />
      </div>
    </main>
  );
}
