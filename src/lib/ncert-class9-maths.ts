/**
 * CBSE / NCERT Class 9 Mathematics — school syllabus (Number Systems book).
 * Re-exports the shared Class 9–12 catalog for backwards compatibility.
 */
export {
  NCERT_CLASS9_MATHS_CHAPTERS,
  type NcertMathsChapter as NcertClass9MathsChapter,
  NCERT_MATHS_TEXTBOOKS,
} from "@/lib/ncert-maths-chapters";

import { NCERT_MATHS_TEXTBOOKS } from "@/lib/ncert-maths-chapters";

export const NCERT_CLASS9_MATHS_TEXTBOOK = NCERT_MATHS_TEXTBOOKS[9];

export function ncertClass9MathsChapterByNumber(n: number) {
  return NCERT_MATHS_TEXTBOOKS[9].chapters.find((c) => c.number === n);
}
