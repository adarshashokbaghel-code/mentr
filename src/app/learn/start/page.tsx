import { LearnCoursePage } from "@/components/landing/lp/learn-course-page";
import { JsonLd, breadcrumbJsonLd, faqJsonLd } from "@/components/seo/json-ld";
import {
  LEARN_FACT_SHEET,
  LEARN_START_FAQS,
  LEARN_START_KEYWORDS,
  learnCourseJsonLd,
  learnWebPageJsonLd,
} from "@/lib/learn-seo";
import { hubOpenGraph } from "@/lib/seo";
import type { Metadata } from "next";
import { Suspense } from "react";

const TITLE = "Enroll free — Mentr Learn Class 3–5 (CS, AI & Math)";
const DESCRIPTION =
  "Enroll in Mentr Starter free. Class 3–5 CS, AI & Math — 60 modules, Watch → Quiz → Play → Boss. ₹999 → ₹0 forever. Parent email only — no credit card.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: LEARN_START_KEYWORDS,
  alternates: { canonical: LEARN_FACT_SHEET.enrollPath },
  openGraph: hubOpenGraph(TITLE, DESCRIPTION, LEARN_FACT_SHEET.enrollPath),
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function LearnStartPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Mentr Learn", path: "/learn" },
            { name: "Enroll free", path: "/learn/start" },
          ]),
          learnWebPageJsonLd({
            name: TITLE,
            description: DESCRIPTION,
            path: LEARN_FACT_SHEET.enrollPath,
          }),
          learnCourseJsonLd({
            description: DESCRIPTION,
            url: LEARN_FACT_SHEET.enrollPath,
          }),
          faqJsonLd(LEARN_START_FAQS),
        ]}
      />
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-[#faf8f4] text-sm font-semibold text-[#5a6472]">
            Loading course…
          </div>
        }
      >
        <LearnCoursePage />
      </Suspense>
    </>
  );
}
