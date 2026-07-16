import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My connections",
  description:
    "Track your tutor connection requests. Once a tutor accepts, their WhatsApp number unlocks for you — free, no middlemen.",
  robots: { index: false, follow: false },
};

export default function ParentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
