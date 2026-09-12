import { Footer } from "@/components/landing/footer";
import { LearnSyllabusGuide } from "@/components/landing/lp/learn-syllabus-guide";
import { Navbar } from "@/components/landing/navbar";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "What’s included for Class 3–5 — Parent syllabus | Mentr Learn",
  description:
    "A parent guide to Mentr Learn: what your Class 3–5 child gets in CS, AI, and Math — videos, 10 practice questions, and a check you can see after every lesson. Download the PDF.",
  alternates: { canonical: "/learn/syllabus" },
};

export default function LearnSyllabusPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Mentr Learn", path: "/learn" },
          { name: "What’s included", path: "/learn/syllabus" },
        ])}
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
