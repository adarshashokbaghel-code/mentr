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
  "/login",
  "/admin/",
  "/tmp-wa-preview",
  "/learn/app",
];

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
