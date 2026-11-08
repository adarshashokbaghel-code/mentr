import "dotenv/config";
import fs from "fs";
import path from "path";
import { chromium } from "playwright";
import { MongoClient } from "mongodb";
import { PY_ALL_LMS_SLUGS } from "../../src/lib/python-lms/index";

const OUT = path.resolve("video/assets/product-screenshots");
const TOKEN = process.env.VIDEO_QA_TOKEN || "";
const EMAIL = "video-qa-l2@mentr.local";

async function unlock() {
  const client = new MongoClient(process.env.MONGODB_URI!, {
    family: 4,
    autoSelectFamily: false,
  });
  await client.connect();
  const users = client.db("champs").collection("users");
  const now = new Date();
  await users.updateOne(
    { email: EMAIL },
    {
      $set: {
        name: "Aarav Sharma",
        "learnPython.visited": true,
        "learnPython.intermediateAccess": true,
        "learnPython.lastVisitAt": now,
        "learnPython.placement": { passed: true, score: 12, total: 12, at: now },
        "learnPython.unlockedLessons": PY_ALL_LMS_SLUGS,
        updatedAt: now,
      },
    },
  );
  await client.close();
  console.log("unlocked intermediate");
}

async function main() {
  if (!TOKEN) throw new Error("VIDEO_QA_TOKEN required");
  fs.mkdirSync(OUT, { recursive: true });
  await unlock();

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });

  await page.goto("http://localhost:3000/learnpython", {
    waitUntil: "domcontentloaded",
  });
  await page.evaluate((token) => {
    localStorage.setItem("champs_token", token);
  }, TOKEN);

  const shots: { url: string; name: string; wait?: number; prep?: () => Promise<void> }[] = [
    { url: "http://localhost:3000/learnpython/lms/intermediate", name: "10-lms-intermediate-home.png", wait: 2500 },
    { url: "http://localhost:3000/learnpython/lms/int-01?stage=notes", name: "11-lesson-study.png", wait: 2500 },
    { url: "http://localhost:3000/learnpython/lms/int-02?stage=notes", name: "12-lesson-dicts.png", wait: 2500 },
    { url: "http://localhost:3000/learnpython/lms/int-01?stage=examples", name: "13-lesson-examples.png", wait: 2500 },
    { url: "http://localhost:3000/learnpython/lms/int-01?stage=practice", name: "14-lesson-practice.png", wait: 2500 },
    { url: "http://localhost:3000/learnpython/lms/compiler", name: "15-compiler.png", wait: 4000 },
    { url: "http://localhost:3000/learnpython/lms/practice?track=intermediate", name: "16-practice-bank.png", wait: 2500 },
    { url: "http://localhost:3000/learnpython/lms/profile", name: "17-profile.png", wait: 2500 },
  ];

  for (const shot of shots) {
    await page.goto(shot.url, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(shot.wait ?? 2000);
    // Hide cookie / personal chrome if present
    await page.evaluate(() => {
      document.querySelectorAll('[class*="cookie"], [id*="cookie"]').forEach((el) => {
        (el as HTMLElement).style.display = "none";
      });
    });
    await page.screenshot({ path: path.join(OUT, shot.name) });
    console.log("saved", shot.name);
  }

  // Compiler interaction: type + run
  await page.goto("http://localhost:3000/learnpython/lms/compiler", {
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(5000);
  const editor = page.locator("textarea, .cm-content, [contenteditable='true']").first();
  if (await editor.count()) {
    await editor.click({ timeout: 5000 }).catch(() => undefined);
    await page.keyboard.press("Meta+A").catch(() => undefined);
    await page.keyboard.type(`from collections import Counter

levels = Counter(["INFO", "ERR", "INFO", "ERR", "ERR"])
print(levels.most_common(1))
`);
    await page.waitForTimeout(400);
    const run = page.getByRole("button", { name: /run/i }).first();
    if (await run.count()) {
      await run.click();
      await page.waitForTimeout(3500);
    }
  }
  await page.screenshot({ path: path.join(OUT, "18-compiler-run.png") });
  console.log("saved 18-compiler-run.png");

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
