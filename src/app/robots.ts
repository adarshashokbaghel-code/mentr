import { absoluteUrl } from "@/lib/seo";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard",
          "/profiling",
          "/parent/dashboard",
          "/parent/profiling",
          "/board",
          "/faculty",
          "/login",
          "/search?*",
        ],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
