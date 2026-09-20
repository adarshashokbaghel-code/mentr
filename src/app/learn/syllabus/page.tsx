import { Footer } from "@/components/landing/footer";
import { LearnSyllabusGuide } from "@/components/landing/lp/learn-syllabus-guide";
import { Navbar } from "@/components/landing/navbar";
import { PageMarketing } from "@/components/marketing/page-marketing";
import { JsonLd, breadcrumbJsonLd, faqJsonLd } from "@/components/seo/json-ld";
import {
  LEARN_FACT_SHEET,
  LEARN_SYLLABUS_FAQS,
  LEARN_SYLLABUS_KEYWORDS,
  learnCourseJsonLd,
  learnWebPageJsonLd,
} from "@/lib/learn-seo";
import { hubOpenGraph } from "@/lib/seo";
import type { Metadata } from "next";

const TITLE = "Mentr Learn Syllabus — Class 3–5 CS, AI & Math | mentr.in";
const DESCRIPTION =
  "Mentr Learn parent syllabus (mentr.in/learn/syllabus): 60-module CS, AI & Math for Class 3–5 — narrated lessons, quizzes, Build Arena. Download the PDF. ₹0 forever.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: LEARN_SYLLABUS_KEYWORDS,
  alternates: { canonical: LEARN_FACT_SHEET.syllabusPath },
  openGraph: hubOpenGraph(TITLE, DESCRIPTION, LEARN_FACT_SHEET.syllabusPath),
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function LearnSyllabusPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Mentr Learn", path: "/learn" },
            { name: "Syllabus", path: "/learn/syllabus" },
          ]),
          learnWebPageJsonLd({
            name: TITLE,
            description: DESCRIPTION,
            path: LEARN_FACT_SHEET.syllabusPath,
          }),
          learnCourseJsonLd({
            description: DESCRIPTION,
            url: LEARN_FACT_SHEET.syllabusPath,
          }),
          faqJsonLd(LEARN_SYLLABUS_FAQS),
        ]}
      />
      <PageMarketing slug="learn-syllabus" path="/learn/syllabus" />
      <div className="print:hidden">
        <Navbar />
      </div>
      <main className="learn-landing min-h-screen bg-cream">
        <LearnSyllabusGuide />
      </main>
      <div className="print:hidden">
        <Footer />
      </div>
    </>
  );
}
