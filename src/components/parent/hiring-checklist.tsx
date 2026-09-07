"use client";

import {
  parentHiringApi,
  type HiringProgress,
  type HiringStepId,
} from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  CalendarCheck,
  Check,
  Heart,
  Loader2,
  MessageCircle,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const STEPS: {
  id: HiringStepId;
  label: string;
  hint: string;
  href?: string;
  manual?: "trial" | "firstSession";
  requires?: HiringStepId;
}[] = [
  {
    id: "browse",
    label: "Browse tutors",
    hint: "Explore profiles on search",
    href: "/search",
  },
  {
    id: "shortlist",
    label: "Shortlist favourites",
    hint: "Save up to 3 to compare",
    href: "/search",
  },
  {
    id: "trial",
    label: "Trial a session",
    hint: "Meet a tutor before you commit",
    manual: "trial",
  },
  {
    id: "connect",
    label: "Connect on WhatsApp",
    hint: "Accept a tutor to unlock chat",
    href: "/parent/dashboard",
  },
  {
    id: "firstSession",
    label: "Log first session",
    hint: "Mark when classes begin",
    manual: "firstSession",
    requires: "connect",
  },
];

export function HiringChecklist({
  onProgressChange,
}: {
  onProgressChange?: (progress: HiringProgress) => void;
}) {
  const [progress, setProgress] = useState<HiringProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState<string | null>(null);

  const reload = useCallback(() => {
    parentHiringApi
      .progress()
      .then((data) => {
        setProgress(data);
        onProgressChange?.(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [onProgressChange]);

  useEffect(() => {
    reload();
  }, [reload]);

  async function markStep(step: "trial" | "firstSession") {
    setMarking(step);
    try {
      const data = await parentHiringApi.completeStep(step);
      setProgress(data.progress);
      onProgressChange?.(data.progress);
    } catch {
      /* ignore */
    } finally {
      setMarking(null);
    }
  }

  if (loading) {
    return (
      <section className="rounded-xl border border-hairline bg-white px-4 py-5 sm:px-5">
        <div className="h-4 w-40 animate-pulse rounded bg-cream-band" />
        <div className="mt-4 h-2 animate-pulse rounded-full bg-cream-band" />
      </section>
    );
  }

  if (!progress) return null;

  const pct = Math.round(
    (progress.completedCount / progress.totalSteps) * 100,
  );
  const allDone = progress.completedCount === progress.totalSteps;

  return (
    <section className="overflow-hidden rounded-xl border border-hairline bg-white">
      <div className="border-b border-hairline bg-cream/60 px-4 py-3 sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-ink">Your hiring checklist</h2>
            <p className="text-xs text-muted">
              {allDone
                ? "You're all set — keep sessions going on WhatsApp"
                : "Clear next steps — no gamification, just progress"}
            </p>
          </div>
          <span className="rounded-md bg-white px-2.5 py-1 text-xs font-bold tabular-nums text-ink ring-1 ring-hairline">
            {progress.completedCount}/{progress.totalSteps}
          </span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-cream-band">
          <div
            className="h-full rounded-full bg-sage transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <ol className="divide-y divide-hairline">
        {STEPS.map((step, index) => {
          const done = progress.steps[step.id];
          const locked =
            step.requires && !progress.steps[step.requires] && !done;
          const isCurrent =
            !done &&
            !locked &&
            STEPS.slice(0, index).every((s) => progress.steps[s.id]);

          return (
            <li
              key={step.id}
              className={cn(
                "flex items-start gap-3 px-4 py-3 sm:px-5",
                isCurrent && "bg-coral-wash/25",
              )}
            >
              <span
                className={cn(
                  "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  done
                    ? "bg-sage text-white"
                    : isCurrent
                      ? "bg-coral text-white"
                      : "bg-cream-band text-muted",
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "text-[13px] font-semibold",
                    done ? "text-muted line-through" : "text-ink",
                  )}
                >
                  {step.label}
                </p>
                <p className="text-[11px] text-muted">{step.hint}</p>
              </div>
              <div className="shrink-0">
                {done ? (
                  <span className="text-[11px] font-semibold text-sage">Done</span>
                ) : step.href && !locked ? (
                  <Link
                    href={step.href}
                    className="inline-flex h-8 items-center gap-1 rounded-md bg-coral px-3 text-[11px] font-semibold text-white hover:bg-coral-dark"
                  >
                    {step.id === "browse" && <Search className="h-3 w-3" />}
                    {step.id === "shortlist" && <Heart className="h-3 w-3" />}
                    {step.id === "connect" && (
                      <MessageCircle className="h-3 w-3" />
                    )}
                    Go
                  </Link>
                ) : step.manual && !locked ? (
                  <button
                    type="button"
                    disabled={marking === step.manual}
                    onClick={() => void markStep(step.manual!)}
                    className="inline-flex h-8 items-center gap-1 rounded-md border border-hairline bg-white px-3 text-[11px] font-semibold text-ink hover:bg-cream disabled:opacity-50"
                  >
                    {marking === step.manual ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <CalendarCheck className="h-3 w-3" />
                    )}
                    Mark done
                  </button>
                ) : (
                  <span className="text-[11px] text-muted">
                    {locked ? "Connect first" : "—"}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export function PitchDigestBanner({
  progress,
}: {
  progress: HiringProgress | null;
}) {
  if (!progress || progress.pendingPitchCount === 0) return null;

  const top = progress.pitchSummaries[0];

  return (
    <div className="rounded-xl border border-coral/25 bg-coral-wash/60 px-4 py-3.5 sm:px-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-bold text-ink">
            {progress.pendingPitchCount} pitch
            {progress.pendingPitchCount === 1 ? "" : "es"} waiting
          </p>
          <p className="mt-0.5 text-xs text-muted">
            {top
              ? `${top.pendingCount} on ${top.subject} · ${top.classLevel} (${top.area}) — review now`
              : "Tutors responded to your open posts — review before slots fill"}
          </p>
        </div>
        <a
          href="#requirements"
          className="inline-flex h-9 shrink-0 items-center rounded-lg bg-coral px-4 text-xs font-bold text-white hover:bg-coral-dark"
        >
          Review pitches
        </a>
      </div>
    </div>
  );
}
