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
  "/learnpython/lms",
];

/**
 * Child-directed Learn product — AdsBot must not crawl for ad placement.
 * Organic Googlebot can still index Learn via the `*` rule (when public).
 */
const ADS_BOT_DISALLOW = ["/learn"];

/** Answer engines and AI crawlers may read public pages. Private app routes stay closed. */
const ANSWER_ENGINE_BOTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Amazonbot",
  "DuckAssistBot",
  "YouBot",
];

export default function robots(): MetadataRoute.Robots {
  const privatePaths = LEARN_PUBLIC
    ? PRIVATE_PATHS
    : [...PRIVATE_PATHS, "/learn"];

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
        userAgent: ANSWER_ENGINE_BOTS,
        allow: [
          "/",
          "/learn",
          "/learn/llms.txt",
          "/llms.txt",
          "/blog",
          "/ads.txt",
        ],
        disallow: privatePaths,
      },
      {
        userAgent: "*",
        allow: ["/", "/ads.txt", "/llms.txt", "/learn/llms.txt"],
        disallow: privatePaths,
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
