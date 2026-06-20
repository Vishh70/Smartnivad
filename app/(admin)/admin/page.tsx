import { requireAdmin } from "@/lib/auth";
import { signOut } from "next-auth/react";
import LogoutButton from "./LogoutButton";

export default async function AdminDashboard() {
  const adminUser = await requireAdmin();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="mt-4">Welcome, {adminUser.name}!</p>
      <div className="mt-8">
        <LogoutButton />
      </div>
    </div>
  );
}
