import { requireAdmin } from "@/lib/auth";
import { Settings } from "lucide-react";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { SettingsTabs } from "./SettingsTabs";

export const metadata: Metadata = {
  title: "Admin Settings | SmartNivad",
};

export default async function AdminSettingsPage() {
  const admin = await requireAdmin();

  const dbSettings = await prisma.platformSetting.findMany();
  const initialSettings = dbSettings.reduce(
    (acc, s) => {
      acc[s.key] = s.value;
      return acc;
    },
    {} as Record<string, string>,
  );

  const admins = await prisma.admin.findMany({
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center shadow-lg">
          <Settings className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Settings
          </h1>
          <p className="text-sm text-gray-400">
            Manage your platform, team, and security preferences.
          </p>
        </div>
      </div>

      <SettingsTabs
        adminEmail={admin.email}
        initialSettings={initialSettings}
        admins={admins}
      />
    </div>
  );
}
