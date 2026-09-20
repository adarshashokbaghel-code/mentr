import { LAUNCH_HUB_CITY } from "@/lib/seo";

export type LearnGeo =
  | "global"
  | "india"
  | "uae"
  | "australia"
  | "sri-lanka"
  | "pakistan";

export type LearnLandingCopy = {
  geo: LearnGeo;
  path: string;
  title: string;
  metaDescription: string;
  keywords: string[];
  /** Short breadcrumb / UI label */
  regionLabel: string;
  /** BCP 47-ish hreflang key (omit for global; use x-default/en) */
  hreflang?: string;
  heroEyebrow: string;
  heroTitle: string;
  heroAccent: string;
  heroSub: string;
  statsSub?: string;
  geoEmphasis: string;
  /** One line under Available today for this geo */
  clarityNote: string;
  faqs: { question: string; answer: string }[];
};

/** URL segments that resolve to a geo landing (excluding global `/learn`). */
export const LEARN_GEO_SEGMENTS: Exclude<LearnGeo, "global">[] = [
  "india",
  "uae",
  "australia",
  "sri-lanka",
  "pakistan",
];

export const LEARN_GEO_CHIPS = [
  { label: LAUNCH_HUB_CITY, tint: "bg-sage-wash text-sage border-sage/20", href: "/learn/india" },
  { label: "Hyderabad", tint: "bg-lavender text-ink border-ink/10", href: "/learn/india" },
  { label: "Delhi", tint: "bg-coral-wash text-coral-dark border-coral/20", href: "/learn/india" },
  { label: "Mumbai", tint: "bg-butter/60 text-ink border-ink/10", href: "/learn/india" },
  { label: "Pune", tint: "bg-lavender text-ink border-ink/10", href: "/learn/india" },
  { label: "UAE", tint: "bg-coral-wash text-coral-dark border-coral/20", href: "/learn/uae" },
  { label: "Australia", tint: "bg-sage-wash text-sage border-sage/20", href: "/learn/australia" },
  { label: "Sri Lanka", tint: "bg-butter/60 text-ink border-ink/10", href: "/learn/sri-lanka" },
  { label: "Pakistan", tint: "bg-lavender text-ink border-ink/10", href: "/learn/pakistan" },
  { label: "Worldwide", tint: "bg-butter/60 text-ink border-ink/10", href: "/learn" },
];

const baseFaqs = [
  {
    question: "What is Mentr Learn on mentr.in?",
    answer:
      "Mentr Learn is the free kids coding product on mentr.in/learn — also called Mentr Starter. It is a Class 3–5 (ages ~8–11) track covering computer science, AI literacy, and math-for-coding across 60 modules, with narrated lessons, quizzes, Build Arena, Practice, and Problem of the Day. Price is ₹0 forever.",
  },
  {
    question: "Where do I find Learn by Mentr / mentr.in learn?",
    answer:
      "Go to https://mentr.in/learn for the hub, https://mentr.in/learn/start to enroll free with a parent email, and https://mentr.in/learn/syllabus for the full parent syllabus PDF. Region pages include /learn/india, /learn/uae, /learn/australia, and more — same free modules, local framing.",
  },
  {
    question: "Is Mentr Learn really free?",
    answer:
      "Yes. The Class 3–5 track is ₹0 forever (list price ₹999 → ₹0). You get the published 60-module syllabus across CS, AI, and Math for CS, plus narrated lessons as they ship, quizzes, Build Arena, Practice, and Problem of the Day. Mentr makes money from optional tutor connections later — not from selling your child's learning data.",
  },
  {
    question: "What can my child use today vs later?",
    answer:
      "Available now: free enroll, narrated lessons as modules go live, quizzes, Build Arena missions, Practice bank, POTD, streaks and XP in the app. The full 60-module map is published for parents. Unit challenges and weekly parent email summaries are rolling out.",
  },
  {
    question: "What age or class is this for?",
    answer:
      "One foundation track for Class 3, 4, and 5 (roughly ages 8–11). Teachers and tuition centres can also share it as a free warm-up. Videos are narrated because reading fluency varies at Class 3.",
  },
  {
    question: "Do we still need a tutor?",
    answer:
      "Not for Mentr Learn — it's self-paced and free. Many families use Learn to build curiosity first, then browse verified tutors on Mentr when they want live help for school or exams.",
  },
  {
    question: "Is the leaderboard safe for kids?",
    answer:
      "The Class 3–5 cohort leaderboard shows first name and XP only — no emails or phone numbers. Every enrolled learner is ranked so kids can see how practice adds up.",
  },
  {
    question: "Can I download the full syllabus?",
    answer:
      "Yes. Open the parent syllabus page or download the PDF. It maps all 60 modules and what is / isn't included (no typed Python yet, no competitive coding).",
  },
  {
    question: "When do Class 6–8 and older cohorts launch?",
    answer:
      "Class 6–8 is planned next with deeper block-to-text coding. Class 9–12 will follow with exam- and career-oriented tracks. Join free now to get early access announcements.",
  },
];

const COPY: Record<LearnGeo, LearnLandingCopy> = {
  global: {
    geo: "global",
    path: "/learn",
    title: "Mentr Learn — Free Coding for Kids Class 3–5 | mentr.in/learn",
    metaDescription:
      "Mentr Learn by mentr.in is free coding for kids Class 3–5 — CS, AI & Math (60 modules), narrated lessons, Build Arena, Practice & POTD. ₹0 forever. Start at mentr.in/learn — parent email, no card.",
    keywords: [
      "Mentr Learn",
      "Learn by Mentr",
      "mentr.in learn",
      "mentr.in/learn",
      "learn.mentr",
      "free coding for kids",
      "coding for kids Class 5 free",
      "free coding for Class 3-5",
      "AI for kids",
      "free computer science class 3",
      "free coding platform for kids India",
      "block coding for kids",
      "Class 3-5 coding course free",
      "Mentr Starter",
      "Mentr Learn free",
    ],
    regionLabel: "Worldwide",
    heroEyebrow: "Mentr Learn · mentr.in/learn · Free",
    heroTitle: "Mentr Learn",
    heroAccent: "— free CS, AI & Math for Class 3–5 kids.",
    heroSub:
      "Mentr Learn on mentr.in is India's first completely free platform for kids to learn CS, AI, and coding — narrated videos, a published 60-module syllabus, Build Arena, and daily practice. ₹0 forever.",
    statsSub: "Worldwide · online-friendly",
    geoEmphasis: "Worldwide · online",
    clarityNote:
      "Same free Class 3–5 path worldwide — India, UAE, Australia, Sri Lanka, Pakistan, and beyond.",
    faqs: [
      ...baseFaqs,
      {
        question: "Does it work outside India?",
        answer:
          "Yes. Mentr Learn is built for online use in any time zone. Progress and streaks live in the app; weekly parent email summaries are rolling out. Region pages only change framing — modules are the same.",
      },
    ],
  },
  india: {
    geo: "india",
    path: "/learn/india",
    title: "Mentr Learn India — Free Coding for Kids Class 3–5 | mentr.in",
    metaDescription:
      "Mentr Learn (mentr.in/learn/india) — free coding for kids Class 3–5 in India. CBSE-friendly CS, AI & Math, 60 modules, Build Arena. ₹0 forever. Parent email enroll.",
    keywords: [
      "Mentr Learn India",
      "Mentr Learn",
      "mentr.in learn India",
      "free coding course for kids India",
      "coding for kids Class 5 free",
      "free coding for Class 3-5 India",
      "computer science Class 3-5 India",
      "AI for kids India",
      "coding class 3 India free",
      "CBSE class 3 computer",
      "block coding kids Bengaluru",
      "free coding Class 4 Class 5 India",
    ],
    regionLabel: "India",
    hreflang: "en-IN",
    heroEyebrow: "Mentr Learn · India · Free",
    heroTitle: "Mentr Learn",
    heroAccent: "— India's free CS, AI & Math path for Class 3–5 kids.",
    heroSub:
      "Mentr Learn on mentr.in is India's first completely free platform for kids to learn CS, AI, and coding — narrated videos, a gamified CBSE-friendly 60-module syllabus, Build Arena, and daily practice. Built for families in Bengaluru, Hyderabad, Delhi, Mumbai & Pune. ₹0 forever.",
    statsSub: "CBSE-friendly pacing · India",
    geoEmphasis: "India · CBSE-friendly",
    clarityNote:
      "Framed for Indian families and CBSE/ICSE-style computer awareness — modules match the worldwide free track.",
    faqs: [
      ...baseFaqs,
      {
        question: "Is this aligned with school computer classes?",
        answer:
          "Topics complement CBSE/ICSE-style computer awareness for middle primary — binary, algorithms, safe internet, and logical thinking — without replacing your school's textbook.",
      },
      {
        question: "Can teachers or tuition centres share this?",
        answer:
          "Yes. Use it as a free Class 3–5 warm-up or homework habit. Parents enroll with email; no card. Share the syllabus PDF or /learn/india link in WhatsApp groups.",
      },
      {
        question: "Can we share progress in parent WhatsApp groups?",
        answer:
          "Yes. Kids build streaks and XP in the app today. A weekly parent email summary is rolling out for easy forwards. The Junior Graduate finish line maps to the full 60-module syllabus.",
      },
    ],
  },
  uae: {
    geo: "uae",
    path: "/learn/uae",
    title: "Mentr Learn UAE — Free Coding for Kids | mentr.in/learn",
    metaDescription:
      "Mentr Learn (mentr.in/learn/uae) — free CS, AI & Math for Class 3–5 kids in the UAE. 60-module syllabus, Build Arena. ₹0. Enroll online.",
    keywords: [
      "Mentr Learn UAE",
      "Mentr Learn",
      "mentr.in learn UAE",
      "coding kids UAE",
      "free coding course kids Dubai",
      "IGCSE coding kids",
      "AI for kids UAE",
      "online CS class 3 UAE",
      "coding for kids Abu Dhabi free",
    ],
    regionLabel: "UAE",
    hreflang: "en-AE",
    heroEyebrow: "Mentr Learn · UAE · Online",
    heroTitle: "Mentr Learn",
    heroAccent: "— free CS, AI & Math for Class 3–5 kids in the UAE.",
    heroSub:
      "Mentr Learn on mentr.in is the completely free platform for kids to learn CS, AI, and coding — narrated videos, a gamified IGCSE-friendly 60-module syllabus, Build Arena, and daily practice. For families in Dubai, Abu Dhabi & Sharjah.",
    statsSub: "Online · Gulf time zones",
    geoEmphasis: "UAE · IGCSE-friendly",
    clarityNote:
      "Framed for UAE families and IGCSE-friendly foundations — same free Class 3–5 modules as India and worldwide.",
    faqs: [
      ...baseFaqs,
      {
        question: "Does Mentr Learn work for IGCSE prep later?",
        answer:
          "The Class 3–5 cohort builds foundations — logic, patterns, safe tech use — that help before formal IGCSE computing in later years. Older cohorts are on the roadmap.",
      },
      {
        question: "We're fully online in UAE — is that OK?",
        answer:
          "Yes. Mentr Learn is built for video, quiz, Build, and practice at home. No home tutor required for the Learn track itself.",
      },
      {
        question: "Can schools or centres in the UAE share this?",
        answer:
          "Yes. Share /learn/uae or the syllabus PDF as a free warm-up. Parents enroll with email; no card required.",
      },
    ],
  },
  australia: {
    geo: "australia",
    path: "/learn/australia",
    title: "Mentr Learn Australia — Free Coding for Kids | mentr.in",
    metaDescription:
      "Mentr Learn (mentr.in/learn/australia) — free Class 3–5 CS, AI & Math for kids in Australia. 60 modules, Build Arena. ₹0 forever. Parent enroll.",
    keywords: [
      "Mentr Learn Australia",
      "Mentr Learn",
      "mentr.in learn Australia",
      "coding for kids Australia free",
      "free coding course kids Sydney",
      "primary coding Australia",
      "AI for kids Australia",
      "online CS class kids Melbourne",
    ],
    regionLabel: "Australia",
    hreflang: "en-AU",
    heroEyebrow: "Mentr Learn · Australia · Online",
    heroTitle: "Mentr Learn",
    heroAccent: "— free CS, AI & Math for Class 3–5 kids in Australia.",
    heroSub:
      "Mentr Learn on mentr.in — completely free CS, AI, and coding for primary-age kids. Narrated videos, 60-module syllabus, Build Arena, and daily practice. For families in Sydney, Melbourne, Brisbane & beyond.",
    statsSub: "Online · AEST-friendly",
    geoEmphasis: "Australia · online",
    clarityNote:
      "Framed for Australian families — English narrated Class 3–5 path; modules match India, UAE, and worldwide Learn.",
    faqs: [
      ...baseFaqs,
      {
        question: "Does this match Australian primary digital tech?",
        answer:
          "It complements primary computational thinking and digital literacy — patterns, algorithms, safe tech — without replacing your school’s curriculum. Older year levels are on the roadmap.",
      },
      {
        question: "What timezone does it work in?",
        answer:
          "Self-paced online. Kids can learn any time; progress saves to the parent account.",
      },
    ],
  },
  "sri-lanka": {
    geo: "sri-lanka",
    path: "/learn/sri-lanka",
    title: "Mentr Learn Sri Lanka — Free Coding for Kids | mentr.in",
    metaDescription:
      "Mentr Learn (mentr.in/learn/sri-lanka) — free Class 3–5 CS, AI & Math for kids in Sri Lanka. 60 modules, Build Arena. ₹0. Parent email enroll.",
    keywords: [
      "Mentr Learn Sri Lanka",
      "Mentr Learn",
      "mentr.in learn Sri Lanka",
      "coding for kids Sri Lanka free",
      "free coding course kids Colombo",
      "computer science Class 3-5 Sri Lanka",
      "AI for kids Sri Lanka",
    ],
    regionLabel: "Sri Lanka",
    hreflang: "en-LK",
    heroEyebrow: "Mentr Learn · Sri Lanka · Free",
    heroTitle: "Mentr Learn",
    heroAccent: "— free CS, AI & Math for Class 3–5 kids in Sri Lanka.",
    heroSub:
      "Mentr Learn on mentr.in — completely free CS, AI, and coding for Class 3–5. Narrated videos, 60-module syllabus, Build Arena, and daily practice. For families in Colombo, Kandy & online island-wide.",
    statsSub: "Online · Sri Lanka",
    geoEmphasis: "Sri Lanka · online",
    clarityNote:
      "Framed for Sri Lankan families — same free English Class 3–5 foundation as the worldwide track.",
    faqs: [
      ...baseFaqs,
      {
        question: "Is English narration OK for Sri Lanka?",
        answer:
          "Yes. Lessons are English-narrated for mixed reading levels at Class 3–5. The same modules ship worldwide.",
      },
      {
        question: "Can tuition centres share this?",
        answer:
          "Yes. Share /learn/sri-lanka or the syllabus PDF as a free warm-up. Parents enroll with email; no card.",
      },
    ],
  },
  pakistan: {
    geo: "pakistan",
    path: "/learn/pakistan",
    title: "Mentr Learn Pakistan — Free Coding for Kids | mentr.in",
    metaDescription:
      "Mentr Learn (mentr.in/learn/pakistan) — free Class 3–5 CS, AI & Math for kids in Pakistan. 60 modules, Build Arena. ₹0 forever. Parent enroll.",
    keywords: [
      "Mentr Learn Pakistan",
      "Mentr Learn",
      "mentr.in learn Pakistan",
      "coding for kids Pakistan free",
      "free coding course kids Karachi",
      "computer science Class 3-5 Pakistan",
      "AI for kids Pakistan",
      "coding kids Lahore online",
    ],
    regionLabel: "Pakistan",
    hreflang: "en-PK",
    heroEyebrow: "Mentr Learn · Pakistan · Free",
    heroTitle: "Mentr Learn",
    heroAccent: "— free CS, AI & Math for Class 3–5 kids in Pakistan.",
    heroSub:
      "Mentr Learn on mentr.in — completely free CS, AI, and coding for Class 3–5. Narrated videos, 60-module syllabus, Build Arena, and daily practice. For families in Karachi, Lahore, Islamabad & online.",
    statsSub: "Online · Pakistan",
    geoEmphasis: "Pakistan · online",
    clarityNote:
      "Framed for Pakistani families — same free English Class 3–5 foundation as India and worldwide Learn.",
    faqs: [
      ...baseFaqs,
      {
        question: "Is this only for big cities?",
        answer:
          "No. Any household with internet can enroll. City names help search; the course is the same online track.",
      },
      {
        question: "Can academies share this with parents?",
        answer:
          "Yes. Share /learn/pakistan or the syllabus PDF. Parents enroll with email; no credit card.",
      },
    ],
  },
};

export function learnCopyFor(geo: LearnGeo): LearnLandingCopy {
  return COPY[geo];
}

export function parseLearnGeo(raw?: string | string[]): LearnGeo | null {
  if (!raw || (Array.isArray(raw) && raw.length === 0)) return "global";
  const segment = Array.isArray(raw) ? raw[0] : raw;
  if (
    segment === "india" ||
    segment === "uae" ||
    segment === "australia" ||
    segment === "sri-lanka" ||
    segment === "pakistan"
  ) {
    return segment;
  }
  return null;
}

export function learnPathFor(geo: LearnGeo): string {
  return learnCopyFor(geo).path;
}

/** hreflang map for Learn hub alternates (includes x-default + en). */
export function learnHreflangMap(): Record<string, string> {
  const map: Record<string, string> = {
    "x-default": "/learn",
    en: "/learn",
  };
  for (const segment of LEARN_GEO_SEGMENTS) {
    const copy = COPY[segment];
    if (copy.hreflang) map[copy.hreflang] = copy.path;
  }
  return map;
}
