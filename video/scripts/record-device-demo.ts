/**
 * Record Intermediate landing + LMS for device-in-device 15s cut.
 * Desktop 1440x900 and mobile 390x844 viewports.
 */
import "dotenv/config";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { chromium, type Page } from "playwright";

const OUT = path.resolve("video/assets/screen-recordings/device");
const PUBLIC = path.resolve("video/public/clips");
const TOKEN = fs.readFileSync(path.resolve("video/.qa-token"), "utf8").trim();

function toMp4(webm: string, name: string) {
  const mp4 = path.join(PUBLIC, name);
  execSync(
    `ffmpeg -y -i ${JSON.stringify(webm)} -an -c:v libx264 -pix_fmt yuv420p -r 30 -movflags +faststart ${JSON.stringify(mp4)}`,
    { stdio: "inherit" },
  );
  console.log("ok", name);
}

async function dismiss(page: Page) {
  await page.evaluate(`(() => {
    document.querySelectorAll('[class*="cookie"],[id*="cookie"]').forEach((el) => {
      el.style.setProperty('display','none','important');
    });
  })()`);
  const got = page.getByRole("button", { name: /got it/i });
  if (await got.count()) await got.click().catch(() => undefined);
}

async function record(
  name: string,
  size: { width: number; height: number },
  fn: (page: Page) => Promise<void>,
) {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: size,
    deviceScaleFactor: size.width < 500 ? 2 : 1,
    isMobile: size.width < 500,
    hasTouch: size.width < 500,
    recordVideo: { dir: OUT, size },
  });
  const page = await context.newPage();
  await page.addInitScript((t) => localStorage.setItem("champs_token", t), TOKEN);
  await fn(page);
  const video = page.video();
  await context.close();
  await browser.close();
  const webm = await video!.path();
  const dest = path.join(OUT, `${name}.webm`);
  fs.renameSync(webm, dest);
  toMp4(dest, `${name}.mp4`);
}

async function main() {
  fs.mkdirSync(PUBLIC, { recursive: true });

  // Desktop LP — hero + Intermediate path scroll + open course
  await record("device-desk-lp", { width: 1440, height: 900 }, async (page) => {
    await page.goto("http://localhost:3000/learnpython", { waitUntil: "networkidle" });
    await dismiss(page);
    await page.waitForTimeout(1000);
    for (let i = 0; i < 14; i++) {
      await page.mouse.wheel(0, 70);
      await page.waitForTimeout(85);
    }
    await page.waitForTimeout(700);
    // Hover Intermediate card / open course
    const open = page.getByRole("link", { name: /open course|test to intermediate|syllabus/i }).first();
    if (await open.count()) {
      await open.hover().catch(() => undefined);
      await page.waitForTimeout(500);
      await open.click().catch(() => undefined);
      await page.waitForTimeout(1800);
    } else {
      for (let i = 0; i < 10; i++) {
        await page.mouse.wheel(0, 80);
        await page.waitForTimeout(80);
      }
    }
    await dismiss(page);
    await page.waitForTimeout(900);
  });

  // Desktop Intermediate LMS scroll
  await record("device-desk-lms", { width: 1440, height: 900 }, async (page) => {
    await page.goto("http://localhost:3000/learnpython/lms/intermediate", {
      waitUntil: "networkidle",
    });
    await dismiss(page);
    await page.waitForTimeout(1200);
    for (let i = 0; i < 18; i++) {
      await page.mouse.wheel(0, 85);
      await page.waitForTimeout(75);
    }
    await page.waitForTimeout(500);
    const start = page.getByRole("button", { name: /start lesson|continue lesson/i }).or(
      page.getByRole("link", { name: /start lesson|continue|open/i }),
    );
    if (await start.count()) {
      await start.first().hover();
      await page.waitForTimeout(400);
      await start.first().click().catch(() => undefined);
      await page.waitForTimeout(2000);
    }
    await dismiss(page);
    await page.waitForTimeout(800);
  });

  // Mobile LP scroll
  await record("device-mob-lp", { width: 390, height: 844 }, async (page) => {
    await page.goto("http://localhost:3000/learnpython", { waitUntil: "networkidle" });
    await dismiss(page);
    await page.waitForTimeout(900);
    for (let i = 0; i < 22; i++) {
      await page.mouse.wheel(0, 90);
      await page.waitForTimeout(80);
    }
    await page.waitForTimeout(700);
    const mid = page.getByRole("link", { name: /open course|test to intermediate/i }).first();
    if (await mid.count()) {
      await mid.click().catch(() => undefined);
      await page.waitForTimeout(1600);
    }
    await dismiss(page);
    await page.waitForTimeout(900);
  });

  // Mobile Intermediate LMS
  await record("device-mob-lms", { width: 390, height: 844 }, async (page) => {
    await page.goto("http://localhost:3000/learnpython/lms/intermediate", {
      waitUntil: "networkidle",
    });
    await dismiss(page);
    await page.waitForTimeout(1100);
    for (let i = 0; i < 20; i++) {
      await page.mouse.wheel(0, 95);
      await page.waitForTimeout(70);
    }
    await page.waitForTimeout(600);
    const start = page.getByRole("button", { name: /start lesson|continue/i }).or(
      page.getByRole("link", { name: /start|continue|open/i }),
    );
    if (await start.count()) {
      await start.first().click().catch(() => undefined);
      await page.waitForTimeout(1800);
    }
    await dismiss(page);
    await page.waitForTimeout(800);
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
