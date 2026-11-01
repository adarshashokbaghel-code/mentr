/**
 * Google Analytics 4 measurement ID.
 * NEXT_PUBLIC_ values are inlined at build time. Keep a fallback so a
 * missing Vercel env var cannot silently ship a build with no tag.
 */
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || "G-ME7KM87RG4";

/** Load AdSense on public pages when explicitly enabled. */
export const ADSENSE_ENABLED =
  process.env.NEXT_PUBLIC_ENABLE_ADSENSE === "true";
