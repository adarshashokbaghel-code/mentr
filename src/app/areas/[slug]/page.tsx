import { SeoHubPage, areaRelatedLinks } from "@/components/seo/hub-page";
import { SITE_NAME } from "@/lib/seo";
import {
  areaHubSlug,
  areaIntro,
  parseAreaHubSlug,
  teachersForArea,
} from "@/lib/seo-hubs";
import { LOCALITIES } from "@/lib/teachers";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return LOCALITIES.map((a) => ({ slug: areaHubSlug(a) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const area = parseAreaHubSlug(slug);
  if (!area) return { title: "Area", robots: { index: false } };
  const title = `Tutors in ${area}, Bengaluru — Verified Profiles`;
  const description = `Browse verified tutors near ${area} for Maths, Physics, English, Coding and more. Connect directly on WhatsApp via ${SITE_NAME}.`;
  return {
    title,
    description,
    alternates: { canonical: `/areas/${slug}` },
  };
}

export default async function AreaHubPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const area = parseAreaHubSlug(slug);
  if (!area) notFound();

  const teachers = teachersForArea(area);
  const path = `/areas/${slug}`;

  return (
    <SeoHubPage
      eyebrow="Area"
      title={`Tutors in ${area}, Bengaluru`}
      intro={areaIntro(area)}
      teachers={teachers}
      schemaPath={path}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Bengaluru", href: "/search/bengaluru" },
        { label: area },
      ]}
      relatedLinks={areaRelatedLinks(area, teachers)}
      ctaHref={`/search?locality=${encodeURIComponent(area)}`}
      ctaLabel={`Search tutors in ${area}`}
    />
  );
}
