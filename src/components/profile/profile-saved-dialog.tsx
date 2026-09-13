"use client";

import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { createPortal } from "react-dom";

type ProfileSavedDialogProps = {
  open: boolean;
  onClose: () => void;
};

function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M14.43 5.93 20.5 12l-6.07 6.07"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.5 12h16.83"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ProfileSavedDialog({ open, onClose }: ProfileSavedDialogProps) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
        aria-label="Dismiss"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-saved-title"
        className={cn(
          "relative z-10 w-full max-w-sm overflow-hidden",
          "rounded-t-2xl border border-hairline bg-white",
          "shadow-[0_20px_50px_rgba(26,35,28,0.18)]",
          "sm:rounded-2xl",
        )}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-2.5 top-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-full text-muted transition hover:bg-cream hover:text-ink"
          aria-label="Close"
        >
          <X className="h-3.5 w-3.5" />
        </button>

        <div className="flex items-start gap-3 px-5 pb-4 pt-5 sm:px-5">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sage-wash text-sage">
            <Check className="h-4 w-4" strokeWidth={2.75} />
          </span>
          <div className="min-w-0 pr-5">
            <h2
              id="profile-saved-title"
              className="text-[16px] font-bold tracking-tight text-ink"
            >
              Your profile is updated
            </h2>
            <p className="mt-1 text-[13px] leading-snug text-muted">
              Changes are live. Head to your dashboard, or pitch on open parent
              requirements.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-hairline bg-cream/30 px-5 py-3.5 sm:px-5">
          <Link
            href="/dashboard"
            onClick={onClose}
            className="learn-hk-cta w-full"
          >
            <span className="learn-hk-cta-label">Go to dashboard</span>
            <span className="learn-hk-cta-arrow">
              <ArrowIcon />
            </span>
          </Link>

          <Link
            href="/board"
            onClick={onClose}
            className="inline-flex h-10 w-full items-center justify-center rounded-[0.85rem] border border-hairline bg-white text-[13px] font-bold text-ink transition hover:bg-cream sm:rounded-[1.15rem]"
          >
            Open requirement board
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 items-center justify-center text-[13px] font-medium text-coral transition hover:text-coral-dark"
          >
            Keep editing
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
