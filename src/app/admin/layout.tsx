import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import {
  LayoutDashboard,
  Tags,
  List,
  HelpCircle,
  FileText,
  Settings,
  Search,
  Bell,
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
    <div className="min-h-screen bg-gray-50 flex text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-200 bg-white hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]">
            SmartNivad Pro
          </h2>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
            >
              {link.icon}
              <span className="font-medium">{link.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-bold">
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
        {/* Mobile Header */}
        <header className="h-16 border-b border-gray-200 bg-white flex items-center px-6 md:hidden">
          <h2 className="text-xl font-black text-gray-900">SmartNivad Pro</h2>
        </header>

        {/* Desktop Header / Command Palette UI */}
        <header className="hidden md:flex h-16 border-b border-gray-200 bg-white/80 backdrop-blur items-center justify-between px-10 sticky top-0 z-10">
          <div className="flex items-center gap-4 text-gray-500 text-sm">
            <span className="font-semibold text-gray-900">Admin</span>
            <span>/</span>
            <span>Dashboard</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search deals, users, or settings... (Cmd+K)"
                className="bg-gray-100 border border-transparent text-sm rounded-full pl-10 pr-4 py-2 w-80 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all placeholder-gray-500 text-gray-900"
              />
            </div>

            <button className="text-gray-500 hover:text-gray-900 relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        <div className="flex-1 p-6 md:p-10 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
