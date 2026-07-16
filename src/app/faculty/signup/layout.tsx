import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register free as a tutor — 100% free, no lead fees",
  description:
    "Mentr is the best free platform for tutors and mentors to get found worldwide. Create a profile in minutes, get discovered by parents locally or online, and keep 100% of your fees — no coins, no lead charges, no commission, ever.",
  alternates: { canonical: "/faculty/signup" },
};

export default function FacultySignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
