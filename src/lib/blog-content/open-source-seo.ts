import type { ArticleContent } from "./types";

export const OPEN_SOURCE_SEO_ARTICLES: Record<string, ArticleContent> = {
  "contribute-to-mentr-open-source": {
    slug: "contribute-to-mentr-open-source",
    publishedAt: "2026-09-20",
    updatedAt: "2026-09-20",
    readTimeMinutes: 9,
    author: "Mentr Editorial Team",
    intro:
      "Looking for a real open-source project to contribute to — not a toy TODO app? Mentr is a production MIT-licensed tutor-parent marketplace (Next.js, Express, MongoDB) used by parents and tutors worldwide. This guide explains how developers can fork, ship pull requests, find good first issues, and why edtech that stays free needs contributors.",
    sections: [
      {
        heading: "Why contribute to an open-source tutoring platform?",
        blocks: [
          {
            type: "paragraph",
            text: "Most edtech products hide fees until you are locked in. Mentr publishes the opposite promise in public code: ₹0 platform fee for parents and faculty, WhatsApp unlock only after mutual acceptance, and no commission on sessions. When you contribute, you improve a product people actually use — search, auth, connections, notifications, SEO landings — while keeping education infrastructure free.",
          },
          {
            type: "list",
            items: [
              "Stack: Next.js App Router, React, TypeScript, Express 5, MongoDB, Tailwind CSS",
              "License: MIT — fork, audit, deploy for your community",
              "Repo: github.com/adarshashokbaghel-code/mentr",
              "Contributor guide: CONTRIBUTING.md in the repository root",
              "Product surface: mentr.in/open-source (live GitHub stats and roadmap)",
            ],
          },
          {
            type: "callout",
            title: "Good for newcomers",
            text: "Issues labeled good first issue and help wanted are scoped for first-time contributors. Keep PRs focused — one fix or feature per pull request — and run npm run lint plus npm run build before you open the PR.",
          },
        ],
      },
      {
        heading: "How to contribute in five steps",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Fork github.com/adarshashokbaghel-code/mentr and create a branch from main",
              "npm install, copy .env.example, run npm run dev (Next.js + Express together)",
              "Pick a focused change — bug fix, docs, accessibility, SEO page, or UI polish",
              "Run npm run lint and npm run build",
              "Open a pull request describing what changed and why; link related issues",
            ],
          },
          {
            type: "paragraph",
            text: "Useful starter areas: loading and error states, search card UX, FAQ and blog SEO pages, accessibility (skip links, focus), CONTRIBUTING and CI docs, and small Express API hardening. Avoid dumping secrets into PRs — never commit .env files.",
          },
        ],
      },
      {
        heading: "What open-source developers get from Mentr",
        blocks: [
          {
            type: "paragraph",
            text: "You practise a full-stack product under a real brand (Mentr by Paprly), with public review and merge history. Schools and parents can audit that there is no hidden paywall engine — your contributions reinforce that trust. If you want an open-source edtech portfolio piece, merged PRs on Mentr are concrete proof.",
          },
          {
            type: "callout",
            title: "Built by Paprly",
            text: "Mentr is a Paprly product. The mission is simple: keep things that should be free, free — search, connect, and WhatsApp after mutual accept, with no commission engine.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Where is the Mentr open source repository?",
        answer:
          "https://github.com/adarshashokbaghel-code/mentr — MIT licensed. Product overview and live contributor stats: https://mentr.in/open-source",
      },
      {
        question: "Do I need paid tools to contribute?",
        answer:
          "No. Local setup uses free tooling (Node, npm, MongoDB). Optional GITHUB_TOKEN only raises API rate limits for the open-source page stats — not required to contribute.",
      },
      {
        question: "Who reviews pull requests?",
        answer:
          "Maintainers on the Mentr / Paprly team review PRs. Keep changes small, responsive to feedback, and linked to issues when possible.",
      },
      {
        question: "Is Mentr a good first open source project?",
        answer:
          "Yes if you know TypeScript or React basics. Start with docs, UI polish, or good first issue labels before large features.",
      },
    ],
    relatedLinks: [
      { label: "Mentr open source page", href: "/open-source" },
      { label: "FAQ", href: "/faq" },
      {
        label: "Why Mentr is free and open source",
        href: "/blog/mentr-free-open-source-guide-students-parents",
      },
      { label: "Browse tutors free", href: "/search" },
    ],
  },
};
