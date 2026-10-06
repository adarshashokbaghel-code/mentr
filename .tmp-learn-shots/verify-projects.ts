import { spawnSync } from "node:child_process";
import { PY_PROJECTS } from "../src/lib/python-lms/projects";

function run(code: string, inputs: string[]) {
  const r = spawnSync("python3", ["-c", code], { input: inputs.join("\n") + (inputs.length ? "\n" : ""), encoding: "utf8" });
  const err = r.stderr.trim().split("\n").pop() ?? "";
  return { ok: r.status === 0, stdout: r.stdout.replace(/\n$/, ""), error: r.status === 0 ? undefined : err };
}
let bad = 0;
for (const p of PY_PROJECTS) {
  console.log(`\n== ${p.number}. ${p.title}`);
  for (const rule of p.codeRules) if (!rule.test(p.solution)) { bad++; console.log("✗ solution breaks rule:", rule.message); }
  for (const t of p.tests) {
    const r = run(p.solution, t.inputs);
    const problem = t.check(r);
    console.log(problem ? `✗ ${t.name}: ${problem}\n${r.stdout}\n${r.error ?? ""}` : `✓ ${t.name}`);
    if (problem) bad++;
    const s = run(p.starter, t.inputs);
    if (!t.check(s)) { bad++; console.log(`✗ starter passes ${t.name}`); }
  }
  if (!p.sample.includes("…")) {
    const lines = p.sample.split("\n");
    const inputs = lines.filter((l) => l.startsWith("> ")).map((l) => l.slice(2));
    const expected = lines.filter((l) => !l.startsWith("> ")).join("\n");
    const r = run(p.solution, inputs);
    if (r.stdout.trim() !== expected.trim()) { bad++; console.log(`✗ sample differs:\n--- sample\n${expected}\n--- actual\n${r.stdout}`); }
    else console.log("✓ sample matches");
  }
}
console.log(bad ? `\n${bad} problem(s)` : "\nall good");
