"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Tag, Tags, Cpu } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/deals", label: "Deals", icon: Tag },
    { href: "/coupons", label: "Coupons", icon: Tags },
    { href: "/compare", label: "Compare", icon: Cpu },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] backdrop-blur-[20px] bg-[rgba(255,255,255,.92)] border-t border-[rgba(0,0,0,.08)] pb-[env(safe-area-inset-bottom)]"
      style={{ touchAction: "none" }}
    >
      {/* Define SVG gradient once for active state icons */}
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <linearGradient
            id="active-icon-grad"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop stopColor="#2563EB" offset="0%" />
            <stop stopColor="#3B82F6" offset="100%" />
          </linearGradient>
        </defs>
      </svg>

      <div className="flex items-center justify-around h-[70px] px-2 max-w-md mx-auto">
        {links.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== "/" && pathname?.startsWith(link.href));
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300 ${
                isActive ? "scale-110" : "hover:text-gray-900"
              }`}
            >
              <div className="relative p-1">
                {isActive ? (
                  <Icon
                    size={24}
                    strokeWidth={2.5}
                    stroke="url(#active-icon-grad)"
                  />
                ) : (
                  <Icon size={24} strokeWidth={2} className="text-gray-400" />
                )}
              </div>
              <span
                className={`text-[12px] ${isActive ? "text-blue-600 font-bold" : "font-medium text-gray-500"}`}
              >
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
