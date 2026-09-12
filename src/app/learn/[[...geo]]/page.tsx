import { LearnLanding } from "@/components/landing/lp/learn-page";
import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { PageMarketing } from "@/components/marketing/page-marketing";
import { JsonLd, breadcrumbJsonLd, faqJsonLd } from "@/components/seo/json-ld";
import {
  learnCopyFor,
  learnPathFor,
  parseLearnGeo,
  type LearnGeo,
} from "@/lib/learn-landing-copy";
import { LEARN_MODULE_COUNT, LEARN_TRACKS } from "@/lib/learn-curriculum";
import { absoluteUrl, hubOpenGraph, SITE_BRAND } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return [{ geo: [] }, { geo: ["india"] }, { geo: ["uae"] }];
}

function geoForParams(raw?: string | string[]): LearnGeo | null {
  return parseLearnGeo(raw);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ geo?: string | string[] }>;
}): Promise<Metadata> {
  const { geo: raw } = await params;
  const geo = geoForParams(raw);
  if (geo === null) return { title: "Not found", robots: { index: false } };
  const copy = learnCopyFor(geo);
  return {
    title: copy.title,
    description: copy.metaDescription,
    keywords: copy.keywords,
    alternates: { canonical: copy.path },
    openGraph: hubOpenGraph(copy.title, copy.metaDescription, copy.path),
  };
}

export default async function LearnPage({
  params,
}: {
  params: Promise<{ geo?: string | string[] }>;
}) {
  const { geo: raw } = await params;
  const geo = geoForParams(raw);
  if (geo === null) notFound();

  const copy = learnCopyFor(geo);
  const path = learnPathFor(geo);

  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Mentr Learn — Class 3–5 CS, AI & Math",
    description: copy.metaDescription,
    provider: {
      "@type": "Organization",
      name: SITE_BRAND,
      url: absoluteUrl("/"),
    },
    educationalLevel: "Class 3-5",
    numberOfCredits: LEARN_MODULE_COUNT,
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
      category: "Free",
    },
    hasCourseInstance: LEARN_TRACKS.map((t) => ({
      "@type": "CourseInstance",
      name: t.label,
      courseMode: "online",
      courseWorkload: "PT4H30M",
    })),
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: copy.title,
    description: copy.metaDescription,
    url: absoluteUrl(path),
    isPartOf: { "@type": "WebSite", name: SITE_BRAND, url: absoluteUrl("/") },
    about: courseJsonLd,
  };

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Mentr Learn", path },
          ]),
          webPageJsonLd,
          faqJsonLd(copy.faqs),
        ]}
      />
      <PageMarketing slug="learn" path={path} />
      <Navbar />
      <main>
        <LearnLanding geo={geo} />
      </main>
      <Footer />
    </>
  );
}
