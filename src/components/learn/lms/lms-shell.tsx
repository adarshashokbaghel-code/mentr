"use client";

import { LearnDino } from "@/components/landing/lp/learn-dino";
import { cn } from "@/lib/utils";
import {
  Flame,
  Home,
  Map,
  Sparkles,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const NAV: {
  href: string;
  label: string;
  icon: typeof Home;
  exact?: boolean;
}[] = [
  { href: "/learn/app", label: "Home", icon: Home, exact: true },
  { href: "/learn/app/path", label: "Learn", icon: Map },
  { href: "/learn/app/progress", label: "Progress", icon: Sparkles },
  { href: "/learn/app/me", label: "Me", icon: UserRound },
];

export function LmsShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "";

  return (
    <div className="flex min-h-dvh flex-col bg-[#fff8ef] font-[family-name:var(--font-learn-face),var(--font-sans-face),sans-serif] lg:flex-row">
      {/* Desktop sidebar */}
      <aside className="hidden w-[88px] shrink-0 flex-col border-r border-[#efe6d8] bg-white lg:flex xl:w-[220px]">
        <div className="flex items-center gap-2.5 border-b border-[#f0ebe3] px-3 py-4 xl:px-4">
          <LearnDino size={40} className="h-10 w-10 shrink-0" priority />
          <div className="hidden min-w-0 xl:block">
            <p className="truncate text-[15px] font-extrabold text-[#1c2434]">
              Mentr Learn
            </p>
            <p className="truncate text-[11px] font-semibold text-[#8a929c]">
              Class 3–5
            </p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-2 xl:p-3">
          {NAV.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-3 py-3 text-[14px] font-bold transition xl:px-3.5",
                  active
                    ? "bg-[#fff4e8] text-[#ff6a1a]"
                    : "text-[#5a6472] hover:bg-[#faf8f4] hover:text-[#1c2434]",
                )}
              >
                <Icon className="mx-auto h-6 w-6 shrink-0 xl:mx-0" strokeWidth={2.25} />
                <span className="hidden xl:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-[#f0ebe3] p-3">
          <div className="mb-2 hidden items-center gap-1.5 rounded-xl bg-[#fff8d6] px-2.5 py-2 xl:flex">
            <Flame className="h-4 w-4 text-[#b45309]" />
            <span className="text-[12px] font-bold text-[#b45309]">6-day streak</span>
          </div>
          <Link
            href="/learn"
            className="block text-center text-[11px] font-semibold text-[#8a929c] hover:text-[#1c2434] xl:text-left"
          >
            Parent site →
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col pb-[76px] lg:pb-0">
        <header className="flex items-center justify-between gap-3 border-b border-[#efe6d8] bg-white/90 px-4 py-3 backdrop-blur-md lg:px-6">
          <div className="flex items-center gap-2 lg:hidden">
            <LearnDino size={36} className="h-9 w-9" />
            <p className="text-[16px] font-extrabold text-[#1c2434]">Learn</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#fff8d6] px-2.5 py-1 text-[12px] font-bold text-[#b45309]">
              <Flame className="h-3.5 w-3.5" /> 6
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#fff4e8] px-2.5 py-1 text-[12px] font-bold text-[#ff6a1a]">
              <Sparkles className="h-3.5 w-3.5" /> 40 XP
            </span>
          </div>
        </header>

        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-5 sm:px-6 sm:py-7">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-[#efe6d8] bg-white/95 px-1 pb-[env(safe-area-inset-bottom)] pt-1 backdrop-blur-md lg:hidden">
        {NAV.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-xl px-1 py-2 text-[11px] font-bold",
                active ? "text-[#ff6a1a]" : "text-[#8a929c]",
              )}
            >
              <Icon className="h-6 w-6" strokeWidth={2.25} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
