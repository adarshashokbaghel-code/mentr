"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const DISMISS_KEY = "mentr_profile_nudge_dismissed";

const HIDDEN_PREFIXES = [
  "/parent/profiling",
  "/learn",
  "/openpythoncompiler",
  "/admin",
];

export function ParentProfileNudge() {
  const { user, loading } = useAuth();
  const pathname = usePathname() || "/";
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return true;
    try {
      return sessionStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      return false;
    }
  });

  if (loading || dismissed) return null;
  if (!user || user.role !== "parent" || user.profileCompleted) return null;
  if (HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))) return null;

  const next = encodeURIComponent(pathname);

  return (
    <div className="border-b border-coral/20 bg-coral/10 px-3 py-2 text-[13px] text-ink sm:px-6">
      <div className="mx-auto flex max-w-6xl items-center gap-3">
        <p className="min-w-0 flex-1 leading-snug">
          <span className="font-semibold">Finish your profile</span>
          <span className="hidden sm:inline">
            {" "}
            — add your name and WhatsApp so tutors can reply. Under a minute.
          </span>
          <span className="sm:hidden"> so tutors can reply.</span>
        </p>
        <Link
          href={`/parent/profiling?next=${next}`}
          className="shrink-0 rounded-md bg-coral px-3 py-1.5 text-[13px] font-semibold text-white hover:bg-coral-dark"
        >
          Finish
        </Link>
        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => {
            setDismissed(true);
            try {
              sessionStorage.setItem(DISMISS_KEY, "1");
            } catch {
              /* ignore */
            }
          }}
          className="shrink-0 rounded p-1 text-muted hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
