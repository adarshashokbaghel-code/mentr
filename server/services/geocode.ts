/** Forward geocode (address → lat/lng) and IP geolocation for map pins. */

type Coords = { lat: number; lng: number };

/** City-centre fallbacks when Nominatim is slow or misses a spelling. */
const CITY_COORDS: Record<string, Coords> = {
  vadodara: { lat: 22.3072, lng: 73.1812 },
  baroda: { lat: 22.3072, lng: 73.1812 },
  waghodia: { lat: 22.2958, lng: 73.1317 },
  surat: { lat: 21.1702, lng: 72.8311 },
  ahmedabad: { lat: 23.0225, lng: 72.5714 },
  mumbai: { lat: 19.076, lng: 72.8777 },
  bengaluru: { lat: 12.9716, lng: 77.5946 },
  bangalore: { lat: 12.9716, lng: 77.5946 },
  chennai: { lat: 13.0827, lng: 80.2707 },
  hyderabad: { lat: 17.385, lng: 78.4867 },
  kolkata: { lat: 22.5726, lng: 88.3639 },
  delhi: { lat: 28.6139, lng: 77.209 },
  "new delhi": { lat: 28.6139, lng: 77.209 },
  pune: { lat: 18.5204, lng: 73.8567 },
  jaipur: { lat: 26.9124, lng: 75.7873 },
  dubai: { lat: 25.2048, lng: 55.2708 },
  singapore: { lat: 1.3521, lng: 103.8198 },
  london: { lat: 51.5074, lng: -0.1278 },
};

const STATE_FOR_CITY: Record<string, string> = {
  vadodara: "Gujarat",
  baroda: "Gujarat",
  surat: "Gujarat",
  ahmedabad: "Gujarat",
  bengaluru: "Karnataka",
  bangalore: "Karnataka",
  mumbai: "Maharashtra",
  pune: "Maharashtra",
  chennai: "Tamil Nadu",
  hyderabad: "Telangana",
  kolkata: "West Bengal",
  delhi: "Delhi",
  jaipur: "Rajasthan",
};

function normalizeKey(text: string): string {
  return text.trim().toLowerCase().replace(/\s+/g, " ");
}

function cityFallback(city: string, area?: string): Coords | null {
  const cityKey = normalizeKey(city);
  if (CITY_COORDS[cityKey]) return CITY_COORDS[cityKey];

  const areaKey = normalizeKey(area || "");
  for (const [name, coords] of Object.entries(CITY_COORDS)) {
    if (areaKey.includes(name)) return coords;
  }
  return null;
}

const CACHE = new Map<string, { coords: Coords; ts: number }>();
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const NOMINATIM_UA = "Mentr/1.0 (https://mentr.in; tutor marketplace)";

let lastNominatimAt = 0;

async function throttleNominatim(): Promise<void> {
  const wait = Math.max(0, 1100 - (Date.now() - lastNominatimAt));
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastNominatimAt = Date.now();
}

function cacheGet(key: string): Coords | null {
  const hit = CACHE.get(key.toLowerCase());
  if (!hit) return null;
  if (Date.now() - hit.ts > CACHE_TTL_MS) {
    CACHE.delete(key.toLowerCase());
    return null;
  }
  return hit.coords;
}

function cacheSet(key: string, coords: Coords): void {
  CACHE.set(key.toLowerCase(), { coords, ts: Date.now() });
}

async function nominatimSearch(query: string): Promise<Coords | null> {
  const cached = cacheGet(query);
  if (cached) return cached;

  await throttleNominatim();

  try {
    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("q", query);
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", "1");
    url.searchParams.set("addressdetails", "0");

    const res = await fetch(url.toString(), {
      headers: { "User-Agent": NOMINATIM_UA },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;

    const data = (await res.json()) as { lat: string; lon: string }[];
    const hit = data[0];
    if (!hit) return null;

    const lat = Number(hit.lat);
    const lng = Number(hit.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

    const coords = { lat, lng };
    cacheSet(query, coords);
    return coords;
  } catch {
    return null;
  }
}

function buildGeocodeQueries(parts: {
  area?: string;
  city?: string;
  country?: string;
}): string[] {
  const area = String(parts.area || "").trim();
  const city = String(parts.city || "").trim();
  const country = String(parts.country || "India").trim();
  const state = STATE_FOR_CITY[normalizeKey(city)] || "";

  const queries = new Set<string>();
  if (area && city) {
    queries.add([area, city, state, country].filter(Boolean).join(", "));
    queries.add([area, city, country].filter(Boolean).join(", "));
  }
  if (city) {
    queries.add([city, state, country].filter(Boolean).join(", "));
    queries.add([city, country].filter(Boolean).join(", "));
  }
  return [...queries].filter(Boolean);
}

/** Geocode area + city + country; tries full address then city-only. */
export async function geocodeAddress(parts: {
  area?: string;
  city?: string;
  country?: string;
}): Promise<Coords | null> {
  const area = String(parts.area || "").trim();
  const city = String(parts.city || "").trim();

  for (const q of buildGeocodeQueries(parts)) {
    const coords = await nominatimSearch(q);
    if (coords) return coords;
  }

  const fallback = cityFallback(city, area);
  if (fallback) {
    cacheSet([area, city, parts.country].filter(Boolean).join(", "), fallback);
    return fallback;
  }
  return null;
}

/** Resolve approximate coords from client IP (login fallback). */
export async function geocodeIp(ip: string): Promise<Coords | null> {
  const clean = ip.trim();
  if (
    !clean ||
    clean === "127.0.0.1" ||
    clean === "::1" ||
    clean.startsWith("192.168.") ||
    clean.startsWith("10.")
  ) {
    return null;
  }

  const cacheKey = `ip:${clean}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(
      `http://ip-api.com/json/${encodeURIComponent(clean)}?fields=status,lat,lon`,
      { signal: AbortSignal.timeout(5000) },
    );
    if (!res.ok) return null;

    const data = (await res.json()) as {
      status: string;
      lat?: number;
      lon?: number;
    };
    if (data.status !== "success") return null;
    if (!Number.isFinite(data.lat) || !Number.isFinite(data.lon)) return null;

    const coords = { lat: data.lat!, lng: data.lon! };
    cacheSet(cacheKey, coords);
    return coords;
  } catch {
    return null;
  }
}

/** Best-effort client IP from Express request (trust proxy enabled). */
export function clientIpFromRequest(req: {
  headers: Record<string, string | string[] | undefined>;
  socket?: { remoteAddress?: string | null };
}): string {
  const xff = req.headers["x-forwarded-for"];
  if (typeof xff === "string" && xff.trim()) {
    return xff.split(",")[0]!.trim();
  }
  if (Array.isArray(xff) && xff[0]) return String(xff[0]).trim();
  return req.socket?.remoteAddress?.trim() || "";
}
