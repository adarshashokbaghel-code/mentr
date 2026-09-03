import type { BlogPillarId } from "./blog-posts";

export type BlogHeaderCopy = {
  title: string;
  subtitle: string;
  /** Short line under subtitle — topic hints, not a raw article count */
  hint?: string;
};

export const BLOG_HOME_HEADER: BlogHeaderCopy = {
  title: "Find tutors. Compare platforms. Prep for exams.",
  subtitle:
    "Fee guides for Bengaluru, honest UrbanPro comparisons, and JEE study plans — written for parents hiring tutors and faculty growing their practice.",
  hint: "Covers hiring, pricing, exam prep, student guides, and neighbourhood listings",
};

export const BLOG_PILLAR_HEADERS: Record<BlogPillarId, BlogHeaderCopy> = {
  "for-parents": {
    title: "Hiring a home tutor?",
    subtitle:
      "What to ask before you pay, typical fees in Bengaluru, red flags to watch for, and how to post a requirement tutors actually respond to.",
    hint: "Fees · verification · first session · posting requirements",
  },
  comparison: {
    title: "Mentr vs UrbanPro, agencies & the rest",
    subtitle:
      "Side-by-side on lead fees, commissions, and who pays — so you can pick a platform without surprise costs.",
    hint: "UrbanPro · Superprof · tuition agencies · free alternatives",
  },
  "exam-prep": {
    title: "JEE, NEET & board exams",
    subtitle:
      "Month-by-month JEE timelines, NEET Biology weightage, CBSE Class 10 revision plans, and how to pick a mentor for Class 11–12.",
    hint: "JEE Main 2027 · NEET Biology · CBSE boards · mentor checklist",
  },
  "for-tutors": {
    title: "Get students. Keep your fees.",
    subtitle:
      "How to start tutoring, what to charge in Bengaluru, write a profile parents pick, and find students without buying leads.",
    hint: "Pricing · profiles · free leads · freelance vs institute",
  },
  "trust-safety": {
    title: "Is this tutor safe for my child?",
    subtitle:
      "How Mentr verifies tutors, what to check before the first session, and rules for keeping online classes safe.",
    hint: "Verification · parent checklist · online session safety",
  },
  "career-mentoring": {
    title: "Mentors beyond school tuition",
    subtitle:
      "Finding a career mentor without cold DMs, the difference between coaching and tutoring, and where adults find skill coaches online.",
    hint: "Career mentors · skill coaching · mentorship vs tutoring",
  },
  "local-guides": {
    title: "Tutors by Bengaluru neighbourhood",
    subtitle:
      "Koramangala, Indiranagar, HSR Layout, Jayanagar, Whitefield — local fees, subjects covered, and how to book nearby.",
    hint: "Area guides · local fees · Koramangala · HSR · Jayanagar",
  },
  "for-students": {
    title: "Study smarter. Find help free.",
    subtitle:
      "Board exam plans, AI study tools, how to find tutors online, and getting the most from every session — written for Class 6–12 and JEE/NEET students.",
    hint: "AI study tools · CBSE Class 12 · free tutors · session prep",
  },
};

export function getBlogHeaderCopy(
  pillar: BlogPillarId | "all",
): BlogHeaderCopy {
  if (pillar === "all") return BLOG_HOME_HEADER;
  return BLOG_PILLAR_HEADERS[pillar];
}
