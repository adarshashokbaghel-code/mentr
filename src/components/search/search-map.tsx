"use client";

import { formatDistanceKm, type UserLocation } from "@/lib/geo";
import { resolveTeacherCoords, type Teacher, whatsappLink } from "@/lib/teachers";
import { profilePlaceholderMapHtml } from "@/components/ui/profile-placeholder";
import { Navigation } from "lucide-react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import type { CircleMarker, DivIcon, LeafletMouseEvent, Map as LeafletMap, Marker } from "leaflet";
import "leaflet/dist/leaflet.css";

export type MapTeacher = Teacher & { distanceKm?: number };

export type MapFocusTarget = {
  id: string;
  lat: number;
  lng: number;
  seq: number;
};

interface SearchMapProps {
  teachers: MapTeacher[];
  selectedId?: string;
  userLocation: UserLocation | null;
  onSelect: (id: string) => void;
  onLocateClick?: () => void;
  /** Explicit fly-to request from list panel (carries coords + seq) */
  focusTarget?: MapFocusTarget | null;
  /** Sidebar open state — triggers map resize when layout changes */
  sidebarOpen?: boolean;
  /** Skip Leaflet popup — parent renders a mobile bottom sheet instead */
  mobileSheet?: boolean;
  className?: string;
}

export type SearchMapHandle = {
  focusTeacher: (
    lat: number,
    lng: number,
    id?: string,
    opts?: { delay?: number },
  ) => boolean;
};

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function popupHtml(t: MapTeacher) {
  const dist =
    t.distanceKm != null ? formatDistanceKm(t.distanceKm) : t.locality;
  const next = t.slots.find((s) => s.available)?.label;
  const subjects = t.subjects
    .slice(0, 4)
    .map((s) => `<span class="champs-pop-chip">${escapeHtml(s)}</span>`)
    .join("");
  const contact =
    t.openSlots === 0
      ? `<span class="champs-pop-btn champs-pop-btn-muted">Fully booked</span>`
      : t.connectionStatus === "accepted" && t.phone
        ? `<a href="${whatsappLink(t)}" target="_blank" rel="noopener noreferrer" class="champs-pop-btn champs-pop-btn-primary">Chat on WhatsApp</a>`
        : t.connectionStatus === "pending"
          ? `<span class="champs-pop-btn champs-pop-btn-muted">Request sent</span>`
          : `<a href="/teachers/${escapeHtml(t.id)}" class="champs-pop-btn champs-pop-btn-primary">View &amp; connect</a>`;

  const hero = profilePlaceholderMapHtml(t);
  const ratingPill =
    t.reviewCount > 0
      ? `<span class="champs-pop-pill champs-pop-pill-rate">★ ${t.rating.toFixed(1)} · ${t.reviewCount}</span>`
      : `<span class="champs-pop-pill champs-pop-pill-rate">New on Mentr</span>`;

  return `
    <div class="champs-pop">
      <div class="champs-pop-hero">
        ${hero}
        <div class="champs-pop-hero-fade"></div>
        <div class="champs-pop-hero-badges">
          ${
            t.openSlots > 0
              ? `<span class="champs-pop-pill champs-pop-pill-sage">${t.openSlots} open</span>`
              : `<span class="champs-pop-pill champs-pop-pill-muted">Booked</span>`
          }
          ${ratingPill}
        </div>
      </div>
      <div class="champs-pop-main">
        <div class="champs-pop-title-row">
          <div class="champs-pop-title">
            <span class="champs-pop-name">${escapeHtml(t.name)}</span>
            ${t.verified ? '<span class="champs-pop-verified" title="Verified">✓</span>' : ""}
          </div>
          <span class="champs-pop-kind">${escapeHtml(t.kind)}</span>
        </div>
        <div class="champs-pop-subject">${escapeHtml(t.subjectLine)}</div>
        <div class="champs-pop-meta-row">
          <span>${escapeHtml(dist)}</span>
          <span>·</span>
          <span>${t.experienceYears} yrs</span>
          <span>·</span>
          <span>${escapeHtml(t.locality)}</span>
        </div>
        <p class="champs-pop-bio">${escapeHtml(t.bio)}</p>
        <div class="champs-pop-chips">${subjects}</div>
        <div class="champs-pop-levels">${escapeHtml(t.levels)}</div>
        ${
          next
            ? `<div class="champs-pop-next">Next slot · ${escapeHtml(next)}</div>`
            : ""
        }
        <div class="champs-pop-actions">
          ${contact}
          <a href="/teachers/${escapeHtml(t.id)}" class="champs-pop-btn champs-pop-btn-secondary">Full profile</a>
        </div>
      </div>
    </div>
  `;
}

function buildPinIcon(
  L: typeof import("leaflet"),
  t: MapTeacher,
  active: boolean,
): DivIcon {
  const available = t.openSlots > 0;
  const size = active ? 38 : 32;
  return L.divIcon({
    className: "champs-map-pin",
    html: `<div class="champs-map-pin-dot${active ? " champs-map-pin-dot-active" : ""}" style="
      width:${size}px;height:${size}px;
      background:${active ? "#1A231C" : available ? "#FF9A4D" : "#6B756E"};
    ">${escapeHtml(t.initials)}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2 - 4],
  });
}

/** Full-bleed map with Google-style marker popups */
export const SearchMap = forwardRef<SearchMapHandle, SearchMapProps>(
  function SearchMap(
    {
      teachers,
      selectedId,
      userLocation,
      onSelect,
      onLocateClick,
      focusTarget,
      sidebarOpen = true,
      mobileSheet = false,
      className,
    },
    ref,
  ) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const leafletRef = useRef<typeof import("leaflet") | null>(null);
  const markersByIdRef = useRef<Map<string, Marker>>(new Map());
  const userMarkerRef = useRef<CircleMarker | null>(null);
  const onSelectRef = useRef(onSelect);
  const userLocationRef = useRef(userLocation);
  const teachersRef = useRef(teachers);
  const selectedIdRef = useRef(selectedId);
  const mobileSheetRef = useRef(mobileSheet);
  const initialFitDoneRef = useRef(false);
  const userPickedRef = useRef(false);
  const handledFocusSeqRef = useRef(0);
  const lastImperativeFocusIdRef = useRef<string | null>(null);
  const mountedRef = useRef(false);
  const mapTimersRef = useRef<number[]>([]);
  const [mapReady, setMapReady] = useState(false);

  onSelectRef.current = onSelect;
  userLocationRef.current = userLocation;
  teachersRef.current = teachers;
  selectedIdRef.current = selectedId;
  mobileSheetRef.current = mobileSheet;

  const clearMapTimers = useCallback(() => {
    mapTimersRef.current.forEach((id) => window.clearTimeout(id));
    mapTimersRef.current = [];
  }, []);

  const scheduleMapTimer = useCallback((fn: () => void, delay: number) => {
    const id = window.setTimeout(() => {
      mapTimersRef.current = mapTimersRef.current.filter((timerId) => timerId !== id);
      fn();
    }, delay);
    mapTimersRef.current.push(id);
    return id;
  }, []);

  const cancelMapTimer = useCallback((id: number) => {
    window.clearTimeout(id);
    mapTimersRef.current = mapTimersRef.current.filter((timerId) => timerId !== id);
  }, []);

  const isMapLive = useCallback(() => {
    const map = mapRef.current;
    const container = containerRef.current;
    if (!mountedRef.current || !map || !container || !container.isConnected) {
      return false;
    }
    try {
      const pane = map.getPane("mapPane");
      if (!pane) return false;
      const rect = container.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    } catch {
      return false;
    }
  }, []);

  const safeInvalidate = useCallback(() => {
    if (!isMapLive()) return;
    const map = mapRef.current;
    if (!map) return;
    try {
      map.stop();
      map.invalidateSize({ animate: false, pan: false });
    } catch {
      // Map container may be mid-layout or unmounted.
    }
  }, [isMapLive]);

  const flyToCoords = useCallback(
    (
      lat: number,
      lng: number,
      opts?: { openPopupForId?: string; animate?: boolean },
    ) => {
      if (!isMapLive()) return false;

      const map = mapRef.current;
      if (!map || !Number.isFinite(lat) || !Number.isFinite(lng)) return false;

      try {
        map.stop();
        map.invalidateSize({ animate: false, pan: false });

        const zoom = Math.max(map.getZoom(), 15);
        map.flyTo([lat, lng], zoom, {
          animate: opts?.animate !== false,
          duration: 0.5,
        });

        if (mobileSheetRef.current) {
          scheduleMapTimer(() => {
            if (!isMapLive()) return;
            try {
              mapRef.current?.panBy([0, 110], { animate: true, duration: 0.25 });
            } catch {
              // Ignore pan while map is resizing.
            }
          }, 450);
        }

        const popupId = opts?.openPopupForId;
        if (popupId && !mobileSheetRef.current) {
          scheduleMapTimer(() => {
            if (!isMapLive()) return;
            const marker = markersByIdRef.current.get(popupId);
            if (!marker || !mapRef.current?.hasLayer(marker)) return;
            try {
              marker.openPopup();
            } catch {
              // Marker icon may not be mounted yet.
            }
          }, 520);
        }

        return true;
      } catch {
        return false;
      }
    },
    [isMapLive, scheduleMapTimer],
  );

  useImperativeHandle(
    ref,
    () => ({
      focusTeacher(lat, lng, id, opts) {
        let attempts = 0;
        const run = () => {
          if (!isMapLive()) {
            if (attempts < 8) {
              attempts += 1;
              scheduleMapTimer(run, 80);
            }
            return;
          }
          userPickedRef.current = true;
          flyToCoords(lat, lng, {
            openPopupForId: mobileSheetRef.current ? undefined : id,
          });
        };

        if (id) lastImperativeFocusIdRef.current = id;

        if (opts?.delay) {
          scheduleMapTimer(run, opts.delay);
          return true;
        }

        run();
        return true;
      },
    }),
    [flyToCoords, scheduleMapTimer, isMapLive],
  );

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const L = (await import("leaflet")).default;
      leafletRef.current = L;
      if (cancelled || !containerRef.current || mapRef.current) return;

      const start = userLocationRef.current || { lat: 20.5937, lng: 78.9629 };
      const zoom = userLocationRef.current ? 13 : 5;

      const map = L.map(containerRef.current, {
        scrollWheelZoom: true,
        zoomControl: false,
        fadeAnimation: false,
        zoomAnimation: true,
      }).setView([start.lat, start.lng], zoom);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);

      mapRef.current = map;

      requestAnimationFrame(() => {
        if (cancelled) return;
        safeInvalidate();
        requestAnimationFrame(() => {
          if (cancelled) return;
          mountedRef.current = true;
          setMapReady(true);
        });
      });
    }

    void init();

    return () => {
      cancelled = true;
      mountedRef.current = false;
      clearMapTimers();
      markersByIdRef.current.forEach((m) => m.remove());
      markersByIdRef.current.clear();
      userMarkerRef.current?.remove();
      userMarkerRef.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
      leafletRef.current = null;
      setMapReady(false);
      initialFitDoneRef.current = false;
      userPickedRef.current = false;
    };
  }, [safeInvalidate, clearMapTimers]);

  useEffect(() => {
    if (!mapReady || !mapRef.current || !userLocation) return;

    let cancelled = false;

    async function syncUser() {
      const L = leafletRef.current ?? (await import("leaflet")).default;
      const map = mapRef.current;
      if (cancelled || !map || !userLocation) return;

      userMarkerRef.current?.remove();
      userMarkerRef.current = L.circleMarker(
        [userLocation.lat, userLocation.lng],
        {
          radius: 9,
          color: "#fff",
          weight: 3,
          fillColor: "#4285F4",
          fillOpacity: 1,
        },
      )
        .addTo(map)
        .bindTooltip("You", {
          direction: "top",
          offset: [0, -10],
          className: "champs-you-tip",
        });
    }

    void syncUser();
    return () => {
      cancelled = true;
    };
  }, [userLocation, mapReady]);

  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    const delay = mobileSheetRef.current ? 320 : 60;
    const id = scheduleMapTimer(() => {
      if (!isMapLive()) return;
      try {
        mapRef.current?.stop();
        mapRef.current?.invalidateSize({ animate: false, pan: false });
      } catch {
        // Ignore resize while sidebar animates.
      }
    }, delay);
    return () => cancelMapTimer(id);
  }, [mapReady, sidebarOpen, scheduleMapTimer, isMapLive, cancelMapTimer]);

  useEffect(() => {
    if (!mapReady || !mapRef.current) return;

    let cancelled = false;

    async function syncMarkers() {
      const L = leafletRef.current ?? (await import("leaflet")).default;
      const map = mapRef.current;
      if (cancelled || !map) return;

      const currentSelected = selectedIdRef.current;
      const existing = markersByIdRef.current;
      const nextIds = new Set<string>();

      teachers.forEach((t) => {
        const coords = resolveTeacherCoords(t);
        if (!coords) return;
        nextIds.add(t.id);

        const active = t.id === currentSelected;
        const icon = buildPinIcon(L, t, active);
        const prev = existing.get(t.id);

        if (prev) {
          prev.setLatLng([coords.lat, coords.lng]);
          prev.setIcon(icon);
          prev.setZIndexOffset(active ? 1000 : 0);
        } else {
          const size = active ? 38 : 32;
          const marker = L.marker([coords.lat, coords.lng], {
            icon,
            zIndexOffset: active ? 1000 : 0,
          }).addTo(map);

          marker.bindTooltip(escapeHtml(t.name), {
            direction: "top",
            offset: [0, -size / 2 - 2],
            opacity: 1,
            className: "champs-hover-tip",
          });

          if (!mobileSheetRef.current) {
            marker.bindPopup(popupHtml(t), {
              maxWidth: 340,
              minWidth: 280,
              className: "champs-map-popup",
              closeButton: true,
              autoPan: true,
              autoPanPaddingTopLeft: [16, 80],
              autoPanPaddingBottomRight: [16, 16],
              offset: [0, -6],
            });
          }

          marker.on("mouseover", () => marker.openTooltip());

          marker.on("click", (e: LeafletMouseEvent) => {
            L.DomEvent.stopPropagation(e);
            userPickedRef.current = true;
            onSelectRef.current(t.id);
            flyToCoords(coords.lat, coords.lng, {
              openPopupForId: mobileSheetRef.current ? undefined : t.id,
            });
          });

          existing.set(t.id, marker);
        }
      });

      existing.forEach((marker, id) => {
        if (!nextIds.has(id)) {
          marker.remove();
          existing.delete(id);
        }
      });

      const bounds: [number, number][] = [];
      teachers.forEach((t) => {
        const coords = resolveTeacherCoords(t);
        if (coords) bounds.push([coords.lat, coords.lng]);
      });
      if (userLocation) {
        bounds.push([userLocation.lat, userLocation.lng]);
      }

      const shouldFitAll =
        !userPickedRef.current &&
        !currentSelected &&
        bounds.length > 0 &&
        !initialFitDoneRef.current;

      if (shouldFitAll) {
        safeInvalidate();
        if (!isMapLive()) return;
        try {
          if (bounds.length >= 2) {
            map.fitBounds(bounds, { padding: [56, 56], maxZoom: 14, animate: false });
          } else {
            map.setView(bounds[0], 14, { animate: false });
          }
          initialFitDoneRef.current = true;
        } catch {
          // Bounds fit can fail if the map pane is not ready yet.
        }
      }
    }

    void syncMarkers();
    return () => {
      cancelled = true;
    };
  }, [teachers, mapReady, userLocation, flyToCoords, safeInvalidate, isMapLive]);

  useEffect(() => {
    if (!mapReady) return;
    const L = leafletRef.current;
    if (!L) return;

    const currentSelected = selectedId;
    markersByIdRef.current.forEach((marker, id) => {
      const t = teachersRef.current.find((teacher) => teacher.id === id);
      if (!t || !mapRef.current?.hasLayer(marker)) return;
      const active = id === currentSelected;
      try {
        marker.setIcon(buildPinIcon(L, t, active));
        marker.setZIndexOffset(active ? 1000 : 0);
      } catch {
        // Marker icon may be mid-update.
      }
    });
  }, [selectedId, mapReady]);

  useEffect(() => {
    if (!mapReady || !focusTarget) return;
    if (focusTarget.seq <= handledFocusSeqRef.current) return;

    const { lat, lng, id, seq } = focusTarget;
    const delay = mobileSheetRef.current ? 280 : 0;

    const timer = scheduleMapTimer(() => {
      handledFocusSeqRef.current = seq;
      userPickedRef.current = true;
      flyToCoords(lat, lng, {
        openPopupForId: mobileSheetRef.current ? undefined : id,
      });
    }, delay);

    return () => cancelMapTimer(timer);
  }, [focusTarget, mapReady, flyToCoords, scheduleMapTimer, cancelMapTimer]);

  useEffect(() => {
    if (!mapReady || !selectedId) return;
    if (focusTarget && focusTarget.id === selectedId) return;
    if (lastImperativeFocusIdRef.current === selectedId) {
      lastImperativeFocusIdRef.current = null;
      return;
    }
    const t = teachersRef.current.find((teacher) => teacher.id === selectedId);
    const coords = t ? resolveTeacherCoords(t) : null;
    if (!coords) return;

    userPickedRef.current = true;
    flyToCoords(coords.lat, coords.lng, {
      openPopupForId: mobileSheetRef.current ? undefined : selectedId,
    });
  }, [selectedId, mapReady, focusTarget, flyToCoords]);

  return (
    <div className={`relative h-full min-h-[200px] w-full bg-cream-band ${className || ""}`}>
      <div
        ref={containerRef}
        className="absolute inset-0"
        aria-label="Map of teachers"
      />

      {onLocateClick && (
        <button
          type="button"
          onClick={onLocateClick}
          className="absolute bottom-24 right-3 z-[500] flex h-11 w-11 touch-manipulation items-center justify-center rounded-full border border-hairline bg-white text-ink shadow-md transition hover:bg-cream sm:bottom-6 sm:h-10 sm:w-10 sm:rounded-md sm:shadow-sm"
          aria-label="Use my location"
          title="My location"
        >
          <Navigation className="h-4 w-4 text-coral" />
        </button>
      )}
    </div>
  );
},
);
