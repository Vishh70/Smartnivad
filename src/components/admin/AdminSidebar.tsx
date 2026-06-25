"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Tags,
  List,
  HelpCircle,
  FileText,
  Settings,
} from "lucide-react";
import { SignOutButton } from "@/components/admin/SignOutButton";

interface AdminSidebarProps {
  adminName: string;
  adminEmail: string;
}

export function AdminSidebar({ adminName, adminEmail }: AdminSidebarProps) {
  const pathname = usePathname();

  const navLinks = [
    {
      name: "Dashboard",
      href: "/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Deals",
      href: "/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/deals",
      icon: <Tags size={20} />,
    },
    {
      name: "Categories",
      href: "/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/categories",
      icon: <List size={20} />,
    },
    {
      name: "Stores",
      href: "/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/stores",
      icon: <List size={20} />,
    },
    {
      name: "Brands",
      href: "/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/brands",
      icon: <List size={20} />,
    },
    {
      name: "Quizzes",
      href: "/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/quizzes",
      icon: <HelpCircle size={20} />,
    },
    {
      name: "Blog",
      href: "/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/blog",
      icon: <FileText size={20} />,
    },
    {
      name: "Settings",
      href: "/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/settings",
      icon: <Settings size={20} />,
    },
  ];

  return (
    <aside className="w-64 border-r border-gray-200 bg-white hidden md:flex flex-col relative z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      <div className="p-6 border-b border-gray-100 bg-gradient-to-b from-gray-50/50 to-white">
        <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]">
          SmartNivad Pro
        </h2>
      </div>

      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {navLinks.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !==
              "/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a" &&
              pathname?.startsWith(link.href));
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-[var(--color-primary)]/10 to-transparent text-gray-900 font-bold border-l-2 border-[var(--color-primary)]"
                  : "text-gray-500 font-medium hover:text-gray-900 hover:bg-gray-50 border-l-2 border-transparent"
              }`}
            >
              <div
                className={`${isActive ? "text-[var(--color-primary)]" : "text-gray-400"}`}
              >
                {link.icon}
              </div>
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-white shadow-sm border border-gray-100">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-white font-bold text-sm shadow-inner">
            {adminName?.[0] || adminEmail[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">
              {adminName || "Admin"}
            </p>
            <p className="text-xs text-gray-500 truncate">{adminEmail}</p>
          </div>
        </div>
        <SignOutButton />
      </div>
    </aside>
  );
}
