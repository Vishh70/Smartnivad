"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  Search,
  Menu,
  X,
  Tag,
  Store,
  Cpu,
  BookOpen,
  HelpCircle,
  Laptop,
  Smartphone,
  Headphones,
  Gamepad2,
  UserCircle,
  LogOut,
  ChevronDown,
  Zap,
  Heart,
} from "lucide-react";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import type { PrismaCategory } from "@/types";
import { useWishlist } from "@/context/WishlistContext";
import { GlobalSearchModal } from "@/components/ui/GlobalSearchModal";

interface NavbarProps {
  categories?: PrismaCategory[];
}

export function Navbar({ categories = [] }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();
  const hardwareCategories = categories.length
    ? categories.slice(0, 4)
    : [
        { slug: "laptops", name: "Laptops", icon: "Laptop" },
        { slug: "smartphones", name: "Smartphones", icon: "Smartphone" },
        { slug: "audio", name: "Audio", icon: "Headphones" },
        { slug: "gaming", name: "Gaming", icon: "Gamepad2" },
      ];

  const { totalSaved } = useWishlist();

  const getCategoryIcon = (icon: string | null | undefined) => {
    switch (icon) {
      case "Laptop":
        return <Laptop size={16} />;
      case "Smartphone":
        return <Smartphone size={16} />;
      case "Headphones":
        return <Headphones size={16} />;
      case "Gamepad2":
        return <Gamepad2 size={16} />;
      default:
        return <Cpu size={16} />;
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 pt-[env(safe-area-inset-top)] ${
          isScrolled
            ? "bg-white/85 backdrop-blur-2xl border-b border-gray-200/50 shadow-sm"
            : "bg-transparent border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              href="/"
              className="text-2xl font-black text-gray-900 tracking-tight shrink-0 flex items-center gap-2"
            >
              <Image
                src="/logo.png"
                alt="SmartNivad Logo"
                width={36}
                height={36}
                className="object-contain drop-shadow-sm"
              />
              SmartNivad
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-8 font-medium">
              <div className="relative group">
                <button className="flex items-center gap-1.5 text-gray-600 hover:text-[#2563EB] transition-colors py-2">
                  <Tag size={16} /> Deals{" "}
                  <ChevronDown
                    size={14}
                    className="opacity-50 group-hover:rotate-180 transition-transform"
                  />
                </button>
                <div className="absolute top-full left-0 pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50">
                  <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-gray-100 p-2 w-48">
                    <Link
                      href="/deals"
                      data-testid="nav-deals"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-xl transition-colors"
                    >
                      All Deals
                    </Link>
                    <Link
                      href="/deals?type=HOT"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"
                    >
                      Hot Deals
                    </Link>
                    <Link
                      href="/coupons"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-xl transition-colors"
                    >
                      Coupons
                    </Link>
                  </div>
                </div>
              </div>

              <Link
                href="/store"
                className="flex items-center gap-1.5 text-gray-600 hover:text-[#2563EB] transition-colors"
              >
                <Store size={16} /> Stores
              </Link>

              <div className="relative group">
                <button className="flex items-center gap-1.5 text-gray-600 hover:text-[#2563EB] transition-colors py-2">
                  <Cpu size={16} /> Hardware{" "}
                  <ChevronDown
                    size={14}
                    className="opacity-50 group-hover:rotate-180 transition-transform"
                  />
                </button>
                <div className="absolute top-full left-0 pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50">
                  <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-gray-100 p-2 w-56 grid grid-cols-1 gap-1">
                    {hardwareCategories.map((category) => (
                      <Link
                        key={category.slug}
                        href={`/deals?category=${category.slug}`}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors"
                      >
                        {getCategoryIcon(category.icon)} {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <Link
                href="/blog"
                className="flex items-center gap-1.5 text-gray-600 hover:text-[#2563EB] transition-colors"
              >
                <BookOpen size={16} /> Blog
              </Link>

              <Link
                href="/quiz-answers"
                className="flex items-center gap-1.5 text-gray-600 hover:text-[#2563EB] transition-colors"
              >
                <HelpCircle size={16} /> Quiz Answers
              </Link>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-3">
              <button
                onClick={() => setSearchOpen(true)}
                className="group flex items-center justify-center gap-2 h-11 px-3 sm:px-4 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition-colors border border-transparent hover:border-gray-200"
                aria-label="Search"
                data-testid="search-trigger"
              >
                <Search
                  size={20}
                  className="group-hover:scale-110 transition-transform"
                />
                <span className="hidden sm:flex items-center text-xs font-semibold px-1.5 py-0.5 rounded-md bg-white border border-gray-200 shadow-sm text-gray-400">
                  <span className="text-[10px] mr-0.5">⌘</span>K
                </span>
              </button>

              <Link
                href="/wishlist"
                className="relative w-11 h-11 flex items-center justify-center rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-500 transition-colors"
                aria-label="Wishlist"
              >
                <Heart size={22} />
                {totalSaved > 0 && (
                  <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                    {totalSaved}
                  </span>
                )}
              </Link>

              <div className="relative">
                {status === "loading" ? (
                  <div className="w-11 h-11 rounded-xl bg-gray-100 animate-pulse"></div>
                ) : session ? (
                  <div ref={profileRef}>
                    <button
                      onClick={() => setProfileOpen(!profileOpen)}
                      className="w-11 h-11 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 text-[#2563EB] hover:bg-blue-100 transition-colors border border-blue-100"
                    >
                      <UserCircle size={24} />
                    </button>

                    {profileOpen && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-gray-100 py-2 z-50">
                        <div className="px-4 py-2 border-b border-gray-100 mb-2">
                          <p className="text-sm font-bold text-gray-900 truncate">
                            {session.user?.name || "User"}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {session.user?.email}
                          </p>
                        </div>
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                          <UserCircle size={18} /> My Dashboard
                        </Link>
                        {session.user?.role === "ADMIN" && (
                          <Link
                            href="/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a"
                            className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          >
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
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="w-11 h-11 flex items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100 hover:text-[#2563EB] transition-colors"
                    aria-label="Sign In"
                    title="Sign In"
                  >
                    <UserCircle size={24} />
                  </Link>
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

      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[calc(4rem+env(safe-area-inset-top))] z-40 bg-white/95 backdrop-blur-xl lg:hidden overflow-y-auto">
          <div className="p-4 space-y-2">
            <div className="py-2">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-4">
                Browse
              </h3>
              <Link
                href="/deals"
                onClick={() => setMobileMenuOpen(false)}
                data-testid="nav-deals-mobile"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-900 hover:bg-blue-50 font-medium"
              >
                <Tag size={18} className="text-blue-500" /> All Deals
              </Link>
              <Link
                href="/deals?type=HOT"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-900 hover:bg-red-50 font-medium"
              >
                <Zap size={18} className="text-red-500" /> Hot Deals
              </Link>
              <Link
                href="/store"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-900 hover:bg-gray-50 font-medium"
              >
                <Store size={18} className="text-purple-500" /> Stores
              </Link>
            </div>

            <div className="py-2">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-4">
                Categories
              </h3>
              {hardwareCategories.slice(0, 2).map((category) => (
                <Link
                  key={category.slug}
                  href={`/deals?category=${category.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-900 hover:bg-gray-50 font-medium"
                >
                  <span className="text-gray-400">
                    {getCategoryIcon(category.icon)}
                  </span>{" "}
                  {category.name}
                </Link>
              ))}
            </div>

            <div className="py-2">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-4">
                More
              </h3>
              <Link
                href="/blog"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-900 hover:bg-gray-50 font-medium"
              >
                <BookOpen size={18} className="text-cyan-500" /> Blog
              </Link>
              <Link
                href="/quiz-answers"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-900 hover:bg-gray-50 font-medium"
              >
                <HelpCircle size={18} className="text-amber-500" /> Quiz Answers
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
