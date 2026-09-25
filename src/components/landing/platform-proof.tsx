"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BENGALURU_SEO_SUBJECTS } from "@/lib/seo-programmatic";
import { LAUNCH_HUB_CITY, SITE_BRAND } from "@/lib/seo";
import { formatMentorCount, useMentorCount } from "@/lib/mentor-stats";
import { SUBJECTS } from "@/lib/teachers";
import { slugify } from "@/lib/seo-hubs";
import { cn } from "@/lib/utils";
import {
  BadgeCheck,
  BookOpen,
  MapPin,
  MessageCircle,
  Search,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

const SUBJECT_FLOOR = SUBJECTS.length;

const highlights = [
  {
    icon: Search,
    title: "Search by subject & area",
    body: "Filter Maths, History, Coding and more — home or online, near you in Bengaluru or across India.",
  },
  {
    icon: Zap,
    title: "Instant Connect",
    body: "Need a tutor today? Match with verified mentors in minutes — free to try.",
  },
  {
    icon: MessageCircle,
    title: "Post a requirement",
    body: "Tell us class, board, and budget. Tutors pitch you — you stay anonymous until you accept.",
  },
] as const;

/**
 * Parent-driven proof section — replaces the old worldwide/map block.
 * Highlights live tutor count, subjects, and conversion paths for SEO + clarity.
 */
export function PlatformProof({
  className,
  id = "platform-proof",
}: {
  className?: string;
  id?: string;
}) {
  const mentorCount = useMentorCount();
  const tutorLabel = formatMentorCount(mentorCount);
  const subjectCount = SUBJECT_FLOOR;

  const stats = [
    {
      value: tutorLabel,
      label: "Tutors & mentors",
      sub: "Verified profiles live",
      tint: "bg-lavender",
      icon: Users,
    },
    {
      value: `${subjectCount}+`,
      label: "Subjects offered",
      sub: "School · exams · skills",
      tint: "bg-butter",
      icon: BookOpen,
    },
    {
      value: "₹0",
      label: "Platform fee",
      sub: "Parents & faculty",
      tint: "bg-sage-wash",
      icon: Sparkles,
    },
    {
      value: LAUNCH_HUB_CITY,
      label: "Home hub",
      sub: "Local + online India",
      tint: "bg-coral-wash",
      icon: MapPin,
    },
  ];

  const subjectLinks = BENGALURU_SEO_SUBJECTS.slice(0, 8);

  return (
    <section
      id={id}
      className={cn(
        "border-y border-hairline bg-cream py-10 short:py-6 shorter:py-4 sm:py-16 short:sm:py-8",
        className,
      )}
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-8 sm:gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
          <div className="text-center lg:text-left">
            <p className="text-sm font-semibold text-coral">
              Built for parents
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink sm:text-3xl lg:text-[40px] lg:leading-[1.15]">
              {tutorLabel === "…" ? "Verified" : tutorLabel} tutors.{" "}
              {subjectCount}+ subjects.{" "}
              <span className="text-coral">Zero platform fees.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted lg:mx-0">
              {SITE_BRAND} helps parents find verified tutors and mentors for
              school, boards, and skills — search free, post a requirement, or
              try Instant Connect. WhatsApp unlocks only after both sides
              accept.
            </p>

            <div className="mt-7 grid grid-cols-2 gap-2.5 sm:gap-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className={cn(
                    "rounded-2xl border border-hairline p-3.5 text-left sm:p-4",
                    stat.tint,
                  )}
                >
                  <stat.icon className="h-4 w-4 text-ink/70" aria-hidden />
                  <p className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-[28px]">
                    {stat.value}
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-ink">
                    {stat.label}
                  </p>
                  <p className="text-xs text-muted">{stat.sub}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start">
              <Link href="/search">
                <Button className="gap-1.5">
                  <Search className="h-4 w-4" />
                  Browse tutors
                </Button>
              </Link>
              <Link href="/parent/signup?next=/parent/dashboard%23instant-connect">
                <Button variant="secondary" className="gap-1.5">
                  <Zap className="h-4 w-4" />
                  Instant Connect
                </Button>
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-hairline bg-white p-4 shadow-[0_16px_48px_rgba(28,26,23,0.08)] sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
                What parents get
              </p>
              <span className="inline-flex items-center gap-1 rounded-full bg-sage-wash px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-sage">
                <BadgeCheck className="h-3 w-3" />
                Verified
              </span>
            </div>

            <ul className="mt-4 space-y-3">
              {highlights.map((item) => (
                <li
                  key={item.title}
                  className="flex gap-3 rounded-xl border border-hairline bg-cream/60 p-3.5 text-left"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-coral shadow-sm">
                    <item.icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-ink">{item.title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-muted">
                      {item.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-5 text-left">
              <p className="text-xs font-bold uppercase tracking-wide text-muted">
                Popular subjects in {LAUNCH_HUB_CITY}
              </p>
              <ul className="mt-2.5 flex flex-wrap gap-1.5">
                {subjectLinks.map((subject) => (
                  <li key={subject}>
                    <Link
                      href={`/tutors/bengaluru/${slugify(subject)}-tutors`}
                      className="inline-flex rounded-full border border-hairline bg-cream px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-coral/40 hover:text-coral"
                    >
                      {subject}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/tutors/bengaluru"
                className="mt-3 inline-block text-sm font-semibold text-coral hover:underline"
              >
                All tutors in {LAUNCH_HUB_CITY} →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Back-compat export for pages still importing GlobalReachMap */
export function GlobalReachMap(props: {
  className?: string;
  id?: string;
}) {
  return <PlatformProof {...props} id={props.id ?? "global-reach"} />;
}
