import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tutor Search Bengaluru — Filter by Subject & Area",
  description:
    "Browse verified Maths, Physics, English and Coding tutors across Bengaluru. Filter by subject, area and open slots. Free to search.",
  alternates: { canonical: "/search" },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
