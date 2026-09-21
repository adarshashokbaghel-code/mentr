import { SnapGradeApp } from "@/components/landing/lp/snap-grade-app";
import { hubOpenGraph, SITE_BRAND } from "@/lib/seo";
import type { Metadata } from "next";

const PATH = "/snapandgrade/grade";
const TITLE = `Grade now — Snap & Grade | ${SITE_BRAND}`;
const DESCRIPTION =
  "Photograph your CBSE Class 9–12 NCERT answer and get step marks. Maths, Science, Physics, Chemistry, Biology. 100 free credits on Snap & Grade.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: hubOpenGraph(TITLE, DESCRIPTION, PATH),
  robots: { index: true, follow: true },
};

export default function SnapGradeGradePage() {
  return <SnapGradeApp />;
}
