"use client";

import { ADSENSE_CLIENT_ID } from "@/components/seo/google-verification";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

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
 * Loads the AdSense script on public marketing/content pages only.
 * Meta tag stays site-wide in layout for ownership verification.
 */
export function AdSenseLoader() {
  const pathname = usePathname();

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (isPrivatePath(pathname)) return;
    if (document.querySelector("script[data-mentr-adsense]")) return;

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`;
    script.crossOrigin = "anonymous";
    script.dataset.mentrAdsense = "1";
    document.head.appendChild(script);
  }, [pathname]);

  return null;
}
