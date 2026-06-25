import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import dynamic from "next/dynamic";
import { getCategories } from "@/lib/data";

const AiAssistant = dynamic(() =>
  import("@/components/ui/AiAssistant").then((mod) => mod.AiAssistant),
);

function Footer() {
  return (
    <footer className="w-full bg-white border-t border-[#ECECEC] pt-10 pb-[100px] lg:pb-10 relative z-10">
      <div className="max-w-7xl mx-auto px-5">
        {/* Brand Section */}
        <div className="max-w-[280px] mx-auto flex flex-col items-center text-center">
          <h3 className="text-[30px] font-[700] text-gray-900 flex items-center justify-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white text-sm">
              TA
            </span>
            TechDeals<span className="text-blue-600">.</span>
          </h3>
          <p className="mt-[10px] text-[15px] text-[#6B7280] leading-[1.7]">
            Discover AI-powered tech deals.
            <br />
            We analyse thousands of products daily
            <br />
            to help you buy smarter.
          </p>
        </div>

        {/* Social Buttons */}
        <div className="flex justify-center gap-[12px] mt-[28px]">
          <a
            href="https://www.instagram.com/smartnivad?igsh=MW1ldnFwNXVlczh0OQ=="
            target="_blank"
            rel="noopener noreferrer"
            className="w-[48%] max-w-[160px] h-[46px] rounded-[999px] flex items-center justify-center gap-2 bg-[#25D366]/10 text-[#25D366] font-[600] text-sm shadow-[0_8px_20px_rgba(0,0,0,.05)] hover:-translate-y-[2px] hover:scale-[1.02] transition-all duration-[0.25s]"
          >
            📸 WhatsApp
          </a>
          <a
            href="https://t.me/SmartNivad"
            target="_blank"
            rel="noopener noreferrer"
            className="w-[48%] max-w-[160px] h-[46px] rounded-[999px] flex items-center justify-center gap-2 bg-[#1DA1F2]/10 text-[#1DA1F2] font-[600] text-sm shadow-[0_8px_20px_rgba(0,0,0,.05)] hover:-translate-y-[2px] hover:scale-[1.02] transition-all duration-[0.25s]"
          >
            ✈️ Telegram
          </a>
        </div>

        {/* Divider */}
        <div className="mt-[28px] mb-[20px] border-t border-[#ECECEC]" />

        {/* Footer Links (Two Column Grid) */}
        <div className="grid grid-cols-2 gap-x-[40px] gap-y-[28px] max-w-sm mx-auto sm:max-w-none sm:grid-cols-3 sm:gap-x-10">
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <h4 className="text-[12px] font-[700] text-[#9CA3AF] mb-[12px] uppercase tracking-[2px]">
              Deals
            </h4>
            <div className="flex flex-col gap-[12px]">
              <Link
                href="/deals"
                className="text-[16px] font-[500] text-[#374151] hover:text-blue-500 hover:translate-x-[4px] transition-all duration-[0.2s]"
              >
                All Deals
              </Link>
              <Link
                href="/deals?type=HOT"
                className="text-[16px] font-[500] text-[#374151] hover:text-blue-500 hover:translate-x-[4px] transition-all duration-[0.2s]"
              >
                Hot Deals
              </Link>
              <Link
                href="/coupons"
                className="text-[16px] font-[500] text-[#374151] hover:text-blue-500 hover:translate-x-[4px] transition-all duration-[0.2s]"
              >
                Coupons
              </Link>
              <Link
                href="/compare"
                className="text-[16px] font-[500] text-[#374151] hover:text-blue-500 hover:translate-x-[4px] transition-all duration-[0.2s]"
              >
                Compare
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <h4 className="text-[12px] font-[700] text-[#9CA3AF] mb-[12px] uppercase tracking-[2px]">
              Content
            </h4>
            <div className="flex flex-col gap-[12px]">
              <Link
                href="/blog"
                className="text-[16px] font-[500] text-[#374151] hover:text-blue-500 hover:translate-x-[4px] transition-all duration-[0.2s]"
              >
                Blog
              </Link>
              <Link
                href="/quiz-answers"
                className="text-[16px] font-[500] text-[#374151] hover:text-blue-500 hover:translate-x-[4px] transition-all duration-[0.2s]"
              >
                Quiz
              </Link>
              <Link
                href="/store"
                className="text-[16px] font-[500] text-[#374151] hover:text-blue-500 hover:translate-x-[4px] transition-all duration-[0.2s]"
              >
                Stores
              </Link>
              <Link
                href="/brand"
                className="text-[16px] font-[500] text-[#374151] hover:text-blue-500 hover:translate-x-[4px] transition-all duration-[0.2s]"
              >
                Brands
              </Link>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 flex flex-col items-center sm:items-start text-center sm:text-left mt-2 sm:mt-0">
            <h4 className="text-[12px] font-[700] text-[#9CA3AF] mb-[12px] uppercase tracking-[2px]">
              Legal
            </h4>
            <div className="flex flex-col gap-[12px]">
              <Link
                href="/about"
                className="text-[16px] font-[500] text-[#374151] hover:text-blue-500 hover:translate-x-[4px] transition-all duration-[0.2s]"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-[16px] font-[500] text-[#374151] hover:text-blue-500 hover:translate-x-[4px] transition-all duration-[0.2s]"
              >
                Contact
              </Link>
              <Link
                href="/privacy"
                className="text-[16px] font-[500] text-[#374151] hover:text-blue-500 hover:translate-x-[4px] transition-all duration-[0.2s]"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-[16px] font-[500] text-[#374151] hover:text-blue-500 hover:translate-x-[4px] transition-all duration-[0.2s]"
              >
                Terms
              </Link>
              <Link
                href="/disclaimer"
                className="text-[16px] font-[500] text-[#374151] hover:text-blue-500 hover:translate-x-[4px] transition-all duration-[0.2s]"
              >
                Disclaimer
              </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-[28px] mb-[20px] border-t border-[#ECECEC]" />

        <div className="flex flex-col items-center text-center">
          <p className="text-[13px] text-[#9CA3AF] max-w-[300px] leading-tight mx-auto">
            As an Amazon Associate and affiliate partner, we earn from
            qualifying purchases.
          </p>
          <p className="mt-[10px] text-[13px] text-[#9CA3AF]">
            &copy; {new Date().getFullYear()} TechDeals AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
