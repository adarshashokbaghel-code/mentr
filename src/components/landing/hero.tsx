"use client";

import { ConnectButton } from "@/components/connect/connect-button";
import { ParentActionLink, FacultyActionLink } from "@/components/auth/role-guard-link";
import {
  hardShadowSm,
  LpBadge,
  LpBlob,
  LpGridBg,
  LpLiveDot,
  LpMockStage,
  LpPill,
} from "@/components/landing/lp/shared";
import { PostRequirementButton } from "@/components/requirements/post-requirement-cta";
import { Button } from "@/components/ui/button";
import { BrowserFrame } from "@/components/ui/browser-frame";
import { TEACHERS, type Teacher } from "@/lib/teachers";
import { GLOBAL_REACH_LINE } from "@/lib/seo";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  BadgeCheck,
  Megaphone,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

const FILTERS = ["All", "Physics", "Mathematics", "English", "Coding"] as const;

const BOARD_PREVIEW = [
  {
    subject: "Class 10 Maths",
    area: "HSR Layout · Weekend",
    pitches: 3,
    fresh: true,
  },
  {
    subject: "IIT Physics",
    area: "Koramangala · Online",
    pitches: 1,
    fresh: false,
  },
  {
    subject: "Spoken English",
    area: "Indiranagar · Evening",
    pitches: 5,
    fresh: true,
  },
] as const;

function TeacherRow({ teacher }: { teacher: Teacher }) {
  const available = teacher.openSlots > 0;

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-xl border-2 bg-white p-3 transition-all duration-200",
        available
          ? "border-ink/10 hover:border-ink/30 hover:shadow-[2px_2px_0_0_#1c1a17]"
          : "border-hairline opacity-50",
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border-2 border-ink/10 bg-cream-band">
          <Image
            src={teacher.imageUrl}
            alt={teacher.name}
            fill
            className="object-cover"
            sizes="44px"
          />
        </div>
        <div className="min-w-0">
          <p className="flex items-center gap-1 truncate text-sm font-bold text-ink">
            <span className="truncate">{teacher.name}</span>
            {teacher.verified && (
              <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-sage" />
            )}
          </p>
          <p className="truncate text-xs text-muted">{teacher.subjectLine}</p>
          <p className="text-[11px] text-muted">
            {teacher.area.split(",")[0]}
            {available ? (
              <span className="font-semibold text-sage">
                {" "}
                · {teacher.openSlots} open
              </span>
            ) : (
              <span> · Fully booked</span>
            )}
          </p>
        </div>
      </div>
      {available ? (
        <ConnectButton
          teacher={teacher}
          className="inline-flex shrink-0 items-center gap-1 rounded-lg border-2 border-ink bg-coral px-2.5 py-1.5 text-[11px] font-bold text-white shadow-[2px_2px_0_0_#1c1a17] transition hover:bg-coral-dark"
          requestedClassName="inline-flex shrink-0 items-center gap-1 rounded-lg border-2 border-hairline bg-cream px-2.5 py-1.5 text-[11px] font-bold text-muted"
        />
      ) : (
        <span className="shrink-0 text-[11px] font-semibold text-muted">
          Booked
        </span>
      )}
    </div>
  );
}

function HeroSearchPanel() {
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
        const hay =
          `${t.name} ${t.subjectLine} ${t.area} ${t.subjects.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    }).slice(0, 4);
  }, [query, subject, onlyOpen]);

  return (
    <BrowserFrame
      url="mentr.in / search"
      headerClassName="bg-white"
      className="border-2 border-ink"
    >
      <div className="bg-white">
        <div className="flex items-center justify-between border-b-2 border-ink/10 bg-cream px-4 py-2.5">
          <LpLiveDot label="12 tutors online" />
          <span className="text-[10px] font-bold text-muted">
            {results.length} results
          </span>
        </div>

        <div className="space-y-3 border-b border-hairline px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Class 10 Physics near Indiranagar"
              className="h-11 w-full rounded-lg border-2 border-ink/10 bg-cream pl-10 pr-3 text-sm font-medium outline-none transition focus:border-ink/30 focus:ring-2 focus:ring-coral/20"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setSubject(f)}
                className={cn(
                  "shrink-0 rounded-lg border-2 px-3 py-1 text-xs font-bold transition",
                  subject === f
                    ? "border-ink bg-ink text-white shadow-[2px_2px_0_0_#1c1a17]"
                    : "border-transparent bg-cream text-muted hover:bg-cream-band",
                )}
              >
                {f}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setOnlyOpen((v) => !v)}
            className="flex w-full items-center justify-between rounded-lg border-2 border-ink/10 bg-cream px-3 py-2 text-left transition hover:border-ink/25"
          >
            <span className="text-xs font-semibold text-ink">Open slots only</span>
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
          </button>
        </div>

        <div
          className="max-h-[260px] space-y-2 overflow-y-auto overscroll-contain bg-cream/50 p-3 sm:max-h-[280px]"
          onWheel={(e) => e.stopPropagation()}
        >
          {results.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">
              No matches — try another subject or turn off open-only.
            </p>
          ) : (
            results.map((t) => <TeacherRow key={t.id} teacher={t} />)
          )}
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-hairline bg-butter/40 px-4 py-2.5">
          <p className="text-[10px] font-semibold text-muted">
            Connect → tutor accepts → WhatsApp unlocks
          </p>
          <ParentActionLink
            href="/search"
            className="text-[10px] font-bold text-coral hover:underline"
          >
            Full search →
          </ParentActionLink>
        </div>
      </div>
    </BrowserFrame>
  );
}

function HeroBoardPanel() {
  return (
    <BrowserFrame
      url="mentr.in / board"
      headerClassName="bg-white"
      className="border-2 border-ink"
    >
      <div className="bg-white">
        <div className="flex items-center justify-between border-b-2 border-ink/10 bg-cream px-4 py-2.5">
          <LpLiveDot label="Board live" />
          <span className="text-[10px] font-bold text-muted">3 open posts</span>
        </div>

        <div className="space-y-2 bg-cream/40 p-3">
          {BOARD_PREVIEW.map((req) => (
            <div
              key={req.subject}
              className={cn(
                "rounded-xl border-2 border-ink/10 bg-white p-3 transition hover:border-ink/25",
                hardShadowSm,
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-bold text-ink">{req.subject}</p>
                  <p className="mt-0.5 text-xs text-muted">{req.area}</p>
                </div>
                {req.fresh && (
                  <span className="shrink-0 rounded-md border border-coral/30 bg-coral-wash px-2 py-0.5 text-[10px] font-bold text-coral">
                    New
                  </span>
                )}
              </div>
              <p className="mt-2 text-[11px] font-semibold text-muted">
                {req.pitches} tutor pitch{req.pitches === 1 ? "" : "es"} sent
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-hairline bg-butter/40 px-4 py-2.5">
          <p className="text-[10px] font-semibold text-muted">
            Tutors pitch free · parents stay anonymous
          </p>
          <FacultyActionLink
            href="/board"
            className="text-[10px] font-bold text-coral hover:underline"
          >
            Open board →
          </FacultyActionLink>
        </div>
      </div>
    </BrowserFrame>
  );
}

function HeroInteractiveMock() {
  const [mode, setMode] = useState<"search" | "board">("search");

  return (
    <div className="space-y-3">
      <div className="flex rounded-xl border-2 border-ink bg-white p-1 shadow-[3px_3px_0_0_#1c1a17]">
        <button
          type="button"
          onClick={() => setMode("search")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-bold transition",
            mode === "search"
              ? "bg-ink text-white"
              : "text-muted hover:bg-cream",
          )}
        >
          <Search className="h-3.5 w-3.5" />
          Search tutors
        </button>
        <button
          type="button"
          onClick={() => setMode("board")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-bold transition",
            mode === "board"
              ? "bg-ink text-white"
              : "text-muted hover:bg-cream",
          )}
        >
          <Megaphone className="h-3.5 w-3.5" />
          Requirements board
        </button>
      </div>

      <LpMockStage
        chips={[
          {
            label: "✓ Verified",
            className: "-left-3 top-10",
            style: { transform: "rotate(-4deg)" },
          },
          {
            label: "₹0 forever",
            className: "-right-2 top-14",
            style: { transform: "rotate(3deg)" },
          },
          {
            label: mode === "search" ? "Open slots" : "Free pitches",
            className: "-bottom-2 left-6",
            style: { transform: "rotate(-2deg)" },
          },
        ]}
      >
        {mode === "search" ? <HeroSearchPanel /> : <HeroBoardPanel />}
      </LpMockStage>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-hairline bg-cream">
      <LpGridBg />
      <LpBlob color="rgba(235,228,255,0.7)" size={360} className="-left-32 -top-20" />
      <LpBlob color="rgba(255,241,228,0.8)" size={300} className="-right-24 bottom-0" />
      <LpBlob color="rgba(230,246,238,0.55)" size={220} className="right-1/3 top-1/2 hidden lg:block" />

      <div className="relative mx-auto max-w-[1400px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.08fr] lg:gap-14">
          <div className="space-y-7 text-center lg:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              <LpBadge>
                <ShieldCheck className="h-3.5 w-3.5 text-sage" />
                Verified faculty
              </LpBadge>
              <LpBadge variant="coral">
                <Sparkles className="h-3.5 w-3.5" />
                100% free
              </LpBadge>
            </div>

            <h1 className="text-[2.65rem] font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-[56px]">
              Find verified tutors
              <br />
              &amp; mentors worldwide.
              <span className="mt-3 block text-[1.55rem] font-semibold leading-snug text-coral sm:text-[1.9rem] lg:text-[2.1rem]">
                Free for parents. Free for faculty.
              </span>
            </h1>

            <p className="mx-auto max-w-lg text-base leading-relaxed text-muted lg:mx-0 sm:text-lg">
              Search open slots near you or online, send a connect request, or
              post your requirement and review tutor pitches — WhatsApp unlocks
              once either side accepts. ₹0 platform fee, no commission, ever.
            </p>
            <p className="mx-auto max-w-lg text-sm leading-relaxed text-muted/90 lg:mx-0">
              {GLOBAL_REACH_LINE}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              <LpPill tint="sage">Search &amp; connect</LpPill>
              <LpPill tint="butter">Post &amp; get pitches</LpPill>
              <LpPill tint="coral">Faculty keep 100%</LpPill>
            </div>

            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center lg:justify-start">
              <ParentActionLink href="/search" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="h-13 w-full gap-2 px-8 text-base shadow-[3px_3px_0_0_#1c1a17] sm:w-auto"
                >
                  <Search className="h-4 w-4" />
                  Find a teacher
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </ParentActionLink>
              <PostRequirementButton
                size="lg"
                variant="secondary"
                className="h-13 w-full border-2 border-ink shadow-[3px_3px_0_0_#1c1a17] sm:w-auto"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                href="/parents"
                className={cn(
                  "rounded-xl border-2 border-ink/10 bg-white p-4 text-left transition hover:border-ink hover:bg-cream-band",
                  hardShadowSm,
                  "hover:-translate-y-0.5",
                )}
              >
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-coral">
                  <Users className="h-3.5 w-3.5" />
                  For parents
                </p>
                <p className="mt-2 text-sm font-bold text-ink">
                  Search tutors or post a requirement
                </p>
                <p className="mt-1 text-xs text-muted">
                  Compare profiles, accept pitches, connect on WhatsApp.
                </p>
              </Link>
              <Link
                href="/for-faculty"
                className={cn(
                  "rounded-xl border-2 border-ink/10 bg-white p-4 text-left transition hover:border-ink hover:bg-cream-band",
                  hardShadowSm,
                  "hover:-translate-y-0.5",
                )}
              >
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-sage">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  For faculty
                </p>
                <p className="mt-2 text-sm font-bold text-ink">
                  List free &amp; get found worldwide
                </p>
                <p className="mt-1 text-xs text-muted">
                  Receive requests, pitch on the board, keep every rupee.
                </p>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-3 pt-1 lg:justify-start">
              <div className="flex -space-x-2">
                {["AR", "VS", "MK", "RJ"].map((init) => (
                  <span
                    key={init}
                    className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-cream bg-lavender text-[10px] font-bold text-ink"
                  >
                    {init}
                  </span>
                ))}
              </div>
              <p className="text-left text-xs leading-snug text-muted">
                <span className="font-bold text-ink">Parents &amp; tutors</span>{" "}
                connecting
                <br />
                locally and online this month
              </p>
            </div>
          </div>

          <div>
            <HeroInteractiveMock />
            <p className="mt-4 text-center text-xs leading-relaxed text-muted lg:text-left">
              Switch tabs to preview both paths — filter tutors, toggle open
              slots, or browse live requirements on the board.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
