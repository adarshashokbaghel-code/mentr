"use client";

import { ConnectButton } from "@/components/connect/connect-button";
import { SaveTeacherButton } from "@/components/search/save-teacher-button";
import { MentorStatusBadges } from "@/components/ui/mentor-status-badges";
import { MentorPhoto } from "@/components/ui/mentor-photo";
import { formatDistanceKm } from "@/lib/geo";
import {
  formatHourlyRate,
  modeLabels,
  type Teacher,
} from "@/lib/teachers";
import { cn } from "@/lib/utils";
import {
  Award,
  Briefcase,
  CalendarDays,
  Globe2,
  Home,
  MapPin,
  PlayCircle,
  Star,
} from "lucide-react";
import Link from "next/link";

interface SearchTeacherCardProps {
  teacher: Teacher;
  className?: string;
  distanceKm?: number;
}

/**
 * Full-width, low-height list row — details scannable in one horizontal pass.
 */
export function SearchTeacherCard({
  teacher,
  className,
  distanceKm,
}: SearchTeacherCardProps) {
  const available = teacher.openSlots > 0;
  const openSlotLabels = teacher.slots
    .filter((s) => s.available)
    .map((s) => s.label);
  const nextSlot = openSlotLabels[0];
  const shownSlots = openSlotLabels.slice(0, 4);
  const extraSlots = Math.max(0, openSlotLabels.length - shownSlots.length);
  const profileHref = `/teachers/${teacher.id}`;
  const rate = formatHourlyRate(teacher.hourlyRate);
  const modes = modeLabels(teacher);
  const languages = (teacher.languages || []).slice(0, 3);
  const subjects = teacher.subjects.slice(0, 6);
  const extraSubjects = Math.max(0, teacher.subjects.length - subjects.length);
  const certifications = (teacher.certifications || []).slice(0, 2);
  const headline =
    teacher.qualification?.trim() ||
    teacher.designation ||
    teacher.subjectLine;
  const locationLabel =
    distanceKm != null
      ? formatDistanceKm(distanceKm)
      : teacher.area || teacher.locality || "India";
  const hasVideo = Boolean(teacher.introVideo?.trim());

  return (
    <article
      className={cn(
        "w-full overflow-hidden rounded-xl border border-hairline bg-white shadow-[0_1px_2px_rgba(28,26,23,0.03)] transition",
        "hover:border-ink/15 hover:shadow-[0_4px_16px_rgba(28,26,23,0.06)]",
        !available && "opacity-90",
        className,
      )}
    >
      <div className="flex flex-col gap-3 p-3 sm:flex-row sm:items-stretch sm:gap-4 sm:p-3.5 lg:gap-5 lg:p-4">
        {/* Photo */}
        <div className="flex shrink-0 items-start gap-3 sm:block">
          <Link
            href={profileHref}
            className="relative block h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl bg-cream-band sm:h-[88px] sm:w-[88px]"
          >
            <MentorPhoto
              name={teacher.name}
              initials={teacher.initials}
              kind={teacher.kind}
              imageUrl={teacher.imageUrl}
              size="fill"
              rounded="xl"
              className="!absolute !inset-0 !h-full !w-full !rounded-none !border-0"
            />
            {teacher.reviewCount > 0 ? (
              <span className="absolute left-1 top-1 inline-flex items-center gap-0.5 rounded bg-white/95 px-1 py-0.5 text-[9px] font-bold text-ink">
                <Star className="h-2 w-2 fill-coral text-coral" />
                {teacher.rating.toFixed(1)}
              </span>
            ) : (
              <span className="absolute left-1 top-1 rounded bg-coral px-1 py-0.5 text-[9px] font-bold text-white">
                New
              </span>
            )}
            {hasVideo && (
              <span className="absolute bottom-1 right-1 inline-flex items-center rounded bg-ink/85 p-0.5 text-white">
                <PlayCircle className="h-3 w-3" />
              </span>
            )}
          </Link>

          {/* Mobile identity */}
          <div className="min-w-0 flex-1 sm:hidden">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <Link
                  href={profileHref}
                  className="block truncate text-base font-bold tracking-tight text-ink hover:text-coral"
                >
                  {teacher.name}
                </Link>
                <div className="mt-1 flex flex-wrap items-center gap-1">
                  <MentorStatusBadges
                    verified={teacher.verified}
                    premium={teacher.premium}
                  />
                  <span className="rounded bg-cream-band px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-muted">
                    {teacher.kind === "mentor" ? "Mentor" : "Tutor"}
                  </span>
                </div>
              </div>
              <div className="shrink-0 text-right" data-shortlist>
                {rate ? (
                  <p className="text-sm font-bold tabular-nums text-ink">{rate}</p>
                ) : (
                  <p className="text-[10px] font-semibold text-muted">Ask fee</p>
                )}
                <SaveTeacherButton teacherId={teacher.id} size="sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="min-w-0 flex-1 space-y-2">
          <div className="hidden items-center justify-between gap-3 sm:flex">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <Link
                  href={profileHref}
                  className="text-base font-bold tracking-tight text-ink hover:text-coral lg:text-lg"
                >
                  {teacher.name}
                </Link>
                <MentorStatusBadges
                  verified={teacher.verified}
                  premium={teacher.premium}
                />
                <span className="rounded bg-cream-band px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-muted">
                  {teacher.kind === "mentor" ? "Mentor" : "Tutor"}
                </span>
                {headline ? (
                  <span className="truncate text-xs font-medium text-muted">
                    · {headline}
                  </span>
                ) : null}
              </div>
            </div>
            <div className="shrink-0" data-shortlist>
              <SaveTeacherButton teacherId={teacher.id} size="sm" />
            </div>
          </div>

          {headline ? (
            <p className="truncate text-xs font-semibold text-ink/75 sm:hidden">
              {headline}
            </p>
          ) : null}

          {/* Modes / slots / video — one strip */}
          <div className="flex flex-wrap items-center gap-1">
            {modes.map((m) => (
              <span
                key={m}
                className="inline-flex items-center gap-1 rounded-full border border-hairline bg-cream/70 px-2 py-0.5 text-[10px] font-semibold text-ink"
              >
                {m === "Online" ? (
                  <Globe2 className="h-2.5 w-2.5 text-coral" />
                ) : m === "Home" ? (
                  <Home className="h-2.5 w-2.5 text-coral" />
                ) : null}
                {m}
              </span>
            ))}
            {available ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-sage-wash px-2 py-0.5 text-[10px] font-semibold text-sage">
                <CalendarDays className="h-2.5 w-2.5" />
                {teacher.openSlots} slots
              </span>
            ) : (
              <span className="rounded-full bg-cream-band px-2 py-0.5 text-[10px] font-semibold text-muted">
                Ask slots
              </span>
            )}
            {hasVideo && (
              <a
                href={teacher.introVideo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-full bg-coral px-2 py-0.5 text-[10px] font-semibold text-white hover:bg-coral-dark"
              >
                <PlayCircle className="h-3 w-3" />
                Video
              </a>
            )}
          </div>

          {/* Subjects inline */}
          {subjects.length > 0 && (
            <p className="truncate text-xs text-muted">
              <span className="font-semibold text-ink">Teaches: </span>
              {subjects.join(" · ")}
              {extraSubjects > 0 ? ` · +${extraSubjects}` : ""}
            </p>
          )}

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-muted">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="max-w-[180px] truncate sm:max-w-[240px]">
                {locationLabel}
              </span>
            </span>
            {teacher.experienceYears > 0 && (
              <span className="inline-flex items-center gap-1">
                <Briefcase className="h-3 w-3 shrink-0" />
                {teacher.experienceYears} yrs
              </span>
            )}
            {languages.length > 0 && (
              <span className="truncate">Speaks: {languages.join(", ")}</span>
            )}
            {teacher.levels?.trim() && (
              <span className="truncate">
                <span className="font-semibold text-ink">Levels:</span>{" "}
                {teacher.levels}
              </span>
            )}
          </div>

          {/* Bio — short */}
          {teacher.bio?.trim() && (
            <p className="line-clamp-1 text-xs leading-relaxed text-muted sm:line-clamp-2">
              {teacher.bio}
            </p>
          )}

          {/* Slots + certs — compact row */}
          {(shownSlots.length > 0 || certifications.length > 0) && (
            <div className="flex flex-wrap items-center gap-1.5">
              {shownSlots.map((label) => (
                <span
                  key={label}
                  className="rounded-md border border-sage/25 bg-sage-wash/50 px-2 py-0.5 text-[10px] font-semibold text-ink"
                >
                  {label}
                </span>
              ))}
              {extraSlots > 0 && (
                <Link
                  href={profileHref}
                  className="rounded-md border border-dashed border-sage/40 px-2 py-0.5 text-[10px] font-semibold text-sage"
                >
                  +{extraSlots}
                </Link>
              )}
              {certifications.map((cert) => (
                <span
                  key={cert}
                  className="inline-flex items-center gap-1 rounded-md bg-lavender/50 px-2 py-0.5 text-[10px] font-semibold text-ink"
                >
                  <Award className="h-2.5 w-2.5 text-coral" />
                  {cert}
                </span>
              ))}
            </div>
          )}

          {/* Mobile CTAs */}
          <div className="flex gap-2 pt-0.5 sm:hidden" data-connect>
            {available ? (
              <ConnectButton
                teacher={teacher}
                label="Connect free"
                className="inline-flex h-10 flex-1 items-center justify-center gap-1 rounded-lg bg-coral text-sm font-semibold text-white hover:bg-coral-dark"
                requestedClassName="inline-flex h-10 flex-1 items-center justify-center gap-1 rounded-lg bg-cream text-sm font-semibold text-muted"
              />
            ) : (
              <span className="inline-flex h-10 flex-1 items-center justify-center rounded-lg bg-cream text-sm font-semibold text-muted">
                Fully booked
              </span>
            )}
            <Link
              href={profileHref}
              className="inline-flex h-10 flex-1 items-center justify-center rounded-lg border border-hairline text-sm font-semibold text-ink hover:bg-cream"
            >
              Profile
            </Link>
          </div>
        </div>

        {/* Desktop CTA rail */}
        <div className="hidden w-[148px] shrink-0 flex-col items-stretch justify-between gap-2 border-l border-hairline pl-4 sm:flex">
          <div className="text-right">
            {rate ? (
              <>
                <p className="text-lg font-bold tracking-tight tabular-nums text-ink">
                  {rate}
                </p>
                <p className="text-[10px] font-medium text-muted">indicative</p>
              </>
            ) : (
              <p className="text-xs font-semibold text-muted">Ask for fee</p>
            )}
            {available && nextSlot ? (
              <p className="mt-1.5 text-left text-[10px] leading-snug text-muted">
                <span className="font-semibold text-sage">Next</span>
                <br />
                {nextSlot}
              </p>
            ) : null}
          </div>
          <div className="flex flex-col gap-1.5" data-connect>
            {available ? (
              <ConnectButton
                teacher={teacher}
                label="Connect free"
                className="inline-flex h-9 w-full items-center justify-center rounded-lg bg-coral text-xs font-semibold text-white hover:bg-coral-dark"
                requestedClassName="inline-flex h-9 w-full items-center justify-center rounded-lg bg-cream text-xs font-semibold text-muted"
              />
            ) : (
              <span className="inline-flex h-9 w-full items-center justify-center rounded-lg bg-cream text-xs font-semibold text-muted">
                Notify me
              </span>
            )}
            <Link
              href={profileHref}
              className="inline-flex h-8 w-full items-center justify-center rounded-lg border border-hairline text-xs font-semibold text-ink hover:bg-cream"
            >
              View profile
            </Link>
            {hasVideo && (
              <a
                href={teacher.introVideo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-8 w-full items-center justify-center gap-1 rounded-lg border border-coral/30 bg-coral-wash text-xs font-semibold text-coral-dark hover:bg-coral/10"
              >
                <PlayCircle className="h-3.5 w-3.5" />
                Video
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
