"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { GuestRequirementForm } from "@/components/connect/guest-requirement-form";
import { ArrowRight, GraduationCap, Send, Users, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * "Who are you?" gate shown when an unauthenticated visitor hits a
 * login-protected action (find a teacher, contact a tutor, …).
 * For Premium mentors, also offers sending a need without an account.
 */
export function RoleChooserModal() {
  const {
    roleChooserOpen,
    closeRoleChooser,
    roleChooserNext,
    roleChooserGuestPremium,
  } = useAuth();
  const [guestFormOpen, setGuestFormOpen] = useState(false);

  useEffect(() => {
    if (!roleChooserOpen) {
      setGuestFormOpen(false);
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !guestFormOpen) closeRoleChooser();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [roleChooserOpen, closeRoleChooser, guestFormOpen]);

  if (guestFormOpen && roleChooserGuestPremium) {
    return (
      <GuestRequirementForm
        teacher={roleChooserGuestPremium}
        onClose={() => {
          setGuestFormOpen(false);
          closeRoleChooser();
        }}
      />
    );
  }

  if (!roleChooserOpen) return null;

  const nextSuffix = roleChooserNext
    ? `?next=${encodeURIComponent(roleChooserNext)}`
    : "";
  const guestPremium = roleChooserGuestPremium;
  const mentorFirst = guestPremium?.teacherName.split(" ")[0];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="role-chooser-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-ink/40"
        aria-label="Close dialog"
        onClick={closeRoleChooser}
      />
      <div className="relative z-10 w-full max-w-md rounded-t-2xl border-2 border-ink bg-white p-4 shadow-[4px_4px_0_0_#1c1a17] sm:rounded-2xl sm:p-7">
        <button
          type="button"
          onClick={closeRoleChooser}
          className="absolute right-2.5 top-2.5 flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-cream sm:right-3 sm:top-3 sm:h-10 sm:w-10"
          aria-label="Close"
        >
          <X className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>

        <h2
          id="role-chooser-title"
          className="pr-10 text-[18px] font-bold tracking-tight text-ink sm:text-[22px]"
        >
          First, who are you?
        </h2>
        <p className="mt-1 text-[13px] text-muted sm:mt-1.5 sm:text-sm">
          Log in as a parent or tutor — you&apos;ll come right back here.
        </p>

        <div className="mt-4 space-y-2.5 sm:mt-5 sm:space-y-3">
          <Link
            href={`/parent/signup${nextSuffix}`}
            onClick={closeRoleChooser}
            className="group flex items-center gap-3 rounded-xl border-2 border-ink bg-butter/60 p-3 transition hover:bg-butter sm:gap-4 sm:p-4"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-coral text-white sm:h-11 sm:w-11">
              <Users className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[14px] font-bold text-ink sm:text-[15px]">
                I&apos;m a parent or student
              </span>
              <span className="block text-[11px] text-muted sm:text-xs">
                Find tutors near you &amp; contact on WhatsApp
              </span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-ink transition group-hover:translate-x-0.5" />
          </Link>

          {guestPremium ? (
            <button
              type="button"
              onClick={() => setGuestFormOpen(true)}
              className="group flex w-full items-center gap-3 rounded-xl border-2 border-dashed border-ink/35 bg-cream/60 p-3 text-left transition hover:border-ink hover:bg-cream sm:gap-4 sm:p-4"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-ink ring-1 ring-ink/10 sm:h-11 sm:w-11">
                <Send className="h-4 w-4 sm:h-5 sm:w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[14px] font-bold text-ink sm:text-[15px]">
                  Send requirement without login
                </span>
                <span className="block text-[11px] text-muted sm:text-xs">
                  Tell {mentorFirst} what you need — they get your contact
                </span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-ink transition group-hover:translate-x-0.5" />
            </button>
          ) : null}

          <Link
            href={`/faculty${nextSuffix}`}
            onClick={closeRoleChooser}
            className="group flex items-center gap-3 rounded-xl border-2 border-ink bg-white p-3 transition hover:bg-cream sm:gap-4 sm:p-4"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ink text-white sm:h-11 sm:w-11">
              <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[14px] font-bold text-ink sm:text-[15px]">
                I&apos;m a tutor
              </span>
              <span className="block text-[11px] text-muted sm:text-xs">
                List free, keep 100% of what you earn
              </span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-ink transition group-hover:translate-x-0.5" />
          </Link>
        </div>

        <p className="mt-4 pb-[max(0.25rem,env(safe-area-inset-bottom))] text-center text-[11px] text-muted sm:mt-5 sm:pb-0 sm:text-xs">
          Already a parent?{" "}
          <Link
            href={`/parent${nextSuffix}`}
            onClick={closeRoleChooser}
            className="font-semibold text-coral hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
