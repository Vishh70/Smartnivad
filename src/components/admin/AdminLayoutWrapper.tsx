"use client";

import { useState } from "react";
import { Menu, Search, Bell } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

interface AdminLayoutWrapperProps {
  children: React.ReactNode;
  adminName: string;
  adminEmail: string;
}

/**
 * Thin responsive shell around AdminSidebar.
 * On md+ screens the sidebar is always visible (static) with a desktop topbar.
 * On mobile screens it renders as a slide-in drawer triggered by a hamburger button.
 */
export function AdminLayoutWrapper({
  children,
  adminName,
  adminEmail,
}: AdminLayoutWrapperProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex text-gray-900">
      {/* ── Desktop Sidebar (always visible md+) ── */}
      <div className="hidden md:block">
        <AdminSidebar adminName={adminName} adminEmail={adminEmail} />
      </div>

      {/* ── Mobile Drawer Backdrop ── */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          aria-hidden="true"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* ── Mobile Drawer Panel ── */}
      <div
        className={`fixed inset-y-0 left-0 z-50 md:hidden transform transition-transform duration-300 ease-in-out ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`}
        aria-label="Mobile navigation drawer"
      >
        <AdminSidebar
          adminName={adminName}
          adminEmail={adminEmail}
          onClose={() => setDrawerOpen(false)}
        />
      </div>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col min-h-screen max-w-full overflow-x-hidden">
        {/* Mobile Header with hamburger */}
        <header className="h-16 border-b border-gray-200 bg-white flex items-center gap-4 px-4 md:hidden sticky top-0 z-30">
          <button
            aria-label="Open navigation menu"
            onClick={() => setDrawerOpen(true)}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <Menu size={22} />
          </button>
          <h2 className="text-xl font-black text-gray-900">SmartNivad Pro</h2>
        </header>

        {/* Desktop Header */}
        <header className="hidden md:flex h-16 border-b border-gray-200 bg-white/80 backdrop-blur items-center justify-between px-10 sticky top-0 z-10">
          <div className="flex items-center gap-4 text-gray-500 text-sm">
            <span className="font-semibold text-gray-900">Admin</span>
            <span>/</span>
            <span>Dashboard</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search deals, users, or settings... (Cmd+K)"
                className="bg-gray-100 border border-transparent text-sm rounded-full pl-10 pr-4 py-2 w-80 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all placeholder-gray-500 text-gray-900"
              />
            </div>
            <button className="text-gray-500 hover:text-gray-900 relative w-10 h-10 flex items-center justify-center">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
            </button>
          </div>
        </header>

        <div className="flex-1 p-4 sm:p-6 md:p-10 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
