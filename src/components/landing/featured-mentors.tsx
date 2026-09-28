"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MentorPhoto } from "@/components/ui/mentor-photo";
import { MentorStatusBadges, PremiumMentorBadge } from "@/components/ui/mentor-status-badges";
import {
  fetchPublicTeachers,
  formatHourlyRate,
  modeLabels,
  type Teacher,
} from "@/lib/teachers";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Globe2,
  GraduationCap,
  Home,
  MapPin,
  Sparkles,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const FEATURED_LIMIT = 12;
/** 5 per row on desktop, fewer on smaller screens (gap is 1rem / 1.25rem). */
const CARD_WIDTH =
  "w-[72%] sm:w-[calc((100%-2.5rem)/3)] lg:w-[calc((100%-3.75rem)/4)] xl:w-[calc((100%-5rem)/5)]";

function scoreTeacher(t: Teacher): number {
  let score = 0;
  if (t.premium) score += 50;
  if (t.imageUrl?.trim()) score += 40;
  if (t.verified) score += 25;
  if (t.hourlyRate != null && t.hourlyRate > 0) score += 15;
  if (t.bio?.trim() && t.bio.trim().length > 40) score += 10;
  if (t.openSlots > 0) score += 8;
  if ((t.modes || []).length > 0) score += 5;
  if (t.experienceYears >= 3) score += 5;
  return score;
}

function pickFeatured(teachers: Teacher[]): Teacher[] {
  return [...teachers]
    .sort((a, b) => {
      const d = scoreTeacher(b) - scoreTeacher(a);
      if (d !== 0) return d;
      return (b.createdAt || "").localeCompare(a.createdAt || "");
    })
    .slice(0, FEATURED_LIMIT);
}

function displayName(name: string): string {
  const cleaned = name.replace(/\s+/g, " ").trim();
  const parts = cleaned.split(" ");
  if (parts.length >= 4) {
    const mid = Math.floor(parts.length / 2);
    const a = parts.slice(0, mid).join(" ").toLowerCase();
    const b = parts.slice(mid).join(" ").toLowerCase();
    if (a === b) return parts.slice(0, mid).join(" ");
  }
  return cleaned;
}

function shortBio(bio: string, max = 140): string {
  const one = bio.replace(/\s+/g, " ").trim();
  if (one.length <= max) return one;
  return `${one.slice(0, max - 1).trim()}…`;
}

function primarySubject(teacher: Teacher): string {
  return (
    teacher.subjects[0] ||
    teacher.subjectLine.split("&")[0]?.trim() ||
    "Tutor"
  );
}

function headline(teacher: Teacher): string {
  return (
    teacher.qualification?.trim() ||
    teacher.designation?.trim() ||
    teacher.subjectLine
  );
}

/** Large equal-width spotlight — premium mentors get stronger visual weight. */
function SpotlightCard({ teacher }: { teacher: Teacher }) {
  const rate = formatHourlyRate(teacher.hourlyRate);
  const modes = modeLabels(teacher);
  const profileHref = `/teachers/${teacher.id}`;
  const name = displayName(teacher.name);
  const subject = primarySubject(teacher);
  const cred = headline(teacher);
  const place = teacher.locality || teacher.area || "India";
  const premium = Boolean(teacher.premium);

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border bg-white transition duration-300",
        "hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(28,26,23,0.08)]",
        premium
          ? "border-[#e8c84a]/55 shadow-[0_4px_0_0_rgba(232,200,74,0.35)] ring-1 ring-[#e8c84a]/25"
          : "border-hairline hover:border-ink/15",
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-cream-band">
        <Link href={profileHref} className="absolute inset-0 block">
          <MentorPhoto
            name={name}
            initials={teacher.initials}
            kind={teacher.kind}
            imageUrl={teacher.imageUrl}
            size="fill"
            showInitials={false}
            rounded="xl"
            className="!absolute !inset-0 !h-full !w-full !rounded-none !border-0 transition duration-500 group-hover:scale-[1.03]"
            alt=""
          />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/55 to-transparent" />
          {rate ? (
            <span className="absolute bottom-2 right-2 rounded-md bg-white/95 px-1.5 py-0.5 text-[12px] font-bold tabular-nums text-ink shadow-sm">
              {rate}
            </span>
          ) : null}
        </Link>

        {premium ? (
          <span className="absolute left-2 top-2 z-10">
            <PremiumMentorBadge size="sm" />
          </span>
        ) : teacher.verified ? (
          <span className="absolute left-2 top-2 z-10">
            <MentorStatusBadges verified size="sm" />
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="min-w-0">
          <Link
            href={profileHref}
            className="block truncate text-[15px] font-bold tracking-tight text-ink hover:text-coral"
          >
            {name}
          </Link>
          <p className="mt-0.5 truncate text-[12px] font-semibold text-coral">
            {subject}
            {teacher.experienceYears > 0
              ? ` · ${teacher.experienceYears} yrs`
              : ""}
          </p>
          {cred ? (
            <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-ink/65">
              <GraduationCap className="h-3 w-3 shrink-0 text-coral" />
              <span className="truncate">{cred}</span>
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] font-medium text-muted">
          <span className="inline-flex min-w-0 items-center gap-1">
            <MapPin className="h-3 w-3 shrink-0 text-coral" />
            <span className="truncate capitalize">{place}</span>
          </span>
          {modes.slice(0, 2).map((m) => (
            <span key={m} className="inline-flex items-center gap-1">
              {m === "Online" ? (
                <Globe2 className="h-3 w-3 text-coral" />
              ) : (
                <Home className="h-3 w-3 text-coral" />
              )}
              {m}
            </span>
          ))}
        </div>

        {teacher.bio?.trim() ? (
          <p className="line-clamp-2 text-[11px] leading-relaxed text-muted">
            {shortBio(teacher.bio, 110)}
          </p>
        ) : null}

        <div className="mt-auto flex gap-1.5 pt-1">
          <Link href={profileHref} className="flex-1">
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-full rounded-lg px-2 text-[11px] font-semibold"
            >
              Profile
            </Button>
          </Link>
          <Link
            href={`/parent/signup?next=${encodeURIComponent(profileHref)}`}
            className="flex-1"
          >
            <Button
              size="sm"
              className={cn(
                "h-8 w-full rounded-lg px-2 text-[11px] font-semibold",
                premium && "shadow-[2px_2px_0_0_rgba(28,26,23,0.2)]",
              )}
            >
              Connect
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}

/** One strip of large spotlight cards — arrows + swipe. */
function FeaturedStrip({ teachers }: { teachers: Teacher[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) {
      setCanPrev(false);
      setCanNext(false);
      return;
    }
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(max > 4 && el.scrollLeft < max - 4);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      ro.disconnect();
    };
  }, [teachers, updateArrows]);

  function scrollByDir(dir: -1 | 1) {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-featured-card]");
    const gap = 20;
    const step = (card?.offsetWidth ?? el.clientWidth * 0.8) + gap;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }

  if (teachers.length === 0) return null;

  const showArrows = teachers.length > 1;

  return (
    <div className="relative">
      {showArrows ? (
        <>
          <button
            type="button"
            aria-label="Previous mentors"
            disabled={!canPrev}
            onClick={() => scrollByDir(-1)}
            className={cn(
              "absolute left-0 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-2 border-ink bg-white text-ink shadow-[2px_2px_0_0_#1a231c] transition sm:flex",
              "hover:bg-cream disabled:pointer-events-none disabled:opacity-30",
              "-translate-x-1 lg:-translate-x-3",
            )}
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
          </button>
          <button
            type="button"
            aria-label="Next mentors"
            disabled={!canNext}
            onClick={() => scrollByDir(1)}
            className={cn(
              "absolute right-0 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-2 border-ink bg-white text-ink shadow-[2px_2px_0_0_#1a231c] transition sm:flex",
              "hover:bg-cream disabled:pointer-events-none disabled:opacity-30",
              "translate-x-1 lg:translate-x-3",
            )}
          >
            <ChevronRight className="h-5 w-5" strokeWidth={2.5} />
          </button>
        </>
      ) : null}

      <div
        ref={scrollerRef}
        className={cn(
          "flex gap-4 overflow-x-auto overscroll-x-contain pb-2 pt-1",
          "snap-x snap-mandatory scroll-smooth",
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "sm:gap-5",
        )}
      >
        {teachers.map((t) => (
          <div
            key={t.id}
            data-featured-card
            className={cn("shrink-0 snap-start", CARD_WIDTH)}
          >
            <SpotlightCard teacher={t} />
          </div>
        ))}
      </div>

      {/* Mobile: compact arrow row */}
      {showArrows ? (
        <div className="mt-3 flex items-center justify-center gap-3 sm:hidden">
          <button
            type="button"
            aria-label="Previous mentors"
            disabled={!canPrev}
            onClick={() => scrollByDir(-1)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink bg-white text-ink shadow-[2px_2px_0_0_#1a231c] disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
          </button>
          <button
            type="button"
            aria-label="Next mentors"
            disabled={!canNext}
            onClick={() => scrollByDir(1)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink bg-white text-ink shadow-[2px_2px_0_0_#1a231c] disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>
      ) : null}
    </div>
  );
}

function FeaturedSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden sm:gap-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "shrink-0 overflow-hidden rounded-2xl border border-hairline bg-white",
            CARD_WIDTH,
          )}
        >
          <div className="aspect-[4/3] animate-pulse bg-cream-band" />
          <div className="space-y-2 p-3">
            <div className="h-4 w-32 animate-pulse rounded bg-cream-band" />
            <div className="h-3 w-20 animate-pulse rounded bg-cream-band" />
            <div className="h-3 w-full animate-pulse rounded bg-cream-band" />
            <div className="h-8 w-full animate-pulse rounded-lg bg-cream-band" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function FeaturedMentors({
  className,
}: {
  className?: string;
}) {
  const [teachers, setTeachers] = useState<Teacher[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const featuredRes = await fetch("/api/teachers/featured");
        if (featuredRes.ok) {
          const data = (await featuredRes.json()) as {
            teachers?: Teacher[];
          };
          const curated = Array.isArray(data.teachers) ? data.teachers : [];
          if (!cancelled && curated.length > 0) {
            setTeachers(
              curated.map((t) => ({
                ...t,
                lat: Number.isFinite(t.lat) ? t.lat : NaN,
                lng: Number.isFinite(t.lng) ? t.lng : NaN,
              })),
            );
            return;
          }
        }
      } catch {
        /* fall through to auto pick */
      }

      const { teachers: live, failed } = await fetchPublicTeachers();
      if (cancelled) return;
      if (failed || live.length === 0) {
        setTeachers([]);
        return;
      }
      setTeachers(pickFeatured(live));
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const ordered = teachers
    ? [
        ...teachers.filter((t) => t.premium),
        ...teachers.filter((t) => !t.premium),
      ]
    : [];

  if (teachers && teachers.length === 0) return null;

  return (
    <section
      id="featured-tutors"
      className={cn(
        "border-b border-hairline bg-white py-8 short:py-5 shorter:py-4 sm:py-12 short:sm:py-7",
        className,
      )}
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="inline-flex items-center gap-1 text-xs font-semibold text-coral">
              <Sparkles className="h-3 w-3" />
              Featured for parents
            </p>
            <h2 className="mt-1.5 text-xl font-bold tracking-tight text-ink sm:text-2xl">
              Premium mentors parents{" "}
              <span className="text-coral">hire first</span>
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              Hand-picked, ID-verified tutors. Swipe or use the arrows to see
              more — connecting is free.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/premiummentors">
              <Button
                size="sm"
                variant="secondary"
                className="h-9 rounded-lg text-xs"
              >
                Browse Premium
              </Button>
            </Link>
            <Link href="/parent/signup?next=/parent/dashboard%23instant-connect">
              <Button size="sm" className="h-9 gap-1 rounded-lg text-xs">
                <Zap className="h-3.5 w-3.5" />
                Instant Connect
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-5 sm:mt-6">
          {teachers == null ? (
            <FeaturedSkeleton />
          ) : (
            <FeaturedStrip teachers={ordered} />
          )}
        </div>
      </div>
    </section>
  );
}
