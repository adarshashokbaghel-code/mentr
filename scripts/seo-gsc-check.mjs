#!/usr/bin/env node
/**
 * Validates SEO wiring and prints Google Search Console checklist.
 * Run: npm run seo:gsc-check
 */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const siteUrl = "https://mentr.in";

const robots = fs.readFileSync(path.join(root, "src/app/robots.ts"), "utf8");
const sitemap = fs.readFileSync(path.join(root, "src/app/sitemap.ts"), "utf8");
const layout = fs.readFileSync(path.join(root, "src/app/layout.tsx"), "utf8");

const checks = [
  {
    name: "robots.ts references sitemap.xml",
    ok: robots.includes("sitemap.xml"),
  },
  {
    name: "sitemap.ts includes money landing entries",
    ok: sitemap.includes("onlineSubjectSitemapEntries"),
  },
  {
    name: "layout.tsx supports Google verification env",
    ok: layout.includes("GOOGLE_SITE_VERIFICATION"),
  },
  {
    name: "/search removed from core sitemap (auth-gated)",
    ok: !fs
      .readFileSync(path.join(root, "src/lib/sitemap-entries.ts"), "utf8")
      .includes('entry("/search",'),
  },
  {
    name: "Money page routes exist",
    ok: fs.existsSync(path.join(root, "src/app/find-online-tutors/[[...geo]]/page.tsx")),
  },
];

let failed = 0;
for (const c of checks) {
  console.log(`${c.ok ? "✓" : "✗"} ${c.name}`);
  if (!c.ok) failed++;
}

console.log("\n--- Google Search Console (manual) ---");
console.log(`1. Set GOOGLE_SITE_VERIFICATION in .env (HTML tag value)`);
console.log(`2. Open https://search.google.com/search-console`);
console.log(`3. Add property: ${siteUrl}`);
console.log(`4. Submit sitemap: ${siteUrl}/sitemap.xml`);
console.log("5. Monitor queries weekly:");
console.log("   - find online tutors");
console.log("   - find online tutors verified");
console.log("   - find tutors online");
console.log("   - find mentors near me");
console.log("   - online tutor jobs");
console.log("\n--- Off-page (ongoing) ---");
console.log("- Product Hunt launch + education directories (UAE/India)");
console.log("- Internal links from blog posts to money pages (done in repo)");
console.log("- Request indexing for new URLs in GSC URL Inspection tool");

process.exit(failed > 0 ? 1 : 0);
