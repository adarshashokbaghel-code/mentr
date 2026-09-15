"use client";

import { LearnDino } from "@/components/landing/lp/learn-dino";
import type { BuildMission, BuildStepDef } from "@/lib/learn-build-missions";
import { cn } from "@/lib/utils";
import { Lightbulb, PartyPopper, RotateCcw, X } from "lucide-react";
import Link from "next/link";
import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

function stepLabel(mission: BuildMission, id: string): BuildStepDef | undefined {
  return (
    mission.steps.find((s) => s.id === id) ||
    mission.distractors?.find((s) => s.id === id)
  );
}

function Backdrop({
  onClose,
  children,
}: {
  onClose?: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center bg-black/45 p-4 sm:items-center"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal
        className="w-full max-w-md origin-bottom animate-in fade-in-0 zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}

export function LmsBuildHintModal({
  open,
  mission,
  hintLevel,
  hintText,
  onUnderstood,
  onClose,
}: {
  open: boolean;
  mission: BuildMission;
  hintLevel: number;
  hintText: string;
  onUnderstood: () => void;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <Backdrop onClose={onClose}>
      <div className="overflow-hidden rounded-3xl border-2 border-[#1c2434] bg-white shadow-[0_24px_64px_rgba(0,0,0,0.28)]">
        <div className="flex items-start justify-between gap-3 border-b border-[#f0ebe3] bg-[#fff8d6] px-4 py-3.5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#b45309]">
              <Lightbulb className="h-[18px] w-[18px]" strokeWidth={2.25} />
            </span>
            <div>
              <p className="text-[14px] font-extrabold text-[#1c2434]">
                Hint {hintLevel} of 3
              </p>
              <p className="text-[11px] font-semibold text-[#8a929c]">
                {mission.id} · {mission.title}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-1.5 text-[#8a929c] hover:bg-white/70"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex gap-3 px-4 py-4">
          <LearnDino size={48} action="peek" className="h-12 w-12 shrink-0" />
          <div className="min-w-0 flex-1 rounded-2xl border border-[#e8e2d8] bg-[#faf8f4] px-3.5 py-3">
            <p className="text-[14px] font-bold leading-relaxed text-[#1c2434]">
              {hintText}
            </p>
          </div>
        </div>

        <div className="border-t border-[#f0ebe3] px-4 py-3">
          <button
            type="button"
            onClick={onUnderstood}
            className="w-full rounded-xl bg-[#1c2434] px-4 py-2.5 text-[13px] font-extrabold text-white transition hover:bg-[#2a3548]"
          >
            Understood
          </button>
        </div>
      </div>
    </Backdrop>
  );
}

export function LmsBuildResultModal({
  open,
  ok,
  mission,
  order,
  xpEarned,
  firstTry,
  hitWall,
  nextMissionId,
  onRetry,
  onClose,
}: {
  open: boolean;
  ok: boolean;
  mission: BuildMission;
  order: string[];
  xpEarned: number | null;
  firstTry: boolean;
  hitWall: boolean;
  nextMissionId: string | null;
  onRetry: () => void;
  onClose: () => void;
}) {
  if (!open) return null;

  const expected = mission.solution
    .map((id) => stepLabel(mission, id)?.label ?? id)
    .join(" → ");
  const yours =
    order.length === 0
      ? "(empty)"
      : order.map((id) => stepLabel(mission, id)?.label ?? id).join(" → ");

  return (
    <Backdrop onClose={onClose}>
      <div className="overflow-hidden rounded-3xl border-2 border-[#1c2434] bg-white shadow-[0_24px_64px_rgba(0,0,0,0.28)]">
        <div
          className={cn(
            "flex items-start justify-between gap-3 border-b px-4 py-3.5",
            ok
              ? "border-[#0d9488]/20 bg-[#e6f7f4]"
              : "border-[#ea580c]/20 bg-[#fff4e8]",
          )}
        >
          <div className="flex items-center gap-2.5">
            <LearnDino
              size={48}
              action={ok ? "cheer" : "handshake"}
              className="h-12 w-12 shrink-0"
            />
            <div>
              <p
                className={cn(
                  "text-[15px] font-extrabold",
                  ok ? "text-[#0d9488]" : "text-[#c2410c]",
                )}
              >
                {ok ? "Correct!" : "Not quite"}
              </p>
              <p className="text-[12px] font-semibold text-[#5a6472]">
                {ok
                  ? firstTry
                    ? `First try · +${xpEarned ?? mission.xp} XP`
                    : `+${xpEarned ?? mission.xp} XP`
                  : hitWall
                    ? "Your path hit a wall"
                    : "Check the order of your stack"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-1.5 text-[#8a929c] hover:bg-white/70"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3 px-4 py-4">
          {ok ? (
            <p className="flex items-start gap-2 text-[13px] font-bold leading-snug text-[#1c2434]">
              <PartyPopper className="mt-0.5 h-4 w-4 shrink-0 text-[#ff6a1a]" />
              {mission.successMsg}
            </p>
          ) : (
            <p className="text-[13px] font-bold leading-snug text-[#1c2434]">
              {order.length === 0
                ? mission.emptyMsg
                : "Your program didn’t match the goal. Compare below, then retry."}
            </p>
          )}

          <div className="rounded-2xl border border-[#e8e2d8] bg-[#1c2434] p-3 font-mono text-[11px] leading-relaxed text-[#e8e2d8]">
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#a89f91]">
              Run output
            </p>
            <p>
              <span className="text-[#94a3b8]">yours:</span> {yours}
            </p>
            <p className="mt-1">
              <span className="text-[#94a3b8]">goal:</span> {expected}
            </p>
            <p
              className={cn(
                "mt-2 font-bold",
                ok ? "text-[#4ade80]" : "text-[#fb923c]",
              )}
            >
              {ok ? "→ pass" : "→ fail"}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-[#f0ebe3] px-4 py-3 sm:flex-row">
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#e8e2d8] bg-white px-4 py-2.5 text-[13px] font-extrabold text-[#1c2434]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Retry
          </button>
          {ok && nextMissionId ? (
            <Link
              href={`/learn/app/build/${nextMissionId}`}
              className="inline-flex flex-1 items-center justify-center rounded-xl bg-[#ff6a1a] px-4 py-2.5 text-[13px] font-extrabold text-white shadow-[2px_2px_0_0_#1c2434]"
            >
              Next · {nextMissionId}
            </Link>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex flex-1 items-center justify-center rounded-xl bg-[#1c2434] px-4 py-2.5 text-[13px] font-extrabold text-white"
            >
              {ok ? "Continue" : "Keep editing"}
            </button>
          )}
        </div>
      </div>
    </Backdrop>
  );
}
