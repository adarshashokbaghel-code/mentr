"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { SearchMap, type MapFocusTarget, type MapTeacher } from "@/components/search/search-map";
import { type SearchFiltersState } from "@/components/search/search-header";
import {
  DEFAULT_RADIUS_KM,
  formatDistanceKm,
  RADIUS_OPTIONS_KM,
  type UserLocation,
} from "@/lib/geo";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Briefcase,
  CalendarDays,
  List,
  Loader2,
  MapPin,
  Navigation,
  PanelLeftClose,
  Search as SearchIcon,
  Star,
  X,
} from "lucide-react";
import { SaveTeacherButton } from "@/components/search/save-teacher-button";
import { ProfilePlaceholder } from "@/components/ui/profile-placeholder";
import Link from "next/link";
import { useEffect, useState } from "react";

const QUICK_SUBJECTS = [
  "All",
  "Mathematics",
  "Physics",
  "Chemistry",
  "English",
  "Coding",
  "Biology",
  "Exam Prep",
] as const;

interface SearchMapShellProps {
  teachers: MapTeacher[];
  selectedId?: string;
  userLocation: UserLocation | null;
  locationDenied?: boolean;
  locationLoading?: boolean;
  locationError?: string | null;
  filters: SearchFiltersState;
  onSelect: (id: string | undefined) => void;
  onChangeFilters: (patch: Partial<SearchFiltersState>) => void;
  onShareLocation: () => void;
  onBackToGrid: () => void;
  guestBrowse?: boolean;
}

function useIsMobile(breakpoint = 640) {
  const [mobile, setMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(`(max-width: ${breakpoint - 1}px)`).matches;
  });

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const sync = () => setMobile(mq.matches);
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [breakpoint]);

  return mobile;
}

function MapTeacherPreview({
  teacher,
  onClose,
  guestBrowse,
}: {
  teacher: MapTeacher;
  onClose?: () => void;
  guestBrowse?: boolean;
}) {
  const { user, openRoleChooser } = useAuth();
  const available = teacher.openSlots > 0;
  const next = teacher.slots.find((s) => s.available)?.label;

  return (
    <div className="rounded-t-2xl border border-hairline bg-white shadow-[0_-8px_32px_rgba(26,35,28,0.12)] sm:rounded-xl sm:shadow-lg">
      <div className="flex justify-center pt-2 sm:hidden">
        <span className="h-1 w-10 rounded-full bg-hairline" aria-hidden />
      </div>
      <div className="flex gap-3 p-3 pt-2 sm:p-4">
        <ProfilePlaceholder
          name={teacher.name}
          initials={teacher.initials}
          kind={teacher.kind}
          size="lg"
          rounded="md"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-1">
            <h3 className="min-w-0 flex-1 truncate text-[15px] font-semibold text-ink">
              {teacher.name}
            </h3>
            {teacher.verified && (
              <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
            )}
            {teacher.reviewCount > 0 ? (
              <span className="inline-flex shrink-0 items-center gap-0.5 rounded bg-butter/70 px-1.5 py-0.5 text-[10px] font-bold text-ink">
                <Star className="h-2.5 w-2.5 fill-coral text-coral" />
                {teacher.rating.toFixed(1)}
              </span>
            ) : (
              <span className="inline-flex shrink-0 items-center rounded bg-coral px-1.5 py-0.5 text-[10px] font-bold text-white">
                New
              </span>
            )}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="ml-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted hover:bg-cream hover:text-ink"
                aria-label="Close preview"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <p className="mt-0.5 truncate text-[13px] font-medium text-coral">
            {teacher.subjectLine}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] font-medium text-muted">
            {teacher.distanceKm != null && (
              <span className="inline-flex items-center gap-0.5 text-ink">
                <MapPin className="h-3 w-3 text-coral/80" />
                {formatDistanceKm(teacher.distanceKm)}
              </span>
            )}
            <span className="inline-flex items-center gap-0.5">
              <Briefcase className="h-3 w-3" />
              {teacher.experienceYears} yrs
            </span>
            <span className={available ? "text-sage" : ""}>
              {available ? `${teacher.openSlots} open` : "Booked"}
            </span>
          </div>
          {next && available && (
            <p className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-sage">
              <CalendarDays className="h-3 w-3" />
              {next}
            </p>
          )}
        </div>
        <SaveTeacherButton teacherId={teacher.id} size="sm" />
      </div>
      <div className="flex gap-2 border-t border-hairline px-3 pb-3 pt-2 sm:px-4 sm:pb-4">
        {!user && guestBrowse ? (
          <button
            type="button"
            onClick={() => openRoleChooser(`/teachers/${teacher.id}`)}
            className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg bg-coral text-sm font-semibold text-white transition hover:bg-coral-dark"
          >
            Sign in to connect
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        ) : (
          <Link
            href={`/teachers/${teacher.id}`}
            className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg bg-coral text-sm font-semibold text-white transition hover:bg-coral-dark"
          >
            View profile
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}

export function SearchMapShell({
  teachers,
  selectedId,
  userLocation,
  locationDenied,
  locationLoading,
  locationError,
  filters,
  onSelect,
  onChangeFilters,
  onShareLocation,
  onBackToGrid,
  guestBrowse = false,
}: SearchMapShellProps) {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window === "undefined") return true;
    return !window.matchMedia("(max-width: 639px)").matches;
  });
  const [focusTarget, setFocusTarget] = useState<MapFocusTarget | null>(null);
  const [focusSeq, setFocusSeq] = useState(0);
  const { user, openRoleChooser } = useAuth();
  const showListWithoutLocation = guestBrowse || Boolean(userLocation);

  const selectedTeacher = selectedId
    ? teachers.find((t) => t.id === selectedId)
    : undefined;

  function requestMapFocus(teacher: MapTeacher) {
    if (!Number.isFinite(teacher.lat) || !Number.isFinite(teacher.lng)) return;
    const seq = focusSeq + 1;
    setFocusSeq(seq);
    setFocusTarget({
      id: teacher.id,
      lat: teacher.lat,
      lng: teacher.lng,
      seq,
    });
  }

  function handleSelectFromList(id: string) {
    if (!user && guestBrowse) {
      openRoleChooser(`/teachers/${id}`);
      return;
    }
    const teacher = teachers.find((t) => t.id === id);
    if (!teacher) return;

    onSelect(id);

    if (isMobile) {
      setSidebarOpen(false);
    }

    requestMapFocus(teacher);
  }

  function toggleSidebar() {
    setSidebarOpen((open) => !open);
  }

  return (
    <div className="relative flex h-[100dvh] min-h-[100dvh] w-full overflow-hidden bg-cream">
      {/* Mobile backdrop when drawer is open */}
      {isMobile && sidebarOpen && (
        <div
          aria-hidden
          className="absolute inset-0 z-10 bg-ink/20 sm:hidden"
        />
      )}

      <aside
        className={cn(
          "absolute inset-y-0 left-0 z-20 flex w-[min(100vw,400px)] flex-col border-r border-hairline bg-cream shadow-xl transition-transform duration-200 ease-out",
          "sm:relative sm:max-w-[380px] sm:shadow-none",
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full sm:!hidden",
        )}
      >
        <div className="shrink-0 space-y-3 border-b border-hairline bg-white px-3 py-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBackToGrid}
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-hairline bg-cream px-2.5 text-xs font-semibold text-ink transition hover:bg-cream-band"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Grid
            </button>
            <div className="relative min-w-0 flex-1">
              <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
              <input
                type="search"
                value={filters.query}
                onChange={(e) => onChangeFilters({ query: e.target.value })}
                placeholder="Subject, name…"
                className="h-9 w-full rounded-md border border-hairline bg-cream pl-8 pr-3 text-sm outline-none transition focus:border-ink/30 focus:bg-white focus:ring-2 focus:ring-ink/5"
              />
            </div>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-md border border-hairline bg-cream text-muted hover:text-ink sm:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close list"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {QUICK_SUBJECTS.map((s) => {
              const isAll = s === "All";
              const active = isAll ? !filters.subject : filters.subject === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() =>
                    onChangeFilters({
                      subject: isAll
                        ? undefined
                        : s === filters.subject
                          ? undefined
                          : s,
                    })
                  }
                  className={cn(
                    "shrink-0 rounded-md px-3 py-2 text-xs font-semibold transition touch-manipulation min-h-9",
                    active
                      ? "bg-ink text-white"
                      : "bg-cream text-muted hover:bg-cream-band hover:text-ink",
                  )}
                >
                  {s}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              role="switch"
              aria-checked={filters.onlyOpen}
              onClick={() =>
                onChangeFilters({ onlyOpen: !filters.onlyOpen })
              }
              className="flex items-center gap-2 text-xs font-medium text-muted"
            >
              <span
                className={cn(
                  "relative h-5 w-9 rounded-full transition",
                  filters.onlyOpen ? "bg-sage" : "bg-hairline",
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition",
                    filters.onlyOpen ? "left-4" : "left-0.5",
                  )}
                />
              </span>
              Open slots
            </button>
            <button
              type="button"
              role="switch"
              aria-checked={filters.onlyVerified}
              onClick={() =>
                onChangeFilters({ onlyVerified: !filters.onlyVerified })
              }
              className="flex items-center gap-1.5 text-xs font-medium text-muted"
            >
              <BadgeCheck
                className={cn(
                  "h-3.5 w-3.5",
                  filters.onlyVerified ? "text-sage" : "text-hairline",
                )}
              />
              Verified
            </button>
          </div>

          {userLocation && (
            <div className="flex gap-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {RADIUS_OPTIONS_KM.map((km) => (
                <button
                  key={km}
                  type="button"
                  onClick={() =>
                    onChangeFilters({ radiusKm: km, sort: "distance" })
                  }
                  className={cn(
                    "shrink-0 rounded-md px-3 py-2 text-xs font-semibold transition touch-manipulation min-h-9",
                    filters.radiusKm === km
                      ? "bg-coral text-white"
                      : "bg-cream text-muted hover:text-ink",
                  )}
                >
                  {km} km
                </button>
              ))}
            </div>
          )}
        </div>

        {!userLocation ? (
          <div className="shrink-0 border-b border-hairline bg-white px-3 py-3">
            <div className="rounded-md border border-hairline bg-cream p-3">
              <p className="text-sm font-semibold text-ink">
                {guestBrowse
                  ? "Browsing all tutors"
                  : locationDenied
                    ? "Location blocked"
                    : "Use your location"}
              </p>
              <p className="mt-1 text-[12px] leading-relaxed text-muted">
                {guestBrowse
                  ? "Share location to sort by distance, or sign in to connect with a tutor."
                  : "Match faculty by latitude & longitude — nearest first."}
              </p>
              {locationError && (
                <p className="mt-2 text-[11px] font-medium text-coral-dark">
                  {locationError}
                </p>
              )}
              <button
                type="button"
                disabled={locationLoading}
                onClick={onShareLocation}
                className="mt-3 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-md bg-coral text-xs font-semibold text-white transition hover:bg-coral-dark disabled:opacity-60"
              >
                {locationLoading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Asking browser…
                  </>
                ) : (
                  <>
                    <Navigation className="h-3.5 w-3.5" />
                    {locationDenied ? "Try again" : "Share location"}
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex shrink-0 items-center justify-between gap-2 border-b border-hairline bg-white px-3 py-2">
            <p className="text-[12px] font-medium text-muted">
              <span className="font-semibold text-ink">{teachers.length}</span>{" "}
              nearby · {filters.radiusKm || DEFAULT_RADIUS_KM} km
            </p>
            <button
              type="button"
              onClick={onShareLocation}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-coral hover:underline"
            >
              <Navigation className="h-3 w-3" />
              Update
            </button>
          </div>
        )}

        <div className="min-h-0 flex-1 overflow-y-auto bg-cream/40 p-2.5">
          {!showListWithoutLocation ? (
            <p className="px-2 py-8 text-center text-sm text-muted">
              Share location to list teachers near you.
            </p>
          ) : teachers.length === 0 ? (
            <div className="rounded-md border border-hairline bg-white px-4 py-8 text-center">
              <p className="text-sm font-semibold text-ink">Nothing in range</p>
              <p className="mt-1 text-xs text-muted">Widen the radius to find more.</p>
              <button
                type="button"
                onClick={() =>
                  onChangeFilters({
                    radiusKm: Math.min((filters.radiusKm || 25) * 2, 100),
                  })
                }
                className="mt-3 text-xs font-semibold text-coral hover:underline"
              >
                Expand radius
              </button>
            </div>
          ) : (
            <ul className="space-y-2">
              {teachers.map((t) => {
                const active = t.id === selectedId;
                const available = t.openSlots > 0;
                const next = t.slots.find((s) => s.available)?.label;
                const hasCoords =
                  Number.isFinite(t.lat) && Number.isFinite(t.lng);
                return (
                  <li key={t.id}>
                    <div
                      className={cn(
                        "flex w-full gap-3 rounded-md border bg-white p-2.5 text-left transition",
                        active
                          ? "border-coral/40 bg-coral-wash/30 shadow-sm ring-1 ring-coral/20"
                          : "border-hairline hover:border-ink/20",
                        !available && "opacity-70",
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => handleSelectFromList(t.id)}
                        className="flex min-w-0 flex-1 gap-3 text-left touch-manipulation"
                      >
                        <ProfilePlaceholder
                          name={t.name}
                          initials={t.initials}
                          kind={t.kind}
                          size="lg"
                          rounded="md"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start gap-1">
                            <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-ink">
                              {t.name}
                            </span>
                            {t.verified && (
                              <BadgeCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sage" />
                            )}
                            {t.reviewCount > 0 ? (
                              <span className="inline-flex shrink-0 items-center gap-0.5 rounded bg-butter/70 px-1.5 py-0.5 text-[10px] font-bold text-ink">
                                <Star className="h-2.5 w-2.5 fill-coral text-coral" />
                                {t.rating.toFixed(1)}
                              </span>
                            ) : (
                              <span className="inline-flex shrink-0 items-center rounded bg-coral px-1.5 py-0.5 text-[10px] font-bold text-white">
                                New
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 truncate text-[12px] font-medium text-coral">
                            {t.subjectLine}
                          </p>
                          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] font-medium text-muted">
                            {t.distanceKm != null && (
                              <span className="inline-flex items-center gap-0.5 text-ink">
                                <MapPin className="h-3 w-3 text-coral/80" />
                                {formatDistanceKm(t.distanceKm)}
                              </span>
                            )}
                            <span className="inline-flex items-center gap-0.5">
                              <Briefcase className="h-3 w-3" />
                              {t.experienceYears} yrs
                            </span>
                            <span className={available ? "text-sage" : ""}>
                              {available ? `${t.openSlots} open` : "Booked"}
                            </span>
                            {active && hasCoords && (
                              <span className="text-coral">On map</span>
                            )}
                          </div>
                          <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-muted">
                            {t.bio}
                          </p>
                          {next && available && (
                            <p className="mt-1 inline-flex items-center gap-1 text-[10px] font-medium text-sage">
                              <CalendarDays className="h-3 w-3" />
                              {next}
                            </p>
                          )}
                        </div>
                      </button>
                      <SaveTeacherButton teacherId={t.id} size="sm" />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>

      <div className="relative z-0 min-h-0 min-w-0 flex-1">
        {/* Desktop sidebar toggle */}
        <button
          type="button"
          onClick={toggleSidebar}
          className="absolute left-3 top-3 z-[500] hidden h-11 w-11 touch-manipulation items-center justify-center rounded-md border border-hairline bg-white shadow-sm transition hover:bg-cream sm:flex"
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? (
            <PanelLeftClose className="h-4 w-4" />
          ) : (
            <List className="h-4 w-4" />
          )}
        </button>

        <SearchMap
          teachers={showListWithoutLocation ? teachers : []}
          selectedId={selectedId}
          userLocation={userLocation}
          focusTarget={focusTarget}
          mobileSheet={isMobile}
          onSelect={(id) => {
            if (!user && guestBrowse) {
              openRoleChooser(`/teachers/${id}`);
              return;
            }
            onSelect(id);
            const teacher = teachers.find((t) => t.id === id);
            if (teacher) requestMapFocus(teacher);
          }}
          onLocateClick={onShareLocation}
        />

        {/* Mobile: floating list button */}
        {isMobile && !sidebarOpen && (
          <button
            type="button"
            onClick={toggleSidebar}
            className="absolute left-1/2 top-3 z-[500] flex -translate-x-1/2 touch-manipulation items-center gap-2 rounded-full border border-hairline bg-white px-4 py-2.5 text-sm font-semibold text-ink shadow-md transition hover:bg-cream"
          >
            <List className="h-4 w-4" />
            Tutors
            {teachers.length > 0 && (
              <span className="rounded-full bg-coral px-2 py-0.5 text-[11px] font-bold text-white">
                {teachers.length}
              </span>
            )}
          </button>
        )}

        {/* Mobile: bottom sheet preview when a tutor is selected */}
        {isMobile && selectedTeacher && !sidebarOpen && (
          <div className="absolute inset-x-0 bottom-0 z-[500] px-0 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
            <MapTeacherPreview
              teacher={selectedTeacher}
              guestBrowse={guestBrowse}
              onClose={() => onSelect(undefined)}
            />
          </div>
        )}

        {/* Desktop: compact preview card when sidebar closed and tutor selected */}
        {!isMobile && !sidebarOpen && selectedTeacher && (
          <div className="absolute bottom-4 left-1/2 z-[500] w-[min(420px,calc(100%-2rem))] -translate-x-1/2">
            <MapTeacherPreview
              teacher={selectedTeacher}
              guestBrowse={guestBrowse}
              onClose={() => onSelect(undefined)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
