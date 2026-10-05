import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Parent dashboard",
  description:
    "Track demo bookings, pitches, and Instant Connect. Free for parents — no middlemen.",
  robots: { index: false, follow: false },
};

export default function ParentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
