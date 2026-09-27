import { Footer } from "@/components/landing/footer";
import { StatsLanding } from "@/components/landing/lp/stats-page";
import { Navbar } from "@/components/landing/navbar";
import { PageMarketing } from "@/components/marketing/page-marketing";
import { JsonLd, breadcrumbJsonLd, faqJsonLd } from "@/components/seo/json-ld";
import { absoluteUrl, SITE_BRAND } from "@/lib/seo";
import {
  STATS_FAQS,
  STATS_PAGE_PATH,
  STATS_PRODUCTS,
} from "@/lib/stats-page-content";
import type { Metadata } from "next";

const TITLE = "Mentr in Numbers — Verified Tutors, Kids Coding & Free Tools";
const DESCRIPTION =
  "Find verified home & online tutors free, or list as a tutor and keep 100% of fees. Plus Mentr Learn (free coding for Class 3–5), Snap & Grade (CBSE step marking for Class 9–12) and free study tools.";
const OG_IMAGE = "/snapandgrade/hero.png";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "find a tutor",
    "verified tutors near me",
    "home tutor",
    "online tutor",
    "tutor without commission",
    "become a tutor free",
    "tutor jobs no lead fees",
    "free coding for kids",
    "coding classes for class 3 4 5",
    "CBSE step marking",
    "check my answer CBSE",
    "free CGPA calculator",
    "free study timetable maker",
    "free PDF tools for students",
    "Mentr",
    "Paprly",
  ],
  alternates: { canonical: STATS_PAGE_PATH },
  openGraph: {
    title: "Mentr in Numbers — Verified Tutors, Real Parents, ₹0 to Start",
    description: DESCRIPTION,
    url: absoluteUrl(STATS_PAGE_PATH),
    type: "website",
    siteName: SITE_BRAND,
    images: [{ url: absoluteUrl(OG_IMAGE), width: 1280, height: 720, alt: "Mentr by Paprly" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mentr in Numbers — Verified Tutors, Real Parents, ₹0 to Start",
    description: DESCRIPTION,
    images: [absoluteUrl(OG_IMAGE)],
  },
  robots: { index: true, follow: true },
};

const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Mentr in Numbers",
  description: DESCRIPTION,
  url: absoluteUrl(STATS_PAGE_PATH),
  isPartOf: { "@type": "WebSite", name: SITE_BRAND, url: absoluteUrl("/") },
  primaryImageOfPage: absoluteUrl(OG_IMAGE),
};

const productsJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Mentr products",
  itemListElement: STATS_PRODUCTS.map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Service",
      name: p.name,
      description: p.description,
      url: absoluteUrl(p.path),
      provider: { "@type": "Organization", name: SITE_BRAND, url: absoluteUrl("/") },
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    },
  })),
};

export default function StatsPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Mentr in numbers", path: STATS_PAGE_PATH },
          ]),
          webPageJsonLd,
          productsJsonLd,
          faqJsonLd([...STATS_FAQS]),
        ]}
      />
      <PageMarketing slug="stats" path={STATS_PAGE_PATH} />
      <Navbar />
      <StatsLanding />
      <Footer />
    </>
  );
}
