import { requireAdmin } from "@/lib/auth";
import { Settings, Shield, User as UserIcon, Bell } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Settings | TechDeals AI",
};

export default async function AdminSettingsPage() {
  const admin = await requireAdmin();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
          <Settings className="text-[var(--color-primary)]" size={32} />
          Settings
        </h1>
        <p className="text-gray-600 mt-2">Manage your platform preferences and admin account.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="p-6 rounded-2xl bg-black/5 border border-white/10">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <UserIcon size={20} className="text-[var(--color-secondary)]" />
            Admin Profile
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
              <div className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-gray-900 font-mono text-sm">
                {admin.email}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Role</label>
              <div className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-gray-900 font-mono text-sm">
                Super Admin
              </div>
            </div>
            <button disabled className="mt-4 px-6 py-2 bg-[var(--color-primary)]/50 text-black font-semibold rounded-xl cursor-not-allowed opacity-50">
              Change Password (Coming Soon)
            </button>
          </div>
        </div>

        {/* Platform Settings */}
        <div className="p-6 rounded-2xl bg-black/5 border border-white/10">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Shield size={20} className="text-[var(--color-primary)]" />
            Platform Security
          </h2>
          <div className="space-y-4 text-gray-600 text-sm">
            <div className="flex items-center justify-between p-4 rounded-xl bg-black/30 border border-white/5">
              <div>
                <p className="text-gray-900 font-medium">Two-Factor Authentication</p>
                <p className="text-xs mt-1">Require a code when logging into the admin panel.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-gray-500/20 text-gray-600 text-xs font-bold uppercase">Disabled</span>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-xl bg-black/30 border border-white/5">
              <div>
                <p className="text-gray-900 font-medium">Email Notifications</p>
                <p className="text-xs mt-1">Get alerted when a deal is reported as expired.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary)] text-xs font-bold uppercase">Enabled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
