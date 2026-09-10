/**
 * High-intent programmatic SEO pages — subject+class, boards, cities, combos.
 * Only curated URLs (no full cross-product spam). Pages always include FAQs + requirement CTA.
 */

import {
  SUBJECTS,
  TEACHERS,
  searchTeachers,
  type Teacher,
} from "@/lib/teachers";
import { slugify, teachersForSubject } from "@/lib/seo-hubs";

export type ClassLevel = "6" | "7" | "8" | "9" | "10" | "11" | "12";

export const CLASS_LEVELS: ClassLevel[] = [
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
];

export const BOARDS = [
  {
    id: "cbse",
    label: "CBSE",
    keywords: ["cbse", "central board"],
  },
  {
    id: "icse",
    label: "ICSE",
    keywords: ["icse", "isc"],
  },
  {
    id: "igcse",
    label: "IGCSE",
    keywords: ["igcse", "ig ", "cambridge"],
  },
  {
    id: "state-board",
    label: "State Board",
    keywords: ["state board", "karnataka", "state"],
  },
] as const;

export type BoardId = (typeof BOARDS)[number]["id"];

export const SEO_CITIES = [
  {
    slug: "bengaluru",
    name: "Bengaluru",
    local: true,
  },
  {
    slug: "pune",
    name: "Pune",
    local: false,
  },
  {
    slug: "hyderabad",
    name: "Hyderabad",
    local: false,
  },
  {
    slug: "delhi",
    name: "Delhi",
    local: false,
  },
  {
    slug: "mumbai",
    name: "Mumbai",
    local: false,
  },
] as const;

export type SeoCitySlug = (typeof SEO_CITIES)[number]["slug"];

export type HubFaq = { question: string; answer: string };

/** Curated high-intent subject × class pages */
export const SUBJECT_CLASS_PAGES: { subject: string; level: ClassLevel }[] = [
  { subject: "Physics", level: "10" },
  { subject: "Physics", level: "12" },
  { subject: "Chemistry", level: "10" },
  { subject: "Chemistry", level: "12" },
  { subject: "Mathematics", level: "9" },
  { subject: "Mathematics", level: "10" },
  { subject: "Mathematics", level: "12" },
  { subject: "English", level: "8" },
  { subject: "English", level: "10" },
  { subject: "Coding", level: "6" },
  { subject: "Coding", level: "9" },
  { subject: "Biology", level: "10" },
  { subject: "Biology", level: "12" },
  { subject: "Computer Science", level: "10" },
];

/** Board × class × subject combos (high-intent only) */
export const BOARD_COMBO_PAGES: {
  board: BoardId;
  level: ClassLevel;
  subject: string;
}[] = [
  { board: "cbse", level: "10", subject: "Mathematics" },
  { board: "cbse", level: "10", subject: "Physics" },
  { board: "cbse", level: "10", subject: "Chemistry" },
  { board: "cbse", level: "12", subject: "Physics" },
  { board: "cbse", level: "12", subject: "Mathematics" },
  { board: "icse", level: "10", subject: "Mathematics" },
  { board: "icse", level: "10", subject: "English" },
  { board: "igcse", level: "10", subject: "Mathematics" },
  { board: "state-board", level: "10", subject: "Mathematics" },
];

/** City × subject (top subjects per launch city) */
export const CITY_SUBJECT_PAGES: { city: SeoCitySlug; subject: string }[] =
  SEO_CITIES.flatMap((city) =>
    (
      [
        "Mathematics",
        "Physics",
        "Chemistry",
        "English",
        "Coding",
      ] as const
    ).map((subject) => ({ city: city.slug, subject })),
  );

export function classSubjectPath(level: ClassLevel, subject: string): string {
  return `/class/${level}/${slugify(subject)}-tutors`;
}

export function boardPath(board: BoardId): string {
  return `/boards/${board}-tutors`;
}

export function boardComboPath(
  board: BoardId,
  level: ClassLevel,
  subject: string,
): string {
  return `/boards/${board}/class-${level}/${slugify(subject)}-tutors`;
}

export function cityPath(city: SeoCitySlug): string {
  return `/tutors/${city}`;
}

export function citySubjectPath(city: SeoCitySlug, subject: string): string {
  return `/tutors/${city}/${slugify(subject)}-tutors`;
}

function levelsMatch(level: ClassLevel, levelsText: string): boolean {
  const t = levelsText.toLowerCase();
  const n = Number(level);
  if (t.includes(`class ${level}`)) return true;
  if (t.includes(`class ${n - 1}–${level}`) || t.includes(`class ${n - 1}-${level}`))
    return true;
  if (level === "10" && (t.includes("class 9–10") || t.includes("class 9-10")))
    return true;
  if (level === "12" && (t.includes("class 11–12") || t.includes("class 11-12")))
    return true;
  if (level === "12" && (t.includes("jee") || t.includes("neet"))) return true;
  return false;
}

function boardMatch(boardId: BoardId, teacher: Teacher): boolean {
  const board = BOARDS.find((b) => b.id === boardId);
  if (!board) return false;
  const hay = `${teacher.levels} ${teacher.bio}`.toLowerCase();
  return board.keywords.some((k) => hay.includes(k));
}

export function teachersForClassSubject(
  subject: string,
  level: ClassLevel,
): Teacher[] {
  const bySubject = teachersForSubject(subject);
  const matched = bySubject.filter((t) => levelsMatch(level, t.levels));
  return matched.length > 0 ? matched : bySubject;
}

export function teachersForBoard(boardId: BoardId): Teacher[] {
  const matched = TEACHERS.filter((t) => boardMatch(boardId, t));
  return matched.length > 0 ? matched : TEACHERS;
}

export function teachersForBoardCombo(
  boardId: BoardId,
  level: ClassLevel,
  subject: string,
): Teacher[] {
  const byClass = teachersForClassSubject(subject, level);
  const matched = byClass.filter((t) => boardMatch(boardId, t));
  return matched.length > 0 ? matched : byClass;
}

export function teachersForCity(citySlug: SeoCitySlug): Teacher[] {
  const city = SEO_CITIES.find((c) => c.slug === citySlug);
  if (!city) return [];
  if (city.local) return [...TEACHERS];
  return searchTeachers({ teachers: TEACHERS, mode: "online" });
}

export function teachersForCitySubject(
  citySlug: SeoCitySlug,
  subject: string,
): Teacher[] {
  const city = SEO_CITIES.find((c) => c.slug === citySlug);
  if (!city) return [];
  if (city.local) return teachersForSubject(subject);
  return searchTeachers({ subject, teachers: TEACHERS, mode: "online" });
}

export function parseClassSubjectSlug(
  level: string,
  subjectSlug: string,
): { level: ClassLevel; subject: string } | null {
  if (!CLASS_LEVELS.includes(level as ClassLevel)) return null;
  const raw = subjectSlug.replace(/-tutors$/, "").replace(/-/g, " ");
  const subject =
    SUBJECTS.find((s) => slugify(s) === slugify(raw)) ??
    SUBJECTS.find((s) => raw.toLowerCase().includes(s.toLowerCase()));
  if (!subject) return null;
  return { level: level as ClassLevel, subject };
}

export function parseBoardSlug(slug: string): BoardId | null {
  const id = slug.replace(/-tutors$/, "");
  return BOARDS.some((b) => b.id === id) ? (id as BoardId) : null;
}

export function parseBoardCombo(
  board: string,
  levelSegment: string,
  subjectSlug: string,
): { board: BoardId; level: ClassLevel; subject: string } | null {
  const boardId = parseBoardSlug(`${board}-tutors`);
  if (!boardId) return null;
  const levelMatch = levelSegment.match(/^class-(\d+)$/);
  if (!levelMatch) return null;
  const level = levelMatch[1] as ClassLevel;
  if (!CLASS_LEVELS.includes(level)) return null;
  const raw = subjectSlug.replace(/-tutors$/, "").replace(/-/g, " ");
  const subject = SUBJECTS.find((s) => slugify(s) === slugify(raw));
  if (!subject) return null;
  return { board: boardId, level, subject };
}

export function classSubjectFaqs(
  subject: string,
  level: ClassLevel,
): HubFaq[] {
  return [
    {
      question: `How do I find a ${subject} tutor for Class ${level}?`,
      answer: `Browse verified ${subject} tutors on Mentr who teach Class ${level} and nearby grades. Send a free connect request — WhatsApp unlocks after the tutor accepts. No lead fees.`,
    },
    {
      question: `What should I ask before hiring a Class ${level} ${subject} tutor?`,
      answer: `Confirm board (CBSE/ICSE), weekly hours, home vs online, fee range, and whether they set weekly tests. Trial one session before committing monthly.`,
    },
    {
      question: `Can't find the right ${subject} tutor?`,
      answer: `Post your requirement on Mentr — describe Class ${level}, ${subject}, area, and budget. Verified tutors pitch you for free.`,
    },
  ];
}

export function boardFaqs(boardLabel: string): HubFaq[] {
  return [
    {
      question: `How do I find ${boardLabel} tutors near me?`,
      answer: `Search ${boardLabel} tutors on Mentr by subject and class. Profiles show experience, verification, and open slots. Connect free — fees stay between you and the tutor.`,
    },
    {
      question: `Are ${boardLabel} tutors on Mentr verified?`,
      answer: `Verified tutors complete ID and credential checks. Look for the verified badge on profiles before connecting.`,
    },
    {
      question: `What if no ${boardLabel} tutor matches my need?`,
      answer: `Post a requirement — tutors who teach ${boardLabel} can pitch you with a message. You choose who to connect with.`,
    },
  ];
}

export function cityFaqs(cityName: string, local: boolean): HubFaq[] {
  return [
    {
      question: `How do I find tutors in ${cityName}?`,
      answer: local
        ? `Browse verified tutors across ${cityName} by subject and area on Mentr. Filter by open slots and send a free connect request.`
        : `Mentr lists online tutors who work with ${cityName} families — video sessions in your time zone. Post a requirement to get pitches from tutors who serve ${cityName}.`,
    },
    {
      question: `Is Mentr free for parents in ${cityName}?`,
      answer: `Yes. Search, shortlist, connect, and post requirements are free. Mentr takes no commission on tuition fees.`,
    },
    {
      question: `Home tutor vs online tutor in ${cityName}?`,
      answer: `Many families mix both — home visits for tests and online doubt-clearing on weekdays. Mentr profiles show teaching mode so you can filter before connecting.`,
    },
  ];
}

export const REQUIREMENT_CTA = {
  label: "Post your requirement",
  href: "/parent/signup?next=/parent/dashboard",
  blurb:
    "Can't find exactly what you need? Post your requirement and let verified tutors come to you — free on Mentr.",
};
