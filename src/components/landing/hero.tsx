"use client";

import { ConnectButton } from "@/components/connect/connect-button";
import { PostRequirementButton } from "@/components/requirements/post-requirement-cta";
import { Button } from "@/components/ui/button";
import { BrowserFrame } from "@/components/ui/browser-frame";
import { TEACHERS, type Teacher } from "@/lib/teachers";
import { GLOBAL_REACH_BADGE } from "@/lib/seo";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  BadgeCheck,
  Globe,
  Search,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

const FILTERS = ["All", "Physics", "Mathematics", "English", "Coding"] as const;

function TeacherRow({ teacher }: { teacher: Teacher }) {
  const available = teacher.openSlots > 0;

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-lg border border-hairline bg-white p-3 transition",
        available ? "hover:border-ink/25 hover:shadow-sm" : "opacity-55",
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-hairline bg-cream-band">
          <Image
            src={teacher.imageUrl}
            alt={teacher.name}
            fill
            className="object-cover"
            sizes="40px"
          />
        </div>
        <div className="min-w-0">
          <p className="flex items-center gap-1 truncate text-sm font-semibold text-ink">
            <span className="truncate">{teacher.name}</span>
            {teacher.verified && (
              <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-sage" />
            )}
          </p>
          <p className="truncate text-xs text-muted">{teacher.subjectLine}</p>
          <p className="text-[11px] text-muted">
            {teacher.area.split(",")[0]}
            {available ? (
              <span className="text-sage"> · {teacher.openSlots} open</span>
            ) : (
              <span> · Fully booked</span>
            )}
          </p>
        </div>
      </div>
      {available ? (
        <ConnectButton
          teacher={teacher}
          className="inline-flex shrink-0 items-center gap-1 rounded-md bg-coral px-2.5 py-1.5 text-[11px] font-semibold text-white transition hover:bg-coral-dark"
          requestedClassName="inline-flex shrink-0 items-center gap-1 rounded-md bg-cream px-2.5 py-1.5 text-[11px] font-semibold text-muted"
        />
      ) : (
        <span className="shrink-0 text-[11px] font-medium text-muted">Booked</span>
      )}
    </div>
  );
}

function InteractiveSearchMock() {
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState<(typeof FILTERS)[number]>("All");
  const [onlyOpen, setOnlyOpen] = useState(true);

  const results = useMemo(() => {
    return TEACHERS.filter((t) => {
      if (onlyOpen && t.openSlots <= 0) return false;
      if (subject !== "All" && !t.subjects.some((s) => s.includes(subject))) {
        return false;
      }
      if (query.trim()) {
        const q = query.toLowerCase();
        const hay = `${t.name} ${t.subjectLine} ${t.area} ${t.subjects.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [query, subject, onlyOpen]);

  return (
    <BrowserFrame
      url="mentr.in / search"
      headerClassName="bg-white"
      className="relative"
    >
      <div className="bg-white">
        <div className="space-y-3 border-b border-hairline px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search subject — e.g. Class 10 Physics"
              className="h-10 w-full rounded-md border border-hairline bg-cream pl-9 pr-3 text-sm outline-none transition focus:border-ink/30 focus:ring-2 focus:ring-ink/5"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setSubject(f)}
                className={cn(
                  "shrink-0 rounded-md px-2.5 py-1 text-xs font-semibold transition",
                  subject === f
                    ? "bg-ink text-white"
                    : "bg-cream text-muted hover:bg-cream-band hover:text-ink",
                )}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setOnlyOpen((v) => !v)}
              className="flex items-center gap-2 text-xs font-medium text-muted"
            >
              <span
                className={cn(
                  "relative h-5 w-9 rounded-full transition",
                  onlyOpen ? "bg-sage" : "bg-hairline",
                )}
                aria-hidden
              >
                <span
                  className={cn(
                    "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition",
                    onlyOpen ? "left-4" : "left-0.5",
                  )}
                />
              </span>
              Open slots only
            </button>
            <p className="text-xs text-muted">
              {results.length} teacher{results.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        <div
          className="max-h-[280px] space-y-2 overflow-y-auto overscroll-contain bg-cream/40 p-3 sm:max-h-[320px]"
          onWheel={(e) => e.stopPropagation()}
        >
          {results.length === 0 ? (
            <p className="px-2 py-8 text-center text-sm text-muted">
              No teachers match — try another subject or turn off open-only.
            </p>
          ) : (
            results.map((t) => <TeacherRow key={t.id} teacher={t} />)
          )}
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-hairline bg-white px-4 py-2.5">
          <p className="text-[11px] font-medium text-muted">
            Scroll the list · tap Connect to request
          </p>
          <Link
            href="/search"
            className="text-[11px] font-semibold text-coral hover:underline"
          >
            Open full search →
          </Link>
        </div>
      </div>
    </BrowserFrame>
  );
}

export function Hero() {
  return (
    <section className="relative border-b border-hairline bg-cream">
      <div className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-12">
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-md border border-hairline bg-white px-3 py-1.5 text-sm text-ink">
              <Globe className="h-3.5 w-3.5 text-sage" />
              <span className="font-medium">{GLOBAL_REACH_BADGE}</span>
              <span className="text-hairline">·</span>
              <span className="inline-flex items-center gap-1 text-muted">
                <ShieldCheck className="h-3.5 w-3.5 text-sage" />
                Verified faculty
              </span>
            </div>

            <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[52px] lg:leading-[1.05]">
              Find your child&apos;s teacher.
              <span className="mt-1 block font-semibold text-muted sm:mt-2 sm:text-[28px] lg:text-[32px]">
                Faculty get found — free.
              </span>
            </h1>

            <p className="mx-auto max-w-md text-base leading-relaxed text-muted lg:mx-0 sm:text-lg">
              Search verified faculty near you or online from any country —
              send a connect request or post your requirement free. WhatsApp
              unlocks once they accept. ₹0 platform fee.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-muted lg:justify-start">
              <span className="rounded-md bg-white px-2.5 py-1 ring-1 ring-hairline">
                Search &amp; connect
              </span>
              <span className="rounded-md bg-white px-2.5 py-1 ring-1 ring-hairline">
                Post requirement · get pitches
              </span>
            </div>

            <div className="flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
              <Link href="/search">
                <Button size="lg" className="w-full sm:w-auto">
                  Find a teacher
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <PostRequirementButton
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto"
              />
              <Link
                href="/faculty/signup"
                className="text-sm font-semibold text-muted hover:text-ink"
              >
                Faculty register →
              </Link>
            </div>
          </div>

          <div className="relative">
            <InteractiveSearchMock />
            <p className="mt-3 text-center text-xs text-muted lg:text-left">
              Try filters, toggle open slots, and scroll — this is the real search flow.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
