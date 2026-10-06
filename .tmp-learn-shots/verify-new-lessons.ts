import { spawnSync } from "node:child_process";
import { LESSON_07 } from "../src/lib/python-lms/lesson-07";
import { LESSON_08 } from "../src/lib/python-lms/lesson-08";
import { LESSON_09 } from "../src/lib/python-lms/lesson-09";

function run(code: string, inputs: string[] = []) {
  const r = spawnSync("python3", ["-c", code], { input: inputs.join("\n") + "\n", encoding: "utf8" });
  const err = r.stderr.trim().split("\n").pop() ?? "";
  return { out: r.stdout, err, ok: r.status === 0 };
}
const norm = (s: string) => s.replace(/\r/g, "").split("\n").map((l) => l.trimEnd()).join("\n").trim();
let bad = 0;
const fail = (where: string, msg: string) => {
  bad++;
  console.log(`✗ ${where}: ${msg}`);
};

for (const lesson of process.argv.includes("--9") ? [LESSON_09] : [LESSON_07, LESSON_08, LESSON_09]) {
  console.log(`\n=== ${lesson.slug} (${lesson.notes.length} slides, ${lesson.examples.length} examples, ${lesson.practice.length} practice)`);
  for (const s of lesson.notes) {
    for (const b of s.blocks) {
      if (b.type === "code") {
        const r = run(b.code, b.inputs);
        if (!r.ok) fail(`${s.id} live`, r.err);
        else console.log(`· ${s.id}:\n${r.out.trimEnd()}`);
      }
      if (b.type === "compare") {
        for (const side of [b.left, b.right]) {
          const r = run(side.code);
          const got = r.ok ? norm(r.out) : r.err;
          if (norm(side.output) !== got && !side.output.includes("again")) fail(`${s.id} compare ${side.label}`, `claims ${JSON.stringify(side.output)} got ${JSON.stringify(got)}`);
        }
      }
    }
  }
  for (const ex of lesson.examples) {
    if (ex.type === "trace") {
      const r = run(ex.code);
      const claimed = ex.steps.filter((s) => s.output !== undefined).map((s) => s.output).join("\n");
      if (norm(claimed) !== norm(r.out)) fail(`trace ${ex.id}`, `claims ${JSON.stringify(claimed)} got ${JSON.stringify(r.out)}`);
      const lines = ex.code.split("\n").length;
      if (ex.steps.some((s) => s.line < 1 || s.line > lines)) fail(`trace ${ex.id}`, "line out of range");
    }
  }
  const PLAY: Record<string, string> = {
    "lesson-9:play-greet": 'def greet(name):\n    print("Hello", name)\n\ngreet("Mia")\ngreet("Sam")',
    "lesson-9:play-square": "def square(n):\n    return n * n\n\nprint(square(4))\nprint(square(9))\n",
    "lesson-9:play-score": "def calculate_score(correct, total):\n    return correct * 100 / total\n\nresult = calculate_score(8, 10)\nprint(result)\n",
    "lesson-9:play-bugs": 'def double(n):\n    return n * 2\n\nanswer = double(21)\nprint("Answer:", answer)',
  };
  for (const ex of lesson.examples) {
    if (ex.type !== "playground" || !ex.goal) continue;
    const inputs = ex.inputs?.split("\n") ?? [];
    const start = run(ex.starter, inputs);
    if (ex.goal.check({ ok: start.ok, stdout: start.out } as never, ex.starter)) fail(`play ${ex.id}`, "starter already passes the goal");
    const sol = PLAY[`${lesson.slug}:${ex.id}`];
    if (sol) {
      const r = run(sol, inputs);
      if (!ex.goal.check({ ok: r.ok, stdout: r.out } as never, sol)) fail(`play ${ex.id}`, `solution fails goal: ${r.out} ${r.err}`);
    }
  }
  for (const q of lesson.practice) {
    if (q.type === "write") {
      const r = run(q.solution, q.inputs);
      if (!r.ok) fail(q.id, r.err);
      else if (q.expected !== undefined && norm(r.out) !== norm(q.expected)) fail(q.id, `expected ${JSON.stringify(q.expected)} got ${JSON.stringify(r.out)}`);
      const res = { ok: r.ok, stdout: r.out, stderr: "" } as never;
      const msg = q.check?.(res, q.solution);
      if (msg) fail(q.id, `own check rejects solution: ${msg}`);
    }
    if (q.type === "mcq" && q.code) {
      const r = run(q.code);
      console.log(`· ${q.id} → ${r.ok ? JSON.stringify(r.out.trim()) : r.err}   [answer: ${q.options[q.answer]}]`);
    }
  }
  const ids = [...lesson.practice.map((q) => q.id), ...lesson.examples.map((e) => e.id)];
  const checks = lesson.notes.flatMap((s) => s.blocks.filter((b) => b.type === "check").map((b) => (b as { id: string }).id));
  for (const list of [ids, checks, lesson.notes.map((s) => s.id)]) {
    const dup = list.filter((x, i) => list.indexOf(x) !== i);
    if (dup.length) fail("ids", `duplicates ${dup}`);
  }
}
console.log(bad ? `\n${bad} problem(s)` : "\nall good");
