/** Google Analytics 4 — only loaded in production when this env var is set. */
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || "";

/** Load AdSense on public pages when explicitly enabled. */
export const ADSENSE_ENABLED =
  process.env.NEXT_PUBLIC_ENABLE_ADSENSE === "true";
