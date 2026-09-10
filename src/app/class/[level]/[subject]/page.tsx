import { SeoHubPage } from "@/components/seo/hub-page";
import { SITE_NAME, hubOpenGraph } from "@/lib/seo";
import { slugify, subjectHubSlug } from "@/lib/seo-hubs";
import {
  REQUIREMENT_CTA,
  SUBJECT_CLASS_PAGES,
  classSubjectFaqs,
  classSubjectPath,
  parseClassSubjectSlug,
  teachersForClassSubject,
} from "@/lib/seo-programmatic";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return SUBJECT_CLASS_PAGES.map((p) => ({
    level: p.level,
    subject: `${slugify(p.subject)}-tutors`,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ level: string; subject: string }>;
}): Promise<Metadata> {
  const { level, subject: subjectSlug } = await params;
  const parsed = parseClassSubjectSlug(level, subjectSlug);
  if (!parsed) return { title: "Not found", robots: { index: false } };
  const { subject, level: cls } = parsed;
  const title = `${subject} Tutor for Class ${cls} — Verified Profiles`;
  const description = `Find a ${subject} tutor for Class ${cls} on ${SITE_NAME}. Browse verified profiles, compare fees, connect free — or post your requirement and let tutors come to you.`;
  const path = classSubjectPath(cls, subject);
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: hubOpenGraph(title, description, path),
  };
}

export default async function ClassSubjectHubPage({
  params,
}: {
  params: Promise<{ level: string; subject: string }>;
}) {
  const { level, subject: subjectSlug } = await params;
  const parsed = parseClassSubjectSlug(level, subjectSlug);
  if (!parsed) notFound();

  const { subject, level: cls } = parsed;
  const teachers = teachersForClassSubject(subject, cls);
  const path = classSubjectPath(cls, subject);

  return (
    <SeoHubPage
      eyebrow={`Class ${cls} · ${subject}`}
      title={`${subject} tutor for Class ${cls}`}
      intro={`Parents searching "${subject} tutor for Class ${cls}" want someone who knows the syllabus, sets weekly tests, and fits your schedule. Browse verified ${subject} tutors below — home and online — or post your requirement and let tutors pitch you for free.`}
      teachers={teachers}
      schemaPath={path}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Find tutors", href: "/search" },
        { label: `Class ${cls}`, href: `/class/${cls}/mathematics-tutors` },
        { label: subject },
      ]}
      ctaHref={`/search?subject=${encodeURIComponent(subject)}&q=Class+${cls}`}
      ctaLabel={`Search Class ${cls} ${subject}`}
      promoHref="/find-tutors-near-me"
      promoLabel="Find tutors near you"
      faqs={classSubjectFaqs(subject, cls)}
      requirementHref={REQUIREMENT_CTA.href}
      requirementLabel={REQUIREMENT_CTA.label}
      requirementBlurb={REQUIREMENT_CTA.blurb}
      emptyMessage={`No ${subject} tutors listed for Class ${cls} yet — post your requirement or browse all ${subject} tutors.`}
      relatedLinks={[
        { label: "CBSE tutors", href: "/boards/cbse-tutors" },
        { label: "Tutors in Bengaluru", href: "/tutors/bengaluru" },
        {
          label: `${subject} tutors (all classes)`,
          href: `/subjects/${subjectHubSlug(subject)}`,
        },
      ]}
    />
  );
}
