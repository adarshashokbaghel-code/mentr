"use client";

import { formatDistanceKm, type UserLocation } from "@/lib/geo";
import { type Teacher, whatsappLink } from "@/lib/teachers";
import { Navigation } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { CircleMarker, Map as LeafletMap, Marker } from "leaflet";
import "leaflet/dist/leaflet.css";

export type MapTeacher = Teacher & { distanceKm?: number };

interface SearchMapProps {
  teachers: MapTeacher[];
  selectedId?: string;
  userLocation: UserLocation | null;
  onSelect: (id: string) => void;
  onLocateClick?: () => void;
  className?: string;
}

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
  // Numbers are private: WhatsApp only for accepted connections,
  // otherwise the profile page hosts the connect-request flow.
  const contact =
    t.openSlots === 0
      ? `<span class="champs-pop-btn champs-pop-btn-muted">Fully booked</span>`
      : t.connectionStatus === "accepted" && t.phone
        ? `<a href="${whatsappLink(t)}" target="_blank" rel="noopener noreferrer" class="champs-pop-btn champs-pop-btn-primary">Chat on WhatsApp</a>`
        : t.connectionStatus === "pending"
          ? `<span class="champs-pop-btn champs-pop-btn-muted">Request sent</span>`
          : `<a href="/teachers/${escapeHtml(t.id)}" class="champs-pop-btn champs-pop-btn-primary">View &amp; connect</a>`;

  const hero = t.imageUrl
    ? `<img class="champs-pop-hero-img" src="${escapeHtml(t.imageUrl)}" alt="" />`
    : `<div class="champs-pop-hero-img" style="display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#fffaf5,#f3ead9);font:700 36px 'Plus Jakarta Sans',system-ui,sans-serif;color:rgba(26,35,28,0.3)">${escapeHtml(t.initials)}</div>`;
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

/** Full-bleed map with Google-style marker popups */
export function SearchMap({
  teachers,
  selectedId,
  userLocation,
  onSelect,
  onLocateClick,
  className,
}: SearchMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersByIdRef = useRef<Map<string, Marker>>(new Map());
  const userMarkerRef = useRef<CircleMarker | null>(null);
  const onSelectRef = useRef(onSelect);
  const userLocationRef = useRef(userLocation);
  const teachersRef = useRef(teachers);
  const [mapReady, setMapReady] = useState(false);

  onSelectRef.current = onSelect;
  userLocationRef.current = userLocation;
  teachersRef.current = teachers;

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current || mapRef.current) return;

      const start = userLocationRef.current || { lat: 12.9716, lng: 77.5946 };
      const zoom = userLocationRef.current ? 13 : 11;

      const map = L.map(containerRef.current, {
        scrollWheelZoom: true,
        zoomControl: false,
      }).setView([start.lat, start.lng], zoom);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);

      mapRef.current = map;
      requestAnimationFrame(() => {
        map.invalidateSize();
        if (!cancelled) setMapReady(true);
      });
    }

    void init();

    return () => {
      cancelled = true;
      markersByIdRef.current.forEach((m) => m.remove());
      markersByIdRef.current.clear();
      userMarkerRef.current?.remove();
      userMarkerRef.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
      setMapReady(false);
    };
  }, []);

  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    const id = window.setTimeout(() => mapRef.current?.invalidateSize(), 80);
    return () => window.clearTimeout(id);
  }, [mapReady, teachers.length, userLocation]);

  useEffect(() => {
    if (!mapReady || !mapRef.current || !userLocation) return;

    let cancelled = false;

    async function syncUser() {
      const L = (await import("leaflet")).default;
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

    let cancelled = false;

    async function syncMarkers() {
      const L = (await import("leaflet")).default;
      const map = mapRef.current;
      if (cancelled || !map) return;

      markersByIdRef.current.forEach((m) => m.remove());
      markersByIdRef.current.clear();

      const bounds: [number, number][] = [];
      const currentSelected = selectedId;

      teachers.forEach((t) => {
        // Live profiles may not have coordinates yet — list only, no pin
        if (!Number.isFinite(t.lat) || !Number.isFinite(t.lng)) return;
        const active = t.id === currentSelected;
        const available = t.openSlots > 0;
        const size = active ? 36 : 30;
        const icon = L.divIcon({
          className: "champs-map-pin",
          html: `<div style="
            width:${size}px;height:${size}px;border-radius:9999px;
            display:flex;align-items:center;justify-content:center;
            font:600 10px 'Plus Jakarta Sans',system-ui,sans-serif;color:#fff;
            background:${active ? "#1A231C" : available ? "#FF9A4D" : "#6B756E"};
            border:2px solid #fff;
            box-shadow:0 2px 10px rgba(28,26,23,0.28);
          ">${escapeHtml(t.initials)}</div>`,
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
          popupAnchor: [0, -size / 2 - 4],
        });

        const marker = L.marker([t.lat, t.lng], { icon }).addTo(map);

        marker.bindTooltip(escapeHtml(t.name), {
          direction: "top",
          offset: [0, -size / 2 - 2],
          opacity: 1,
          className: "champs-hover-tip",
        });

        marker.bindPopup(popupHtml(t), {
          maxWidth: 340,
          minWidth: 300,
          className: "champs-map-popup",
          closeButton: true,
          autoPan: true,
          offset: [0, -6],
        });

        marker.on("mouseover", () => {
          marker.openTooltip();
        });

        marker.on("click", (e) => {
          L.DomEvent.stopPropagation(e);
          onSelectRef.current(t.id);
          marker.openPopup();
        });

        markersByIdRef.current.set(t.id, marker);
        bounds.push([t.lat, t.lng]);
      });

      if (userLocation) {
        bounds.push([userLocation.lat, userLocation.lng]);
      }

      if (bounds.length >= 2) {
        map.fitBounds(bounds, { padding: [56, 56], maxZoom: 14 });
      } else if (bounds.length === 1) {
        map.setView(bounds[0], 14);
      }

      if (currentSelected) {
        markersByIdRef.current.get(currentSelected)?.openPopup();
      }
    }

    void syncMarkers();
    return () => {
      cancelled = true;
    };
    // Only rebuild pins when teacher set / location changes — selection opens popup separately
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teachers, mapReady, userLocation]);

  // Selection: restyle isn't needed every time if we just open popup + pan
  useEffect(() => {
    if (!mapReady || !selectedId) return;
    const m = markersByIdRef.current.get(selectedId);
    if (m) {
      m.openPopup();
      mapRef.current?.panTo(m.getLatLng(), { animate: true });
    }
  }, [selectedId, mapReady]);

  return (
    <div className={`relative h-full w-full bg-cream-band ${className || ""}`}>
      <div
        ref={containerRef}
        className="h-full w-full"
        aria-label="Map of teachers"
      />

      {onLocateClick && (
        <button
          type="button"
          onClick={onLocateClick}
          className="absolute bottom-6 right-3 z-[500] flex h-10 w-10 items-center justify-center rounded-md border border-hairline bg-white text-ink shadow-sm transition hover:bg-cream"
          aria-label="Use my location"
          title="My location"
        >
          <Navigation className="h-4 w-4 text-coral" />
        </button>
      )}
    </div>
  );
}
