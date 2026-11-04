import { GlobalReachMap } from "@/components/landing/global-reach-map";
import { Footer } from "@/components/landing/footer";
import { HowItWorks } from "@/components/landing/how-it-works";
import { MentrFlow } from "@/components/landing/mentr-flow";
import { Navbar } from "@/components/landing/navbar";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How Mentr Works — Connect Parents and Tutors",
  description:
    "See how Mentr connects parents and verified tutors: search locally or online, book a demo, or post a requirement and get pitches. Free for both sides.",
  keywords: [
    "how Mentr works",
    "find a tutor free",
    "book a tutor demo",
    "post a tutor requirement",
    "verified tutors",
    "Mentr app",
  ],
  alternates: { canonical: "/how-it-works" },
};

export default function HowItWorksPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "How it works", path: "/how-it-works" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "How Mentr works",
            description:
              "Search verified tutors, book a demo, or post what your child needs. Free for parents and tutors.",
            url: absoluteUrl("/how-it-works"),
            keywords:
              "how Mentr works, find a tutor free, book a tutor demo, Mentr app",
            isPartOf: { "@type": "WebSite", name: SITE_NAME, url: absoluteUrl("/") },
            primaryImageOfPage: absoluteUrl("/logo.png"),
          },
        ]}
      />
      <Navbar />
      <main>
        <MentrFlow />
        <GlobalReachMap />
        <HowItWorks />
      </main>
      <Footer />
    </>
  );
}
