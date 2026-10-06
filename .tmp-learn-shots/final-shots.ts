import "dotenv/config";
import { writeFileSync } from "node:fs";
import { chromium, type Page } from "playwright";
import { connectDb } from "../server/db";
import { User } from "../server/models/User";
import { signAuthToken } from "../server/services/jwt";
import { PY_LESSON_INDEX, getPyLesson } from "../src/lib/python-lms";
import { buildCertificatePdf } from "../src/lib/python-lms/certificate-pdf";
import { getPyProject } from "../src/lib/python-lms/projects";

const EXE = process.env.HOME + "/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing";
const OUT = ".tmp-learn-shots";
const API = "http://localhost:5000/api/learnpython";
const WEB = "http://localhost:3000";

(async () => {
  await connectDb();
  const u = await User.findOne({ email: "anan@gmail.com" }).select("email role learnPython").lean();
  const backup = u!.learnPython;
  const token = signAuthToken(String(u!._id), u!.email, u!.role);
  await User.updateOne({ _id: u!._id }, { $unset: { learnPython: 1 } });
  const day = new Date().toISOString().slice(0, 10);
  const sync = (p: object) =>
    fetch(`${API}/sync`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ day, awards: [], lessons: {}, achievements: {}, projects: {}, ...p }),
    }).then((r) => r.json());

  const lessons: Record<string, object> = {};
  const practice: string[] = [];
  const examples: string[] = [];
  for (const e of PY_LESSON_INDEX) {
    const l = getPyLesson(e.slug);
    if (!l) continue;
    if (e.number <= 8) lessons[e.slug] = { notesDone: true, slidesSeen: l.notes.length - 1, notesSlide: l.notes.length - 1 };
    practice.push(...l.practice.slice(0, 4).map((q) => `q:${e.slug}:${q.id}`));
    examples.push(...l.examples.map((x) => `${x.type === "trace" ? "trace" : "goal"}:${e.slug}:${x.id}`));
  }
  const now = Date.now();
  await sync({
    lessons,
    awards: [...practice.slice(0, 24), ...examples.slice(0, 31)],
    projects: {
      "quiz-game": { completedAt: new Date(now).toISOString(), hintsUsed: 2, code: getPyProject("quiz-game")!.solution },
      "guess-number": { solutionViewedAt: new Date(now).toISOString(), hintsUsed: 5 },
    },
  });

  const b = await chromium.launch({ executablePath: EXE });
  const shoot = async (name: string, width: number, height: number, fn: (p: Page) => Promise<void>) => {
    const ctx = await b.newContext({ viewport: { width, height }, deviceScaleFactor: width < 500 ? 2 : 1 });
    await ctx.addCookies([{ name: "champs_token", value: token, domain: "localhost", path: "/" }]);
    await ctx.addInitScript((t) => localStorage.setItem("champs_token", t), token);
    const p = await ctx.newPage();
    try {
      await fn(p);
      console.log("shot", name);
    } catch (e) {
      console.log("FAILED", name, e);
    }
    await ctx.close();
  };
  const go = async (p: Page, path: string, wait = 1500) => {
    await p.goto(`${WEB}${path}`, { waitUntil: "networkidle" });
    await p.waitForTimeout(wait);
  };
  const main = (p: Page) => p.locator("#py-lms-main");

  try {
    await shoot("fin-d-home", 1280, 1000, async (p) => {
      await go(p, "/learnpython/lms/final");
      await p.screenshot({ path: `${OUT}/fin-d-home.png` });
      await main(p).evaluate((el) => el.scrollTo(0, 600));
      await p.waitForTimeout(300);
      await p.screenshot({ path: `${OUT}/fin-d-cards.png` });
    });
    await shoot("fin-d-calc", 1366, 950, async (p) => {
      await go(p, "/learnpython/lms/final/calculator", 2500);
      await p.screenshot({ path: `${OUT}/fin-d-calc.png` });
      await p.getByRole("button", { name: /Check project/ }).click();
      await p.getByText(/tests pass\./).waitFor({ timeout: 60000 });
      await p.waitForTimeout(600);
      await p.screenshot({ path: `${OUT}/fin-d-calc-fail.png` });
      await p.getByRole("button", { name: /Show the first hint/ }).click();
      await p.getByRole("button", { name: /Show the next hint/ }).click();
      await p.getByRole("button", { name: /Show the full solution/ }).click();
      await p.waitForTimeout(300);
      await p.screenshot({ path: `${OUT}/fin-d-calc-confirm.png` });
      await p.getByRole("button", { name: "Keep trying" }).click();
      await p.locator("textarea").first().fill(getPyProject("calculator")!.solution);
      await p.getByRole("button", { name: /Check project/ }).click();
      await p.getByText("Project complete!").waitFor({ timeout: 60000 });
      await p.waitForTimeout(800);
      await p.screenshot({ path: `${OUT}/fin-d-calc-pass.png` });
    });
    await shoot("fin-d-guess", 1366, 950, async (p) => {
      await go(p, "/learnpython/lms/final/guess-number", 2000);
      await p.screenshot({ path: `${OUT}/fin-d-guess-viewed.png` });
    });
    await shoot("fin-m-project", 390, 844, async (p) => {
      await go(p, "/learnpython/lms/final/tic-tac-toe", 2000);
      await p.screenshot({ path: `${OUT}/fin-m-ttt.png` });
      await go(p, "/learnpython/lms/final");
      await p.screenshot({ path: `${OUT}/fin-m-home.png` });
    });
    for (const tab of ["profile", "leaderboard", "certificate"]) {
      await shoot(`prof-d-${tab}`, 1280, 1000, async (p) => {
        await go(p, `/learnpython/lms/profile?tab=${tab}`, 2500);
        await p.screenshot({ path: `${OUT}/prof-d-${tab}.png` });
        if (tab === "certificate") {
          await main(p).evaluate((el) => el.scrollTo(0, 900));
          await p.waitForTimeout(300);
          await p.screenshot({ path: `${OUT}/prof-d-certificate-2.png` });
        }
      });
      await shoot(`prof-m-${tab}`, 390, 844, async (p) => {
        await go(p, `/learnpython/lms/profile?tab=${tab}`, 2500);
        await p.screenshot({ path: `${OUT}/prof-m-${tab}.png` });
      });
    }

    await sync({
      lessons: { "lesson-9": { notesDone: true, slidesSeen: getPyLesson("lesson-9")!.notes.length - 1 } },
      awards: examples.slice(31, 55),
    });
    await shoot("prof-d-eligible", 1280, 1000, async (p) => {
      await go(p, "/learnpython/lms/profile?tab=certificate", 2500);
      await main(p).evaluate((el) => el.scrollTo(0, 700));
      await p.waitForTimeout(300);
      await p.screenshot({ path: `${OUT}/prof-d-eligible.png` });
      await p.getByRole("button", { name: /Claim certificate/ }).click();
      await p.getByRole("button", { name: /Download PDF/ }).waitFor({ timeout: 20000 });
      await main(p).evaluate((el) => el.scrollTo(0, 0));
      await p.waitForTimeout(800);
      await p.screenshot({ path: `${OUT}/prof-d-issued.png` });
    });
    const lp = (await User.findById(u!._id).select("learnPython.certificate").lean())!.learnPython!;
    const cert = lp.certificate!;
    const pub = { id: cert.id, name: cert.name, course: cert.course, issuedAt: new Date(cert.issuedAt).toISOString(), stats: cert.stats };
    writeFileSync(`${OUT}/cert.pdf`, await buildCertificatePdf(pub));
    await shoot("cert-public", 1280, 1100, async (p) => {
      await p.goto(`${WEB}/learnpython/certificate/${cert.id}`, { waitUntil: "networkidle" });
      await p.waitForTimeout(1500);
      await p.getByText("Verified").first().scrollIntoViewIfNeeded();
      await p.screenshot({ path: `${OUT}/cert-public.png` });
    });
    await shoot("cert-public-m", 390, 844, async (p) => {
      await p.goto(`${WEB}/learnpython/certificate/${cert.id}`, { waitUntil: "networkidle" });
      await p.waitForTimeout(1500);
      await p.getByText("Verified").first().scrollIntoViewIfNeeded();
      await p.screenshot({ path: `${OUT}/cert-public-m.png` });
    });
    await shoot("lms-home", 1280, 1000, async (p) => {
      await go(p, "/learnpython/lms", 2000);
      await main(p).evaluate((el) => el.scrollTo(0, el.scrollHeight));
      await p.waitForTimeout(400);
      await p.screenshot({ path: `${OUT}/home-bottom.png` });
    });
  } finally {
    await b.close();
    await User.updateOne({ _id: u!._id }, backup ? { $set: { learnPython: backup } } : { $unset: { learnPython: 1 } });
    console.log("restored");
    process.exit(0);
  }
})();
