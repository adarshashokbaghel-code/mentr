import { absoluteUrl } from "@/lib/seo";
import type { MetadataRoute } from "next";

/** App routes that must not be indexed (auth, dashboards, gated flows). */
const PRIVATE_PATHS = [
  "/api/",
  "/dashboard",
  "/profiling",
  "/parent/dashboard",
  "/parent/profiling",
  "/board",
  "/faculty",
  "/parent",
  "/login",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: PRIVATE_PATHS,
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
