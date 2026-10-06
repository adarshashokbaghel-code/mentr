import { chromium } from "playwright";
import { LESSON_01 as L } from "../src/lib/python-lms/lesson-01";

const EXE = process.env.HOME + "/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing";
type R = { ok: boolean; stdout: string; error?: string };

(async () => {
  const b = await chromium.launch({ executablePath: EXE });
  const page = await b.newPage();
  await page.goto("http://localhost:3000/learnpython");
  await page.addScriptTag({ url: "https://cdn.jsdelivr.net/pyodide/v0.28.3/full/pyodide.js" });
  await page.addScriptTag({ content: `
    window.ready = loadPyodide().then(p => { window.py = p; });
    window.runPy = async (code) => {
      await window.ready;
      const out = [];
      window.py.setStdout({ batched: s => out.push(s) });
      const ns = window.py.globals.get("dict")();
      try { await window.py.runPythonAsync(code, { globals: ns, filename: "main.py" }); return { ok: true, stdout: out.join("\\n") }; }
      catch (e) { const l = String(e.message).trim().split("\\n"); return { ok: false, stdout: out.join("\\n"), error: l[l.length - 1] }; }
    };` });
  const run = (code: string): Promise<R> => page.evaluate(`window.runPy(${JSON.stringify(code)})`) as Promise<R>;

  let bad = 0;
  for (const s of L.notes) for (const blk of s.blocks) {
    const items: { code: string; output: string }[] = [];
    if (blk.type === "code" && blk.output !== undefined && !blk.shell && !blk.filename) items.push({ code: blk.code, output: blk.output });
    if (blk.type === "compare") for (const side of [blk.left, blk.right]) items.push({ code: side.code, output: side.output });
    for (const it of items) {
      const r = await run(it.code);
      const got = r.ok ? r.stdout : r.error!;
      if (got !== it.output && !(!r.ok && got.startsWith(it.output))) { bad++; console.log(`NOTE ${s.id}\n  exp: ${JSON.stringify(it.output)}\n  got: ${JSON.stringify(got)}`); }
    }
    if (blk.type === "table" && s.id === "reading-errors") {
      for (const [mistake, err] of blk.rows) {
        const code = [...mistake.matchAll(/`([^`]+)`/g)].map((m) => m[1]).join("\n");
        const r = await run(code);
        if (r.ok || !r.error!.startsWith(err)) { bad++; console.log(`ERRTABLE ${JSON.stringify(code)} exp ${err} got ${r.error}`); }
      }
    }
  }
  for (const q of L.practice) {
    if (q.type === "write") {
      const r = await run(q.solution);
      let problem: string | null = null;
      if (!r.ok) problem = "error " + r.error;
      else if (q.expected !== undefined && r.stdout.trim() !== q.expected.trim()) problem = `expected ${JSON.stringify(q.expected)} got ${JSON.stringify(r.stdout)}`;
      else if (q.check) problem = q.check(r, q.solution);
      if (problem) { bad++; console.log(`PRACTICE ${q.id}: ${problem}`); }
    }
    if (q.type === "mcq" && q.code && q.codeOptions) {
      const r = await run(q.code);
      if (r.ok && r.stdout !== q.options[q.answer]) { bad++; console.log(`MCQ ${q.id}: answer ${JSON.stringify(q.options[q.answer])} but python prints ${JSON.stringify(r.stdout)}`); }
    }
  }
  for (const e of L.examples) if (e.type === "playground") {
    const r = await run(e.starter);
    console.log(`EXAMPLE ${e.id}: ${r.ok ? "runs" : "errors: " + r.error}${e.goal && e.goal.check(r, e.starter) ? "  <-- GOAL ALREADY MET" : ""}`);
  }
  console.log(bad ? `${bad} problem(s)` : "ALL VERIFIED");
  await b.close();
})();
