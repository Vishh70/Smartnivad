import { requireAdmin } from "@/lib/auth";
import { AdminLayoutWrapper } from "@/components/admin/AdminLayoutWrapper";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  return (
    <AdminLayoutWrapper
      adminName={admin.name || "Admin"}
      adminEmail={admin.email}
    >
      {children}
    </AdminLayoutWrapper>
  );
}
