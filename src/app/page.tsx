import { ParentNeedFinder } from "@/components/parent/parent-need-finder";
import { CTA } from "@/components/landing/cta";
import { FAQ } from "@/components/landing/faq";
import { FacultyShowcase } from "@/components/landing/faculty-showcase";
import { FeaturedMentors } from "@/components/landing/featured-mentors";
import { Footer } from "@/components/landing/footer";
import { GlobalReachMap } from "@/components/landing/global-reach-map";
import { InstantConnectDock } from "@/components/instant-connect/instant-connect-dock";
import { Hero } from "@/components/landing/hero";
import { HomeMentorStatsBand } from "@/components/landing/home-mentor-stats-band";
import { HomePremiumPopup } from "@/components/landing/home-premium-popup";
import { HowItWorks } from "@/components/landing/how-it-works";
import { MentrFlow } from "@/components/landing/mentr-flow";
import { Navbar } from "@/components/landing/navbar";
import { PopularSearches } from "@/components/landing/popular-searches";
import { PremiumMentorsBrowse } from "@/components/landing/premium-mentors-browse";
import { ProductHuntSection } from "@/components/landing/product-hunt-section";
import { PublicPlatformSections } from "@/components/landing/public-platform-sections";
import { SeoGuidesStrip } from "@/components/landing/seo-guides-strip";
import { StatsMarquee } from "@/components/landing/stats-marquee";
import { SubjectGallery } from "@/components/landing/subject-gallery";
import { SwitchToChamps } from "@/components/landing/switch-to-champs";
import { Testimonials } from "@/components/landing/testimonials";
import { WaveSeparator } from "@/components/landing/wave-separator";
import { ZeroFees } from "@/components/landing/zero-fees";
import {
  PARENT_ORG_JSON_LD,
  SITE_BRAND,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
} from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find Verified Tutors & Mentors Free — Instant Connect · Mentr",
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${SITE_BRAND} — Free verified tutors & mentors`,
    description: SITE_DESCRIPTION,
    url: absoluteUrl("/"),
    type: "website",
  },
};

/** Structured data so Google understands who we are and what we answer */
const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_BRAND,
    alternateName: [SITE_NAME, "Paprly Mentr"],
    url: SITE_URL,
    logo: absoluteUrl("/mentr-logo.png"),
    description: SITE_DESCRIPTION,
    parentOrganization: PARENT_ORG_JSON_LD,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bengaluru",
      addressRegion: "Karnataka",
      addressCountry: "IN",
    },
    areaServed: [
      { "@type": "Place", name: "Worldwide" },
      { "@type": "City", name: "Bengaluru" },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "hello@mentr.in",
      contactType: "customer support",
      availableLanguage: ["English", "Hindi"],
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_BRAND,
    alternateName: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/find-online-tutors?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  },
  // Learn Course schema stays on /learn — not on the homepage (AdSense audience clarity)
];

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="w-full max-w-full overflow-x-clip">
        <Hero />
        <HomeMentorStatsBand />
        <StatsMarquee />
        <ParentNeedFinder />
        <GlobalReachMap />
        <PremiumMentorsBrowse />
        <FeaturedMentors />
        <MentrFlow />
        <HowItWorks />
        <SwitchToChamps />
        <WaveSeparator flip />
        <FacultyShowcase />
        <WaveSeparator className="bg-white" />
        <SubjectGallery />
        <ZeroFees />
        <Testimonials />
        <ProductHuntSection />
        <SeoGuidesStrip />
        <PublicPlatformSections />
        <PopularSearches />
        <FAQ />
        <CTA />
      </main>
      <InstantConnectDock />
      <Footer />
      <HomePremiumPopup />
    </>
  );
}
