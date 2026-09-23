"use client";

import type { ReactNode } from "react";
import { BrowserFrame } from "@/components/ui/browser-frame";
import { Button } from "@/components/ui/button";
import {
  hardShadowSm,
  LpBadge,
  LpBlob,
  LpGridBg,
  SectionHeader,
} from "@/components/landing/lp/shared";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Check,
  Crown,
  Eye,
  Headphones,
  Infinity as InfinityIcon,
  LayoutDashboard,
  Lock,
  MapPin,
  MessageCircle,
  Sparkles,
  Star,
  Unlock,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const TOC = [
  { id: "why", label: "Why Premium" },
  { id: "compare", label: "Free vs Premium" },
  { id: "steps", label: "How to upgrade" },
  { id: "features", label: "Features & where" },
  { id: "flow", label: "Daily workflow" },
  { id: "faq", label: "FAQ" },
] as const;

const COMPARE_ROWS: {
  label: string;
  free: string;
  premium: string;
  premiumWin?: boolean;
}[] = [
  {
    label: "Profile & WhatsApp after accept",
    free: "Yes",
    premium: "Yes",
  },
  {
    label: "Board pitches / day",
    free: "3",
    premium: "Unlimited",
    premiumWin: true,
  },
  {
    label: "Parent directory (/parentslist)",
    free: "Locked",
    premium: "Full access",
    premiumWin: true,
  },
  {
    label: "Contact reveals / day",
    free: "—",
    premium: "3 new unlocks",
    premiumWin: true,
  },
  {
    label: "Premium badge in search",
    free: "—",
    premium: "Shown",
    premiumWin: true,
  },
  {
    label: "Featured on landing",
    free: "Admin pick only",
    premium: "Priority first",
    premiumWin: true,
  },
  {
    label: "Snap & Grade credits",
    free: "Wallet balance",
    premium: "Unlimited",
    premiumWin: true,
  },
  {
    label: "Human SPOC",
    free: "—",
    premium: "Included",
    premiumWin: true,
  },
  {
    label: "Price",
    free: "$0 forever",
    premium: "$5/mo · ≈ ₹449",
    premiumWin: true,
  },
];

const STEPS = [
  {
    n: "01",
    title: "Open pricing",
    body: "Go to /mentrpricing from the site nav, or tap Get Premium / Renew on the Premium tile in your mentor dashboard.",
    href: "/mentrpricing",
    cta: "Open pricing",
  },
  {
    n: "02",
    title: "Pick months",
    body: "Choose 2, 3, or 4 months. Longer plans show a volume discount. Price is shown in INR via Razorpay — no GST added on top.",
  },
  {
    n: "03",
    title: "Pay & verify",
    body: "Complete Razorpay checkout. Mentr verifies the payment and sets your Premium expiry date automatically.",
  },
  {
    n: "04",
    title: "Use Premium tools",
    body: "Dashboard shows a Premium badge. Open /parentslist, pitch without a daily cap on the board, and grade on Snap & Grade without credits.",
    href: "/parentslist",
    cta: "Open parent list",
  },
];

const FEATURES: {
  id: string;
  title: string;
  why: string;
  where: string[];
  mockUrl: string;
  mock: ReactNode;
}[] = [
  {
    id: "directory",
    title: "Parent directory + reveal contacts",
    why: "See every parent who joined Mentr — photo, city, whether they posted a need — then unlock phone/email for outreach. Free mentors never see this list.",
    where: [
      "URL: /parentslist",
      "Dashboard → Pitch parents → Open parent list",
      "Premium tile → Parents button",
    ],
    mockUrl: "mentr.in / parentslist",
    mock: <MockParentsList />,
  },
  {
    id: "pitches",
    title: "Unlimited board pitches",
    why: "Free mentors can pitch 3 parent posts per day. Premium removes the cap so you can respond to every fit on the requirements board.",
    where: [
      "URL: /board",
      "Dashboard → Pitch parents → Need board",
      "Quota widget shows ∞ Premium when active",
    ],
    mockUrl: "mentr.in / board",
    mock: <MockBoardUnlimited />,
  },
  {
    id: "search-badge",
    title: "Premium badge + search toggle",
    why: "Parents browsing /search can filter Regular vs Premium. Your Premium chip sits next to Verified so serious parents spot you faster.",
    where: [
      "Parents: /search — toggle centered above search",
      "Your public profile: /teachers/[id]",
      "Landing featured mentors strip",
    ],
    mockUrl: "mentr.in / search",
    mock: <MockSearchToggle />,
  },
  {
    id: "featured",
    title: "Featured first on landing",
    why: "Active Premium mentors are sorted to the front of the homepage featured strip (before curated free listings fill remaining slots).",
    where: ["Homepage → Featured mentors section", "Admin can still curate extras"],
    mockUrl: "mentr.in /",
    mock: <MockFeatured />,
  },
  {
    id: "snap",
    title: "Unlimited Snap & Grade",
    why: "Premium mentors grade NCERT answers without spending wallet credits. The wallet shows ∞ instead of a credit balance.",
    where: [
      "URL: /snapandgrade/grade",
      "Account chip shows ∞ / Prem when Premium",
    ],
    mockUrl: "mentr.in / snapandgrade/grade",
    mock: <MockSnapGrade />,
  },
  {
    id: "history",
    title: "Reveal history on dashboard",
    why: "Track which parents you unlocked, when, and jump back to WhatsApp. Quota resets at midnight IST.",
    where: [
      "Dashboard → Pitch parents → Reveal history",
      "/parentslist → History button",
    ],
    mockUrl: "mentr.in / dashboard",
    mock: <MockRevealHistory />,
  },
];

export function MentrPremiumGuide() {
  const [tocOpen, setTocOpen] = useState(false);

  return (
    <article className="min-h-screen w-full overflow-x-hidden bg-cream">
      {/* Hero */}
      <header className="relative w-full overflow-hidden border-b-2 border-ink bg-cream">
        <LpGridBg className="opacity-25" />
        <LpBlob
          color="rgba(255,210,90,0.22)"
          size={380}
          className="-right-24 -top-20"
        />
        <LpBlob
          color="rgba(47,158,110,0.12)"
          size={280}
          className="-left-16 bottom-0"
        />

        <div className="relative mx-auto grid max-w-[1400px] gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8 lg:py-16">
          <div>
            <div className="flex flex-wrap gap-2">
              <LpBadge>
                <Crown className="h-3.5 w-3.5 text-ink" />
                Mentor guide
              </LpBadge>
              <LpBadge>
                <BookOpen className="h-3.5 w-3.5 text-coral" />
                ~8 min read
              </LpBadge>
            </div>
            <p className="mt-5 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Mentr
            </p>
            <h1 className="mt-2 text-balance text-3xl font-bold leading-[1.1] tracking-tight text-ink sm:text-4xl lg:text-5xl">
              Premium for mentors —
              <span className="mt-1.5 block text-coral">
                the full playbook.
              </span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              Why it exists, how Free compares, how to upgrade step by step, and
              exactly where each Premium feature lives in the product — with UI
              walkthroughs.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/mentrpricing">
                <Button size="lg" className="h-12 w-full gap-2 sm:min-w-[180px]">
                  See plans & pay
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#features">
                <Button
                  size="lg"
                  variant="secondary"
                  className="h-12 w-full border-2 border-ink sm:min-w-[180px]"
                >
                  Jump to features
                </Button>
              </a>
            </div>
            <p className="mt-4 text-xs text-muted">
              $5 / month · ≈ ₹449 · no GST on top · Razorpay · parents never pay
            </p>
          </div>

          <BrowserFrame url="mentr.in / mentrpremium" className={hardShadowSm}>
            <div className="space-y-3 bg-cream p-4 sm:p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-butter px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-ink">
                  <Crown className="h-3 w-3" />
                  Premium active
                </span>
                <span className="text-[11px] font-semibold text-muted">
                  3 reveals left today
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Pitches", value: "∞" },
                  { label: "Parent list", value: "Open" },
                  { label: "Snap & Grade", value: "∞" },
                  { label: "Featured", value: "First" },
                ].map((x) => (
                  <div
                    key={x.label}
                    className="rounded-xl border border-hairline bg-white px-3 py-2.5"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-wide text-muted">
                      {x.label}
                    </p>
                    <p className="mt-0.5 text-lg font-bold text-ink">{x.value}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border-2 border-ink bg-white p-3">
                <p className="text-xs font-bold text-ink">Today&apos;s path</p>
                <ol className="mt-2 space-y-1.5 text-[11px] text-muted">
                  <li>1. Open /parentslist → reveal 1–3 fits</li>
                  <li>2. Pitch matching board posts (unlimited)</li>
                  <li>3. Grade homework on Snap & Grade free</li>
                </ol>
              </div>
            </div>
          </BrowserFrame>
        </div>
      </header>

      {/* TOC */}
      <nav className="sticky top-0 z-30 border-b border-hairline bg-cream/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1400px] items-center gap-2 overflow-x-auto px-4 py-2.5 sm:px-6 lg:px-8 [scrollbar-width:none]">
          <button
            type="button"
            className="shrink-0 rounded-lg border border-hairline bg-white px-2.5 py-1.5 text-[11px] font-bold text-ink lg:hidden"
            onClick={() => setTocOpen((v) => !v)}
          >
            Contents
          </button>
          <div
            className={cn(
              "flex gap-1.5",
              tocOpen ? "flex" : "hidden lg:flex",
            )}
          >
            {TOC.map((t) => (
              <a
                key={t.id}
                href={`#${t.id}`}
                className="shrink-0 rounded-full border border-hairline bg-white px-3 py-1.5 text-[11px] font-semibold text-muted transition hover:border-ink/20 hover:text-ink"
              >
                {t.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {/* Why */}
        <section id="why" className="scroll-mt-24">
          <SectionHeader
            eyebrow="Why it exists"
            title="Free forever for core mentoring. Premium when you want reach."
            description="Mentr stays free for listing, receiving parent connects, and pitching a few posts a day. Premium is for mentors who treat the platform as a growth channel — more outreach, more visibility, less friction."
            align="left"
          />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                icon: Users,
                title: "Parents never pay",
                text: "Search, shortlist, and connect stay free for parents. Premium never blocks Free mentors from receiving requests.",
              },
              {
                icon: Zap,
                title: "Outbound reach",
                text: "Directory unlocks + unlimited pitches let you proactively find parents — not only wait for inbound.",
              },
              {
                icon: Star,
                title: "Signal in search",
                text: "Premium badge and featured placement help parents who filter for serious, subscribed mentors.",
              },
            ].map((c) => (
              <div
                key={c.title}
                className={cn(
                  "rounded-2xl border-2 border-ink bg-white p-5",
                  hardShadowSm,
                )}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-butter text-ink">
                  <c.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-bold text-ink">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {c.text}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-hairline bg-sage-wash/40 px-5 py-4 text-sm text-ink">
            <strong>Who should upgrade:</strong> mentors pitching daily, chasing
            local parents outside the board, or grading lots of Snap & Grade
            submissions. Stay Free if inbound requests already fill your slots.
          </div>
        </section>

        {/* Compare */}
        <section id="compare" className="mt-16 scroll-mt-24 sm:mt-20">
          <SectionHeader
            eyebrow="Comparison"
            title="Free vs Premium — side by side"
            description="Same marketplace. Different growth tools. Price as shown — no GST added on top."
            align="left"
          />
          <div
            className={cn(
              "mt-8 overflow-hidden rounded-2xl border-2 border-ink bg-white",
              hardShadowSm,
            )}
          >
            <div className="grid grid-cols-[1.4fr_1fr_1fr] border-b-2 border-ink bg-cream-band px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-muted sm:px-5">
              <span>Feature</span>
              <span>Free</span>
              <span className="flex items-center gap-1 text-ink">
                <Crown className="h-3 w-3" />
                Premium
              </span>
            </div>
            {COMPARE_ROWS.map((row, i) => (
              <div
                key={row.label}
                className={cn(
                  "grid grid-cols-[1.4fr_1fr_1fr] px-4 py-3.5 text-sm sm:px-5",
                  i % 2 === 1 && "bg-cream/50",
                  i < COMPARE_ROWS.length - 1 && "border-b border-hairline",
                )}
              >
                <span className="pr-2 font-medium text-ink">{row.label}</span>
                <span className="text-muted">{row.free}</span>
                <span
                  className={cn(
                    "font-semibold",
                    row.premiumWin ? "text-sage" : "text-ink",
                  )}
                >
                  {row.premium}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/mentrpricing#plans">
              <Button className="gap-2">
                Choose a plan
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/mentrpricing#compare">
              <Button variant="secondary" className="border border-ink/15">
                Full pricing page
              </Button>
            </Link>
          </div>
        </section>

        {/* Steps */}
        <section id="steps" className="mt-16 scroll-mt-24 sm:mt-20">
          <SectionHeader
            eyebrow="Step by step"
            title="How to get Premium in four moves"
            description="Works from desktop or mobile. Keep the dashboard tab open so verify can finish after Razorpay."
            align="left"
          />
          <ol className="mt-8 grid gap-4 lg:grid-cols-2">
            {STEPS.map((s) => (
              <li
                key={s.n}
                className={cn(
                  "flex gap-4 rounded-2xl border-2 border-ink bg-white p-5",
                  hardShadowSm,
                )}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink text-sm font-bold text-butter">
                  {s.n}
                </span>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-ink">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {s.body}
                  </p>
                  {s.href && s.cta ? (
                    <Link
                      href={s.href}
                      className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-coral hover:underline"
                    >
                      {s.cta}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Features with mocks */}
        <section id="features" className="mt-16 scroll-mt-24 sm:mt-20">
          <SectionHeader
            eyebrow="Features · with UI walkthrough"
            title="What you get — and where to find it"
            description="Each block shows a product mock of the screen, why it matters, and the exact paths inside Mentr."
            align="left"
          />

          <div className="mt-10 space-y-16">
            {FEATURES.map((f, idx) => (
              <div
                key={f.id}
                id={f.id}
                className={cn(
                  "scroll-mt-28 grid items-start gap-8 lg:grid-cols-2 lg:gap-12",
                  idx % 2 === 1 && "lg:[&>*:first-child]:order-2",
                )}
              >
                <div>
                  <LpBadge>
                    <Sparkles className="h-3.5 w-3.5 text-coral" />
                    Feature {idx + 1}
                  </LpBadge>
                  <h3 className="mt-3 text-2xl font-bold tracking-tight text-ink">
                    {f.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                    {f.why}
                  </p>
                  <div className="mt-5 rounded-xl border border-hairline bg-white p-4">
                    <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-muted">
                      <MapPin className="h-3 w-3" />
                      Where to find it
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {f.where.map((w) => (
                        <li
                          key={w}
                          className="flex items-start gap-2 text-sm text-ink"
                        >
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sage" />
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <BrowserFrame url={f.mockUrl} className={hardShadowSm}>
                  {f.mock}
                </BrowserFrame>
              </div>
            ))}
          </div>
        </section>

        {/* Daily flow */}
        <section id="flow" className="mt-16 scroll-mt-24 sm:mt-20">
          <SectionHeader
            eyebrow="Daily workflow"
            title="A simple Premium routine"
            description="You do not need every tool every day. Pick the loop that matches how you get students."
            align="left"
          />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Outbound day",
                steps: [
                  "Open /parentslist",
                  "Filter Hiring",
                  "Reveal up to 3 contacts",
                  "WhatsApp with a short intro",
                ],
                icon: Unlock,
              },
              {
                title: "Board day",
                steps: [
                  "Open /board",
                  "Filter your subjects",
                  "Pitch every fit (no 3-cap)",
                  "Track replies in Inbox",
                ],
                icon: MessageCircle,
              },
              {
                title: "Teaching day",
                steps: [
                  "Open Snap & Grade",
                  "Grade without credits",
                  "Share feedback with parents",
                  "Keep Free inbound flowing",
                ],
                icon: InfinityIcon,
              },
            ].map((col) => (
              <div
                key={col.title}
                className={cn(
                  "rounded-2xl border-2 border-ink bg-white p-5",
                  hardShadowSm,
                )}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-coral-wash text-coral">
                  <col.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-bold text-ink">{col.title}</h3>
                <ol className="mt-3 space-y-2">
                  {col.steps.map((s, i) => (
                    <li key={s} className="flex gap-2 text-sm text-muted">
                      <span className="font-bold text-ink">{i + 1}.</span>
                      {s}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mt-16 scroll-mt-24 sm:mt-20">
          <SectionHeader
            eyebrow="FAQ"
            title="Common questions"
            description="Short answers. Full checkout details live on the pricing page."
            align="left"
          />
          <div className="mt-8 space-y-3">
            {[
              {
                q: "Is Free really free forever?",
                a: "Yes. Core listing, inbound parent connects, and 3 board pitches/day stay free. Premium is optional growth tooling.",
              },
              {
                q: "Can I cancel anytime?",
                a: "Premium is prepaid for the months you buy. Access runs until expiresAt. There is no mid-cycle auto-renew yet — renew from the dashboard when ready.",
              },
              {
                q: "Do reveals stack if I don’t use them?",
                a: "No. Unused daily reveals do not roll over. Unlocked contacts stay unlocked for you.",
              },
              {
                q: "Will parents only see Premium mentors?",
                a: "No. Search defaults to Regular. Parents can toggle Premium. Featured landing prioritises Premium but still shows others.",
              },
              {
                q: "What is SPOC?",
                a: "A human point of contact on the Mentr team for Premium mentors — profile, pitches, unlocks, and billing help. Ops-backed, not an in-app chat bot yet.",
              },
            ].map((item) => (
              <details
                key={item.q}
                className="group rounded-2xl border border-hairline bg-white px-5 py-4 open:border-ink/20"
              >
                <summary className="cursor-pointer list-none text-sm font-bold text-ink marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-3">
                    {item.q}
                    <span className="text-muted transition group-open:rotate-45">
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="mt-16 overflow-hidden rounded-3xl border-2 border-ink bg-ink px-6 py-10 text-white sm:mt-20 sm:px-10 sm:py-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-butter">
                <Headphones className="h-3.5 w-3.5" />
                Ready when you are
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                Upgrade, then open the parent directory.
              </h2>
              <p className="mt-2 text-sm text-white/65">
                From $5/mo · ≈ ₹449 · Razorpay · Free plan stays forever if you
                skip.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link href="/mentrpricing">
                <Button
                  size="lg"
                  className="h-12 w-full bg-butter text-ink hover:bg-butter-deep sm:min-w-[160px]"
                >
                  Go to pricing
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  variant="secondary"
                  className="h-12 w-full border-white/25 bg-white/10 text-white hover:bg-white/15 sm:min-w-[160px]"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </article>
  );
}

/* ── UI mock “screenshots” ───────────────────────────────────────── */

function MockParentsList() {
  return (
    <div className="bg-cream p-3 sm:p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex gap-1 rounded-lg border border-ink bg-white p-0.5 text-[10px] font-bold">
          <span className="rounded-md bg-ink px-2 py-1 text-white">All</span>
          <span className="px-2 py-1 text-muted">Hiring</span>
          <span className="px-2 py-1 text-muted">Unlocked</span>
        </div>
        <span className="text-[10px] font-semibold text-muted">2/3 left</span>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {[
          { name: "Priya S.", loc: "HSR, Bengaluru", hire: true },
          { name: "Rahul M.", loc: "Koramangala", hire: false },
        ].map((p) => (
          <div
            key={p.name}
            className="overflow-hidden rounded-xl border border-hairline bg-white"
          >
            <div className="flex aspect-[5/3] items-center justify-center bg-lavender/40 text-lg font-bold text-ink/40">
              {p.name.slice(0, 1)}
            </div>
            <div className="p-2.5">
              <p className="text-xs font-bold text-ink">{p.name}</p>
              <p className="text-[10px] text-muted">{p.loc}</p>
              <div className="relative mt-2 overflow-hidden rounded-lg bg-cream px-2 py-2">
                <p className="blur-[4px] text-[10px] tabular-nums">98••••••21</p>
                <div className="absolute inset-0 flex items-center justify-center bg-white/50">
                  <span className="inline-flex items-center gap-1 rounded-full bg-ink px-2 py-0.5 text-[9px] font-bold text-white">
                    <Lock className="h-2.5 w-2.5" />
                    Reveal
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockBoardUnlimited() {
  return (
    <div className="bg-cream p-4">
      <div className="mb-3 flex items-center justify-between rounded-xl border border-hairline bg-white px-3 py-2">
        <span className="text-[11px] font-bold text-ink">Daily quota</span>
        <span className="text-sm font-bold text-sage">
          ∞ <span className="text-[10px] font-semibold">Premium</span>
        </span>
      </div>
      {["Class 10 Physics · Indiranagar", "Coding · Class 6–8 · Online"].map(
        (t) => (
          <div
            key={t}
            className="mb-2 flex items-center justify-between gap-2 rounded-xl border border-hairline bg-white px-3 py-2.5"
          >
            <p className="text-[11px] font-semibold text-ink">{t}</p>
            <span className="shrink-0 rounded-md bg-coral px-2 py-1 text-[9px] font-bold text-white">
              Pitch
            </span>
          </div>
        ),
      )}
      <p className="mt-2 text-center text-[10px] text-muted">
        No 3/day cap while Premium is active
      </p>
    </div>
  );
}

function MockSearchToggle() {
  return (
    <div className="bg-cream p-4">
      <div className="mx-auto mb-3 flex max-w-[220px] rounded-lg border-2 border-ink bg-white p-0.5 text-[10px] font-bold shadow-[2px_2px_0_0_#1a231c]">
        <span className="flex-1 rounded-md py-1.5 text-center text-muted">
          Regular
        </span>
        <span className="flex flex-1 items-center justify-center gap-1 rounded-md bg-butter py-1.5 text-ink">
          <Crown className="h-2.5 w-2.5" />
          Premium
        </span>
      </div>
      <div className="rounded-xl border border-hairline bg-white p-3">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cream-band text-xs font-bold">
            A
          </div>
          <div>
            <p className="flex items-center gap-1 text-xs font-bold text-ink">
              Ananya Rao
              <BadgeCheck className="h-3 w-3 text-sage" />
              <span className="rounded bg-butter px-1 py-px text-[8px] font-bold uppercase">
                Premium
              </span>
            </p>
            <p className="text-[10px] text-muted">Physics · Bengaluru</p>
          </div>
        </div>
      </div>
      <p className="mt-2 text-center text-[10px] text-muted">
        Parents toggle Regular / Premium above search
      </p>
    </div>
  );
}

function MockFeatured() {
  return (
    <div className="bg-white p-4">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-muted">
        Featured mentors
      </p>
      <div className="grid grid-cols-3 gap-2">
        {["P", "R", "S"].map((letter, i) => (
          <div
            key={letter}
            className="overflow-hidden rounded-lg border border-hairline"
          >
            <div className="flex aspect-square items-center justify-center bg-cream-band text-sm font-bold text-ink/40">
              {letter}
            </div>
            <div className="p-1.5">
              {i < 2 ? (
                <span className="inline-flex items-center gap-0.5 rounded bg-butter px-1 py-px text-[7px] font-bold uppercase text-ink">
                  <Crown className="h-2 w-2" />
                  Prem
                </span>
              ) : (
                <span className="text-[8px] font-semibold text-muted">Tutor</span>
              )}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-2 text-center text-[10px] text-muted">
        Premium mentors sort first
      </p>
    </div>
  );
}

function MockSnapGrade() {
  return (
    <div className="bg-cream p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-bold text-ink">Grade now</p>
        <span className="inline-flex items-center gap-1 rounded-full border border-hairline bg-white px-2.5 py-1 text-[11px] font-extrabold text-ink">
          ∞ <span className="text-[9px] font-bold uppercase text-muted">prem</span>
        </span>
      </div>
      <div className="rounded-xl border border-hairline bg-white p-3">
        <p className="text-[10px] text-muted">Class 10 · Maths · Ch 3</p>
        <p className="mt-1 text-xs font-semibold text-ink">
          Premium mentor · unlimited grading
        </p>
        <div className="mt-3 h-8 rounded-lg bg-sage text-center text-[11px] font-bold leading-8 text-white">
          Confirm & grade · 0 cr
        </div>
      </div>
    </div>
  );
}

function MockRevealHistory() {
  return (
    <div className="bg-cream p-4">
      <div className="mb-2 flex items-center gap-1.5 text-[11px] font-bold text-ink">
        <Eye className="h-3.5 w-3.5 text-coral" />
        Contact reveals
      </div>
      {[
        { name: "Meera K.", when: "Today · 2:14 pm" },
        { name: "Vikram D.", when: "Yesterday" },
      ].map((r) => (
        <div
          key={r.name}
          className="mb-2 flex items-center justify-between rounded-xl border border-hairline bg-white px-3 py-2"
        >
          <div>
            <p className="text-xs font-bold text-ink">{r.name}</p>
            <p className="text-[10px] text-muted">{r.when}</p>
          </div>
          <MessageCircle className="h-4 w-4 text-sage" />
        </div>
      ))}
      <p className="text-center text-[10px] text-muted">
        Dashboard → Pitch parents → Reveal history
      </p>
    </div>
  );
}
