import { LearnLanding } from "@/components/landing/lp/learn-page";
import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { PageMarketing } from "@/components/marketing/page-marketing";
import { JsonLd, breadcrumbJsonLd, faqJsonLd } from "@/components/seo/json-ld";
import {
  LEARN_GEO_SEGMENTS,
  learnCopyFor,
  learnHreflangMap,
  learnPathFor,
  parseLearnGeo,
  type LearnGeo,
} from "@/lib/learn-landing-copy";
import {
  LEARN_FACT_SHEET,
  learnCourseJsonLd,
  learnWebPageJsonLd,
} from "@/lib/learn-seo";
import { absoluteUrl, hubOpenGraph } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return [
    { geo: [] as string[] },
    ...LEARN_GEO_SEGMENTS.map((segment) => ({ geo: [segment] })),
  ];
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
  const languages: Record<string, string> = {};
  for (const [code, path] of Object.entries(learnHreflangMap())) {
    languages[code] = absoluteUrl(path);
  }
  return {
    title: copy.title,
    description: copy.metaDescription,
    keywords: [
      ...copy.keywords,
      LEARN_FACT_SHEET.courseName,
      "60 modules",
      "Build Arena",
    ],
    alternates: {
      canonical: copy.path,
      languages,
    },
    openGraph: hubOpenGraph(copy.title, copy.metaDescription, copy.path),
    twitter: {
      card: "summary_large_image",
      title: copy.title,
      description: copy.metaDescription,
    },
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

  const crumbs =
    geo === "global"
      ? [
          { name: "Home", path: "/" },
          { name: "Mentr Learn", path: "/learn" },
        ]
      : [
          { name: "Home", path: "/" },
          { name: "Mentr Learn", path: "/learn" },
          {
            name: copy.regionLabel,
            path,
          },
        ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd(crumbs),
          learnWebPageJsonLd({
            name: copy.title,
            description: copy.metaDescription,
            path,
          }),
          learnCourseJsonLd({
            description: copy.metaDescription,
            url: path,
          }),
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
