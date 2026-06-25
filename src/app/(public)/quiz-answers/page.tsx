import Link from "next/link";
import { Calendar, ChevronRight, Trophy } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { getQuizPosts } from "@/lib/data";

export const metadata = {
  title: "Amazon & Flipkart Quiz Answers Today — TechDeals AI",
  description: "Get today's Amazon daily quiz answers and Flipkart daily trivia answers. Win Amazon Pay balance and Flipkart SuperCoins every day.",
};

const PLATFORM_CONFIG: Record<string, { label: string; emoji: string; color: string; bg: string }> = {
  AMAZON:   { label: "Amazon",   emoji: "🛒", color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
  FLIPKART: { label: "Flipkart", emoji: "🛍️", color: "text-blue-400",   bg: "bg-blue-500/10 border-blue-500/20"   },
  OTHER:    { label: "Other",    emoji: "🧩", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
};

function formatQuizDate(d: Date | string) {
  return new Date(d).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

export default async function QuizAnswersPage() {
  const posts = await getQuizPosts();
  const todayPosts = posts.filter(q => {
    const d = new Date(q.quizDate);
    const today = new Date();
    return d.getDate() === today.getDate() && d.getMonth() === today.getMonth();
  });
  const archivePosts = posts.filter(q => !todayPosts.includes(q));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <div className="text-center mb-14 p-12 rounded-3xl bg-gradient-to-br from-orange-500/10 via-transparent to-blue-500/10 border border-[var(--color-glass-border)] relative overflow-hidden">
        <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-orange-500/5 to-blue-500/5 -z-10" />
        <div className="text-6xl mb-4">🧠</div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          Quiz Answers Today
        </h1>
        <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-6">
          Amazon & Flipkart daily quiz answers — updated every morning. Win cash prizes and SuperCoins instantly.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          {["AMAZON", "FLIPKART"].map(p => {
            const cfg = PLATFORM_CONFIG[p];
            return (
              <div key={p} className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-semibold ${cfg.bg} ${cfg.color}`}>
                {cfg.emoji} {cfg.label} Quiz
              </div>
            );
          })}
        </div>
      </div>

      {/* Today's Posts */}
      {todayPosts.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
            <h2 className="text-2xl font-bold text-gray-900">Today&apos;s Quiz Answers</h2>
            <span className="px-3 py-1 rounded-full bg-green-500/15 text-green-400 border border-green-500/20 text-xs font-bold uppercase tracking-wider">LIVE</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {todayPosts.map(quiz => {
              const cfg = PLATFORM_CONFIG[quiz.platform] ?? PLATFORM_CONFIG.OTHER;
              const qaPairs = quiz.qaPairs as Array<{ question: string; answer: string }> || [];
              return (
                <GlassCard key={quiz.id} className="!p-0 overflow-hidden flex flex-col h-full">
                  {/* Header */}
                  <div className={`p-6 border-b border-[var(--color-glass-border)] bg-gradient-to-r ${quiz.platform === "AMAZON" ? "from-orange-500/10 to-transparent" : "from-blue-500/10 to-transparent"}`}>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold mb-3 ${cfg.bg} ${cfg.color}`}>
                      {cfg.emoji} {cfg.label}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{quiz.title}</h3>
                    {quiz.prize && (
                      <div className="flex items-center gap-2 text-sm text-yellow-400">
                        <Trophy size={14} className="shrink-0" />
                        <span className="font-semibold">{quiz.prize}</span>
                      </div>
                    )}
                  </div>

                  {/* Preview Q&As (first 2) */}
                  <div className="p-6 flex-1 space-y-3">
                    {qaPairs.slice(0, 2).map((qa, i) => (
                      <div key={i} className="bg-white/3 rounded-xl p-4 border border-[var(--color-glass-border)]">
                        <p className="text-sm text-gray-600 mb-1.5">Q{i + 1}: {qa.question}</p>
                        <p className="text-sm font-bold text-green-400">✓ {qa.answer}</p>
                      </div>
                    ))}
                    {qaPairs.length > 2 && (
                      <p className="text-xs text-gray-500 text-center">+ {qaPairs.length - 2} more answers inside</p>
                    )}
                  </div>

                  {/* CTA */}
                  <div className="p-6 pt-0">
                    <Link href={`/quiz-answers/${quiz.slug}`} className="block">
                      <GlowButton variant="primary" className="w-full">
                        View All {qaPairs.length} Answers <ChevronRight size={16} className="inline ml-1" />
                      </GlowButton>
                    </Link>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </section>
      )}

      {/* Archive */}
      {archivePosts.length > 0 && (
        <section>
          <SectionHeading title="Past Quiz Archives" subtitle="Yesterday's and older quiz answers for reference." />
          <div className="space-y-4 mt-8">
            {archivePosts.map(quiz => {
              const cfg = PLATFORM_CONFIG[quiz.platform] ?? PLATFORM_CONFIG.OTHER;
              const qaPairs = quiz.qaPairs as Array<{ question: string; answer: string }> || [];
              return (
                <Link key={quiz.id} href={`/quiz-answers/${quiz.slug}`}>
                  <GlassCard className="flex items-center justify-between hover:border-[var(--color-primary)]/40 transition-all group !py-5 !px-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border text-xl ${cfg.bg}`}>
                        {cfg.emoji}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-gray-900 group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">
                          {quiz.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                          <Calendar size={11} />
                          <span>{formatQuizDate(quiz.quizDate)}</span>
                          <span>·</span>
                          <span>{qaPairs.length} questions</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-gray-500 group-hover:text-[var(--color-primary)] shrink-0 transition-colors" />
                  </GlassCard>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* SEO FAQ Box */}
      <div className="mt-16 p-8 rounded-2xl bg-white/3 border border-[var(--color-glass-border)]">
        <h2 className="text-xl font-bold text-gray-900 mb-4">How to Play Amazon & Flipkart Quiz</h2>
        <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
          <p><strong className="text-gray-200">Amazon Daily Quiz:</strong> Open the Amazon app → scroll to &quot;Amazon Funzone&quot; or search &quot;Amazon Quiz&quot; → tap &quot;Start Quiz&quot; → answer all 5 questions correctly to win prizes like Amazon Pay balance, phones, and more.</p>
          <p><strong className="text-gray-200">Flipkart Daily Trivia:</strong> Open the Flipkart app → tap &quot;Games Zone&quot; → select &quot;Daily Trivia&quot; → answer all questions to earn SuperCoins redeemable on purchases.</p>
          <p><strong className="text-gray-200">TechDeals AI Quiz Updates:</strong> We publish answers every morning by 12:00 AM IST so you never miss a chance to win. Bookmark this page for daily updates.</p>
        </div>
      </div>
    </div>
  );
}
