"use client";

import { MentorPhoto } from "@/components/ui/mentor-photo";
import { cn } from "@/lib/utils";
import { Camera, X } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { createPortal } from "react-dom";

type PhotoNudgeDialogProps = {
  open: boolean;
  name: string;
  onIgnore: () => void;
};

export function PhotoNudgeDialog({
  open,
  name,
  onIgnore,
}: PhotoNudgeDialogProps) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onIgnore();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onIgnore]);

  if (!open || typeof document === "undefined") return null;

  const firstName = name.split(" ")[0] || "there";

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
        aria-label="Dismiss"
        onClick={onIgnore}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="photo-nudge-title"
        className={cn(
          "relative z-10 w-full max-w-md overflow-hidden",
          "rounded-t-2xl border border-hairline bg-white",
          "shadow-[0_20px_50px_rgba(26,35,28,0.18)]",
          "sm:rounded-2xl",
        )}
      >
        <button
          type="button"
          onClick={onIgnore}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-cream hover:text-ink"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col gap-5 px-5 pb-5 pt-6 sm:flex-row sm:items-center sm:gap-5 sm:px-6 sm:py-6">
          <div className="relative mx-auto shrink-0 sm:mx-0">
            <div className="rounded-2xl bg-gradient-to-br from-cream to-coral-wash/50 p-1">
              <MentorPhoto name={name} size="lg" rounded="xl" />
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-coral text-white ring-2 ring-white">
              <Camera className="h-3.5 w-3.5" strokeWidth={2.25} />
            </span>
          </div>

          <div className="min-w-0 flex-1 text-center sm:pr-6 sm:text-left">
            <h2
              id="photo-nudge-title"
              className="text-[17px] font-bold tracking-tight text-ink sm:text-lg"
            >
              Add a profile photo, {firstName}
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              A clear headshot boosts visibility and helps parents trust you
              faster.
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-hairline bg-cream/30 px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:gap-3 sm:px-6">
          <button
            type="button"
            onClick={onIgnore}
            className="flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium text-coral transition hover:bg-coral-wash hover:text-coral-dark sm:h-9"
          >
            Ignore
          </button>
          <Link
            href="/profiling?step=about"
            className="learn-hk-cta w-full sm:w-auto"
          >
            <span className="learn-hk-cta-label">Update profile picture</span>
            <span className="learn-hk-cta-arrow">
              <Camera className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.85} />
            </span>
          </Link>
        </div>
      </div>
    </div>,
    document.body,
  );
}
