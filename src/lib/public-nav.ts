/**
 * Public information architecture for header/footer.
 * Application routes (dashboards, private board) stay out of primary public nav.
 */

import { LEARN_PUBLIC } from "@/lib/learn-flags";

export type PublicNavLink = {
  label: string;
  href: string;
  external?: boolean;
  description?: string;
};

export type PublicNavGroup = {
  id: string;
  label: string;
  /** Primary href when the group label itself is clicked (mobile / compact). */
  href?: string;
  links: PublicNavLink[];
};

export function getPublicNavGroups(): PublicNavGroup[] {
  const learn: PublicNavGroup | null = LEARN_PUBLIC
    ? {
        id: "learn",
        label: "Learn",
        href: "/learn",
        links: [
          {
            label: "Mentr Learn",
            href: "/learn",
            description: "Free coding & AI path for Class 3–5",
          },
          {
            label: "Full syllabus",
            href: "/learn/syllabus",
            description: "What students cover, module by module",
          },
          {
            label: "What is Mentr Learn?",
            href: "/blog/what-is-mentr-learn",
            description: "Learn by Mentr on mentr.in/learn explained",
          },
          {
            label: "Kids Learn guides",
            href: "/blog/category/kids-learn",
            description: "Articles for parents and young learners",
          },
        ],
      }
    : null;

  return [
    ...(learn ? [learn] : []),
    {
      id: "find",
      label: "Find",
      href: "/search",
      links: [
        {
          label: "Find tutors",
          href: "/search",
          description: "Verified tutors nearby or online",
        },
        {
          label: "Find mentors",
          href: "/search?kind=mentor",
          description: "Career, coding, and skill mentors",
        },
        {
          label: "How it works",
          href: "/how-it-works",
          description: "Search, requirements, and WhatsApp unlock",
        },
      ],
    },
    {
      id: "tools",
      label: "Tools",
      href: "/tools",
      links: [
        {
          label: "All tools",
          href: "/tools",
          description: "Teacher, student, and PDF utilities",
        },
        {
          label: "Teacher tools",
          href: "/tools#teachers",
          description: "Worksheets, papers, lesson plans",
        },
        {
          label: "Student tools",
          href: "/tools#students",
          description: "Timetables, CGPA, study helpers",
        },
        {
          label: "PDF tools",
          href: "/tools#pdf",
          description: "Merge, compress, organize — in browser",
        },
      ],
    },
    {
      id: "resources",
      label: "Resources",
      href: "/blog",
      links: [
        {
          label: "Blog & guides",
          href: "/blog",
          description: "Parent, student, and tutor articles",
        },
        {
          label: "FAQ",
          href: "/faq",
          description: "Fees, verification, and how connect works",
        },
        {
          label: "For parents",
          href: "/parents",
          description: "How parents use Mentr",
        },
        {
          label: "For tutors",
          href: "/for-faculty",
          description: "List free and get found",
        },
      ],
    },
    {
      id: "about",
      label: "About",
      href: "/about",
      links: [
        {
          label: "About Mentr",
          href: "/about",
          description: "What we build and why it stays free",
        },
        {
          label: "Open source",
          href: "/open-source",
          description: "MIT-licensed codebase",
        },
        {
          label: "Contact",
          href: "/contact",
          description: "Support, safety, and partnerships",
        },
        {
          label: "Privacy",
          href: "/privacy",
          description: "How we handle your data",
        },
      ],
    },
  ];
}

export function getFooterColumns(): Record<string, PublicNavLink[]> {
  return {
    Find: [
      { label: "Browse tutors", href: "/search" },
      { label: "Browse mentors", href: "/search?kind=mentor" },
      { label: "Find online tutors", href: "/find-online-tutors" },
      { label: "Find mentors near me", href: "/find-mentors-near-me" },
      { label: "How it works", href: "/how-it-works" },
      { label: "For parents", href: "/parents" },
    ],
    ...(LEARN_PUBLIC
      ? {
          Learn: [
            { label: "Mentr Learn", href: "/learn" },
            { label: "Enroll free", href: "/learn/start" },
            { label: "Full syllabus", href: "/learn/syllabus" },
            {
              label: "What is Mentr Learn?",
              href: "/blog/what-is-mentr-learn",
            },
            {
              label: "Kids coding guides",
              href: "/blog/category/kids-learn",
            },
          ],
        }
      : {}),
    Tools: [
      { label: "All free tools", href: "/tools" },
      { label: "Worksheet generator", href: "/tools/worksheet-generator" },
      {
        label: "Question paper generator",
        href: "/tools/question-paper-generator",
      },
      { label: "Study timetable", href: "/tools/study-timetable" },
      { label: "CGPA calculator", href: "/tools/cgpa-calculator" },
      { label: "Merge PDF", href: "/tools/pdf-merge" },
      { label: "Compress PDF", href: "/tools/pdf-compress" },
    ],
    Resources: [
      { label: "Blog & guides", href: "/blog" },
      { label: "FAQ", href: "/faq" },
      { label: "Online tutor jobs", href: "/online-tutor-jobs" },
      { label: "For faculty", href: "/for-faculty" },
      { label: "Pricing", href: "/pricing" },
    ],
    Company: [
      { label: "About", href: "/about" },
      { label: "Open source", href: "/open-source" },
      { label: "Editorial policy", href: "/editorial-policy" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Cookie policy", href: "/cookie-policy" },
    ],
    Account: [
      { label: "Log in", href: "/login" },
      { label: "Parent signup", href: "/parent/signup" },
      { label: "Become a tutor", href: "/faculty/signup" },
      { label: "Request a feature", href: "/request-feature" },
    ],
  };
}
