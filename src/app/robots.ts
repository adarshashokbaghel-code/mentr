import { absoluteUrl } from "@/lib/seo";
import type { MetadataRoute } from "next";

/** App routes that must not be indexed (auth, dashboards, gated flows, signup). */
const PRIVATE_PATHS = [
  "/api/",
  "/dashboard",
  "/profiling",
  "/parent/dashboard",
  "/parent/profiling",
  "/parent/signup",
  "/faculty/signup",
  "/board",
  "/faculty",
  "/parent",
  "/login",
  "/admin/",
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
