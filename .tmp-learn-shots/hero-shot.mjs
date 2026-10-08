import { chromium } from "playwright";
const b = await chromium.launch({ channel: "chrome" });
for (const [n, w, h] of [["lp-hero", 1440, 900], ["lp-hero-m", 390, 844]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.goto("http://localhost:3000/learnpython", { waitUntil: "networkidle" });
  await p.waitForTimeout(1500);
  await p.screenshot({ path: `/Users/adarshsinghj/Desktop/champs/.tmp-learn-shots/${n}.png` });
}
await b.close();
