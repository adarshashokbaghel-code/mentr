import type { NextConfig } from "next";
import path from "path";
import dotenv from "dotenv";

dotenv.config({
  path: path.resolve(/* turbopackIgnore: true */ process.cwd(), ".env"),
});

const backendPort = process.env.BACKEND_PORT || "5000";

const nextConfig: NextConfig = {
  serverExternalPackages: ["mongoose", "sharp", "onnxruntime-node", "tesseract.js"],
  // Keep Snap & Grade / NCERT filesystem reads out of the /api serverless NFT.
  // Without this, path.join(process.cwd(), ...) can trace ~1GB into pages/api.
  outputFileTracingExcludes: {
    "/api/**": [
      "./public/ncert/**",
      "./public/models/**",
      "./public/ort/**",
      "./public/learn/**",
      "./videos/**",
      "./.cache/**",
      "./docs/**",
      "./scripts/**",
      "./eng.traineddata",
    ],
    "/api/[[...all]]": [
      "./public/ncert/**",
      "./public/models/**",
      "./public/ort/**",
      "./public/learn/**",
      "./videos/**",
      "./.cache/**",
      "./docs/**",
      "./scripts/**",
      "./eng.traineddata",
    ],
    "/api/teachers/public/**": [
      "./public/ncert/**",
      "./public/models/**",
      "./public/ort/**",
      "./videos/**",
      "./.cache/**",
    ],
  },
  transpilePackages: ["blockly"],
  turbopack: {
    // Parent ~/package-lock.json was being picked as the workspace root,
    // breaking PostCSS/Tailwind resolution and hanging page loads.
    root: path.resolve(/* turbopackIgnore: true */ process.cwd()),
  },
  // Transformers.js / ORT Web — ignore Node-only bindings in the browser bundle.
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      sharp$: false,
      "onnxruntime-node$": false,
    };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
      },
      {
        protocol: "https",
        hostname: "mxozthpttmuyusnrmhog.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
  async headers() {
    // AdSense crawler expects a plain static ads.txt at the site root.
    return [
      {
        source: "/ads.txt",
        headers: [
          { key: "Content-Type", value: "text/plain; charset=utf-8" },
          { key: "Cache-Control", value: "public, max-age=86400" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
      {
        source: "/models/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
      {
        source: "/ort/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
    ];
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
