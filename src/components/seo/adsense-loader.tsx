"use client";

import { ADSENSE_CLIENT_ID } from "@/components/seo/google-verification";
import Script from "next/script";
import { usePathname } from "next/navigation";

/** Paths where third-party ads must not load (auth, dashboards, previews). */
const PRIVATE_PREFIXES = [
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
];

function isPrivatePath(pathname: string | null): boolean {
  if (!pathname) return true;
  if (pathname === "/parent") return true;
  return PRIVATE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix),
  );
}

/**
 * Path-aware AdSense script for public pages.
 * Root layout also ships a beforeInteractive head script for site verification.
 */
export function AdSenseLoader() {
  const pathname = usePathname();
  if (isPrivatePath(pathname)) return null;

  return (
    <Script
      id="mentr-adsense"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
