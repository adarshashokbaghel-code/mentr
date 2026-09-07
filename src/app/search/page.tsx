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
  fetchPublicTeachers,
  searchTeachers,
  type Teacher,
} from "@/lib/teachers";
import { ArrowRight } from "lucide-react";
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

function GuestSearchBanner() {
  const { openRoleChooser } = useAuth();
  return (
    <div className="border-b border-hairline bg-butter/50 px-4 py-3 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink">
          <span className="font-semibold">Browsing is free.</span>{" "}
          Sign in as a parent to view full profiles and connect on WhatsApp.
        </p>
        <Button
          size="sm"
          className="shrink-0 gap-1.5"
          onClick={() => openRoleChooser("/search")}
        >
          Sign in to connect
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

function SearchContent() {
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const initialSubject = searchParams?.get("subject") || undefined;
  const initialArea = searchParams?.get("area") || undefined;
  const kindParam = searchParams?.get("kind");
  const initialKind =
    kindParam === "tutor" || kindParam === "mentor" ? kindParam : "all";
  const initialView =
    searchParams?.get("view") === "map" ? "map" : "list";

  const [filters, setFilters] = useState<SearchFiltersState>({
    ...DEFAULT_FILTERS,
    subject: initialSubject,
    locality: initialArea || undefined,
    kind: initialKind,
    view: initialView,
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | undefined>();

  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationDenied, setLocationDenied] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const [catalogTeachers, setCatalogTeachers] = useState<Teacher[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setCatalogLoading(true);
    const load = user?.role === "parent" ? fetchLiveTeachers : fetchPublicTeachers;
    load().then((teachers) => {
      if (!cancelled) {
        setCatalogTeachers(teachers);
        setCatalogLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const results = useMemo(
    () =>
      searchTeachers({
        teachers: catalogTeachers,
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
    [filters, userLocation, catalogTeachers],
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

  // —— Auth: faculty accounts cannot use parent search ——
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
  if (user && user.role !== "parent") {
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
        guestBrowse={!user}
      />
    );
  }

  return (
    <>
      <Navbar />
      {!user && <GuestSearchBanner />}
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
          {catalogLoading ? (
            <div className="py-16 text-center text-sm text-muted">
              Loading tutors…
            </div>
          ) : results.length === 0 ? (
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
