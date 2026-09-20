import { LEARN_MODULE_COUNT, LEARN_TRACKS } from "@/lib/learn-curriculum";
import { absoluteUrl, SITE_BRAND, SITE_NAME } from "@/lib/seo";

/** Stable facts for meta, schema, blogs, and llms.txt — keep in sync. */
export const LEARN_FACT_SHEET = {
  productName: "Mentr Learn",
  courseName: "Mentr Starter",
  tagline: "Class 3–5 · Computer Science, AI & Math",
  modules: LEARN_MODULE_COUNT,
  tracks: 3,
  level: "Class 3–5",
  ages: "roughly ages 8–11",
  priceInr: 0,
  listPriceInr: 999,
  currency: "INR",
  lessonLoop: "Watch → Quiz → Build → Practice",
  dailyMinutes: 15,
  access: "Lifetime for Class 3–5 free track",
  enrollPath: "/learn/start",
  hubPath: "/learn",
  syllabusPath: "/learn/syllabus",
  oneLiner:
    "Mentr Learn (mentr.in/learn) — also called Mentr Starter — is a free, self-paced Class 3–5 foundation in computer science, AI literacy, and math-for-coding: 60-module syllabus, narrated lessons, Build Arena, Practice & POTD, ₹0 forever.",
  notIncluded:
    "Typed Python/HTML, hardware insides, competitive coding, adult AI fear content, Class 6+ algebra-first units.",
} as const;

export const LEARN_START_KEYWORDS = [
  "Mentr Learn enroll",
  "Mentr Learn",
  "mentr.in/learn/start",
  "Learn by Mentr enroll",
  "enroll Mentr Learn free",
  "free coding course Class 3-5",
  "coding for kids Class 5 free",
  "free coding for Class 3-5",
  "free computer science for kids India",
  "AI for kids free course",
  "block coding for kids",
  "Build Arena kids coding",
  "Mentr Starter",
  "₹0 coding for kids",
];

export const LEARN_SYLLABUS_KEYWORDS = [
  "Mentr Learn syllabus",
  "mentr.in/learn/syllabus",
  "Class 3-5 coding syllabus",
  "CS AI Math kids curriculum",
  "parent coding syllabus PDF",
  "computer science Class 3-5 India",
  "free coding syllabus Class 3-5",
];

export const LEARN_START_FAQS = [
  {
    question: "How do I enroll in Mentr Learn for free?",
    answer:
      "Open /learn/start, tap Enroll for free, verify the parent email with OTP, then open the learning app. No credit card. List price ₹999 is charged as ₹0 for Class 3–5.",
  },
  {
    question: "Who can enroll — parent or tutor?",
    answer:
      "Only parent accounts. Tutors signed in as faculty are asked to log out and continue as a parent so the child can use the learning app. Teachers and centres can share the enroll link with parents.",
  },
  {
    question: "What does my child get after enroll?",
    answer:
      "Free access to the Class 3–5 learning app: narrated lessons as modules go live, quizzes, Build Arena, Practice, Problem of the Day, and the published 60-module syllabus. Parent account saves progress. Junior Graduate finish line maps to completing the full path.",
  },
  {
    question: "What is available today vs still rolling out?",
    answer:
      "Today: free enroll, quizzes, Build Arena, Practice, POTD, streaks/XP, and narrated lessons as modules ship. Unit challenges and weekly parent email summaries are rolling out. The full 60-module map is already published on the syllabus page.",
  },
  {
    question: "Is there a receipt?",
    answer:
      "Yes. After enroll you can download an enrollment receipt showing course price ₹999, tax ₹0, and amount paid ₹0.",
  },
];

export const LEARN_SYLLABUS_FAQS = [
  {
    question: "What subjects are in the Class 3–5 syllabus?",
    answer:
      "Three tracks of 20 modules each: Computer Science basics, AI literacy for kids, and Math for CS (patterns, logic, grids, turns). Total 60 modules.",
  },
  {
    question: "How does each lesson work?",
    answer:
      "Watch a short narrated video, answer practice questions (Quiz), then use Build Arena and Practice / POTD to reinforce. Unit challenges continue to roll out across the 60-module syllabus.",
  },
  {
    question: "Is every video live today?",
    answer:
      "The full 60-module syllabus is published for parents. Narrated videos unlock as modules ship; Build Arena, Practice, and POTD are available in the app after enroll so kids always have something to do.",
  },
  {
    question: "Can I download the syllabus?",
    answer:
      "Yes. Use the parent syllabus page and the syllabus PDF download linked from Learn and the site footer.",
  },
  {
    question: "What is not in this syllabus?",
    answer: LEARN_FACT_SHEET.notIncluded,
  },
];

export function learnCourseJsonLd(opts?: {
  description?: string;
  url?: string;
}) {
  const description = opts?.description ?? LEARN_FACT_SHEET.oneLiner;
  const url = absoluteUrl(opts?.url ?? LEARN_FACT_SHEET.hubPath);

  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `${LEARN_FACT_SHEET.productName} — ${LEARN_FACT_SHEET.tagline}`,
    alternateName: LEARN_FACT_SHEET.courseName,
    description,
    url,
    provider: {
      "@type": "Organization",
      name: SITE_BRAND,
      url: absoluteUrl("/"),
      parentOrganization: {
        "@type": "Organization",
        name: "Paprly",
        url: "https://www.paprly.in",
      },
    },
    educationalLevel: LEARN_FACT_SHEET.level,
    about: [
      "Computer Science for kids",
      "AI literacy for kids",
      "Math for coding",
      "Block coding",
    ],
    teaches: LEARN_TRACKS.map((t) => t.label),
    numberOfCredits: LEARN_FACT_SHEET.modules,
    timeRequired: "P3M",
    isAccessibleForFree: true,
    inLanguage: "en",
    offers: {
      "@type": "Offer",
      price: String(LEARN_FACT_SHEET.priceInr),
      priceCurrency: LEARN_FACT_SHEET.currency,
      availability: "https://schema.org/InStock",
      url: absoluteUrl(LEARN_FACT_SHEET.enrollPath),
      category: "Free",
    },
    hasCourseInstance: LEARN_TRACKS.map((t) => ({
      "@type": "CourseInstance",
      name: t.label,
      courseMode: "online",
      courseWorkload: "PT4H30M",
      instructor: {
        "@type": "Organization",
        name: SITE_NAME,
      },
    })),
  };
}

export function learnWebPageJsonLd(opts: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.path),
    isPartOf: {
      "@type": "WebSite",
      name: SITE_BRAND,
      url: absoluteUrl("/"),
    },
    about: {
      "@type": "Thing",
      name: LEARN_FACT_SHEET.productName,
      description: LEARN_FACT_SHEET.oneLiner,
    },
  };
}
