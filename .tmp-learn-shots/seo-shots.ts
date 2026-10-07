import { chromium } from "playwright";
import { writeFileSync } from "node:fs";

const B = "http://localhost:3000";
const OUT = ".tmp-learn-shots";
const EXE =
  process.env.HOME +
  "/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing";

async function main() {
  const browser = await chromium.launch({ executablePath: EXE });
  for (const [tag, viewport, mobile] of [
    ["d", { width: 1280, height: 860 }, false],
    ["m", { width: 390, height: 844 }, true],
  ] as const) {
    const ctx = await browser.newContext({ viewport, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: mobile ? 2 : 1 });
    await ctx.addInitScript(() => localStorage.setItem("mentr-cookie-consent", "dismissed"));
    const page = await ctx.newPage();
    await page.goto(`${B}/openpythoncompiler`, { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    console.log(tag, "isolated:", await page.evaluate(() => crossOriginIsolated), "overflow:", await page.evaluate(() => document.documentElement.scrollWidth - innerWidth));
    await page.screenshot({ path: `${OUT}/seo-${tag}-compiler.png` });
    await page.locator('a[href="#about"]').first().click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${OUT}/seo-${tag}-about.png` });
    for (const id of ["features", "faq"]) {
      await page.evaluate((i) => document.getElementById(i)?.scrollIntoView(), id);
      await page.waitForTimeout(200);
      await page.screenshot({ path: `${OUT}/seo-${tag}-${id}.png` });
    }
    await page.goto(`${B}/blog/is-python-compiled-or-interpreted`, { waitUntil: "networkidle" });
    await page.locator("pre").first().scrollIntoViewIfNeeded();
    await page.screenshot({ path: `${OUT}/seo-${tag}-blog.png` });
    await ctx.close();
  }
  await browser.close();
  for (const p of ["openpythoncompiler", "openpythoncompiler/how-it-works"]) {
    const r = await fetch(`${B}/${p}/opengraph-image`);
    writeFileSync(`${OUT}/og-${p.replace("/", "-")}.png`, Buffer.from(await r.arrayBuffer()));
  }
}
main();
