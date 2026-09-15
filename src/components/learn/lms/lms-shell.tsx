"use client";

import { LearnDino } from "@/components/landing/lp/learn-dino";
import { LmsPotdProvider, useLmsPotd } from "@/components/learn/lms/lms-potd-context";
import {
  fetchLearnEnrollment,
  readLearnEnrollmentLocal,
  type LearnEnrollmentDto,
} from "@/lib/learn-enroll";
import { cn } from "@/lib/utils";
import {
  Blocks,
  Flame,
  Home,
  Library,
  Map,
  Sparkles,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

const NAV: {
  href: string;
  label: string;
  icon: typeof Home;
  exact?: boolean;
}[] = [
  { href: "/learn/app", label: "Home", icon: Home, exact: true },
  { href: "/learn/app/path", label: "Learn", icon: Map },
  { href: "/learn/app/build", label: "Build", icon: Blocks },
  { href: "/learn/app/practice", label: "Practice", icon: Library },
  { href: "/learn/app/progress", label: "Progress", icon: Sparkles },
  { href: "/learn/app/me", label: "Me", icon: UserRound },
];

function ShellChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "";
  const { openPotd } = useLmsPotd();
  const [enrollment, setEnrollment] = useState<LearnEnrollmentDto | null>(null);

  useEffect(() => {
    setEnrollment(readLearnEnrollmentLocal());
    void fetchLearnEnrollment().then(setEnrollment);
  }, []);

  const xp = enrollment?.progress?.xp ?? 0;
  const streak = enrollment?.progress?.streakDays ?? 0;

  return (
    <div className="flex h-dvh max-h-dvh flex-col overflow-hidden bg-[#f6f4f0] font-[family-name:var(--font-learn-face),var(--font-sans-face),sans-serif] lg:flex-row">
      {/* Desktop sidebar — own scroll so footer stays reachable */}
      <aside className="hidden h-full w-[88px] shrink-0 flex-col overflow-y-auto overscroll-contain border-r border-[#e8e2d8] bg-white lg:flex xl:w-[220px]">
        <div className="sticky top-0 z-10 flex shrink-0 items-center gap-2.5 border-b border-[#f0ebe3] bg-white px-3 py-4 xl:px-4">
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
                <Icon
                  className="mx-auto h-6 w-6 shrink-0 xl:mx-0"
                  strokeWidth={2.25}
                />
                <span className="hidden xl:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto shrink-0 border-t border-[#f0ebe3] bg-white p-3 ">
          <button
            type="button"
            onClick={() => openPotd()}
            className="mb-2 hidden w-full items-center gap-1.5 rounded-xl bg-[#fff8d6] px-2.5 py-2 text-left transition hover:brightness-95 xl:flex"
          >
            <Flame className="h-4 w-4 shrink-0 text-[#b45309]" />
            <span className="text-[12px] font-bold leading-snug text-[#b45309]">
              {streak}-day streak · Today&apos;s POTD
            </span>
          </button>
       
        </div>
      </aside>

      {/* Main column scrolls independently */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex shrink-0 items-center justify-between gap-3 border-b border-[#e8e2d8] bg-white/95 px-4 py-3 backdrop-blur-md lg:px-6 xl:px-8">
          <div className="flex min-w-0 items-center gap-2 lg:hidden">
            <LearnDino size={36} className="h-9 w-9 shrink-0" />
            <p className="truncate text-[16px] font-extrabold text-[#1c2434]">
              Learn
            </p>
          </div>
          <p className="hidden text-[14px] font-bold text-[#5a6472] lg:block">
            Dashboard
          </p>
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => openPotd()}
              title="Open today's Problem of the Day"
              className="inline-flex items-center gap-1 rounded-full bg-[#fff8d6] px-2.5 py-1 text-[12px] font-bold text-[#b45309] transition hover:brightness-95"
            >
              <Flame className="h-3.5 w-3.5" /> {streak}
            </button>
            <button
              type="button"
              onClick={() => openPotd()}
              title="Open today's Problem of the Day"
              className="inline-flex items-center gap-1 rounded-full bg-[#fff4e8] px-2.5 py-1 text-[12px] font-bold text-[#ff6a1a] transition hover:brightness-95"
            >
              <Sparkles className="h-3.5 w-3.5" /> {xp} XP
            </button>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 pb-24 sm:px-6 sm:py-6 lg:px-8 lg:pb-8 xl:px-10">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-6 border-t border-[#e8e2d8] bg-white/95 px-0.5 pb-[env(safe-area-inset-bottom)] pt-1 backdrop-blur-md lg:hidden">
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
                "flex flex-col items-center gap-0.5 rounded-xl px-0.5 py-2 text-[10px] font-bold",
                active ? "text-[#ff6a1a]" : "text-[#8a929c]",
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={2.25} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function LmsShell({ children }: { children: ReactNode }) {
  return (
    <LmsPotdProvider>
      <ShellChrome>{children}</ShellChrome>
    </LmsPotdProvider>
  );
}
