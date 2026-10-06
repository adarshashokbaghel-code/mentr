import { PY_LESSON_INDEX, getPyLesson } from "@/lib/python-lms";
import type { PyLessonProgress } from "@/lib/python-lms/lesson-progress";
import { completedProjects, type PyProjectProgress } from "@/lib/python-lms/project-progress";
import { PY_PROJECTS, getPyProject } from "@/lib/python-lms/projects";
import { awardKind } from "@/lib/python-lms/rules";
import type { PyCertificate } from "@/lib/python-lms/sync-client";

/** What a learner must have done to earn the course certificate. */
export const PY_CERT_RULES = {
  practice: 20,
  examples: 50,
  projects: 1,
} as const;

export const PY_CERT_COURSE = "Python Beginner";

export type CertRequirementId = "study" | "practice" | "examples" | "project";

export type CertRequirement = {
  id: CertRequirementId;
  title: string;
  detail: string;
  have: number;
  need: number;
  done: boolean;
};

export type CertProgress = {
  requirements: CertRequirement[];
  eligible: boolean;
  /** Lessons whose Study is finished / still to do, in course order. */
  studied: { slug: string; number: number; title: string; done: boolean }[];
  stats: { lessonsStudied: number; practiceSolved: number; examplesSolved: number; projectsCompleted: number };
  projectIds: string[];
};

/** Lessons that have learning material (the Final Challenge has projects instead). */
export function studyLessons() {
  return PY_LESSON_INDEX.filter((l) => getPyLesson(l.slug));
}

export function certificateProgress(input: {
  lessons: Record<string, PyLessonProgress | undefined>;
  awardKeys: string[];
  projects: Record<string, PyProjectProgress | undefined>;
}): CertProgress {
  const studied = studyLessons().map((l) => ({
    slug: l.slug,
    number: l.number,
    title: l.title,
    done: Boolean(input.lessons[l.slug]?.notesDone),
  }));
  let practiceSolved = 0;
  let examplesSolved = 0;
  for (const key of input.awardKeys) {
    const kind = awardKind(key);
    if (kind === "practice" || kind === "lesson") practiceSolved++;
    else if (kind === "example") examplesSolved++;
  }
  const projectIds = completedProjects(input.projects);
  const lessonsStudied = studied.filter((s) => s.done).length;

  const requirements: CertRequirement[] = [
    {
      id: "study",
      title: "Finish every lesson's Study",
      detail: `Go through every Study slide in all ${studied.length} lessons.`,
      have: lessonsStudied,
      need: studied.length,
      done: lessonsStudied === studied.length,
    },
    {
      id: "practice",
      title: `Solve ${PY_CERT_RULES.practice}+ practice problems`,
      detail: "Correct answers in lesson Practice and the Practice bank both count. Revealed answers do not.",
      have: practiceSolved,
      need: PY_CERT_RULES.practice,
      done: practiceSolved >= PY_CERT_RULES.practice,
    },
    {
      id: "examples",
      title: `Solve ${PY_CERT_RULES.examples}+ examples`,
      detail: "Step a program to its last line, or reach a playground's goal, in the lesson Examples.",
      have: examplesSolved,
      need: PY_CERT_RULES.examples,
      done: examplesSolved >= PY_CERT_RULES.examples,
    },
    {
      id: "project",
      title: `Complete ${PY_CERT_RULES.projects} Final Challenge project`,
      detail: `Press Run on one of the ${PY_PROJECTS.length} projects. A correct program is marked complete.`,
      have: projectIds.length,
      need: PY_CERT_RULES.projects,
      done: projectIds.length >= PY_CERT_RULES.projects,
    },
  ];

  return {
    requirements,
    eligible: requirements.every((r) => r.done),
    studied,
    stats: { lessonsStudied, practiceSolved, examplesSolved, projectsCompleted: projectIds.length },
    projectIds,
  };
}

/** Public id format, e.g. MPY-7K2D-QX9M. No 0/O/1/I so it is easy to read out. */
export const CERT_ID_RE = /^MPY-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$/;
export const CERT_ID_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export const certificateVerifyPath = (id: string) => `/learnpython/certificate/${id}`;

export const certificateDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

export const certificateProjectTitles = (ids: string[]) => ids.map((id) => getPyProject(id)?.title ?? id);

/** The achievement sentence printed on the certificate, built only from the stored numbers. */
export function certificateSummary(cert: PyCertificate): string {
  const s = cert.stats;
  const total = studyLessons().length;
  const projects = certificateProjectTitles(s.projects);
  const lessons = s.lessonsStudied >= total ? `all ${total} lessons of study` : `${s.lessonsStudied} of ${total} lessons of study`;
  const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;
  const work = `solving ${plural(s.practiceSolved, "practice problem")} and ${plural(s.examplesSolved, "example")}`;
  if (!projects.length) return `for completing ${lessons} and ${work}.`;
  return (
    `for completing ${lessons}, ${work}, and building ${projects.length === 1 ? "the" : projects.length} Final Challenge ` +
    `project${projects.length === 1 ? "" : "s"}: ${projects.join(", ")}.`
  );
}
