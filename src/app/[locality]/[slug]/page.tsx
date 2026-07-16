import { SeoHubPage } from "@/components/seo/hub-page";
import { SITE_NAME } from "@/lib/seo";
import {
  areaHubSlug,
  comboIntro,
  comboSlug,
  localityFromSlug,
  parseComboSlug,
  publishedCombos,
  slugify,
  subjectHubSlug,
  teachersForCombo,
} from "@/lib/seo-hubs";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return publishedCombos().map(({ area, subject }) => ({
    locality: slugify(area),
    slug: comboSlug(subject),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locality: string; slug: string }>;
}): Promise<Metadata> {
  const { locality, slug } = await params;
  const area = localityFromSlug(locality);
  const subject = parseComboSlug(slug);
  if (!area || !subject) return { title: "Tuition", robots: { index: false } };
  const title = `${subject} Tuition in ${area}, Bengaluru`;
  const description = `Verified ${subject} tutors near ${area}, Bengaluru. See open slots and send a free connect request on ${SITE_NAME}.`;
  return {
    title,
    description,
    alternates: { canonical: `/${locality}/${slug}` },
  };
}

export default async function ComboHubPage({
  params,
}: {
  params: Promise<{ locality: string; slug: string }>;
}) {
  const { locality, slug } = await params;
  const area = localityFromSlug(locality);
  const subject = parseComboSlug(slug);
  if (!area || !subject) notFound();

  const teachers = teachersForCombo(area, subject);
  if (teachers.length === 0) notFound();

  const path = `/${locality}/${slug}`;

  return (
    <SeoHubPage
      eyebrow={`${area} · ${subject}`}
      title={`${subject} tuition in ${area}`}
      intro={comboIntro(area, subject)}
      teachers={teachers}
      schemaPath={path}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: area, href: `/areas/${areaHubSlug(area)}` },
        { label: `${subject} tuition` },
      ]}
      relatedLinks={[
        {
          label: `All ${subject} tutors`,
          href: `/subjects/${subjectHubSlug(subject)}`,
        },
        {
          label: `All tutors in ${area}`,
          href: `/areas/${areaHubSlug(area)}`,
        },
      ]}
      ctaHref={`/search?subject=${encodeURIComponent(subject)}&locality=${encodeURIComponent(area)}`}
      ctaLabel={`Search in ${area}`}
    />
  );
}
