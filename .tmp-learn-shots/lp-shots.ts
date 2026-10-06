import { chromium } from "playwright";

const EXE = process.env.HOME + "/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing";
const issues: string[] = [];

(async () => {
  const b = await chromium.launch({ executablePath: EXE });
  for (const [tag, w, h, mobile] of [["d", 1440, 900, false], ["m", 390, 844, true]] as const) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: mobile ? 2 : 1 });
    await ctx.addInitScript(() => {
      try {
        localStorage.setItem("mentr_cookie_consent", "accepted");
      } catch {}
    });
    const page = await ctx.newPage();
    page.on("pageerror", (e) => issues.push(`${tag} pageerror: ${e.message}`));
    const res = await page.goto("http://localhost:3000/learnpython", { waitUntil: "networkidle" });
    if (!res?.ok()) issues.push(`${tag} status ${res?.status()}`);
    console.log(tag, "title:", await page.title());
    for (const id of ["new-way", "what-you-get", "compare"]) {
      const el = page.locator(`#${id}`);
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await el.screenshot({ path: `.tmp-learn-shots/lp-${tag}-${id}.png` });
    }
    await page.locator("section").first().screenshot({ path: `.tmp-learn-shots/lp-${tag}-hero.png` });
    const o = (await page.evaluate("document.documentElement.scrollWidth - window.innerWidth")) as number;
    if (o > 1) issues.push(`${tag} overflow ${o}`);
    await ctx.close();
  }
  await b.close();
  console.log(issues.length ? "ISSUES:\n" + issues.join("\n") : "NO ISSUES");
})();
