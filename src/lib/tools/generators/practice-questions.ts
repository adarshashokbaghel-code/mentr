/** Algorithmic practice question banks — clearly sample, not board-official. */

export type QType =
  | "mcq"
  | "fill"
  | "short"
  | "truefalse"
  | "long";

export type GeneratedQuestion = {
  id: string;
  type: QType;
  prompt: string;
  options?: string[];
  answer: string;
  marks: number;
  note?: string;
};

const SUBJECT_TEMPLATES: Record<
  string,
  { stems: string[]; facts: { q: string; a: string }[] }
> = {
  mathematics: {
    stems: [
      "Simplify the expression related to",
      "Find the value for a problem on",
      "Solve a word problem involving",
      "Calculate carefully for",
    ],
    facts: [
      { q: "What is 12 × 8?", a: "96" },
      { q: "What is the square of 15?", a: "225" },
      { q: "Convert 3/4 to a percentage.", a: "75%" },
      { q: "Find the LCM of 4 and 6.", a: "12" },
      { q: "What is 20% of 250?", a: "50" },
    ],
  },
  science: {
    stems: [
      "Explain briefly a concept about",
      "Identify the correct statement on",
      "Give one example related to",
      "State one property of",
    ],
    facts: [
      { q: "What gas do plants absorb during photosynthesis?", a: "Carbon dioxide" },
      { q: "Water boils at what temperature at sea level (°C)?", a: "100" },
      { q: "Which planet is known as the Red Planet?", a: "Mars" },
      { q: "What is the chemical formula of water?", a: "H2O" },
      { q: "Name the force that pulls objects toward Earth.", a: "Gravity" },
    ],
  },
  english: {
    stems: [
      "Write a short response about",
      "Choose the correct grammar option for",
      "Identify the figure of speech in a line on",
      "Complete the sentence related to",
    ],
    facts: [
      { q: "Synonym of 'happy'?", a: "Glad / joyful (any reasonable)" },
      { q: "Antonym of 'ancient'?", a: "Modern / recent" },
      { q: "Plural of 'child'?", a: "Children" },
      { q: "Past tense of 'go'?", a: "Went" },
      { q: "What is a noun?", a: "A naming word (person, place, thing, idea)" },
    ],
  },
  default: {
    stems: [
      "Answer briefly about",
      "Explain one key idea of",
      "Give an example related to",
      "State one important point on",
    ],
    facts: [
      { q: "Define the main idea of the topic in one sentence.", a: "Teacher-defined / topic-dependent" },
      { q: "List two key points from the chapter.", a: "Topic-dependent" },
      { q: "Why is this topic useful in daily life?", a: "Topic-dependent" },
      { q: "Name one common mistake students make here.", a: "Topic-dependent" },
      { q: "Write one practice tip for revision.", a: "Topic-dependent" },
    ],
  },
};

function pickSubject(subject: string) {
  const key = subject.trim().toLowerCase();
  if (key.includes("math")) return SUBJECT_TEMPLATES.mathematics!;
  if (key.includes("sci") || key.includes("physics") || key.includes("chem") || key.includes("bio"))
    return SUBJECT_TEMPLATES.science!;
  if (key.includes("eng") || key.includes("grammar")) return SUBJECT_TEMPLATES.english!;
  return SUBJECT_TEMPLATES.default!;
}

function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: number) {
  let s = seed || 1;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const MARKS: Record<QType, number> = {
  mcq: 1,
  fill: 1,
  truefalse: 1,
  short: 2,
  long: 5,
};

export function generatePracticeQuestions(opts: {
  classLevel: string;
  subject: string;
  topic: string;
  difficulty: string;
  count: number;
  types: QType[];
  seedExtra?: string;
}): GeneratedQuestion[] {
  const bank = pickSubject(opts.subject);
  const topic = opts.topic.trim() || "the chapter";
  const types = opts.types.length ? opts.types : (["mcq", "short"] as QType[]);
  const count = Math.max(1, Math.min(40, opts.count));
  const rand = rng(
    hashSeed(
      `${opts.classLevel}|${opts.subject}|${topic}|${opts.difficulty}|${opts.seedExtra ?? ""}`,
    ),
  );

  const out: GeneratedQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const type = types[i % types.length]!;
    const fact = bank.facts[Math.floor(rand() * bank.facts.length)]!;
    const stem = bank.stems[Math.floor(rand() * bank.stems.length)]!;
    const id = `q${i + 1}`;

    if (type === "mcq") {
      const correct = fact.a;
      const distractors = [
        "None of these",
        "All of these",
        "Cannot be determined",
        "Not applicable",
      ];
      const options = [correct, ...distractors.slice(0, 3)];
      // shuffle
      for (let j = options.length - 1; j > 0; j--) {
        const k = Math.floor(rand() * (j + 1));
        [options[j], options[k]] = [options[k]!, options[j]!];
      }
      const letter = String.fromCharCode(65 + options.indexOf(correct));
      out.push({
        id,
        type,
        prompt: `${fact.q} (Topic: ${topic})`,
        options: options.map((o, idx) => `${String.fromCharCode(65 + idx)}. ${o}`),
        answer: letter,
        marks: MARKS.mcq,
        note: "Sample practice item — not an official board question.",
      });
      continue;
    }

    if (type === "truefalse") {
      const truth = rand() > 0.4;
      out.push({
        id,
        type,
        prompt: `True or False: ${fact.q.replace(/\?$/, "")} — related to ${topic}.`,
        answer: truth ? "True (verify with textbook)" : "False (verify with textbook)",
        marks: MARKS.truefalse,
        note: "Sample practice item — verify against your textbook.",
      });
      continue;
    }

    if (type === "fill") {
      out.push({
        id,
        type,
        prompt: `Fill in the blank (${opts.difficulty}): _______ is an important idea in ${topic}. Hint: ${fact.q}`,
        answer: fact.a,
        marks: MARKS.fill,
      });
      continue;
    }

    if (type === "long") {
      out.push({
        id,
        type,
        prompt: `${stem} ${topic}. Write 6–8 lines for Class ${opts.classLevel}. Include one example.`,
        answer: `Model answer depends on textbook — cover definition, example, and one application of ${topic}.`,
        marks: MARKS.long,
      });
      continue;
    }

    out.push({
      id,
      type: "short",
      prompt: `${stem} ${topic}. (${opts.difficulty})`,
      answer: fact.a,
      marks: MARKS.short,
    });
  }
  return out;
}
