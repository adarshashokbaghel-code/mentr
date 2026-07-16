import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Complete your profile",
  description:
    "Tell parents what you teach, where you are, and when you're available.",
  robots: { index: false, follow: false },
};

export default function ProfilingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
