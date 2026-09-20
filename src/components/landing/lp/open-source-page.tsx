"use client";

import {
  FacultyActionLink,
  ParentActionLink,
} from "@/components/auth/role-guard-link";
import { Button } from "@/components/ui/button";
import { BrowserFrame } from "@/components/ui/browser-frame";
import { ProductHuntBadges, ProductHuntFeaturedBadge } from "@/components/ui/product-hunt-badge";
import { PaprlyWordmark } from "@/components/ui/paprly-wordmark";
import {
  CREATOR_LINKEDIN_URL,
  GITHUB_REPO_URL,
  GLOBAL_REACH_LINE,
  LINKEDIN_URL,
} from "@/lib/seo";
import {
  formatGithubRelativeTime,
  type GithubRepoStats,
} from "@/lib/github-repo";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  BookOpen,
  Bug,
  Code2,
  ExternalLink,
  GitBranch,
  GitFork,
  GitPullRequest,
  Globe,
  HeartHandshake,
  IndianRupee,
  Lock,
  Scale,
  ShieldCheck,
  Sparkles,
  Star,
  Terminal,
  Users,
  Workflow,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  hardShadow,
  hardShadowSm,
  LpBadge,
  LpBlob,
  LpFinalCta,
  LpGridBg,
  LpLiveDot,
  LpPill,
  LpSectionDivider,
  LpStatsBand,
  LpStepTimeline,
  LpTestimonialCard,
  SectionHeader,
} from "./shared";

const GITHUB_ISSUES_URL = `${GITHUB_REPO_URL}/issues`;
const GITHUB_CONTRIBUTING_URL = `${GITHUB_REPO_URL}/blob/main/CONTRIBUTING.md`;

const stats = [
  {
    value: "100+",
    label: "Satisfied parents",
    tint: "bg-lavender",
    icon: Users,
    sub: "Worldwide connections",
  },
  {
    value: "₹0",
    label: "Platform cut",
    tint: "bg-butter",
    icon: IndianRupee,
    sub: "100% to faculty",
  },
  {
    value: "MIT",
    label: "Open source",
    tint: "bg-sage-wash",
    icon: Scale,
    sub: "Free to fork & use",
  },
  {
    value: "100+",
    label: "Verified tutors",
    tint: "bg-coral-wash",
    icon: ShieldCheck,
    sub: "Local & online",
  },
];

const whyOpenSource = [
  {
    icon: Lock,
    title: "Transparent by design",
    body: "Parents and tutors can see exactly how Mentr works — no hidden algorithms, no surprise fees buried in fine print.",
  },
  {
    icon: HeartHandshake,
    title: "Community-built trust",
    body: "Anyone can audit our code, suggest fixes, or adapt Mentr for their city. Open source keeps us accountable to the mission.",
  },
  {
    icon: Globe,
    title: "Built for the world",
    body: "Fork Mentr, deploy locally, or contribute features for your region. The platform is designed to scale globally without a toll booth.",
  },
  {
    icon: Sparkles,
    title: "Zero cut, forever",
    body: "Our business model isn't commission — it's building the best free connector. Open source ensures that promise can't be quietly reversed.",
  },
];

const contributeSteps = [
  {
    title: "Fork the repository",
    desc: "Clone github.com/adarshashokbaghel-code/mentr and create a branch from main.",
    icon: GitBranch,
  },
  {
    title: "Set up locally",
    desc: "npm install, copy .env.example, run npm run dev — Next.js frontend + Express API together.",
    icon: Terminal,
  },
  {
    title: "Make focused changes",
    desc: "One fix or feature per PR. Follow existing patterns in src/ and server/.",
    icon: Code2,
  },
  {
    title: "Lint & build",
    desc: "Run npm run lint and npm run build before opening your pull request.",
    icon: Workflow,
  },
  {
    title: "Open a pull request",
    desc: "Describe what changed and why. Link related issues. Be responsive to review.",
    icon: GitPullRequest,
  },
];

const techStack = [
  { name: "Next.js 16", role: "App Router frontend" },
  { name: "React 19", role: "UI components" },
  { name: "Express 5", role: "REST API server" },
  { name: "MongoDB", role: "Profiles & connections" },
  { name: "Tailwind CSS 4", role: "Design system" },
  { name: "TypeScript", role: "End-to-end typing" },
];

/** Shipped platform capabilities — mirrored in README.md */
const platformFeatures = [
  {
    icon: Globe,
    title: "Guest tutor browse",
    body: "Parents explore /search and map view without login. Sign-in only to connect on WhatsApp.",
  },
  {
    icon: Sparkles,
    title: "Notifications + shortlist",
    body: "Parent bell + email alerts; save up to 3 tutors; compare fees and slots side-by-side.",
  },
  {
    icon: Workflow,
    title: "Hiring checklist",
    body: "Dashboard progress: Browse → Shortlist → Trial → Connect → Log first session.",
  },
  {
    icon: HeartHandshake,
    title: "Pitch digest & share links",
    body: "Instant + daily pitch emails; share private /looking/{token} posts in family WhatsApp groups.",
  },
];

const roadmapItems = [
  { label: "Child profile + exam countdown", status: "Planned" as const },
  { label: "Session check-in / attendance", status: "Planned" as const },
  { label: "SEO compare landing pages", status: "Phase 2" as const },
  { label: "Lighter notification polling", status: "Enhancement" as const },
];

const testimonials = [
  {
    quote:
      "Finally a platform where I keep every rupee I earn. No coins, no lead packs — just parents who actually want a tutor.",
    role: "Physics tutor · Bengaluru",
    tint: "bg-sage-wash",
  },
  {
    quote:
      "We found a verified maths tutor in under a minute. No agent called us back with a markup — direct on WhatsApp.",
    role: "Parent · Indiranagar",
    tint: "bg-lavender",
  },
  {
    quote:
      "Knowing Mentr is open source gave us confidence. Our school can see there's no hidden commission engine.",
    role: "Parent · Dubai",
    tint: "bg-coral-wash",
  },
];

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 114.127 0 2.063 2.063 0 01-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function SocialLink({
  href,
  label,
  children,
  className,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={cn(
        "inline-flex h-12 w-12 items-center justify-center rounded-xl border-2 border-ink bg-white text-ink transition-all duration-200 hover:-translate-y-0.5 hover:bg-cream",
        hardShadowSm,
        className,
      )}
    >
      {children}
    </a>
  );
}

function RepoLiveCard({ stats }: { stats: GithubRepoStats | null }) {
  if (!stats) {
    return <RepoMock />;
  }

  return (
    <BrowserFrame
      url="github.com / mentr"
      headerClassName="bg-ink text-white"
      className="border-2 border-ink"
    >
      <div className="bg-[#0d1117] p-4 text-left text-[11px] leading-relaxed text-[#c9d1d9] sm:p-5 sm:text-xs">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <GitHubIcon className="h-4 w-4 shrink-0 text-white" />
          <a
            href={stats.url}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate font-mono font-bold text-white hover:text-butter"
          >
            {stats.fullName}
          </a>
          <span className="ml-auto shrink-0 rounded-md border border-sage/40 bg-sage/20 px-2 py-0.5 text-[10px] font-bold text-sage">
            Public
          </span>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <a
            href={stats.creator.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 transition hover:border-white/25"
          >
            <Image
              src={stats.creator.avatarUrl}
              alt=""
              width={28}
              height={28}
              className="rounded-full"
              unoptimized
            />
            <div className="min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-wide text-white/45">
                Creator
              </p>
              <p className="truncate font-bold text-butter">
                @{stats.creator.login}
              </p>
            </div>
          </a>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-white/45">
              {stats.license ?? "MIT"} · Updated{" "}
              {formatGithubRelativeTime(stats.pushedAt)}
            </p>
            <p className="mt-0.5 line-clamp-2 text-white/70">
              {stats.description ||
                "Free tutor-parent connector — 100% open source, zero commission."}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { label: "Stars", value: String(stats.stars), icon: Star },
            { label: "Forks", value: String(stats.forks), icon: GitFork },
            {
              label: "PRs merged",
              value: String(stats.mergedPrCount),
              icon: GitPullRequest,
            },
            {
              label: "Contributors",
              value: String(Math.max(stats.contributorCount, stats.contributors.length)),
              icon: Users,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-2"
            >
              <p className="inline-flex items-center gap-1 text-[10px] text-white/50">
                <item.icon className="h-3 w-3" />
                {item.label}
              </p>
              <p className="mt-0.5 text-lg font-bold tabular-nums text-butter">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {stats.lastMergedPr && (
          <a
            href={stats.lastMergedPr.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 block rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 transition hover:border-coral/40 hover:bg-white/[0.07]"
          >
            <p className="text-[10px] font-bold uppercase tracking-wide text-sage">
              Last merged PR
            </p>
            <p className="mt-1 line-clamp-2 font-semibold text-white">
              #{stats.lastMergedPr.number} · {stats.lastMergedPr.title}
            </p>
            <p className="mt-1 text-[10px] text-white/55">
              by @{stats.lastMergedPr.authorDisplayName} ·{" "}
              {formatGithubRelativeTime(stats.lastMergedPr.mergedAt)}
            </p>
          </a>
        )}

        {stats.contributors.length > 0 && (
          <div className="mt-3">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-white/45">
              Live contributors
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {stats.contributors.slice(0, 8).map((c) => {
                const avatar = (
                  <Image
                    src={c.avatarUrl}
                    alt={c.displayName}
                    width={32}
                    height={32}
                    className={cn(
                      "rounded-full ring-2 ring-[#0d1117]",
                      c.linkable && "transition group-hover:ring-butter",
                    )}
                    unoptimized
                  />
                );
                return c.linkable ? (
                  <a
                    key={c.login}
                    href={c.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`@${c.displayName} · ${c.contributions} commits`}
                    className="group relative"
                  >
                    {avatar}
                  </a>
                ) : (
                  <span
                    key={c.login}
                    title={c.displayName}
                    className="relative cursor-default"
                  >
                    {avatar}
                  </span>
                );
              })}
              <a
                href={`${stats.url}/graphs/contributors`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-white/15 px-2 py-1 text-[10px] font-semibold text-white/70 hover:text-butter"
              >
                View all
              </a>
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href={stats.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-white/10 px-2 py-1 text-[10px] font-semibold hover:bg-white/15"
          >
            ⭐ Star on GitHub
          </a>
          <span className="rounded-md bg-coral/20 px-2 py-1 text-[10px] text-coral">
            {stats.openIssues} open issues
          </span>
          <span className="rounded-md bg-sage/20 px-2 py-1 text-[10px] text-sage">
            help wanted
          </span>
        </div>
      </div>
    </BrowserFrame>
  );
}

function RepoMock() {
  return (
    <BrowserFrame
      url="github.com / mentr"
      headerClassName="bg-ink text-white"
      className="border-2 border-ink"
    >
      <div className="bg-[#0d1117] p-4 text-left font-mono text-[11px] leading-relaxed text-[#c9d1d9] sm:p-5 sm:text-xs">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <GitHubIcon className="h-4 w-4 text-white" />
          <span className="font-bold text-white">adarshashokbaghel-code/mentr</span>
          <span className="ml-auto rounded-md border border-sage/40 bg-sage/20 px-2 py-0.5 text-[10px] font-bold text-sage">
            Public
          </span>
        </div>
        <div className="mt-3 space-y-1.5">
          <p>
            <span className="text-coral">MIT License</span> · TypeScript · Next.js
          </p>
          <p className="text-white/60">
            Free tutor-parent connector — 100% open source, zero commission.
          </p>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            { label: "src/", desc: "Next.js app" },
            { label: "server/", desc: "Express API" },
            { label: "scripts/", desc: "Seeds & SEO" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-white/10 bg-white/5 px-2 py-2"
            >
              <p className="font-bold text-butter">{item.label}</p>
              <p className="text-[10px] text-white/50">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-md bg-white/10 px-2 py-1 text-[10px]">
            ⭐ Star on GitHub
          </span>
          <span className="rounded-md bg-coral/20 px-2 py-1 text-[10px] text-coral">
            good first issue
          </span>
          <span className="rounded-md bg-sage/20 px-2 py-1 text-[10px] text-sage">
            help wanted
          </span>
        </div>
      </div>
    </BrowserFrame>
  );
}

function GithubCommunitySection({ stats }: { stats: GithubRepoStats }) {
  const maxCommits = Math.max(
    1,
    ...stats.contributors.map((c) => c.contributions),
  );

  return (
    <section className="relative border-b border-hairline bg-white py-12 sm:py-20 lg:py-24">
      <LpGridBg className="opacity-20" />
      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            align="left"
            eyebrow="Live from GitHub"
            title="Contributors &"
            accent="merged PRs"
            description={`Public activity on ${stats.fullName} — ranked by commits, with merged pull requests and recent merges. Refreshes hourly.`}
          />
          <div className="flex flex-wrap gap-2 lg:justify-end">
            <a href={stats.url} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" className="gap-2">
                <GitHubIcon className="h-4 w-4" />
                Open repository
                <ExternalLink className="h-3.5 w-3.5 opacity-70" />
              </Button>
            </a>
            <a
              href={`${stats.url}/graphs/contributors`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="secondary" className="gap-2">
                <Users className="h-4 w-4" />
                Full graph
              </Button>
            </a>
          </div>
        </div>

        {/* Big metrics */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { label: "Stars", value: stats.stars, icon: Star, tint: "bg-butter" },
            { label: "Forks", value: stats.forks, icon: GitFork, tint: "bg-lavender" },
            {
              label: "PRs merged",
              value: stats.mergedPrCount,
              icon: GitPullRequest,
              tint: "bg-sage-wash",
            },
            {
              label: "Contributors",
              value: stats.contributorCount,
              icon: Users,
              tint: "bg-coral-wash",
            },
            {
              label: "Commits",
              value: stats.totalCommits,
              icon: GitBranch,
              tint: "bg-cream-band",
            },
            {
              label: "Open issues",
              value: stats.openIssues,
              icon: Bug,
              tint: "bg-white",
            },
          ].map((m) => (
            <div
              key={m.label}
              className={cn(
                "rounded-2xl border-2 border-ink p-4",
                m.tint,
                hardShadowSm,
              )}
            >
              <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-muted">
                <m.icon className="h-3.5 w-3.5" />
                {m.label}
              </p>
              <p className="mt-2 text-3xl font-bold tabular-nums tracking-tight text-ink">
                {m.value}
              </p>
            </div>
          ))}
        </div>

        {/* Creator strip */}
        <a
          href={stats.creator.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "mt-6 flex flex-wrap items-center gap-4 rounded-2xl border-2 border-ink bg-ink p-4 text-white transition hover:-translate-y-0.5 sm:p-5",
            hardShadowSm,
          )}
        >
          <Image
            src={stats.creator.avatarUrl}
            alt={stats.creator.login}
            width={56}
            height={56}
            className="rounded-full ring-2 ring-butter"
            unoptimized
          />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-wide text-butter">
              Repository creator
            </p>
            <p className="mt-0.5 truncate text-xl font-bold">
              @{stats.creator.login}
            </p>
            <p className="mt-1 text-sm text-white/60">
              {stats.license ?? "MIT"} · Updated{" "}
              {formatGithubRelativeTime(stats.pushedAt)}
              {stats.lastMergedPr
                ? ` · Last merge #${stats.lastMergedPr.number}`
                : ""}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-sage/40 bg-sage/20 px-3 py-1 text-xs font-bold text-sage">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sage" />
            Live
          </span>
        </a>

        <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Ranked contributors */}
          <div
            className={cn(
              "rounded-2xl border-2 border-ink bg-cream/40 p-4 sm:p-6",
              hardShadowSm,
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-bold text-ink">Contributor ranking</h3>
              <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                by commits
              </span>
            </div>
            <ul className="mt-5 space-y-3">
              {stats.contributors.map((c) => {
                const body = (
                  <>
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-ink text-xs font-bold",
                          c.rank === 1
                            ? "bg-butter"
                            : c.rank === 2
                              ? "bg-lavender"
                              : c.rank === 3
                                ? "bg-sage-wash"
                                : "bg-cream-band text-muted",
                        )}
                      >
                        #{c.rank}
                      </span>
                      <Image
                        src={c.avatarUrl}
                        alt=""
                        width={40}
                        height={40}
                        className="rounded-full"
                        unoptimized
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <p
                            className={cn(
                              "truncate font-bold text-ink",
                              c.linkable && "group-hover:text-coral",
                            )}
                          >
                            {c.displayName}
                          </p>
                          {c.isCreator && (
                            <span className="rounded bg-ink px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-butter">
                              Creator
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-muted">
                          {c.contributions} commit
                          {c.contributions === 1 ? "" : "s"}
                          {" · "}
                          {c.mergedPrs} merged PR
                          {c.mergedPrs === 1 ? "" : "s"}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-cream-band">
                      <div
                        className="h-full rounded-full bg-coral"
                        style={{
                          width: `${Math.max(
                            6,
                            Math.round((c.contributions / maxCommits) * 100),
                          )}%`,
                        }}
                      />
                    </div>
                  </>
                );

                return (
                  <li key={c.login}>
                    {c.linkable ? (
                      <a
                        href={c.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block rounded-xl border border-hairline bg-white p-3 transition hover:border-ink/30 hover:shadow-xs sm:p-3.5"
                      >
                        {body}
                      </a>
                    ) : (
                      <div className="rounded-xl border border-hairline bg-white p-3 sm:p-3.5">
                        {body}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Recent merged PRs */}
          <div
            className={cn(
              "rounded-2xl border-2 border-ink bg-white p-4 sm:p-6",
              hardShadowSm,
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-bold text-ink">Recent merged PRs</h3>
              <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                {stats.mergedPrCount} total
              </span>
            </div>
            <ul className="mt-5 space-y-2.5">
              {stats.recentMergedPrs.length === 0 ? (
                <li className="rounded-xl border border-dashed border-hairline px-4 py-8 text-center text-sm text-muted">
                  No merged pull requests yet.
                </li>
              ) : (
                stats.recentMergedPrs.map((pr) => (
                  <li key={pr.number}>
                    <a
                      href={pr.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex gap-3 rounded-xl border border-hairline bg-cream/50 p-3 transition hover:border-ink/25 hover:bg-cream sm:p-3.5"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sage-wash text-xs font-bold text-sage">
                        #{pr.number}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-semibold text-ink">
                          {pr.title}
                        </p>
                        <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted">
                          <span className="inline-flex items-center gap-1 font-semibold text-ink/80">
                            {pr.authorAvatarUrl ? (
                              <Image
                                src={pr.authorAvatarUrl}
                                alt=""
                                width={14}
                                height={14}
                                className="rounded-full"
                                unoptimized
                              />
                            ) : null}
                            @{pr.authorDisplayName}
                          </span>
                          <span>·</span>
                          <span>{formatGithubRelativeTime(pr.mergedAt)}</span>
                        </p>
                      </div>
                      <ExternalLink className="mt-1 h-3.5 w-3.5 shrink-0 text-muted" />
                    </a>
                  </li>
                ))
              )}
            </ul>
            <a
              href={`${stats.url}/pulls?q=is%3Apr+is%3Amerged`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-coral hover:underline"
            >
              View all merged PRs
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function OpenSourceLanding({
  githubStats = null,
}: {
  githubStats?: GithubRepoStats | null;
}) {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <main>
      {/* Hero */}
      <section className="lp-cloth-texture relative overflow-hidden border-b border-hairline">
        <LpGridBg className="opacity-25" />
        <LpBlob color="rgba(47,158,110,0.15)" size={340} className="-left-24 -top-16" />
        <LpBlob color="rgba(255,154,77,0.12)" size={300} className="-right-20 bottom-0" />

        <div className="relative mx-auto max-w-[1400px] px-4 py-14 text-center sm:px-6 sm:py-20 lg:px-8 lg:py-28">
          <div className="os-hero-reveal mx-auto flex max-w-3xl flex-col items-center">
            <LpBadge variant="coral" className="os-float-badge">
              <Scale className="h-3.5 w-3.5" />
              MIT Licensed · Open Source
            </LpBadge>

            <h1 className="os-hero-reveal os-hero-reveal-delay-1 mt-8 text-[2rem] font-bold leading-[1.06] tracking-tight text-ink sm:text-5xl lg:text-[64px] lg:leading-[1.04]">
              Mentr is{" "}
              <span className="text-coral">open source.</span>
            </h1>

            <p className="os-hero-reveal os-hero-reveal-delay-2 mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              The free tutor-parent connector — built in the open by{" "}
              <PaprlyWordmark className="align-middle" />. 100% zero cut for
              parents and faculty. Over 100+ satisfied parents worldwide. Fork
              it, contribute, or deploy it for your community.
            </p>

            <div className="os-hero-reveal os-hero-reveal-delay-3 mt-6 flex flex-wrap items-center justify-center gap-2">
              <LpPill tint="sage">₹0 platform fee</LpPill>
              <LpPill tint="butter">100% to tutors</LpPill>
              <LpPill tint="coral">No commission ever</LpPill>
            </div>

            <div className="os-hero-reveal os-hero-reveal-delay-3 mt-10 flex flex-wrap items-center justify-center gap-3">
              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" className="gap-2 shadow-[3px_3px_0_0_#1c1a17]">
                  <GitHubIcon className="h-4 w-4" />
                  View on GitHub
                  <ExternalLink className="h-3.5 w-3.5 opacity-70" />
                </Button>
              </a>
              <Link href={GITHUB_CONTRIBUTING_URL} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="secondary" className="gap-2 shadow-[3px_3px_0_0_#1c1a17]">
                  <BookOpen className="h-4 w-4" />
                  Contributing guide
                </Button>
              </Link>
            </div>

            <div className="os-hero-reveal os-hero-reveal-delay-3 mt-10 flex items-center justify-center gap-3">
              <SocialLink href={GITHUB_REPO_URL} label="Mentr on GitHub">
                <GitHubIcon className="h-5 w-5" />
              </SocialLink>
              <SocialLink
                href={LINKEDIN_URL}
                label="Mentr on LinkedIn"
                className="os-float-badge-delay"
              >
                <LinkedInIcon className="h-5 w-5" />
              </SocialLink>
              <ProductHuntFeaturedBadge
                compact
                className={cn(
                  "os-float-badge inline-flex overflow-hidden rounded-xl border-2 border-ink bg-white transition-all duration-200 hover:-translate-y-0.5 [&_img]:h-12 [&_img]:w-auto",
                  hardShadowSm,
                )}
              />
            </div>

            <div className="mt-8 flex items-center justify-center gap-2">
              <LpLiveDot label="Accepting contributions" />
            </div>
          </div>
        </div>
      </section>

      <LpStatsBand stats={stats} />

      {githubStats ? <GithubCommunitySection stats={githubStats} /> : null}

      {/* Mission */}
      <section className="relative border-b border-hairline bg-white py-12 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeader
                align="left"
                eyebrow="Our mission"
                title="100% zero cut."
                accent="Forever."
                description="Mentr connects parents and verified tutors — then gets out of the way. No coins, no lead packs, no commission on sessions. Faculty keep every rupee they earn. Parents never pay to search or connect."
              />
              <p className="mt-6 text-base leading-relaxed text-muted">
                {GLOBAL_REACH_LINE} We open-sourced Mentr so that promise is
                visible — not just marketing copy. Anyone can verify there is
                no hidden fee engine, no paywall on contact, and no cut from
                tutor earnings.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ParentActionLink href="/search">
                  <Button className="gap-2">
                    Find a tutor free
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </ParentActionLink>
                <FacultyActionLink href="/faculty/signup">
                  <Button variant="secondary" className="gap-2">
                    Join as faculty
                  </Button>
                </FacultyActionLink>
              </div>
            </div>

            <div
              className={cn(
                "rounded-2xl border-2 border-ink bg-cream-band p-6 sm:p-8",
                hardShadow,
              )}
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
                The Mentr promise
              </p>
              <ul className="mt-6 space-y-4">
                {[
                  "Parents search and connect for ₹0 — always.",
                  "Tutors list, receive requests, and pitch for ₹0 — always.",
                  "WhatsApp unlocks only after mutual acceptance — privacy first.",
                  "Optional profile boost later — contact never behind a paywall.",
                  "Source code is MIT licensed — fork, audit, or contribute.",
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 border-ink bg-sage text-[10px] font-bold text-white">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <LpSectionDivider bandClass="bg-white" className="bg-sage-wash" />

      {/* Platform features */}
      <section className="border-b border-hairline bg-white py-12 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="What's built"
            title="Parent engagement,"
            accent="open source."
            description="Recent additions focus on bringing parents back until they hire — real events, not gamification. All of this ships in the public repo."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {platformFeatures.map((item) => (
              <article
                key={item.title}
                className={cn(
                  "rounded-2xl border-2 border-ink bg-cream-band p-6 transition-all duration-200 hover:-translate-y-1",
                  hardShadowSm,
                )}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-ink bg-sage text-white">
                  <item.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-bold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
          <div className="mt-10 rounded-2xl border-2 border-dashed border-hairline bg-cream/50 p-6 sm:p-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
              On the roadmap
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {roadmapItems.map((item) => (
                <li
                  key={item.label}
                  className="inline-flex items-center gap-2 rounded-lg border border-hairline bg-white px-3 py-2 text-sm text-ink"
                >
                  <span className="font-medium">{item.label}</span>
                  <span className="rounded-md bg-butter/80 px-1.5 py-0.5 text-[10px] font-bold uppercase text-ink/70">
                    {item.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Why open source */}
      <section className="bg-sage-wash py-12 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Why open source"
            title="Trust you can"
            accent="verify."
            description="Education platforms often hide fees until you're locked in. Mentr is different — the code is public, the license is MIT, and the mission is free connection for everyone."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {whyOpenSource.map((item) => (
              <article
                key={item.title}
                className={cn(
                  "rounded-2xl border-2 border-ink bg-white p-6 transition-all duration-200 hover:-translate-y-1",
                  hardShadowSm,
                )}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-ink bg-coral text-white">
                  <item.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-bold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Repo + tech stack */}
      <section className="border-y border-hairline bg-ink py-12 text-white sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-sm font-semibold text-butter">The codebase</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Full stack.{" "}
                <span className="text-coral">Fully open.</span>
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-white/75">
                Next.js frontend, Express API, MongoDB models, SEO landing
                pages, auth, connections, notifications, shortlist, hiring
                checklist, and the requirements board — all in one repo. Clone
                it, run it locally, and ship improvements back via pull request.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {techStack.map((t) => (
                  <span
                    key={t.name}
                    className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs"
                  >
                    <span className="font-bold text-butter">{t.name}</span>
                    <span className="text-white/50"> · {t.role}</span>
                  </span>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={GITHUB_REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="gap-2 bg-butter text-ink hover:bg-butter-deep">
                    <Star className="h-4 w-4" />
                    Star the repo
                  </Button>
                </a>
                <a href={GITHUB_ISSUES_URL} target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="secondary"
                    className="gap-2 border-white/20 bg-white/10 text-white hover:bg-white/15"
                  >
                    <Bug className="h-4 w-4" />
                    Report a bug
                  </Button>
                </a>
              </div>
            </div>
            <RepoLiveCard stats={githubStats} />
          </div>
        </div>
      </section>

      {/* Contribute */}
      <section className="lp-cloth-texture py-12 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <div>
              <SectionHeader
                align="left"
                eyebrow="Contribute"
                title="How to"
                accent="contribute"
                description="Bug fixes, docs, translations, SEO pages, and new features — all welcome. Read CONTRIBUTING.md, keep PRs focused, and run lint + build before submitting."
              />
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={GITHUB_CONTRIBUTING_URL} target="_blank" rel="noopener noreferrer">
                  <Button variant="secondary" className="gap-2">
                    <BookOpen className="h-4 w-4" />
                    Read CONTRIBUTING.md
                  </Button>
                </a>
                <a href={GITHUB_ISSUES_URL} target="_blank" rel="noopener noreferrer">
                  <Button variant="secondary" className="gap-2">
                    <GitPullRequest className="h-4 w-4" />
                    Browse issues
                  </Button>
                </a>
              </div>
            </div>
            <LpStepTimeline
              steps={contributeSteps}
              activeIndex={activeStep}
              onSelect={setActiveStep}
              accent="sage"
            />
          </div>
        </div>
      </section>

      <LpSectionDivider bandClass="bg-cream-band" className="bg-white" />

      {/* Testimonials */}
      <section className="bg-white py-12 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Community trust"
            title="100+ satisfied"
            accent="parents worldwide"
            description="Real connections, zero platform fees. Parents and tutors choose Mentr because it's free, direct, and transparent."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {testimonials.map((t) => (
              <LpTestimonialCard key={t.role} {...t} />
            ))}
          </div>
        </div>
      </section>

      {/* Community links */}
      <section className="border-t border-hairline bg-cream-band py-12 sm:py-16">
        <div className="mx-auto max-w-[1400px] px-4 text-center sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Join the community"
            title="GitHub, LinkedIn"
            accent="& Product Hunt"
            description="Follow development, share feedback, or star the repo to help others discover a free alternative to commission-based tutoring platforms."
          />
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <SocialLink href={GITHUB_REPO_URL} label="GitHub">
              <GitHubIcon className="h-5 w-5" />
            </SocialLink>
            <SocialLink href={LINKEDIN_URL} label="LinkedIn">
              <LinkedInIcon className="h-5 w-5" />
            </SocialLink>
          </div>
          <div className="mt-8 flex justify-center">
            <ProductHuntBadges />
          </div>
          <p className="mx-auto mt-8 max-w-lg text-sm text-muted">
            Questions about contributing? Email{" "}
            <a
              href="mailto:team@mentr.in"
              className="font-semibold text-coral hover:underline"
            >
              team@mentr.in
            </a>{" "}
            or open a GitHub issue.
          </p>
        </div>
      </section>

      {/* Creator */}
      <section className="relative overflow-hidden border-t border-hairline bg-white py-12 sm:py-20 lg:py-24">
        <LpGridBg className="opacity-20" />
        <LpBlob
          color="rgba(255,154,77,0.12)"
          size={280}
          className="-right-16 top-10"
        />
        <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="relative max-w-3xl">
            <p className="inline-flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
              <span className="h-px w-5 bg-muted/50" aria-hidden />
              The creator
              <span className="h-px w-5 bg-muted/50" aria-hidden />
            </p>
            <h2 className="mt-4 whitespace-nowrap text-[1.35rem] font-bold tracking-tight text-ink sm:text-3xl lg:text-[42px] lg:leading-[1.12]">
              Built by someone who{" "}
              <span className="text-coral">hates paywalls</span>
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              Short version from the LinkedIn bio — minus the corporate fluff.
            </p>
          </div>

          <div
            className={cn(
              "mt-10 flex flex-col gap-6 rounded-3xl border-2 border-ink bg-cream/50 p-5 sm:flex-row sm:items-start sm:gap-8 sm:p-7 lg:p-8",
              hardShadow,
            )}
          >
            <div className="mx-auto w-[140px] shrink-0 sm:mx-0 sm:w-[160px]">
              <div className="overflow-hidden rounded-2xl border-2 border-ink bg-ink shadow-[3px_3px_0_0_#1c1a17]">
                <Image
                  src="/team/adarsh-singh.png"
                  alt="Adarsh Singh — creator of Mentr by Paprly"
                  width={320}
                  height={400}
                  quality={95}
                  unoptimized
                  className="h-auto w-full object-cover object-top"
                />
              </div>
              <p className="mt-2 text-center text-[10px] font-bold uppercase tracking-wide text-muted">
                Creator · Paprly / Mentr
              </p>
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold uppercase tracking-wide text-coral">
                Meet the human
              </p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                Adarsh Singh
              </h3>
              <p className="mt-2 text-sm font-semibold text-ink/80">
                Software Engineer @ upGrad School of Technology · Ex-Founding
                Engineer @ Paprly · SIH 2024 Winner · Creator of Mentr
              </p>
              <p className="mt-1 text-sm text-muted">Bengaluru, India</p>

              <blockquote className="mt-5 border-l-4 border-coral pl-4 text-sm leading-relaxed text-ink sm:text-base">
                Edtech loves charging you to say hello. Coins. Lead packs.
                &ldquo;Unlock contact for ₹999.&rdquo;{" "}
                <span className="font-semibold text-coral">
                  Mentr is the opposite joke:
                </span>{" "}
                parents find tutors for ₹0, tutors keep 100%, and the code is
                MIT so nobody can quietly reverse that.
              </blockquote>

              <p className="mt-4 text-sm leading-relaxed text-muted">
                Aim is simple —{" "}
                <span className="font-semibold text-ink">
                  keep things that should be free, free.
                </span>{" "}
                Search. Connect. WhatsApp after mutual accept. No commission
                engine hiding in the repo. If education infrastructure can be
                open, it should be.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  "₹0 platform fee",
                  "MIT open source",
                  "No lead packs",
                  "Build in public",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-hairline bg-white px-3 py-1 text-[11px] font-semibold text-ink"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={CREATOR_LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="gap-2">
                    <LinkedInIcon className="h-4 w-4" />
                    LinkedIn
                    <ExternalLink className="h-3.5 w-3.5 opacity-70" />
                  </Button>
                </a>
                <a
                  href={GITHUB_REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="secondary" className="gap-2">
                    <GitHubIcon className="h-4 w-4" />
                    GitHub repo
                  </Button>
                </a>
                <Link href="/blog/who-created-mentr-adarsh-singh">
                  <Button variant="secondary" className="gap-2">
                    Creator story
                  </Button>
                </Link>
                <Link href="/blog/contribute-to-mentr-open-source">
                  <Button variant="secondary" className="gap-2">
                    Contribute guide
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LpFinalCta
        dark
        eyebrow="Use Mentr · Contribute to Mentr"
        title="Join free. Or build with us."
        description="Parents and tutors use Mentr at zero cost. Developers fork the repo, fix bugs, and ship features that keep tutoring free for everyone."
        primaryLabel="Create free account"
        primaryHref="/faculty/signup"
        secondaryLabel="Find a tutor"
        secondaryHref="/search"
        perks={[
          "₹0 forever",
          "MIT licensed",
          "Pull requests welcome",
          "100+ happy parents",
        ]}
      />
    </main>
  );
}
