import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Trophy, ChevronLeft, Share2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getQuizPosts } from "@/lib/data";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = await getQuizPosts();
  const quiz = posts.find(q => q.slug === slug);
  if (!quiz) return { title: "Quiz Not Found" };
  return {
    title: `${quiz.title} — TechDeals AI`,
    description: quiz.seoDesc ?? `All correct answers for ${quiz.title}. Win prizes with TechDeals AI.`,
  };
}

const PLATFORM_CONFIG: Record<string, { label: string; emoji: string; color: string; bg: string }> = {
  AMAZON:   { label: "Amazon",   emoji: "🛒", color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
  FLIPKART: { label: "Flipkart", emoji: "🛍️", color: "text-blue-400",   bg: "bg-blue-500/10 border-blue-500/20"   },
  OTHER:    { label: "Other",    emoji: "🧩", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
};

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

export default async function QuizDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = await getQuizPosts();
  const quiz = posts.find(q => q.slug === slug);
  if (!quiz) notFound();

  const cfg = PLATFORM_CONFIG[quiz.platform] ?? PLATFORM_CONFIG.OTHER;
  const qaPairs = quiz.qaPairs as Array<{ question: string; answer: string }> || [];
  const relatedQuizzes = posts.filter(q => q.id !== quiz.id && q.platform === quiz.platform);

  // JSON-LD for SEO QAPage schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    "name": quiz.title,
    "mainEntity": qaPairs.map(qa => ({
      "@type": "Question",
      "name": qa.question,
      "acceptedAnswer": { "@type": "Answer", "text": qa.answer },
    })),
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Back */}
      <Link href="/quiz-answers" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm mb-8 transition-colors group">
        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Quiz Hub
      </Link>

      {/* Header */}
      <GlassCard className={`mb-8 !p-0 overflow-hidden`}>
        <div className={`p-8 ${quiz.platform === "AMAZON" ? "bg-gradient-to-r from-orange-500/10 to-transparent" : "bg-gradient-to-r from-blue-500/10 to-transparent"}`}>
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-bold mb-4 ${cfg.bg} ${cfg.color}`}>
            {cfg.emoji} {cfg.label} Quiz
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">{quiz.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1.5"><Calendar size={14} /> {formatDate(quiz.quizDate)}</span>
            {quiz.prize && (
              <span className="flex items-center gap-1.5 text-yellow-400 font-semibold"><Trophy size={14} /> {quiz.prize}</span>
            )}
          </div>
        </div>
      </GlassCard>

      {/* Quick Answer Summary */}
      <div className="mb-8 p-5 rounded-2xl bg-green-900/15 border border-green-500/20">
        <p className="text-sm font-semibold text-green-400 mb-3 uppercase tracking-wider">✓ Quick Answers</p>
        <div className="flex flex-wrap gap-2">
          {qaPairs.map((qa, i) => (
            <span key={i} className="px-3 py-1.5 rounded-full bg-green-500/10 text-green-300 border border-green-500/20 text-sm font-medium">
              Q{i + 1}: {qa.answer}
            </span>
          ))}
        </div>
      </div>

      {/* Full Q&A */}
      <SectionHeading title="All Questions & Answers" />
      <div className="space-y-4 mt-8">
        {qaPairs.map((qa, i) => (
          <div key={i} className="rounded-2xl border border-[var(--color-glass-border)] overflow-hidden bg-white/2">
            {/* Question */}
            <div className="flex items-start gap-4 p-5 border-b border-[var(--color-glass-border)] bg-white/2">
              <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/30 flex items-center justify-center text-[var(--color-primary)] font-bold text-sm shrink-0">
                {i + 1}
              </div>
              <p className="text-gray-900 font-medium text-base leading-relaxed pt-0.5">{qa.question}</p>
            </div>
            {/* Answer */}
            <div className="flex items-start gap-4 p-5 bg-green-900/10">
              <div className="w-8 h-8 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center text-green-400 font-bold text-sm shrink-0">
                ✓
              </div>
              <p className="text-green-300 font-bold text-base pt-0.5">{qa.answer}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Social Share */}
      <div className="mt-10 p-6 rounded-2xl bg-white/3 border border-[var(--color-glass-border)] text-center">
        <p className="text-gray-700 text-sm mb-4">Share these answers with friends:</p>
        <div className="flex justify-center gap-3 flex-wrap">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366]/15 text-[#25D366] border border-[#25D366]/30 hover:bg-[#25D366]/25 transition-colors text-sm font-medium">
            📲 Share on WhatsApp
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1DA1F2]/15 text-[#1DA1F2] border border-[#1DA1F2]/30 hover:bg-[#1DA1F2]/25 transition-colors text-sm font-medium">
            <Share2 size={14} /> Share on Twitter
          </button>
        </div>
      </div>

      {/* Related Quizzes */}
      {relatedQuizzes.length > 0 && (
        <div className="mt-12 pt-10 border-t border-[var(--color-glass-border)]">
          <SectionHeading title="More Quiz Answers" />
          <div className="space-y-3 mt-6">
            {relatedQuizzes.map(q => (
              <Link key={q.id} href={`/quiz-answers/${q.slug}`}>
                <GlassCard className="flex items-center justify-between hover:border-[var(--color-primary)]/40 transition-all group !py-4 !px-5">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-[var(--color-primary)] transition-colors">{q.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{formatDate(q.quizDate)}</p>
                  </div>
                  <ChevronLeft size={16} className="text-gray-500 group-hover:text-[var(--color-primary)] rotate-180 transition-colors shrink-0" />
                </GlassCard>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
