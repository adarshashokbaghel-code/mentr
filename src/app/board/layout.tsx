import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Requirements board",
  description:
    "Live parent requirements near you. Send a free pitch — no coins, no lead fees.",
  robots: { index: false, follow: false },
};

export default function BoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
