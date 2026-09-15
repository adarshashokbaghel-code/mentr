import type { ArticleContent } from "./types";
import { FOR_STUDENTS_ARTICLES } from "./for-students";
import { FOR_PARENTS_ARTICLES } from "./for-parents";
import { COMPARISON_ARTICLES } from "./comparison";
import { EXAM_PREP_ARTICLES } from "./exam-prep";
import { FOR_TUTORS_ARTICLES } from "./for-tutors";
import { TRUST_SAFETY_ARTICLES } from "./trust-safety";
import { CAREER_MENTORING_ARTICLES } from "./career-mentoring";
import { LOCAL_GUIDES_ARTICLES } from "./local-guides";
import { KIDS_LEARN_ARTICLES } from "./kids-learn";
import { KIDS_LEARN_WAVE2_ARTICLES } from "./kids-learn-wave2";
import { GUIDE_BATCH_SEP2026 } from "./guide-batch-sep2026";
import { ADSENSE_QUALITY_BATCH } from "./adsense-quality-batch";

const ALL_ARTICLES: Record<string, ArticleContent> = {
  ...FOR_PARENTS_ARTICLES,
  ...FOR_STUDENTS_ARTICLES,
  ...COMPARISON_ARTICLES,
  ...EXAM_PREP_ARTICLES,
  ...FOR_TUTORS_ARTICLES,
  ...TRUST_SAFETY_ARTICLES,
  ...CAREER_MENTORING_ARTICLES,
  ...LOCAL_GUIDES_ARTICLES,
  ...KIDS_LEARN_ARTICLES,
  ...KIDS_LEARN_WAVE2_ARTICLES,
  ...GUIDE_BATCH_SEP2026,
  // Last: replaces thin Jul-19 template posts for AdSense content quality
  ...ADSENSE_QUALITY_BATCH,
};

export function getArticleContent(slug: string): ArticleContent {
  const article = ALL_ARTICLES[slug];
  if (!article) {
    throw new Error(`Missing article content for slug: ${slug}`);
  }
  return article;
}

export function hasArticleContent(slug: string): boolean {
  return slug in ALL_ARTICLES;
}
