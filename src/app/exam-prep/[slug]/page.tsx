import { SeoHubPage } from "@/components/seo/hub-page";
import {
  EXAM_PREP_PAGES,
  teachersForExamPrep,
} from "@/lib/seo-hubs";
import type { Metadata } from "next";
import { hubOpenGraph } from "@/lib/seo";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return EXAM_PREP_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = EXAM_PREP_PAGES.find((p) => p.slug === slug);
  if (!page) return { title: "Exam prep", robots: { index: false } };
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `/exam-prep/${slug}` },
    openGraph: hubOpenGraph(page.title, page.description, `/exam-prep/${slug}`),
  };
}

export default async function ExamPrepPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = EXAM_PREP_PAGES.find((p) => p.slug === slug);
  if (!page) notFound();

  const teachers = teachersForExamPrep(page.subjects, page.levels);
  const path = `/exam-prep/${slug}`;

  return (
    <SeoHubPage
      eyebrow="Exam prep"
      title={page.headline}
      intro={page.intro}
      teachers={teachers}
      schemaPath={path}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Exam prep" },
        { label: page.headline },
      ]}
      relatedLinks={EXAM_PREP_PAGES.filter((p) => p.slug !== slug).map(
        (p) => ({
          label: p.headline,
          href: `/exam-prep/${p.slug}`,
        }),
      )}
      ctaHref="/search?subject=Exam%20Prep"
      ctaLabel="Search exam-prep tutors"
    />
  );
}
