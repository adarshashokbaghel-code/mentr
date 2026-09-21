import { SnapGradeLanding } from "@/components/landing/lp/snap-grade-page";
import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { PageMarketing } from "@/components/marketing/page-marketing";
import { JsonLd, breadcrumbJsonLd, faqJsonLd } from "@/components/seo/json-ld";
import {
  SNAP_GRADE_FACT_SHEET,
  SNAP_GRADE_FAQS,
  SNAP_GRADE_KEYWORDS,
  snapGradeHowToJsonLd,
  snapGradeSoftwareJsonLd,
  snapGradeWebPageJsonLd,
} from "@/lib/snap-grade-seo";
import { absoluteUrl, hubOpenGraph, SITE_BRAND } from "@/lib/seo";
import type { Metadata } from "next";

const TITLE = `${SNAP_GRADE_FACT_SHEET.productName} — CBSE Class 9–12 marking practice | ${SITE_BRAND}`;
const DESCRIPTION = SNAP_GRADE_FACT_SHEET.oneLiner;

export const metadata: Metadata = {
  title: {
    absolute: TITLE,
  },
  description: DESCRIPTION,
  keywords: [...SNAP_GRADE_KEYWORDS],
  alternates: { canonical: SNAP_GRADE_FACT_SHEET.path },
  openGraph: {
    ...hubOpenGraph(TITLE, DESCRIPTION, SNAP_GRADE_FACT_SHEET.path),
    images: [
      {
        url: absoluteUrl("/snapandgrade/hero.png"),
        width: 1280,
        height: 720,
        alt: "Student photographing an NCERT Maths solution for Snap & Grade",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [absoluteUrl("/snapandgrade/hero.png")],
  },
  robots: { index: true, follow: true },
};

export default function SnapAndGradePage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: SNAP_GRADE_FACT_SHEET.productName, path: SNAP_GRADE_FACT_SHEET.path },
          ]),
          snapGradeWebPageJsonLd(),
          snapGradeSoftwareJsonLd(),
          snapGradeHowToJsonLd(),
          faqJsonLd([...SNAP_GRADE_FAQS]),
        ]}
      />
      <PageMarketing slug="snapandgrade" path={SNAP_GRADE_FACT_SHEET.path} />
      <Navbar />
      <main>
        <SnapGradeLanding />
      </main>
      <Footer />
    </>
  );
}
