import { SITE_NAME } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Faculty login", template: `%s | ${SITE_NAME}` },
  description:
    "Sign in to your Mentr faculty account to manage your tutor listing, update open slots, and respond to parent connection requests — free, with no commission.",
  alternates: { canonical: "/faculty" },
  robots: { index: false, follow: true },
};

export default function FacultyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
