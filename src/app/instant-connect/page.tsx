import { ParentAcquireLanding } from "@/components/landing/lp/parent-acquire-landing";
import { InstantConnectDock } from "@/components/instant-connect/instant-connect-dock";
import { PageMarketing } from "@/components/marketing/page-marketing";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";
import { absoluteUrl, SITE_BRAND } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Matched Instantly — Verified Tutors · Mentr",
  description:
    "Need a tutor today? Get matched instantly with verified mentors. Free for parents — no commission, no agency fee.",
  keywords: [
    "instant tutor",
    "get matched with tutor",
    "need tutor today",
    "instant connect tutor",
    "find tutor fast",
  ],
  alternates: { canonical: "/instant-connect" },
  openGraph: {
    title: "Get Matched Instantly — Free for Parents · Mentr",
    description:
      "Tell us what you need — get matched with verified tutors fast. Free for parents.",
    url: absoluteUrl("/instant-connect"),
    type: "website",
  },
};

const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Get Matched Instantly | Mentr",
  description:
    "Get matched instantly with verified tutors — free for parents.",
  url: absoluteUrl("/instant-connect"),
  isPartOf: { "@type": "WebSite", name: SITE_BRAND, url: absoluteUrl("/") },
};

export default function InstantConnectLandingPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Instant Connect", path: "/instant-connect" },
          ]),
          webPageJsonLd,
        ]}
      />
      <PageMarketing slug="instant-connect" path="/instant-connect" />
      <ParentAcquireLanding intent="instant" />
      <InstantConnectDock />
    </>
  );
}
