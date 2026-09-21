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
  // NCERT chem/bio PDFs often OCR as "Exercises Exercises Exercises…" on one line
  const re =
    /\n[ \t]*((?:ADDITIONAL|OPTIONAL)[ \t]+)?(?:EXERCISES?[ \t]*)+(?:\([^)]*\))?[ \t]*\n/gi;
  const found = [];
  let m;
  while ((m = re.exec(body))) {
    const after = body.slice(m.index + m[0].length, m.index + m[0].length + 80);
    if (
      !m[1] &&
      /^(Additional exercises|Appendix|Reprint|Answers|ANSWERS)\b/i.test(after.trim())
    ) {
      continue;
    }
    found.push({
      index: m.index,
      optional: Boolean(m[1]),
      label: m[0],
    });
  }
  if (!found.length) return [];

  const threshold = Math.floor(body.length * 0.35);
  let sections = found.filter((s) => s.index >= threshold);
  if (!sections.length) sections = [found[found.length - 1]];

  return sections.map((sec, i) => {
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

function splitQuestions(chunk) {
  chunk = normalizeSpacedNumbers(chunk);
  const re = /(?:^|\n)\s*(\d{1,2}\.\d{1,2})\s+/g;
  const matches = [...chunk.matchAll(re)];
  if (matches.length < 1) return [];

  const out = [];
  for (let i = 0; i < matches.length; i++) {
    const full = matches[i][1];
    const start = matches[i].index + matches[i][0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index : chunk.length;
    let text = cleanText(chunk.slice(start, end));
    text = text
      .replace(/\n?Reprint\s+\d{4}-\d{2}\s*$/gi, "")
      .replace(/\n?\d{1,3}\s*$/g, "")
      .replace(/\n{2,}/g, "\n")
      .trim();
    if (text.length < 15) continue;
    if (/^Note for the (student|teacher)/i.test(text)) continue;
    if (/^Note\s*:/i.test(text) && text.length < 80) continue;
    if (/^The exercises given here/i.test(text) && text.length < 200) continue;
    if (/^(Answers|Appendix|SUMMARY|Summary)\b/i.test(text)) continue;
    out.push({ full, n: full, text });
  }
  return out;
}

function parseExercises(raw, chapterNumber) {
  const text = cleanText(raw);
  const lastEx = Math.max(
    text.lastIndexOf("\nEXERCISES"),
    text.lastIndexOf("\nExercises"),
    text.lastIndexOf("\nADDITIONAL EXERCISES"),
    text.lastIndexOf("\nAdditional Exercises"),
  );
  let body = text;
  if (lastEx > 0) {
    const tail = text.slice(lastEx);
    const cutRel = tail.search(
      /\n\s*(ANSWERS|Answers|Appendix|SUMMARY|Summary|Answers to Some)\b/,
    );
    if (cutRel > 0) body = text.slice(0, lastEx + cutRel);
  }

  const blocks = findExerciseBlocks(body);
  if (!blocks.length) return [];

  const exercises = [];
  for (const block of blocks) {
    let qs = splitQuestions(block.chunk);
    const matched = qs.filter((q) => q.full.startsWith(`${chapterNumber}.`));
    if (matched.length >= 2) qs = matched;
    else if (matched.length === 1 && qs.length === 1) qs = matched;

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
    const exercises = parseExercises(text, ch.n);
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
