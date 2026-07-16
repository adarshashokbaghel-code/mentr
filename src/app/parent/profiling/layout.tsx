import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Complete your details",
  description:
    "Tell us who you are so tutors know who's reaching out. Takes under a minute.",
  robots: { index: false, follow: false },
};

export default function ParentProfilingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
