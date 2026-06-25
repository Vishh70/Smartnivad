import { requireAdmin } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Search, Bell } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen bg-gray-50 flex text-gray-900">
      <AdminSidebar
        adminName={admin.name || "Admin"}
        adminEmail={admin.email}
      />

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
