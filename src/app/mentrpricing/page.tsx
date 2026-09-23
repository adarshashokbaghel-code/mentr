import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { MentrPricingPage } from "@/components/mentr-pricing/mentr-pricing-page";
import { JsonLd, breadcrumbJsonLd, faqJsonLd } from "@/components/seo/json-ld";
import { absoluteUrl, SITE_BRAND } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentor Pricing — Free Forever or Premium $5/mo",
  description:
    "Mentr mentor plans: Free forever with 3 pitches a day, or Premium at $5/month for unlimited pitches, 5 daily parent contact unlocks, SPOC support, and featured landing placement. No GST added on top. Razorpay checkout.",
  keywords: [
    "Mentr premium mentor",
    "mentor pricing",
    "tutor premium plan",
    "unlimited pitches Mentr",
    "parent contact unlock",
    "featured mentor listing",
    "Mentr Free vs Premium",
  ],
  alternates: { canonical: "/mentrpricing" },
  openGraph: {
    title: "Mentr Mentor Pricing — Free or Premium $5/mo",
    description:
      "Compare Free forever vs Premium: unlimited pitches, parent contact unlocks, SPOC, and featured placement. Price as shown — no GST added on top.",
    url: absoluteUrl("/mentrpricing"),
    type: "website",
  },
};

const PAGE_FAQS = [
  {
    question: "What is Mentr Premium for mentors?",
    answer:
      "Premium is an optional upgrade for mentors who want more reach: unlimited daily pitches, special access to parent listings with contact and requirement details, five parent contact unlocks every day, a dedicated support contact (SPOC), and featured placement on the Mentr landing page.",
  },
  {
    question: "Do parents need Premium to contact mentors?",
    answer:
      "No. Parents can search, shortlist, and send connection requests without paying. Mentors on Free still receive and can accept those requests.",
  },
  {
    question: "Do you charge GST on Premium?",
    answer:
      "We do not collect GST on top of the displayed Premium price. Payments run through Razorpay on an individual merchant account, so we currently do not issue GST tax invoices. You receive a Razorpay payment confirmation.",
  },
  {
    question: "How much is Mentr Premium?",
    answer:
      "Premium costs $5 per month (about ₹449). The price you see is the price you pay.",
  },
];

const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Mentr Premium Mentor",
  description:
    "Optional mentor subscription: unlimited pitches, parent contact unlocks, SPOC support, and featured landing placement.",
  brand: { "@type": "Brand", name: SITE_BRAND },
  offers: [
    {
      "@type": "Offer",
      name: "Free",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: absoluteUrl("/mentrpricing"),
    },
    {
      "@type": "Offer",
      name: "Premium",
      price: "5",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: absoluteUrl("/mentrpricing#plans"),
    },
  ],
};

export default function MentrPricingRoutePage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Mentor pricing", path: "/mentrpricing" },
          ]),
          faqJsonLd(PAGE_FAQS),
          productJsonLd,
        ]}
      />
      <Navbar />
      <MentrPricingPage />
      <Footer />
    </>
  );
}
