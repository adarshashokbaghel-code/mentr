/**
 * Validates src/lib/learn-content: every curriculum module (except hand-seeded
 * A1–A4) has notes + a 10-question quiz ordered 4 easy / 4 medium / 2 hard.
 *
 *   npx tsx scripts/validate-learn-content.ts
 */
import { ALL_MODULE_IDS } from "../src/lib/learn-curriculum";
import { LESSON_CONTENT_BANK } from "../src/lib/learn-content";

const HAND_SEEDED = new Set(["A1", "A2", "A3", "A4"]);
const EXPECTED = ["easy", "easy", "easy", "easy", "medium", "medium", "medium", "medium", "hard", "hard"];

const errors: string[] = [];
const err = (id: string, msg: string) => errors.push(`${id}: ${msg}`);

for (const id of ALL_MODULE_IDS) {
  if (HAND_SEEDED.has(id)) continue;
  const c = LESSON_CONTENT_BANK[id];
  if (!c) {
    err(id, "missing from bank");
    continue;
  }
  if (id !== "A5") {
    const n = c.notes;
    if (!n) err(id, "missing notes");
    else {
      if (!n.bigIdea.trim()) err(id, "empty bigIdea");
      if (n.definitions.length < 3) err(id, `only ${n.definitions.length} definitions`);
      if (n.panels.length < 3) err(id, `only ${n.panels.length} panels`);
      if (n.panels.some((p) => p.body.length === 0)) err(id, "empty panel body");
      if (n.remember.length < 3) err(id, `only ${n.remember.length} remember lines`);
      if (!n.checkYourself.q.trim() || !n.checkYourself.a.trim()) err(id, "empty checkYourself");
      if (!n.dinoLine.trim()) err(id, "empty dinoLine");
    }
  }
  if (c.quiz.length !== 10) err(id, `quiz has ${c.quiz.length} questions`);
  const prompts = new Set<string>();
  c.quiz.forEach((q, i) => {
    const tag = `Q${i + 1}`;
    if (q.difficulty !== EXPECTED[i]) err(id, `${tag} difficulty ${q.difficulty}, expected ${EXPECTED[i]}`);
    if (!q.prompt.trim()) err(id, `${tag} empty prompt`);
    if (prompts.has(q.prompt)) err(id, `${tag} duplicate prompt`);
    prompts.add(q.prompt);
    if (!q.explanation.trim()) err(id, `${tag} empty explanation`);
    if (q.type === "true_false") {
      if (q.options.length !== 2 || q.options[0] !== "True" || q.options[1] !== "False") {
        err(id, `${tag} true_false options must be ["True","False"]`);
      }
    } else if (q.options.length < 3 || q.options.length > 4) {
      err(id, `${tag} mcq has ${q.options.length} options`);
    }
    if (new Set(q.options).size !== q.options.length) err(id, `${tag} duplicate options`);
    if (!Number.isInteger(q.correctIndex) || q.correctIndex < 0 || q.correctIndex >= q.options.length) {
      err(id, `${tag} correctIndex ${q.correctIndex} out of range`);
    }
  });
}

const extra = Object.keys(LESSON_CONTENT_BANK).filter((id) => !ALL_MODULE_IDS.includes(id));
for (const id of extra) err(id, "not in curriculum");

const mcqAnswers = Object.values(LESSON_CONTENT_BANK)
  .flatMap((c) => c.quiz)
  .filter((q) => q.type === "mcq")
  .map((q) => q.correctIndex);
const dist = [0, 1, 2, 3].map((k) => mcqAnswers.filter((a) => a === k).length);

console.log(`Modules in bank: ${Object.keys(LESSON_CONTENT_BANK).length}`);
console.log(`MCQ answer-position spread (A/B/C/D): ${dist.join(" / ")}`);
if (errors.length) {
  console.error(`\n${errors.length} problem(s):\n${errors.join("\n")}`);
  process.exit(1);
}
console.log("All lesson content valid.");
