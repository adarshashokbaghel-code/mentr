import { chromium, type Page } from "playwright";
import { LESSON_01 as L } from "../src/lib/python-lms/lesson-01";

const EXE = process.env.HOME + "/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing";
const BASE = "http://localhost:3000";
const USER = { id: "e2e-l1", email: "riya@example.com", role: "parent", emailVerified: true, profileCompleted: true, parentProfile: { name: "Riya Sharma" } };
const OUT = ".tmp-learn-shots/";
const PLAY_SOLUTIONS: Record<string, string> = {
  "play-hello": 'print("Hello, I am Meera")\nprint("I like cricket")',
  "play-maths": 'print("Total:", 25 * 4)',
  "play-sep": 'print("06", "10", "2026", sep="-")',
  "play-escape": 'print("Subject\\tMarks\\nMaths\\t92\\nScience\\t88\\nEnglish\\t90")',
  "play-bugs": 'print("Welcome to the quiz")\nprint("Question 1: What is 2 + 2?")\nprint("Answer: 4")',
};

const errors: string[] = [];

async function setup(width: number, height: number, mobile: boolean, seed?: object) {
  const b = await chromium.launch({ executablePath: EXE });
  const ctx = await b.newContext({ viewport: { width, height }, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: mobile ? 2 : 1 });
  await ctx.addInitScript(
    ([seedStr, uid]) => {
      localStorage.setItem("champs_token", "e2e");
      localStorage.setItem("mentr_cookie_consent", "accepted");
      if (seedStr && !sessionStorage.getItem("seeded")) {
        localStorage.setItem(`mentr:learnpython:progress:${uid}`, seedStr);
        sessionStorage.setItem("seeded", "1");
      }
    },
    [seed ? JSON.stringify(seed) : "", USER.id] as const,
  );
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => m.type() === "error" && !/favicon|Failed to load resource/.test(m.text()) && errors.push(`console: ${m.text().slice(0, 200)}`));
  await page.route("**/api/auth/me", (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ user: USER }) }));
  return { b, page };
}

async function dismissCookies(page: Page) {
  const btn = page.locator("[data-cookie-consent] button").first();
  if (await btn.isVisible().catch(() => false)) await btn.click();
}

async function overflow(page: Page, label: string) {
  const o = await page.evaluate(() => {
    const m = document.getElementById("py-lms-main");
    return { doc: document.documentElement.scrollWidth - window.innerWidth, main: m ? m.scrollWidth - m.clientWidth : 0 };
  });
  if (o.doc > 1 || o.main > 1) errors.push(`overflow at ${label}: ${JSON.stringify(o)}`);
}

async function shot(page: Page, name: string, el?: string) {
  if (el) await page.locator(el).first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(350);
  await page.screenshot({ path: OUT + name + ".png" });
}

async function walkNotes(page: Page, prefix: string, screens: string[]) {
  for (let i = 0; i < L.notes.length; i++) {
    const s = L.notes[i];
    await page.getByRole("heading", { name: s.title, exact: true }).waitFor();
    const checks = s.blocks.filter((b) => b.type === "check");
    for (let k = 0; k < checks.length; k++) {
      const c = checks[k] as Extract<(typeof s.blocks)[number], { type: "check" }>;
      const box = page.locator("div.no-swipe.border-2").nth(k);
      await box.scrollIntoViewIfNeeded();
      await box.locator("button").nth(c.answer).click();
    }
    if (s.blocks.some((b) => b.type === "flashcards")) {
      await page.locator(".no-swipe button").nth(0).click();
      await page.locator(".no-swipe button").nth(2).click();
    }
    await page.waitForTimeout(600);
    await overflow(page, `${prefix} slide ${s.id}`);
    if (screens.includes(s.id)) {
      const target = s.blocks.find((b) => b.type === "check") ? "div.no-swipe.border-2" : s.blocks.find((b) => b.type === "flow") ? "figure" : s.blocks.find((b) => b.type === "table") ? "table" : s.blocks.find((b) => b.type === "flashcards") ? ".no-swipe" : undefined;
      await shot(page, `${prefix}-note-${s.id}`, target);
    }
    if (i === 3 && prefix === "d") {
      await page.getByRole("button", { name: "Contents" }).click();
      await shot(page, `${prefix}-contents`);
      await page.getByRole("button", { name: "Contents" }).click();
    }
    await page.getByRole("button", { name: i === L.notes.length - 1 ? "Finish notes" : "Next", exact: true }).click();
  }
}

async function walkExamples(page: Page, prefix: string) {
  for (let i = 0; i < L.examples.length; i++) {
    const ex = L.examples[i];
    await page.getByRole("heading", { name: ex.title, exact: true }).waitFor();
    if (ex.type === "trace") {
      for (let s = 0; s < ex.steps.length; s++) await page.getByRole("button", { name: "Run next line" }).click();
      if (ex.id === "trace-end") await shot(page, `${prefix}-ex-trace-end`);
    } else {
      await page.locator("textarea").first().fill(PLAY_SOLUTIONS[ex.id]);
      await page.getByRole("button", { name: "Run", exact: true }).click();
      await page.waitForFunction(() => {
        const el = document.querySelector("[data-py-output]");
        return el && !/Loading|Running/i.test(el.textContent ?? "");
      }, undefined, { timeout: 30000 });
      await page.waitForTimeout(400);
      if (ex.id === "play-bugs" || ex.id === "play-hello") await shot(page, `${prefix}-ex-${ex.id}`, "[data-py-output]");
      const goalText = await page.locator("text=Goal reached").count();
      if (!goalText) errors.push(`goal not reached for ${ex.id}: ${await page.locator("[data-py-output]").innerText()}`);
    }
    await overflow(page, `${prefix} example ${ex.id}`);
    await page.getByRole("button", { name: i === L.examples.length - 1 ? "Start practice" : "Next example" }).click();
  }
}

async function answerPractice(page: Page, prefix: string, limit = L.practice.length, wrongAt = new Set<number>()) {
  for (let i = 0; i < limit; i++) {
    const q = L.practice[i];
    await page.locator(`text=${i + 1} / ${L.practice.length}`).waitFor();
    if (q.type === "mcq") {
      if (wrongAt.has(i)) {
        const wrong = [0, 1, 2, 3].filter((x) => x !== q.answer && x < q.options.length).slice(0, 2);
        for (const w of wrong) {
          await page.getByRole("radio").nth(w).click();
          await page.getByRole("button", { name: "Check answer" }).click();
        }
      } else {
        await page.getByRole("radio").nth(q.answer).click();
        await page.getByRole("button", { name: "Check answer" }).click();
      }
    } else if (q.type === "order") {
      for (const line of q.lines) await page.getByRole("button", { name: line, exact: true }).first().click();
      await page.getByRole("button", { name: "Check order" }).click();
    } else if (q.type === "fill") {
      await page.getByLabel("Your answer").fill(q.answers[0]);
      if (prefix === "m" && i === 2) await shot(page, `${prefix}-practice-fill-typed`);
      await page.getByRole("button", { name: "Check answer" }).click();
    } else {
      await page.locator("textarea").first().fill(q.solution);
      await page.getByRole("button", { name: "Run & check" }).click();
    }
    const nextBtn = page.getByRole("button", { name: i === L.practice.length - 1 ? "See results" : "Next", exact: true });
    await nextBtn.and(page.locator(":enabled")).waitFor({ timeout: 30000 }).catch(async () => {
      errors.push(`practice ${q.id} did not resolve`);
      await shot(page, `${prefix}-STUCK-${q.id}`);
    });
    await overflow(page, `${prefix} practice ${q.id}`);
    if (["q-fill-print", "q-escape", "q-one-print"].includes(q.id) || (prefix === "d" && i === 5)) await shot(page, `${prefix}-practice-${q.id}`, "footer");
    if (i < limit - 1 || limit === L.practice.length) await nextBtn.click();
  }
}

(async () => {
  // Desktop: full lesson end to end.
  if (!process.env.ONLY_MOBILE) {
    const { b, page } = await setup(1440, 900, false);
    await page.goto(BASE + "/learnpython/lms");
    await dismissCookies(page);
    await page.getByRole("heading", { name: "Python Beginner" }).waitFor();
    await shot(page, "d-home-fresh");
    await page.goto(BASE + "/learnpython/lms/lesson-1");
    await walkNotes(page, "d", ["programming", "flowchart", "escape", "error-types", "exam"]);
    await walkExamples(page, "d");
    await answerPractice(page, "d", L.practice.length, new Set([1]));
    await page.locator("text=Retake for more stars").waitFor({ timeout: 10000 });
    await shot(page, "d-results-top");
    await page.evaluate(() => document.getElementById("py-lms-main")?.scrollTo({ top: 900 }));
    await shot(page, "d-results-mid");
    await page.evaluate(() => document.getElementById("py-lms-main")?.scrollTo({ top: 99999 }));
    await shot(page, "d-results-bottom");
    await page.goto(BASE + "/learnpython/lms");
    await page.getByRole("heading", { name: "Python Beginner" }).waitFor();
    await shot(page, "d-home-after");
    await page.locator('button[aria-label^="Bug Hunter"]').hover();
    await shot(page, "d-badge-hover");
    await page.getByRole("button", { name: "How levels work" }).click();
    await shot(page, "d-guide-levels");
    await page.getByRole("tab", { name: /Badges/ }).click();
    await shot(page, "d-guide-badges");
    await page.getByRole("tab", { name: /XP & streak/ }).click();
    await shot(page, "d-guide-xp");
    await page.keyboard.press("Escape");
    await page.evaluate(() => document.getElementById("py-lms-main")?.scrollTo({ top: 700 }));
    await shot(page, "d-home-after-lessons");
    const store = await page.evaluate((k) => localStorage.getItem(k), `mentr:learnpython:progress:${USER.id}`);
    const s = JSON.parse(store!);
    console.log("desktop store:", { xp: Object.values(s.awarded as Record<string, number>).reduce((a, x) => a + x, 0), achievements: Object.keys(s.achievements), lesson: { ...s.lessons["lesson-1"], checks: undefined } });
    await b.close();
  }
  // Mobile: notes walk + practice sample.
  {
    const { b, page } = await setup(390, 844, true);
    await page.goto(BASE + "/learnpython/lms");
    await dismissCookies(page);
    await page.getByRole("heading", { name: "Python Beginner" }).waitFor();
    await shot(page, "m-home");
    await page.goto(BASE + "/learnpython/lms/lesson-1");
    await walkNotes(page, "m", ["ipo", "flowchart", "translators", "escape", "exam"]);
    await page.getByRole("heading", { name: L.examples[0].title, exact: true }).waitFor();
    await shot(page, "m-examples-first");
    await b.close();
  }
  {
    const day = (n: number) => {
      const d = new Date();
      d.setDate(d.getDate() - n);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    };
    // Old v2 store: XP for slides/lesson should be dropped, q: keys kept at 1 XP; 2 prior login days + today = streak 3.
    const seed = {
      v: 2,
      lessons: { "lesson-1": { notesDone: true, examplesDone: true } },
      awarded: { "slide:lesson-1:ipo": 2, "lesson:lesson-1": 50, "q:lesson-1:q-old": 15, "check:lesson-1:c-x": 5 },
      achievements: {},
      days: [day(2), day(1)],
    };
    const { b, page } = await setup(390, 844, true, seed);
    await page.goto(BASE + "/learnpython/lms");
    await page.getByRole("heading", { name: "Python Beginner" }).waitFor();
    await page.locator("text=Badge unlocked").waitFor({ timeout: 5000 }).catch(() => errors.push("no streak-3 toast"));
    await shot(page, "m-home-streak");
    const migrated = await page.evaluate((k) => JSON.parse(localStorage.getItem(k)!), `mentr:learnpython:progress:${USER.id}`);
    console.log("migrated:", { v: migrated.v, awarded: migrated.awarded, achievements: Object.keys(migrated.achievements), days: migrated.days });
    await page.getByRole("button", { name: /^Regular/ }).click();
    await shot(page, "m-guide-badges");
    await page.getByRole("tab", { name: /Levels/ }).click();
    await shot(page, "m-guide-levels");
    await page.getByRole("button", { name: "Close" }).last().click();
    await page.goto(BASE + "/learnpython/lms/lesson-1?stage=practice");
    await answerPractice(page, "m", 5);
    await shot(page, "m-practice-combo");
    await b.close();
  }
  console.log(errors.length ? "ISSUES:\n" + errors.join("\n") : "NO ISSUES");
})().catch((e) => {
  console.error("FAILED:", e.message);
  console.log(errors.join("\n"));
  process.exit(1);
});
