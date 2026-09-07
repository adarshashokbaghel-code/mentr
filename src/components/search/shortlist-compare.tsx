"use client";

import { ConnectButton } from "@/components/connect/connect-button";
import { useShortlist } from "@/components/search/shortlist-context";
import { ProfilePlaceholder } from "@/components/ui/profile-placeholder";
import { compareFeeDisplay, compareSlotsForTeacher } from "@/lib/shortlist";
import { cn } from "@/lib/utils";
import {
  BadgeCheck,
  CalendarDays,
  MapPin,
  Scale,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { Teacher } from "@/lib/teachers";

function CompareFee({ teacher }: { teacher: Teacher }) {
  const fee = compareFeeDisplay(teacher.hourlyRate);
  return (
    <div>
      <p className="inline-flex items-center gap-1 text-[15px] font-bold text-ink">
        {fee.primary}
      </p>
      <p className="mt-0.5 text-[11px] leading-snug text-muted">{fee.secondary}</p>
    </div>
  );
}

function CompareSlots({ teacher }: { teacher: Teacher }) {
  const { open, booked } = compareSlotsForTeacher(teacher);

  if (teacher.slots.length === 0) {
    return (
      <p className="text-[13px] text-muted">Schedule not shared yet</p>
    );
  }

  return (
    <div className="space-y-2">
      <p
        className={cn(
          "text-[13px] font-semibold",
          open.length > 0 ? "text-sage" : "text-muted",
        )}
      >
        {open.length > 0
          ? `${open.length} open this week`
          : "Fully booked this week"}
        {booked.length > 0 && open.length > 0 && (
          <span className="font-normal text-muted">
            {" "}
            · {booked.length} taken
          </span>
        )}
      </p>
      <ul className="space-y-1">
        {open.map((slot) => (
          <li
            key={slot.label}
            className="flex items-start gap-1.5 text-[12px] font-medium text-ink"
          >
            <CalendarDays className="mt-0.5 h-3 w-3 shrink-0 text-sage" />
            {slot.label}
          </li>
        ))}
        {booked.map((slot) => (
          <li
            key={slot.label}
            className="flex items-start gap-1.5 text-[12px] text-muted"
          >
            <CalendarDays className="mt-0.5 h-3 w-3 shrink-0 opacity-50" />
            <span className="line-through decoration-hairline">{slot.label}</span>
            <span className="shrink-0 text-[10px] font-medium uppercase tracking-wide">
              booked
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CompareRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-hairline px-3 py-2.5 first:border-t-0">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
        {label}
      </p>
      <div className="mt-1 text-[13px] font-medium text-ink">{children}</div>
    </div>
  );
}

export function ShortlistCompareBar() {
  const { ids, savedTeachers, remove } = useShortlist();
  const [open, setOpen] = useState(false);

  if (ids.length === 0) return null;

  const topPick = savedTeachers[0];

  return (
    <>
      <div className="fixed bottom-4 left-1/2 z-40 w-[min(100%-2rem,420px)] -translate-x-1/2">
        <div className="flex items-center gap-2 rounded-xl border border-hairline bg-white p-2 shadow-[0_12px_32px_rgba(26,35,28,0.14)]">
          <div className="min-w-0 flex-1 px-1">
            <p className="text-sm font-bold text-ink">
              Saved tutors ({ids.length}/3)
            </p>
            <p className="truncate text-xs text-muted">
              {savedTeachers.map((t) => t.name).join(" · ") ||
                "Still loading tutor details…"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            disabled={savedTeachers.length < 2}
            className={cn(
              "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition",
              savedTeachers.length >= 2
                ? "bg-ink text-white hover:bg-ink/90"
                : "cursor-not-allowed bg-cream text-muted",
            )}
          >
            <Scale className="h-3.5 w-3.5" />
            Compare
          </button>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-label="Compare saved tutors"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-4xl overflow-hidden rounded-xl border border-hairline bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-hairline bg-cream px-4 py-3">
              <div>
                <p className="text-base font-bold text-ink">Compare tutors</p>
                <p className="text-xs text-muted">
                  Side-by-side — pick your top choice and connect free
                </p>
              </div>
              <button
                type="button"
                aria-label="Close compare"
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-hairline bg-white hover:bg-cream"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid max-h-[70vh] overflow-y-auto sm:grid-cols-3">
              {savedTeachers.map((teacher, index) => {
                return (
                  <div
                    key={teacher.id}
                    className={cn(
                      "border-b border-hairline sm:border-b-0 sm:border-r last:sm:border-r-0",
                      index === 0 && "bg-coral-wash/20",
                    )}
                  >
                    <div className="p-3">
                      <div className="flex items-start gap-2">
                        <ProfilePlaceholder
                          name={teacher.name}
                          initials={teacher.initials}
                          kind={teacher.kind}
                          size="md"
                          rounded="md"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start gap-1">
                            <p className="truncate text-sm font-bold text-ink">
                              {teacher.name}
                            </p>
                            {teacher.verified && (
                              <BadgeCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sage" />
                            )}
                          </div>
                          {index === 0 && (
                            <span className="mt-0.5 inline-block rounded bg-coral px-1.5 py-0.5 text-[10px] font-bold text-white">
                              Top pick
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          aria-label={`Remove ${teacher.name}`}
                          onClick={() => void remove(teacher.id)}
                          className="shrink-0 rounded-md p-1 text-muted hover:bg-cream hover:text-ink"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <CompareRow label="Subject">{teacher.subjectLine}</CompareRow>
                    <CompareRow label="Indicative fee">
                      <CompareFee teacher={teacher} />
                    </CompareRow>
                    <CompareRow label="Area">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-muted" />
                        {teacher.locality}
                      </span>
                    </CompareRow>
                    <CompareRow label="Verified">
                      {teacher.verified ? "Yes — email verified" : "Not yet"}
                    </CompareRow>
                    <CompareRow label="Weekly slots">
                      <CompareSlots teacher={teacher} />
                    </CompareRow>

                    <div className="flex gap-2 p-3">
                      <Link
                        href={`/teachers/${teacher.id}`}
                        className="inline-flex h-9 flex-1 items-center justify-center rounded-md border border-hairline text-xs font-semibold text-ink hover:bg-cream"
                        onClick={() => setOpen(false)}
                      >
                        View profile
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {topPick && (
              <div className="border-t border-hairline bg-cream px-4 py-3">
                <p className="mb-2 text-xs font-medium text-muted">
                  Ready to decide? Connect with {topPick.name} — no platform fee.
                </p>
                <ConnectButton
                  teacher={topPick}
                  label="Connect with your top pick"
                  className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-coral text-sm font-semibold text-white hover:bg-coral-dark"
                  requestedClassName="inline-flex h-10 w-full items-center justify-center rounded-lg bg-cream text-sm font-semibold text-muted"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
