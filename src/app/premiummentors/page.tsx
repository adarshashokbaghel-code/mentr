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
    question: "Are Premium tutors 100% verified?",
    answer:
      "Yes. Premium tutors complete identity verification and a full profile before they earn the Premium badge and appear on the Premium tutors page.",
  },
  {
    question: "Do parents pay for Premium?",
    answer:
      "No. Parents never pay Mentr to search or send connect requests. Premium is a mentor-side plan. You only pay the tutor for classes after you hire them.",
  },
  {
    question: "Can I connect without logging in?",
    answer:
      "Yes for Premium tutors. Tap Connect and choose “Send requirement without login,” or register as a parent to manage requests from your dashboard.",
  },
  {
    question: "What is the difference between Premium and regular tutors?",
    answer:
      "Premium tutors opt into a paid mentor plan, pass verification, and get priority placement. Regular tutors remain free to list; Premium profiles are highlighted for parents who want a faster, more serious match.",
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
