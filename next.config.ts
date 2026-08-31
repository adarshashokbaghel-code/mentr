import type { NextConfig } from "next";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const backendPort = process.env.BACKEND_PORT || "5000";

const nextConfig: NextConfig = {
  serverExternalPackages: ["mongoose"],
  turbopack: {
    // Parent ~/package-lock.json was being picked as the workspace root,
    // breaking PostCSS/Tailwind resolution and hanging page loads.
    root: path.resolve(process.cwd()),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async rewrites() {
    // Local dev: proxy /api to the standalone Express process (tsx watch).
    // Production (Vercel): /api is served by pages/api/[[...all]].ts.
    if (process.env.NODE_ENV !== "development") {
      return [];
    }

    return [
      {
        source: "/api/:path*",
        destination: `http://localhost:${backendPort}/api/:path*`,
      },
    ];
  },
  async redirects() {
    // Do NOT redirect www ↔ apex here. Vercel Domains already owns that
    // (primary host). App-level redirects fighting Vercel cause ERR_TOO_MANY_REDIRECTS.
    return [
      {
        source: "/become-a-mentor-bengaluru",
        destination: "/for-faculty",
        permanent: true,
      },
      {
        source: "/parents/bengaluru",
        destination: "/parents",
        permanent: true,
      },
      // Legacy WordPress sitemaps (2021) → current Next.js sitemap index
      {
        source: "/sitemap_:segment(\\d+)_:segment2(\\d+).xml",
        destination: "/sitemap.xml",
        permanent: true,
      },
      {
        source: "/sitemapa_:segment(\\d+)_:segment2(\\d+).xml",
        destination: "/sitemap.xml",
        permanent: true,
      },
      {
        source: "/wp-sitemap.xml",
        destination: "/sitemap.xml",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
