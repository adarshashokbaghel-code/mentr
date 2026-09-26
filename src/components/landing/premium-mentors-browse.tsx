"use client";

import { ConnectButton } from "@/components/connect/connect-button";
import { Button } from "@/components/ui/button";
import { MentorPhoto } from "@/components/ui/mentor-photo";
import {
  MentorStatusBadges,
  PremiumMentorBadge,
} from "@/components/ui/mentor-status-badges";
import {
  fetchPremiumTeachers,
  formatHourlyRate,
  modeLabels,
  type Teacher,
} from "@/lib/teachers";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Crown,
  Globe2,
  Home,
  MapPin,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const PREVIEW_LIMIT = 12;
/** ~3 cards visible on desktop in the 1400px rail */
const CARD_WIDTH = "w-[200px] sm:w-[260px] lg:w-[300px]";

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

function primarySubject(teacher: Teacher): string {
  return (
    teacher.subjects[0] ||
    teacher.subjectLine.split("&")[0]?.trim() ||
    "Tutor"
  );
}

function PremiumBrowseCard({ teacher }: { teacher: Teacher }) {
  const name = displayName(teacher.name);
  const subject = primarySubject(teacher);
  const rate = formatHourlyRate(teacher.hourlyRate);
  const modes = modeLabels(teacher);
  const profileHref = `/teachers/${teacher.id}`;

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-xl bg-white",
        "border border-white/60 shadow-[0_12px_32px_rgba(20,28,60,0.16)]",
        "ring-1 ring-[#c4a574]/30 transition duration-300",
        "hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(20,28,60,0.2)]",
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#eef1ff]">
        <Link href={profileHref} className="absolute inset-0 block">
          <MentorPhoto
            name={name}
            initials={teacher.initials}
            kind={teacher.kind}
            imageUrl={teacher.imageUrl}
            size="fill"
            showInitials
            rounded="xl"
            className="!absolute !inset-0 !h-full !w-full !rounded-none !border-0 object-cover transition duration-500 group-hover:scale-[1.04]"
            alt=""
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#14182a]/65 via-transparent to-transparent" />
        </Link>

        <div className="absolute left-2 top-2 z-10">
          <PremiumMentorBadge size="sm" label="Premium" />
        </div>

        {rate ? (
          <span className="absolute bottom-2 right-2 z-10 rounded-md bg-white/95 px-1.5 py-0.5 text-[11px] font-bold tabular-nums text-ink shadow-sm">
            {rate}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1">
            <Link
              href={profileHref}
              className="min-w-0 truncate text-[13px] font-bold tracking-tight text-ink transition hover:text-[#5b7cfa]"
            >
              {name}
            </Link>
            {teacher.verified ? (
              <MentorStatusBadges verified size="sm" />
            ) : null}
          </div>
          <p className="mt-0.5 truncate text-[11px] font-semibold text-[#6b87f5]">
            {subject}
            {teacher.experienceYears > 0
              ? ` · ${teacher.experienceYears} yrs`
              : ""}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-medium text-muted">
          <span className="inline-flex max-w-full items-center gap-0.5 truncate">
            <MapPin className="h-2.5 w-2.5 shrink-0 text-[#c4a574]" />
            <span className="truncate">
              {teacher.locality || teacher.area || "Online"}
            </span>
          </span>
          {modes.slice(0, 1).map((m) => (
            <span
              key={m}
              className="inline-flex items-center gap-0.5 rounded-full border border-hairline bg-cream/80 px-1.5 py-px font-semibold text-ink"
            >
              {m === "Online" ? (
                <Globe2 className="h-2.5 w-2.5 text-[#6b87f5]" />
              ) : (
                <Home className="h-2.5 w-2.5 text-[#c4a574]" />
              )}
              {m}
            </span>
          ))}
        </div>

        <div className="mt-auto flex gap-1.5 pt-0.5">
          <ConnectButton
            teacher={{
              id: teacher.id,
              name: teacher.name,
              subjectLine: teacher.subjectLine,
              phone: teacher.phone,
              connectionStatus: teacher.connectionStatus,
              live: teacher.live !== false,
              premium: true,
            }}
            label="Connect"
            className={cn(
              "inline-flex h-8 flex-1 items-center justify-center gap-1 rounded-lg",
              "bg-gradient-to-r from-[#5b7cfa] to-[#c4a574]",
              "text-[11px] font-bold text-white",
              "transition hover:brightness-105",
            )}
            requestedClassName={cn(
              "inline-flex h-8 flex-1 items-center justify-center gap-1 rounded-lg",
              "border border-hairline bg-cream text-[11px] font-semibold text-muted",
            )}
          />
          <Link href={profileHref} className="flex-1">
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-full rounded-lg px-2 text-[11px] font-semibold"
            >
              Profile
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}

function PremiumCarousel({ mentors }: { mentors: Teacher[] }) {
  const loop = useMemo(() => {
    if (mentors.length === 0) return [];
    // Enough copies for seamless -50% marquee on wide screens
    const copies = mentors.length >= 6 ? 2 : mentors.length >= 3 ? 3 : 4;
    return Array.from({ length: copies }, () => mentors).flat();
  }, [mentors]);

  if (mentors.length === 0) return null;

  const durationSec = Math.max(24, mentors.length * 5);

  return (
    <div className="relative mt-8 sm:mt-10">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[#3a4688] to-transparent sm:w-14" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[#5a5240] to-transparent sm:w-14" />

      <div className="overflow-hidden">
        <div
          className="flex w-max gap-3 py-1 animate-marquee sm:gap-4"
          style={{ animationDuration: `${durationSec}s` }}
        >
          {loop.map((t, i) => (
            <div
              key={`${t.id}-${i}`}
              className={cn("shrink-0", CARD_WIDTH)}
            >
              <PremiumBrowseCard teacher={t} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Homepage Premium strip — compact 3-up auto-scroll carousel.
 */
export function PremiumMentorsBrowse() {
  const [mentors, setMentors] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void fetchPremiumTeachers().then(({ teachers, failed }) => {
      if (cancelled) return;
      if (!failed) setMentors(teachers.slice(0, PREVIEW_LIMIT));
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      className="relative overflow-hidden"
      aria-labelledby="premium-browse-heading"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-br from-[#2f3d7a] via-[#4556a0] to-[#6a5740]"
      />
      <div
        aria-hidden
        className="absolute -left-24 -top-10 h-72 w-72 rounded-full bg-[#9eb4ff]/30 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-28 -right-16 h-80 w-80 rounded-full bg-[#c4a574]/28 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 home-premium-glass-shine opacity-40"
      />

      <div className="relative mx-auto max-w-[1400px] px-4 py-8 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#e8d5b5] sm:text-[11px]">
              <Crown className="h-3.5 w-3.5" />
              Premium mentors
            </p>
            <h2
              id="premium-browse-heading"
              className="mt-1.5 text-2xl font-bold tracking-tight text-white sm:mt-2 sm:text-4xl"
            >
              100% verified tutors, ready to connect
            </h2>
            <p className="mt-2 max-w-[52ch] text-[13px] leading-relaxed text-white/75 sm:mt-3 sm:text-base">
              Hand-checked Premium mentors with complete profiles. Browse free,
              connect with or without login — no agency fee.
            </p>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[12px] font-semibold text-white/85 sm:mt-4 sm:gap-x-5 sm:gap-y-2 sm:text-[13px]">
              <li className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-[#9eb4ff] sm:h-4 sm:w-4" />
                Identity verified
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Crown className="h-3.5 w-3.5 text-[#c4a574] sm:h-4 sm:w-4" />
                Premium badge
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-[#e8d5b5] sm:h-4 sm:w-4" />
                Fast response
              </li>
            </ul>
          </div>

         
        </div>

        {loading && mentors.length === 0 ? (
          <div className="mt-6 flex gap-3 overflow-hidden sm:mt-10 sm:gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "aspect-[3/4] shrink-0 animate-pulse rounded-xl bg-white/10",
                  CARD_WIDTH,
                )}
              />
            ))}
          </div>
        ) : mentors.length > 0 ? (
          <PremiumCarousel mentors={mentors} />
        ) : (
          <div className="mt-6 rounded-2xl border border-white/20 bg-white/10 px-4 py-10 text-center text-[13px] text-white/75 sm:mt-8 sm:px-5 sm:py-12 sm:text-sm">
            Premium mentors will appear here soon.{" "}
            <Link
              href="/premiummentors"
              className="font-semibold text-[#e8d5b5] underline-offset-2 hover:underline"
            >
              Open the Premium page
            </Link>
          </div>
        )}

        {mentors.length > 0 ? (
          <div className="mt-6 flex justify-center sm:mt-9">
            <Link href="/premiummentors">
              <Button
                size="md"
                variant="secondary"
                className="h-10 gap-2 rounded-xl border-white/30 bg-white/10 text-[13px] text-white hover:bg-white/18 sm:h-11 sm:text-sm"
              >
                See full Premium directory
                <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
