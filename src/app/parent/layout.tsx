import { SITE_BRAND } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  // Re-declare the template — a plain string title here would stop the
  // root template from cascading to nested /parent/* pages
  title: { default: "Parent login", template: `%s | ${SITE_BRAND}` },
  description:
    "Sign in to your Mentr by Paprly parent account to search verified tutors near you or online worldwide and connect with them free on WhatsApp.",
  alternates: { canonical: "/parent" },
  robots: { index: false, follow: true },
};

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
