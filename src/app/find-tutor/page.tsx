import { ParentAcquireLanding } from "@/components/landing/lp/parent-acquire-landing";
import { InstantConnectDock } from "@/components/instant-connect/instant-connect-dock";
import { PageMarketing } from "@/components/marketing/page-marketing";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";
import { absoluteUrl, LAUNCH_HUB_CITY, SITE_BRAND } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find a Tutor — Browse Verified Profiles Free · Mentr",
  description:
    "Find a tutor free for parents. Tell us subject, class, location and mode — browse verified tutors with no commission or agency fee.",
  keywords: [
    "find a tutor",
    "find tutor near me",
    "maths tutor",
    "home tutor Bengaluru",
    "online tutor",
    `tutor in ${LAUNCH_HUB_CITY}`,
  ],
  alternates: { canonical: "/find-tutor" },
  openGraph: {
    title: "Find a Tutor — Free for Parents · Mentr",
    description:
      "Browse verified tutors free. No commission. No agency fee.",
    url: absoluteUrl("/find-tutor"),
    type: "website",
  },
};

const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Find a Tutor | Mentr",
  description:
    "Find a verified tutor free for parents — browse by subject, class, and location.",
  url: absoluteUrl("/find-tutor"),
  isPartOf: { "@type": "WebSite", name: SITE_BRAND, url: absoluteUrl("/") },
};

export default function FindTutorPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Find a tutor", path: "/find-tutor" },
          ]),
          webPageJsonLd,
        ]}
      />
      <PageMarketing slug="find-tutor" path="/find-tutor" />
      <ParentAcquireLanding intent="browse" />
      <InstantConnectDock />
    </>
  );
}
