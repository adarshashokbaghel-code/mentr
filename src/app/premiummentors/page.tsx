import { PremiumMentorsLanding } from "@/components/premium/premium-mentors-landing";
import { InstantConnectDock } from "@/components/instant-connect/instant-connect-dock";
import { PageMarketing } from "@/components/marketing/page-marketing";
import {
  JsonLd,
  breadcrumbJsonLd,
  collectionJsonLd,
  faqJsonLd,
} from "@/components/seo/json-ld";
import { loadPremiumMentorsForPage } from "@/lib/premium-mentors-server";
import { absoluteUrl, LAUNCH_HUB_CITY, SITE_BRAND } from "@/lib/seo";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Premium Tutors — 100% Verified Mentors for Parents · Mentr",
  description:
    "Browse 100% verified Premium tutors on Mentr. Identity-checked profiles, clear fees, and connect free — with or without login. No agency fee for parents.",
  keywords: [
    "premium tutors",
    "verified tutors",
    "100% verified tutor",
    "premium mentors",
    "hire verified tutor",
    "trusted home tutor",
    `verified tutors in ${LAUNCH_HUB_CITY}`,
    "connect tutor without login",
  ],
  alternates: { canonical: "/premiummentors" },
  openGraph: {
    title: "Premium Tutors — 100% Verified · Mentr",
    description:
      "Identity-verified Premium tutors for parents. Browse free, connect with or without login. No agency fee.",
    url: absoluteUrl("/premiummentors"),
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Premium Tutors — 100% Verified · Mentr",
    description:
      "Browse verified Premium tutors. Connect free — login optional for Premium mentors.",
  },
};

const PAGE_FAQS = [
  {
    question: "What makes a tutor Premium?",
    answer:
      "They've verified their identity with us, filled in a complete profile with fees and availability, and we've checked it by hand. Only then do they show up on this page.",
  },
  {
    question: "Do I pay anything to connect?",
    answer:
      "No. Searching and connecting is free. You pay the tutor directly for classes once you decide to go ahead.",
  },
  {
    question: "Do I need an account?",
    answer:
      "Not for Premium tutors. Tap Connect, tell them what your child needs, and they'll reach out. An account just lets you track replies in one place.",
  },
  {
    question: "How is this different from regular tutors?",
    answer:
      "Anyone can list on Mentr for free. Premium tutors have gone through extra checks and tend to respond faster, so they're a good place to start if you want a quick, serious match.",
  },
];

export default async function PremiumMentorsPage() {
  const mentors = await loadPremiumMentorsForPage();

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Premium Tutors — 100% Verified | Mentr",
    description:
      "Browse identity-verified Premium tutors. Free for parents to connect.",
    url: absoluteUrl("/premiummentors"),
    isPartOf: { "@type": "WebSite", name: SITE_BRAND, url: absoluteUrl("/") },
    about: {
      "@type": "Service",
      name: "Premium verified tutors on Mentr",
      areaServed: [
        { "@type": "City", name: LAUNCH_HUB_CITY },
        { "@type": "Place", name: "Worldwide" },
      ],
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    },
  };

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Premium tutors", path: "/premiummentors" },
          ]),
          webPageJsonLd,
          collectionJsonLd({
            name: "Premium verified tutors on Mentr",
            description:
              "Identity-checked Premium tutors for parents — browse free and connect.",
            path: "/premiummentors",
            teachers: mentors,
          }),
          faqJsonLd(PAGE_FAQS),
        ]}
      />
      <PageMarketing slug="premiummentors" path="/premiummentors" />
      <PremiumMentorsLanding initialMentors={mentors} />
      <InstantConnectDock />
    </>
  );
}
