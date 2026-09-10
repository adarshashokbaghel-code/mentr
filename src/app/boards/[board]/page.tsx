import { SeoHubPage } from "@/components/seo/hub-page";
import { SITE_NAME, hubOpenGraph } from "@/lib/seo";
import {
  BOARDS,
  BOARD_COMBO_PAGES,
  REQUIREMENT_CTA,
  boardComboPath,
  boardFaqs,
  boardPath,
  parseBoardSlug,
  teachersForBoard,
} from "@/lib/seo-programmatic";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return BOARDS.map((b) => ({ board: `${b.id}-tutors` }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ board: string }>;
}): Promise<Metadata> {
  const { board: boardSlug } = await params;
  const boardId = parseBoardSlug(boardSlug);
  if (!boardId) return { title: "Not found", robots: { index: false } };
  const board = BOARDS.find((b) => b.id === boardId)!;
  const title = `${board.label} Tutors — Verified Home & Online`;
  const description = `Find ${board.label} tutors on ${SITE_NAME} — verified profiles for Class 6–12, home and online. Connect free or post your requirement.`;
  const path = boardPath(boardId);
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: hubOpenGraph(title, description, path),
  };
}

export default async function BoardHubPage({
  params,
}: {
  params: Promise<{ board: string }>;
}) {
  const { board: boardSlug } = await params;
  const boardId = parseBoardSlug(boardSlug);
  if (!boardId) notFound();

  const board = BOARDS.find((b) => b.id === boardId)!;
  const teachers = teachersForBoard(boardId);
  const path = boardPath(boardId);
  const combos = BOARD_COMBO_PAGES.filter((c) => c.board === boardId);

  return (
    <SeoHubPage
      eyebrow={board.label}
      title={`${board.label} tutors`}
      intro={`Looking for ${board.label} tutors? Mentr lists verified home and online tutors who teach ${board.label} syllabi across Class 6–12. Browse profiles below, send a free connect request, or post your requirement and let tutors pitch you.`}
      teachers={teachers}
      schemaPath={path}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Boards", href: "/search" },
        { label: board.label },
      ]}
      ctaHref={`/search?q=${encodeURIComponent(board.label)}`}
      ctaLabel={`Search ${board.label} tutors`}
      promoHref="/find-tutors-near-me"
      faqs={boardFaqs(board.label)}
      requirementHref={REQUIREMENT_CTA.href}
      requirementLabel={REQUIREMENT_CTA.label}
      requirementBlurb={REQUIREMENT_CTA.blurb}
      relatedLinks={[
        ...combos.slice(0, 5).map((c) => ({
          label: `${board.label} Class ${c.level} ${c.subject}`,
          href: boardComboPath(c.board, c.level, c.subject),
        })),
        { label: "Tutors in Bengaluru", href: "/tutors/bengaluru" },
        { label: "Find tutors near you", href: "/find-tutors-near-me" },
      ]}
    />
  );
}
