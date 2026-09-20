import {
  SeoHubPage,
  subjectRelatedLinks,
} from "@/components/seo/hub-page";
import { SITE_NAME, hubOpenGraph } from "@/lib/seo";
import {
  parseSubjectHubSlug,
  slugify,
  subjectHubSlug,
  subjectIntro,
} from "@/lib/seo-hubs";
import {
  INSTANT_CONNECT_CTA,
  REQUIREMENT_CTA,
} from "@/lib/seo-programmatic";
import { liveTeachersForSubject } from "@/lib/seo-live-teachers";
import { SUBJECTS } from "@/lib/teachers";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 300;

export function generateStaticParams() {
  return SUBJECTS.map((s) => ({ slug: subjectHubSlug(s) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const subject = parseSubjectHubSlug(slug);
  if (!subject) return { title: "Subject", robots: { index: false } };
  const title = `${subject} Tutors in Bengaluru — Verified Profiles`;
  const description = `Find verified ${subject} tutors across Koramangala, Indiranagar, Whitefield & more in Bengaluru. Compare rates, connect free, or try Instant Connect on ${SITE_NAME}.`;
  return {
    title,
    description,
    alternates: { canonical: `/subjects/${slug}` },
    openGraph: hubOpenGraph(title, description, `/subjects/${slug}`),
  };
}

export default async function SubjectHubPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const subject = parseSubjectHubSlug(slug);
  if (!subject) notFound();

  const teachers = await liveTeachersForSubject(subject);
  const path = `/subjects/${slug}`;
  const searchHref = `/search?subject=${encodeURIComponent(subject)}`;

  return (
    <SeoHubPage
      eyebrow="Subject"
      title={`${subject} tutors in Bengaluru`}
      intro={subjectIntro(subject)}
      teachers={teachers}
      schemaPath={path}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Subjects", href: "/search/bengaluru" },
        { label: subject },
      ]}
      relatedLinks={[
        ...subjectRelatedLinks(subject, teachers),
        {
          label: `${subject} tutors in Bengaluru`,
          href: `/tutors/bengaluru/${slugify(subject)}-tutors`,
        },
      ]}
      ctaHref={searchHref}
      ctaLabel={`Search ${subject} tutors`}
      mapHref={`${searchHref}&view=map`}
      promoHref="/find-verified-online-tutors"
      requirementHref={REQUIREMENT_CTA.href}
      requirementLabel={REQUIREMENT_CTA.label}
      requirementBlurb={REQUIREMENT_CTA.blurb}
      instantHref={INSTANT_CONNECT_CTA.href}
      instantLabel={INSTANT_CONNECT_CTA.label}
      instantBlurb={INSTANT_CONNECT_CTA.blurb}
    />
  );
}
