/**
 * Download + extract Class 11–12 Chemistry & Biology NCERT exercises.
 * Usage: node scripts/extract-ncert-chem-bio.mjs [--refresh] [--chem] [--bio]
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const CLASS11_CHEM = [
  { n: 1, name: "Some Basic Concepts of Chemistry", file: "kech101.pdf", archive: "ncert-kech1" },
  { n: 2, name: "Structure of Atom", file: "kech102.pdf", archive: "ncert-kech1" },
  { n: 3, name: "Classification of Elements and Periodicity in Properties", file: "kech103.pdf", archive: "ncert-kech1" },
  { n: 4, name: "Chemical Bonding and Molecular Structure", file: "kech104.pdf", archive: "ncert-kech1" },
  { n: 5, name: "States of Matter", file: "kech105.pdf", archive: "ncert-kech1" },
  { n: 6, name: "Thermodynamics", file: "kech106.pdf", archive: "ncert-kech1" },
  { n: 7, name: "Equilibrium", file: "kech107.pdf", archive: "ncert-kech1" },
  { n: 8, name: "Redox Reactions", file: "kech201.pdf", archive: "ncert-kech2" },
  { n: 9, name: "Hydrogen", file: "kech202.pdf", archive: "ncert-kech2" },
  { n: 10, name: "The s-Block Elements", file: "kech203.pdf", archive: "ncert-kech2" },
  { n: 11, name: "The p-Block Elements", file: "kech204.pdf", archive: "ncert-kech2" },
  { n: 12, name: "Organic Chemistry – Some Basic Principles and Techniques", file: "kech205.pdf", archive: "ncert-kech2" },
  { n: 13, name: "Hydrocarbons", file: "kech206.pdf", archive: "ncert-kech2" },
  { n: 14, name: "Environmental Chemistry", file: "kech207.pdf", archive: "ncert-kech2" },
];

const CLASS12_CHEM = [
  { n: 1, name: "The Solid State", file: "lech101.pdf", archive: "ncert-lech1" },
  { n: 2, name: "Solutions", file: "lech102.pdf", archive: "ncert-lech1" },
  { n: 3, name: "Electrochemistry", file: "lech103.pdf", archive: "ncert-lech1" },
  { n: 4, name: "Chemical Kinetics", file: "lech104.pdf", archive: "ncert-lech1" },
  { n: 5, name: "Surface Chemistry", file: "lech105.pdf", archive: "ncert-lech1" },
  { n: 6, name: "General Principles and Processes of Isolation of Elements", file: "lech106.pdf", archive: "ncert-lech1" },
  { n: 7, name: "The p-Block Elements", file: "lech107.pdf", archive: "ncert-lech1" },
  { n: 8, name: "The d- and f-Block Elements", file: "lech108.pdf", archive: "ncert-lech1" },
  { n: 9, name: "Coordination Compounds", file: "lech109.pdf", archive: "ncert-lech1" },
  { n: 10, name: "Haloalkanes and Haloarenes", file: "lech201.pdf", archive: "ncert-lech2" },
  { n: 11, name: "Alcohols, Phenols and Ethers", file: "lech202.pdf", archive: "ncert-lech2" },
  { n: 12, name: "Aldehydes, Ketones and Carboxylic Acids", file: "lech203.pdf", archive: "ncert-lech2" },
  { n: 13, name: "Amines", file: "lech204.pdf", archive: "ncert-lech2" },
  { n: 14, name: "Biomolecules", file: "lech205.pdf", archive: "ncert-lech2" },
  { n: 15, name: "Polymers", file: "lech206.pdf", archive: "ncert-lech2" },
  { n: 16, name: "Chemistry in Everyday Life", file: "lech207.pdf", archive: "ncert-lech2" },
];

const CLASS11_BIO = [
  { n: 1, name: "The Living World", file: "kebo101.pdf", archive: "ncert-kebo1" },
  { n: 2, name: "Biological Classification", file: "kebo102.pdf", archive: "ncert-kebo1" },
  { n: 3, name: "Plant Kingdom", file: "kebo103.pdf", archive: "ncert-kebo1" },
  { n: 4, name: "Animal Kingdom", file: "kebo104.pdf", archive: "ncert-kebo1" },
  { n: 5, name: "Morphology of Flowering Plants", file: "kebo105.pdf", archive: "ncert-kebo1" },
  { n: 6, name: "Anatomy of Flowering Plants", file: "kebo106.pdf", archive: "ncert-kebo1" },
  { n: 7, name: "Structural Organisation in Animals", file: "kebo107.pdf", archive: "ncert-kebo1" },
  { n: 8, name: "Cell: The Unit of Life", file: "kebo108.pdf", archive: "ncert-kebo1" },
  { n: 9, name: "Biomolecules", file: "kebo109.pdf", archive: "ncert-kebo1" },
  { n: 10, name: "Cell Cycle and Cell Division", file: "kebo110.pdf", archive: "ncert-kebo1" },
  { n: 11, name: "Transport in Plants", file: "kebo111.pdf", archive: "ncert-kebo1" },
  { n: 12, name: "Mineral Nutrition", file: "kebo112.pdf", archive: "ncert-kebo1" },
  { n: 13, name: "Photosynthesis in Higher Plants", file: "kebo113.pdf", archive: "ncert-kebo1" },
  { n: 14, name: "Respiration in Plants", file: "kebo114.pdf", archive: "ncert-kebo1" },
  { n: 15, name: "Plant Growth and Development", file: "kebo115.pdf", archive: "ncert-kebo1" },
  { n: 16, name: "Digestion and Absorption", file: "kebo116.pdf", archive: "ncert-kebo1" },
  { n: 17, name: "Breathing and Exchange of Gases", file: "kebo117.pdf", archive: "ncert-kebo1" },
  { n: 18, name: "Body Fluids and Circulation", file: "kebo118.pdf", archive: "ncert-kebo1" },
  { n: 19, name: "Excretory Products and their Elimination", file: "kebo119.pdf", archive: "ncert-kebo1" },
  { n: 20, name: "Locomotion and Movement", file: "kebo120.pdf", archive: "ncert-kebo1" },
  { n: 21, name: "Neural Control and Coordination", file: "kebo121.pdf", archive: "ncert-kebo1" },
  { n: 22, name: "Chemical Coordination and Integration", file: "kebo122.pdf", archive: "ncert-kebo1" },
];

const CLASS12_BIO = [
  { n: 1, name: "Reproduction in Organisms", file: "lebo101.pdf", archive: "ncert-lebo1" },
  { n: 2, name: "Sexual Reproduction in Flowering Plants", file: "lebo102.pdf", archive: "ncert-lebo1" },
  { n: 3, name: "Human Reproduction", file: "lebo103.pdf", archive: "ncert-lebo1" },
  { n: 4, name: "Reproductive Health", file: "lebo104.pdf", archive: "ncert-lebo1" },
  { n: 5, name: "Principles of Inheritance and Variation", file: "lebo105.pdf", archive: "ncert-lebo1" },
  { n: 6, name: "Molecular Basis of Inheritance", file: "lebo106.pdf", archive: "ncert-lebo1" },
  { n: 7, name: "Evolution", file: "lebo107.pdf", archive: "ncert-lebo1" },
  { n: 8, name: "Human Health and Disease", file: "lebo108.pdf", archive: "ncert-lebo1" },
  { n: 9, name: "Strategies for Enhancement in Food Production", file: "lebo109.pdf", archive: "ncert-lebo1" },
  { n: 10, name: "Microbes in Human Welfare", file: "lebo110.pdf", archive: "ncert-lebo1" },
  { n: 11, name: "Biotechnology: Principles and Processes", file: "lebo111.pdf", archive: "ncert-lebo1" },
  { n: 12, name: "Biotechnology and its Applications", file: "lebo112.pdf", archive: "ncert-lebo1" },
  { n: 13, name: "Organisms and Populations", file: "lebo113.pdf", archive: "ncert-lebo1" },
  { n: 14, name: "Ecosystem", file: "lebo114.pdf", archive: "ncert-lebo1" },
  { n: 15, name: "Biodiversity and Conservation", file: "lebo115.pdf", archive: "ncert-lebo1" },
  { n: 16, name: "Environmental Issues", file: "lebo116.pdf", archive: "ncert-lebo1" },
];

async function fetchPdf(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      Accept: "application/pdf,*/*",
    },
    redirect: "follow",
  });
  if (!res.ok) return null;
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 8000 || buf.subarray(0, 4).toString() !== "%PDF") return null;
  return buf;
}

async function ensurePdf(dir, ch) {
  fs.mkdirSync(dir, { recursive: true });
  const dest = path.join(dir, ch.file);
  if (fs.existsSync(dest) && fs.statSync(dest).size > 8000) {
    console.log("  have", ch.file);
    return dest;
  }
  const urls = [
    `https://archive.org/download/${ch.archive}/${ch.file}`,
    `https://ncert.nic.in/textbook/pdf/${ch.file}`,
  ];
  for (const url of urls) {
    process.stdout.write(`  fetch ${url} … `);
    try {
      const buf = await fetchPdf(url);
      if (!buf) {
        console.log("fail");
        continue;
      }
      fs.writeFileSync(dest, buf);
      console.log(`${(buf.length / 1024).toFixed(0)} KB`);
      return dest;
    } catch (e) {
      console.log("err", e.message);
    }
  }
  if (fs.existsSync(dest) && fs.statSync(dest).size > 8000) return dest;
  throw new Error(`Could not download ${ch.file}`);
}

async function pdfToText(filePath) {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const data = new Uint8Array(fs.readFileSync(filePath));
  const doc = await pdfjs.getDocument({
    data,
    useSystemFonts: true,
    isEvalSupported: false,
  }).promise;
  const parts = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    let line = "";
    let lastY = null;
    for (const item of content.items) {
      if (!("str" in item) || !item.str) continue;
      const y = item.transform?.[5];
      if (lastY != null && Math.abs(y - lastY) > 2.5) {
        parts.push(line);
        line = "";
      }
      line +=
        (line && !line.endsWith(" ") && !item.str.startsWith(" ") ? " " : "") +
        item.str;
      lastY = y;
    }
    if (line) parts.push(line);
    parts.push("");
  }
  return parts.join("\n");
}

function cleanText(s) {
  return s
    .replace(/\u00ad/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function guessMarks(text) {
  const t = text.toLowerCase();
  const parts = (t.match(/\([a-e]\)|\([ivx]+\)/g) || []).length;
  if (parts >= 4) return 4;
  if (parts === 3) return 3;
  if (parts === 2) return 2;
  if (/derive|prove|explain|discuss|describe|show that|obtain|differentiate|distinguish/i.test(t))
    return 3;
  if (/calculate|find|determine|estimate|compute|balance/i.test(t)) return 2;
  if (text.length > 280) return 3;
  if (text.length > 140) return 2;
  return 2;
}

function findExerciseBlocks(body) {
  // Chem: "Exercises" / "Exercises Exercises…"
  // Bio: OCR often spaces letters — "E XERCISES"
  const re =
    /\n[ \t]*((?:ADDITIONAL|OPTIONAL)[ \t]+)?(?:(?:E\s*X\s*E\s*R\s*C\s*I\s*S\s*E\s*S)|(?:EXERCISES?))(?:[ \t]+(?:(?:E\s*X\s*E\s*R\s*C\s*I\s*S\s*E\s*S)|(?:EXERCISES?)))*[ \t]*(?:\([^)]*\))?[ \t]*\n/gi;
  const found = [];
  let m;
  while ((m = re.exec(body))) {
    const after = body.slice(m.index + m[0].length, m.index + m[0].length + 200);
    const afterClean = after
      .replace(/^\s*2020-21\s*/i, "")
      .replace(/^\s*\d{1,3}\s+[A-Za-z].{0,40}\n/m, "")
      .trim();
    if (
      !m[1] &&
      /^(Additional exercises|Appendix|Reprint|Answers|ANSWERS|S\s*U\s*M\s*M\s*A\s*R\s*Y)/i.test(
        afterClean,
      )
    ) {
      // Header may sit AFTER the questions (chem OCR) — still record for fallback anchor
      found.push({
        index: m.index,
        optional: Boolean(m[1]),
        label: m[0],
        emptyAfter: true,
      });
      continue;
    }
    found.push({
      index: m.index,
      optional: Boolean(m[1]),
      label: m[0],
      emptyAfter: false,
    });
  }
  if (!found.length) return [];

  const threshold = Math.floor(body.length * 0.3);
  let sections = found.filter((s) => s.index >= threshold);
  if (!sections.length) sections = [found[found.length - 1]];

  return sections.map((sec, i) => {
    if (sec.emptyAfter) {
      const lookBack = Math.max(0, sec.index - 18_000);
      return {
        ...sec,
        chunk: body.slice(lookBack, sec.index),
        fromLookback: true,
      };
    }
    const start = sec.index + sec.label.length;
    const end = i + 1 < sections.length ? sections[i + 1].index : body.length;
    return { ...sec, chunk: body.slice(start, end) };
  });
}

function normalizeSpacedNumbers(chunk) {
  return chunk
    .replace(
      /(?:^|\n)\s*(\d)\s+(\d)\s*\.\s*(\d{1,2})\s+/g,
      (_, a, b, c) => `\n${a}${b}.${c} `,
    )
    .replace(
      /(?:^|\n)\s*(\d)\s+(\d)\.(\d{1,2})\s+/g,
      (_, a, b, c) => `\n${a}${b}.${c} `,
    );
}

function cleanQuestionText(text) {
  return cleanText(text)
    .replace(/\n?Reprint\s+\d{4}-\d{2}\s*$/gi, "")
    .replace(/\n?\d{1,3}\s*$/g, "")
    .replace(/\n{2,}/g, "\n")
    .replace(/\n?2020-21\s*$/gi, "")
    .trim();
}

function isJunkQuestion(text) {
  if (text.length < 12) return true;
  if (/^Note for the (student|teacher)/i.test(text)) return true;
  if (/^Note\s*:/i.test(text) && text.length < 80) return true;
  if (/^The exercises given here/i.test(text) && text.length < 200) return true;
  if (/^(Answers|Appendix|SUMMARY|Summary|S\s*U\s*M\s*M\s*A\s*R\s*Y)\b/i.test(text))
    return true;
  // Section headings OCR'd as "8.1 W HAT IS A C ELL"
  if (/^[A-Z](?:\s+[A-Z]){3,}\b/.test(text) && text.length < 60) return true;
  return false;
}

/** Chemistry-style 3.1 / Biology-style 1. 2. 3. */
function splitQuestions(chunk, { simple = false } = {}) {
  chunk = normalizeSpacedNumbers(chunk);
  const re = simple
    ? /(?:^|\n)\s*(\d{1,2})\.\s+(?=[A-Za-z(“"'])/g
    : /(?:^|\n)\s*(\d{1,2}\.\d{1,2})\s+/g;
  const matches = [...chunk.matchAll(re)];
  if (matches.length < 1) return [];

  const out = [];
  for (let i = 0; i < matches.length; i++) {
    const full = matches[i][1];
    const start = matches[i].index + matches[i][0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index : chunk.length;
    const text = cleanQuestionText(chunk.slice(start, end));
    if (isJunkQuestion(text)) continue;
    out.push({ full, n: full, text });
  }
  return out;
}

function fallbackBeforeAnswers(body, chapterNumber) {
  const ans = body.search(
    /\n\s*(Answers to Some Intext Questions|ANSWERS|Answers)\b/,
  );
  const region = ans > 0 ? body.slice(0, ans) : body;
  const start = Math.floor(region.length * 0.65);
  let qs = splitQuestions(region.slice(start));
  qs = qs.filter((q) => q.full.startsWith(`${chapterNumber}.`));
  // Keep the last contiguous run (exercise sets restart numbering)
  if (qs.length < 3) return [];
  const byNum = new Map();
  for (const q of qs) byNum.set(q.full, q);
  return [...byNum.values()].sort((a, b) => {
    const [a1, a2] = a.full.split(".").map(Number);
    const [b1, b2] = b.full.split(".").map(Number);
    return a1 - b1 || a2 - b2;
  });
}

function parseExercises(raw, chapterNumber, { subject } = {}) {
  const text = cleanText(raw);
  // Normalise spaced bio header early so lastIndexOf works
  const normalised = text.replace(
    /\n[ \t]*E\s+X\s+E\s+R\s+C\s+I\s+S\s+E\s+S[ \t]*\n/gi,
    "\nEXERCISES\n",
  );

  const lastEx = Math.max(
    normalised.lastIndexOf("\nEXERCISES"),
    normalised.lastIndexOf("\nExercises"),
    normalised.lastIndexOf("\nADDITIONAL EXERCISES"),
    normalised.lastIndexOf("\nAdditional Exercises"),
  );
  let body = normalised;
  if (lastEx > 0) {
    const tail = normalised.slice(lastEx);
    const cutRel = tail.search(
      /\n\s*(ANSWERS|Answers|Appendix|SUMMARY|Summary|Answers to Some|S\s*U\s*M\s*M\s*A\s*R\s*Y)\b/,
    );
    // Don't cut the body before Exercises when Answers is the next line —
    // lookback path needs the questions above the header.
    if (cutRel > 80) body = normalised.slice(0, lastEx + cutRel);
  }

  const isBio = subject === "Biology";
  const blocks = findExerciseBlocks(body);
  const exercises = [];

  for (const block of blocks) {
    let chunk = block.chunk;
    if (block.fromLookback && !isBio) {
      // Start at the last "N.1 " before the misplaced Exercises header
      const marker = `\n${chapterNumber}.1 `;
      const idx = chunk.lastIndexOf(marker);
      if (idx >= 0) chunk = chunk.slice(idx);
    }

    let qs = isBio
      ? splitQuestions(chunk, { simple: true })
      : splitQuestions(chunk);

    if (!isBio) {
      const matched = qs.filter((q) => q.full.startsWith(`${chapterNumber}.`));
      if (matched.length >= 2) qs = matched;
      else if (matched.length === 1 && qs.length === 1) qs = matched;
    } else {
      // Biology: keep ascending 1..N, drop TOC noise (single-digit runs in mid-book)
      qs = qs.filter((q) => {
        const n = Number(q.n);
        return n >= 1 && n <= 40;
      });
      // Prefer run starting at 1
      const startAt1 = qs.findIndex((q) => q.n === "1" || q.n === "1.1");
      if (startAt1 > 0) qs = qs.slice(startAt1);
    }

    if (!qs.length) continue;

    const exLabel = block.optional
      ? `${chapterNumber}.E-optional`
      : `${chapterNumber}.E`;

    exercises.push({
      exercise: exLabel,
      questions: qs.map((q, idx) => ({
        n: String(idx + 1),
        marks: guessMarks(q.text),
        text: q.text,
      })),
    });
  }

  if (!exercises.length && !isBio) {
    const qs = fallbackBeforeAnswers(body, chapterNumber);
    if (qs.length) {
      exercises.push({
        exercise: `${chapterNumber}.E`,
        questions: qs.map((q, idx) => ({
          n: String(idx + 1),
          marks: guessMarks(q.text),
          text: q.text,
        })),
      });
    }
  }

  // Biology: if header missed, take last simple-numbered block in final 20%
  if (!exercises.length && isBio) {
    const start = Math.floor(body.length * 0.75);
    let qs = splitQuestions(body.slice(start), { simple: true }).filter((q) => {
      const n = Number(q.n);
      return n >= 1 && n <= 40;
    });
    const startAt1 = qs.findIndex((q) => q.n === "1");
    if (startAt1 >= 0) qs = qs.slice(startAt1);
    if (qs.length >= 3) {
      exercises.push({
        exercise: `${chapterNumber}.E`,
        questions: qs.map((q, idx) => ({
          n: String(idx + 1),
          marks: guessMarks(q.text),
          text: q.text,
        })),
      });
    }
  }

  const merged = new Map();
  for (const ex of exercises) {
    const prev = merged.get(ex.exercise);
    if (prev) prev.questions.push(...ex.questions);
    else merged.set(ex.exercise, { ...ex, questions: [...ex.questions] });
  }
  return [...merged.values()].filter((e) => e.questions.length > 0);
}


function toTsLiteral(value, indent = 0) {
  const pad = "  ".repeat(indent);
  if (typeof value === "string") {
    const esc = value
      .replace(/\\/g, "\\\\")
      .replace(/`/g, "\\`")
      .replace(/\$\{/g, "\\${");
    if (value.includes("\n") || value.length > 80) return `\`${esc}\``;
    return JSON.stringify(value);
  }
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) {
    if (!value.length) return "[]";
    return `[\n${value
      .map((v) => `${pad}  ${toTsLiteral(v, indent + 1)}`)
      .join(",\n")}\n${pad}]`;
  }
  if (value && typeof value === "object") {
    return `{\n${Object.keys(value)
      .map((k) => `${pad}  ${k}: ${toTsLiteral(value[k], indent + 1)}`)
      .join(",\n")}\n${pad}}`;
  }
  return "null";
}

function writeExtracted(classLevel, subject, chapters) {
  const slug = subject.toLowerCase();
  const varName = `CLASS${classLevel}_${subject.toUpperCase()}_EXTRACTED`;
  const file = `snap-grade-class${classLevel}-${slug}-extracted.ts`;
  const body = chapters.map((ch) => ({
    classLevel,
    subject,
    chapterNumber: ch.n,
    chapterName: ch.name,
    exercises: ch.exercises,
  }));
  const out = `/** Auto-extracted NCERT Class ${classLevel} ${subject} from hosted chapter PDFs. */
import type { RawChapter } from "./snap-grade-seed-helpers";

export const ${varName}: RawChapter[] = ${toTsLiteral(body)};
`;
  fs.writeFileSync(path.join(ROOT, "server/data", file), out);
  const qCount = body.reduce(
    (a, c) => a + c.exercises.reduce((b, e) => b + e.questions.length, 0),
    0,
  );
  console.log(`Wrote ${file} — ${body.length} chapters, ${qCount} questions`);
  return qCount;
}

async function processClass(classLevel, subject, list, { refreshText = false } = {}) {
  const dir = path.join(ROOT, "public/ncert", `class${classLevel}-${subject.toLowerCase()}`);
  console.log(`\n=== Class ${classLevel} ${subject} ===`);
  const extracted = [];
  for (const ch of list) {
    console.log(`Ch ${ch.n} ${ch.name}`);
    const pdf = await ensurePdf(dir, ch);
    const textPath = path.join(dir, ch.file.replace(/\.pdf$/i, ".txt"));
    let text;
    if (!refreshText && fs.existsSync(textPath) && fs.statSync(textPath).size > 500) {
      text = fs.readFileSync(textPath, "utf8");
      console.log("  text cache");
    } else {
      text = await pdfToText(pdf);
      fs.writeFileSync(textPath, text);
    }
    const exercises = parseExercises(text, ch.n, { subject });
    const qn = exercises.reduce((a, e) => a + e.questions.length, 0);
    console.log(`  → ${exercises.length} set(s), ${qn} questions`);
    extracted.push({ ...ch, exercises });
  }
  return writeExtracted(classLevel, subject, extracted);
}

async function main() {
  const refresh = process.argv.includes("--refresh");
  const onlyChem = process.argv.includes("--chem");
  const onlyBio = process.argv.includes("--bio");
  const doChem = !onlyBio || onlyChem;
  const doBio = !onlyChem || onlyBio;
  // default: both unless one flag alone
  const runChem = onlyChem || (!onlyChem && !onlyBio) || (onlyChem && onlyBio);
  const runBio = onlyBio || (!onlyChem && !onlyBio) || (onlyChem && onlyBio);

  let total = 0;
  if (runChem && doChem) {
    total += await processClass(11, "Chemistry", CLASS11_CHEM, { refreshText: refresh });
    total += await processClass(12, "Chemistry", CLASS12_CHEM, { refreshText: refresh });
  }
  if (runBio && doBio) {
    total += await processClass(11, "Biology", CLASS11_BIO, { refreshText: refresh });
    total += await processClass(12, "Biology", CLASS12_BIO, { refreshText: refresh });
  }
  console.log(`\nDone. ${total} Chemistry/Biology questions extracted.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
