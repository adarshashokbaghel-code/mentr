import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

type Props = {
  params: Promise<{ key: string }>;
};

export default async function AdminPage({ params }: Props) {
  const { key } = await params;
  return <AdminDashboard adminKey={key} />;
}
