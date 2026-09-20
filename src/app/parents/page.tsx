import { ParentsLanding } from "@/components/landing/lp/parents-page";
import { InstantConnectDock } from "@/components/instant-connect/instant-connect-dock";
import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { PageMarketing } from "@/components/marketing/page-marketing";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";
import {
  absoluteUrl,
  GLOBAL_REACH_LINE,
  LAUNCH_HUB_CITY,
  SITE_BRAND,
} from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hire a Tutor Free — Create a Parent Account on Mentr",
  description:
    "Parents: create a free account to find verified tutors near you or online, post a requirement, and connect on WhatsApp after accept. ₹0 platform fee — no agent fees.",
  keywords: [
    "hire a tutor free",
    "create parent account tutor",
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
    title: "Hire a Tutor Free — Parent Account on Mentr by Paprly",
    description:
      "Register free as a parent. Search verified tutors, post requirements, connect on WhatsApp. Completely free — no agent fees.",
    url: absoluteUrl("/parents"),
    type: "website",
  },
};

const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Hire a Tutor Free — Create a Parent Account | Mentr by Paprly",
  description: GLOBAL_REACH_LINE,
  url: absoluteUrl("/parents"),
  isPartOf: { "@type": "WebSite", name: SITE_BRAND, url: absoluteUrl("/") },
  about: {
    "@type": "Service",
    name: "Free parent tutor hiring on Mentr",
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
      <PageMarketing slug="parents" path="/parents" />
      <Navbar />
      <ParentsLanding />
      <InstantConnectDock />
      <Footer />
    </>
  );
}
