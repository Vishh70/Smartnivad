"use client";

export function NewsletterForm() {
  return (
    <form
      className="flex gap-3 max-w-md mx-auto"
      onSubmit={e => {
        e.preventDefault();
        const email = (e.currentTarget.elements.namedItem("email") as HTMLInputElement)?.value;
        if (email) alert(`Thanks! We'll send deals to ${email}`);
      }}
    >
      <input
        name="email"
        type="email"
        placeholder="your@email.com"
        className="flex-1 px-4 py-3 rounded-xl bg-black/5 border border-[var(--color-glass-border)] text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[var(--color-primary)] text-sm"
      />
      <button
        type="submit"
        className="px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-semibold text-sm hover:bg-purple-500 transition-colors whitespace-nowrap"
      >
        Subscribe
      </button>
    </form>
  );
}
