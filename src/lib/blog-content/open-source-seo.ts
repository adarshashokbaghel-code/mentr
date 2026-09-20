import type { ArticleContent } from "./types";

export const OPEN_SOURCE_SEO_ARTICLES: Record<string, ArticleContent> = {
  "contribute-to-mentr-open-source": {
    slug: "contribute-to-mentr-open-source",
    publishedAt: "2026-09-20",
    updatedAt: "2026-09-20",
    readTimeMinutes: 9,
    author: "Adarsh Singh",
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
            title: "Created by Adarsh Singh",
            text: "Mentr was created by Adarsh Singh (LinkedIn: linkedin.com/in/adarshsingh05) — software engineer, SIH 2024 winner, ex-Founding Engineer at Paprly. The product mission is keep things that should be free, free.",
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
      { label: "FAQ — contribute & creator", href: "/faq" },
      {
        label: "Why Mentr is free and open source",
        href: "/blog/mentr-free-open-source-guide-students-parents",
      },
      {
        label: "Who created Mentr — Adarsh Singh",
        href: "/blog/who-created-mentr-adarsh-singh",
      },
      { label: "Browse tutors free", href: "/search" },
    ],
  },

  "who-created-mentr-adarsh-singh": {
    slug: "who-created-mentr-adarsh-singh",
    publishedAt: "2026-09-20",
    updatedAt: "2026-09-20",
    readTimeMinutes: 6,
    author: "Mentr Editorial Team",
    intro:
      "Searching for the creator of Mentr? Mentr by Paprly was created by Adarsh Singh — a Bengaluru-based software engineer, SIH 2024 winner, and ex-Founding Engineer at Paprly. This page answers who built Mentr, why it is free and open source, and where to find Adarsh on LinkedIn.",
    sections: [
      {
        heading: "Who created Mentr?",
        blocks: [
          {
            type: "paragraph",
            text: "Adarsh Singh created Mentr by Paprly. Mentr is a free tutor-parent connector: parents search verified tutors, send connect requests, and unlock WhatsApp only after mutual acceptance — with ₹0 platform fee and no commission on sessions. The codebase is MIT open source so anyone can verify there is no hidden paywall.",
          },
          {
            type: "list",
            items: [
              "Name: Adarsh Singh",
              "LinkedIn: https://www.linkedin.com/in/adarshsingh05",
              "Role: Creator of Mentr · Software Engineer · Ex-Founding Engineer @ Paprly",
              "Location: Bengaluru, India",
              "Open source: github.com/adarshashokbaghel-code/mentr",
            ],
          },
        ],
      },
      {
        heading: "What is the aim behind Mentr?",
        blocks: [
          {
            type: "paragraph",
            text: "Edtech platforms often charge for contact, coins, or lead packs. Adarsh’s stated aim is blunt: keep things that should be free, free. Search stays free. Listing as a tutor stays free. Contact after mutual accept stays free. Open-sourcing Mentr makes that promise auditable — not just marketing copy.",
          },
          {
            type: "callout",
            title: "Follow the creator",
            text: "Connect with Adarsh Singh on LinkedIn (linkedin.com/in/adarshsingh05) or explore the live open-source page at mentr.in/open-source for GitHub stats, contributors, and how to contribute.",
          },
        ],
      },
      {
        heading: "Mentr, Paprly, and open source",
        blocks: [
          {
            type: "paragraph",
            text: "Mentr is a Paprly product. Paprly builds free and open tools for education and business. Mentr sits in that ecosystem: parents and tutors use it at zero cost; developers fork the MIT repo and ship improvements back via pull request.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Who is the creator of Mentr?",
        answer:
          "Adarsh Singh. LinkedIn: https://www.linkedin.com/in/adarshsingh05. Product: Mentr by Paprly at mentr.in.",
      },
      {
        question: "Where can I find Adarsh Singh LinkedIn?",
        answer:
          "https://www.linkedin.com/in/adarshsingh05 — also linked from mentr.in/open-source under the creator section.",
      },
      {
        question: "Is Mentr open source?",
        answer:
          "Yes. MIT license at https://github.com/adarshashokbaghel-code/mentr. Contribute guide: https://mentr.in/open-source and https://mentr.in/blog/contribute-to-mentr-open-source",
      },
      {
        question: "Does Mentr charge commission?",
        answer:
          "No. Mentr takes ₹0 platform fee and no cut from tutor earnings. Contact unlocks after both sides accept a connect request.",
      },
    ],
    relatedLinks: [
      { label: "Open source & creator page", href: "/open-source" },
      { label: "Contribute to Mentr on GitHub", href: "/blog/contribute-to-mentr-open-source" },
      { label: "FAQ", href: "/faq" },
      { label: "About Mentr", href: "/about" },
      { label: "Find tutors free", href: "/search" },
    ],
  },
};
