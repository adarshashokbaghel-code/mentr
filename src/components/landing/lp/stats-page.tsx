"use client";

import {
  hardShadow,
  hardShadowLg,
  hardShadowSm,
  LpBadge,
  LpBlob,
  LpGridBg,
} from "@/components/landing/lp/shared";
import { SATISFIED_PARENTS, usePlatformStats } from "@/lib/mentor-stats";
import { STATS_FAQS } from "@/lib/stats-page-content";
import Image from "next/image";
import { SUBJECTS } from "@/lib/teachers";
import { TOOLS, toolOgImagePath } from "@/lib/tools-catalog";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  BookOpen,
  Camera,
  ChevronDown,
  Code2,
  GraduationCap,
  Crown,
  Headphones,
  MessageCircle,
  PlayCircle,
  ScanLine,
  Search,
  Send,
  Sparkles,
  Star,
  Unlock,
  Users,
  Wallet,
  Wrench,
  Zap,
} from "lucide-react";
import Link from "next/link";
import {
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

/** Marketing headline figure for parents, per growth team. */
const PARENTS_HEADLINE = SATISFIED_PARENTS;
const LEARN_CONTENT_HOURS = 5;

/** 4,029 → 4,000 so a "+" suffix stays true as the bank grows. */
const floorForDisplay = (n: number) =>
  n >= 1000 ? Math.floor(n / 100) * 100 : n;

const PARENT_SIGNUP =
  "/parent/signup?next=/parent/dashboard%23instant-connect";
const MENTOR_SIGNUP = "/faculty/signup";

/* ── Motion helpers ─────────────────────────────────────────────── */

function useInView<T extends Element>(threshold = 0.25) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [inView, threshold]);

  return { ref, inView };
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

/** Counts 0 → `to` once `start` is true; slows down near the end (…193, 194, 195). */
function useCountUp(to: number, start: boolean, duration = 2200, delay = 0) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start || to <= 0) return;
    const total = prefersReducedMotion() ? 0 : duration;
    let raf = 0;
    let t0 = 0;
    const tick = (now: number) => {
      if (!t0) t0 = now + (total ? delay : 0);
      const p = total ? Math.max(0, now - t0) / total : 1;
      setValue(Math.round(easeOutExpo(Math.min(1, p)) * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, start, duration, delay]);

  return { value, done: to > 0 && value >= to };
}

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.15);
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-all duration-700 ease-out motion-reduce:transition-none",
        inView
          ? "translate-y-0 opacity-100"
          : "translate-y-6 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100",
        className,
      )}
    >
      {children}
    </div>
  );
}

const fmt = (n: number) => n.toLocaleString("en-IN");

/* ── Hero ───────────────────────────────────────────────────────── */

type StatTile = {
  to: number;
  prefix?: string;
  suffix?: string;
  label: string;
  sub: string;
  icon: typeof Users;
  /** Icon chip background */
  tint: string;
  /** Top accent bar */
  bar: string;
};

function StatCounter({
  tile,
  start,
  delay,
}: {
  tile: StatTile;
  start: boolean;
  delay: number;
}) {
  const { value, done } = useCountUp(tile.to, start, 1800, delay);
  const Icon = tile.icon;

  return (
    <div
      className={cn(
        "group relative flex h-full flex-col gap-3 overflow-hidden rounded-2xl border-2 border-ink bg-white p-4 text-left transition duration-300 hover:-translate-y-1 sm:flex-row sm:items-center sm:gap-4 sm:p-5",
        hardShadowSm,
      )}
    >
      <span aria-hidden className={cn("absolute inset-x-0 top-0 h-1.5", tile.bar)} />
      <Icon
        aria-hidden
        className="pointer-events-none absolute -bottom-4 -right-4 h-20 w-20 text-ink/[0.05] transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110"
      />
      <span
        className={cn(
          "relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-ink transition-transform duration-300 group-hover:rotate-6 sm:h-12 sm:w-12",
          tile.tint,
        )}
      >
        <Icon className="h-5 w-5 text-ink" />
      </span>
      <div className="relative min-w-0">
        <p
          className={cn(
            "origin-left text-[26px] font-black leading-none tabular-nums tracking-tight text-ink transition-transform duration-300 sm:text-[32px]",
            done && "scale-[1.04]",
          )}
          aria-label={`${tile.prefix ?? ""}${fmt(tile.to)}${tile.suffix ?? ""} ${tile.label}`}
        >
          <span aria-hidden>
            {tile.prefix}
            {fmt(value)}
            <span className="text-coral">{tile.suffix}</span>
          </span>
        </p>
        <p className="mt-1.5 text-[13px] font-bold leading-tight text-ink sm:text-sm">
          {tile.label}
        </p>
        <p className="mt-0.5 text-[11px] leading-snug text-muted sm:text-xs">
          {tile.sub}
        </p>
      </div>
    </div>
  );
}

function StatsHero() {
  const stats = usePlatformStats();
  const mentorCount = stats?.mentors ?? 0;
  const { ref, inView } = useInView<HTMLDivElement>(0.2);
  const hero = useCountUp(mentorCount, inView && mentorCount > 0, 2600);

  const tiles: StatTile[] = [
    {
      to: PARENTS_HEADLINE,
      suffix: "+",
      label: "Satisfied parents",
      sub: "Found tutors on Mentr",
      icon: Star,
      tint: "bg-butter",
      bar: "bg-butter-deep",
    },
    {
      to: stats?.subjects ?? 0,
      suffix: "+",
      label: "Subjects taught",
      sub: "School, exams, languages & skills",
      icon: BookOpen,
      tint: "bg-lavender",
      bar: "bg-[#8b7cf6]",
    },
    {
      to: 100,
      suffix: "%",
      label: "Fees kept by tutors",
      sub: "No commission, ever",
      icon: Wallet,
      tint: "bg-coral-wash",
      bar: "bg-coral",
    },
    {
      to: LEARN_CONTENT_HOURS,
      suffix: "hrs+",
      label: "Mentr Learn content",
      sub: "Self-paced video lessons",
      icon: PlayCircle,
      tint: "bg-sage-wash",
      bar: "bg-sage",
    },
    {
      to: TOOLS.length,
      label: "Free study tools",
      sub: "CGPA, timetable, PDF & more",
      icon: Wrench,
      tint: "bg-[#e0f2fe]",
      bar: "bg-[#38bdf8]",
    },
    {
      to: floorForDisplay(stats?.snapGradeQuestions ?? 4000),
      suffix: "+",
      label: "Snap & Grade questions",
      sub: "AI checks handwritten answers",
      icon: ScanLine,
      tint: "bg-butter",
      bar: "bg-ink",
    },
  ];

  return (
    <section className="relative overflow-hidden border-b border-hairline bg-cream">
      <LpGridBg />
      <LpBlob color="rgba(235,228,255,0.75)" size={380} className="-left-32 -top-24" />
      <LpBlob color="rgba(255,228,210,0.8)" size={320} className="-right-24 top-1/3" />
      <LpBlob color="rgba(230,246,238,0.7)" size={260} className="bottom-0 left-1/3 hidden sm:block" />

      <div
        ref={ref}
        className="relative mx-auto flex max-w-[1100px] flex-col items-center px-4 pb-12 pt-10 text-center sm:px-6 sm:pb-16 sm:pt-14 lg:pb-20 lg:pt-16"
      >
        <h1 className="whitespace-nowrap text-[clamp(0.95rem,3.8vw,2.75rem)] font-bold leading-[1.1] tracking-tight text-ink">
          Verified tutors. Real parents.{" "}
          <span className="text-coral">₹0 to start.</span>
        </h1>

        <div className="relative mt-8 sm:mt-10">
          <div
            aria-hidden
            className="absolute inset-x-6 -bottom-2 top-4 -z-10 rounded-[2rem] bg-gradient-to-r from-coral/20 via-butter/40 to-sage/25 blur-2xl"
          />
          <div
            className={cn(
              "rounded-3xl border-2 border-ink bg-white px-8 py-5 sm:px-14 sm:py-7",
              hardShadowLg,
            )}
          >
            <p
              className="bg-gradient-to-br from-ink via-ink to-coral bg-clip-text text-[76px] font-black leading-none tracking-tighter text-transparent tabular-nums sm:text-[120px] lg:text-[150px]"
              aria-label={
                mentorCount > 0
                  ? `${mentorCount}+ verified tutors and mentors`
                  : "Verified tutors and mentors"
              }
            >
              <span aria-hidden>
                {mentorCount > 0 ? fmt(hero.value) : "0"}
                <span
                  className={cn(
                    "inline-block text-coral transition-all duration-500",
                    hero.done ? "scale-100 opacity-100" : "scale-50 opacity-0",
                  )}
                >
                  +
                </span>
              </span>
            </p>
            <p className="mt-2 text-sm font-bold uppercase tracking-[0.16em] text-muted sm:text-base">
              Verified tutors &amp; mentors
            </p>
          </div>
        </div>

        <div className="mt-8 grid w-full max-w-5xl grid-cols-2 gap-3 sm:mt-10 sm:gap-4 lg:grid-cols-3">
          {tiles.map((tile, i) => (
            <StatCounter
              key={tile.label}
              tile={tile}
              start={inView}
              delay={400 + i * 140}
            />
          ))}
        </div>

        <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:mt-10 sm:max-w-none sm:flex-row sm:justify-center">
          <Link
            href={PARENT_SIGNUP}
            className={cn(
              "inline-flex h-13 items-center justify-center gap-2 rounded-xl border-2 border-ink bg-coral px-7 text-[15px] font-bold text-white transition hover:-translate-y-0.5 hover:bg-coral-dark",
              hardShadowSm,
            )}
          >
            <Search className="h-4 w-4" />
            Find a tutor — free
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href={MENTOR_SIGNUP}
            className={cn(
              "inline-flex h-13 items-center justify-center gap-2 rounded-xl border-2 border-ink bg-white px-7 text-[15px] font-bold text-ink transition hover:-translate-y-0.5 hover:bg-cream-band",
              hardShadowSm,
            )}
          >
            <BadgeCheck className="h-4 w-4 text-sage" />
            I&apos;m a tutor — list free
          </Link>
        </div>
        <p className="mt-4 text-xs text-muted">
          No login to browse · WhatsApp opens after the tutor accepts · No
          commission
        </p>
      </div>

      <SubjectMarquee />
    </section>
  );
}

function SubjectMarquee() {
  const items = [...SUBJECTS, ...SUBJECTS];
  return (
    <div className="relative overflow-hidden border-t-2 border-ink bg-ink py-2.5">
      <div className="animate-marquee flex w-max gap-8 whitespace-nowrap">
        {items.map((s, i) => (
          <span
            key={`${s}-${i}`}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-white/80"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-butter" aria-hidden />
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Audience split ─────────────────────────────────────────────── */

function AudienceCard({
  tag,
  title,
  points,
  cta,
  href,
  accent,
  icon: Icon,
}: {
  tag: string;
  title: string;
  points: string[];
  cta: string;
  href: string;
  accent: "coral" | "sage";
  icon: typeof Users;
}) {
  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-2xl border-2 border-ink bg-white p-5 transition duration-300 hover:-translate-y-1 sm:p-7",
        hardShadow,
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl border-2 border-ink",
            accent === "coral" ? "bg-coral text-white" : "bg-sage text-white",
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
        <span
          className={cn(
            "text-xs font-bold uppercase tracking-[0.14em]",
            accent === "coral" ? "text-coral" : "text-sage",
          )}
        >
          {tag}
        </span>
      </div>
      <h3 className="mt-4 text-xl font-bold tracking-tight text-ink sm:text-2xl">
        {title}
      </h3>
      <ul className="mt-4 flex-1 space-y-2.5">
        {points.map((p) => (
          <li key={p} className="flex gap-2.5 text-sm leading-snug text-ink/85">
            <BadgeCheck
              className={cn(
                "mt-0.5 h-4 w-4 shrink-0",
                accent === "coral" ? "text-coral" : "text-sage",
              )}
            />
            {p}
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className={cn(
          "mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-ink text-sm font-bold transition hover:-translate-y-0.5",
          accent === "coral"
            ? "bg-coral text-white hover:bg-coral-dark"
            : "bg-butter text-ink hover:bg-butter-deep",
          hardShadowSm,
        )}
      >
        {cta}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function AudienceSplit() {
  return (
    <section className="relative bg-white py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
            Built for both sides
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink sm:text-3xl lg:text-4xl">
            One platform. <span className="text-coral">Zero middlemen.</span>
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-5 sm:mt-10 md:grid-cols-2 md:gap-6">
          <Reveal>
            <AudienceCard
              tag="For parents"
              title="Find the right tutor this week"
              icon={Users}
              accent="coral"
              points={[
                "Browse verified home & online tutors — no login needed",
                "Instant Connect: get matched with available tutors fast",
                "Post your need once and let tutors come to you",
                "Chat on WhatsApp only after the tutor accepts",
              ]}
              cta="Find a tutor — free"
              href={PARENT_SIGNUP}
            />
          </Reveal>
          <Reveal delay={120}>
            <AudienceCard
              tag="For tutors & mentors"
              title="Get students without lead fees"
              icon={BadgeCheck}
              accent="sage"
              points={[
                "List free with a verified profile parents trust",
                "Receive connect requests from parents near you or online",
                "Pitch on the requirements board — 3 free pitches a day",
                "Keep 100% of your fees — no coins, no commission",
              ]}
              cta="List as a tutor — free"
              href={MENTOR_SIGNUP}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ── How it works ───────────────────────────────────────────────── */

const STEPS = [
  {
    icon: Search,
    title: "Search or post",
    desc: "Parents browse by subject, class & area — or post a requirement.",
  },
  {
    icon: Send,
    title: "Connect free",
    desc: "Send a request. Tutors accept or pitch — no charge on either side.",
  },
  {
    icon: MessageCircle,
    title: "Talk on WhatsApp",
    desc: "Numbers unlock after acceptance. Fix a trial and start classes.",
  },
];

function HowItWorks() {
  return (
    <section className="relative overflow-hidden border-y border-hairline bg-cream-band py-12 sm:py-16">
      <LpGridBg className="opacity-20" />
      <div className="relative mx-auto max-w-[1100px] px-4 sm:px-6">
        <Reveal className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
            How it works
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            From search to first class in <span className="text-coral">3 steps</span>
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:mt-10 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 120}>
              <div
                className={cn(
                  "relative h-full rounded-2xl border-2 border-ink bg-white p-5",
                  hardShadowSm,
                )}
              >
                <span className="absolute right-4 top-4 text-3xl font-black text-ink/10">
                  0{i + 1}
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-ink bg-butter">
                  <s.icon className="h-5 w-5 text-ink" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-ink">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Product showcase (Learn · Snap & Grade · Tools) ────────────── */

function ProductBlock({
  eyebrow,
  eyebrowIcon: EyebrowIcon,
  title,
  accent,
  description,
  points,
  image,
  imageAlt,
  primary,
  secondary,
  reverse,
  tint,
}: {
  eyebrow: string;
  eyebrowIcon: typeof Users;
  title: string;
  accent: string;
  description: string;
  points: { icon: typeof Users; text: string }[];
  image: string;
  imageAlt: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string }[];
  reverse?: boolean;
  tint: string;
}) {
  return (
    <article className="grid items-center gap-6 md:grid-cols-2 md:gap-10 lg:gap-14">
      <Reveal className={cn(reverse && "md:order-2")}>
        <div className="relative">
          <div
            aria-hidden
            className={cn(
              "absolute -inset-2 -z-10 rotate-[-2deg] rounded-3xl border-2 border-ink sm:-inset-3",
              tint,
            )}
          />
          <div
            className={cn(
              "relative aspect-[16/10] overflow-hidden rounded-2xl border-2 border-ink bg-white",
              hardShadow,
            )}
          >
            <Image
              src={image}
              alt={imageAlt}
              fill
              sizes="(min-width: 768px) 520px, 100vw"
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>
      </Reveal>
      <Reveal delay={120} className="text-center md:text-left">
        <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-coral">
          <EyebrowIcon className="h-4 w-4" />
          {eyebrow}
        </p>
        <h3 className="mt-3 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          {title} <span className="text-coral">{accent}</span>
        </h3>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted sm:text-base md:mx-0">
          {description}
        </p>
        <ul className="mx-auto mt-5 grid max-w-lg gap-2.5 text-left md:mx-0">
          {points.map((p) => (
            <li key={p.text} className="flex items-start gap-3 text-sm text-ink/85">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 border-ink/10 bg-cream">
                <p.icon className="h-3.5 w-3.5 text-ink" />
              </span>
              <span className="pt-1 leading-snug">{p.text}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row md:items-center">
          <Link
            href={primary.href}
            className={cn(
              "inline-flex h-11 items-center justify-center gap-2 rounded-xl border-2 border-ink bg-ink px-5 text-sm font-bold text-white transition hover:-translate-y-0.5",
              hardShadowSm,
            )}
          >
            {primary.label}
            <ArrowRight className="h-4 w-4" />
          </Link>
          {secondary?.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="text-sm font-bold text-coral hover:underline"
            >
              {s.label} →
            </Link>
          ))}
        </div>
      </Reveal>
    </article>
  );
}

function ToolsShowcase() {
  return (
    <div>
      <Reveal className="text-center">
        <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-coral">
          <Wrench className="h-4 w-4" />
          Free study tools
        </p>
        <h3 className="mt-3 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          {TOOLS.length} free tools. <span className="text-coral">No signup.</span>
        </h3>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
          CGPA calculator, study timetable, PDF merge &amp; compress, images to
          PDF, background remover and more — runs in your browser, files stay
          on your device.
        </p>
      </Reveal>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {TOOLS.map((tool, i) => (
          <Reveal key={tool.slug} delay={(i % 4) * 70}>
            <Link
              href={`/tools/${tool.slug}`}
              className={cn(
                "group flex h-full flex-col overflow-hidden rounded-xl border-2 border-ink bg-white transition hover:-translate-y-1",
                hardShadowSm,
              )}
            >
              <div className="relative aspect-[16/9] overflow-hidden border-b-2 border-ink bg-cream">
                {tool.slug === "word-counter" ? (
                  <div className="flex h-full items-center justify-center text-2xl font-black text-ink/20">
                    Aa 123
                  </div>
                ) : (
                  <Image
                    src={toolOgImagePath(tool.slug)}
                    alt={`${tool.title} — free online tool`}
                    fill
                    sizes="(min-width: 1024px) 260px, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="flex flex-1 items-center justify-between gap-2 px-3 py-2.5">
                <span className="text-[13px] font-bold leading-tight text-ink">
                  {tool.title}
                </span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-coral" />
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
      <div className="mt-6 text-center">
        <Link href="/tools" className="text-sm font-bold text-coral hover:underline">
          Open all free tools →
        </Link>
      </div>
    </div>
  );
}

function ProductShowcase() {
  return (
    <section
      id="free-for-students"
      className="relative overflow-hidden bg-white py-14 sm:py-20"
    >
      <div className="mx-auto max-w-[1100px] space-y-16 px-4 sm:space-y-24 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
            More than a tutor directory
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink sm:text-3xl lg:text-4xl">
            Free learning for every student, <span className="text-coral">built in.</span>
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
            Mentr Learn for young coders, Snap &amp; Grade for board-exam
            practice, and free study tools — alongside verified tutors.
          </p>
        </Reveal>

        <ProductBlock
          eyebrow="Mentr Learn · Class 3–5"
          eyebrowIcon={GraduationCap}
          title="Free coding for kids."
          accent="5hrs+ of lessons."
          description="Computer science, AI literacy and math-for-coding across 60 modules — narrated video lessons kids can follow on their own. ₹0 forever, no credit card."
          points={[
            { icon: PlayCircle, text: "Narrated video lessons with quizzes" },
            { icon: Code2, text: "Build Arena and hands-on practice" },
            { icon: Star, text: "Problem of the Day to build a habit" },
          ]}
          image="/learn/learn-offer-video.png"
          imageAlt="Child watching a Mentr Learn coding video lesson on a laptop"
          primary={{ label: "Start Mentr Learn free", href: "/learn/start" }}
          secondary={[{ label: "See syllabus", href: "/learn/syllabus" }]}
          tint="bg-sage-wash"
        />

        <ProductBlock
          reverse
          eyebrow="Snap & Grade · CBSE Class 9–12"
          eyebrowIcon={Camera}
          title="Snap your answer."
          accent="Get CBSE step marks."
          description="Photograph a handwritten answer to an NCERT or board practice question and see marks per step — so students stop losing marks on presentation."
          points={[
            { icon: ScanLine, text: "4,000+ Maths & Science practice questions" },
            { icon: BadgeCheck, text: "Step-wise marks and feedback as per CBSE marking" },
            { icon: Sparkles, text: "Free credits to start — no subscription" },
          ]}
          image="/snapandgrade/hero.png"
          imageAlt="Student photographing a handwritten algebra solution for Snap & Grade"
          primary={{ label: "Try Snap & Grade", href: "/snapandgrade" }}
          tint="bg-butter"
        />

        <ToolsShowcase />
      </div>
    </section>
  );
}

/* ── FAQ ────────────────────────────────────────────────────────── */

function FaqSection() {
  return (
    <section className="border-t border-hairline bg-cream-band py-12 sm:py-16">
      <div className="mx-auto max-w-[820px] px-4 sm:px-6">
        <Reveal className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
            FAQ
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Questions parents &amp; tutors ask
          </h2>
        </Reveal>
        <div className="mt-8 space-y-3">
          {STATS_FAQS.map((f) => (
            <details
              key={f.question}
              className="group rounded-xl border-2 border-ink bg-white px-4 py-3 open:shadow-[3px_3px_0_0_#1c1a17] sm:px-5"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-left text-[15px] font-bold text-ink [&::-webkit-details-marker]:hidden">
                {f.question}
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Premium ────────────────────────────────────────────────────── */

const PREMIUM_FEATURES = [
  {
    icon: Zap,
    title: "Unlimited pitches",
    desc: "Pitch on every parent requirement — no daily cap.",
  },
  {
    icon: Unlock,
    title: "Daily parent unlocks",
    desc: "Reveal verified parent contacts every day.",
  },
  {
    icon: Bell,
    title: "Instant new-parent alerts",
    desc: "Email the moment a parent signs up — reach them first.",
  },
  {
    icon: Star,
    title: "Featured placement",
    desc: "Spotlight on the Mentr homepage parents see first.",
  },
  {
    icon: Headphones,
    title: "Dedicated SPOC",
    desc: "A real person to help you grow on Mentr.",
  },
  {
    icon: BadgeCheck,
    title: "Premium badge",
    desc: "Stand out in search with a trusted badge.",
  },
];

function PremiumSection() {
  return (
    <section className="relative overflow-hidden bg-ink py-14 text-white sm:py-20">
      <LpBlob color="rgba(255,154,77,0.14)" size={360} className="-left-24 top-0" />
      <LpBlob color="rgba(47,158,110,0.12)" size={300} className="-right-20 bottom-0" />
      <div className="relative mx-auto grid max-w-[1100px] items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
        <Reveal className="text-center lg:text-left">
          <LpBadge variant="dark" className="mx-auto lg:mx-0">
            <Crown className="h-3.5 w-3.5 text-butter" />
            Premium for mentors
          </LpBadge>
          <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl lg:text-[44px] lg:leading-[1.08]">
            Get to parents <span className="text-butter">before anyone else.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-white/70 lg:mx-0">
            Free works. Premium makes you first in line — with instant alerts,
            unlimited pitches and featured placement.
          </p>
          <div className="mt-6 flex items-end justify-center gap-2 lg:justify-start">
            <span className="text-5xl font-black tracking-tight text-butter">$5</span>
            <span className="pb-1.5 text-sm font-semibold text-white/60">
              / month · ₹449 in India
            </span>
          </div>
          <p className="mt-1 text-xs text-white/50">
            No GST on top · longer plans save up to 18%
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              href="/mentrpricing"
              className={cn(
                "inline-flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-ink bg-butter px-6 text-sm font-bold text-ink transition hover:-translate-y-0.5 hover:bg-butter-deep",
                hardShadowSm,
              )}
            >
              See Premium plans
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={MENTOR_SIGNUP}
              className="inline-flex h-12 items-center justify-center rounded-xl border-2 border-white/25 px-6 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Start free first
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {PREMIUM_FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 80}>
              <div className="group h-full rounded-2xl border border-white/15 bg-white/[0.05] p-4 transition duration-300 hover:-translate-y-1 hover:border-butter/50 hover:bg-white/[0.08] sm:p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-butter/15 text-butter transition group-hover:bg-butter group-hover:text-ink">
                  <f.icon className="h-4.5 w-4.5" />
                </span>
                <h3 className="mt-3 text-sm font-bold sm:text-base">{f.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-white/60 sm:text-[13px]">
                  {f.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Final CTA ──────────────────────────────────────────────────── */

function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-cream py-12 sm:py-16">
      <LpGridBg className="opacity-25" />
      <div className="relative mx-auto max-w-[900px] px-4 sm:px-6">
        <Reveal>
          <div
            className={cn(
              "rounded-3xl border-2 border-ink bg-white p-6 text-center sm:p-10",
              hardShadowLg,
            )}
          >
            <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl lg:text-4xl">
              Join the numbers. <span className="text-coral">It&apos;s free.</span>
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted sm:text-base">
              Parents find verified tutors in minutes. Tutors get students
              without paying for leads. Sign up with just your email.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <Link
                href={PARENT_SIGNUP}
                className={cn(
                  "group flex items-center justify-between gap-3 rounded-2xl border-2 border-ink bg-coral px-5 py-4 text-left text-white transition hover:-translate-y-0.5 hover:bg-coral-dark",
                  hardShadowSm,
                )}
              >
                <span>
                  <span className="block text-xs font-bold uppercase tracking-wider text-white/75">
                    I&apos;m a parent
                  </span>
                  <span className="block text-base font-bold">Find a tutor free</span>
                </span>
                <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
              </Link>
              <Link
                href={MENTOR_SIGNUP}
                className={cn(
                  "group flex items-center justify-between gap-3 rounded-2xl border-2 border-ink bg-butter px-5 py-4 text-left text-ink transition hover:-translate-y-0.5 hover:bg-butter-deep",
                  hardShadowSm,
                )}
              >
                <span>
                  <span className="block text-xs font-bold uppercase tracking-wider text-ink/60">
                    I&apos;m a tutor
                  </span>
                  <span className="block text-base font-bold">List free, keep 100%</span>
                </span>
                <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
              </Link>
            </div>
            <p className="mt-5 text-xs text-muted">
              Just browsing?{" "}
              <Link href="/search" className="font-bold text-coral hover:underline">
                See tutors without signing up →
              </Link>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function StatsLanding() {
  return (
    <main>
      <StatsHero />
      <AudienceSplit />
      <HowItWorks />
      <ProductShowcase />
      <PremiumSection />
      <FaqSection />
      <FinalCta />
    </main>
  );
}
