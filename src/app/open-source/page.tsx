import { OpenSourceLanding } from "@/components/landing/lp/open-source-page";
import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";
import {
  absoluteUrl,
  GITHUB_REPO_URL,
  GLOBAL_REACH_LINE,
  SITE_BRAND,
} from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentr is Open Source — MIT Licensed, Zero Cut, Contribute on GitHub",
  description:
    "Mentr by Paprly is 100% open source under the MIT license. Free tutor-parent connector with zero commission — 100+ satisfied parents worldwide. Fork, contribute, or deploy. View source on GitHub.",
  keywords: [
    "Mentr open source",
    "open source tutoring platform",
    "MIT licensed tutor platform",
    "free mentor platform github",
    "contribute to Mentr",
    "zero commission tutoring",
    "UrbanPro open source alternative",
    "Paprly Mentr github",
  ],
  alternates: { canonical: "/open-source" },
  openGraph: {
    title: "Mentr is Open Source — 100% Zero Cut, MIT Licensed",
    description:
      "The free tutor-parent connector is open source. Fork it, contribute on GitHub, or join as a parent or tutor — ₹0 platform fee forever.",
    url: absoluteUrl("/open-source"),
    type: "website",
  },
};

const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Mentr is Open Source",
  description: GLOBAL_REACH_LINE,
  url: absoluteUrl("/open-source"),
  isPartOf: { "@type": "WebSite", name: SITE_BRAND, url: absoluteUrl("/") },
  about: {
    "@type": "SoftwareSourceCode",
    name: "Mentr",
    codeRepository: GITHUB_REPO_URL,
    programmingLanguage: ["TypeScript", "JavaScript"],
    license: "https://spdx.org/licenses/MIT.html",
    description:
      "Open source platform connecting parents with verified tutors — zero commission, MIT licensed.",
  },
};

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: SITE_BRAND,
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "INR",
  },
  isAccessibleForFree: true,
  license: "https://spdx.org/licenses/MIT.html",
  downloadUrl: GITHUB_REPO_URL,
  description:
    "Free open source tutor-parent connector. Search locally or online, connect on WhatsApp, zero platform fees.",
};

export default function OpenSourcePage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Open source", path: "/open-source" },
          ]),
          webPageJsonLd,
          softwareJsonLd,
        ]}
      />
      <Navbar />
      <OpenSourceLanding />
      <Footer />
    </>
  );
}
