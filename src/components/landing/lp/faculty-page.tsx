"use client";

import { BrowserFrame } from "@/components/ui/browser-frame";
import { Button } from "@/components/ui/button";
import { GLOBAL_REACH_LINE } from "@/lib/seo";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Check,
  Coins,
  Globe,
  LayoutDashboard,
  Megaphone,
  MessageCircle,
  ShieldCheck,
  TrendingUp,
  UserPlus,
  Wallet,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { GlobalReachMap } from "@/components/landing/global-reach-map";
import {
  hardShadow,
  hardShadowSm,
  LpBadge,
  LpBlob,
  LpDeltaRow,
  LpFaqLink,
  LpFinalCta,
  LpGridBg,
  LpLiveDot,
  LpMockStage,
  LpPill,
  LpSectionDivider,
  LpStatsBand,
  LpStepTimeline,
  LpSwitchTab,
  LpTestimonialCard,
  SectionHeader,
} from "./shared";

const facultyStats = [
  { value: "₹0", label: "To list & contact", tint: "bg-cream-band", icon: Wallet, sub: "No subscription" },
  { value: "100%", label: "Fees you keep", tint: "bg-sage-wash", icon: TrendingUp, sub: "Zero commission" },
  { value: "0", label: "Coins or leads", tint: "bg-lavender", icon: Coins, sub: "Never pay" },
  { value: "Free", label: "WhatsApp", tint: "bg-coral-wash", icon: MessageCircle, sub: "On your accept" },
];

const facultySteps = [
  { title: "Register free", desc: "Email OTP, subjects, bio, area, WhatsApp. Verified before you go live.", icon: UserPlus },
  { title: "Set availability", desc: "Toggle open slots on your dashboard. Parents see who's free nearby.", icon: CalendarDays },
  { title: "Review requests", desc: "Every connect request includes the parent's note. Accept who fits.", icon: MessageCircle },
  { title: "WhatsApp · keep 100%", desc: "Arrange timing and fees directly. Mentr never takes a cut.", icon: Wallet },
];

const switchTabs = [
  {
    id: "urbanpro",
    letter: "U",
    label: "UrbanPro",
    blurb: "Coins · pay for leads",
    tag: "UrbanPro → Mentr",
    headline: "Same parents reaching out.",
    accent: "Without buying leads.",
    description:
      "UrbanPro charges tutors for coins and lead packs — often for parents who never reply. On Mentr, parents contact you for free and you respond for free.",
    letterBg: "bg-coral",
    cta: "Register free",
    ctaHref: "/faculty/signup",
    migrate: "~2 min",
    deltas: [
      { label: "Pay for leads / coins", other: "Yes", champs: "Never", highlight: true },
      { label: "Cut on sessions", other: "Often", champs: "₹0" },
      { label: "Parent contact", other: "Via platform", champs: "WhatsApp" },
    ],
  },
  {
    id: "agencies",
    letter: "A",
    label: "Tuition agencies",
    blurb: "15–30% cut · middleman",
    tag: "Agencies → Mentr",
    headline: "You own the relationship.",
    accent: "Keep every rupee.",
    description:
      "Agencies take a cut from every session and control pricing. Mentr lists you free — parents message on WhatsApp, you set your own fees, and keep 100%.",
    letterBg: "bg-ink",
    cta: "Create free listing",
    ctaHref: "/faculty/signup",
    migrate: "Instant",
    deltas: [
      { label: "Session cut", other: "15–30%", champs: "0%", highlight: true },
      { label: "Who sets the fee", other: "Agency", champs: "You" },
      { label: "Direct WhatsApp", other: "Rarely", champs: "Always" },
    ],
  },
  {
    id: "groups",
    letter: "W",
    label: "WhatsApp groups",
    blurb: "Posts buried · no dashboard",
    tag: "Groups → Mentr",
    headline: "A real profile.",
    accent: "Not a buried post.",
    description:
      "Group posts disappear in minutes. Mentr gives you a searchable profile with subjects, credentials, live availability, and a dashboard to manage requests.",
    letterBg: "bg-sage",
    cta: "Get listed",
    ctaHref: "/faculty/signup",
    migrate: "5 min setup",
    deltas: [
      { label: "Searchable profile", other: "No", champs: "Yes", highlight: true },
      { label: "Availability dashboard", other: "No", champs: "Yes" },
      { label: "Verified badge", other: "No", champs: "Yes" },
    ],
  },
];

const facultyTestimonials = [
  {
    quote:
      "I was spending ₹3,000/month on UrbanPro coins for leads that ghosted. On Mentr I listed free and parents started messaging within a week. I keep every rupee.",
    name: "Dr. Aris Smith",
    role: "Maths & Physics · Koramangala",
    initials: "AS",
    tint: "bg-cream-band",
  },
  {
    quote:
      "The requirements board is gold. Parents post what they need, I pitch, and they connect. No agency taking 20% of my fees.",
    name: "Priya Nair",
    role: "Mathematics · HSR Layout",
    initials: "PN",
    tint: "bg-lavender",
  },
  {
    quote:
      "Simple dashboard, toggle slots after WhatsApp bookings, and only serious parents reach out. Best free platform I've used.",
    name: "Rahul Menon",
    role: "IIT Prep · Indiranagar",
    initials: "RM",
    tint: "bg-sage-wash",
  },
];

const feeRows = [
  { label: "Cost to list profile", champs: "₹0", others: "₹5,000+/yr", win: true },
  { label: "Pay for leads / coins", champs: "Never", others: "Yes", win: true },
  { label: "Commission on sessions", champs: "0%", others: "15–30%", win: true },
  { label: "Direct WhatsApp contact", champs: "Free", others: "Gated", win: false },
  { label: "Requirements board", champs: "Free", others: "N/A", win: false },
];

function FacultyHero() {
  return (
    <section className="relative overflow-hidden border-b border-hairline bg-cream">
      <LpGridBg className="opacity-20" />
      <LpBlob color="rgba(47,158,110,0.08)" size={340} className="-right-24 -top-16" />
      <LpBlob color="rgba(255,154,77,0.08)" size={260} className="-left-16 bottom-0" />

      <div className="relative mx-auto max-w-[1400px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div className="space-y-7 text-center lg:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              <LpBadge><ShieldCheck className="h-3.5 w-3.5 text-sage" /> Verified listings</LpBadge>
              <LpBadge><Zap className="h-3.5 w-3.5 text-coral" /> Worldwide</LpBadge>
              <LpBadge><Globe className="h-3.5 w-3.5 text-sage" /> Online or local</LpBadge>
            </div>

            <h1 className="text-[2.75rem] font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-[56px]">
              Get found
              <br />
              by parents.
              <span className="mt-3 block text-[1.65rem] font-semibold leading-snug text-coral sm:text-[2rem] lg:text-[2.25rem]">
                Keep 100% of your fees.
              </span>
            </h1>

            <p className="mx-auto max-w-md text-base leading-relaxed text-muted lg:mx-0 sm:text-lg">
              List free from any country — set your time zone, review connect
              requests, and pitch on the requirements board. No coins, no lead
              packs, no commission.
            </p>
            <p className="mx-auto max-w-md text-sm leading-relaxed text-muted/90 lg:mx-0">
              {GLOBAL_REACH_LINE}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              <LpPill tint="sage">Free to list</LpPill>
              <LpPill tint="white">No coins</LpPill>
              <LpPill tint="coral">0% commission</LpPill>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:justify-start">
              <Link href="/faculty/signup">
                <Button size="lg" className="h-13 w-full gap-2 px-8 shadow-[3px_3px_0_0_#1c1a17] sm:w-auto">
                  <UserPlus className="h-4 w-4" />
                  Register free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/board">
                <Button size="lg" variant="secondary" className="h-13 w-full sm:w-auto">
                  <Megaphone className="h-4 w-4" />
                  Requirements board
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-4 rounded-xl border-2 border-ink/10 bg-white/70 px-4 py-3 backdrop-blur-sm lg:justify-start lg:w-fit">
              <div className="text-center lg:text-left">
                <p className="text-2xl font-bold text-ink">248</p>
                <p className="text-[10px] font-semibold text-muted">Avg. profile views/mo</p>
              </div>
              <div className="h-8 w-px bg-hairline" />
              <div className="text-center lg:text-left">
                <p className="text-2xl font-bold text-sage">12</p>
                <p className="text-[10px] font-semibold text-muted">Connect requests/mo</p>
              </div>
            </div>
          </div>

          <LpMockStage
            chips={[
              { label: "Verified ✓", className: "-left-3 top-10", style: { transform: "rotate(-3deg)" } },
              { label: "4 open slots", className: "-right-2 top-20", style: { transform: "rotate(2deg)" } },
              { label: "2 new requests", className: "-bottom-2 left-10", style: {} },
            ]}
          >
            <BrowserFrame url="mentr.in / faculty / onboarding" headerClassName="bg-sage-wash" className="border-2 border-ink">
              <div className="bg-cream p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-bold text-ink">Profile setup</p>
                  <span className="rounded-full bg-sage-wash px-2.5 py-1 text-[10px] font-bold text-sage">Step 3 of 4</span>
                </div>
                <div className="mb-3 h-2 overflow-hidden rounded-full bg-hairline">
                  <div className="h-full w-3/4 rounded-full bg-sage" />
                </div>
                {[
                  { label: "Subjects", value: "Maths, Physics", done: true },
                  { label: "Areas served", value: "Koramangala, HSR", done: true },
                  { label: "Weekly slots", value: "4 open this week", done: true },
                  { label: "Verification", value: "Pending review", done: false },
                ].map((field) => (
                  <div
                    key={field.label}
                    className={cn(
                      "mb-2 flex items-center justify-between rounded-xl border-2 px-3.5 py-3",
                      field.done ? "border-ink/10 bg-white" : "border-dashed border-ink/20 bg-white/50",
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      {field.done ? (
                        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-sage text-white"><Check className="h-3.5 w-3.5" /></span>
                      ) : (
                        <span className="flex h-6 w-6 items-center justify-center rounded-md border-2 border-ink/20 text-[10px] font-bold text-muted">4</span>
                      )}
                      <span className="text-xs font-semibold text-muted">{field.label}</span>
                    </div>
                    <span className="text-sm font-bold text-ink">{field.value}</span>
                  </div>
                ))}
                <div className="mt-3 flex items-center gap-2 rounded-xl border-2 border-ink bg-sage-wash px-3 py-2.5">
                  <BadgeCheck className="h-4 w-4 text-sage" />
                  <p className="text-xs font-bold text-ink">Goes live after verification — usually 24h</p>
                </div>
              </div>
            </BrowserFrame>
          </LpMockStage>
        </div>
      </div>
    </section>
  );
}

function DashboardMock({ step }: { step: number }) {
  return (
    <BrowserFrame url="mentr.in / dashboard" headerClassName="bg-sage-wash" className="rounded-none border-0 shadow-none">
      <div className="space-y-4 bg-cream p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="flex items-center gap-1.5 text-sm font-bold text-ink">
              Dr. Aris Smith <BadgeCheck className="h-4 w-4 text-sage" />
            </p>
            <p className="text-xs text-muted">Maths & Physics · Koramangala</p>
          </div>
          <LpLiveDot label="Live" />
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Views", value: "248", up: step >= 1 },
            { label: "Requests", value: "12", up: step >= 2 },
            { label: "Open slots", value: "4", up: step >= 0 },
          ].map((stat) => (
            <div
              key={stat.label}
              className={cn(
                "rounded-xl border-2 px-2 py-3 text-center transition",
                stat.up ? "border-ink/10 bg-white" : "border-hairline bg-white/50 opacity-60",
              )}
            >
              <p className="text-xl font-bold text-ink">{stat.value}</p>
              <p className="text-[10px] font-semibold text-muted">{stat.label}</p>
            </div>
          ))}
        </div>

        {step >= 1 && (
          <div>
            <p className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide text-muted">
              <LayoutDashboard className="h-3.5 w-3.5 text-coral" /> Availability
            </p>
            <div className="space-y-1.5">
              {[
                { t: "Mon 4–6 PM", on: true },
                { t: "Wed 5–7 PM", on: false },
                { t: "Sat 10–12", on: true },
              ].map((s) => (
                <div
                  key={s.t}
                  className={cn(
                    "flex items-center justify-between rounded-lg border-2 px-3 py-2 text-xs font-bold",
                    s.on ? "border-sage/30 bg-sage-wash text-sage" : "border-hairline bg-white text-muted line-through",
                  )}
                >
                  {s.t}
                  <span className={cn("rounded px-1.5 py-0.5 text-[9px] uppercase", s.on ? "bg-sage text-white" : "bg-hairline")}>
                    {s.on ? "Open" : "Taken"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {step >= 2 && (
          <div className="rounded-xl border-2 border-ink bg-white p-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-ink">New connect request</p>
              <span className="rounded-md bg-coral-wash px-1.5 py-0.5 text-[9px] font-bold text-coral">2h ago</span>
            </div>
            <p className="mt-2 rounded-lg bg-cream px-2.5 py-2 text-[11px] leading-relaxed text-muted">
              &ldquo;Class 10 maths, weekends, board exam focus — are Saturdays open?&rdquo;
            </p>
            <div className="mt-2.5 flex gap-2">
              <span className="flex-1 rounded-lg border-2 border-ink bg-sage py-2 text-center text-[10px] font-bold text-white shadow-[2px_2px_0_0_#1c1a17]">Accept</span>
              <span className="flex-1 rounded-lg border-2 border-ink/20 py-2 text-center text-[10px] font-bold text-muted">Decline</span>
            </div>
          </div>
        )}

        {step >= 3 && (
          <div className="flex items-center gap-2 rounded-xl border-2 border-ink bg-sage-wash px-3 py-2.5">
            <Wallet className="h-4 w-4 text-sage" />
            <p className="text-xs font-bold text-ink">You keep 100% — Mentr takes ₹0</p>
          </div>
        )}
      </div>
    </BrowserFrame>
  );
}

function FacultyDashboardSection() {
  const [step, setStep] = useState(0);

  return (
    <section className="relative overflow-hidden border-y border-hairline bg-white py-20 sm:py-28">
      <LpBlob color="rgba(47,158,110,0.06)" size={280} className="right-0 top-1/4" />
      <div className="relative mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <SectionHeader
          number="01"
          eyebrow="Your dashboard"
          title="Manage slots."
          accent="Review requests."
          description="Toggle availability after bookings, see profile views, and accept connect requests — all from one dashboard."
        />

        <div className={cn("mt-14 overflow-hidden rounded-2xl border-2 border-ink lg:grid lg:grid-cols-[1fr_1.1fr]", hardShadow)}>
          <div className="bg-white p-6 sm:p-8 lg:p-10">
            <LpStepTimeline steps={facultySteps} activeIndex={step} onSelect={setStep} accent="sage" />
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/faculty/signup">
                <Button size="lg"><UserPlus className="h-4 w-4" /> Register as faculty</Button>
              </Link>
              <Link href="/faculty">
                <Button size="lg" variant="secondary">Faculty login</Button>
              </Link>
            </div>
          </div>
          <div className="border-t-2 border-ink bg-cream-band/60 lg:border-l-2 lg:border-t-0">
            <div className="border-b-2 border-ink/10 bg-white px-5 py-3">
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted">Step {step + 1} · Dashboard preview</p>
            </div>
            <DashboardMock step={step} />
          </div>
        </div>
      </div>
    </section>
  );
}

function FacultySwitchSection() {
  const [active, setActive] = useState(switchTabs[0].id);
  const current = switchTabs.find((t) => t.id === active)!;

  return (
    <section className="relative bg-cream py-20 sm:py-28">
      <LpGridBg className="opacity-15" />
      <div className="relative mx-auto max-w-[1120px] px-4 sm:px-6 lg:px-8">
        <SectionHeader number="02" eyebrow="Already on another platform?" title="Switch to Mentr" accent="and keep 100%." />
        <div className="mx-auto mt-12 grid max-w-3xl gap-3 sm:grid-cols-3">
          {switchTabs.map((tab) => (
            <LpSwitchTab key={tab.id} {...tab} isActive={active === tab.id} onClick={() => setActive(tab.id)} />
          ))}
        </div>
        <div className={cn("mt-8 overflow-hidden rounded-2xl border-2 border-ink bg-white lg:grid lg:grid-cols-2", hardShadow)}>
          <div className="relative flex flex-col justify-between overflow-hidden bg-lavender p-7 sm:p-9 lg:p-10">
            <LpBlob color="rgba(217,208,255,0.4)" size={200} className="-right-8 -top-8" />
            <div className="relative">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">{current.tag}</p>
                <span className="rounded-full border border-ink/20 bg-white px-2.5 py-0.5 text-[10px] font-bold text-sage">Switch in {current.migrate}</span>
              </div>
              <h3 className="mt-4 text-2xl font-bold tracking-tight text-ink sm:text-[34px] sm:leading-[1.12]">
                {current.headline}
                <span className="mt-1 block text-coral">{current.accent}</span>
              </h3>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink/70">{current.description}</p>
            </div>
            <Link href={current.ctaHref} className={cn("relative mt-8 inline-flex h-12 w-fit items-center gap-2 rounded-xl border-2 border-ink bg-coral px-6 text-sm font-bold text-white hover:bg-coral-dark", hardShadowSm)}>
              {current.cta} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="flex flex-col border-t-2 border-ink lg:border-l-2 lg:border-t-0">
            {current.deltas.map((row, i) => (
              <div key={row.label} className={i < current.deltas.length - 1 ? "border-b border-hairline" : ""}>
                <LpDeltaRow {...row} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function RequirementsBoardSection() {
  const reqs = [
    { title: "Class 10 Maths", area: "HSR · Weekend", pitches: 4, new: true },
    { title: "IIT Physics", area: "Koramangala · Evening", pitches: 2, new: false },
    { title: "Spoken English", area: "Jayanagar · Online", pitches: 6, new: true },
    { title: "NEET Biology", area: "Indiranagar · Morning", pitches: 1, new: false },
  ];

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <LpMockStage chips={[{ label: "8 open reqs", className: "-right-3 top-8", style: {} }]}>
            <BrowserFrame url="mentr.in / board" className="border-2 border-ink">
              <div className="bg-cream p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-ink">Requirements board</p>
                    <p className="text-[10px] text-muted">Worldwide · updated live</p>
                  </div>
                  <LpLiveDot label="8 open" />
                </div>
                <div className="space-y-2">
                  {reqs.map((req) => (
                    <div
                      key={req.title}
                      className={cn(
                        "flex items-center justify-between rounded-xl border-2 bg-white px-3.5 py-3 transition",
                        req.new ? "border-ink/20 shadow-[2px_2px_0_0_#1c1a17]" : "border-ink/10",
                      )}
                    >
                      <div>
                        <p className="text-sm font-bold text-ink">{req.title}</p>
                        <p className="text-[10px] text-muted">{req.area}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {req.new && <span className="rounded-full bg-coral-wash px-1.5 py-0.5 text-[8px] font-bold text-coral">NEW</span>}
                        <span className="rounded-lg border-2 border-ink bg-sage px-2.5 py-1 text-[10px] font-bold text-white shadow-[1px_1px_0_0_#1c1a17]">
                          Pitch · {req.pitches}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </BrowserFrame>
          </LpMockStage>

          <div>
            <SectionHeader
              align="left"
              number="03"
              eyebrow="Requirements board"
              title="Parents post needs."
              accent="You pitch. Free."
              description="Browse open requirements and pitch with your profile + message. Each pitch auto-sends a connection request to the parent's dashboard. They accept → WhatsApp unlocks. No coins, no lead packs."
            />
            <div className="mt-8 space-y-3">
              {["Browse open requirements in your subjects", "Pitch with profile + message → auto connection request", "Parent accepts on dashboard → WhatsApp · you keep 100%"].map((s, i) => (
                <div key={s} className="flex items-center gap-3 rounded-xl border-2 border-ink/10 bg-cream px-4 py-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 border-ink bg-sage text-xs font-bold text-white shadow-[2px_2px_0_0_#1c1a17]">{i + 1}</span>
                  <span className="text-sm font-semibold text-ink">{s}</span>
                </div>
              ))}
            </div>
            <Link href="/board" className="mt-8 inline-block">
              <Button size="lg"><Megaphone className="h-4 w-4" /> View requirements board</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function ZeroFeesSection() {
  return (
    <section className="relative overflow-hidden bg-ink py-20 text-white sm:py-28">
      <LpBlob color="rgba(255,154,77,0.15)" size={300} className="-left-20 top-0" />
      <LpBlob color="rgba(47,158,110,0.12)" size={240} className="-right-16 bottom-0" />
      <div className="relative mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <LpBadge variant="dark" className="mb-6">Free forever</LpBadge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-[44px] lg:leading-[1.1]">
              Zero fees. <span className="text-coral">Keep every rupee.</span>
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-white/75">
              List free, get contacted free, and keep 100% of your tuition fees.
              Mentr is a connector — not a middleman taking a cut.
            </p>
            <p className="mt-4 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white/70">
              <strong className="text-butter">How we make money:</strong> Optional profile boosts later — contact always stays free.
            </p>
            <Link href="/faculty/signup" className="mt-8 inline-block">
              <Button size="lg" className="bg-butter text-ink shadow-[3px_3px_0_0_rgba(255,255,255,0.2)] hover:bg-butter-deep">
                Register free
              </Button>
            </Link>
          </div>

          <div className={cn("overflow-hidden rounded-2xl border-2 border-white/25 bg-white text-ink", hardShadow)}>
            <div className="grid grid-cols-3 border-b-2 border-ink bg-cream text-center text-[11px] font-bold">
              <div className="px-2 py-3.5 text-muted">Feature</div>
              <div className="border-x-2 border-ink bg-coral-wash px-2 py-3.5 text-coral">Mentr</div>
              <div className="px-2 py-3.5 text-muted">Others</div>
            </div>
            {feeRows.map((row) => (
              <div key={row.label} className={cn("grid grid-cols-3 border-b border-hairline last:border-b-0", row.win && "bg-sage-wash/30")}>
                <div className="flex items-center px-4 py-4 text-sm font-medium">{row.label}</div>
                <div className="flex items-center justify-center border-x border-hairline px-2 py-4 text-sm font-bold text-sage">{row.champs}</div>
                <div className="flex items-center justify-center px-2 py-4 text-sm text-muted line-through decoration-muted/50">{row.others}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FacultyTestimonials() {
  return (
    <section className="bg-cream-band py-20 sm:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <SectionHeader number="04" eyebrow="Loved by tutors worldwide" title="Real tutors." accent="Real earnings." />
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {facultyTestimonials.map((item) => (
            <LpTestimonialCard key={item.name} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FacultyFaqPreview() {
  const preview = [
    { q: "How do faculty register and get contacted?", cat: "Faculty" },
    { q: "Do I have to pay for leads or coins on Mentr?", cat: "Fees" },
    { q: "What is the requirements board?", cat: "Faculty" },
    { q: "Does Mentr charge parents or faculty?", cat: "Fees" },
  ];

  return (
    <section className="bg-lavender py-20 sm:py-24">
      <div className="mx-auto max-w-[800px] px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Common questions" title="Everything faculty ask" accent="before listing." />
        <div className="mt-10 space-y-3">
          {preview.map((item, i) => (
            <LpFaqLink key={item.q} question={item.q} index={i + 1} category={item.cat} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function FacultyLanding() {
  return (
    <main>
      <FacultyHero />
      <LpStatsBand stats={facultyStats} />
      <GlobalReachMap />
      <FacultyDashboardSection />
      <LpSectionDivider className="bg-cream" bandClass="bg-white" />
      <FacultySwitchSection />
      <RequirementsBoardSection />
      <ZeroFeesSection />
      <LpSectionDivider className="bg-cream-band" bandClass="bg-ink" />
      <FacultyTestimonials />
      <FacultyFaqPreview />
      <LpFinalCta
        dark
        eyebrow="Ready to get listed?"
        title="Parents are searching for tutors right now."
        description="Create your free profile, pass verification, and start receiving connect requests — local or online, anywhere in the world."
        primaryLabel="Register free"
        primaryHref="/faculty/signup"
        secondaryLabel="Faculty login"
        secondaryHref="/faculty"
        perks={["Free to list", "No coins", "0% commission", "Requirements board"]}
      />
    </main>
  );
}
