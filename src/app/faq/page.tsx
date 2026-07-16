import { FaqLanding } from "@/components/landing/lp/faq-page";
import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { FAQS } from "@/lib/faqs";
import { absoluteUrl, SITE_BRAND } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentr by Paprly FAQ — Verification, Fees & How Connect Requests Work",
  description:
    "Answers on tutor verification, WhatsApp contact, fees, connect requests, and how Mentr by Paprly stays 100% free for parents and faculty worldwide.",
  keywords: [
    "Mentr by Paprly FAQ",
    "Paprly Mentr",
    "is Mentr free",
    "how to find tutor online",
    "tutor verification",
    "UrbanPro alternative",
    "connect request WhatsApp",
    "home tutor fees",
  ],
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "Mentr by Paprly FAQ — 100% free tutor & mentor finder",
    description:
      "How Mentr by Paprly stays completely free for parents, tutors, and mentors — verification, WhatsApp contact, and zero fees explained.",
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
