/**
 * Dino guide FAQ — static Q&A (no AI).
 * Keep this file in sync with docs/learn-dino-faq.md when features change.
 */

export type DinoFaqCta = {
  label: string;
  href: string;
};

export type DinoFaqNode = {
  id: string;
  question: string;
  answer: string;
  /** Show these as next clickable questions (5–6 max in UI). */
  next: string[];
  cta?: DinoFaqCta;
  /** Optional dino motion while this answer is shown. */
  action?: "handshake" | "wave" | "blink" | "peek" | "cheer";
};

export const DINO_FAQ_START = "what-is-learn";

export const DINO_FAQ: Record<string, DinoFaqNode> = {
  "what-is-learn": {
    id: "what-is-learn",
    question: "What is Learn by Mentr?",
    answer:
      "Mentr Learn is a free online path for Class 3–5 kids. They learn coding (CS), AI, and maths in short daily lessons — about 15 minutes. No tuition fee for the 60 modules.",
    next: ["how-it-works", "who-is-it-for", "is-it-free", "how-to-start", "what-is-mentr", "parent-email"],
    action: "wave",
    cta: { label: "Start free", href: "/learn/start" },
  },
  "how-it-works": {
    id: "how-it-works",
    question: "How does one lesson work?",
    answer:
      "Watch a short narrated video → answer 10 practice questions → play a small game. Every few lessons there is a Boss challenge. That loop is the same for CS, AI, and Math.",
    next: ["tracks", "how-long", "syllabus", "is-it-free", "how-to-start", "need-tutor"],
    action: "blink",
  },
  "who-is-it-for": {
    id: "who-is-it-for",
    question: "Who is it for?",
    answer:
      "Kids in Class 3, 4, or 5 (about ages 8–11). Videos are narrated so early readers can still follow. Parents create the account and get a weekly progress email.",
    next: ["how-to-start", "is-it-free", "how-it-works", "parent-email", "older-classes", "what-is-mentr"],
    action: "handshake",
  },
  "is-it-free": {
    id: "is-it-free",
    question: "Is it really free?",
    answer:
      "Yes. All 60 Class 3–5 modules are free — no locked chapters and no trial timer. Mentr earns from optional tutor bookings later, not from selling Learn lessons.",
    next: ["how-to-start", "need-tutor", "what-is-mentr", "how-it-works", "syllabus", "parent-email"],
    action: "cheer",
    cta: { label: "Create free account", href: "/learn/start" },
  },
  "how-to-start": {
    id: "how-to-start",
    question: "How do we start?",
    answer:
      "Open the course page, enroll for free, then start Module A1 in the Learn app. Parents can review the syllabus anytime — no paid plan for Class 3–5.",
    next: ["is-it-free", "parent-email", "how-it-works", "tracks", "need-tutor", "syllabus"],
    action: "handshake",
    cta: { label: "Enroll free", href: "/learn/start" },
  },
  "what-is-mentr": {
    id: "what-is-mentr",
    question: "What is Mentr?",
    answer:
      "Mentr is the platform: find verified tutors and mentors, plus free Mentr Learn for Class 3–5. Learn builds basics at home; tutors are optional when you want live help.",
    next: ["what-is-learn", "need-tutor", "how-to-start", "is-it-free", "find-tutor", "parent-email"],
    action: "wave",
    cta: { label: "Explore Mentr", href: "/" },
  },
  tracks: {
    id: "tracks",
    question: "What will my child learn?",
    answer:
      "Three tracks · 20 modules each: Computer Science (how computers work), AI (patterns & smart systems), and Math for CS (shapes, numbers, logic). Same syllabus for Class 3–5.",
    next: ["how-it-works", "syllabus", "how-long", "is-it-free", "how-to-start", "who-is-it-for"],
    action: "peek",
    cta: { label: "See syllabus", href: "/learn#curriculum" },
  },
  "how-long": {
    id: "how-long",
    question: "How long each day?",
    answer:
      "About 15 minutes. One video, 10 questions, then a short play. No live class to catch — they can pause and continue another day.",
    next: ["how-it-works", "parent-email", "how-to-start", "tracks", "is-it-free", "need-tutor"],
    action: "blink",
  },
  "parent-email": {
    id: "parent-email",
    question: "How do parents stay updated?",
    answer:
      "You get a weekly email: modules done, streak, and what’s next. No extra app to check every day. Progress stays on the parent account.",
    next: ["how-to-start", "is-it-free", "how-it-works", "leaderboard", "syllabus", "what-is-mentr"],
    action: "wave",
  },
  "need-tutor": {
    id: "need-tutor",
    question: "Do we need a tutor too?",
    answer:
      "Not for Learn — it’s self-paced and free. Many families use Learn first, then book a Mentr tutor later for school or exams if they want live help.",
    next: ["find-tutor", "what-is-mentr", "how-to-start", "is-it-free", "how-it-works", "who-is-it-for"],
    action: "handshake",
    cta: { label: "Find tutors", href: "/search" },
  },
  "find-tutor": {
    id: "find-tutor",
    question: "How do I find a tutor on Mentr?",
    answer:
      "Open Find tutors, filter by subject and city (or online), shortlist, and connect. Tutor bookings are separate from free Learn lessons.",
    next: ["need-tutor", "what-is-mentr", "how-to-start", "is-it-free", "parent-email", "what-is-learn"],
    action: "wave",
    cta: { label: "Browse tutors", href: "/search" },
  },
  syllabus: {
    id: "syllabus",
    question: "Can I see the full syllabus?",
    answer:
      "Yes. The syllabus page lists all 60 modules in parent-friendly language — what they watch, practise, and the check after each lesson. You can also download a PDF.",
    next: ["tracks", "how-it-works", "how-to-start", "is-it-free", "who-is-it-for", "parent-email"],
    action: "peek",
    cta: { label: "Open syllabus", href: "/learn/syllabus" },
  },
  leaderboard: {
    id: "leaderboard",
    question: "Is there a leaderboard?",
    answer:
      "Yes, optional. Same class cohort, first name + avatar only. Parents opt in — it’s off by default so kids aren’t pushed into rankings.",
    next: ["parent-email", "how-it-works", "is-it-free", "how-to-start", "who-is-it-for", "what-is-learn"],
    action: "cheer",
  },
  "older-classes": {
    id: "older-classes",
    question: "What about Class 6+?",
    answer:
      "Class 6–8 and older tracks are planned next. Join free Class 3–5 now and we’ll email you when older cohorts open.",
    next: ["who-is-it-for", "how-to-start", "what-is-learn", "is-it-free", "what-is-mentr", "parent-email"],
    action: "blink",
    cta: { label: "Join free", href: "/learn/start" },
  },
};

export function dinoFaqNode(id: string): DinoFaqNode {
  return DINO_FAQ[id] ?? DINO_FAQ[DINO_FAQ_START];
}

export function dinoFaqNext(id: string): DinoFaqNode[] {
  return dinoFaqNode(id).next.map((nid) => dinoFaqNode(nid)).slice(0, 6);
}
