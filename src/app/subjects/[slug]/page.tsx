import {
  SeoHubPage,
  subjectRelatedLinks,
} from "@/components/seo/hub-page";
import { SITE_NAME, absoluteUrl, hubOpenGraph } from "@/lib/seo";
import {
  parseSubjectHubSlug,
  subjectHubSlug,
  subjectIntro,
  teachersForSubject,
} from "@/lib/seo-hubs";
import { SUBJECTS } from "@/lib/teachers";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

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
  const description = `Find verified ${subject} tutors across Koramangala, Indiranagar, Whitefield & more in Bengaluru. Connect free on WhatsApp via ${SITE_NAME}.`;
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

  const teachers = teachersForSubject(subject);
  const path = `/subjects/${slug}`;

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
      relatedLinks={subjectRelatedLinks(subject, teachers)}
      ctaHref={`/search?subject=${encodeURIComponent(subject)}`}
      ctaLabel={`Search ${subject} tutors`}
      promoHref="/find-verified-online-tutors"
    />
  );
}
