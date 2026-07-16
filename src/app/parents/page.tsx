import { ParentsLanding } from "@/components/landing/lp/parents-page";
import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";
import {
  absoluteUrl,
  GLOBAL_REACH_LINE,
  LAUNCH_HUB_CITY,
  SITE_BRAND,
} from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find a Tutor for Your Child — Free, Local or Online Worldwide",
  description:
    "Search verified tutors near you or online from any country. Post your requirement free, review pitches, connect on WhatsApp once accepted. ₹0 platform fee for parents.",
  keywords: [
    "find tutor online",
    "find tutor near me",
    "free tutor search",
    "home tutor",
    "online tutor worldwide",
    "private tuition",
    "maths tutor",
    "verified home tutors",
    "UrbanPro alternative parents",
    `tutors in ${LAUNCH_HUB_CITY}`,
  ],
  alternates: { canonical: "/parents" },
  openGraph: {
    title: "Find a Tutor — Free on Mentr by Paprly",
    description:
      "Search locally or online worldwide. Post requirements, get pitches, connect on WhatsApp. Completely free for parents.",
    url: absoluteUrl("/parents"),
    type: "website",
  },
};

const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Find a Tutor for Your Child — Mentr by Paprly",
  description: GLOBAL_REACH_LINE,
  url: absoluteUrl("/parents"),
  isPartOf: { "@type": "WebSite", name: SITE_BRAND, url: absoluteUrl("/") },
  about: {
    "@type": "Service",
    name: "Free tutor search for parents",
    areaServed: [
      { "@type": "City", name: LAUNCH_HUB_CITY },
      { "@type": "Place", name: "Worldwide" },
    ],
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  },
};

export default function ParentsPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "For parents", path: "/parents" },
          ]),
          webPageJsonLd,
        ]}
      />
      <Navbar />
      <ParentsLanding />
      <Footer />
    </>
  );
}
