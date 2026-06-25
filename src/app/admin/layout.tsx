import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import {
  LayoutDashboard,
  Tags,
  List,
  HelpCircle,
  FileText,
  Settings,
} from "lucide-react";
import { SignOutButton } from "@/components/admin/SignOutButton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  const navLinks = [
    { name: "Dashboard", href: "/admin", icon: <LayoutDashboard size={20} /> },
    { name: "Deals", href: "/admin/deals", icon: <Tags size={20} /> },
    { name: "Categories", href: "/admin/categories", icon: <List size={20} /> },
    { name: "Stores", href: "/admin/stores", icon: <List size={20} /> },
    { name: "Brands", href: "/admin/brands", icon: <List size={20} /> },
    { name: "Quizzes", href: "/admin/quizzes", icon: <HelpCircle size={20} /> },
    { name: "Blog", href: "/admin/blog", icon: <FileText size={20} /> },
    { name: "Settings", href: "/admin/settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-black/50 hidden md:flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]">
            TechDeals Admin
          </h2>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-black/5 rounded-xl transition-colors"
            >
              {link.icon}
              <span className="font-medium">{link.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-gray-900 font-bold">
              {admin.name?.[0] || admin.email[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {admin.name || "Admin"}
              </p>
              <p className="text-xs text-gray-500 truncate">{admin.email}</p>
            </div>
          </div>
          <SignOutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen max-w-full overflow-x-hidden">
        <header className="h-16 border-b border-white/10 bg-black/50 flex items-center px-6 md:hidden">
          <h2 className="text-xl font-black text-gray-900">Admin</h2>
        </header>
        <div className="flex-1 p-6 md:p-10 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
