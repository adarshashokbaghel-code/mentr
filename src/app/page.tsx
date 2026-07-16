import { CTA } from "@/components/landing/cta";
import { FAQ } from "@/components/landing/faq";
import { FacultyShowcase } from "@/components/landing/faculty-showcase";
import { Footer } from "@/components/landing/footer";
import { GlobalReachMap } from "@/components/landing/global-reach-map";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { MentrFlow } from "@/components/landing/mentr-flow";
import { Navbar } from "@/components/landing/navbar";
import { StatsMarquee } from "@/components/landing/stats-marquee";
import { SubjectGallery } from "@/components/landing/subject-gallery";
import { SwitchToChamps } from "@/components/landing/switch-to-champs";
import { Testimonials } from "@/components/landing/testimonials";
import { TrustSafety } from "@/components/landing/trust-safety";
import { WaveSeparator } from "@/components/landing/wave-separator";
import { ZeroFees } from "@/components/landing/zero-fees";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
} from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find Verified Tutors — Free, Local or Online Worldwide",
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};

/** Structured data so Google understands who we are and what we answer */
const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/mentr-logo.png"),
    description: SITE_DESCRIPTION,
    areaServed: [
      { "@type": "Place", name: "Worldwide" },
      { "@type": "City", name: "Bengaluru" },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "hello@mentr.in",
      contactType: "customer support",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  },
  // FAQPage schema lives on /faq — duplicating it here would hurt eligibility
];

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>
        <Hero />
        <StatsMarquee />
        <TrustSafety />
        <GlobalReachMap />
        <MentrFlow />
        <HowItWorks />
        <SwitchToChamps />
        <WaveSeparator flip />
        <FacultyShowcase />
        <WaveSeparator className="bg-white" />
        <SubjectGallery />
        <ZeroFees />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
