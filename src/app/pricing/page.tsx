import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { MentrPremiumGuide } from "@/components/mentr-premium/mentr-premium-guide";
import { JsonLd, breadcrumbJsonLd, faqJsonLd } from "@/components/seo/json-ld";
import { absoluteUrl, SITE_BRAND, SITE_URL } from "@/lib/seo";
import type { Metadata } from "next";

const CANONICAL_PATH = "/pricing";
const CANONICAL = absoluteUrl(CANONICAL_PATH);

export const metadata: Metadata = {
  title: "Mentr Pricing — Free Forever & Premium for Mentors",
  description:
    "Mentr pricing: ₹0 for parents and free mentors. Optional Premium is about $5/month (₹449) — unlimited pitches, 3 shared parent-contact reveals a day, the parent directory, featured listing, and Snap & Grade. Full guide to what is included and how to upgrade.",
  keywords: [
    "Mentr pricing",
    "Mentr Premium price",
    "Mentr free for parents",
    "premium tutor plan India",
    "Mentr Premium",
    "Free vs Premium Mentr",
    "unlimited pitches tutors",
    "parent directory Mentr",
    "reveal parent contact",
    "featured mentor listing",
  ],
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Mentr Pricing — Free Forever & Premium for Mentors",
    description:
      "Parents and free mentors pay nothing. Premium is about $5/month for unlimited pitches, shared parent reveals, and the full mentor playbook.",
    url: CANONICAL,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mentr Pricing — Free Forever & Premium for Mentors",
    description:
      "₹0 for parents and free mentors. Optional Premium at about $5/month, with the full feature guide.",
  },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    question: "Is Mentr free?",
    answer:
      "Yes for parents and for mentors on the Free plan. Search, listing, demos, and pitches stay free, with a fair-use cap of 3 pitches a day on Free. Premium is optional and mentor-side only.",
  },
  {
    question: "What is Mentr Premium?",
    answer:
      "Mentr Premium is an optional mentor plan at about $5/month (≈ ₹449). Premium adds unlimited board pitches, 3 parent-contact reveals per day shared by the parent directory and Reveal parent on the requirements board, featured landing placement, Premium badges in search, unlimited Snap & Grade, and priority support (SPOC).",
  },
  {
    question: "Do parents pay for Premium?",
    answer:
      "No. Parents never pay to search tutors or book a demo. Premium is mentor-side only.",
  },
  {
    question: "How many parent contacts can I reveal?",
    answer:
      "Three new parent contacts per day (IST midnight reset). Reveal parent on the requirements board and a reveal in the parent directory count toward the same 3. They are not separate limits. Each unlock stays visible for 2 hours, then locks again.",
  },
  {
    question: "How do I upgrade?",
    answer:
      "Open /mentrpricing or the Premium card on your dashboard, pick 2, 3, or 4 months, pay with Razorpay, and Premium activates after payment is verified. This guide lives at /pricing.",
  },
];

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Mentr pricing — Premium for mentors, the full playbook",
  description:
    "Mentr pricing: free for parents and free mentors. Optional Premium at about $5/month (₹449), with unlimited pitches and where each feature lives.",
  author: { "@type": "Organization", name: SITE_BRAND },
  publisher: { "@type": "Organization", name: SITE_BRAND, url: SITE_URL },
  mainEntityOfPage: CANONICAL,
  url: CANONICAL,
  datePublished: "2026-09-23",
  dateModified: "2026-10-08",
};

export default function PricingPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Pricing", path: CANONICAL_PATH },
          ]),
          articleJsonLd,
          faqJsonLd(FAQS),
        ]}
      />
      <Navbar />
      <MentrPremiumGuide />
      <Footer />
    </>
  );
}
