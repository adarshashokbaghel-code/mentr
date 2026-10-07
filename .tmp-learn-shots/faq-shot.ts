import { chromium } from "playwright";
const EXE = process.env.HOME + "/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing";
(async () => {
  const b = await chromium.launch({ executablePath: EXE });
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, deviceScaleFactor: 2 });
  await p.goto("http://localhost:3000/openpythoncompiler", { waitUntil: "networkidle" });
  await p.locator("#faq").screenshot({ path: ".tmp-learn-shots/seo-m-faq2.png" });
  await b.close();
})();
