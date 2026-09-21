/**
 * Re-extract Physics questions from already-downloaded PDFs (and refresh Class 11 from ncert.nic.in).
 * Usage: node scripts/extract-ncert-physics.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const CLASS11 = [
  { n: 1, name: "Units and Measurement", file: "keph101.pdf", archive: "ncert-keph1" },
  { n: 2, name: "Motion in a Straight Line", file: "keph102.pdf", archive: "ncert-keph1" },
  { n: 3, name: "Motion in a Plane", file: "keph103.pdf", archive: "ncert-keph1" },
  { n: 4, name: "Laws of Motion", file: "keph104.pdf", archive: "ncert-keph1" },
  { n: 5, name: "Work, Energy and Power", file: "keph105.pdf", archive: "ncert-keph1" },
  { n: 6, name: "System of Particles and Rotational Motion", file: "keph106.pdf", archive: "ncert-keph1" },
  { n: 7, name: "Gravitation", file: "keph107.pdf", archive: "ncert-keph1" },
  { n: 8, name: "Mechanical Properties of Solids", file: "keph201.pdf", archive: "ncert-keph2" },
  { n: 9, name: "Mechanical Properties of Fluids", file: "keph202.pdf", archive: "ncert-keph2" },
  { n: 10, name: "Thermal Properties of Matter", file: "keph203.pdf", archive: "ncert-keph2" },
  { n: 11, name: "Thermodynamics", file: "keph204.pdf", archive: "ncert-keph2" },
  { n: 12, name: "Kinetic Theory", file: "keph205.pdf", archive: "ncert-keph2" },
  { n: 13, name: "Oscillations", file: "keph206.pdf", archive: "ncert-keph2" },
  { n: 14, name: "Waves", file: "keph207.pdf", archive: "ncert-keph2" },
];

const CLASS12 = [
  { n: 1, name: "Electric Charges and Fields", file: "leph101.pdf", archive: "ncert-leph1" },
  { n: 2, name: "Electrostatic Potential and Capacitance", file: "leph102.pdf", archive: "ncert-leph1" },
  { n: 3, name: "Current Electricity", file: "leph103.pdf", archive: "ncert-leph1" },
  { n: 4, name: "Moving Charges and Magnetism", file: "leph104.pdf", archive: "ncert-leph1" },
  { n: 5, name: "Magnetism and Matter", file: "leph105.pdf", archive: "ncert-leph1" },
  { n: 6, name: "Electromagnetic Induction", file: "leph106.pdf", archive: "ncert-leph1" },
  { n: 7, name: "Alternating Current", file: "leph107.pdf", archive: "ncert-leph1" },
  { n: 8, name: "Electromagnetic Waves", file: "leph108.pdf", archive: "ncert-leph1" },
  { n: 9, name: "Ray Optics and Optical Instruments", file: "leph201.pdf", archive: "ncert-leph2" },
  { n: 10, name: "Wave Optics", file: "leph202.pdf", archive: "ncert-leph2" },
  { n: 11, name: "Dual Nature of Radiation and Matter", file: "leph203.pdf", archive: "ncert-leph2" },
  { n: 12, name: "Atoms", file: "leph204.pdf", archive: "ncert-leph2" },
  { n: 13, name: "Nuclei", file: "leph205.pdf", archive: "ncert-leph2" },
  {
    n: 14,
    name: "Semiconductor Electronics: Materials, Devices and Simple Circuits",
    file: "leph206.pdf",
    archive: "ncert-leph2",
  },
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

async function ensurePdf(dir, ch, { forceNicIn = false } = {}) {
  fs.mkdirSync(dir, { recursive: true });
  const dest = path.join(dir, ch.file);
  const urls = [
    `https://ncert.nic.in/textbook/pdf/${ch.file}`,
    `https://archive.org/download/${ch.archive}/${ch.file}`,
  ];
  if (!forceNicIn && fs.existsSync(dest) && fs.statSync(dest).size > 8000) {
    console.log("  have", ch.file);
    return dest;
  }
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
  if (/derive|prove|explain|discuss|describe|show that|obtain/.test(t)) return 3;
  if (/calculate|find|determine|estimate|compute/.test(t)) return 2;
  if (text.length > 280) return 3;
  if (text.length > 140) return 2;
  return 2;
}

function findExerciseBlocks(body) {
  // Match full-line exercise headers only (avoid TOC noise)
  const re =
    /\n[ \t]*((?:ADDITIONAL|OPTIONAL)[ \t]+)?EXERCISES?[ \t]*(?:\([^)]*\))?[ \t]*\n/gi;
  const found = [];
  let m;
  while ((m = re.exec(body))) {
    const after = body.slice(m.index + m[0].length, m.index + m[0].length + 80);
    // TOC: "Exercises\nAdditional exercises\nAppendix"
    if (
      !m[1] &&
      /^(Additional exercises|Appendix|Reprint)\b/i.test(after.trim())
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

  const threshold = Math.floor(body.length * 0.4);
  let sections = found.filter((s) => s.index >= threshold);
  if (!sections.length) sections = [found[found.length - 1]];

  return sections.map((sec, i) => {
    const start = sec.index + sec.label.length;
    const end = i + 1 < sections.length ? sections[i + 1].index : body.length;
    return { ...sec, chunk: body.slice(start, end) };
  });
}

function normalizeSpacedNumbers(chunk) {
  // Fix OCR like "1 2 . 3" or "1 2. 3" → "12.3"
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
  // Match "2.1 ", "9.26 ", etc. at line starts
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
    if (text.length < 20) continue;
    if (/^Note for the (student|teacher)/i.test(text)) continue;
    if (/^Note\s*:/i.test(text) && text.length < 80) continue;
    if (/^The exercises given here/i.test(text) && text.length < 200) continue;
    out.push({ full, n: full, text });
  }
  return out;
}

function parseExercises(raw, chapterNumber) {
  const text = cleanText(raw);
  // Only trim trailing Answers/Appendix AFTER the last Exercises header
  const lastEx = Math.max(
    text.lastIndexOf("\nEXERCISES"),
    text.lastIndexOf("\nExercises"),
    text.lastIndexOf("\nADDITIONAL EXERCISES"),
    text.lastIndexOf("\nAdditional Exercises"),
  );
  let body = text;
  if (lastEx > 0) {
    const tail = text.slice(lastEx);
    const cutRel = tail.search(/\n\s*(ANSWERS|Answers)\b/);
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

function writeExtracted(classLevel, chapters) {
  const varName =
    classLevel === 11 ? "CLASS11_PHYSICS_EXTRACTED" : "CLASS12_PHYSICS_EXTRACTED";
  const file =
    classLevel === 11
      ? "snap-grade-class11-physics-extracted.ts"
      : "snap-grade-class12-physics-extracted.ts";
  const body = chapters.map((ch) => ({
    classLevel,
    subject: "Physics",
    chapterNumber: ch.n,
    chapterName: ch.name,
    exercises: ch.exercises,
  }));
  const out = `/** Auto-extracted NCERT Class ${classLevel} Physics from hosted chapter PDFs. */
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

async function processClass(classLevel, list, { forceNicIn = false, refreshText = false } = {}) {
  const dir = path.join(ROOT, "public/ncert", `class${classLevel}-physics`);
  console.log(`\n=== Class ${classLevel} Physics ===`);
  const extracted = [];
  for (const ch of list) {
    console.log(`Ch ${ch.n} ${ch.name}`);
    const pdf = await ensurePdf(dir, ch, { forceNicIn });
    const textPath = path.join(dir, ch.file.replace(/\.pdf$/i, ".txt"));
    let text;
    if (
      !forceNicIn &&
      !refreshText &&
      fs.existsSync(textPath) &&
      fs.statSync(textPath).size > 500
    ) {
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
  return writeExtracted(classLevel, extracted);
}

async function main() {
  const refreshOnly = process.argv.includes("--refresh");
  let total = 0;
  total += await processClass(11, CLASS11, {
    forceNicIn: !refreshOnly,
    refreshText: refreshOnly || true,
  });
  total += await processClass(12, CLASS12, {
    forceNicIn: false,
    refreshText: true,
  });
  console.log(`\nDone. ${total} Physics questions extracted.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
