import { LEARN_PUBLIC } from "@/lib/learn-flags";
import { absoluteUrl } from "@/lib/seo";
import type { MetadataRoute } from "next";

/**
 * App routes that must not be indexed (auth, dashboards, gated flows).
 * Use `/parent/` (trailing slash) — `/parent` also matches the public `/parents` page.
 */
const PRIVATE_PATHS = [
  "/api/",
  "/dashboard",
  "/profiling",
  "/parent/",
  "/faculty",
  "/board",
  "/admin/",
  "/login",
  "/tmp-wa-preview",
  "/learn/app",
];

/**
 * Child-directed Learn product — AdsBot must not crawl for ad placement.
 * Organic Googlebot can still index Learn via the `*` rule (when public).
 */
const ADS_BOT_DISALLOW = ["/learn"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: [
          "Mediapartners-Google",
          "AdsBot-Google",
          "AdsBot-Google-Mobile",
        ],
        allow: "/",
        disallow: ADS_BOT_DISALLOW,
      },
      {
        userAgent: "*",
        allow: ["/", "/ads.txt"],
        disallow: LEARN_PUBLIC ? PRIVATE_PATHS : [...PRIVATE_PATHS, "/learn"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
