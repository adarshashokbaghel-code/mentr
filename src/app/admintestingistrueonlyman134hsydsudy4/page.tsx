import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { ADMIN_PANEL_KEY } from "@/lib/admin-panel";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function SecretAdminPage() {
  return <AdminDashboard adminKey={ADMIN_PANEL_KEY} />;
}
