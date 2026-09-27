/**
 * Where third-party ads / AdSense script may load.
 *
 * AdSense program policies: do not place AdSense on content primarily
 * directed at children under 13. Mentr Learn (/learn) is Class 3–5 /
 * ages ~8–11 — ads and AdsBot must stay off those routes.
 */

const NO_ADS_PREFIXES = [
  "/dashboard",
  "/profiling",
  "/parent/",
  "/faculty",
  "/board",
  "/login",
  "/admin",
  "/admintestingistrueonlyman134hsydsudy4",
  "/tmp-wa-preview",
  "/api/",
  "/learn",
] as const;

const NO_ANALYTICS_PREFIXES = [
  "/learn",
  "/admin",
  "/admintestingistrueonlyman134hsydsudy4",
  "/tmp-wa-preview",
  "/api/",
] as const;

/**
 * GA4 runs on account + checkout pages too (signup → payment funnel),
 * but never on child-directed /learn or admin surfaces.
 */
export function isAnalyticsBlockedPath(
  pathname: string | null | undefined,
): boolean {
  if (!pathname) return true;
  return NO_ANALYTICS_PREFIXES.some((prefix) => {
    if (prefix.endsWith("/")) {
      return pathname === prefix.slice(0, -1) || pathname.startsWith(prefix);
    }
    return pathname === prefix || pathname.startsWith(`${prefix}/`);
  });
}

/** True when AdSense / advertising tags must not run. */
export function isAdSenseBlockedPath(pathname: string | null | undefined): boolean {
  if (!pathname) return true;
  if (pathname === "/parent") return true;
  return NO_ADS_PREFIXES.some((prefix) => {
    if (prefix.endsWith("/")) {
      return pathname === prefix.slice(0, -1) || pathname.startsWith(prefix);
    }
    return pathname === prefix || pathname.startsWith(`${prefix}/`);
  });
}
