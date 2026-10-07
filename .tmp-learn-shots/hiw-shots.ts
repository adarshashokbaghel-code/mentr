import { chromium } from "playwright";

const URL = "http://localhost:3000/openpythoncompiler/how-it-works";
const OUT = ".tmp-learn-shots";

async function main() {
  const browser = await chromium.launch({
    executablePath:
      process.env.HOME +
      "/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing",
  });
  for (const [tag, viewport] of [
    ["d", { width: 1280, height: 900 }],
    ["m", { width: 390, height: 844 }],
  ] as const) {
    const page = await browser.newPage({ viewport });
    await page.goto(URL, { waitUntil: "networkidle" });
    await page.screenshot({ path: `${OUT}/hiw-${tag}-top.png` });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    console.log(tag, "horizontal overflow px:", overflow);
    for (const id of ["overview", "input", "devices"]) {
      const el = page.locator(`#${id}`);
      if (await el.count()) {
        await el.scrollIntoViewIfNeeded();
        await page.evaluate((i) => document.getElementById(i)?.scrollIntoView(), id);
        await page.waitForTimeout(200);
        await page.screenshot({ path: `${OUT}/hiw-${tag}-${id}.png` });
      } else console.log("missing section", id);
    }
    await page.close();
  }
  await browser.close();
}
main();
