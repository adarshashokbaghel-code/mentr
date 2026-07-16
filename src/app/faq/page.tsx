import { FaqLanding } from "@/components/landing/lp/faq-page";
import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { FAQS } from "@/lib/faqs";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentr FAQ — Verification, Fees & How Connect Requests Work",
  description:
    "Answers on tutor verification, WhatsApp contact, fees, connect requests, and how Mentr stays 100% free for parents and faculty worldwide.",
  keywords: [
    "Mentr FAQ",
    "is Mentr free",
    "how to find tutor online",
    "tutor verification",
    "UrbanPro alternative",
    "connect request WhatsApp",
    "home tutor fees",
  ],
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "Mentr FAQ — 100% free tutor & mentor finder",
    description:
      "How Mentr stays completely free for parents, tutors, and mentors — verification, WhatsApp contact, and zero fees explained.",
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
  name: "Mentr FAQ",
  description:
    "Frequently asked questions about finding tutors, faculty registration, fees, and verification on Mentr.",
  url: absoluteUrl("/faq"),
  isPartOf: { "@type": "WebSite", name: SITE_NAME, url: absoluteUrl("/") },
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
