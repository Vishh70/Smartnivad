import { Mail } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

export const metadata = {
  title: "Contact Us — TechDeals AI",
  description:
    "Get in touch with the TechDeals AI team for deal submissions, partnerships, or support.",
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-14">
        <div className="text-6xl mb-4">📬</div>
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
          Contact Us
        </h1>
        <p className="text-xl text-gray-700">
          We&apos;d love to hear from you — whether it&apos;s a deal tip,
          partnership inquiry, or just a hello.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
        {[
          {
            icon: "📧",
            label: "Email",
            value: "hello@techdealsai.com",
            href: "mailto:hello@techdealsai.com",
          },
          {
            icon: "📲",
            label: "WhatsApp",
            value: "Join our channel",
            href: "#",
          },
          {
            icon: "✈️",
            label: "Telegram",
            value: "Join our channel",
            href: "#",
          },
        ].map((c) => (
          <a key={c.label} href={c.href} className="group">
            <GlassCard className="text-center hover:border-[var(--color-primary)]/40 transition-all">
              <div className="text-4xl mb-3">{c.icon}</div>
              <div className="text-xs text-gray-600 uppercase tracking-wider mb-1">
                {c.label}
              </div>
              <div className="text-sm font-semibold text-gray-900 group-hover:text-[var(--color-primary)] transition-colors">
                {c.value}
              </div>
            </GlassCard>
          </a>
        ))}
      </div>

      {/* Contact Form */}
      <GlassCard className="!p-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Send a Message
        </h2>
        <form className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="contact-name"
                className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-2 block"
              >
                Your Name
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="John Smith"
                className="w-full px-4 py-3 rounded-xl bg-black/5 border border-[var(--color-glass-border)] text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[var(--color-primary)] text-sm transition-colors"
              />
            </div>
            <div>
              <label
                htmlFor="contact-email"
                className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-2 block"
              >
                Email Address
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl bg-black/5 border border-[var(--color-glass-border)] text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[var(--color-primary)] text-sm transition-colors"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="contact-subject"
              className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-2 block"
            >
              Subject
            </label>
            <select
              id="contact-subject"
              name="subject"
              className="w-full px-4 py-3 rounded-xl bg-black/5 border border-[var(--color-glass-border)] text-gray-900 focus:outline-none focus:border-[var(--color-primary)] text-sm appearance-none cursor-pointer"
            >
              {[
                "Submit a Deal",
                "Partnership Inquiry",
                "Advertise with Us",
                "Report Broken Link",
                "General Query",
              ].map((o) => (
                <option key={o} value={o} className="bg-[#0f0f1a]">
                  {o}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="contact-message"
              className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-2 block"
            >
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={6}
              placeholder="Tell us how we can help…"
              className="w-full px-4 py-3 rounded-xl bg-black/5 border border-[var(--color-glass-border)] text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[var(--color-primary)] text-sm resize-none transition-colors"
            />
          </div>
          <button
            type="button"
            className="w-full py-4 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-gray-900 font-bold text-base hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <Mail size={18} /> Send Message
          </button>
        </form>
      </GlassCard>
    </div>
  );
}
