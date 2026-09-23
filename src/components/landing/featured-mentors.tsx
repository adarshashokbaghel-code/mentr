"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MentorPhoto } from "@/components/ui/mentor-photo";
import { MentorStatusBadges } from "@/components/ui/mentor-status-badges";
import {
  fetchPublicTeachers,
  formatHourlyRate,
  modeLabels,
  type Teacher,
} from "@/lib/teachers";
import { cn } from "@/lib/utils";
import {
  Globe2,
  Home,
  MapPin,
  Sparkles,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

const FEATURED_LIMIT = 8;

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
  // Collapse accidental "Name Name" duplication from profile data
  if (parts.length >= 4) {
    const mid = Math.floor(parts.length / 2);
    const a = parts.slice(0, mid).join(" ").toLowerCase();
    const b = parts.slice(mid).join(" ").toLowerCase();
    if (a === b) return parts.slice(0, mid).join(" ");
  }
  return cleaned;
}

function shortBio(bio: string): string {
  const one = bio.replace(/\s+/g, " ").trim();
  if (one.length <= 90) return one;
  return `${one.slice(0, 87).trim()}…`;
}

function FeaturedCard({ teacher }: { teacher: Teacher }) {
  const rate = formatHourlyRate(teacher.hourlyRate);
  const modes = modeLabels(teacher);
  const profileHref = `/teachers/${teacher.id}`;
  const name = displayName(teacher.name);
  const subject =
    teacher.subjects[0] || teacher.subjectLine.split("&")[0]?.trim() || "Tutor";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-hairline bg-white transition hover:border-ink/15 hover:shadow-sm">
      <Link
        href={profileHref}
        className="relative block aspect-[4/3] overflow-hidden bg-cream-band"
      >
        <MentorPhoto
          name={name}
          initials={teacher.initials}
          kind={teacher.kind}
          imageUrl={teacher.imageUrl}
          size="fill"
          showInitials={false}
          rounded="xl"
          className="!absolute !inset-0 !h-full !w-full !rounded-none !border-0"
          alt=""
        />
        {teacher.verified || teacher.premium ? (
          <span className="absolute left-2 top-2">
            <MentorStatusBadges
              verified={teacher.verified}
              premium={teacher.premium}
            />
          </span>
        ) : null}
        {rate && (
          <span className="absolute right-2 top-2 rounded bg-ink/85 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-white">
            {rate}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 p-2.5 sm:p-3">
        <div className="min-w-0">
          <Link
            href={profileHref}
            className="block truncate text-[13px] font-semibold text-ink hover:text-coral"
          >
            {name}
          </Link>
          <p className="truncate text-[11px] font-medium text-coral">
            {subject}
          </p>
        </div>

        <div className="flex flex-wrap gap-1">
          {modes.slice(0, 2).map((m) => (
            <span
              key={m}
              className="inline-flex items-center gap-0.5 rounded-full border border-hairline bg-cream/70 px-1.5 py-px text-[9px] font-semibold text-ink"
            >
              {m === "Online" ? (
                <Globe2 className="h-2.5 w-2.5 text-coral" />
              ) : (
                <Home className="h-2.5 w-2.5 text-coral" />
              )}
              {m}
            </span>
          ))}
        </div>

        <p className="flex items-center gap-1 text-[10px] text-muted">
          <MapPin className="h-2.5 w-2.5 shrink-0" />
          <span className="truncate">
            {teacher.locality || teacher.area || "India"}
          </span>
          {teacher.experienceYears > 0 && (
            <span className="shrink-0">· {teacher.experienceYears} yrs</span>
          )}
        </p>

        {teacher.bio?.trim() && (
          <p className="line-clamp-2 text-[10px] leading-snug text-muted">
            {shortBio(teacher.bio)}
          </p>
        )}

        <div className="mt-auto flex gap-1.5 pt-1.5">
          <Link href={profileHref} className="flex-1">
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-full rounded-lg px-2 text-[11px]"
            >
              View
            </Button>
          </Link>
          <Link
            href={`/parent/signup?next=${encodeURIComponent(profileHref)}`}
            className="flex-1"
          >
            <Button size="sm" className="h-8 w-full rounded-lg px-2 text-[11px]">
              Connect
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}

function FeaturedSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-xl border border-hairline bg-white"
        >
          <div className="aspect-[4/3] animate-pulse bg-cream-band" />
          <div className="space-y-1.5 p-2.5">
            <div className="h-3 w-24 animate-pulse rounded bg-cream-band" />
            <div className="h-2.5 w-16 animate-pulse rounded bg-cream-band" />
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
              Tutors parents are hiring{" "}
              <span className="text-coral">right now</span>
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              Hand-picked verified profiles — subjects, areas, and fees. Connect
              free or try Instant Connect.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/search">
              <Button
                size="sm"
                variant="secondary"
                className="h-9 rounded-lg text-xs"
              >
                Browse all
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
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 lg:grid-cols-4">
              {teachers.map((t) => (
                <FeaturedCard key={t.id} teacher={t} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
