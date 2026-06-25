"use client";

import { useState, useTransition } from "react";
import {
  User,
  Shield,
  Zap,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Users,
  Trash2,
  Plus,
  Lock,
  Eye,
  EyeOff,
  Activity,
  Globe,
  Database,
  X,
} from "lucide-react";
import {
  updateSetting,
  clearCache,
  triggerManualScrape,
  addAdmin,
  removeAdmin,
  changePassword,
} from "./actions";

interface SettingsTabsProps {
  adminEmail: string;
  initialSettings: Record<string, string>;
  admins: { id: string; email: string; name: string | null; createdAt: Date }[];
}

const TABS = [
  { id: "profile", label: "Profile", icon: User, color: "text-violet-600" },
  { id: "security", label: "Security", icon: Lock, color: "text-emerald-600" },
  { id: "platform", label: "Platform", icon: Globe, color: "text-sky-600" },
  { id: "team", label: "Team", icon: Users, color: "text-amber-600" },
  { id: "tools", label: "Tools", icon: Activity, color: "text-rose-600" },
];

export function SettingsTabs({
  adminEmail,
  initialSettings,
  admins,
}: SettingsTabsProps) {
  const [activeTab, setActiveTab] = useState("profile");
  const [, startTransition] = useTransition();
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const [settings, setSettings] = useState(initialSettings);
  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");

  // Password form
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);

  const flash = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const handleToggle = (key: string, cur: string) => {
    const next = cur === "true" ? "false" : "true";
    setSettings((p) => ({ ...p, [key]: next }));
    startTransition(async () => {
      try {
        await updateSetting(key, next);
        flash("Setting saved");
      } catch {
        setSettings((p) => ({ ...p, [key]: cur }));
        flash("Failed to save", false);
      }
    });
  };

  const runAction = async (
    id: string,
    fn: () => Promise<{ success: boolean }>,
    msg: string,
  ) => {
    setLoadingAction(id);
    try {
      await fn();
      flash(msg);
    } catch {
      flash("Action failed", false);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail) return;
    setLoadingAction("add_admin");
    try {
      await addAdmin(newAdminEmail, newAdminName);
      setNewAdminEmail("");
      setNewAdminName("");
      flash("Admin invited!");
    } catch (err: unknown) {
      flash((err as Error).message || "Failed", false);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleRemoveAdmin = async (id: string) => {
    setLoadingAction("rm_" + id);
    try {
      await removeAdmin(id);
      flash("Admin removed");
    } catch (err: unknown) {
      flash((err as Error).message || "Failed", false);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPw || !confirmPw) return;
    setLoadingAction("pw");
    try {
      await changePassword(newPw, confirmPw);
      setNewPw("");
      setConfirmPw("");
      flash("Password changed successfully!");
    } catch (err: unknown) {
      flash((err as Error).message || "Password change failed", false);
    } finally {
      setLoadingAction(null);
    }
  };

  const active = TABS.find((t) => t.id === activeTab)!;

  return (
    <>
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border backdrop-blur-sm transition-all ${toast.ok ? "bg-emerald-50/90 border-emerald-200 text-emerald-800" : "bg-red-50/90 border-red-200 text-red-800"}`}
        >
          {toast.ok ? <CheckCircle2 size={18} /> : <X size={18} />}
          <span className="text-sm font-bold">{toast.msg}</span>
        </div>
      )}

      {/* Main Container — unique split layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Tab Navigation — vertical pill style */}
        <div className="lg:w-56 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-3 space-y-1 lg:sticky lg:top-24">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-bold transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-md"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <tab.icon
                  size={18}
                  className={activeTab === tab.id ? "text-white" : tab.color}
                />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Tab Content */}
        <div className="flex-1 min-w-0">
          {/* Tab Header Strip */}
          <div className="flex items-center gap-3 mb-6">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700 text-white shadow-md`}
            >
              <active.icon size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">
                {active.label}
              </h2>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">
                Settings Panel
              </p>
            </div>
          </div>

          {/* ─── PROFILE ─── */}
          {activeTab === "profile" && (
            <div className="grid gap-5 max-w-xl">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-lg">
                    {adminEmail[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-lg font-black text-gray-900">
                      Super Admin
                    </p>
                    <p className="text-sm text-gray-500 font-mono">
                      {adminEmail}
                    </p>
                  </div>
                </div>
                <div className="grid gap-3">
                  <InfoRow label="Email" value={adminEmail} />
                  <InfoRow label="Role" value="Super Admin" />
                  <InfoRow label="Auth Provider" value="Credentials" />
                </div>
              </div>
            </div>
          )}

          {/* ─── SECURITY (Change Password) ─── */}
          {activeTab === "security" && (
            <div className="grid gap-5 max-w-xl">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-1">
                  Change Password
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Update your admin login password. Minimum 6 characters.
                </p>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPw ? "text" : "password"}
                        required
                        minLength={6}
                        value={newPw}
                        onChange={(e) => setNewPw(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none text-sm pr-12 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw(!showPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                      >
                        {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={confirmPw}
                      onChange={(e) => setConfirmPw(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none text-sm transition-all"
                    />
                    {confirmPw && newPw !== confirmPw && (
                      <p className="text-xs text-red-500 mt-1.5 font-medium">
                        Passwords don&apos;t match
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={
                      loadingAction === "pw" ||
                      !newPw ||
                      !confirmPw ||
                      newPw !== confirmPw
                    }
                    className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-2"
                  >
                    {loadingAction === "pw" ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <>
                        <Lock size={16} /> Update Password
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Security Status Cards */}
              <div className="grid grid-cols-2 gap-3">
                <StatusCard
                  label="Two-Factor Auth"
                  status="Coming Soon"
                  color="amber"
                />
                <StatusCard
                  label="Login Sessions"
                  status="Active"
                  color="emerald"
                />
              </div>
            </div>
          )}

          {/* ─── PLATFORM ─── */}
          {activeTab === "platform" && (
            <div className="grid gap-4 max-w-2xl">
              <ToggleCard
                title="Maintenance Mode"
                desc="Display a maintenance page to all visitors."
                icon={<Shield size={20} className="text-sky-500" />}
                active={settings.maintenanceMode === "true"}
                onToggle={() =>
                  handleToggle(
                    "maintenanceMode",
                    settings.maintenanceMode || "false",
                  )
                }
              />
              <ToggleCard
                title="Auto-Publish Scraped Deals"
                desc="Automatically publish deals found by the scraper."
                icon={<Database size={20} className="text-violet-500" />}
                active={settings.autoPublishDeals === "true"}
                onToggle={() =>
                  handleToggle(
                    "autoPublishDeals",
                    settings.autoPublishDeals || "false",
                  )
                }
              />
              <ToggleCard
                title="Allow User Signups"
                desc="Allow new users to create accounts on the platform."
                icon={<Users size={20} className="text-emerald-500" />}
                active={settings.allowSignups === "true"}
                onToggle={() =>
                  handleToggle("allowSignups", settings.allowSignups || "true")
                }
              />
            </div>
          )}

          {/* ─── TEAM ─── */}
          {activeTab === "team" && (
            <div className="space-y-6 max-w-3xl">
              {/* Add Admin Form */}
              <form
                onSubmit={handleAddAdmin}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5"
              >
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Plus size={18} className="text-amber-500" /> Invite New Admin
                </h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={newAdminName}
                      onChange={(e) => setNewAdminName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none text-sm"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      disabled={loadingAction === "add_admin"}
                      className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl transition-all shadow-md flex items-center gap-2 whitespace-nowrap"
                    >
                      {loadingAction === "add_admin" ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <>
                          <Plus size={16} /> Invite
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>

              {/* Admin Cards */}
              <div className="grid gap-3">
                {admins.map((a) => (
                  <div
                    key={a.id}
                    className="bg-white rounded-2xl border border-gray-200 shadow-sm px-5 py-4 flex items-center justify-between hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shadow ${a.email === "admin@smartnivad.com" ? "bg-gradient-to-br from-amber-500 to-orange-600" : "bg-gradient-to-br from-sky-500 to-blue-600"}`}
                      >
                        {(a.name || a.email)[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">
                          {a.name || "Unnamed"}
                        </p>
                        <p className="text-xs text-gray-400 font-mono">
                          {a.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold ${a.email === "admin@smartnivad.com" ? "bg-amber-100 text-amber-800" : "bg-sky-100 text-sky-800"}`}
                      >
                        {a.email === "admin@smartnivad.com" ? "Owner" : "Admin"}
                      </span>
                      {a.email !== "admin@smartnivad.com" && (
                        <button
                          onClick={() => handleRemoveAdmin(a.id)}
                          disabled={loadingAction === "rm_" + a.id}
                          className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                          title="Revoke Access"
                        >
                          {loadingAction === "rm_" + a.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {admins.length === 0 && (
                  <div className="text-center py-12 text-gray-400 text-sm">
                    No team members yet. Invite someone above!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── TOOLS ─── */}
          {activeTab === "tools" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
              <ToolCard
                title="Clear Site Cache"
                desc="Force the website to revalidate all cached pages immediately."
                icon={<RefreshCw size={20} className="text-sky-500" />}
                btnLabel="Clear Now"
                btnColor="from-sky-500 to-blue-600"
                loading={loadingAction === "cache"}
                onClick={() => runAction("cache", clearCache, "Cache cleared!")}
              />
              <ToolCard
                title="Manual Sync"
                desc="Trigger the deal scraper engine to run a full sync cycle."
                icon={<Zap size={20} className="text-amber-500" />}
                btnLabel="Run Sync"
                btnColor="from-amber-500 to-orange-600"
                loading={loadingAction === "sync"}
                onClick={() =>
                  runAction("sync", triggerManualScrape, "Sync completed!")
                }
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ── Sub-components ── */

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
        {label}
      </span>
      <span className="text-sm font-semibold text-gray-700">{value}</span>
    </div>
  );
}

function StatusCard({
  label,
  status,
  color,
}: {
  label: string;
  status: string;
  color: string;
}) {
  const colors: Record<string, string> = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    red: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <div className={`rounded-2xl border p-4 ${colors[color]}`}>
      <p className="text-xs font-bold uppercase tracking-wider opacity-60">
        {label}
      </p>
      <p className="text-lg font-black mt-1">{status}</p>
    </div>
  );
}

function ToggleCard({
  title,
  desc,
  icon,
  active,
  onToggle,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center justify-between hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <p className="font-bold text-gray-900 text-sm">{title}</p>
          <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
        </div>
      </div>
      <button
        onClick={onToggle}
        className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${active ? "bg-emerald-500" : "bg-gray-300"}`}
      >
        <div
          className={`absolute top-1 bg-white w-6 h-6 rounded-full shadow-md transition-transform duration-300 ${active ? "left-7" : "left-1"}`}
        />
      </button>
    </div>
  );
}

function ToolCard({
  title,
  desc,
  icon,
  btnLabel,
  btnColor,
  loading,
  onClick,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
  btnLabel: string;
  btnColor: string;
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 mb-2">
          {icon}
          <h3 className="font-bold text-gray-900 text-sm">{title}</h3>
        </div>
        <p className="text-xs text-gray-400">{desc}</p>
      </div>
      <button
        onClick={onClick}
        disabled={loading}
        className={`mt-5 w-full py-2.5 bg-gradient-to-r ${btnColor} text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-40`}
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : btnLabel}
      </button>
    </div>
  );
}
