"use client";

import { PostRequirementButton } from "@/components/requirements/post-requirement-cta";
import { ParentActionLink } from "@/components/auth/role-guard-link";
import { BrowserFrame } from "@/components/ui/browser-frame";
import { Button } from "@/components/ui/button";
import { ConnectButton } from "@/components/connect/connect-button";
import { PARENT_LP_TESTIMONIALS } from "@/lib/demo-users";
import { useTestimonialNames } from "@/hooks/use-testimonial-names";
import { TEACHERS, type Teacher } from "@/lib/teachers";
import { GLOBAL_REACH_LINE } from "@/lib/seo";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  Clock,
  Globe,
  Handshake,
  LayoutDashboard,
  Lock,
  Megaphone,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
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
import { SubjectGallery } from "../subject-gallery";

const FILTERS = ["All", "Physics", "Mathematics", "English", "Coding"] as const;

const parentStats = [
  { value: "500+", label: "Verified tutors", tint: "bg-lavender", icon: Users, sub: "Local & online" },
  { value: "₹0", label: "Agent fees", tint: "bg-butter", icon: Sparkles, sub: "Free forever" },
  { value: "30 sec", label: "To connect", tint: "bg-sage-wash", icon: Zap, sub: "Not days of calls" },
  { value: "Direct", label: "WhatsApp", tint: "bg-coral-wash", icon: MessageCircle, sub: "On tutor accept" },
];

const searchSteps = [
  { title: "Search by subject & area", desc: "Filter Class 10 Physics in Indiranagar — see who's free nearby.", icon: Search },
  { title: "Open a verified profile", desc: "Credentials, intro video, open slots, and area — all upfront.", icon: BadgeCheck },
  { title: "Send a connect request", desc: "A short note tells the tutor exactly what your child needs.", icon: MessageCircle },
  { title: "WhatsApp unlocks on accept", desc: "Arrange timing, fees, and location yourselves. Mentr stays out.", icon: Handshake },
];

const postSteps = [
  {
    title: "Post your requirement",
    desc: "Subject, class, area, timing — takes 2 minutes. Your name stays hidden on the board.",
    icon: Megaphone,
  },
  {
    title: "Tutors pitch with their profile",
    desc: "Each pitch sends a connection request to your dashboard. You see their profile and message — number stays hidden.",
    icon: Users,
  },
  {
    title: "Review on parent dashboard",
    desc: "Open tutor profiles, read pitches, and compare credentials. Accept who fits — all in one place.",
    icon: LayoutDashboard,
  },
  {
    title: "Accept → WhatsApp unlocks",
    desc: "Accept the connection request. Their WhatsApp number unlocks and you arrange fees directly.",
    icon: MessageCircle,
  },
];

const switchTabs = [
  {
    id: "urbanpro",
    letter: "U",
    label: "UrbanPro",
    blurb: "Coins · pay for leads",
    tag: "UrbanPro → Mentr",
    headline: "Same tutors nearby.",
    accent: "Without agent fees.",
    description:
      "UrbanPro routes parents through agents and charges tutors for coins. Mentr is direct — search verified tutors, send a connect request, and chat on WhatsApp once they accept. No middleman.",
    letterBg: "bg-coral",
    cta: "Search tutors free",
    ctaHref: "/search",
    migrate: "~30 sec",
    deltas: [
      { label: "Cost to parents", other: "Agent fees", champs: "₹0", highlight: true },
      { label: "Verified profiles", other: "Mixed", champs: "Every listing" },
      { label: "Time to connect", other: "Days of calls", champs: "30 sec" },
    ],
  },
  {
    id: "agencies",
    letter: "A",
    label: "Tuition agencies",
    blurb: "15–30% cut · middleman",
    tag: "Agencies → Mentr",
    headline: "Direct to the teacher.",
    accent: "No middleman.",
    description:
      "Agencies take a cut and control the relationship. On Mentr you find the tutor yourself, send a request, and deal directly on WhatsApp — no commission on sessions.",
    letterBg: "bg-ink",
    cta: "Find a teacher",
    ctaHref: "/search",
    migrate: "Instant",
    deltas: [
      { label: "Session commission", other: "15–30%", champs: "₹0", highlight: true },
      { label: "Who you talk to", other: "Agent first", champs: "Tutor direct" },
      { label: "Search by area", other: "Phone calls", champs: "Built-in map" },
    ],
  },
  {
    id: "whatsapp",
    letter: "W",
    label: "WhatsApp groups",
    blurb: "Scroll & hope · no profiles",
    tag: "Groups → Mentr",
    headline: "Organized search.",
    accent: "Not group chaos.",
    description:
      "Tuition groups bury posts in minutes. Mentr is a searchable directory — subjects, verified profiles, live availability, and one-tap connect requests.",
    letterBg: "bg-sage",
    cta: "Browse directory",
    ctaHref: "/search",
    migrate: "One search",
    deltas: [
      { label: "Search by subject", other: "Scroll & hope", champs: "Built-in", highlight: true },
      { label: "Verified profiles", other: "No", champs: "Yes" },
      { label: "Open slots", other: "Outdated", champs: "Live" },
    ],
  },
];

const parentTestimonials = PARENT_LP_TESTIMONIALS;

const trustPoints = [
  { icon: ShieldCheck, title: "Phone & identity verified", body: "Every tutor passes manual verification before going live." },
  { icon: BadgeCheck, title: "Verified badge on profiles", body: "Clear signal that this faculty cleared our checks." },
  { icon: Globe, title: "Worldwide — local or online", body: "Find tutors near you or connect online from any country — slots show in your time zone." },
  { icon: Handshake, title: "You arrange everything", body: "Timing, fees, location — between you and the tutor only." },
];

function TeacherRow({ teacher }: { teacher: Teacher }) {
  const available = teacher.openSlots > 0;
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-xl border-2 bg-white p-3 transition-all duration-200",
        available
          ? "border-ink/10 hover:border-ink/30 hover:shadow-[2px_2px_0_0_#1c1a17]"
          : "border-hairline opacity-50",
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border-2 border-ink/10 bg-cream-band">
          <Image src={teacher.imageUrl} alt={teacher.name} fill className="object-cover" sizes="44px" />
        </div>
        <div className="min-w-0">
          <p className="flex items-center gap-1 truncate text-sm font-bold text-ink">
            <span className="truncate">{teacher.name}</span>
            {teacher.verified && <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-sage" />}
          </p>
          <p className="truncate text-xs text-muted">{teacher.subjectLine}</p>
          {available && (
            <p className="text-[10px] font-bold text-sage">{teacher.openSlots} open slots</p>
          )}
        </div>
      </div>
      {available ? (
        <ConnectButton
          teacher={teacher}
          className="inline-flex shrink-0 items-center gap-1 rounded-lg border-2 border-ink bg-coral px-3 py-1.5 text-[11px] font-bold text-white shadow-[2px_2px_0_0_#1c1a17] transition hover:bg-coral-dark"
          requestedClassName="inline-flex shrink-0 items-center gap-1 rounded-lg border-2 border-ink/20 bg-cream px-3 py-1.5 text-[11px] font-bold text-muted"
        />
      ) : (
        <span className="shrink-0 rounded-md bg-hairline px-2 py-1 text-[10px] font-bold text-muted">Booked</span>
      )}
    </div>
  );
}

function HeroSearchMock() {
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState<(typeof FILTERS)[number]>("All");

  const results = useMemo(() => {
    return TEACHERS.filter((t) => {
      if (t.openSlots <= 0) return false;
      if (subject !== "All" && !t.subjects.some((s) => s.includes(subject))) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        const hay = `${t.name} ${t.subjectLine} ${t.area} ${t.subjects.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    }).slice(0, 4);
  }, [query, subject]);

  return (
    <BrowserFrame url="mentr.in / search" headerClassName="bg-white" className="border-2 border-ink">
      <div className="bg-white">
        <div className="flex items-center justify-between border-b-2 border-ink/10 bg-cream px-4 py-2.5">
          <LpLiveDot label="12 tutors online" />
          <span className="text-[10px] font-bold text-muted">{results.length} results</span>
        </div>
        <div className="space-y-3 border-b border-hairline px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Class 10 Physics near Indiranagar"
              className="h-11 w-full rounded-lg border-2 border-ink/10 bg-cream pl-10 pr-3 text-sm font-medium outline-none transition focus:border-ink/30 focus:ring-2 focus:ring-coral/20"
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-0.5">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setSubject(f)}
                className={cn(
                  "shrink-0 rounded-lg border-2 px-3 py-1 text-xs font-bold transition",
                  subject === f
                    ? "border-ink bg-ink text-white shadow-[2px_2px_0_0_#1c1a17]"
                    : "border-transparent bg-cream text-muted hover:bg-cream-band",
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="max-h-[280px] space-y-2 overflow-y-auto bg-cream/50 p-3">
          {results.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">No matches — try another filter.</p>
          ) : (
            results.map((t) => <TeacherRow key={t.id} teacher={t} />)
          )}
        </div>
        <div className="flex items-center justify-between border-t border-hairline bg-butter/40 px-4 py-2.5">
          <p className="text-[10px] font-semibold text-muted">Tap Connect → tutor accepts → WhatsApp</p>
          <ParentActionLink href="/search" className="text-[10px] font-bold text-coral hover:underline">
            Open full search →
          </ParentActionLink>
        </div>
      </div>
    </BrowserFrame>
  );
}

function ParentsHero() {
  return (
    <section className="relative overflow-hidden border-b border-hairline bg-cream">
      <LpGridBg />
      <LpBlob color="rgba(235,228,255,0.7)" size={360} className="-left-32 -top-20" />
      <LpBlob color="rgba(255,241,228,0.8)" size={300} className="-right-24 bottom-0" />

      <div className="relative mx-auto w-full max-w-[1400px] px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <div className="grid w-full min-w-0 items-center gap-8 sm:gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
          <div className="min-w-0 w-full max-w-full space-y-5 sm:space-y-7 text-center lg:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              <LpBadge>
                <Globe className="h-3.5 w-3.5 text-sage" />
                Worldwide
              </LpBadge>
              <LpBadge>
                <ShieldCheck className="h-3.5 w-3.5 text-sage" />
                Verified tutors
              </LpBadge>
            </div>

            <h1 className="text-[1.75rem] font-bold leading-[1.08] tracking-tight text-balance text-ink sm:text-4xl lg:text-[56px] lg:leading-[1.05]">
              Find a tutor
              <br />
              for your child.
              <span className="mt-3 block text-[1.65rem] font-semibold leading-snug text-coral sm:text-[2rem] lg:text-[2.25rem]">
                Free. No agent fees. Ever.
              </span>
            </h1>

            <p className="mx-auto max-w-md text-base leading-relaxed text-muted lg:mx-0 sm:text-lg">
              Search verified tutors locally or online from any country — or post
              your requirement and let tutors pitch you. WhatsApp unlocks when
              you accept. ₹0 platform fee.
            </p>
            <p className="mx-auto max-w-md text-sm leading-relaxed text-muted/90 lg:mx-0">
              {GLOBAL_REACH_LINE}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              <LpPill tint="sage">Free forever</LpPill>
              <LpPill tint="butter">No credit card</LpPill>
              <LpPill tint="coral">Unlimited searches</LpPill>
            </div>

            <div className="flex w-full max-w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center lg:justify-start">
              <ParentActionLink href="/search" className="block w-full max-w-full sm:w-auto">
                <Button size="lg" className="h-13 w-full max-w-full gap-2 px-5 text-base shadow-[3px_3px_0_0_#1c1a17] sm:w-auto sm:px-8">
                  <Search className="h-4 w-4" />
                  Find a teacher
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </ParentActionLink>
              <PostRequirementButton size="lg" variant="secondary" className="h-13 w-full max-w-full px-5 sm:w-auto sm:px-8" />
            </div>

            <p className="text-center text-xs text-muted lg:text-left">
              Popular searches:{" "}
              <Link href="/find-online-tutors" className="font-semibold text-coral hover:underline">
                find online tutors
              </Link>
              {" · "}
              <Link href="/find-verified-online-tutors" className="font-semibold text-coral hover:underline">
                verified tutors online
              </Link>
              {" · "}
              <Link href="/find-mentors-near-me" className="font-semibold text-coral hover:underline">
                find mentors near me
              </Link>
            </p>

            <div className="flex items-center justify-center gap-3 pt-2 lg:justify-start">
              <div className="flex -space-x-2">
                {["AR", "VS", "MK"].map((init) => (
                  <span
                    key={init}
                    className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-cream bg-lavender text-[10px] font-bold text-ink"
                  >
                    {init}
                  </span>
                ))}
              </div>
              <p className="text-left text-xs leading-snug text-muted">
                <span className="font-bold text-ink">200+ parents</span> found tutors
                <br />
                worldwide this month
              </p>
            </div>
          </div>

          <div className="min-w-0 w-full max-w-full overflow-hidden">
          <LpMockStage
            chips={[
              { label: "✓ Verified", className: "-left-4 top-8", style: { transform: "rotate(-4deg)" } },
              { label: "₹0 fees", className: "-right-2 top-16", style: { transform: "rotate(3deg)" } },
              { label: "3 open slots", className: "-bottom-3 left-8", style: { transform: "rotate(-2deg)" } },
            ]}
          >
            <HeroSearchMock />
          </LpMockStage>
          </div>
        </div>
      </div>
    </section>
  );
}

function ParentsTrust() {
  return (
    <section className="relative overflow-hidden border-b border-hairline bg-white py-12 sm:py-20 lg:py-28">
      <LpBlob color="rgba(230,246,238,0.6)" size={240} className="right-0 top-0" />
      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-end">
          <div>
            <SectionHeader
              align="left"
              eyebrow="Trust & safety"
              number="01"
              title="Handing your child to a tutor"
              accent="shouldn't feel risky."
              description="We verify every teacher's phone and identity before their profile goes live."
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {trustPoints.map((p) => (
              <div
                key={p.title}
                className={cn(
                  "group rounded-2xl border-2 border-ink/10 bg-cream p-6 transition-all duration-200 hover:border-ink hover:bg-white",
                  hardShadowSm,
                  "hover:-translate-y-1",
                )}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-ink bg-sage-wash text-sage transition group-hover:bg-sage group-hover:text-white">
                  <p.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-bold text-ink">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FlowMock({ path, step }: { path: "search" | "post"; step: number }) {
  if (path === "search") {
    const screens = [
      <div key="s0" className="space-y-2 p-4">
        <p className="text-[10px] font-bold uppercase tracking-wide text-muted">Search results</p>
        {["Priya Nair · Maths · 3 open", "Rahul M. · Physics · 2 open"].map((r) => (
          <div key={r} className="rounded-lg border-2 border-ink/10 bg-white px-3 py-2.5 text-xs font-semibold">{r}</div>
        ))}
      </div>,
      <div key="s1" className="space-y-3 p-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-ink bg-lavender text-xs font-bold">PN</span>
          <div>
            <p className="text-sm font-bold">Priya Nair <BadgeCheck className="inline h-3.5 w-3.5 text-sage" /></p>
            <p className="text-xs text-muted">Class 9–12 Maths · HSR</p>
          </div>
        </div>
        <div className="rounded-lg border-2 border-ink/15 bg-butter/50 p-3">
          <p className="text-[10px] font-bold text-muted">Your message</p>
          <p className="mt-1 text-xs font-medium">Class 10 maths, weekends, board exam focus.</p>
        </div>
      </div>,
      <div key="s2" className="space-y-2 p-4">
        <div className="flex items-center gap-2 rounded-lg border-2 border-ink/15 bg-butter/60 px-3 py-2">
          <Clock className="h-3.5 w-3.5" />
          <p className="text-xs font-bold">Request sent — awaiting accept</p>
        </div>
      </div>,
      <div key="s3" className="space-y-2 p-4">
        <div className="flex items-center gap-2 rounded-lg border-2 border-ink bg-sage-wash px-3 py-2">
          <MessageCircle className="h-3.5 w-3.5 text-sage" />
          <p className="text-xs font-bold text-sage">WhatsApp unlocked!</p>
        </div>
        <div className="rounded-lg bg-[#ECE5DD] p-2.5">
          <div className="ml-auto max-w-[85%] rounded-lg rounded-tr-sm bg-[#DCF8C6] px-2.5 py-1.5 text-[11px]">Saturday 10–12 works?</div>
          <div className="mt-1.5 max-w-[85%] rounded-lg rounded-tl-sm bg-white px-2.5 py-1.5 text-[11px]">Yes! Let's discuss fees.</div>
        </div>
      </div>,
    ];
    return screens[step] ?? screens[0];
  }

  const screens = [
    <div key="p0" className="space-y-2 p-4">
      <p className="text-[10px] font-bold uppercase text-muted">Post requirement</p>
      <div className="rounded-lg border-2 border-ink/15 bg-white p-3">
        <p className="text-xs font-bold">Class 10 Maths · HSR · Weekend</p>
        <p className="mt-1 text-[10px] text-muted">Board exam · home tuition</p>
        <span className="mt-2 inline-flex rounded-md bg-butter px-2 py-0.5 text-[9px] font-bold text-ink">
          Your identity hidden on board
        </span>
      </div>
    </div>,
    <div key="p1" className="space-y-2 p-4">
      <p className="text-[10px] font-bold text-coral">3 connection requests · auto-sent</p>
      {[
        { name: "Priya Nair", sub: "Maths · HSR", verified: true },
        { name: "Rahul Menon", sub: "IIT Physics · Koramangala", verified: true },
      ].map((t) => (
        <div key={t.name} className="rounded-lg border-2 border-ink/10 bg-white p-2.5">
          <p className="flex items-center gap-1 text-xs font-bold text-ink">
            {t.name}
            {t.verified && <BadgeCheck className="h-3 w-3 text-sage" />}
          </p>
          <p className="text-[10px] text-muted">{t.sub}</p>
          <p className="mt-1 flex items-center gap-1 text-[9px] font-semibold text-muted">
            <Lock className="h-2.5 w-2.5" /> Number hidden until accept
          </p>
        </div>
      ))}
    </div>,
    <div key="p2" className="space-y-2 p-4">
      <p className="text-[10px] font-bold uppercase text-muted">Parent dashboard</p>
      <div className="rounded-lg border-2 border-ink bg-lavender p-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-ink bg-white text-[10px] font-bold">PN</span>
          <div>
            <p className="flex items-center gap-1 text-xs font-bold text-ink">
              Priya Nair <BadgeCheck className="h-3 w-3 text-sage" />
            </p>
            <p className="text-[10px] text-muted">View profile · Read pitch</p>
          </div>
        </div>
        <p className="mt-2 rounded-md bg-white/80 px-2 py-1.5 text-[10px] leading-relaxed text-muted">
          10+ yrs CBSE maths, HSR & Koramangala. Sat–Sun open for board exam prep.
        </p>
        <div className="mt-2 flex gap-1.5">
          <span className="flex-1 rounded-md bg-sage py-1 text-center text-[9px] font-bold text-white">Accept</span>
          <span className="flex-1 rounded-md border border-ink/20 bg-white py-1 text-center text-[9px] font-bold text-muted">Decline</span>
        </div>
      </div>
    </div>,
    <div key="p3" className="space-y-2 p-4">
      <div className="flex items-center gap-2 rounded-lg border-2 border-ink bg-sage-wash px-3 py-2">
        <Check className="h-3.5 w-3.5 text-sage" />
        <p className="text-xs font-bold text-sage">Accepted — WhatsApp unlocked</p>
      </div>
      <div className="rounded-lg bg-[#ECE5DD] p-2.5">
        <div className="ml-auto max-w-[85%] rounded-lg rounded-tr-sm bg-[#DCF8C6] px-2.5 py-1.5 text-[11px]">
          Hi Priya! Can we start Saturday for Class 10 maths?
        </div>
      </div>
    </div>,
  ];
  return screens[step] ?? screens[0];
}

function ParentFlowSection() {
  const [path, setPath] = useState<"search" | "post">("search");
  const [step, setStep] = useState(0);
  const steps = path === "search" ? searchSteps : postSteps;

  return (
    <section className="bg-white py-12 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <SectionHeader
          number="02"
          eyebrow="How it works"
          title="Two paths."
          accent="Same free outcome."
          description="Search the directory yourself, or post your need — tutors pitch with their profile and each pitch becomes a connection request on your dashboard. Both end on WhatsApp when you accept."
        />

        <div className="mx-auto mt-10 flex max-w-md justify-center gap-2 rounded-xl border-2 border-ink/10 bg-cream p-1.5">
          {(["search", "post"] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => { setPath(p); setStep(0); }}
              className={cn(
                "flex-1 rounded-lg px-4 py-2.5 text-sm font-bold transition-all",
                path === p
                  ? "border-2 border-ink bg-white text-ink shadow-[2px_2px_0_0_#1c1a17]"
                  : "text-muted hover:text-ink",
              )}
            >
              {p === "search" ? "Search tutors" : "Post requirement"}
            </button>
          ))}
        </div>

        <div className={cn("mt-10 overflow-hidden rounded-2xl border-2 border-ink lg:grid lg:grid-cols-[1fr_1.1fr]", hardShadow)}>
          <div className="bg-butter p-6 sm:p-8 lg:p-10">
            <LpStepTimeline steps={steps} activeIndex={step} onSelect={setStep} />
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={path === "search" ? "/search" : "/parent/signup"}
                className={cn(
                  "inline-flex h-11 items-center gap-2 rounded-lg border-2 border-ink bg-coral px-5 text-sm font-bold text-white hover:bg-coral-dark",
                  hardShadowSm,
                )}
              >
                {path === "search" ? <Search className="h-4 w-4" /> : <Megaphone className="h-4 w-4" />}
                {path === "search" ? "Start searching" : "Post requirement"}
              </Link>
            </div>
          </div>
          <div className="border-t-2 border-ink bg-cream-band/80 lg:border-l-2 lg:border-t-0">
            <div className="border-b-2 border-ink/10 bg-white px-5 py-3">
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted">
                Step {step + 1} preview · {path === "search" ? "Search flow" : "Post flow"}
              </p>
            </div>
            <BrowserFrame url={`mentr.in / parent / ${path === "search" ? "search" : "dashboard"}`} headerClassName="bg-cream" className="rounded-none border-0 shadow-none">
              <FlowMock path={path} step={step} />
            </BrowserFrame>
          </div>
        </div>
      </div>
    </section>
  );
}

function ParentSwitchSection() {
  const [active, setActive] = useState(switchTabs[0].id);
  const current = switchTabs.find((t) => t.id === active)!;

  return (
    <section className="relative overflow-hidden bg-cream py-12 sm:py-20 lg:py-28">
      <LpGridBg className="opacity-20" />
      <div className="relative mx-auto max-w-[1120px] px-4 sm:px-6 lg:px-8">
        <SectionHeader
          number="03"
          eyebrow="Already using something else?"
          title="Switch to Mentr"
          accent="in one search."
          description="Bring your tutor search over — without the fees, cuts, or chaos."
        />

        <div className="mx-auto mt-12 grid max-w-3xl gap-3 sm:grid-cols-3">
          {switchTabs.map((tab) => (
            <LpSwitchTab
              key={tab.id}
              letter={tab.letter}
              label={tab.label}
              blurb={tab.blurb}
              letterBg={tab.letterBg}
              isActive={active === tab.id}
              onClick={() => setActive(tab.id)}
            />
          ))}
        </div>

        <div className={cn("mt-8 overflow-hidden rounded-2xl border-2 border-ink bg-white lg:grid lg:grid-cols-2", hardShadow)}>
          <div className="relative flex flex-col justify-between overflow-hidden bg-butter p-7 sm:p-9 lg:p-10">
            <LpBlob color="rgba(255,154,77,0.15)" size={180} className="-right-10 -top-10" />
            <div className="relative">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">{current.tag}</p>
                <span className="rounded-full border border-ink/20 bg-white px-2.5 py-0.5 text-[10px] font-bold text-sage">
                  Migrate in {current.migrate}
                </span>
              </div>
              <h3 className="mt-4 text-2xl font-bold tracking-tight text-ink sm:text-[34px] sm:leading-[1.12]">
                {current.headline}
                <span className="mt-1 block text-coral">{current.accent}</span>
              </h3>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink/70">{current.description}</p>
            </div>
            <Link
              href={current.ctaHref}
              className={cn(
                "relative mt-8 inline-flex h-12 w-fit items-center gap-2 rounded-xl border-2 border-ink bg-coral px-6 text-sm font-bold text-white hover:bg-coral-dark",
                hardShadowSm,
              )}
            >
              {current.cta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="flex flex-col border-t-2 border-ink bg-white lg:border-l-2 lg:border-t-0">
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

function RequirementBoardSection() {
  const pitches = [
    {
      name: "Priya Nair",
      subject: "Mathematics · Class 9–12",
      area: "HSR & Koramangala",
      msg: "10+ yrs CBSE maths. Sat–Sun open. Board exam specialist.",
      time: "2h ago",
    },
    {
      name: "Rahul Menon",
      subject: "Physics · IIT Prep",
      area: "Koramangala",
      msg: "IIT grad, board exam specialist. Can start this week.",
      time: "5h ago",
    },
    {
      name: "Anita Desai",
      subject: "Chemistry · Board & JEE",
      area: "Jayanagar",
      msg: "Flexible timing. Home visits in HSR & BTM.",
      time: "1d ago",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-lavender py-12 sm:py-20 lg:py-28">
      <LpBlob color="rgba(217,208,255,0.5)" size={300} className="-left-20 bottom-0" />
      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="order-2 lg:order-1">
            <LpMockStage
              chips={[
                { label: "3 requests", className: "-right-3 top-6", style: {} },
                { label: "Profiles visible", className: "-left-4 bottom-12", style: { transform: "rotate(-3deg)" } },
              ]}
            >
              <BrowserFrame url="mentr.in / parent / dashboard" className="border-2 border-ink">
                <div className="bg-cream p-4 sm:p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-bold text-ink">My requirements</p>
                    <span className="rounded-md bg-coral-wash px-2 py-1 text-[10px] font-bold text-coral">2 pending</span>
                  </div>
                  <div className="mb-4 rounded-xl border-2 border-ink bg-white p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-coral">Your requirement</p>
                        <p className="mt-1.5 text-base font-bold text-ink">Class 10 Mathematics</p>
                        <p className="text-sm text-muted">Weekend · HSR Layout · Board exam</p>
                      </div>
                      <LpLiveDot label="Open" />
                    </div>
                  </div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-muted">
                    Tutor responses · connection requests
                  </p>
                  <div className="space-y-2.5">
                    {pitches.map((pitch, i) => (
                      <div
                        key={pitch.name}
                        className={cn(
                          "rounded-xl border-2 bg-white p-3.5",
                          i === 0 ? "border-ink shadow-[2px_2px_0_0_#1c1a17]" : "border-ink/10",
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2.5">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 border-ink bg-lavender text-xs font-bold text-ink">
                              {pitch.name.split(" ").map((w) => w[0]).join("")}
                            </span>
                            <div>
                              <p className="flex items-center gap-1 text-sm font-bold text-ink">
                                {pitch.name}
                                <BadgeCheck className="h-3.5 w-3.5 text-sage" />
                              </p>
                              <p className="text-[11px] font-medium text-coral">{pitch.subject}</p>
                              <p className="text-[10px] text-muted">{pitch.area} · {pitch.time}</p>
                            </div>
                          </div>
                          {i === 0 && (
                            <span className="shrink-0 rounded-md bg-coral-wash px-2 py-0.5 text-[9px] font-bold text-coral">
                              New
                            </span>
                          )}
                        </div>
                        <p className="mt-2 text-[11px] leading-relaxed text-muted">{pitch.msg}</p>
                        <div className="mt-2.5 flex flex-wrap items-center gap-2">
                          <span className="rounded-md border border-ink/15 bg-cream px-2 py-1 text-[9px] font-bold text-ink">
                            View profile
                          </span>
                          <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-muted">
                            <Lock className="h-2.5 w-2.5" />
                            Number hidden
                          </span>
                          {i === 0 && (
                            <span className="ml-auto rounded-md bg-sage px-2.5 py-1 text-[9px] font-bold text-white">
                              Accept
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </BrowserFrame>
            </LpMockStage>
          </div>

          <div className="order-1 lg:order-2">
            <SectionHeader
              align="left"
              number="04"
              eyebrow="Or post your need"
              title="Let tutors"
              accent="come to you."
              description="Post your requirement. Tutors pitch with their profile — each pitch auto-sends a connection request to your dashboard. Review profiles, accept who fits, WhatsApp unlocks."
            />
            <ol className="mt-8 space-y-4">
              {postSteps.map((s, i) => (
                <li key={s.title} className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-ink bg-coral text-sm font-bold text-white shadow-[2px_2px_0_0_#1c1a17]">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-bold text-ink">{s.title}</p>
                    <p className="mt-0.5 text-sm text-muted">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-10 flex flex-wrap gap-3">
              <PostRequirementButton size="lg" />
              <Link href="/parent/signup">
                <Button size="lg" variant="secondary">Create parent account</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ParentTestimonials() {
  const items = useTestimonialNames(parentTestimonials);

  return (
    <section className="bg-cream-band py-12 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <SectionHeader number="05" eyebrow="From the community" title="Parents & tutors." accent="Same free platform." />
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {items.map((item, i) => (
            <LpTestimonialCard key={i} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ParentFaqPreview() {
  const preview = [
    { q: "Is Mentr really 100% free?", cat: "Fees" },
    { q: "How do parents contact a teacher?", cat: "Parents" },
    { q: "Why can't I see a teacher's number right away?", cat: "Safety" },
    { q: "Can I post my requirement instead of searching?", cat: "Parents" },
  ];

  return (
    <section className="bg-lavender py-12 sm:py-20">
      <div className="mx-auto max-w-[800px] px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Common questions" title="Everything parents ask" accent="before signing up." />
        <div className="mt-10 space-y-3">
          {preview.map((item, i) => (
            <LpFaqLink key={item.q} question={item.q} index={i + 1} category={item.cat} />
          ))}
        </div>
        <p className="mt-8 text-center">
          <Link href="/faq" className="inline-flex items-center gap-1.5 text-sm font-bold text-coral hover:underline">
            See all {12} FAQs <ArrowRight className="h-4 w-4" />
          </Link>
        </p>
      </div>
    </section>
  );
}

export function ParentsLanding() {
  return (
    <main>
      <ParentsHero />
      <LpStatsBand stats={parentStats} />
      <GlobalReachMap />
      <ParentsTrust />
      <ParentFlowSection />
      <LpSectionDivider className="bg-cream" bandClass="bg-white" />
      <ParentSwitchSection />
      <RequirementBoardSection />
      <SubjectGallery />
      <LpSectionDivider className="bg-lavender" bandClass="bg-white" />
      <ParentTestimonials />
      <ParentFaqPreview />
      <LpFinalCta
        eyebrow="Ready to find a tutor?"
        title="Your child's teacher is one search away."
        description="Search verified tutors or post your requirement — tutors pitch with their profile, you accept on your dashboard, then WhatsApp. No agent fees, no commission."
        primaryLabel="Search tutors — free"
        primaryHref="/search"
        secondaryLabel="Post your requirement"
        secondaryHref="/parent/signup"
        perks={["Free forever", "No credit card", "Verified tutors", "Direct WhatsApp"]}
      />
    </main>
  );
}
