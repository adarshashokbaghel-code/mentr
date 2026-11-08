/**
 * Multi-shot product captures for YC-style launch edit.
 * Records full 1920x1080 sessions; Remotion crops create "angles".
 */
import "dotenv/config";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { chromium, type Page } from "playwright";
import { MongoClient } from "mongodb";
import { PY_ALL_LMS_SLUGS } from "../../src/lib/python-lms/index";

const OUT = path.resolve("video/assets/screen-recordings/yc");
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
        "learnPython.visited": true,
        "learnPython.intermediateAccess": true,
        "learnPython.placement": { passed: true, score: 12, total: 12, at: new Date() },
        "learnPython.unlockedLessons": PY_ALL_LMS_SLUGS,
      },
    },
  );
  await client.close();
}

async function dismiss(page: Page) {
  await page.evaluate(`(() => {
    document.querySelectorAll('[class*="cookie"],[id*="cookie"]').forEach((el) => {
      el.style.setProperty('display','none','important');
    });
    document.querySelectorAll('body *').forEach((el) => {
      const t = (el.textContent || '').trim();
      if (t.startsWith('Python tutors online') || t.includes('verified coding tutors')) {
        const card = el.closest('div');
        if (card) card.style.setProperty('display','none','important');
      }
    });
  })()`);
  const got = page.getByRole("button", { name: /got it/i });
  if (await got.count()) await got.click().catch(() => undefined);
}

function toMp4(webm: string, name: string) {
  const mp4 = path.join(PUBLIC, name);
  execSync(
    `ffmpeg -y -i ${JSON.stringify(webm)} -an -c:v libx264 -pix_fmt yuv420p -r 30 -movflags +faststart ${JSON.stringify(mp4)}`,
    { stdio: "inherit" },
  );
  console.log("clip", name);
}

async function record(name: string, token: string, fn: (page: Page) => Promise<void>) {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: W, height: H },
    recordVideo: { dir: OUT, size: { width: W, height: H } },
  });
  const page = await context.newPage();
  await page.addInitScript((t) => localStorage.setItem("champs_token", t), token);
  await page.goto("http://localhost:3000/learnpython", { waitUntil: "domcontentloaded" });
  await page.evaluate((t) => localStorage.setItem("champs_token", t), token);
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
  await unlock();
  const token = fs.readFileSync(path.resolve("video/.qa-token"), "utf8").trim();
  fs.mkdirSync(PUBLIC, { recursive: true });

  // A) Marketing scroll → Intermediate card
  await record("yc-marketing", token, async (page) => {
    await page.goto("http://localhost:3000/learnpython", { waitUntil: "networkidle" });
    await dismiss(page);
    await page.waitForTimeout(800);
    for (let i = 0; i < 22; i++) {
      await page.mouse.wheel(0, 85);
      await page.waitForTimeout(70);
    }
    await page.waitForTimeout(1200);
    for (let i = 0; i < 8; i++) {
      await page.mouse.wheel(0, 70);
      await page.waitForTimeout(70);
    }
    await page.waitForTimeout(1000);
  });

  // B) Intermediate home — scroll curriculum
  await record("yc-int-home", token, async (page) => {
    await page.goto("http://localhost:3000/learnpython/lms/intermediate", {
      waitUntil: "networkidle",
    });
    await dismiss(page);
    await page.waitForSelector("text=Python Intermediate", { timeout: 20000 });
    await page.waitForTimeout(900);
    for (let i = 0; i < 20; i++) {
      await page.mouse.wheel(0, 95);
      await page.waitForTimeout(75);
    }
    await page.waitForTimeout(600);
    for (let i = 0; i < 12; i++) {
      await page.mouse.wheel(0, -80);
      await page.waitForTimeout(70);
    }
    const btn = page.getByRole("button", { name: /start lesson|continue lesson/i }).or(
      page.getByRole("link", { name: /start lesson|continue lesson|open/i }),
    );
    if (await btn.count()) {
      await btn.first().hover();
      await page.waitForTimeout(400);
      await btn.first().click();
      await page.waitForTimeout(2000);
    }
    await dismiss(page);
    await page.waitForTimeout(800);
  });

  // C) Lesson study — flip slides
  await record("yc-study", token, async (page) => {
    await page.goto("http://localhost:3000/learnpython/lms/int-01?stage=notes", {
      waitUntil: "networkidle",
    });
    await dismiss(page);
    await page.waitForTimeout(1000);
    for (let i = 0; i < 6; i++) {
      const next = page.getByRole("button", { name: /^next$/i });
      if (await next.count()) await next.first().click().catch(() => undefined);
      else await page.keyboard.press("ArrowRight");
      await page.waitForTimeout(750);
      await dismiss(page);
    }
    await page.goto("http://localhost:3000/learnpython/lms/int-02?stage=notes", {
      waitUntil: "domcontentloaded",
    });
    await dismiss(page);
    await page.waitForTimeout(1600);
    for (let i = 0; i < 10; i++) {
      await page.mouse.wheel(0, 70);
      await page.waitForTimeout(60);
    }
    await page.waitForTimeout(800);
  });

  // D) Practice
  await record("yc-practice", token, async (page) => {
    await page.goto("http://localhost:3000/learnpython/lms/int-01?stage=practice", {
      waitUntil: "networkidle",
    });
    await dismiss(page);
    await page.waitForTimeout(1200);
    const opts = page.locator('button, [role="radio"], label').filter({ hasText: /./ });
    if (await opts.count()) {
      await opts.nth(Math.min(2, (await opts.count()) - 1)).click().catch(() => undefined);
    }
    await page.waitForTimeout(600);
    await page.getByRole("button", { name: /check|submit|continue|next/i }).first().click({ timeout: 4000 }).catch(() => undefined);
    await page.waitForTimeout(1800);
    for (let i = 0; i < 8; i++) {
      await page.mouse.wheel(0, 60);
      await page.waitForTimeout(60);
    }
    await page.waitForTimeout(700);
  });

  // E) Compiler — fill + run (hero demo)
  await record("yc-compiler", token, async (page) => {
    await page.goto("http://localhost:3000/learnpython/lms/compiler", {
      waitUntil: "networkidle",
    });
    await page.waitForTimeout(4000);
    await dismiss(page);
    const code = `def classify_temp(celsius):
    if celsius >= 38:
        return "fever"
    if celsius <= 35:
        return "too cold"
    return "normal"

for t in [34, 36.5, 38, 39.2]:
    print(t, "->", classify_temp(t))
`;
    const editor = page.locator("textarea").first();
    await editor.waitFor({ state: "attached", timeout: 20000 });
    await editor.fill(code, { force: true });
    await page.waitForTimeout(1000);
    await page.getByRole("button", { name: /^run$/i }).first().click();
    await page
      .waitForFunction(
        `() => document.body.innerText.includes("fever") || document.body.innerText.includes("->")`,
        { timeout: 25000 },
      )
      .catch(() => null);
    await page.waitForTimeout(5000);
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
