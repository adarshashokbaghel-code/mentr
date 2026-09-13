import { Footer } from "@/components/landing/footer";
import { LearnSyllabusGuide } from "@/components/landing/lp/learn-syllabus-guide";
import { Navbar } from "@/components/landing/navbar";
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

const TITLE = "Class 3–5 parent syllabus — CS, AI & Math | Mentr Learn";
const DESCRIPTION =
  "Parent guide to Mentr Learn Class 3–5: 60 modules of CS, AI, and Math for coding — videos, quizzes, Play challenges, unit goals. Download the PDF. ₹0 forever.";

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
