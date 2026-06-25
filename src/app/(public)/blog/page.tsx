import Link from "next/link";
import { Calendar, Clock, Eye, Tag } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { NewsletterForm } from "@/components/ui/NewsletterForm";
import { getBlogPosts } from "@/lib/data";

export const metadata = {
  title: "Tech Blog — Best Buying Guides & Reviews | TechDeals AI",
  description: "Expert buying guides, tech reviews, and deal tips to help you make smarter purchasing decisions.",
};

function formatDate(d: Date | string | null | undefined) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function readTime(content: string | null) {
  if (!content) return 1;
  return Math.max(1, Math.round(content.split(" ").length / 200));
}

export default async function BlogPage() {
  const published = await getBlogPosts();
  const featured  = published[0];
  const rest      = published.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SectionHeading title="Tech Blog" subtitle="Buying guides, reviews, and tips to help you spend smarter." />

      {/* Featured Post */}
      {featured && (
        <Link href={`/blog/${featured.slug}`} className="block mt-12 group">
          <div className="relative rounded-3xl overflow-hidden border border-[var(--color-glass-border)] bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 p-8 md:p-12 hover:border-[var(--color-primary)]/40 transition-all">
            <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-secondary)]/5 -z-10" />
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-4 py-1.5 rounded-full bg-[var(--color-primary)] text-white text-xs font-bold uppercase tracking-wider">⭐ Featured</span>
              {featured.tags?.slice(0, 3).map(tag => (
                <span key={tag} className="px-3 py-1.5 rounded-full bg-black/10 text-gray-700 text-xs border border-[var(--color-glass-border)]">#{tag}</span>
              ))}
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 group-hover:text-[var(--color-primary)] transition-colors leading-tight max-w-3xl">
              {featured.title}
            </h2>
            <p className="text-gray-700 text-lg mb-6 max-w-2xl line-clamp-3">{featured.excerpt}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1.5"><Calendar size={14} /> {formatDate(featured.createdAt)}</span>
              <span className="flex items-center gap-1.5"><Clock size={14} /> {readTime(featured.content)} min read</span>
              {featured.views > 0 && <span className="flex items-center gap-1.5"><Eye size={14} /> {featured.views.toLocaleString()} views</span>}
            </div>
          </div>
        </Link>
      )}

      {/* Post Grid */}
      {rest.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {rest.map(post => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group">
              <GlassCard className="h-full flex flex-col hover:border-[var(--color-primary)]/40 transition-all !p-0 overflow-hidden">
                {/* Color accent */}
                <div className="h-1 w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]" />
                <div className="p-6 flex flex-col flex-1">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {post.tags?.slice(0, 2).map(tag => (
                      <span key={tag} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 text-xs font-medium">
                        <Tag size={10} /> {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-[var(--color-primary)] transition-colors leading-snug line-clamp-2 flex-1">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-1">{post.excerpt}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-auto">
                    <span className="flex items-center gap-1"><Clock size={14} /> {formatDate(post.createdAt)}</span>
                    <span className="flex items-center gap-1"><Clock size={11} /> {readTime(post.content)} min read</span>
                  </div>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      )}

      {published.length === 0 && (
        <div className="text-center py-24 text-gray-500">
          <div className="text-5xl mb-4">📝</div>
          <p className="text-lg">No blog posts published yet. Check back soon!</p>
        </div>
      )}

      {/* Newsletter CTA */}
      <div className="mt-20 p-10 rounded-3xl text-center bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 border border-[var(--color-glass-border)]">
        <div className="text-4xl mb-4">📬</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Get Deals in Your Inbox</h3>
        <p className="text-gray-600 mb-6">Weekly digest of the best tech deals, buying guides, and discount codes.</p>
        <NewsletterForm />
      </div>
    </div>
  );
}
