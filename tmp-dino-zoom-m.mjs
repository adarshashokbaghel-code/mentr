import { chromium } from "/Users/adarshsinghj/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs";

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
});
await page.goto("http://localhost:3000/learn", { waitUntil: "networkidle" });
await page.waitForTimeout(2500);
await page.click('[aria-label="Open Mentr Learn dino guide"]');
await page.waitForTimeout(900);

const box = await page.locator('[role="dialog"].learn-dino-guide-in').boundingBox();
await page.screenshot({
  path: ".tmp-learn-shots/dino-hold-zoom-mobile.png",
  clip: { x: 0, y: box.y - 24, width: 240, height: 220 },
});
await browser.close();
console.log("done");
