import { FaqLanding } from "@/components/landing/lp/faq-page";
import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { FAQS } from "@/lib/faqs";
import { absoluteUrl, SITE_BRAND } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentr by Paprly FAQ — Fees, Learn & How Connect Requests Work",
  description:
    "FAQ for Mentr by Paprly: tutor verification, WhatsApp connect, zero fees, and Mentr Learn (mentr.in/learn) — free Class 3–5 coding for kids.",
  keywords: [
    "Mentr by Paprly FAQ",
    "Paprly Mentr",
    "What is Mentr Learn",
    "Learn by Mentr",
    "mentr.in/learn",
    "is Mentr Learn free",
    "is Mentr free",
    "is Mentr open source",
    "contribute to Mentr",
    "how to find tutor online",
    "tutor verification",
    "UrbanPro alternative",
    "connect request WhatsApp",
    "home tutor fees",
  ],
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "Mentr by Paprly FAQ — free tutors + Mentr Learn",
    description:
      "How Mentr stays free for parents and faculty — plus what Mentr Learn is at mentr.in/learn (Class 3–5 coding, ₹0).",
    url: absoluteUrl("/faq"),
    type: "website",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Mentr by Paprly FAQ",
  description:
    "Frequently asked questions about finding tutors, faculty registration, fees, and verification on Mentr by Paprly.",
  url: absoluteUrl("/faq"),
  isPartOf: { "@type": "WebSite", name: SITE_BRAND, url: absoluteUrl("/") },
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([faqJsonLd, webPageJsonLd]) }}
      />
      <Navbar />
      <FaqLanding />
      <Footer />
    </>
  );
}
