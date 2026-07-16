import {
  LOCALITIES,
  SUBJECTS,
  TEACHERS,
  searchTeachers,
  type Teacher,
} from "@/lib/teachers";

export const CITY = "Bengaluru";

/** URL slug helpers */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function subjectHubSlug(subject: string): string {
  return `${slugify(subject)}-tutors-bengaluru`;
}

export function areaHubSlug(area: string): string {
  return `${slugify(area)}-tutors`;
}

export function comboSlug(subject: string): string {
  return `${slugify(subject)}-tuition`;
}

export function parseSubjectHubSlug(slug: string): string | null {
  const suffix = "-tutors-bengaluru";
  if (!slug.endsWith(suffix)) return null;
  const raw = slug.slice(0, -suffix.length).replace(/-/g, " ");
  return SUBJECTS.find((s) => slugify(s) === slugify(raw)) ?? null;
}

export function parseAreaHubSlug(slug: string): string | null {
  const suffix = "-tutors";
  if (!slug.endsWith(suffix)) return null;
  const raw = slug.slice(0, -suffix.length).replace(/-/g, " ");
  return LOCALITIES.find((a) => slugify(a) === slugify(raw)) ?? null;
}

export function parseComboSlug(slug: string): string | null {
  const suffix = "-tuition";
  if (!slug.endsWith(suffix)) return null;
  const raw = slug.slice(0, -suffix.length).replace(/-/g, " ");
  return SUBJECTS.find((s) => slugify(s) === slugify(raw)) ?? null;
}

export function localityFromSlug(slug: string): (typeof LOCALITIES)[number] | null {
  return (
    LOCALITIES.find((a) => slugify(a) === slug) ?? null
  );
}

export function teachersForSubject(subject: string): Teacher[] {
  return searchTeachers({ subject, teachers: TEACHERS });
}

export function teachersForArea(area: string): Teacher[] {
  return searchTeachers({ locality: area, teachers: TEACHERS });
}

export function teachersForCombo(area: string, subject: string): Teacher[] {
  return searchTeachers({ subject, locality: area, teachers: TEACHERS });
}

/** Only publish combo pages with at least one teacher */
export function publishedCombos(): { area: string; subject: string }[] {
  const out: { area: string; subject: string }[] = [];
  for (const area of LOCALITIES) {
    for (const subject of SUBJECTS) {
      if (teachersForCombo(area, subject).length > 0) {
        out.push({ area, subject });
      }
    }
  }
  return out;
}

export const EXAM_PREP_PAGES = [
  {
    slug: "jee-coaching-bengaluru",
    title: "JEE Physics & Maths Coaching in Bengaluru",
    description:
      "Find verified JEE-prep tutors near you in Bengaluru. Compare profiles, check availability, connect free on WhatsApp.",
    headline: "JEE coaching in Bengaluru",
    intro:
      "Browse verified Physics and Mathematics tutors who prepare students for JEE mains and advanced. Filter by area, compare experience, and send a free connect request.",
    subjects: ["Physics", "Mathematics", "Exam Prep"],
    levels: ["jee", "class 11", "class 12"],
  },
  {
    slug: "neet-foundation-bengaluru",
    title: "NEET Foundation Tutors in Bengaluru",
    description:
      "Verified NEET foundation and Biology tutors across Bengaluru. Search by area, connect free, no agent fees.",
    headline: "NEET foundation tutors",
    intro:
      "Find Biology and Chemistry tutors who specialise in NEET foundation and Class 11–12 board prep across Bengaluru.",
    subjects: ["Biology", "Chemistry", "Exam Prep"],
    levels: ["neet", "class 11", "class 12"],
  },
  {
    slug: "class-10-board-exam-tutors-bengaluru",
    title: "Class 10 Board Exam Tutors in Bengaluru",
    description:
      "Verified Class 10 tutors for CBSE and state board exams across Bengaluru. Search by subject and area — free to connect.",
    headline: "Class 10 board exam tutors",
    intro:
      "Parents searching for Class 9–10 tutors ahead of board exams — browse verified profiles by subject and locality.",
    subjects: ["Mathematics", "Science", "English", "Exam Prep"],
    levels: ["class 9", "class 10"],
  },
  {
    slug: "class-12-board-exam-tutors-bengaluru",
    title: "Class 12 Board Exam Tutors in Bengaluru",
    description:
      "Verified Class 12 tutors for board exams and entrance prep across Bengaluru. Connect free on WhatsApp.",
    headline: "Class 12 board exam tutors",
    intro:
      "Class 11–12 tutors for board exams, JEE/NEET foundation, and subject coaching — searchable by area across Bengaluru.",
    subjects: ["Mathematics", "Physics", "Chemistry", "Biology", "Exam Prep"],
    levels: ["class 11", "class 12"],
  },
] as const;

export function teachersForExamPrep(
  subjects: readonly string[],
  levels: readonly string[],
): Teacher[] {
  const levelQ = levels.join(" ").toLowerCase();
  return TEACHERS.filter((t) => {
    const subjectHit = t.subjects.some((s) =>
      subjects.some((x) => x.toLowerCase() === s.toLowerCase()),
    );
    const levelHit =
      t.levels.toLowerCase().includes(levelQ.split(" ")[0]!) ||
      levels.some((l) => t.levels.toLowerCase().includes(l.toLowerCase()));
    return subjectHit && levelHit;
  });
}

export const VS_PAGES = [
  {
    slug: "urbanpro",
    title: "Mentr vs UrbanPro — Which Is Better for Bengaluru Tutors?",
    description:
      "Compare Mentr and UrbanPro on fees, lead costs and contact method. See why Bengaluru tutors are switching to a free model.",
    headline: "Mentr vs UrbanPro",
    competitor: "UrbanPro",
    bullets: [
      "UrbanPro charges tutors for leads via coins and credits; Mentr is free to list and respond.",
      "On Mentr, parents contact tutors on WhatsApp after a connect request is accepted — no per-lead fee.",
      "Tutors keep 100% of their session fees on Mentr; UrbanPro often layers platform costs on top.",
    ],
  },
  {
    slug: "tuition-agencies",
    title: "Mentr vs Tuition Agencies — Skip the 15–30% Cut",
    description:
      "Tuition agencies take a cut of every session. Mentr connects parents and tutors directly on WhatsApp for ₹0, always.",
    headline: "Mentr vs tuition agencies",
    competitor: "Tuition agencies",
    bullets: [
      "Agencies typically take 15–30% of every session and own the parent relationship.",
      "Mentr lists verified tutors free and lets parents send connect requests directly.",
      "Fees, timing, and location are arranged between parent and tutor — Mentr takes nothing.",
    ],
  },
  {
    slug: "whatsapp-tutor-groups",
    title: "Mentr vs WhatsApp Tutor Groups",
    description:
      "WhatsApp groups bury posts and go stale. Mentr is a searchable directory with verified profiles and live availability — free.",
    headline: "Mentr vs WhatsApp groups",
    competitor: "WhatsApp tutor groups",
    bullets: [
      "Group chats make it hard to search by subject, area, or availability.",
      "Mentr profiles show subjects, experience, verification, and open weekly slots.",
      "Parents send a connect request; tutors accept before WhatsApp is shared — less spam for everyone.",
    ],
  },
] as const;

export function subjectIntro(subject: string): string {
  const intros: Record<string, string> = {
    Mathematics:
      "From Class 6–12 to board exams and JEE foundation — find verified Maths tutors across Koramangala, Indiranagar, HSR Layout, Whitefield, and more.",
    Physics:
      "School Physics, board exams, and JEE prep — browse verified tutors by area in Bengaluru and connect free once they accept your request.",
    Chemistry:
      "Organic, inorganic, and board-exam Chemistry tutors across Bengaluru. See open slots and send a free connect request on Mentr.",
    English:
      "Spoken English, writing, and school English tutors in Bengaluru. Verified profiles, direct WhatsApp after acceptance.",
    "Computer Science":
      "School CS and exam-prep tutors across Bengaluru — searchable by locality with live availability on Mentr.",
    Coding:
      "Python, web basics, and beginner coding for school students — find tutors near you in Bengaluru, free to connect.",
    Biology:
      "School Biology and NEET foundation tutors across Bengaluru. Filter by area and connect on WhatsApp after acceptance.",
    "Exam Prep":
      "Board exams, JEE, and NEET foundation — verified exam-prep tutors across Bengaluru with open weekly slots.",
    "Career Mentoring":
      "Career guidance and spoken-skills mentors for teens and young adults in Bengaluru — free to search and connect.",
    Economics:
      "Class 11–12 Economics and board-exam tutors across Bengaluru — verified profiles, no agent fees.",
    Music:
      "Music basics and school-level tutoring in Bengaluru — browse verified mentors by area.",
    "Sports Coaching":
      "Sports coaching and fitness mentoring for students in Bengaluru — find verified coaches near you.",
  };
  return (
    intros[subject] ??
    `Find verified ${subject} tutors across ${CITY}. Search by area, see availability, and connect free on WhatsApp.`
  );
}

export function areaIntro(area: string): string {
  return `Parents in ${area}, ${CITY} — browse verified tutors for Mathematics, Physics, English, Coding, exam prep, and more. Every listing is free to view; WhatsApp unlocks after the tutor accepts your connect request.`;
}

export function comboIntro(area: string, subject: string): string {
  return `Looking for ${subject} tuition in ${area}, ${CITY}? These verified tutors teach ${subject} near ${area}. Compare experience, check open slots, and send a free connect request — no lead fees, no commission.`;
}
