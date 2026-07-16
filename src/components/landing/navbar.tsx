"use client";

import { UserMenu } from "@/components/auth/user-menu";
import { Button } from "@/components/ui/button";
import { MentrBrand } from "@/components/ui/mentr-brand";
import { useAuth } from "@/components/auth/auth-provider";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  Search,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "For parents", href: "/parents" },
  { label: "For faculty", href: "/for-faculty" },
  { label: "FAQ", href: "/faq" },
  { label: "Blog", href: "/blog" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, loading, logout, openRoleChooser } = useAuth();

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
      <div className="mx-auto flex h-16 w-full min-w-0 max-w-[1400px] items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
        <MentrBrand logoClassName="h-7" priority className="min-w-0 shrink" />

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-cream-band hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2.5 md:flex">
          {!loading && !user && (
            <Button size="sm" onClick={() => openRoleChooser()}>
              Log in
            </Button>
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
          {!loading && user && <UserMenu />}
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex h-11 w-11 items-center justify-center rounded-lg border border-hairline bg-white md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-hairline bg-cream md:hidden">
          <nav className="flex flex-col gap-1 p-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-3 text-sm font-medium text-muted hover:bg-cream-band hover:text-ink"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            {!loading && user ? (
              <>
                <div className="mt-1 flex items-center gap-3 rounded-lg bg-cream-band px-3 py-2.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-coral text-sm font-bold text-white">
                    {(user.parentProfile?.name || user.profile?.name || user.email)
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">
                      {user.parentProfile?.name || user.profile?.name || user.email}
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
                      My connections
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
              <Button
                className="w-full"
                onClick={() => {
                  setOpen(false);
                  openRoleChooser();
                }}
              >
                Log in
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
