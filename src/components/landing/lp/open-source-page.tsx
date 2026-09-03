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
  GITHUB_REPO_URL,
  GLOBAL_REACH_LINE,
  LINKEDIN_URL,
} from "@/lib/seo";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  BookOpen,
  Bug,
  Code2,
  ExternalLink,
  GitBranch,
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
    value: "500+",
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

export function OpenSourceLanding() {
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
                pages, auth, connections, and the requirements board — all in
                one repo. Clone it, run it locally, and ship improvements back
                via pull request.
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
            <RepoMock />
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
