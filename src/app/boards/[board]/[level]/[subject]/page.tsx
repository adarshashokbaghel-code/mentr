import { SeoHubPage } from "@/components/seo/hub-page";
import { SITE_NAME, hubOpenGraph } from "@/lib/seo";
import { slugify } from "@/lib/seo-hubs";
import {
  BOARD_COMBO_PAGES,
  BOARDS,
  REQUIREMENT_CTA,
  boardComboPath,
  classSubjectFaqs,
  parseBoardCombo,
  teachersForBoardCombo,
} from "@/lib/seo-programmatic";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return BOARD_COMBO_PAGES.map((p) => ({
    board: p.board,
    level: `class-${p.level}`,
    subject: `${slugify(p.subject)}-tutors`,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ board: string; level: string; subject: string }>;
}): Promise<Metadata> {
  const resolved = await params;
  const parsed = parseBoardCombo(
    resolved.board,
    resolved.level,
    resolved.subject,
  );
  if (!parsed) return { title: "Not found", robots: { index: false } };
  const board = BOARDS.find((b) => b.id === parsed.board)!;
  const title = `${board.label} Class ${parsed.level} ${parsed.subject} Tutors`;
  const description = `Find ${board.label} Class ${parsed.level} ${parsed.subject} tutors on ${SITE_NAME}. Verified profiles, free connect — post your requirement if you need a better match.`;
  const path = boardComboPath(parsed.board, parsed.level, parsed.subject);
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: hubOpenGraph(title, description, path),
  };
}

export default async function BoardComboHubPage({
  params,
}: {
  params: Promise<{ board: string; level: string; subject: string }>;
}) {
  const resolved = await params;
  const parsed = parseBoardCombo(
    resolved.board,
    resolved.level,
    resolved.subject,
  );
  if (!parsed) notFound();

  const board = BOARDS.find((b) => b.id === parsed.board)!;
  const teachers = teachersForBoardCombo(
    parsed.board,
    parsed.level,
    parsed.subject,
  );
  const path = boardComboPath(parsed.board, parsed.level, parsed.subject);

  return (
    <SeoHubPage
      eyebrow={`${board.label} · Class ${parsed.level}`}
      title={`${board.label} Class ${parsed.level} ${parsed.subject} tutors`}
      intro={`High-intent search: ${board.label} Class ${parsed.level} ${parsed.subject} tutors who know the syllabus, set tests, and fit your schedule. Browse verified profiles or post your requirement — tutors pitch you for free on Mentr.`}
      teachers={teachers}
      schemaPath={path}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: board.label, href: `/boards/${parsed.board}-tutors` },
        { label: `Class ${parsed.level} ${parsed.subject}` },
      ]}
      ctaHref={`/search?subject=${encodeURIComponent(parsed.subject)}&q=${encodeURIComponent(`${board.label} Class ${parsed.level}`)}`}
      ctaLabel={`Search ${board.label} ${parsed.subject}`}
      faqs={classSubjectFaqs(parsed.subject, parsed.level)}
      requirementHref={REQUIREMENT_CTA.href}
      requirementLabel={REQUIREMENT_CTA.label}
      requirementBlurb={REQUIREMENT_CTA.blurb}
      relatedLinks={[
        {
          label: `${parsed.subject} Class ${parsed.level}`,
          href: `/class/${parsed.level}/${slugify(parsed.subject)}-tutors`,
        },
        { label: `${board.label} tutors`, href: `/boards/${parsed.board}-tutors` },
        { label: "Find tutors near you", href: "/find-tutors-near-me" },
      ]}
    />
  );
}
