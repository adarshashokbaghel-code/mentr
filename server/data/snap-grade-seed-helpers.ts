import type { RubricStep } from "../models/SnapGrade";

export type WeightSource = "practice_cbse" | "admin_curated" | "official_sqp";

export type SeedQuestion = {
  board: string;
  classLevel: number;
  subject: string;
  chapterNumber: number;
  chapterName: string;
  exercise: string;
  questionNumber: string;
  questionText: string;
  referenceNotes?: string;
  maxMarks: number;
  rubric: RubricStep[];
  markingSchemeNotes: string;
  weightSource: WeightSource;
  creditsCost: number;
  sortOrder: number;
};

/**
 * NCERT textbooks do not publish per-question board marks.
 * We use CBSE-style *practice* step weights so students still get
 * method → working → answer feedback. Admin can lock curated keys.
 */
export const CBSE_MATHS_MARKING_NOTES =
  "Practice marks (CBSE-style) — NCERT exercises have no official per-question marking key. Award marks for method/working shown, not only the final answer. Partial marks ONLY for a correct method with a minor arithmetic slip. Deduct only the wrong step; earlier correct steps still score. T/F + reason / counterexample steps are all-or-nothing (full marks or 0) — never half marks for True/False alone.";

export const CBSE_SCIENCE_MARKING_NOTES =
  "Practice marks (CBSE-style Science) — NCERT exercises have no official per-question marking key. Award marks for correct concept, formula/equation, labelled diagram, and reasoning — not only the final line. Partial marks ONLY when the method/concept is right with a minor slip. MCQ / one-word answers are all-or-nothing. Deduct only the wrong part; earlier correct parts still score.";

export const CBSE_PHYSICS_MARKING_NOTES =
  "Practice marks (CBSE-style Physics) — NCERT exercises have no official per-question marking key. Award marks for correct formula/law, substitution with units, diagram/vector sketch where needed, and final numerical/conclusion. Partial marks ONLY when the method is right with a minor arithmetic slip. Derive/prove and short conceptual answers are all-or-nothing for each required step. Deduct only the wrong part; earlier correct parts still score.";

export const CBSE_CHEMISTRY_MARKING_NOTES =
  "Practice marks (CBSE-style Chemistry) — NCERT exercises have no official per-question marking key. Award marks for correct equation/formula, balancing, reasoning, and final numerical/conclusion. Partial marks ONLY when the method is right with a minor arithmetic/slip. Short conceptual and reason-based answers are all-or-nothing per required point. Deduct only the wrong part; earlier correct parts still score.";

export const CBSE_BIOLOGY_MARKING_NOTES =
  "Practice marks (CBSE-style Biology) — NCERT exercises have no official per-question marking key. Award marks for correct concept, labelled diagram, definitions, and reasoning — not only the final line. Partial marks ONLY when the concept is right with a minor slip. One-word / definition / name-the answers are all-or-nothing. Deduct only the wrong part; earlier correct parts still score.";

/** @deprecated Use CBSE_MATHS_MARKING_NOTES */
export const CBSE_CLASS9_MATHS_NOTES = CBSE_MATHS_MARKING_NOTES;

/** One mark per part: True/False AND a valid reason or counterexample. */
export function trueFalseReasonRubric(
  parts: { id: string; label: string; criteria: string; marks?: number }[],
): RubricStep[] {
  return parts.map((p) => ({
    id: p.id,
    label: p.label,
    marks: p.marks ?? 1,
    criteria: `${p.criteria} All-or-nothing: T/F alone without the required reason/counterexample = 0 (not 0.5).`,
  }));
}

export function defaultRubric(maxMarks: number): RubricStep[] {
  if (maxMarks <= 1) {
    return [
      {
        id: "s1",
        label: "Correct response",
        marks: maxMarks,
        criteria: "Clear, correct answer matching the NCERT expectation.",
      },
    ];
  }
  if (maxMarks <= 2) {
    return [
      {
        id: "s1",
        label: "Method / reasoning",
        marks: 1,
        criteria: "Shows valid method, formula, or justification.",
      },
      {
        id: "s2",
        label: "Final answer",
        marks: maxMarks - 1,
        criteria: "Correct final result or conclusion.",
      },
    ];
  }
  if (maxMarks <= 3) {
    return [
      {
        id: "s1",
        label: "Setup / formula",
        marks: 1,
        criteria: "Correct formula, construction setup, or given data used.",
      },
      {
        id: "s2",
        label: "Working",
        marks: 1,
        criteria: "Main steps / calculation / reasoning shown.",
      },
      {
        id: "s3",
        label: "Conclusion",
        marks: maxMarks - 2,
        criteria: "Correct final answer with units or statement as needed.",
      },
    ];
  }
  const mid = Math.round((maxMarks - 2) * 2) / 2;
  return [
    {
      id: "s1",
      label: "Setup / formula",
      marks: 1,
      criteria: "Correct approach and required identities/theorems stated.",
    },
    {
      id: "s2",
      label: "Main working",
      marks: mid,
      criteria: "Complete stepwise working toward the result.",
    },
    {
      id: "s3",
      label: "Final answer",
      marks: Math.max(0.5, maxMarks - 1 - mid),
      criteria: "Correct boxed/final answer.",
    },
  ];
}

const ROMAN_PART_RE = /\(([ivx]+)\)/gi;

export function countRomanParts(text: string): number {
  const seen = new Set<string>();
  for (const m of text.matchAll(ROMAN_PART_RE)) {
    seen.add(m[1].toLowerCase());
  }
  return seen.size;
}

export function looksLikeTrueFalseReason(text: string): boolean {
  return /true\s*(or|\/)\s*false|state whether|which of the following (is|are) true|give (a )?reason|justify|counter[- ]?example/i.test(
    text,
  );
}

export function looksLikeProveOrConstruct(text: string): boolean {
  return /prove that|show that|construct|draw (the )?(figure|graph|diagram)/i.test(
    text,
  );
}

/**
 * Infer practice max marks when NCERT has no official key.
 * Roughly mirrors CBSE typology: VSA≈1–2, SA≈2–3, LA≈4–5.
 */
export function inferPracticeMarks(text: string, hinted?: number): number {
  const parts = countRomanParts(text);
  const tf = looksLikeTrueFalseReason(text);
  const prove = looksLikeProveOrConstruct(text);

  if (tf && parts >= 2) return Math.min(Math.max(parts, 2), 5);
  if (parts >= 5) return 5;
  if (parts >= 3) return Math.min(parts, 4);
  if (prove) return hinted && hinted >= 3 ? hinted : 3;
  if (typeof hinted === "number" && hinted >= 1) return Math.min(hinted, 5);
  if (parts === 2) return 2;
  return 2;
}

/** Build a CBSE-style practice rubric from question text + total. */
export function buildPracticeRubric(
  text: string,
  maxMarks: number,
): RubricStep[] {
  const parts = countRomanParts(text);
  const tf = looksLikeTrueFalseReason(text);

  if (tf && parts >= 2) {
    const per = maxMarks / parts;
    const marksEach =
      Math.abs(per - 1) < 0.01 ? 1 : Math.round(per * 2) / 2 || 1;
    const labels = Array.from({ length: parts }, (_, i) => {
      const roman = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii"][i] || String(i + 1);
      return {
        id: `p${i + 1}`,
        label: `Part (${roman})`,
        criteria: `Correct True/False (or statement) AND a valid reason/counterexample for part (${roman}).`,
        marks: marksEach,
      };
    });
    // Fix rounding so sum ≈ maxMarks
    const sum = labels.reduce((a, p) => a + (p.marks ?? 1), 0);
    if (labels.length && Math.abs(sum - maxMarks) >= 0.25) {
      labels[labels.length - 1].marks =
        Math.round((maxMarks - (sum - (labels[labels.length - 1].marks ?? 1))) * 2) /
        2;
    }
    return trueFalseReasonRubric(labels);
  }

  if (parts >= 3 && maxMarks >= parts) {
    const each = Math.floor((maxMarks / parts) * 2) / 2 || 1;
    const steps: RubricStep[] = Array.from({ length: parts }, (_, i) => {
      const roman = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii"][i] || String(i + 1);
      return {
        id: `p${i + 1}`,
        label: `Part (${roman})`,
        marks: each,
        criteria: `Correct working and answer for part (${roman}).`,
      };
    });
    const sum = steps.reduce((a, s) => a + s.marks, 0);
    if (steps.length && Math.abs(sum - maxMarks) >= 0.25) {
      steps[steps.length - 1].marks =
        Math.round((maxMarks - (sum - steps[steps.length - 1].marks)) * 2) / 2;
    }
    return steps;
  }

  return defaultRubric(maxMarks);
}

type RawQ = {
  n: string;
  text: string;
  marks?: number;
  ref?: string;
  /** Custom rubric — otherwise auto from marks + text */
  rubric?: RubricStep[];
};

type RawEx = { exercise: string; questions: RawQ[] };

type RawChapter = {
  chapterNumber: number;
  chapterName: string;
  /** Defaults to 9 when omitted */
  classLevel?: number;
  /** Defaults to Mathematics when omitted */
  subject?: string;
  exercises: RawEx[];
};

export function expandChapter(ch: RawChapter): SeedQuestion[] {
  const out: SeedQuestion[] = [];
  const classLevel = ch.classLevel ?? 9;
  const subject = ch.subject ?? "Mathematics";
  const notes =
    subject === "Science"
      ? CBSE_SCIENCE_MARKING_NOTES
      : subject === "Physics"
        ? CBSE_PHYSICS_MARKING_NOTES
        : subject === "Chemistry"
          ? CBSE_CHEMISTRY_MARKING_NOTES
          : subject === "Biology"
            ? CBSE_BIOLOGY_MARKING_NOTES
            : CBSE_MATHS_MARKING_NOTES;
  let order =
    (subject === "Science"
      ? 2_000_000
      : subject === "Physics"
        ? 3_000_000
        : subject === "Chemistry"
          ? 4_000_000
          : subject === "Biology"
            ? 5_000_000
            : 0) +
    classLevel * 100_000 +
    ch.chapterNumber * 1000;
  for (const ex of ch.exercises) {
    for (const q of ex.questions) {
      const text = q.text.trim();
      const maxMarks = inferPracticeMarks(text, q.marks);
      order += 1;
      out.push({
        board: "CBSE",
        classLevel,
        subject,
        chapterNumber: ch.chapterNumber,
        chapterName: ch.chapterName,
        exercise: ex.exercise,
        questionNumber: q.n,
        questionText: text,
        referenceNotes: q.ref,
        maxMarks,
        rubric: q.rubric ?? buildPracticeRubric(text, maxMarks),
        markingSchemeNotes: notes,
        weightSource: "practice_cbse",
        creditsCost: 5,
        sortOrder: order,
      });
    }
  }
  return out;
}

export type { RawChapter, RawEx, RawQ };
