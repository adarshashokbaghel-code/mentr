import type { NextConfig } from "next";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const backendPort = process.env.BACKEND_PORT || "5000";

const nextConfig: NextConfig = {
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
    // All /api traffic goes to the Express backend — there are no
    // Next.js API routes in this app.
    return [
      {
        source: "/api/:path*",
        destination: `http://localhost:${backendPort}/api/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "mentr.in" }],
        destination: "https://www.mentr.in/:path*",
        permanent: true,
      },
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
