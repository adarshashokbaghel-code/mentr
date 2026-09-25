"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { MentorPhoto } from "@/components/ui/mentor-photo";
import { PremiumMentorBadge } from "@/components/ui/mentor-status-badges";
import {
  fetchPublicTeachers,
  formatHourlyRate,
  type Teacher,
} from "@/lib/teachers";
import { cn } from "@/lib/utils";
import { ArrowRight, Clock3, X, Zap } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

const STORAGE_KEY = "mentr_home_premium_popup_dismissed_at";
const COOLDOWN_MS = 5 * 60 * 1000;
const SHOW_DELAY_MS = 900;
const MENTOR_LIMIT = 10;

function canShowPopup(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return true;
    const ts = Number(raw);
    if (!Number.isFinite(ts)) return true;
    return Date.now() - ts >= COOLDOWN_MS;
  } catch {
    return true;
  }
}

function markDismissed() {
  try {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
  } catch {
    /* private mode / blocked storage */
  }
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

function primarySubject(teacher: Teacher): string {
  return (
    teacher.subjects[0] ||
    teacher.subjectLine.split("&")[0]?.trim() ||
    "Tutor"
  );
}

async function loadPremiumMentors(): Promise<Teacher[]> {
  try {
    const featuredRes = await fetch("/api/teachers/featured");
    if (featuredRes.ok) {
      const data = (await featuredRes.json()) as { teachers?: Teacher[] };
      const curated = Array.isArray(data.teachers) ? data.teachers : [];
      const premium = curated.filter((t) => t.premium);
      if (premium.length > 0) return premium.slice(0, MENTOR_LIMIT);
      if (curated.length > 0) return curated.slice(0, MENTOR_LIMIT);
    }
  } catch {
    /* fall through */
  }

  const { teachers, failed } = await fetchPublicTeachers();
  if (failed || teachers.length === 0) return [];
  const premium = teachers.filter((t) => t.premium);
  const pool = premium.length > 0 ? premium : teachers;
  return pool.slice(0, MENTOR_LIMIT);
}

function MentorScrollCard({ teacher }: { teacher: Teacher }) {
  const name = displayName(teacher.name);
  const subject = primarySubject(teacher);
  const rate = formatHourlyRate(teacher.hourlyRate);

  return (
    <div className="home-premium-mentor-card group relative h-[158px] w-[138px] shrink-0 sm:h-[180px] sm:w-[158px]">
      <div className="home-premium-mentor-card-inner absolute inset-0 flex flex-col overflow-hidden rounded-lg border border-white/25 bg-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.28)] backdrop-blur-md">
        <div className="relative min-h-0 flex-1 overflow-hidden">
          <MentorPhoto
            name={name}
            imageUrl={teacher.imageUrl}
            size="fill"
            rounded="md"
            className="!rounded-none object-cover"
            showInitials
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1814]/90 via-[#1a1814]/15 to-transparent" />
          {teacher.premium ? (
            <div className="absolute left-1.5 top-1.5">
              <PremiumMentorBadge size="sm" />
            </div>
          ) : null}
        </div>
        <div className="flex shrink-0 flex-col justify-center px-2.5 py-2">
          <p className="truncate text-[11px] font-bold leading-tight text-white sm:text-xs">
            {name}
          </p>
          <p className="truncate text-[10px] font-medium text-white/65">
            {subject}
            {rate ? ` · ${rate}` : ""}
          </p>
        </div>
      </div>
    </div>
  );
}

function MentorMarquee({ mentors }: { mentors: Teacher[] }) {
  if (mentors.length === 0) {
    return (
      <div className="flex h-[158px] items-center justify-center rounded-lg border border-white/15 bg-white/5 sm:h-[180px]">
        <p className="text-sm text-white/50">Loading premium tutors…</p>
      </div>
    );
  }

  const loop = [...mentors, ...mentors];

  return (
    <div className="home-premium-marquee relative overflow-hidden rounded-lg border border-white/15 bg-gradient-to-b from-white/[0.08] to-white/[0.02] py-3 sm:py-4">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[#1c1915] to-transparent sm:w-14" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[#1c1915] to-transparent sm:w-14" />
      <div className="home-premium-marquee-track flex w-max gap-3 px-3 sm:gap-4 sm:px-4">
        {loop.map((t, i) => (
          <MentorScrollCard key={`${t.id}-${i}`} teacher={t} />
        ))}
      </div>
    </div>
  );
}

export function HomePremiumPopup() {
  const { user, loading, openRoleChooser } = useAuth();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mentors, setMentors] = useState<Teacher[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (loading || !mounted) return;
    // Logged-in parents already have the full search experience
    if (user?.role === "parent") return;
    if (!canShowPopup()) return;

    const timer = window.setTimeout(() => setOpen(true), SHOW_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [loading, mounted, user?.role]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    void loadPremiumMentors().then((list) => {
      if (!cancelled) setMentors(list);
    });
    return () => {
      cancelled = true;
    };
  }, [open]);

  const dismiss = useCallback(() => {
    markDismissed();
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, dismiss]);

  const isFaculty = Boolean(user && user.role !== "parent");
  const showGuestCtas = !user;

  if (!mounted || !open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[190] flex items-end justify-center p-0 sm:items-center sm:p-4"
      data-home-premium-popup
    >
      <button
        type="button"
        className="absolute inset-0 bg-[#0f0e0c]/55 backdrop-blur-[6px]"
        aria-label="Dismiss"
        onClick={dismiss}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="home-premium-popup-title"
        className={cn(
          "home-premium-glass-card relative z-10 flex max-h-[min(94dvh,920px)] w-full max-w-[640px] flex-col overflow-hidden",
          "rounded-t-xl border border-white/20 sm:rounded-xl",
          "champs-pop",
        )}
      >
        {/* Ambient light */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-20 -top-24 h-64 w-64 rounded-full bg-[#5b7cfa]/35 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-16 -right-10 h-60 w-60 rounded-full bg-[#c4a574]/28 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 home-premium-glass-shine"
        />

        <button
          type="button"
          onClick={dismiss}
          className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-md border border-white/20 bg-white/10 text-white/80 backdrop-blur-md transition hover:bg-white/20 hover:text-white sm:right-4 sm:top-4"
          aria-label="Close"
        >
          <X className="h-4 w-4" strokeWidth={2.25} />
        </button>

        <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-5 pt-6 sm:px-8 sm:pb-8 sm:pt-9">
          <h2
            id="home-premium-popup-title"
            className="max-w-[20ch] pr-10 text-[1.75rem] font-bold leading-[1.12] tracking-tight text-white sm:text-[2.35rem]"
          >
            In a hurry? Need an{" "}
            <span className="bg-gradient-to-r from-[#9eb4ff] via-[#c4a574] to-[#e8d5b5] bg-clip-text text-transparent">
              instant tutor
            </span>
          </h2>

          <p className="mt-3 max-w-[44ch] text-[13.5px] leading-relaxed text-white/70 sm:mt-3.5 sm:text-[15px]">
            Drop your requirement to our premium tutors now — they respond
            fast when you need someone today. Prefer to browse first? Take your
            time, compare profiles, and choose with confidence.
          </p>

          <div className="mt-5 sm:mt-6">
            <div className="mb-2.5 flex items-center justify-between gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/45">
                Tutors ready for you
              </p>
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#c4a574]">
                <Zap className="h-3 w-3" />
                Live profiles
              </span>
            </div>
            <MentorMarquee mentors={mentors} />
          </div>

          {showGuestCtas ? (
            <div className="mt-5 flex flex-col gap-2.5 sm:mt-6 sm:gap-3">
              <Link
                href="/search"
                onClick={dismiss}
                className={cn(
                  "group relative flex h-12 items-center justify-center gap-2 overflow-hidden rounded-lg",
                  "bg-gradient-to-r from-[#6b87f5] via-[#7a92f7] to-[#c4a574]",
                  "text-[14px] font-bold text-[#0f0e0c]",
                  "shadow-[0_10px_28px_rgba(107,135,245,0.35)]",
                  "transition hover:brightness-105 active:scale-[0.99]",
                )}
              >
                <span className="relative z-10">Explore premium tutors</span>
                <ArrowRight className="relative z-10 h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>

              <button
                type="button"
                onClick={() => {
                  dismiss();
                  openRoleChooser("/search");
                }}
                className={cn(
                  "flex h-11 items-center justify-center gap-2 rounded-lg",
                  "border border-white/20 bg-white/5 text-[13px] font-semibold text-white/85",
                  "backdrop-blur-md transition hover:border-white/35 hover:bg-white/10 hover:text-white",
                )}
              >
                <Clock3 className="h-3.5 w-3.5 text-[#c4a574]" />
                Have enough time? Login, search &amp; compare
              </button>
            </div>
          ) : isFaculty ? (
            <p className="mt-5 text-center text-xs text-white/45 sm:mt-6">
              Parents see this when they need a tutor fast.
            </p>
          ) : null}
        </div>
      </div>
    </div>,
    document.body,
  );
}
