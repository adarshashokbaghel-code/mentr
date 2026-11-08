/**
 * Record real desktop product demos (scroll, click, type, run) as WebM/MP4.
 */
import "dotenv/config";
import fs from "fs";
import path from "path";
import { chromium, type Page } from "playwright";
import { MongoClient } from "mongodb";
import { PY_ALL_LMS_SLUGS } from "../../src/lib/python-lms/index";
import { execSync } from "child_process";

const OUT = path.resolve("video/assets/screen-recordings");
const PUBLIC = path.resolve("video/public/clips");
const EMAIL = "video-qa-l2@mentr.local";
const W = 1920;
const H = 1080;

async function unlock() {
  const client = new MongoClient(process.env.MONGODB_URI!, {
    family: 4,
    autoSelectFamily: false,
  });
  await client.connect();
  await client.db("champs").collection("users").updateOne(
    { email: EMAIL },
    {
      $set: {
        name: "Aarav Sharma",
        "learnPython.visited": true,
        "learnPython.intermediateAccess": true,
        "learnPython.lastVisitAt": new Date(),
        "learnPython.placement": { passed: true, score: 12, total: 12, at: new Date() },
        "learnPython.unlockedLessons": PY_ALL_LMS_SLUGS,
      },
    },
  );
  await client.close();
}

async function hideChrome(page: Page) {
  await page.evaluate(() => {
    const kill = (sel: string) =>
      document.querySelectorAll(sel).forEach((el) => ((el as HTMLElement).style.display = "none"));
    kill('[class*="cookie"]');
    kill('[id*="cookie"]');
    // tutor promo widget
    kill('[class*="tutor"]');
  }).catch(() => undefined);
}

async function smoothScroll(page: Page, total: number, steps = 24, pause = 80) {
  const step = total / steps;
  for (let i = 0; i < steps; i++) {
    await page.evaluate((y) => window.scrollBy(0, y), step);
    await page.waitForTimeout(pause);
  }
}

function toMp4(webmPath: string, mp4Path: string) {
  execSync(
    `ffmpeg -y -i ${JSON.stringify(webmPath)} -an -c:v libx264 -pix_fmt yuv420p -movflags +faststart ${JSON.stringify(mp4Path)}`,
    { stdio: "inherit" },
  );
}

async function recordClip(
  name: string,
  token: string,
  action: (page: Page) => Promise<void>,
) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: W, height: H },
    deviceScaleFactor: 1,
    recordVideo: { dir: OUT, size: { width: W, height: H } },
  });
  const page = await context.newPage();
  await page.goto("http://localhost:3000/learnpython", { waitUntil: "domcontentloaded" });
  await page.evaluate((t) => localStorage.setItem("champs_token", t), token);
  await hideChrome(page);
  await action(page);
  const vid = page.video();
  await context.close();
  await browser.close();
  if (!vid) throw new Error("no video for " + name);
  const webm = await vid.path();
  const destWebm = path.join(OUT, `${name}.webm`);
  fs.renameSync(webm, destWebm);
  const mp4 = path.join(PUBLIC, `${name}.mp4`);
  toMp4(destWebm, mp4);
  console.log("clip", name, mp4);
}

async function main() {
  const token = fs.readFileSync(path.resolve("video/.qa-token"), "utf8").trim();
  fs.mkdirSync(OUT, { recursive: true });
  fs.mkdirSync(PUBLIC, { recursive: true });
  await unlock();

  // 1) Marketing hero → Intermediate paths (live feel via local)
  await recordClip("01-hero-scroll", token, async (page) => {
    await page.goto("http://localhost:3000/learnpython", { waitUntil: "networkidle" });
    await hideChrome(page);
    await page.waitForTimeout(900);
    await smoothScroll(page, 1100, 28, 70);
    await page.waitForTimeout(1200);
    await smoothScroll(page, 900, 22, 70);
    await page.waitForTimeout(1000);
  });

  // 2) Intermediate LMS home — scroll curriculum
  await recordClip("02-int-home", token, async (page) => {
    await page.goto("http://localhost:3000/learnpython/lms/intermediate", {
      waitUntil: "networkidle",
    });
    await hideChrome(page);
    await page.waitForTimeout(1200);
    const main = page.locator("main, [data-scroll], body").first();
    await smoothScroll(page, 1400, 30, 65);
    await page.waitForTimeout(800);
    await page.mouse.move(900, 420);
    await page.waitForTimeout(400);
    await page.getByRole("button", { name: /start lesson/i }).first().click({ timeout: 4000 }).catch(() => undefined);
    await page.waitForTimeout(1800);
  });

  // 3) Lesson study — flip through notes
  await recordClip("03-lesson-study", token, async (page) => {
    await page.goto("http://localhost:3000/learnpython/lms/int-01?stage=notes", {
      waitUntil: "networkidle",
    });
    await hideChrome(page);
    await page.waitForTimeout(1200);
    for (let i = 0; i < 4; i++) {
      const next = page.getByRole("button", { name: /next/i }).first();
      if (await next.count()) {
        await next.click().catch(() => undefined);
      } else {
        await page.keyboard.press("ArrowRight").catch(() => undefined);
      }
      await page.waitForTimeout(900);
    }
    await page.getByRole("tab", { name: /examples/i }).first().click({ timeout: 3000 }).catch(async () => {
      await page.goto("http://localhost:3000/learnpython/lms/int-01?stage=examples", {
        waitUntil: "domcontentloaded",
      });
    });
    await page.waitForTimeout(1600);
  });

  // 4) Practice interaction
  await recordClip("04-practice", token, async (page) => {
    await page.goto("http://localhost:3000/learnpython/lms/int-01?stage=practice", {
      waitUntil: "networkidle",
    });
    await hideChrome(page);
    await page.waitForTimeout(1400);
    const option = page.locator('button, [role="radio"], label').filter({ hasText: /./ }).nth(3);
    await option.click({ timeout: 3000 }).catch(() => undefined);
    await page.waitForTimeout(700);
    await page.getByRole("button", { name: /check|submit|continue|next/i }).first().click({ timeout: 3000 }).catch(() => undefined);
    await page.waitForTimeout(1600);
    await smoothScroll(page, 400, 10, 60);
    await page.waitForTimeout(800);
  });

  // 5) Compiler — type + run (hero product moment)
  await recordClip("05-compiler-run", token, async (page) => {
    await page.goto("http://localhost:3000/learnpython/lms/compiler", {
      waitUntil: "networkidle",
    });
    await hideChrome(page);
    await page.waitForTimeout(3500);
    const editor = page.locator(".cm-content, textarea, [contenteditable='true']").first();
    await editor.click({ timeout: 8000 });
    await page.keyboard.press("Meta+A");
    await page.waitForTimeout(200);
    const code = `def classify_temp(celsius):
    if celsius >= 38:
        return "fever"
    if celsius <= 35:
        return "too cold"
    return "normal"

for t in [34, 36.5, 38, 39.2]:
    print(t, "→", classify_temp(t))
`;
    for (const line of code.split("\n")) {
      await page.keyboard.type(line, { delay: 18 });
      await page.keyboard.press("Enter");
    }
    await page.waitForTimeout(600);
    await page.getByRole("button", { name: /^run$/i }).first().click();
    await page.waitForTimeout(4000);
  });

  // 6) Dictionaries lesson + profile flash
  await recordClip("06-dicts-profile", token, async (page) => {
    await page.goto("http://localhost:3000/learnpython/lms/int-02?stage=notes", {
      waitUntil: "networkidle",
    });
    await hideChrome(page);
    await page.waitForTimeout(1000);
    await smoothScroll(page, 700, 16, 70);
    await page.waitForTimeout(700);
    await page.goto("http://localhost:3000/learnpython/lms/profile", {
      waitUntil: "domcontentloaded",
    });
    await hideChrome(page);
    await page.waitForTimeout(2000);
    await smoothScroll(page, 500, 12, 70);
    await page.waitForTimeout(900);
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
