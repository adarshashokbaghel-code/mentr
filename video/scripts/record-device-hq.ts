/**
 * Continuous-scroll Intermediate captures for a fast launch cut.
 * recordVideo size MUST equal viewport (no gray padding).
 */
import "dotenv/config";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { chromium, type Page } from "playwright";

const ROOT = fs.existsSync(path.resolve("public/clips"))
  ? path.resolve(".")
  : path.resolve("video");
const OUT = path.join(ROOT, "assets/screen-recordings/device-hq");
const PUBLIC = path.join(ROOT, "public/clips");
const TOKEN = fs.readFileSync(path.join(ROOT, ".qa-token"), "utf8").trim();

function toMp4(webm: string, name: string, w: number, h: number) {
  const mp4 = path.join(PUBLIC, name);
  execSync(
    `ffmpeg -y -i ${JSON.stringify(webm)} -an -vf "scale=${w}:${h}:flags=lanczos,setsar=1,unsharp=5:5:0.65:5:5:0.0" -c:v libx264 -pix_fmt yuv420p -crf 14 -preset slow -r 30 -movflags +faststart ${JSON.stringify(mp4)}`,
    { stdio: "inherit" },
  );
  console.log("ok", name, `${w}x${h}`);
}

async function clean(page: Page) {
  const got = page.getByRole("button", { name: /got it/i });
  if (await got.count()) await got.click().catch(() => undefined);
  await page.evaluate(`(() => {
    const hide = (sel) => document.querySelectorAll(sel).forEach((el) => {
      el.style.setProperty('display','none','important');
    });
    hide('[class*="cookie"]');
    hide('[id*="cookie"]');
    hide('[class*="Cookie"]');
    document.querySelectorAll('body *').forEach((el) => {
      const t = (el.textContent || '').trim();
      if (
        t.startsWith('Python tutors online') ||
        t.includes('verified coding tutors') ||
        t.includes('We use cookies') ||
        t === 'Got it'
      ) {
        const card = el.closest('div');
        if (card) card.style.setProperty('display','none','important');
      }
    });
  })()`);
}

/** Continuous smooth scroll — always moving, launch-video energy */
async function scrollDown(page: Page, pxPerSec: number, seconds: number) {
  // String form avoids tsx injecting __name into the page context
  await page.evaluate(`(async () => {
    const speed = ${pxPerSec};
    const secs = ${seconds};
    const start = performance.now();
    const origin = window.scrollY;
    await new Promise((resolve) => {
      const tick = (now) => {
        const t = (now - start) / 1000;
        if (t >= secs) {
          resolve();
          return;
        }
        window.scrollTo(0, origin + speed * t);
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  })()`);
}async function record(
  name: string,
  size: { width: number; height: number },
  mobile: boolean,
  fn: (page: Page) => Promise<void>,
) {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: size,
    deviceScaleFactor: 1,
    isMobile: mobile,
    hasTouch: mobile,
    recordVideo: {
      dir: OUT,
      size: { width: size.width, height: size.height },
    },
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
  toMp4(dest, `${name}.mp4`, size.width, size.height);
}

async function main() {
  fs.mkdirSync(PUBLIC, { recursive: true });

  await record("device-desk-lp", { width: 1680, height: 1050 }, false, async (page) => {
    await page.goto("http://localhost:3000/learnpython", { waitUntil: "networkidle" });
    await clean(page);
    await page.waitForTimeout(400);
    // Hold hero briefly, then continuous scroll the whole LP
    await scrollDown(page, 420, 7.5);
    await clean(page);
    await page.waitForTimeout(300);
  });

  await record("device-desk-lms", { width: 1680, height: 1050 }, false, async (page) => {
    await page.goto("http://localhost:3000/learnpython/lms/intermediate", {
      waitUntil: "networkidle",
    });
    await clean(page);
    await page.waitForSelector("text=Python Intermediate", { timeout: 20000 });
    await page.waitForTimeout(350);
    await scrollDown(page, 380, 4.2);
    const start = page.getByRole("button", { name: /start lesson|continue lesson/i });
    if (await start.count()) {
      await start.first().click().catch(() => undefined);
      await page.waitForTimeout(900);
      await scrollDown(page, 320, 2.2);
    }
    await clean(page);
    await page.waitForTimeout(250);
  });

  await record("device-mob-lp", { width: 430, height: 932 }, true, async (page) => {
    await page.goto("http://localhost:3000/learnpython", { waitUntil: "networkidle" });
    await clean(page);
    await page.waitForTimeout(350);
    await scrollDown(page, 520, 6.5);
    await clean(page);
    await page.waitForTimeout(250);
  });

  await record("device-mob-lms", { width: 430, height: 932 }, true, async (page) => {
    await page.goto("http://localhost:3000/learnpython/lms/intermediate", {
      waitUntil: "networkidle",
    });
    await clean(page);
    await page.waitForTimeout(350);
    await scrollDown(page, 480, 3.8);
    const start = page.getByRole("button", { name: /start lesson|continue/i });
    if (await start.count()) {
      await start.first().click().catch(() => undefined);
      await page.waitForTimeout(800);
      await scrollDown(page, 400, 2);
    }
    await clean(page);
    await page.waitForTimeout(250);
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
