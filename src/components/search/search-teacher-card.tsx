"use client";

import { ConnectButton } from "@/components/connect/connect-button";
import { SaveTeacherButton } from "@/components/search/save-teacher-button";
import { ProfilePlaceholder } from "@/components/ui/profile-placeholder";
import { formatDistanceKm } from "@/lib/geo";
import { type Teacher } from "@/lib/teachers";
import { cn } from "@/lib/utils";
import {
  BadgeCheck,
  Briefcase,
  CalendarDays,
  MapPin,
  Star,
} from "lucide-react";
import Link from "next/link";

interface SearchTeacherCardProps {
  teacher: Teacher;
  className?: string;
  distanceKm?: number;
}

function CardPhoto({
  teacher,
  available,
  asLink,
  profileHref,
}: {
  teacher: Teacher;
  available: boolean;
  asLink: boolean;
  profileHref: string;
}) {
  const inner = (
    <>
      <ProfilePlaceholder
        name={teacher.name}
        initials={teacher.initials}
        kind={teacher.kind}
        size="fill"
        rounded="lg"
        className="!absolute !inset-0 !h-full !w-full !rounded-none !border-0"
      />
      <div className="absolute left-2 top-2 flex gap-1.5">
        {available ? (
          <span className="rounded-md bg-white/95 px-1.5 py-0.5 text-[10px] font-semibold text-sage">
            {teacher.openSlots} open
          </span>
        ) : (
          <span className="rounded-md bg-ink/70 px-1.5 py-0.5 text-[10px] font-semibold text-white">
            Booked
          </span>
        )}
      </div>
      {teacher.reviewCount > 0 ? (
        <span className="absolute right-2 top-2 inline-flex items-center gap-0.5 rounded-md bg-white/95 px-1.5 py-0.5 text-[10px] font-bold text-ink">
          <Star className="h-2.5 w-2.5 fill-coral text-coral" />
          {teacher.rating.toFixed(1)}
        </span>
      ) : (
        <span className="absolute right-2 top-2 rounded-md bg-coral px-1.5 py-0.5 text-[10px] font-bold text-white">
          New
        </span>
      )}
      <div className="absolute bottom-2 right-2" data-shortlist>
        <SaveTeacherButton teacherId={teacher.id} size="sm" />
      </div>
    </>
  );

  const shellClass =
    "relative block aspect-[4/3] overflow-hidden bg-cream-band";

  if (asLink) {
    return (
      <Link href={profileHref} className={shellClass}>
        {inner}
      </Link>
    );
  }

  return <div className={shellClass}>{inner}</div>;
}

/** Compact vertical card — landing theme, light radius, no heavy CTAs */
export function SearchTeacherCard({
  teacher,
  className,
  distanceKm,
}: SearchTeacherCardProps) {
  const available = teacher.openSlots > 0;
  const nextSlot = teacher.slots.find((s) => s.available)?.label;
  const profileHref = `/teachers/${teacher.id}`;

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-lg border border-hairline bg-white transition",
        "hover:border-ink/20 hover:shadow-sm",
        !available && "opacity-70",
        className,
      )}
    >
      <CardPhoto
        teacher={teacher}
        available={available}
        asLink
        profileHref={profileHref}
      />

      <div className="flex flex-1 flex-col p-3">
        <div className="flex items-start gap-1">
          <Link
            href={profileHref}
            className="min-w-0 flex-1 truncate text-sm font-semibold text-ink hover:text-coral"
          >
            {teacher.name}
          </Link>
          {teacher.verified && (
            <BadgeCheck
              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sage"
              aria-label="Verified"
            />
          )}
        </div>

        <p className="mt-0.5 truncate text-xs font-medium text-coral">
          {teacher.subjectLine}
        </p>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted">
          <span className="inline-flex items-center gap-0.5">
            <MapPin className="h-3 w-3" />
            {distanceKm != null
              ? formatDistanceKm(distanceKm)
              : teacher.locality}
          </span>
          <span className="inline-flex items-center gap-0.5">
            <Briefcase className="h-3 w-3" />
            {teacher.experienceYears} yrs
          </span>
          {teacher.reviewCount > 0 && (
            <span className="tabular-nums">({teacher.reviewCount})</span>
          )}
        </div>

        <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-muted">
          {teacher.bio}
        </p>

        {nextSlot && available && (
          <p className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-medium text-sage">
            <CalendarDays className="h-3 w-3" />
            {nextSlot}
          </p>
        )}

        <div className="mt-auto flex items-center gap-1.5 pt-3" data-connect>
          {available ? (
            <ConnectButton
              teacher={teacher}
              label="Connect"
              className="inline-flex h-8 flex-1 items-center justify-center gap-1 rounded-md bg-coral text-[11px] font-semibold text-white transition hover:bg-coral-dark"
              requestedClassName="inline-flex h-8 flex-1 items-center justify-center gap-1 rounded-md bg-cream text-[11px] font-semibold text-muted"
            />
          ) : (
            <span className="inline-flex h-8 flex-1 items-center justify-center rounded-md bg-cream text-[11px] font-semibold text-muted">
              Notify
            </span>
          )}
          <Link
            href={profileHref}
            className="inline-flex h-8 items-center justify-center rounded-md border border-hairline px-2.5 text-[11px] font-semibold text-ink transition hover:bg-cream"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
