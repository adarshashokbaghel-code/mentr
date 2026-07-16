import type { Teacher } from "@/lib/teachers";

export type UserLocation = {
  lat: number;
  lng: number;
};

export type TeacherWithDistance = Teacher & { distanceKm: number };

/** Default search radius when matching by lat/lng (km) */
export const DEFAULT_RADIUS_KM = 25;

export const RADIUS_OPTIONS_KM = [5, 10, 25, 50, 100] as const;

export function haversineKm(
  a: UserLocation,
  b: { lat: number; lng: number },
): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function formatDistanceKm(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}

/** Attach real haversine distance from user → teacher lat/lng */
export function withDistanceFromUser(
  teachers: Teacher[],
  user: UserLocation,
): TeacherWithDistance[] {
  return teachers.map((t) => ({
    ...t,
    distanceKm: haversineKm(user, { lat: t.lat, lng: t.lng }),
  }));
}

/** Keep teachers within radiusKm of the user (real lat/lng) */
export function filterByRadius(
  teachers: TeacherWithDistance[],
  radiusKm: number,
): TeacherWithDistance[] {
  return teachers.filter((t) => t.distanceKm <= radiusKm);
}

export function sortByDistance(
  list: TeacherWithDistance[],
): TeacherWithDistance[] {
  return [...list].sort((a, b) => a.distanceKm - b.distanceKm);
}

/**
 * Match teachers to a user location by lat/lng:
 * 1) compute distance  2) filter by radius  3) sort nearest-first
 */
export function matchTeachersByLatLng(
  teachers: Teacher[],
  user: UserLocation,
  radiusKm: number = DEFAULT_RADIUS_KM,
): TeacherWithDistance[] {
  return sortByDistance(
    filterByRadius(withDistanceFromUser(teachers, user), radiusKm),
  );
}

export type GeoPermissionResult =
  | { ok: true; location: UserLocation }
  | { ok: false; reason: "unsupported" | "denied" | "unavailable" | "timeout" };

export function requestUserLocation(): Promise<GeoPermissionResult> {
  if (typeof window === "undefined" || !("geolocation" in navigator)) {
    return Promise.resolve({ ok: false, reason: "unsupported" });
  }

  return new Promise((resolve) => {
    try {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            ok: true,
            location: {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            },
          });
        },
        (err) => {
          if (err.code === 1) {
            resolve({ ok: false, reason: "denied" });
          } else if (err.code === 3) {
            resolve({ ok: false, reason: "timeout" });
          } else {
            resolve({ ok: false, reason: "unavailable" });
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        },
      );
    } catch {
      resolve({ ok: false, reason: "unsupported" });
    }
  });
}
