import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Parent dashboard",
  description:
    "Track Instant Connect requests and tutor connections. Once a tutor accepts, their WhatsApp number unlocks — free, no middlemen.",
  robots: { index: false, follow: false },
};

export default function ParentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
