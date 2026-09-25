import { ParentAcquireLanding } from "@/components/landing/lp/parent-acquire-landing";
import { InstantConnectDock } from "@/components/instant-connect/instant-connect-dock";
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
  title: "Find a Verified Tutor — Free for Parents · Mentr",
  description:
    "Find a verified tutor free for parents. No commission. No agency fee. Browse tutors or get matched instantly — subject, class, location, and mode.",
  keywords: [
    "find a tutor",
    "verified tutor",
    "maths tutor in Bengaluru",
    "home tutor",
    "online tutor",
    "free tutor search",
    "hire tutor free",
    `tutors in ${LAUNCH_HUB_CITY}`,
  ],
  alternates: { canonical: "/parents" },
  openGraph: {
    title: "Find a Verified Tutor — Free for Parents · Mentr",
    description:
      "Free for parents. No commission. No agency fee. Find a tutor or get matched instantly.",
    url: absoluteUrl("/parents"),
    type: "website",
  },
};

const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Find a Verified Tutor — Free for Parents | Mentr",
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
      <ParentAcquireLanding intent="default" />
      <InstantConnectDock />
    </>
  );
}
