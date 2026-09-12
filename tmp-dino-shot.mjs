import { chromium } from "/Users/adarshsinghj/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs";

const views = [
  { name: "desktop", width: 1280, height: 900, scale: 2, pad: 130 },
  { name: "mobile", width: 390, height: 844, scale: 3, pad: 80 },
];

const browser = await chromium.launch();
for (const v of views) {
  const page = await browser.newPage({
    viewport: { width: v.width, height: v.height },
    deviceScaleFactor: v.scale,
  });
  await page.goto("http://localhost:3000/learn", { waitUntil: "networkidle" });
  await page.waitForTimeout(2200);
  await page.click('[aria-label="Open Mentr Learn dino guide"]');
  await page.waitForTimeout(1000);

  const shot = async (label) => {
    const box = await page.locator('[role="dialog"].learn-dino-guide-in').boundingBox();
    await page.screenshot({
      path: `.tmp-learn-shots/dino-${v.name}-${label}.png`,
      clip: {
        x: Math.max(0, box.x - v.pad),
        y: Math.max(0, box.y - 16),
        width: Math.min(v.width - Math.max(0, box.x - v.pad), box.width + v.pad + 16),
        height: Math.min(box.height + 32, v.height - Math.max(0, box.y - 16)),
      },
    });
  };

  await shot("intro");
  await page.click("text=Talk to Dino");
  await page.waitForTimeout(1000);
  await shot("chat");
  await page.close();
}
await browser.close();
console.log("done");
