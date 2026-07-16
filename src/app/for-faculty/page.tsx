import { FacultyLanding } from "@/components/landing/lp/faculty-page";
import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";
import {
  absoluteUrl,
  GLOBAL_REACH_LINE,
  LAUNCH_HUB_CITY,
  SITE_BRAND,
} from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Become a Tutor or Mentor — List Free, Keep 100% | Worldwide",
  description:
    "Register free as a tutor or mentor — local or online, any country. List availability, receive connect requests, pitch on the requirements board, and keep 100% of your fees. No coins, no commission.",
  keywords: [
    "become a tutor online",
    "become a mentor",
    "list as tutor free",
    "free tutor listing",
    "UrbanPro alternative tutors",
    "tuition teacher registration",
    "online tutor jobs",
    "no commission tutoring platform",
    `home tutor ${LAUNCH_HUB_CITY}`,
  ],
  alternates: { canonical: "/for-faculty" },
  openGraph: {
    title: "Become a Tutor or Mentor — Free on Mentr by Paprly",
    description:
      "List free worldwide. Get verified, receive parent requests, pitch on the board. Keep 100% of tuition fees.",
    url: absoluteUrl("/for-faculty"),
    type: "website",
  },
};

const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Become a Tutor or Mentor on Mentr by Paprly",
  description: GLOBAL_REACH_LINE,
  url: absoluteUrl("/for-faculty"),
  isPartOf: { "@type": "WebSite", name: SITE_BRAND, url: absoluteUrl("/") },
  about: {
    "@type": "Service",
    name: "Free tutor listing for faculty",
    areaServed: [
      { "@type": "City", name: LAUNCH_HUB_CITY },
      { "@type": "Place", name: "Worldwide" },
    ],
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  },
};

export default function ForFacultyPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "For faculty", path: "/for-faculty" },
          ]),
          webPageJsonLd,
        ]}
      />
      <Navbar />
      <FacultyLanding />
      <Footer />
    </>
  );
}
