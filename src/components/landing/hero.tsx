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
} from "@/components/landing/lp/shared";
import { PostRequirementButton } from "@/components/requirements/post-requirement-cta";
import { Button } from "@/components/ui/button";
import { BrowserFrame } from "@/components/ui/browser-frame";
import { fetchPublicTeachers, type Teacher } from "@/lib/teachers";
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
import { MentorPhoto } from "@/components/ui/mentor-photo";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const HERO_ORDER_KEY = "mentr_hero_tutor_order_v1";

function shuffleTeachers(list: Teacher[]): Teacher[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Stable random order for this tab session so remounts don't reshuffle. */
function orderTeachers(teachers: Teacher[]): Teacher[] {
  if (teachers.length === 0) return [];
  try {
    const raw = sessionStorage.getItem(HERO_ORDER_KEY);
    const map = new Map(teachers.map((t) => [t.id, t]));
    if (raw) {
      const ids = JSON.parse(raw) as string[];
      const ordered: Teacher[] = [];
      for (const id of ids) {
        const t = map.get(id);
        if (t) {
          ordered.push(t);
          map.delete(id);
        }
      }
      const rest = shuffleTeachers([...map.values()]);
      const next = [...ordered, ...rest];
      sessionStorage.setItem(HERO_ORDER_KEY, JSON.stringify(next.map((t) => t.id)));
      return next;
    }
    const shuffled = shuffleTeachers(teachers);
    sessionStorage.setItem(
      HERO_ORDER_KEY,
      JSON.stringify(shuffled.map((t) => t.id)),
    );
    return shuffled;
  } catch {
    return shuffleTeachers(teachers);
  }
}

function useHeroTeachers() {
  const [pool, setPool] = useState<Teacher[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchPublicTeachers({ liveOnly: true }).then(({ teachers }) => {
      if (cancelled) return;
      setPool(orderTeachers(teachers.filter((t) => t.live)));
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return { pool, ready };
}

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

function TeacherRowSkeleton() {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border-2 border-ink/10 bg-white p-3">
      <div className="flex min-w-0 items-center gap-3">
        <Skeleton className="h-10 w-10 shrink-0 rounded-lg bg-cream-band" />
        <div className="min-w-0 space-y-1.5">
          <Skeleton className="h-3.5 w-28 bg-cream-band" />
          <Skeleton className="h-3 w-36 bg-cream-band" />
          <Skeleton className="h-2.5 w-24 bg-cream-band" />
        </div>
      </div>
      <Skeleton className="h-7 w-16 shrink-0 rounded-lg bg-cream-band" />
    </div>
  );
}

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
        <MentorPhoto
          name={teacher.name}
          initials={teacher.initials}
          kind={teacher.kind}
          imageUrl={teacher.imageUrl}
          size="sm"
          rounded="lg"
        />
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

function HeroSearchPanel({
  pool = [],
  ready = false,
}: {
  pool?: Teacher[];
  ready?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("All");
  const [onlyOpen, setOnlyOpen] = useState(true);

  const filters = useMemo(() => {
    const seen: string[] = [];
    for (const t of pool) {
      for (const s of t.subjects) {
        if (s && !seen.includes(s)) seen.push(s);
      }
    }
    return ["All", ...seen.slice(0, 4)];
  }, [pool]);

  useEffect(() => {
    if (subject !== "All" && !filters.includes(subject)) setSubject("All");
  }, [filters, subject]);

  const results = useMemo(() => {
    return pool
      .filter((t) => {
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
      })
      .slice(0, 4);
  }, [pool, query, subject, onlyOpen]);

  return (
    <BrowserFrame
      url="mentr.in / search"
      headerClassName="bg-white"
      className="border-2 border-ink"
    >
      <div className="bg-white">
        <div className="flex items-center justify-between border-b-2 border-ink/10 bg-cream px-4 py-2.5">
          <LpLiveDot
            label={
              ready
                ? `${pool.length} tutor${pool.length === 1 ? "" : "s"} listed`
                : "Loading tutors…"
            }
          />
          <span className="text-[10px] font-bold text-muted">
            {ready ? `${results.length} results` : "…"}
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

          <div className="flex flex-wrap gap-1.5 sm:flex-nowrap sm:overflow-x-auto sm:pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {filters.map((f) => (
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
          className="max-h-[260px] space-y-2 overflow-y-auto overscroll-contain bg-cream/50 p-3 short:max-h-[160px] shorter:max-h-[120px] sm:max-h-[280px] short:sm:max-h-[180px]"
          onWheel={(e) => e.stopPropagation()}
        >
          {!ready ? (
            <>
              <TeacherRowSkeleton />
              <TeacherRowSkeleton />
              <TeacherRowSkeleton />
              <TeacherRowSkeleton />
            </>
          ) : results.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">
              {pool.length === 0
                ? "Registered tutors will show up here."
                : "No matches — try another subject or turn off open-only."}
            </p>
          ) : (
            results.map((t) => <TeacherRow key={t.id} teacher={t} />)
          )}
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-hairline bg-butter/40 px-4 py-2.5">
          <p className="text-[10px] font-semibold text-muted">
            They accept → WhatsApp opens
          </p>
          <ParentActionLink
            href="/search"
            className="text-[10px] font-bold text-coral hover:underline"
          >
            See all tutors →
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

function HeroInteractiveMock({
  pool,
  ready,
}: {
  pool: Teacher[];
  ready: boolean;
}) {
  const [mode, setMode] = useState<"search" | "board">("search");

  return (
    <div className="min-w-0 w-full max-w-full space-y-3">
      <div className="flex w-full min-w-0 rounded-xl border-2 border-ink bg-white p-1 shadow-[3px_3px_0_0_#1c1a17]">
        <button
          type="button"
          onClick={() => setMode("search")}
          className={cn(
            "flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-[11px] font-bold transition sm:gap-2 sm:px-3 sm:text-xs",
            mode === "search"
              ? "bg-ink text-white"
              : "text-muted hover:bg-cream",
          )}
        >
          <Search className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">Search</span>
          <span className="hidden truncate sm:inline">tutors</span>
        </button>
        <button
          type="button"
          onClick={() => setMode("board")}
          className={cn(
            "flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-[11px] font-bold transition sm:gap-2 sm:px-3 sm:text-xs",
            mode === "board"
              ? "bg-ink text-white"
              : "text-muted hover:bg-cream",
          )}
        >
          <Megaphone className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate sm:hidden">Board</span>
          <span className="hidden truncate sm:inline">Requirements board</span>
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
        {mode === "search" ? (
          <HeroSearchPanel pool={pool} ready={ready} />
        ) : (
          <HeroBoardPanel />
        )}
      </LpMockStage>
    </div>
  );
}

export function Hero() {
  const { pool, ready } = useHeroTeachers();
  const previewFaces = pool.slice(0, 4);

  return (
    <section className="relative overflow-hidden border-b border-hairline bg-cream">
      <LpGridBg />
      <LpBlob color="rgba(235,228,255,0.7)" size={360} className="-left-32 -top-20" />
      <LpBlob color="rgba(255,241,228,0.8)" size={300} className="-right-24 bottom-0" />
      <LpBlob color="rgba(230,246,238,0.55)" size={220} className="right-1/3 top-1/2 hidden lg:block" />

      <div className="relative mx-auto w-full max-w-[1400px] px-4 py-10 short:py-6 shorter:py-4 sm:px-6 sm:py-16 short:sm:py-8 lg:px-8 lg:py-24 short:lg:py-10 shorter:lg:py-8">
        <div className="grid w-full min-w-0 items-center gap-8 short:gap-5 shorter:gap-4 sm:gap-12 short:sm:gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:gap-14 short:lg:gap-8">
          <div className="min-w-0 w-full max-w-full space-y-5 short:space-y-3 shorter:space-y-2.5 sm:space-y-6 short:sm:space-y-4 text-center lg:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start short:gap-1.5">
              <LpBadge>
                <ShieldCheck className="h-3.5 w-3.5 text-sage" />
                Verified tutors
              </LpBadge>
              <LpBadge variant="coral">
                <Sparkles className="h-3.5 w-3.5" />
                Free forever
              </LpBadge>
            </div>

            <h1 className="text-[1.75rem] font-bold leading-[1.08] tracking-tight text-balance text-ink short:text-[1.5rem] shorter:text-[1.35rem] sm:text-4xl short:sm:text-[1.85rem] lg:text-[52px] lg:leading-[1.05] short:lg:text-[2.35rem] shorter:lg:text-[2.1rem]">
              Find a verified tutor
              <br />
              near you or online.
              <span className="mt-2.5 block text-lg font-semibold leading-snug text-coral short:mt-1.5 short:text-base shorter:text-[15px] sm:text-xl short:sm:text-lg lg:text-[1.85rem] short:lg:text-xl">
                Free for parents and teachers.
              </span>
            </h1>

            <p className="mx-auto max-w-md text-base leading-relaxed text-pretty text-muted lg:mx-0 short:text-sm short:leading-snug sm:text-[17px]">
              Browse profiles, send a request, or post what you need. Chat on
              WhatsApp after they accept — no platform fee.
            </p>

            <div className="flex w-full max-w-full flex-col items-stretch gap-3 short:gap-2 sm:flex-row sm:flex-wrap sm:items-center lg:justify-start">
              <ParentActionLink href="/search" className="block w-full max-w-full sm:w-auto">
                <Button
                  size="lg"
                  className="h-13 w-full max-w-full gap-2 px-5 text-base shadow-[3px_3px_0_0_#1c1a17] short:h-11 short:text-sm sm:w-auto sm:px-8 short:sm:h-12"
                >
                  <Search className="h-4 w-4 shrink-0" />
                  Find a teacher
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </Button>
              </ParentActionLink>
              <PostRequirementButton
                size="lg"
                variant="secondary"
                className="h-13 w-full max-w-full border-2 border-ink px-5 shadow-[3px_3px_0_0_#1c1a17] short:h-11 short:text-sm sm:w-auto sm:px-8 short:sm:h-12"
              />
            </div>

            <div className="grid w-full min-w-0 gap-2.5 short:gap-2 shorter:hidden sm:grid-cols-2">
              <Link
                href="/parents"
                className={cn(
                  "rounded-xl border-2 border-ink/10 bg-white px-4 py-3 text-left transition hover:border-ink hover:bg-cream-band short:px-3 short:py-2.5",
                  hardShadowSm,
                  "hover:-translate-y-0.5",
                )}
              >
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-coral">
                  <Users className="h-3.5 w-3.5" />
                  Parents
                </p>
                <p className="mt-1 text-sm font-bold text-ink short:text-[13px]">
                  Free account · search or post a need
                </p>
              </Link>
              <Link
                href="/for-faculty"
                className={cn(
                  "rounded-xl border-2 border-ink/10 bg-white px-4 py-3 text-left transition hover:border-ink hover:bg-cream-band short:px-3 short:py-2.5",
                  hardShadowSm,
                  "hover:-translate-y-0.5",
                )}
              >
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-sage">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Teachers
                </p>
                <p className="mt-1 text-sm font-bold text-ink short:text-[13px]">
                  List free · keep 100% of fees
                </p>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-3 pt-0.5 lg:justify-start shorter:hidden">
              <div className="flex -space-x-2">
                {!ready
                  ? [0, 1, 2, 3].map((i) => (
                      <Skeleton
                        key={i}
                        className="h-8 w-8 rounded-full border-2 border-cream bg-cream-band short:h-7 short:w-7"
                      />
                    ))
                  : previewFaces.map((t) => (
                      <span
                        key={t.id}
                        title={t.name}
                        className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-cream bg-lavender text-[10px] font-bold text-ink short:h-7 short:w-7"
                      >
                        {t.initials}
                      </span>
                    ))}
              </div>
              <p className="text-left text-xs leading-snug text-muted short:text-[11px]">
                {ready && pool.length > 0 ? (
                  <>
                    <span className="font-bold text-ink">{pool.length}+</span>{" "}
                    tutors live now
                  </>
                ) : (
                  <>Tutors joining every week</>
                )}
              </p>
            </div>
          </div>

          <div className="min-w-0 w-full max-w-full overflow-hidden short-landscape:hidden">
            <HeroInteractiveMock pool={pool} ready={ready} />
            <p className="mt-3 text-center text-xs text-muted lg:text-left short:mt-2 short:text-[11px] shorter:hidden">
              Preview search or the requirements board.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
