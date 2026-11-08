import "dotenv/config";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { chromium, type Page } from "playwright";
import { MongoClient } from "mongodb";
import { PY_ALL_LMS_SLUGS } from "../../src/lib/python-lms/index";

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
        "learnPython.visited": true,
        "learnPython.intermediateAccess": true,
        "learnPython.placement": { passed: true, score: 12, total: 12, at: new Date() },
        "learnPython.unlockedLessons": PY_ALL_LMS_SLUGS,
      },
    },
  );
  await client.close();
}

async function prep(page: Page, token: string) {
  await page.addInitScript((t) => {
    localStorage.setItem("champs_token", t);
  }, token);
  await page.goto("http://localhost:3000/learnpython", { waitUntil: "domcontentloaded" });
  await page.evaluate((t) => localStorage.setItem("champs_token", t), token);
}

async function dismiss(page: Page) {
  await page.evaluate(`(() => {
    const hide = (sel) =>
      document.querySelectorAll(sel).forEach((el) => {
        el.style.setProperty("display", "none", "important");
      });
    hide('[class*="cookie"]');
    hide('[id*="cookie"]');
    document.querySelectorAll("body *").forEach((el) => {
      const t = (el.textContent || "").trim();
      if (t.startsWith("Python tutors online") || t.includes("verified coding tutors")) {
        const card = el.closest("div");
        if (card) card.style.setProperty("display", "none", "important");
      }
    });
  })()`);
  const got = page.getByRole("button", { name: /got it/i });
  if (await got.count()) await got.click().catch(() => undefined);
}

function toMp4(webm: string, mp4: string) {
  execSync(
    `ffmpeg -y -i ${JSON.stringify(webm)} -an -c:v libx264 -pix_fmt yuv420p -r 30 -movflags +faststart ${JSON.stringify(mp4)}`,
    { stdio: "inherit" },
  );
}

async function record(name: string, token: string, fn: (page: Page) => Promise<void>) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: W, height: H },
    recordVideo: { dir: OUT, size: { width: W, height: H } },
  });
  const page = await context.newPage();
  await prep(page, token);
  await fn(page);
  const video = page.video();
  await context.close();
  await browser.close();
  const webm = await video!.path();
  const dest = path.join(OUT, `${name}.webm`);
  fs.renameSync(webm, dest);
  toMp4(dest, path.join(PUBLIC, `${name}.mp4`));
  console.log("ok", name);
}

async function main() {
  await unlock();
  const token = fs.readFileSync(path.resolve("video/.qa-token"), "utf8").trim();
  fs.mkdirSync(OUT, { recursive: true });
  fs.mkdirSync(PUBLIC, { recursive: true });

  await record("02-int-home", token, async (page) => {
    await page.goto("http://localhost:3000/learnpython/lms/intermediate", {
      waitUntil: "networkidle",
      timeout: 60000,
    });
    await page.waitForTimeout(1500);
    await dismiss(page);
    // Ensure we're on Intermediate, not auth sheet
    const blocked = await page.getByText(/Start Python Beginner|Get my code/i).count();
    if (blocked) {
      throw new Error("Auth gate still visible on Intermediate home");
    }
    await page.waitForSelector("text=Python Intermediate", { timeout: 15000 });
    await page.waitForTimeout(800);
    // Scroll the lesson list / main content
    for (let i = 0; i < 18; i++) {
      await page.mouse.wheel(0, 90);
      await page.waitForTimeout(90);
    }
    await page.waitForTimeout(700);
    for (let i = 0; i < 10; i++) {
      await page.mouse.wheel(0, -70);
      await page.waitForTimeout(80);
    }
    const start = page.getByRole("link", { name: /start lesson|continue/i }).or(
      page.getByRole("button", { name: /start lesson|continue/i }),
    );
    if (await start.count()) {
      await start.first().hover();
      await page.waitForTimeout(500);
      await start.first().click();
      await page.waitForTimeout(2200);
    } else {
      await page.goto("http://localhost:3000/learnpython/lms/int-01?stage=notes", {
        waitUntil: "domcontentloaded",
      });
      await page.waitForTimeout(1800);
    }
    await dismiss(page);
    await page.waitForTimeout(800);
  });

  await record("05-compiler-run", token, async (page) => {
    await page.goto("http://localhost:3000/learnpython/lms/compiler", {
      waitUntil: "networkidle",
      timeout: 60000,
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

    // Transparent textarea over highlighted <pre> — force fill
    const editor = page.locator('textarea[aria-label*="Python code"]').first();
    await editor.waitFor({ state: "attached", timeout: 20000 });
    await editor.focus({ force: true });
    await editor.fill(code, { force: true });
    await page.waitForTimeout(800);

    await dismiss(page);
    await page.getByRole("button", { name: /^run$/i }).first().click();
    // Wait for success output
    await page.waitForTimeout(1500);
    await page
      .waitForFunction(
        `() => {
          const body = document.body.innerText;
          return body.includes("fever") || body.includes("normal") || body.includes("->");
        }`,
        { timeout: 20000 },
      )
      .catch(() => undefined);
    await page.waitForTimeout(3500);
    // small pan to output
    await page.mouse.move(1500, 500);
    await page.waitForTimeout(1200);
  });

  // Also refresh practice + study with dismiss overlays
  await record("03-lesson-study", token, async (page) => {
    await page.goto("http://localhost:3000/learnpython/lms/int-01?stage=notes", {
      waitUntil: "networkidle",
    });
    await page.waitForTimeout(1200);
    await dismiss(page);
    await page.waitForSelector("text=How developers solve problems", { timeout: 15000 });
    for (let i = 0; i < 5; i++) {
      const next = page.getByRole("button", { name: /^next$/i }).or(page.getByRole("button", { name: /next slide|continue/i }));
      if (await next.count()) await next.first().click().catch(() => undefined);
      else await page.keyboard.press("ArrowRight");
      await page.waitForTimeout(850);
      await dismiss(page);
    }
    await page.goto("http://localhost:3000/learnpython/lms/int-01?stage=examples", {
      waitUntil: "domcontentloaded",
    });
    await dismiss(page);
    await page.waitForTimeout(2000);
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
