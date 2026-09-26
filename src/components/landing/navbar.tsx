"use client";

import { UserMenu } from "@/components/auth/user-menu";
import { ParentNotificationsBell } from "@/components/parent/parent-notifications-bell";
import { Button } from "@/components/ui/button";
import { MentrBrand } from "@/components/ui/mentr-brand";
import { MentorPhoto } from "@/components/ui/mentor-photo";
import { useAuth } from "@/components/auth/auth-provider";
import { getPublicNavGroups, type PublicNavGroup } from "@/lib/public-nav";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  Crown,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  Search,
  UserRound,
  X,
} from "lucide-react";
import { LearnDino } from "@/components/landing/lp/learn-dino";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

function NavDropdown({
  group,
  open,
  onOpen,
  onClose,
}: {
  group: PublicNavGroup;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const panelId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <div
      ref={wrapRef}
      className="relative"
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
    >
      <button
        type="button"
        className={cn(
          "inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          open
            ? "bg-cream-band text-ink"
            : "text-muted hover:bg-cream-band hover:text-ink",
        )}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => (open ? onClose() : onOpen())}
      >
        {group.id === "learn" && (
          <LearnDino size={18} className="hidden h-[18px] w-[18px] md:inline" />
        )}
        {group.label}
        <ChevronDown
          className={cn("h-3.5 w-3.5 transition", open && "rotate-180")}
        />
      </button>
      {open && (
        <div
          id={panelId}
          className="absolute left-0 top-full z-50 w-72 pt-2"
          role="menu"
        >
          <div className="rounded-xl border border-hairline bg-white p-2 shadow-lg">
            {group.links.map((link) => (
              <a
                key={link.href + link.label}
                href={link.href}
                role="menuitem"
                className="block rounded-lg px-3 py-2.5 transition hover:bg-cream"
                onClick={onClose}
              >
                <span className="block text-sm font-semibold text-ink">
                  {link.label}
                </span>
                {link.description && (
                  <span className="mt-0.5 block text-xs leading-snug text-muted">
                    {link.description}
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState<string | null>(null);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
  const { user, loading, logout, openRoleChooser } = useAuth();
  const navGroups = getPublicNavGroups();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors duration-200",
        scrolled
          ? "border-b border-hairline bg-cream/95 backdrop-blur-md"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-12 w-full min-w-0 max-w-[1400px] items-center justify-between gap-2 px-3 short:h-11 sm:h-14 sm:px-6 short:sm:h-12 lg:h-16 lg:px-8 short:lg:h-12">
        <MentrBrand
          logoClassName="h-5 sm:h-6 lg:h-7"
          priority
          className="min-w-0 shrink"
        />

        <nav className="hidden items-center gap-0.5 lg:flex">
          {navGroups.map((group) => (
            <NavDropdown
              key={group.id}
              group={group}
              open={desktopOpen === group.id}
              onOpen={() => setDesktopOpen(group.id)}
              onClose={() =>
                setDesktopOpen((cur) => (cur === group.id ? null : cur))
              }
            />
          ))}
          <Link href="/premiummentors" className="ml-0.5">
            <Button
              size="sm"
              variant="secondary"
              className="gap-1.5 border-0 bg-transparent font-medium text-muted shadow-none hover:bg-cream-band hover:text-ink"
            >
              <Crown className="h-3.5 w-3.5 text-[#6b87f5]" />
              Premium mentors
            </Button>
          </Link>
        </nav>

        <div className="hidden items-center gap-2.5 md:flex">
          {!loading && !user && (
            <>
              <Link
                href="/search"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-hairline bg-white px-3.5 text-sm font-semibold text-ink transition hover:border-ink/30 hover:bg-cream"
              >
                <Search className="h-4 w-4 text-coral" />
                Find tutors
              </Link>
              <Button size="sm" onClick={() => openRoleChooser()}>
                Log in
              </Button>
            </>
          )}
          {!loading && user && user.role !== "parent" && (
            <Link
              href="/board"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-hairline bg-white px-3.5 text-sm font-semibold text-ink transition hover:border-ink/30 hover:bg-cream"
            >
              <Megaphone className="h-4 w-4 text-coral" />
              Requirements
            </Link>
          )}
          {!loading && user?.role === "parent" && <ParentNotificationsBell />}
          {!loading && user && <UserMenu />}
        </div>

        <div className="flex items-center gap-1.5 lg:hidden">
          <Link href="/premiummentors">
            <Button
              size="sm"
              variant="secondary"
              className="h-9 gap-1 border-0 bg-transparent px-2.5 text-[12px] font-semibold text-muted shadow-none hover:bg-cream-band hover:text-ink"
            >
              <Crown className="h-3.5 w-3.5 text-[#6b87f5]" />
              Premium
            </Button>
          </Link>
          {!loading && user?.role === "parent" && <ParentNotificationsBell />}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-hairline bg-white"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-hairline bg-cream lg:hidden">
          <nav className="flex max-h-[min(80vh,640px)] flex-col gap-1 overflow-y-auto p-4 short:max-h-[min(70dvh,480px)] short:p-3 shorter:max-h-[min(60dvh,360px)]">
            <Link
              href="/premiummentors"
              className="mb-1"
              onClick={() => setOpen(false)}
            >
              <Button
                size="sm"
                variant="secondary"
                className="h-11 w-full justify-start gap-2.5 border-0 bg-transparent px-3 text-sm font-semibold text-ink shadow-none hover:bg-cream-band"
              >
                <Crown className="h-4 w-4 text-[#6b87f5]" />
                Premium mentors
              </Button>
            </Link>
            {navGroups.map((group) => {
              const expanded = mobileGroup === group.id;
              return (
                <div key={group.id} className="rounded-lg border border-hairline/80 bg-white/60">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between px-3 py-3 text-left text-sm font-semibold text-ink"
                    aria-expanded={expanded}
                    onClick={() =>
                      setMobileGroup((cur) =>
                        cur === group.id ? null : group.id,
                      )
                    }
                  >
                    <span className="inline-flex items-center gap-1.5">
                      {group.id === "learn" && (
                        <LearnDino
                          size={18}
                          className="hidden h-[18px] w-[18px] md:inline"
                        />
                      )}
                      {group.label}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-muted transition",
                        expanded && "rotate-180",
                      )}
                    />
                  </button>
                  {expanded && (
                    <div className="space-y-0.5 border-t border-hairline px-2 pb-2 pt-1">
                      {group.links.map((link) => (
                        <a
                          key={link.href + link.label}
                          href={link.href}
                          className="block rounded-lg px-2 py-2.5 text-sm text-muted hover:bg-cream-band hover:text-ink"
                          onClick={() => setOpen(false)}
                        >
                          <span className="font-medium text-ink">
                            {link.label}
                          </span>
                          {link.description && (
                            <span className="mt-0.5 block text-xs text-muted">
                              {link.description}
                            </span>
                          )}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            {!loading && user ? (
              <>
                <div className="mt-1 flex items-center gap-3 rounded-lg bg-cream-band px-3 py-2.5">
                  <MentorPhoto
                    name={
                      user.parentProfile?.name ||
                      user.profile?.name ||
                      user.email
                    }
                    initials={(
                      user.parentProfile?.name ||
                      user.profile?.name ||
                      user.email
                    )
                      .split(/\s+/)
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((p) => p[0]!.toUpperCase())
                      .join("")}
                    imageUrl={
                      user.profileImageUrl ||
                      user.profile?.profileImageUrl ||
                      null
                    }
                    size="sm"
                    rounded="full"
                    showInitials={false}
                    className="!h-9 !w-9"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">
                      {user.parentProfile?.name ||
                        user.profile?.name ||
                        user.email}
                    </p>
                    <p className="text-xs text-muted">
                      {user.role === "parent" ? "Parent" : "Tutor"}
                    </p>
                  </div>
                </div>
                {user.role === "parent" ? (
                  <>
                    <Link
                      href="/parent/dashboard"
                      className="flex items-center gap-2.5 rounded-lg px-3 py-3 text-sm font-medium text-ink hover:bg-cream-band"
                      onClick={() => setOpen(false)}
                    >
                      <LayoutDashboard className="h-4 w-4 text-muted" />
                      Dashboard
                    </Link>
                    <Link
                      href="/search"
                      className="flex items-center gap-2.5 rounded-lg px-3 py-3 text-sm font-medium text-ink hover:bg-cream-band"
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
                      className="flex items-center gap-2.5 rounded-lg px-3 py-3 text-sm font-medium text-ink hover:bg-cream-band"
                      onClick={() => setOpen(false)}
                    >
                      <LayoutDashboard className="h-4 w-4 text-muted" />
                      Dashboard
                    </Link>
                    <Link
                      href="/board"
                      className="flex items-center gap-2.5 rounded-lg px-3 py-3 text-sm font-medium text-ink hover:bg-cream-band"
                      onClick={() => setOpen(false)}
                    >
                      <Megaphone className="h-4 w-4 text-muted" />
                      Requirements board
                    </Link>
                    <Link
                      href="/profiling"
                      className="flex items-center gap-2.5 rounded-lg px-3 py-3 text-sm font-medium text-ink hover:bg-cream-band"
                      onClick={() => setOpen(false)}
                    >
                      <UserRound className="h-4 w-4 text-muted" />
                      Profile
                    </Link>
                  </>
                )}
                <button
                  type="button"
                  className="flex items-center gap-2.5 rounded-lg px-3 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
                  onClick={() => {
                    setOpen(false);
                    logout();
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/search"
                  className="flex items-center justify-center gap-2 rounded-lg border-2 border-ink bg-white px-3 py-3 text-sm font-bold text-ink"
                  onClick={() => setOpen(false)}
                >
                  <Search className="h-4 w-4 text-coral" />
                  Find tutors
                </Link>
                <Button
                  className="w-full"
                  onClick={() => {
                    setOpen(false);
                    openRoleChooser();
                  }}
                >
                  Log in
                </Button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
