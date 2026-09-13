import {
  defaultUtmFor,
  parseAcquisitionFromUrl,
  sanitizeMarketingSlug,
  withUtm,
  type MarketingKind,
} from "@/lib/marketing-utm";

const VISITOR_KEY = "mentr_vid";
const ATTR_KEY = "mentr_utm";
const ATTR_TTL_MS = 14 * 24 * 60 * 60 * 1000;

export type StoredAttribution = {
  slug: string;
  kind: MarketingKind;
  path: string;
  href?: string;
  registrationSource: string;
  capturedAt: number;
};

function randomVisitorId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `v-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  try {
    const existing = localStorage.getItem(VISITOR_KEY);
    if (existing && existing.length <= 64) return existing;
    const id = randomVisitorId();
    localStorage.setItem(VISITOR_KEY, id);
    return id;
  } catch {
    return randomVisitorId();
  }
}

export function getStoredAttribution(): StoredAttribution | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = localStorage.getItem(ATTR_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as StoredAttribution;
    if (!parsed?.slug || !parsed.capturedAt) return undefined;
    if (Date.now() - parsed.capturedAt > ATTR_TTL_MS) {
      localStorage.removeItem(ATTR_KEY);
      return undefined;
    }
    return parsed;
  } catch {
    return undefined;
  }
}

export function persistAttribution(touch: {
  slug: string;
  kind: MarketingKind;
  path: string;
  href?: string;
}): StoredAttribution | undefined {
  if (typeof window === "undefined") return undefined;
  const slug = sanitizeMarketingSlug(touch.slug);
  if (!slug) return undefined;

  const utm = defaultUtmFor(touch.kind, slug);
  const registrationSource = withUtm(
    touch.href || window.location.href,
    utm,
  );
  const stored: StoredAttribution = {
    slug,
    kind: touch.kind,
    path: touch.path,
    href: touch.href,
    registrationSource: registrationSource.startsWith("http")
      ? registrationSource
      : `${window.location.origin}${registrationSource.startsWith("/") ? "" : "/"}${registrationSource}`,
    capturedAt: Date.now(),
  };

  try {
    localStorage.setItem(ATTR_KEY, JSON.stringify(stored));
  } catch {
    /* ignore quota */
  }
  return stored;
}

/** Capture UTM already on the current URL (shared links, ads, blog CTAs). */
export function captureUrlAttribution(): StoredAttribution | undefined {
  if (typeof window === "undefined") return undefined;
  const parsed = parseAcquisitionFromUrl(window.location.href);
  if (parsed.kind === "referral" || !parsed.slug || !parsed.kind) {
    return getStoredAttribution();
  }
  if (
    parsed.kind !== "blog" &&
    parsed.kind !== "page" &&
    parsed.kind !== "social"
  ) {
    return getStoredAttribution();
  }
  return persistAttribution({
    slug: parsed.slug,
    kind: parsed.kind,
    path: window.location.pathname,
    href: window.location.href,
  });
}

/** Signup source: current UTM/ref URL, else last blog/page touch. */
export function resolveRegistrationSource(): string | undefined {
  if (typeof window === "undefined") return undefined;
  const url = new URL(window.location.href);
  const hasTrackable = [...url.searchParams.keys()].some(
    (key) => key.startsWith("utm_") || key === "ref",
  );
  if (hasTrackable) return url.toString();
  return getStoredAttribution()?.registrationSource;
}

export function resolveAcquisition(): {
  registrationSource?: string;
  acquisitionSlug?: string;
  acquisitionKind?: MarketingKind;
} {
  const registrationSource = resolveRegistrationSource();
  const parsed = parseAcquisitionFromUrl(registrationSource);
  const stored = getStoredAttribution();
  const slug = parsed.slug || stored?.slug;
  const kind =
    parsed.kind === "blog" ||
    parsed.kind === "page" ||
    parsed.kind === "social"
      ? parsed.kind
      : stored?.kind;

  return {
    registrationSource,
    acquisitionSlug: slug,
    acquisitionKind: kind,
  };
}

export async function trackMarketingEvent(payload: {
  type: "view" | "redirect";
  slug: string;
  kind: MarketingKind;
  path: string;
  href?: string;
}): Promise<void> {
  const slug = sanitizeMarketingSlug(payload.slug);
  if (!slug || typeof window === "undefined") return;
  if (window.location.pathname.startsWith("/admin")) return;

  try {
    await fetch("/api/marketing/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: payload.type,
        slug,
        kind: payload.kind,
        path: payload.path.slice(0, 200),
        href: payload.href?.slice(0, 500),
        visitorId: getVisitorId(),
      }),
      keepalive: true,
      credentials: "omit",
    });
  } catch {
    /* tracking must never block navigation */
  }
}
