"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, Menu, X, Tag, Store, Cpu, BookOpen, HelpCircle, Laptop, Smartphone, Headphones, Gamepad2, UserCircle, LogOut, ChevronDown, Zap } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQ.trim()) {
      router.push(`/deals?q=${encodeURIComponent(searchQ)}`);
      setSearchOpen(false);
    }
  };

  return (
    <>
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-white/85 backdrop-blur-2xl border-b border-gray-200/50 shadow-sm" 
            : "bg-transparent border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="text-2xl font-black text-gray-900 tracking-tight shrink-0 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#06B6D4] flex items-center justify-center text-white text-sm shadow-sm">TA</span>
              TechDeals<span className="text-[#2563EB]">.</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-8 font-medium">
              <div className="relative group">
                <button className="flex items-center gap-1.5 text-gray-600 hover:text-[#2563EB] transition-colors py-2">
                  <Tag size={16} /> Deals <ChevronDown size={14} className="opacity-50 group-hover:rotate-180 transition-transform" />
                </button>
                <div className="absolute top-full left-0 pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50">
                  <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-gray-100 p-2 w-48">
                    <Link href="/deals" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-xl transition-colors">All Deals</Link>
                    <Link href="/deals?type=HOT" className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors">Hot Deals</Link>
                    <Link href="/coupons" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-xl transition-colors">Coupons</Link>
                  </div>
                </div>
              </div>
              
              <Link href="/store" className="flex items-center gap-1.5 text-gray-600 hover:text-[#2563EB] transition-colors">
                <Store size={16} /> Stores
              </Link>

              <div className="relative group">
                <button className="flex items-center gap-1.5 text-gray-600 hover:text-[#2563EB] transition-colors py-2">
                  <Cpu size={16} /> Hardware <ChevronDown size={14} className="opacity-50 group-hover:rotate-180 transition-transform" />
                </button>
                <div className="absolute top-full left-0 pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50">
                  <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-gray-100 p-2 w-56 grid grid-cols-1 gap-1">
                    <Link href="/deals?category=laptop" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors">
                      <Laptop size={16} /> Laptops
                    </Link>
                    <Link href="/deals?category=smartphone" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-xl transition-colors">
                      <Smartphone size={16} /> Smartphones
                    </Link>
                    <Link href="/deals?category=audio" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 rounded-xl transition-colors">
                      <Headphones size={16} /> Audio
                    </Link>
                    <Link href="/deals?category=gaming" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-xl transition-colors">
                      <Gamepad2 size={16} /> Gaming
                    </Link>
                  </div>
                </div>
              </div>

              <Link href="/blog" className="flex items-center gap-1.5 text-gray-600 hover:text-[#2563EB] transition-colors">
                <BookOpen size={16} /> Blog
              </Link>
              
              <Link href="/quiz-answers" className="flex items-center gap-1.5 text-gray-600 hover:text-[#2563EB] transition-colors">
                <HelpCircle size={16} /> Quiz Answers
              </Link>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-3">
              <button 
                onClick={() => setSearchOpen(!searchOpen)}
                className="w-11 h-11 flex items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100 hover:text-[#2563EB] transition-colors"
                aria-label="Search"
              >
                {searchOpen ? <X size={22} /> : <Search size={22} />}
              </button>

              <div className="relative">
                {status === "loading" ? (
                  <div className="w-11 h-11 rounded-xl bg-gray-100 animate-pulse"></div>
                ) : session ? (
                  <>
                    <button 
                      onClick={() => setProfileOpen(!profileOpen)}
                      className="w-11 h-11 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 text-[#2563EB] hover:bg-blue-100 transition-colors border border-blue-100"
                    >
                      <UserCircle size={24} />
                    </button>
                    
                    {profileOpen && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-gray-100 py-2 z-50">
                        <div className="px-4 py-2 border-b border-gray-100 mb-2">
                          <p className="text-sm font-bold text-gray-900 truncate">{session.user?.name || 'User'}</p>
                          <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                        </div>
                        <Link href="/dashboard" className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                          <UserCircle size={18} /> My Dashboard
                        </Link>
                        {session.user?.role === 'ADMIN' && (
                          <Link href="/admin" className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                            <Store size={18} /> Admin Dashboard
                          </Link>
                        )}
                        <button 
                          onClick={() => signOut()}
                          className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                        >
                          <LogOut size={18} /> Sign out
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <button 
                    onClick={() => signIn('google')}
                    className="gradient-btn px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hidden sm:block min-h-[44px]"
                  >
                    Log In
                  </button>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden w-11 h-11 flex items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Bar Overlay */}
      {searchOpen && (
        <div className="fixed top-16 left-0 w-full bg-white/90 backdrop-blur-2xl border-b border-gray-200 z-40 p-4 shadow-sm animate-in slide-in-from-top-2">
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search laptops, smartphones, stores..."
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl text-gray-900 focus:outline-none focus:bg-white focus:border-blue-500 transition-all font-medium"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              autoFocus
            />
          </form>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-40 bg-white/95 backdrop-blur-xl lg:hidden overflow-y-auto">
          <div className="p-4 space-y-2">
            {!session && (
              <button 
                onClick={() => signIn('google')}
                className="w-full gradient-btn py-3 rounded-xl font-bold mb-4"
              >
                Log In / Sign Up
              </button>
            )}
            
            <div className="py-2">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-4">Browse</h3>
              <Link href="/deals" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-900 hover:bg-blue-50 font-medium">
                <Tag size={18} className="text-blue-500" /> All Deals
              </Link>
              <Link href="/deals?type=HOT" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-900 hover:bg-red-50 font-medium">
                <Zap size={18} className="text-red-500" /> Hot Deals
              </Link>
              <Link href="/store" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-900 hover:bg-gray-50 font-medium">
                <Store size={18} className="text-purple-500" /> Stores
              </Link>
            </div>

            <div className="py-2">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-4">Categories</h3>
              <Link href="/deals?category=laptop" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-900 hover:bg-gray-50 font-medium">
                <Laptop size={18} className="text-gray-400" /> Laptops
              </Link>
              <Link href="/deals?category=smartphone" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-900 hover:bg-gray-50 font-medium">
                <Smartphone size={18} className="text-gray-400" /> Smartphones
              </Link>
            </div>

            <div className="py-2">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-4">More</h3>
              <Link href="/blog" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-900 hover:bg-gray-50 font-medium">
                <BookOpen size={18} className="text-cyan-500" /> Blog
              </Link>
              <Link href="/quiz-answers" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-900 hover:bg-gray-50 font-medium">
                <HelpCircle size={18} className="text-amber-500" /> Quiz Answers
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
