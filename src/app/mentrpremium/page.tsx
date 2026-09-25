import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { MentrPremiumGuide } from "@/components/mentr-premium/mentr-premium-guide";
import { JsonLd, breadcrumbJsonLd, faqJsonLd } from "@/components/seo/json-ld";
import { absoluteUrl, SITE_BRAND } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentr Premium for Mentors — Full Guide, Features & How It Works",
  description:
    "Complete guide to Mentr Premium: why mentors upgrade, Free vs Premium comparison, step-by-step checkout, parent directory unlocks, unlimited pitches, Snap & Grade, featured listing, and where to find every feature.",
  keywords: [
    "Mentr Premium",
    "Mentr Premium mentor guide",
    "premium tutor plan India",
    "parent directory Mentr",
    "unlimited pitches tutors",
    "reveal parent contact",
    "featured mentor listing",
    "Snap and Grade unlimited",
    "Free vs Premium Mentr",
  ],
  alternates: { canonical: "/mentrpremium" },
  openGraph: {
    title: "Mentr Premium — Mentor Guide & Feature Walkthrough",
    description:
      "Why Premium exists, how it compares to Free, step-by-step upgrade, and where to find every Premium feature on Mentr.",
    url: absoluteUrl("/mentrpremium"),
    type: "article",
  },
};

const PAGE_FAQS = [
  {
    question: "What is Mentr Premium?",
    answer:
      "Mentr Premium is an optional mentor plan at about $5/month (≈ ₹449). Free mentors keep core tools forever. Premium adds unlimited board pitches, the parent directory with 3 contact reveals per day, featured landing placement, Premium badges in search, unlimited Snap & Grade, and priority support (SPOC).",
  },
  {
    question: "Do parents pay for Premium?",
    answer:
      "No. Parents never pay to search tutors or send connection requests. Premium is mentor-side only.",
  },
  {
    question: "Where do I open the parent directory?",
    answer:
      "After Premium is active, go to /parentslist or tap Parents on the Premium tile in your mentor dashboard. Non-Premium mentors see an upgrade screen.",
  },
  {
    question: "How many parent contacts can I reveal?",
    answer:
      "Three new parent contacts per day (IST midnight reset). Each unlock stays visible for 2 hours, then locks again with no re-reveal. History is on your dashboard under Pitch parents → Reveal history.",
  },
  {
    question: "How do I upgrade?",
    answer:
      "Open /mentrpricing or the Premium card on your dashboard, pick 2/3/4 months, pay with Razorpay, and Premium activates after payment verify.",
  },
];

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Mentr Premium for Mentors — Full Guide",
  description:
    "Why mentors upgrade to Premium, Free vs Premium comparison, step-by-step flow, and feature walkthrough with where to find each tool.",
  author: { "@type": "Organization", name: SITE_BRAND },
  publisher: { "@type": "Organization", name: SITE_BRAND },
  mainEntityOfPage: absoluteUrl("/mentrpremium"),
  datePublished: "2026-09-23",
  dateModified: "2026-09-23",
};

export default function MentrPremiumPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Mentor pricing", path: "/mentrpricing" },
            { name: "Premium guide", path: "/mentrpremium" },
          ]),
          articleJsonLd,
          faqJsonLd(PAGE_FAQS),
        ]}
      />
      <Navbar />
      <MentrPremiumGuide />
      <Footer />
    </>
  );
}
