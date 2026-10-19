import type { PlacementQuestion } from "@/lib/python-lms/placement";
import { PLACEMENT_QUESTIONS } from "@/lib/python-lms/placement";

export type PlacementBankItem = PlacementQuestion & { topic: number };

/** Fixed pool for Path to Intermediate — seed to Mongo (`npm run seed:py-placement`). */
export const PLACEMENT_BANK_TARGET = 200;

export const PLACEMENT_SESSION_SIZE = 12;
export const PLACEMENT_TIME_SEC = 15 * 60;

let cached: PlacementBankItem[] | null = null;

export function resetPlacementBankCache() {
  cached = null;
}

function mcq(
  id: string,
  topic: number,
  prompt: string,
  options: string[],
  answer: number,
  explain: string,
  code?: string,
): PlacementBankItem {
  return { id, topic, type: "mcq", prompt, code, options, answer, explain };
}

function predict(
  id: string,
  topic: number,
  prompt: string,
  code: string,
  options: string[],
  answer: number,
  explain: string,
): PlacementBankItem {
  return { id, topic, type: "predict", prompt, code, options, answer, explain };
}

function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Fisher–Yates order for display (seed = question id). */
export function shuffledOptionOrder(optionCount: number, seed: string): number[] {
  const order = Array.from({ length: optionCount }, (_, i) => i);
  let h = hashSeed(seed);
  for (let i = order.length - 1; i > 0; i--) {
    h = (Math.imul(h, 1103515245) + 12345) >>> 0;
    const j = h % (i + 1);
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

function shuffleOptions(correct: string, wrongs: string[], seed = ""): { options: string[]; answer: number } {
  const uniqueWrongs: string[] = [];
  for (const w of wrongs) {
    if (w === correct || uniqueWrongs.includes(w)) continue;
    uniqueWrongs.push(w);
    if (uniqueWrongs.length >= 3) break;
  }
  const fallbacks = ["Error", "None", "Skip", "Unknown"];
  while (uniqueWrongs.length < 3) {
    const next = fallbacks.find((f) => f !== correct && !uniqueWrongs.includes(f)) ?? `Choice ${uniqueWrongs.length + 2}`;
    uniqueWrongs.push(next);
  }
  const options = [correct, ...uniqueWrongs.slice(0, 3)];
  const order = shuffledOptionOrder(4, seed || correct + uniqueWrongs.join("|"));
  const shuffled = order.map((i) => options[i]);
  return { options: shuffled, answer: shuffled.indexOf(correct) };
}

function buildGenerated(): PlacementBankItem[] {
  const out: PlacementBankItem[] = [];

  for (let n = 1; n <= 25; n++) {
    const id = `pip-${String(n + 12).padStart(3, "0")}`;
    const a = (n % 7) + 2;
    const b = (n % 5) + 1;
    const sum = a + b;
    const { options, answer } = shuffleOptions(String(sum), [String(a), String(b), String(a * b), "Error"], id);
    out.push(
      predict(
        id,
        2,
        "What is printed?",
        `x = ${a}\ny = ${b}\nprint(x + y)`,
        options,
        answer,
        `${a} + ${b} = ${sum}.`,
      ),
    );
  }

  for (let n = 1; n <= 25; n++) {
    const id = `pip-${String(n + 37).padStart(3, "0")}`;
    const stop = (n % 4) + 2;
    const count = stop;
    const { options, answer } = shuffleOptions(String(count), ["0", "1", String(count + 1), "Error"], id);
    out.push(
      predict(
        id,
        6,
        "How many lines print Hi?",
        `for i in range(${stop}):\n    print("Hi")`,
        options,
        answer,
        `range(${stop}) runs ${count} times.`,
      ),
    );
  }

  for (let n = 1; n <= 25; n++) {
    const id = `pip-${String(n + 62).padStart(3, "0")}`;
    const { options, answer } = shuffleOptions(`'b'`, ["'a'", "'c'", "Error", "None"], id);
    out.push(
      predict(
        id,
        8,
        "What is items[1]?",
        `items = ['a', 'b', 'c']\nprint(items[1])`,
        options,
        answer,
        "Index 1 is the middle item, 'b'.",
      ),
    );
  }

  for (let n = 1; n <= 25; n++) {
    const id = `pip-${String(n + 87).padStart(3, "0")}`;
    const k = (n % 5) + 3;
    const doubled = k * 2;
    const { options, answer } = shuffleOptions(String(doubled), [String(k), String(k + 1), "double(k)", "Error"], id);
    out.push(
      predict(
        id,
        9,
        "What prints?",
        `def double(n):\n    return n * 2\nprint(double(${k}))`,
        options,
        answer,
        `double(${k}) returns ${doubled}.`,
      ),
    );
  }

  for (let n = 1; n <= 25; n++) {
    const id = `pip-${String(n + 112).padStart(3, "0")}`;
    const word = ["code", "python", "mentr", "learn", "quiz"][n % 5];
    const upper = word.toUpperCase();
    const { options, answer } = shuffleOptions(upper, [word, word[0].toUpperCase() + word.slice(1), "Error", "None"], id);
    out.push(
      predict(
        id,
        7,
        "Output?",
        `s = "${word}"\nprint(s.upper())`,
        options,
        answer,
        ".upper() makes every letter uppercase.",
      ),
    );
  }

  for (let n = 1; n <= 25; n++) {
    const id = `pip-${String(n + 137).padStart(3, "0")}`;
    const age = (n % 8) + 10;
    const ok = age >= 13;
    const { options, answer } = shuffleOptions(ok ? "Teen" : "Child", ["Teen", "Child", "Error", "None"], id);
    out.push(
      predict(
        id,
        4,
        "What prints?",
        `age = ${age}\nif age >= 13:\n    print("Teen")\nelse:\n    print("Child")`,
        options,
        answer,
        age >= 13 ? "13 or older prints Teen." : "Under 13 prints Child.",
      ),
    );
  }

  for (let n = 1; n <= 38; n++) {
    const id = `pip-${String(n + 162).padStart(3, "0")}`;
    const prompts = [
      ["Which adds to a list?", ["nums.add(x)", "nums.append(x)", "nums.push(x)", "append(nums, x)"], 1, "Lists use .append().", 8],
      ["What does input() return?", ["int", "float", "str", "bool"], 2, "input() always returns a string.", 3],
      ["Best name for a reusable block of code?", ["variable", "function", "loop", "string"], 1, "Functions group reusable steps.", 9],
      ["Which is a valid variable name?", ["2score", "score-1", "score_1", "class"], 2, "Names can use letters, digits, underscore; not starting with a digit.", 2],
    ] as const;
    const row = prompts[n % prompts.length];
    const opts = [...row[1]];
    const correct = opts[row[2]];
    const wrongs = opts.filter((_, i) => i !== row[2]);
    const { options, answer } = shuffleOptions(correct, wrongs, id);
    out.push(mcq(id, row[4], row[0], options, answer, row[3]));
  }

  return out;
}

export function buildPlacementBank(): PlacementBankItem[] {
  if (cached) return cached;

  const base: PlacementBankItem[] = PLACEMENT_QUESTIONS.map((q, i) => ({
    ...q,
    topic: Math.min(9, 1 + (i % 9)),
    id: `pip-${String(i + 1).padStart(3, "0")}`,
  }));

  const generated = buildGenerated();
  const byId = new Map<string, PlacementBankItem>();
  for (const q of [...base, ...generated]) {
    if (!byId.has(q.id)) byId.set(q.id, q);
  }

  const all = [...byId.values()];
  if (all.length < PLACEMENT_BANK_TARGET) {
    let k = all.length;
    while (all.length < PLACEMENT_BANK_TARGET) {
      k += 1;
      const src = all[k % base.length];
      all.push({
        ...src,
        id: `pip-${String(k).padStart(3, "0")}`,
        prompt: `${src.prompt} (variant ${k})`,
      });
    }
  }

  cached = all.slice(0, PLACEMENT_BANK_TARGET);
  return cached;
}

export function pickPlacementSession(seenIds: string[], size = PLACEMENT_SESSION_SIZE): PlacementBankItem[] {
  const bank = buildPlacementBank();
  const seen = new Set(seenIds);
  const pool = bank.filter((q) => !seen.has(q.id));
  const source = pool.length >= size ? pool : bank;
  const picked: PlacementBankItem[] = [];
  const used = new Set<string>();
  let seed = (seenIds.length * 17 + size * 31) % 997;
  while (picked.length < size && picked.length < source.length) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    const q = source[seed % source.length];
    if (used.has(q.id)) continue;
    used.add(q.id);
    picked.push(q);
  }
  return picked;
}

export function scorePlacementSession(
  session: PlacementQuestion[],
  answers: Record<string, number>,
  passRatio: number,
): { score: number; total: number; passed: boolean; byId: Record<string, boolean> } {
  let score = 0;
  const byId: Record<string, boolean> = {};
  for (const q of session) {
    const ok = answers[q.id] === q.answer;
    byId[q.id] = ok;
    if (ok) score += 1;
  }
  const total = session.length;
  return { score, total, passed: total > 0 && score / total >= passRatio, byId };
}

/** Public shape — never send `answer` to the client. */
export function toPublicPlacementQuestion(q: PlacementBankItem) {
  return {
    id: q.id,
    type: q.type,
    prompt: q.prompt,
    code: q.code,
    options: q.options,
  };
}
