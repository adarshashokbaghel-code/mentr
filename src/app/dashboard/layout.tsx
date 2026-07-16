import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tutor dashboard",
  description:
    "Manage your Mentr listing — profile strength, open slots, connection requests, and pitches.",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
