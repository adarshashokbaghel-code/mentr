"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { MentrBrand } from "@/components/ui/mentr-brand";
import { MentorPhoto } from "@/components/ui/mentor-photo";
import type { PublicNavGroup } from "@/lib/public-nav";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  ChevronDown,
  Crown,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Search,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

/**
 * Right-side slide-in navigation for < lg screens.
 * Portalled to <body> because the sticky header uses backdrop-filter,
 * which would otherwise become the containing block for `position: fixed`.
 */
export function MobileNavDrawer({
  open,
  onClose,
  groups,
}: {
  open: boolean;
  onClose: () => void;
  groups: PublicNavGroup[];
}) {
  const { user, loading, logout, openRoleChooser } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) setExpanded(null);
  }, [open]);

  if (!mounted) return null;

  const displayName =
    user?.parentProfile?.name || user?.profile?.name || user?.email || "";
  const isParent = user?.role === "parent";

  const accountLinks = user
    ? isParent
      ? [
          { href: "/parent/dashboard", label: "Dashboard", icon: LayoutDashboard },
          { href: "/search", label: "Find a mentor", icon: Search },
        ]
      : [
          { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
          { href: "/board", label: "Requirements", icon: Megaphone },
          { href: "/profiling", label: "Profile", icon: UserRound },
        ]
    : [];

  return createPortal(
    <div
      className="fixed inset-0 z-[300] lg:hidden"
      inert={!open}
      aria-hidden={!open}
    >
      <div
        className={cn(
          "absolute inset-0 bg-ink/30 backdrop-blur-md transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={cn(
          "absolute inset-y-0 right-0 flex w-[min(86vw,360px)] flex-col bg-cream shadow-[-24px_0_60px_rgba(28,26,23,0.18)]",
          "transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-hairline px-4">
          <MentrBrand logoClassName="h-5" />
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink ring-1 ring-hairline transition hover:bg-cream-band"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-6 pt-4">
          {!loading && user ? (
            <div className="mb-4 rounded-2xl bg-white p-3 ring-1 ring-hairline">
              <div className="flex items-center gap-3">
                <MentorPhoto
                  name={displayName}
                  initials={initialsOf(displayName)}
                  imageUrl={
                    user.profileImageUrl || user.profile?.profileImageUrl || null
                  }
                  size="sm"
                  rounded="full"
                  showInitials={false}
                  className="!h-10 !w-10"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-ink">
                    {displayName}
                  </p>
                  <p className="text-xs text-muted">
                    {isParent ? "Parent account" : "Tutor account"}
                  </p>
                </div>
              </div>
              <div
                className={cn(
                  "mt-3 grid gap-1.5",
                  accountLinks.length === 3 ? "grid-cols-3" : "grid-cols-2",
                )}
              >
                {accountLinks.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={onClose}
                    className="flex flex-col items-center gap-1 rounded-xl bg-cream px-2 py-2.5 text-center text-[12px] font-semibold text-ink transition hover:bg-cream-band"
                  >
                    <Icon className="h-4 w-4 text-coral" />
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/premiummentors"
              onClick={onClose}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2f3d7a] via-[#4556a0] to-[#6a5740] p-3.5 text-white"
            >
              <Crown className="h-5 w-5 text-[#e8d5b5]" />
              <p className="mt-3 text-sm font-bold leading-tight">
                Premium mentors
              </p>
              <p className="mt-0.5 text-[11px] leading-snug text-white/70">
                ID-verified, hand-picked
              </p>
            </Link>
            <Link
              href="/search"
              onClick={onClose}
              className="rounded-2xl bg-white p-3.5 ring-1 ring-hairline transition hover:ring-ink/20"
            >
              <Search className="h-5 w-5 text-coral" />
              <p className="mt-3 text-sm font-bold leading-tight text-ink">
                Find tutors
              </p>
              <p className="mt-0.5 text-[11px] leading-snug text-muted">
                Nearby or online
              </p>
            </Link>
          </div>

          <p className="mb-1 mt-6 px-1 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
            Explore
          </p>
          <nav className="divide-y divide-hairline rounded-2xl bg-white ring-1 ring-hairline">
            {groups.map((group) => {
              const isOpen = expanded === group.id;
              return (
                <div key={group.id}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() =>
                      setExpanded((cur) => (cur === group.id ? null : group.id))
                    }
                    className="flex w-full items-center justify-between px-4 py-3.5 text-left text-[15px] font-semibold text-ink"
                  >
                    {group.label}
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-muted transition-transform duration-200",
                        isOpen && "rotate-180",
                      )}
                    />
                  </button>
                  <div
                    className="grid transition-[grid-template-rows] duration-300 ease-out"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <ul className="space-y-0.5 px-2 pb-3">
                        {group.links.map((link) => (
                          <li key={link.href + link.label}>
                            <a
                              href={link.href}
                              onClick={onClose}
                              tabIndex={isOpen ? 0 : -1}
                              className="block rounded-xl px-3 py-2 transition hover:bg-cream"
                            >
                              <span className="block text-sm font-medium text-ink">
                                {link.label}
                              </span>
                              {link.description ? (
                                <span className="mt-0.5 block text-xs leading-snug text-muted">
                                  {link.description}
                                </span>
                              ) : null}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>
        </div>

        <div className="shrink-0 border-t border-hairline bg-white px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
          {loading ? (
            <div className="h-12 animate-pulse rounded-xl bg-cream-band" />
          ) : user ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                logout();
              }}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold text-red-600 ring-1 ring-red-200 transition hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  openRoleChooser();
                }}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-ink text-sm font-bold text-white transition hover:bg-ink/90"
              >
                Log in or sign up
                <ArrowRight className="h-4 w-4" />
              </button>
              <p className="mt-2 text-center text-[11px] text-muted">
                Free for parents and tutors
              </p>
            </>
          )}
        </div>
      </aside>
    </div>,
    document.body,
  );
}
