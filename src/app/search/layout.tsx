import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find Tutors & Mentors in Bengaluru — Browse Free",
  description:
    "Browse verified Maths, Physics, English and Coding tutors across Bengaluru without signing in. Filter by subject and area — sign in free to connect on WhatsApp.",
  alternates: { canonical: "/search" },
  robots: { index: true, follow: true },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
