"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { SearchFacultyBlocked } from "@/components/auth/role-blocked-page";
import {
  SearchHeader,
  type SearchFiltersState,
} from "@/components/search/search-header";
import { SearchTeacherCard } from "@/components/search/search-teacher-card";
import { Button } from "@/components/ui/button";
import {
  DEFAULT_RADIUS_KM,
  requestUserLocation,
  type UserLocation,
} from "@/lib/geo";
import {
  fetchLiveTeachers,
  searchTeachers,
  type Teacher,
} from "@/lib/teachers";
import { ArrowRight, GraduationCap, Lock, Users } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

const SearchMapShellDynamic = dynamic(
  () =>
    import("@/components/search/search-map-shell").then(
      (m) => m.SearchMapShell,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen items-center justify-center bg-cream text-sm text-muted">
        Loading map…
      </div>
    ),
  },
);

const DEFAULT_FILTERS: SearchFiltersState = {
  query: "",
  subject: undefined,
  locality: undefined,
  onlyOpen: true,
  onlyVerified: false,
  kind: "all",
  mode: "all",
  language: undefined,
  minExp: 0,
  sort: "relevance",
  view: "list",
  radiusKm: DEFAULT_RADIUS_KM,
};

/** Full-page "who are you?" gate — search is for signed-in users only. */
function SearchAuthGate() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-cream px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border-2 border-ink bg-white p-6 shadow-[4px_4px_0_0_#1c1a17] sm:p-7">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-butter">
              <Lock className="h-5 w-5 text-ink" />
            </span>
            <h1 className="mt-4 text-[22px] font-bold tracking-tight text-ink">
              Sign in to find teachers
            </h1>
            <p className="mt-1.5 text-sm text-muted">
              Browsing tutors and contacting them is free — we just need to
              know who you are first.
            </p>

            <div className="mt-5 space-y-3">
              <Link
                href={`/parent?next=${encodeURIComponent("/search")}`}
                className="group flex items-center gap-4 rounded-xl border-2 border-ink bg-butter/60 p-4 transition hover:bg-butter"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-coral text-white">
                  <Users className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-bold text-ink">
                    I&apos;m a parent or student
                  </span>
                  <span className="block text-xs text-muted">
                    Find tutors near you & contact on WhatsApp
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-ink transition group-hover:translate-x-0.5" />
              </Link>

              <Link
                href="/faculty"
                className="group flex items-center gap-4 rounded-xl border-2 border-ink bg-white p-4 transition hover:bg-cream"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-ink text-white">
                  <GraduationCap className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-bold text-ink">
                    I&apos;m a tutor
                  </span>
                  <span className="block text-xs text-muted">
                    List free, keep 100% of what you earn
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-ink transition group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-muted">
            ₹0 platform fee · no middlemen · contact always free
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

function SearchContent() {
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const initialSubject = searchParams?.get("subject") || undefined;
  const initialArea = searchParams?.get("area") || undefined;
  const initialView =
    searchParams?.get("view") === "map" ? "map" : "list";

  const [filters, setFilters] = useState<SearchFiltersState>({
    ...DEFAULT_FILTERS,
    subject: initialSubject,
    locality: initialArea || undefined,
    view: initialView,
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | undefined>();

  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationDenied, setLocationDenied] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Live faculty from the database (auth-protected API)
  const [liveTeachers, setLiveTeachers] = useState<Teacher[]>([]);
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    fetchLiveTeachers().then((teachers) => {
      if (!cancelled) setLiveTeachers(teachers);
    });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const results = useMemo(
    () =>
      searchTeachers({
        teachers: liveTeachers,
        subject: filters.subject,
        locality: filters.locality,
        onlyOpen: filters.onlyOpen,
        onlyVerified: filters.onlyVerified,
        kind: filters.kind,
        mode: filters.mode,
        language: filters.language,
        minExp: filters.minExp,
        query: filters.query,
        sort: userLocation
          ? filters.sort === "relevance"
            ? "distance"
            : filters.sort
          : filters.sort,
        nearLat: userLocation?.lat,
        nearLng: userLocation?.lng,
        radiusKm: userLocation ? filters.radiusKm : undefined,
      }),
    [filters, userLocation, liveTeachers],
  );

  const mapSelectedId =
    selectedId && results.some((t) => t.id === selectedId)
      ? selectedId
      : results[0]?.id;

  function patchFilters(patch: Partial<SearchFiltersState>) {
    setFilters((prev) => ({ ...prev, ...patch }));
  }

  function clearFilters() {
    setFilters({
      ...DEFAULT_FILTERS,
      view: filters.view,
      radiusKm: filters.radiusKm,
    });
  }

  const shareLocation = useCallback(async () => {
    setLocationLoading(true);
    setLocationError(null);

    const result = await requestUserLocation();
    setLocationLoading(false);

    if (result.ok) {
      setUserLocation(result.location);
      setLocationDenied(false);
      setLocationError(null);
      setFilters((prev) => ({
        ...prev,
        sort: "distance",
        locality: undefined,
        radiusKm: prev.radiusKm || DEFAULT_RADIUS_KM,
      }));
      return;
    }

    setLocationDenied(result.reason === "denied");
    if (result.reason === "denied") {
      setLocationError(
        "Permission blocked. Use the lock icon in your address bar → Location → Allow.",
      );
    } else if (result.reason === "unsupported") {
      setLocationError("Location isn’t supported in this browser.");
    } else if (result.reason === "timeout") {
      setLocationError("Timed out — try again near a window.");
    } else {
      setLocationError("Couldn’t read location. Try again.");
    }
  }, []);

  // —— Auth gate: search is for signed-in parents only ——
  if (authLoading) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-[60vh] items-center justify-center text-sm text-muted">
          Loading…
        </main>
      </>
    );
  }
  if (!user) {
    return <SearchAuthGate />;
  }
  if (user.role !== "parent") {
    return <SearchFacultyBlocked />;
  }

  // —— Map view: Google Maps-style shell (no stacked modals) ——
  if (filters.view === "map") {
    return (
      <SearchMapShellDynamic
        teachers={results}
        selectedId={mapSelectedId}
        userLocation={userLocation}
        locationDenied={locationDenied}
        locationLoading={locationLoading}
        locationError={locationError}
        filters={filters}
        onSelect={setSelectedId}
        onChangeFilters={patchFilters}
        onShareLocation={shareLocation}
        onBackToGrid={() => patchFilters({ view: "list" })}
      />
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-20">
        <SearchHeader
          filters={filters}
          resultCount={results.length}
          mobileFiltersOpen={mobileFiltersOpen}
          onMobileFiltersOpenChange={setMobileFiltersOpen}
          onChange={patchFilters}
          onClear={clearFilters}
          nearbyActive={!!userLocation}
          userLocation={userLocation}
        />

        <div className="mx-auto max-w-[1400px] px-4 py-4 sm:px-6 lg:px-8">
          {results.length === 0 ? (
            <div className="rounded-lg border border-hairline bg-white px-6 py-12 text-center">
              <p className="text-base font-semibold text-ink">
                No teachers match yet
              </p>
              <p className="mt-1.5 text-sm text-muted">
                Try another area or subject, or clear filters.
              </p>
              <Button
                className="mt-4 rounded-md"
                variant="secondary"
                size="sm"
                onClick={clearFilters}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3.5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {results.map((t) => (
                <SearchTeacherCard
                  key={t.id}
                  teacher={t}
                  distanceKm={t.distanceKm}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <>
          <Navbar />
          <main className="mx-auto max-w-[1400px] px-4 py-12 text-center text-sm text-muted sm:py-20">
            Loading search…
          </main>
        </>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
