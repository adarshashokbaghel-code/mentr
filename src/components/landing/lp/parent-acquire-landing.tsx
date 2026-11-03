"use client";

/**
 * Parent-only acquisition landing — simple, no Premium.
 * Used by /parents.
 */

import { useAuth } from "@/components/auth/auth-provider";
import { FacultyAuthForm } from "@/components/auth/faculty-auth-form";
import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { CTA } from "@/components/landing/cta";
import { FAQ } from "@/components/landing/faq";
import { FeaturedMentors } from "@/components/landing/featured-mentors";
import { HomeMentorStatsBand } from "@/components/landing/home-mentor-stats-band";
import { HowItWorks } from "@/components/landing/how-it-works";
import { MentrFlow } from "@/components/landing/mentr-flow";
import { PopularSearches } from "@/components/landing/popular-searches";
import { SubjectGallery } from "@/components/landing/subject-gallery";
import { Testimonials } from "@/components/landing/testimonials";
import { ZeroFees } from "@/components/landing/zero-fees";
import { BookDemoButton } from "@/components/demo/book-demo-button";
import { SearchTeacherCard } from "@/components/search/search-teacher-card";
import { Button } from "@/components/ui/button";
import { ShortlistProvider } from "@/components/search/shortlist-context";
import { MentorPhoto } from "@/components/ui/mentor-photo";
import { PremiumMentorBadge } from "@/components/ui/mentor-status-badges";
import {
  getStoredAttribution,
  isPaidAdsLanding,
  trackMarketingEvent,
} from "@/lib/marketing-client";
import {
  getParentNeed,
  PARENT_NEED_CITIES,
  PARENT_NEED_LEVELS,
  PARENT_NEED_SUBJECTS,
  saveParentNeed,
  type ParentNeed,
} from "@/lib/parent-need";
import {
  fetchLiveTeachers,
  fetchReelTeachers,
  searchTeachers,
  type Teacher,
} from "@/lib/teachers";
import { SITE_BRAND } from "@/lib/seo";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  MapPin,
  Search,
} from "lucide-react";
import Link from "next/link";
import { Suspense, useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

export type ParentAcquireIntent = "default" | "browse" | "instant";

function PremiumTutorCard({
  teacher,
  showPhoto,
  priority,
  onPhotoSettled,
}: {
  teacher: Teacher;
  showPhoto: boolean;
  priority: boolean;
  onPhotoSettled: (id: string) => void;
}) {
  const name = teacher.name.replace(/\s+/g, " ").trim();
  const subject = teacher.subjects[0] || teacher.subjectLine;

  useEffect(() => {
    if (showPhoto && !teacher.imageUrl?.trim()) onPhotoSettled(teacher.id);
  }, [showPhoto, teacher.id, teacher.imageUrl, onPhotoSettled]);

  return (
    <article className="overflow-hidden rounded-2xl border border-hairline bg-white shadow-[0_8px_24px_rgba(26,35,28,0.06)]">
      <div className="tutor-photo relative h-36 bg-cream-band">
        <MentorPhoto
          name={name}
          initials={teacher.initials}
          kind={teacher.kind}
          imageUrl={showPhoto ? teacher.imageUrl : null}
          size="fill"
          showInitials={false}
          rounded="xl"
          className="!absolute !inset-0 !h-full !w-full !rounded-none !border-0"
          alt=""
          priority={priority}
          thumb={showPhoto}
          onSettled={showPhoto ? () => onPhotoSettled(teacher.id) : undefined}
        />
        {teacher.premium ? (
          <span className="absolute left-3 top-3">
            <PremiumMentorBadge size="sm" />
          </span>
        ) : null}
      </div>
      <div className="p-2.5">
        <p className="truncate text-sm font-bold text-ink">{name}</p>
        <p className="mt-0.5 truncate text-xs font-medium text-muted">{subject}</p>
        <div className="mt-2.5 grid grid-cols-2 gap-1.5">
          <Link
            href={`/teachers/${teacher.id}`}
            className="inline-flex h-9 w-full items-center justify-center rounded-md border border-hairline bg-cream px-2 text-xs font-semibold text-ink hover:bg-cream-band"
          >
            View profile
          </Link>
          <BookDemoButton
            teacher={{ id: teacher.id, name, subjects: teacher.subjects }}
            label="Book demo"
            className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-md bg-coral px-2 text-xs font-semibold text-white hover:bg-coral-dark"
          />
        </div>
      </div>
    </article>
  );
}

function useWideTutorReel() {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia("(min-width: 1024px)");
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(min-width: 1024px)").matches,
    () => false,
  );
}

function PremiumTutorReel() {
  const [tutors, setTutors] = useState<Teacher[]>([]);
  const [ready, setReady] = useState(false);
  const [photoSlots, setPhotoSlots] = useState(2);
  const settledRef = useRef(new Set<string>());
  const wide = useWideTutorReel();
  const tutorKey = tutors.map((teacher) => teacher.id).join("|");
  const [slotKey, setSlotKey] = useState(tutorKey);
  if (slotKey !== tutorKey) {
    setSlotKey(tutorKey);
    setPhotoSlots(2);
    settledRef.current = new Set();
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { teachers } = await fetchReelTeachers();
      if (cancelled) return;
      setTutors(teachers);
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const onPhotoSettled = useCallback(
    (id: string) => {
      const settled = settledRef.current;
      if (settled.has(id)) return;
      settled.add(id);
      setPhotoSlots((current) => {
        const windowIds = tutors.slice(0, current).map((teacher) => teacher.id);
        if (windowIds.length === 0) return current;
        if (!windowIds.every((windowId) => settled.has(windowId))) return current;
        return Math.min(tutors.length, current + 2);
      });
    },
    [tutors],
  );

  const revealed = new Set(tutors.slice(0, photoSlots).map((teacher) => teacher.id));
  const priorityIds = new Set(tutors.slice(0, 2).map((teacher) => teacher.id));

  if (!ready) {
    return (
      <div className="overflow-hidden">
        <div className="w-[min(78vw,280px)] overflow-hidden rounded-2xl border border-hairline bg-white lg:w-full">
          <div className="h-36 animate-pulse bg-cream-band" />
          <div className="space-y-2 p-2.5">
            <div className="h-4 w-24 animate-pulse rounded bg-cream-band" />
            <div className="h-3 w-16 animate-pulse rounded bg-cream-band" />
            <div className="mt-2.5 h-9 animate-pulse rounded-md bg-cream-band" />
          </div>
        </div>
      </div>
    );
  }

  const slide = tutors.length > 1 ? [...tutors, ...tutors] : tutors;
  const glideSeconds = Math.max(24, tutors.length * 4);

  if (!wide) {
    return (
      <div className="max-w-full overflow-hidden">
        <style>{`@keyframes tutor-glide{from{transform:translateX(0)}to{transform:translateX(-50%)}}.tutor-photo img{object-fit:contain !important;object-position:center center;}@media (prefers-reduced-motion:reduce){.tutor-glide-track{animation:none !important;}}`}</style>
        <div
          className={tutors.length > 1 ? "tutor-glide-track flex w-max gap-3" : "flex gap-3"}
          style={
            tutors.length > 1
              ? { animation: `tutor-glide ${glideSeconds}s linear infinite` }
              : undefined
          }
        >
          {slide.map((teacher, index) => (
            <div key={`${teacher.id}-m-${index}`} className="w-[min(78vw,280px)] max-w-[280px] shrink-0">
              <PremiumTutorCard
                teacher={teacher}
                showPhoto={revealed.has(teacher.id)}
                priority={priorityIds.has(teacher.id)}
                onPhotoSettled={onPhotoSettled}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const rows: Teacher[][] = [];
  for (let i = 0; i < tutors.length; i += 2) rows.push(tutors.slice(i, i + 2));
  const loop = rows.length > 1 ? [...rows, ...rows] : rows;

  return (
    <div className="tutor-rise h-[520px] overflow-hidden sm:h-[560px]">
      <style>{`@keyframes tutor-rise{from{transform:translateY(0)}to{transform:translateY(-50%)}}.tutor-photo img{object-fit:contain !important;object-position:center center;}`}</style>
      <div
        className={rows.length > 1 ? "tutor-rise-track flex flex-col gap-4" : "flex flex-col gap-4"}
        style={
          rows.length > 1
            ? { animation: `tutor-rise ${Math.max(28, rows.length * 5)}s linear infinite` }
            : undefined
        }
        onMouseEnter={(e) => {
          e.currentTarget.style.animationPlayState = "paused";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.animationPlayState = "running";
        }}
      >
        {loop.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-2 gap-4">
            {row.map((teacher) => (
              <PremiumTutorCard
                key={`${teacher.id}-${rowIndex}`}
                teacher={teacher}
                showPhoto={revealed.has(teacher.id)}
                priority={priorityIds.has(teacher.id)}
                onPhotoSettled={onPhotoSettled}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const field =
  "h-12 w-full min-w-0 rounded-lg border border-ink/15 bg-white px-3.5 text-sm font-medium text-ink outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/20";

function ParentNeedForm({
  onShow,
}: {
  onShow: (need: ParentNeed) => void;
}) {
  const [need, setNeed] = useState<ParentNeed>({
    subject: "Mathematics",
    level: "Class 9–10",
    city: "Bengaluru",
    mode: "home",
  });

  useEffect(() => {
    const stored = getParentNeed();
    if (stored) {
      setNeed(stored);
      return;
    }
    if (isPaidAdsLanding()) {
      setNeed({
        subject: "Mathematics",
        level: "Class 9–10",
        city: "Online / any city",
        mode: "online",
      });
    }
  }, []);

  useEffect(() => {
    saveParentNeed(need);
  }, [need]);

  function showHere() {
    const ads = getStoredAttribution();
    const fromAd = ads?.kind === "ads";
    void trackMarketingEvent({
      type: "redirect",
      slug: fromAd ? ads.slug : "parents",
      kind: fromAd ? "ads" : "page",
      path: "/parents",
      href: "/parents",
    });
    onShow(need);
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block min-w-0">
          <span className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted">
            <BookOpen className="h-3 w-3 text-coral" />
            Subject
          </span>
          <select
            className={field}
            value={need.subject}
            onChange={(e) =>
              setNeed((n) => ({ ...n, subject: e.target.value }))
            }
          >
            {PARENT_NEED_SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="block min-w-0">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-muted">
            Class
          </span>
          <select
            className={field}
            value={need.level}
            onChange={(e) => setNeed((n) => ({ ...n, level: e.target.value }))}
          >
            {PARENT_NEED_LEVELS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="block min-w-0">
          <span className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted">
            <MapPin className="h-3 w-3 text-coral" />
            Location
          </span>
          <select
            className={field}
            value={need.city}
            onChange={(e) => setNeed((n) => ({ ...n, city: e.target.value }))}
          >
            {PARENT_NEED_CITIES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <fieldset className="block min-w-0">
          <legend className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-muted">
            Preferred mode
          </legend>
          <div className="grid grid-cols-2 gap-1.5">
            {(
              [
                ["home", "At home"],
                ["online", "Online"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setNeed((n) => ({ ...n, mode: value }))}
                className={cn(
                  "h-12 min-w-0 rounded-lg border text-sm font-bold transition",
                  need.mode === value
                    ? "border-ink bg-ink text-white"
                    : "border-ink/15 bg-white text-muted hover:border-ink/30",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="mt-4">
        <Button
          type="button"
          size="lg"
          onClick={showHere}
          className="h-12 w-full gap-2 text-[15px] font-bold shadow-[3px_3px_0_0_#1a231c]"
        >
          <Search className="h-4 w-4" />
          Show tutors
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function ParentAcquireLanding({
  intent = "default",
}: {
  intent?: ParentAcquireIntent;
}) {
  const { user, loading: authLoading } = useAuth();
  const parentReady = user?.role === "parent";
  const [results, setResults] = useState<Teacher[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchFailed, setSearchFailed] = useState(false);
  const [catalog, setCatalog] = useState<Teacher[]>([]);

  const headline = parentReady
    ? "Find tutors for your child"
    : intent === "instant"
      ? "Create an account and get tutor pitches"
      : "Create an account and find tutors";

  async function showTutors(need: ParentNeed, tier: "premium" | "all" = "premium") {
    setSearching(true);
    setSearchFailed(false);
    const { teachers, failed } = await fetchLiveTeachers();
    setSearching(false);
    if (failed) {
      setSearchFailed(true);
      setResults([]);
      return;
    }
    setCatalog(teachers);
    const cityQuery = need.city !== "Online / any city" ? need.city : undefined;
    setResults(
      searchTeachers({
        teachers,
        subject: need.subject,
        query: cityQuery,
        mode: need.mode === "home" ? "inperson" : "online",
        mentorTier: tier,
        kind: "all",
      }),
    );
    window.requestAnimationFrame(() => {
      document.getElementById("tutor-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  return (
    <>
      <Navbar />
      <main className="w-full overflow-x-clip bg-cream">
        <section className="border-b border-hairline bg-cream">
          <div className="mx-auto grid max-w-[1100px] items-start gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-2 lg:items-start lg:gap-10 lg:px-8">
            <div className="min-w-0">
              <p className="text-sm font-bold tracking-tight text-ink">{SITE_BRAND}</p>
              <h1 className="mt-2 max-w-[14ch] text-[2rem] font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl">
                {headline}
              </h1>
              <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold text-ink/80">
                {[
                  "Verified tutors",
                  "₹0 for parents",
                  "No commission",
                ].map((item) => (
                  <li key={item} className="inline-flex items-center gap-1.5">
                    <BadgeCheck className="h-4 w-4 shrink-0 text-sage" />
                    {item}
                  </li>
                ))}
              </ul>
              <div id="find" className="mt-5 rounded-2xl border border-ink/10 bg-white p-4 shadow-[0_12px_40px_rgba(26,35,28,0.06)] sm:p-5">
                {authLoading ? (
                  <p className="py-8 text-center text-sm text-muted">Loading…</p>
                ) : parentReady ? (
                  <>
                    <ParentNeedForm onShow={(need) => void showTutors(need)} />
                    <p className="mt-3 text-xs leading-relaxed text-muted">
                      City not listed? Choose Online / any city. Tutors stay on this page.
                    </p>
                  </>
                ) : user ? (
                  <p className="text-sm leading-relaxed text-ink">
                    This signup is for parents. Use a parent email to see tutors here.
                  </p>
                ) : (
                  <Suspense fallback={<p className="py-8 text-center text-sm text-muted">Loading…</p>}>
                    <FacultyAuthForm variant="signup" role="parent" stay />
                  </Suspense>
                )}
              </div>
            </div>
            <div className="min-w-0">
              <p className="mb-3 text-sm font-bold text-ink">Tutors</p>
              <PremiumTutorReel />
            </div>
          </div>
        </section>

        {parentReady && (searching || results) && (
          <section id="tutor-results" className="scroll-mt-20 border-b border-hairline bg-white">
            <div className="mx-auto max-w-[1100px] px-4 py-8 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold tracking-tight text-ink">Tutors for you</h2>
              {searching ? (
                <p className="mt-4 text-sm text-muted">Finding tutors…</p>
              ) : searchFailed ? (
                <p className="mt-4 text-sm text-ink">Could not load tutors. Try Show tutors again.</p>
              ) : results && results.length === 0 ? (
                <div className="mt-4">
                  <p className="text-sm text-ink">No tutors match that yet.</p>
                  <button
                    type="button"
                    className="mt-3 text-sm font-semibold text-ink underline underline-offset-4"
                    onClick={() => {
                      const stored = getParentNeed();
                      if (stored) void showTutors(stored, "all");
                    }}
                  >
                    Include regular tutors too
                  </button>
                </div>
              ) : (
                <ShortlistProvider catalog={catalog}>
                  <div className="mt-4 flex flex-col gap-3">
                    {results?.map((teacher) => (
                      <SearchTeacherCard key={teacher.id} teacher={teacher} />
                    ))}
                  </div>
                </ShortlistProvider>
              )}
            </div>
          </section>
        )}

        <HomeMentorStatsBand />
        <HowItWorks />
        <MentrFlow />
        <FeaturedMentors />
        <SubjectGallery />
        <ZeroFees />
        <Testimonials />
        <PopularSearches />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
