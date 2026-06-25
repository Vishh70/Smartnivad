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
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-md border-t border-gray-200 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(0,0,0,0.05)]" style={{ touchAction: 'none' }}>
      <div className="flex items-center justify-around h-16 px-2">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? "text-blue-600" : "text-gray-400 hover:text-gray-700"
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] ${isActive ? "font-bold" : "font-medium"}`}>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
