import type { ArticleContent } from "./types";
import { FOR_STUDENTS_ARTICLES } from "./for-students";
import { FOR_PARENTS_ARTICLES } from "./for-parents";
import { COMPARISON_ARTICLES } from "./comparison";
import { EXAM_PREP_ARTICLES } from "./exam-prep";
import { FOR_TUTORS_ARTICLES } from "./for-tutors";
import { TRUST_SAFETY_ARTICLES } from "./trust-safety";
import { CAREER_MENTORING_ARTICLES } from "./career-mentoring";
import { LOCAL_GUIDES_ARTICLES } from "./local-guides";

const ALL_ARTICLES: Record<string, ArticleContent> = {
  ...FOR_PARENTS_ARTICLES,
  ...FOR_STUDENTS_ARTICLES,
  ...COMPARISON_ARTICLES,
  ...EXAM_PREP_ARTICLES,
  ...FOR_TUTORS_ARTICLES,
  ...TRUST_SAFETY_ARTICLES,
  ...CAREER_MENTORING_ARTICLES,
  ...LOCAL_GUIDES_ARTICLES,
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
