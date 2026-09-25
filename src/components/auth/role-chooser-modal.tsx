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
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
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
      <div className="relative z-10 w-full max-w-md rounded-2xl border-2 border-ink bg-white p-6 shadow-[4px_4px_0_0_#1c1a17] sm:p-7">
        <button
          type="button"
          onClick={closeRoleChooser}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full text-muted hover:bg-cream"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <h2
          id="role-chooser-title"
          className="text-[22px] font-bold tracking-tight text-ink"
        >
          First, who are you?
        </h2>
        <p className="mt-1.5 text-sm text-muted">
          Log in as a parent or tutor — you&apos;ll come right back here.
        </p>

        <div className="mt-5 space-y-3">
          <Link
            href={`/parent/signup${nextSuffix}`}
            onClick={closeRoleChooser}
            className="group flex items-center gap-4 rounded-xl border-2 border-ink bg-butter/60 p-4 transition hover:bg-butter"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-coral text-white">
              <Users className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-bold text-ink">
                I&apos;m a parent or student
              </span>
              <span className="block text-xs text-muted">
                Find tutors near you &amp; contact on WhatsApp
              </span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-ink transition group-hover:translate-x-0.5" />
          </Link>

          {guestPremium ? (
            <button
              type="button"
              onClick={() => setGuestFormOpen(true)}
              className="group flex w-full items-center gap-4 rounded-xl border-2 border-dashed border-ink/35 bg-cream/60 p-4 text-left transition hover:border-ink hover:bg-cream"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white text-ink ring-1 ring-ink/10">
                <Send className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-bold text-ink">
                  Send requirement without login
                </span>
                <span className="block text-xs text-muted">
                  Tell {mentorFirst} what you need — they get your contact
                </span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-ink transition group-hover:translate-x-0.5" />
            </button>
          ) : null}

          <Link
            href={`/faculty${nextSuffix}`}
            onClick={closeRoleChooser}
            className="group flex items-center gap-4 rounded-xl border-2 border-ink bg-white p-4 transition hover:bg-cream"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-ink text-white">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-bold text-ink">
                I&apos;m a tutor
              </span>
              <span className="block text-xs text-muted">
                List free, keep 100% of what you earn
              </span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-ink transition group-hover:translate-x-0.5" />
          </Link>
        </div>

        <p className="mt-5 text-center text-xs text-muted">
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
