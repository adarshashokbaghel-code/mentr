"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Search,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

function displayName(user: {
  parentProfile?: { name?: string };
  profile?: { name?: string };
  email: string;
}): string {
  return user.parentProfile?.name || user.profile?.name || user.email;
}

const itemClass =
  "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-cream";

/** Avatar + dropdown for the signed-in user (role-aware menu items). */
export function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!user) return null;

  const name = displayName(user);
  const letter = name.charAt(0).toUpperCase();
  const isParent = user.role === "parent";

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "group flex items-center gap-1 rounded-full p-0.5 pr-1.5 transition-colors",
          open ? "bg-cream-band" : "hover:bg-cream-band",
        )}
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-coral text-sm font-bold text-white ring-2 ring-white">
          {letter}
        </span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-muted transition-transform duration-150",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="champs-pop absolute right-0 top-[calc(100%+8px)] z-50 w-60 origin-top-right rounded-xl border border-hairline bg-white p-1.5 shadow-[0_12px_32px_rgba(26,35,28,0.12)]"
        >
          <div className="flex items-center gap-3 rounded-lg bg-cream px-3 py-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-coral text-sm font-bold text-white">
              {letter}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{name}</p>
              <p className="truncate text-xs text-muted">
                {isParent ? "Parent" : "Tutor"} · {user.email}
              </p>
            </div>
          </div>

          <div className="mt-1.5 space-y-0.5">
            {isParent ? (
              <>
                <Link
                  href="/parent/dashboard"
                  role="menuitem"
                  className={itemClass}
                  onClick={() => setOpen(false)}
                >
                  <LayoutDashboard className="h-4 w-4 text-muted" />
                  My connections
                </Link>
                <Link
                  href="/search"
                  role="menuitem"
                  className={itemClass}
                  onClick={() => setOpen(false)}
                >
                  <Search className="h-4 w-4 text-muted" />
                  Find a mentor
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  role="menuitem"
                  className={itemClass}
                  onClick={() => setOpen(false)}
                >
                  <LayoutDashboard className="h-4 w-4 text-muted" />
                  Dashboard
                </Link>
                <Link
                  href="/board"
                  role="menuitem"
                  className={itemClass}
                  onClick={() => setOpen(false)}
                >
                  <Megaphone className="h-4 w-4 text-muted" />
                  Requirements board
                </Link>
                <Link
                  href="/profiling"
                  role="menuitem"
                  className={itemClass}
                  onClick={() => setOpen(false)}
                >
                  <UserRound className="h-4 w-4 text-muted" />
                  Profile
                </Link>
              </>
            )}
          </div>

          <div className="my-1.5 border-t border-hairline" />

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              logout();
            }}
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
