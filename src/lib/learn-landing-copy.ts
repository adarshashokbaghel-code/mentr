import { LAUNCH_HUB_CITY } from "@/lib/seo";

export type LearnGeo = "global" | "india" | "uae";

export type LearnLandingCopy = {
  geo: LearnGeo;
  path: string;
  title: string;
  metaDescription: string;
  keywords: string[];
  heroEyebrow: string;
  heroTitle: string;
  heroAccent: string;
  heroSub: string;
  statsSub?: string;
  geoEmphasis: string;
  faqs: { question: string; answer: string }[];
};

export const LEARN_GEO_CHIPS = [
  { label: LAUNCH_HUB_CITY, tint: "bg-sage-wash text-sage border-sage/20" },
  { label: "Hyderabad", tint: "bg-lavender text-ink border-ink/10" },
  { label: "Delhi", tint: "bg-coral-wash text-coral-dark border-coral/20" },
  { label: "Mumbai", tint: "bg-butter/60 text-ink border-ink/10" },
  { label: "Pune", tint: "bg-lavender text-ink border-ink/10" },
  { label: "UAE", tint: "bg-coral-wash text-coral-dark border-coral/20" },
  { label: "Worldwide", tint: "bg-butter/60 text-ink border-ink/10" },
];

const baseFaqs = [
  {
    question: "Is Mentr Learn really free?",
    answer:
      "Yes. All 60 modules across CS, AI, and Math for CS are free for Class 3–5 (₹999 → ₹0). Each lesson is a video, 10 practice questions, and 1 progress check. Mentr makes money from optional tutor connections later — not from selling your child's learning data.",
  },
  {
    question: "What age or class is this for?",
    answer:
      "One live track for Class 3, 4, and 5 (roughly ages 8–11). The same 20 CS, 20 AI, and 20 Math lessons — Easy to Apply. Videos are narrated because reading fluency varies at Class 3.",
  },
  {
    question: "Do we still need a tutor?",
    answer:
      "Not for Mentr Learn — it's self-paced and free. Many families use Learn to build curiosity first, then book a verified tutor on Mentr when they want live help for school or exams.",
  },
  {
    question: "Is the leaderboard safe for kids?",
    answer:
      "Leaderboards are scoped to your child's cohort, show first name and avatar only, and are parent opt-in — off by default so younger kids aren't discouraged by older active learners.",
  },
  {
    question: "Can I download the full syllabus?",
    answer:
      "Yes. Open the parent guide or download the PDF. It’s written for you — what your child watches, practises, and the check question you’ll see after each lesson.",
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
    title: "Master CS, AI & Math for Class 3–5 Kids | Mentr Learn",
    metaDescription:
      "Free Class 3–5 CS, AI & coding for kids — 60 modules, Watch → Quiz → Play → Boss. Mentr Learn (Mentr Starter) is ₹0 forever. Enroll with parent email.",
    keywords: [
      "coding for kids",
      "AI for kids",
      "free computer science class 3",
      "free coding platform for kids India",
      "block coding for kids",
      "Class 3-5 coding course free",
      "Mentr Learn",
      "Mentr Starter",
    ],
    heroEyebrow: "",
    heroTitle: "Master CS, AI & Math",
    heroAccent: "— a free gamified learning platform for Class 3–5 kids.",
    heroSub:
      "India's first completely free platform for kids to learn CS, AI, and coding — narrated videos, a gamified syllabus, and lessons that teach what actually matters. ₹0 forever.",
    statsSub: "Worldwide · online-friendly",
    geoEmphasis: "Worldwide · online",
    faqs: [
      ...baseFaqs,
      {
        question: "Does it work outside India?",
        answer:
          "Yes. Mentr Learn is built for online use in any time zone. Parents get a weekly email summary.",
      },
    ],
  },
  india: {
    geo: "india",
    path: "/learn/india",
    title: "Master Coding for Class 3–5 India | Mentr Learn",
    metaDescription:
      "Free coding for Class 3–5 kids in India — CS, AI & Math, 60 modules, CBSE-friendly foundations. Mentr Learn is ₹0 forever. Enroll free.",
    keywords: [
      "free coding course for kids India",
      "computer science Class 3-5 India",
      "AI for kids India",
      "coding class 3 India free",
      "CBSE class 3 computer",
      "block coding kids Bengaluru",
      "Mentr Learn India",
    ],
    heroEyebrow: "India · Class 3–5 · Free",
    heroTitle: "Master CS, AI & Math",
    heroAccent: "— India's free gamified learning platform for Class 3–5 kids.",
    heroSub:
      "India's first completely free platform for kids to learn CS, AI, and coding — narrated videos, a gamified CBSE-friendly syllabus, and lessons that teach what actually matters. Built for families in Bengaluru, Hyderabad, Delhi, Mumbai & Pune. ₹0 forever.",
    statsSub: "CBSE-friendly pacing · India",
    geoEmphasis: "India · CBSE-friendly",
    faqs: [
      ...baseFaqs,
      {
        question: "Is this aligned with school computer classes?",
        answer:
          "Topics complement CBSE/ICSE-style computer awareness for middle primary — binary, algorithms, safe internet, and logical thinking — without replacing your school's textbook.",
      },
      {
        question: "Can we share progress in parent WhatsApp groups?",
        answer:
          "Yes. The weekly email has module count, streak, and what’s next — easy to forward. The Mentr Junior Graduate certificate at 60/60 is shareable when your child completes all tracks.",
      },
    ],
  },
  uae: {
    geo: "uae",
    path: "/learn/uae",
    title: "Master Coding for Kids in UAE | Mentr Learn",
    metaDescription:
      "Free CS, AI & Math for Class 3–5 kids in the UAE — 60 modules, IGCSE-friendly foundations, Watch → Quiz → Play. Mentr Learn is ₹0. Enroll online.",
    keywords: [
      "coding kids UAE",
      "free coding course kids Dubai",
      "IGCSE coding kids",
      "AI for kids UAE",
      "online CS class 3 UAE",
      "Mentr Learn UAE",
    ],
    heroEyebrow: "UAE · Class 3–5 · Online",
    heroTitle: "Master CS, AI & Math",
    heroAccent: "— a free gamified learning platform for kids in the UAE.",
    heroSub:
      "The completely free platform for kids to learn CS, AI, and coding — narrated videos, a gamified IGCSE-friendly syllabus, and lessons that teach what actually matters. For families in Dubai, Abu Dhabi & Sharjah.",
    statsSub: "Online · Gulf time zones",
    geoEmphasis: "UAE · online",
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
          "Yes. Mentr Learn is built for video + quiz at home. No home tutor required for the Learn track itself.",
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
  if (segment === "india" || segment === "uae") return segment;
  return null;
}

export function learnPathFor(geo: LearnGeo): string {
  return learnCopyFor(geo).path;
}
