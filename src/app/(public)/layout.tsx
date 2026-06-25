import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import dynamic from "next/dynamic";
import { getCategories } from "@/lib/data";

const AiAssistant = dynamic(() => import("@/components/ui/AiAssistant").then(mod => mod.AiAssistant));

function Footer() {
  return (
    <footer className="w-full border-t border-gray-100 bg-white/60 backdrop-blur-xl relative z-10 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          <div className="col-span-2">
            <h3 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white text-sm">TA</span>
              TechDeals<span className="text-blue-600">.</span>
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-4 font-medium">Discover AI-curated tech deals. We analyse thousands of products daily and surface only the best value for money.</p>
            <div className="flex gap-3">
              <a href="/contact" className="px-4 py-2 rounded-full bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 text-xs font-bold hover:bg-[#25D366]/20 transition-colors">📲 WhatsApp</a>
              <a href="/contact" className="px-4 py-2 rounded-full bg-[#1DA1F2]/10 text-[#1DA1F2] border border-[#1DA1F2]/20 text-xs font-bold hover:bg-[#1DA1F2]/20 transition-colors">✈️ Telegram</a>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-[0.15em]">Deals</h4>
            <ul className="space-y-2.5 text-gray-600 text-sm font-medium">
              <li><Link href="/deals" className="hover:text-blue-600 transition-colors">All Deals</Link></li>
              <li><Link href="/deals?type=HOT" className="hover:text-blue-600 transition-colors">Hot Deals</Link></li>
              <li><Link href="/coupons" className="hover:text-blue-600 transition-colors">Coupons</Link></li>
              <li><Link href="/compare" className="hover:text-blue-600 transition-colors">Compare</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-[0.15em]">Content</h4>
            <ul className="space-y-2.5 text-gray-600 text-sm font-medium">
              <li><Link href="/blog" className="hover:text-blue-600 transition-colors">Blog</Link></li>
              <li><Link href="/quiz-answers" className="hover:text-blue-600 transition-colors">Quiz Answers</Link></li>
              <li><Link href="/store" className="hover:text-blue-600 transition-colors">Stores</Link></li>
              <li><Link href="/brand" className="hover:text-blue-600 transition-colors">Brands</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-[0.15em]">Legal</h4>
            <ul className="space-y-2.5 text-gray-600 text-sm font-medium">
              <li><Link href="/about" className="hover:text-blue-600 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-blue-600 transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</Link></li>
              <li><Link href="/disclaimer" className="hover:text-blue-600 transition-colors">Disclaimer</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-8 text-center">
          <p className="text-gray-400 text-sm mb-2 font-medium">As an Amazon Associate and affiliate partner, we earn from qualifying purchases.</p>
          <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} TechDeals AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const categories = await getCategories();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden pb-16 lg:pb-0">
      <Navbar categories={categories} />
      <main className="flex-1 w-full relative z-10">{children}</main>
      <Footer />
      <BottomNav />
      <AiAssistant />
    </div>
  );
}
