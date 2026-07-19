import {
  SeoHubPage,
  subjectRelatedLinks,
} from "@/components/seo/hub-page";
import { hubOpenGraph } from "@/lib/seo";
import {
  ONLINE_SUBJECT_PAGES,
  onlineSubjectIntro,
  parseOnlineSubjectSlug,
  teachersOnline,
} from "@/lib/seo-hubs";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return ONLINE_SUBJECT_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = ONLINE_SUBJECT_PAGES.find((p) => p.slug === slug);
  if (!page) return { title: "Not found", robots: { index: false } };
  const path = `/online/${slug}`;
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: path },
    openGraph: hubOpenGraph(page.title, page.description, path),
  };
}

export default async function OnlineSubjectHubPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const subject = parseOnlineSubjectSlug(slug);
  if (!subject) notFound();

  const teachers = teachersOnline(subject);
  const path = `/online/${slug}`;

  return (
    <SeoHubPage
      eyebrow="Online worldwide"
      title={`${subject} tutors online`}
      intro={onlineSubjectIntro(subject)}
      teachers={teachers}
      schemaPath={path}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Find online tutors", href: "/find-online-tutors" },
        { label: subject },
      ]}
      relatedLinks={[
        { label: "Find verified online tutors", href: "/find-verified-online-tutors" },
        { label: "Find mentors near me", href: "/find-mentors-near-me" },
        ...subjectRelatedLinks(subject, teachers).slice(0, 4),
      ]}
      ctaHref="/find-online-tutors"
      ctaLabel="Find online tutors free"
      promoHref="/find-verified-online-tutors"
      promoLabel="Find verified online tutors"
    />
  );
}
