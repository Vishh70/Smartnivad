import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, Eye, ChevronLeft, Tag } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getBlogPosts } from "@/lib/data";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = await getBlogPosts();
  const post = posts.find(p => p.slug === slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: `${post.title} — TechDeals AI Blog`,
    description: post.excerpt ?? post.title,
  };
}

function formatDate(d: Date | string | null | undefined) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function readTime(content: string | null) {
  if (!content) return 1;
  return Math.max(1, Math.round(content.split(" ").length / 200));
}

// Very simple markdown-to-HTML converter for the content
function renderMarkdown(md: string | null): string {
  if (!md) return "";
  return md
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold text-gray-900 mt-10 mb-4">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold text-gray-900 mt-8 mb-3">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-gray-900 font-semibold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="text-gray-700 italic">$1</em>')
    .replace(/^- (.+)$/gm, '<li class="text-gray-700 flex items-start gap-2 mb-1"><span class="text-[var(--color-primary)] mt-1 shrink-0">•</span>$1</li>')
    .replace(/(<li[\s\S]*?<\/li>)+/g, '<ul class="space-y-1 my-4 pl-2">$&</ul>')
    .replace(/^(?!<[h|u|l])(.+)$/gm, (m) => m.trim() ? `<p class="text-gray-700 leading-relaxed mb-4">${m}</p>` : "")
    .replace(/\n{2,}/g, "");
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = await getBlogPosts();
  const post = posts.find(p => p.slug === slug);
  if (!post) notFound();

  const related = posts.filter(p => p.id !== post.id && p.status === "PUBLISHED");
  const rt = readTime(post.content);

  // JSON-LD Article schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt,
    "datePublished": post.createdAt.toISOString(),
    "publisher": { "@type": "Organization", "name": "TechDeals AI", "url": "https://techdeals.ai" },
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Back */}
      <Link href="/blog" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm mb-8 transition-colors group">
        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Blog
      </Link>

      {/* Article Header */}
      <header className="mb-10">
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map(tag => (
              <span key={tag} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 text-xs font-medium">
                <Tag size={11} /> {tag}
              </span>
            ))}
          </div>
        )}
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">{post.title}</h1>
        {post.excerpt && <p className="text-xl text-gray-700 leading-relaxed mb-6">{post.excerpt}</p>}
        <div className="flex flex-wrap items-center gap-5 text-sm text-gray-600 pb-8 border-b border-[var(--color-glass-border)]">
          <span className="flex items-center gap-1.5"><Clock size={14} /> {new Date(post.createdAt).toLocaleDateString()}</span>
          <span className="flex items-center gap-1.5"><Clock size={14} /> {rt} min read</span>
          {post.views > 0 && <span className="flex items-center gap-1.5"><Eye size={14} /> {post.views.toLocaleString()} views</span>}
        </div>
      </header>

      {/* Article Body */}
      <article
        className="prose-custom"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
      />

      {/* Share */}
      <div className="mt-12 p-6 rounded-2xl bg-white/3 border border-[var(--color-glass-border)] text-center">
        <p className="text-gray-600 text-sm mb-4">Found this helpful? Share it:</p>
        <div className="flex justify-center gap-3 flex-wrap">
          <button className="px-5 py-2.5 rounded-full bg-[#25D366]/15 text-[#25D366] border border-[#25D366]/30 hover:bg-[#25D366]/25 transition-colors text-sm font-medium">
            📲 WhatsApp
          </button>
          <button className="px-5 py-2.5 rounded-full bg-[#1DA1F2]/15 text-[#1DA1F2] border border-[#1DA1F2]/30 hover:bg-[#1DA1F2]/25 transition-colors text-sm font-medium">
            🐦 Twitter
          </button>
        </div>
      </div>

      {/* Related Posts */}
      {related.length > 0 && (
        <div className="mt-16 pt-10 border-t border-[var(--color-glass-border)]">
          <SectionHeading title="More from the Blog" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8">
            {related.slice(0, 2).map(p => (
              <Link key={p.id} href={`/blog/${p.slug}`} className="group">
                <GlassCard className="h-full hover:border-[var(--color-primary)]/40 transition-all">
                  <div className="flex gap-2 flex-wrap mb-3">
                    {p.tags?.slice(0, 2).map(t => (
                      <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20">{t}</span>
                    ))}
                  </div>
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2 mb-2">{p.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{p.excerpt}</p>
                </GlassCard>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
