import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create a free parent account — find tutors 100% free",
  description:
    "Sign up on Mentr, the best free platform to find verified home and online tutors worldwide. Search by subject and area, connect, and chat directly on WhatsApp — completely free, no contact fees, no middlemen.",
  alternates: { canonical: "/parent/signup" },
};

export default function ParentSignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
