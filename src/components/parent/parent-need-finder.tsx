"use client";

import { hardShadowSm } from "@/components/landing/lp/shared";
import { Button } from "@/components/ui/button";
import {
  getParentNeed,
  parentNeedSearchHref,
  parentNeedSignupHref,
  PARENT_NEED_CITIES,
  PARENT_NEED_LEVELS,
  PARENT_NEED_SUBJECTS,
  saveParentNeed,
  type ParentNeed,
} from "@/lib/parent-need";
import { fetchPublicTeachers, type Teacher } from "@/lib/teachers";
import { cn } from "@/lib/utils";
import { ArrowRight, Megaphone, Search, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const field =
  "h-11 w-full min-w-0 max-w-full rounded-lg border-2 border-ink/10 bg-white px-3 text-sm font-medium text-ink outline-none focus:border-ink/40";

function matchesSubjectMode(teacher: Teacher, need: ParentNeed): boolean {
  if (!teacher.live) return false;
  const subjectOk = teacher.subjects.some(
    (s) => s.toLowerCase() === need.subject.toLowerCase(),
  );
  if (!subjectOk) return false;
  if (need.mode === "online") return teacher.modes.includes("online");
  return (
    teacher.modes.includes("student_home") ||
    teacher.modes.includes("tutor_home")
  );
}

function matchesNeed(teacher: Teacher, need: ParentNeed): boolean {
  if (!matchesSubjectMode(teacher, need)) return false;
  if (need.city === "Online / any city") return true;
  const hay = `${teacher.area} ${teacher.locality}`.toLowerCase();
  return hay.includes(need.city.toLowerCase());
}

export function ParentNeedFinder({ className }: { className?: string }) {
  const [need, setNeed] = useState<ParentNeed>({
    subject: "Mathematics",
    level: "Class 9–10",
    city: "Bengaluru",
    mode: "home",
  });
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = getParentNeed();
    if (stored) setNeed(stored);
    fetchPublicTeachers({ liveOnly: true }).then(({ teachers: list }) => {
      setTeachers(list.filter((t) => t.live));
      setReady(true);
    });
  }, []);

  useEffect(() => {
    saveParentNeed(need);
  }, [need]);

  const cityMatches = useMemo(
    () => teachers.filter((t) => matchesNeed(t, need)),
    [teachers, need],
  );
  const subjectMatches = useMemo(
    () => teachers.filter((t) => matchesSubjectMode(t, need)),
    [teachers, need],
  );
  const matches = cityMatches.length > 0 ? cityMatches : subjectMatches;
  const usedFallback = cityMatches.length === 0 && subjectMatches.length > 0;
  const preview = matches.slice(0, 3);
  const searchHref = parentNeedSearchHref(need);
  const postHref = parentNeedSignupHref(need);

  return (
    <section
      className={cn(
        "min-w-0 overflow-x-clip border-b border-hairline bg-lavender/40",
        className,
      )}
    >
      <div className="mx-auto w-full min-w-0 max-w-[1400px] px-4 py-8 short:py-5 shorter:py-4 sm:px-6 sm:py-10 short:sm:py-6 lg:px-8">
        <div
          className={cn(
            "min-w-0 rounded-2xl border-2 border-ink bg-white p-3.5 sm:p-6 lg:p-7",
            hardShadowSm,
          )}
        >
          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-coral">
                <Sparkles className="h-3.5 w-3.5 shrink-0" />
                For parents
              </p>
              <h2 className="mt-1 text-lg font-bold tracking-tight text-ink sm:text-2xl">
                <span className="sm:hidden">
                  Tell us what you need — see tutors now
                </span>
                <span className="hidden sm:inline">
                  Tell us what you need — see matching tutors now
                </span>
              </h2>
              <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-muted sm:text-sm">
                No account to browse. Connect or post a requirement only when
                you&apos;re ready. ₹0 forever.
              </p>
            </div>
            <p className="w-fit shrink-0 rounded-lg bg-sage-wash px-3 py-2 text-xs font-bold text-sage sm:text-sm">
              {ready ? (
                usedFallback ? (
                  <>{matches.length} teach this elsewhere / online</>
                ) : (
                  <>
                    {matches.length} live match
                    {matches.length === 1 ? "" : "es"}
                  </>
                )
              ) : (
                <Skeleton className="h-4 w-28 bg-sage/20" />
              )}
            </p>
          </div>

          <div className="mt-4 grid min-w-0 grid-cols-1 gap-3 sm:mt-5 sm:grid-cols-2 lg:grid-cols-4">
            <label className="block min-w-0">
              <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-muted">
                Subject
              </span>
              <select
                className={field}
                value={need.subject}
                onChange={(e) =>
                  setNeed((n) => ({ ...n, subject: e.target.value }))
                }
              >
                {PARENT_NEED_SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <label className="block min-w-0">
              <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-muted">
                Class / exam
              </span>
              <select
                className={field}
                value={need.level}
                onChange={(e) =>
                  setNeed((n) => ({ ...n, level: e.target.value }))
                }
              >
                {PARENT_NEED_LEVELS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <label className="block min-w-0">
              <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-muted">
                City
              </span>
              <select
                className={field}
                value={need.city}
                onChange={(e) =>
                  setNeed((n) => ({ ...n, city: e.target.value }))
                }
              >
                {PARENT_NEED_CITIES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <fieldset className="block min-w-0">
              <legend className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-muted">
                Mode
              </legend>
              <div className="grid grid-cols-2 gap-1.5">
                {(
                  [
                    ["home", "At home"],
                    ["online", "Online"],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setNeed((n) => ({ ...n, mode: value }))}
                    className={cn(
                      "h-11 min-w-0 rounded-lg border-2 text-sm font-bold transition",
                      need.mode === value
                        ? "border-ink bg-ink text-white"
                        : "border-ink/10 bg-cream text-muted hover:border-ink/25",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          {!ready ? (
            <ul className="mt-4 flex flex-wrap gap-2">
              {[0, 1, 2].map((i) => (
                <li key={i}>
                  <Skeleton className="h-6 w-28 rounded-full bg-cream-band" />
                </li>
              ))}
            </ul>
          ) : preview.length > 0 ? (
            <ul className="mt-4 flex max-w-full flex-wrap gap-2">
              {preview.map((t) => (
                <li
                  key={t.id}
                  className="max-w-full truncate rounded-full border border-hairline bg-cream px-3 py-1 text-xs font-semibold text-ink"
                >
                  {t.name.split(" ")[0]} · {t.locality || t.area.split(",")[0]}
                </li>
              ))}
              {matches.length > preview.length && (
                <li className="rounded-full bg-coral-wash px-3 py-1 text-xs font-semibold text-coral">
                  +{matches.length - preview.length} more
                </li>
              )}
            </ul>
          ) : null}

          <div className="mt-5 flex min-w-0 flex-col gap-2.5 sm:flex-row sm:items-stretch">
            <Link href={searchHref} className="block min-w-0 w-full sm:w-auto">
              <Button
                size="lg"
                className="h-12 w-full min-w-0 gap-1.5 px-4 text-sm shadow-[3px_3px_0_0_#1c1a17] sm:w-auto sm:gap-2 sm:px-6 sm:text-base"
              >
                <Search className="h-4 w-4 shrink-0" />
                <span className="truncate">See matching tutors</span>
                <ArrowRight className="hidden h-4 w-4 shrink-0 sm:block" />
              </Button>
            </Link>
            <Link href={postHref} className="block min-w-0 w-full sm:w-auto">
              <Button
                size="lg"
                variant="secondary"
                className="h-12 w-full min-w-0 gap-1.5 whitespace-normal border-2 border-ink px-4 text-sm shadow-[3px_3px_0_0_#1c1a17] sm:w-auto sm:gap-2 sm:whitespace-nowrap sm:px-6 sm:text-base"
              >
                <Megaphone className="h-4 w-4 shrink-0" />
                <span className="sm:hidden">Post your need</span>
                <span className="hidden sm:inline">
                  Can&apos;t find one? Post your need
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
