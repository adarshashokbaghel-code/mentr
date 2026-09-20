/**
 * Record Instant Connect promo screen captures.
 *
 * Usage (dev servers must be running on :3000 / :5000):
 *   npx tsx scripts/record-instant-connect-promo.ts
 *
 * Outputs:
 *   videos/instant-connect/parent-instant-connect.webm|mp4
 *   videos/instant-connect/mentor-instant-connect.webm|mp4
 */
import "dotenv/config";
import { mkdirSync, existsSync, readdirSync, copyFileSync, unlinkSync } from "fs";
import { join } from "path";
import { chromium, type Page, type BrowserContext } from "playwright";
import { connectDb, disconnectDb } from "../server/db";
import { User } from "../server/models/User";
import { InstantConnectRequest } from "../server/models/InstantConnectRequest";
import { signAuthToken } from "../server/services/jwt";
import { isEligibleForInstantConnect } from "../server/services/instant-connect-match";

const BASE = process.env.PROMO_BASE_URL || "http://localhost:3000";
const OUT_DIR = join(process.cwd(), "videos", "instant-connect");
const VIEWPORT = { width: 1280, height: 720 };

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function authAs(
  context: BrowserContext,
  page: Page,
  user: { _id: { toString(): string }; email: string; role: string },
) {
  const token = signAuthToken(user._id.toString(), user.email, user.role as "parent" | "faculty");
  await context.addCookies([
    {
      name: "champs_token",
      value: token,
      domain: "localhost",
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
    },
  ]);
  await page.addInitScript((t) => {
    localStorage.setItem("champs_token", t);
    localStorage.setItem("mentr_cookie_consent", "accepted");
  }, token);
}

async function dismissCookies(page: Page) {
  const accept = page.getByRole("button", { name: /Accept|Got it|OK/i }).first();
  if (await accept.isVisible().catch(() => false)) {
    await accept.click();
    await sleep(400);
    return;
  }
  // Force-hide if copy differs
  await page.evaluate(() => {
    try {
      localStorage.setItem("mentr_cookie_consent", "accepted");
    } catch {
      /* ignore */
    }
    document.querySelector('[aria-label="Cookie notice"]')?.remove();
  });
  await sleep(200);
}

async function clickMainDockCta(page: Page, name: RegExp) {
  const btn = page
    .locator("div.fixed.inset-x-0.bottom-0 button, div.fixed.inset-x-0.bottom-0 a")
    .filter({ hasText: name })
    .first();
  await btn.waitFor({ state: "visible", timeout: 15_000 });
  await btn.click({ force: true });
}

async function selectOption(page: Page, labelText: string, value: string) {
  const dialog = page.getByRole("dialog");
  // Labels wrap the <select>, so hasText includes option text — match the label span only.
  const field = dialog
    .locator("label")
    .filter({ has: dialog.locator("span", { hasText: labelText }) })
    .first();
  const select = field.locator("select").first();
  await select.waitFor({ state: "visible", timeout: 10_000 });
  await select.selectOption(value);
}

async function recordParentFlow(context: BrowserContext, parent: any) {
  const page = await context.newPage();
  await authAs(context, page, parent);

  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
  await dismissCookies(page);
  await sleep(700);

  // Open Instant Connect (main dock CTA, not the guide icon)
  await clickMainDockCta(page, /^Instant Connect$/);
  await sleep(900);

  // Looking for
  const dialog = page.getByRole("dialog");
  const tutorChip = dialog.getByRole("button", { name: /^Tutor$/i }).first();
  if (await tutorChip.isVisible().catch(() => false)) {
    await tutorChip.click();
    await sleep(400);
  }
  await clickMainDockCta(page, /^Next$/);
  await sleep(600);

  // Class & subject — use exact option values from IC_CLASS_LEVELS / IC_SUBJECTS
  await selectOption(page, "Class / Level", "Class 10");
  await sleep(300);
  await selectOption(page, "Subject", "Mathematics");
  await sleep(400);
  await clickMainDockCta(page, /^Next$/);
  await sleep(600);

  // Board & mode
  await selectOption(page, "Board", "CBSE");
  await sleep(300);
  const online = dialog.getByRole("button", { name: /^Online$/i }).first();
  if (await online.isVisible().catch(() => false)) {
    await online.click();
  }
  await sleep(400);
  await clickMainDockCta(page, /^Next$/);
  await sleep(600);

  // Budget (optional)
  await clickMainDockCta(page, /^Next$/);
  await sleep(600);

  // Notes → Find mentors (skip notes for speed / avoid AI path)
  const notes = dialog.locator("textarea").first();
  if (await notes.isVisible().catch(() => false)) {
    // leave empty → "Find mentors" (rules match, faster than AI)
    await sleep(300);
  }
  await clickMainDockCta(page, /Find mentors|AI match/);
  await sleep(2500);

  // Results — consent + notify
  const consent = dialog.locator('input[type="checkbox"]').first();
  if (await consent.count()) {
    if (!(await consent.isChecked())) await consent.check({ force: true });
  }
  await sleep(700);
  await clickMainDockCta(page, /Notify/);
  await sleep(2000);

  // Track on dashboard
  const track = page
    .locator("div.fixed.inset-x-0.bottom-0 a, div.fixed.inset-x-0.bottom-0 button")
    .filter({ hasText: /Track request/i })
    .first();
  if (await track.isVisible().catch(() => false)) {
    await track.click({ force: true });
  } else {
    await page.goto(`${BASE}/parent/dashboard#instant-connect`, {
      waitUntil: "networkidle",
    });
  }
  await dismissCookies(page);
  await sleep(2500);
  await page.close();
}

async function recordMentorFlow(context: BrowserContext, mentor: any) {
  const page = await context.newPage();
  await authAs(context, page, mentor);

  await page.goto(`${BASE}/dashboard#instant-connect`, {
    waitUntil: "domcontentloaded",
  });
  await page.evaluate(() => {
    try {
      localStorage.setItem("mentr_cookie_consent", "accepted");
    } catch {
      /* ignore */
    }
  });
  await page.reload({ waitUntil: "networkidle" });
  await dismissCookies(page);
  await sleep(1000);

  const section = page.locator("#instant-connect");
  if (await section.count()) {
    await section.scrollIntoViewIfNeeded();
  }
  await sleep(1200);

  const activeTab = page.getByRole("button", { name: /Active/i }).first();
  if (await activeTab.isVisible().catch(() => false)) {
    await activeTab.click();
    await sleep(700);
  }

  const phone = page.getByText(/Parent contact|\+91|phone/i).first();
  if (await phone.isVisible().catch(() => false)) {
    await phone.scrollIntoViewIfNeeded();
    await sleep(1400);
  }

  await sleep(2200);
  await page.close();
}

async function pickUsers() {
  await connectDb();

  const parent = await User.findOne({
    role: "parent",
    "parentProfile.phoneNumber": { $exists: true, $nin: [null, ""] },
    "parentProfile.name": { $exists: true, $ne: "" },
  }).sort({ updatedAt: -1 });

  if (!parent) throw new Error("No parent with phone found — add phone on a parent profile first");

  const mentors = await User.find({
    role: "faculty",
    emailVerified: true,
    profileCompleted: true,
  })
    .sort({ updatedAt: -1 })
    .limit(40);

  const eligible = mentors.filter((m) => isEligibleForInstantConnect(m));
  if (eligible.length < 1) {
    throw new Error("No Instant Connect–eligible mentors found");
  }

  // Prefer a mentor who already has an active IC request
  const active = await InstantConnectRequest.findOne({ status: "active" })
    .sort({ createdAt: -1 })
    .lean();

  let mentor = eligible[0]!;
  if (active?.selectedTutorIds?.length) {
    const id = String(active.selectedTutorIds[0]);
    const hit = eligible.find((m) => m._id.toString() === id);
    if (hit) mentor = hit;
  }

  return { parent, mentor };
}

async function webmToMp4(dir: string) {
  const { execSync } = await import("child_process");
  let ffmpeg = "ffmpeg";
  try {
    // Prefer learn-video venv ffmpeg if present
    const alt = join(
      process.cwd(),
      ".venv-video",
      "lib",
      "python3.9",
      "site-packages",
      "imageio_ffmpeg",
      "binaries",
    );
    if (existsSync(alt)) {
      const bins = readdirSync(alt).filter((f) => f.includes("ffmpeg"));
      if (bins[0]) ffmpeg = join(alt, bins[0]!);
    }
  } catch {
    /* use system ffmpeg */
  }

  for (const name of ["parent-instant-connect", "mentor-instant-connect"]) {
    const webm = join(dir, `${name}.webm`);
    const mp4 = join(dir, `${name}.mp4`);
    if (!existsSync(webm)) continue;
    try {
      execSync(
        `"${ffmpeg}" -y -i "${webm}" -c:v libx264 -pix_fmt yuv420p -movflags +faststart -an "${mp4}"`,
        { stdio: "inherit" },
      );
    } catch (err) {
      console.warn(`ffmpeg convert failed for ${name}:`, err);
    }
  }
}

function collectVideo(contextDir: string, destName: string) {
  const files = readdirSync(contextDir).filter((f) => f.endsWith(".webm"));
  if (!files.length) throw new Error(`No webm in ${contextDir}`);
  // Playwright names videos after the page; take the largest (main recording)
  const picked = files
    .map((f) => join(contextDir, f))
    .sort((a, b) => {
      const { statSync } = require("fs") as typeof import("fs");
      return statSync(b).size - statSync(a).size;
    })[0]!;
  copyFileSync(picked, join(OUT_DIR, `${destName}.webm`));
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const { parent, mentor } = await pickUsers();
  console.log(`Parent: ${parent.parentProfile?.name} <${parent.email}>`);
  console.log(`Mentor: ${mentor.profile?.name} <${mentor.email}>`);

  const browser = await chromium.launch({ headless: true });

  // --- Parent recording ---
  const parentDir = join(OUT_DIR, "_raw-parent");
  mkdirSync(parentDir, { recursive: true });
  const parentCtx = await browser.newContext({
    viewport: VIEWPORT,
    recordVideo: { dir: parentDir, size: VIEWPORT },
  });
  try {
    await recordParentFlow(parentCtx, parent);
  } finally {
    await parentCtx.close();
  }
  collectVideo(parentDir, "parent-instant-connect");

  // --- Mentor recording ---
  const mentorDir = join(OUT_DIR, "_raw-mentor");
  mkdirSync(mentorDir, { recursive: true });
  const mentorCtx = await browser.newContext({
    viewport: VIEWPORT,
    recordVideo: { dir: mentorDir, size: VIEWPORT },
  });
  try {
    await recordMentorFlow(mentorCtx, mentor);
  } finally {
    await mentorCtx.close();
  }
  collectVideo(mentorDir, "mentor-instant-connect");

  await browser.close();
  await disconnectDb();

  await webmToMp4(OUT_DIR);
  console.log(`\nDone → ${OUT_DIR}`);
  console.log("  parent-instant-connect.webm / .mp4");
  console.log("  mentor-instant-connect.webm / .mp4");
}

main().catch(async (err) => {
  console.error(err);
  try {
    await disconnectDb();
  } catch {
    /* ignore */
  }
  process.exit(1);
});
