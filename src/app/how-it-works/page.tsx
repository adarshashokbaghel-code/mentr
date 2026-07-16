import { GlobalReachMap } from "@/components/landing/global-reach-map";
import { Footer } from "@/components/landing/footer";
import { HowItWorks } from "@/components/landing/how-it-works";
import { MentrFlow } from "@/components/landing/mentr-flow";
import { Navbar } from "@/components/landing/navbar";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How Mentr Works — Connect Parents & Tutors Worldwide",
  description:
    "See how Mentr connects parents and verified tutors globally: search locally or online, post requirements, send a connect request, then move to WhatsApp once accepted. Free for both sides.",
  alternates: { canonical: "/how-it-works" },
};

export default function HowItWorksPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "How it works", path: "/how-it-works" },
        ])}
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
