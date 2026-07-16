"use client";

import { SearchMap, type MapTeacher } from "@/components/search/search-map";
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
  BadgeCheck,
  Briefcase,
  CalendarDays,
  Loader2,
  MapPin,
  Navigation,
  PanelLeftClose,
  PanelLeftOpen,
  Search as SearchIcon,
  Star,
  X,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

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
  onSelect: (id: string) => void;
  onChangeFilters: (patch: Partial<SearchFiltersState>) => void;
  onShareLocation: () => void;
  onBackToGrid: () => void;
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
}: SearchMapShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="relative flex h-[100dvh] min-h-[100dvh] w-full overflow-hidden bg-cream">
      <aside
        className={cn(
          "absolute inset-y-0 left-0 z-20 flex w-full max-w-[400px] flex-col border-r border-hairline bg-cream transition-transform duration-200",
          "sm:relative sm:max-w-[380px]",
          sidebarOpen
            ? "translate-x-0"
            : "pointer-events-none -translate-x-full sm:!hidden",
        )}
      >
        {/* Compact chrome — landing mock style */}
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
                {locationDenied ? "Location blocked" : "Use your location"}
              </p>
              <p className="mt-1 text-[12px] leading-relaxed text-muted">
                Match faculty by latitude &amp; longitude — nearest first.
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
          {!userLocation ? (
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
                return (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelect(t.id);
                        if (window.innerWidth < 640) setSidebarOpen(false);
                      }}
                      className={cn(
                        "flex w-full gap-3 rounded-md border bg-white p-2.5 text-left transition",
                        active
                          ? "border-ink/25 shadow-sm"
                          : "border-hairline hover:border-ink/20",
                        !available && "opacity-70",
                      )}
                    >
                      <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-md bg-cream-band">
                        {t.imageUrl ? (
                          <Image
                            src={t.imageUrl}
                            alt={t.name}
                            fill
                            className="object-cover"
                            sizes="72px"
                          />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center text-lg font-bold text-ink/30">
                            {t.initials}
                          </span>
                        )}
                      </div>
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
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>

      <div className="relative min-w-0 flex-1">
        <button
          type="button"
          onClick={() => setSidebarOpen((open) => !open)}
          className="absolute left-3 top-3 z-[500] flex h-11 w-11 touch-manipulation items-center justify-center rounded-md border border-hairline bg-white shadow-sm transition hover:bg-cream"
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? (
            <PanelLeftClose className="h-4 w-4" />
          ) : (
            <PanelLeftOpen className="h-4 w-4" />
          )}
        </button>

        <SearchMap
          teachers={userLocation ? teachers : []}
          selectedId={selectedId}
          userLocation={userLocation}
          onSelect={onSelect}
          onLocateClick={onShareLocation}
        />
      </div>
    </div>
  );
}
