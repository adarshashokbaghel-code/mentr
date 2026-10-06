import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import type { NoteBlock, PythonLmsLesson } from "@/lib/python-lms/types";

const W = 595.28;
const H = 841.89;
const M = 48;
const CONTENT = W - M * 2;

const INK = rgb(0.11, 0.1, 0.09);
const BODY = rgb(0.24, 0.23, 0.21);
const MUTED = rgb(0.45, 0.42, 0.38);
const CORAL = rgb(0.76, 0.35, 0.16);
const RULE = rgb(0.89, 0.86, 0.82);
const CODE_BG = rgb(0.08, 0.1, 0.09);
const CODE_FG = rgb(0.93, 0.95, 0.93);
const OUT_FG = rgb(0.45, 0.86, 0.62);
const WASH = rgb(0.98, 0.96, 0.93);

function clean(raw: string): string {
  return raw
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\\n/g, "\\n")
    .replace(/\\t/g, "\\t")
    .replace(/[–—]/g, "-")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/→/g, "->")
    .replace(/·/g, " | ")
    .replace(/…/g, "...")
    .replace(/[^\x0A\x20-\x7E]/g, "");
}

function wrap(text: string, font: PDFFont, size: number, width: number): string[] {
  const words = clean(text).split(/\s+/).filter(Boolean);
  if (!words.length) return [""];
  const lines: string[] = [];
  let cur = "";
  const pushWord = (word: string) => {
    const next = cur ? `${cur} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) <= width) {
      cur = next;
      return;
    }
    if (cur) lines.push(cur);
    if (font.widthOfTextAtSize(word, size) <= width) {
      cur = word;
      return;
    }
    let rest = word;
    while (rest) {
      let cut = rest.length;
      while (cut > 1 && font.widthOfTextAtSize(rest.slice(0, cut), size) > width) cut -= 1;
      lines.push(rest.slice(0, cut));
      rest = rest.slice(cut);
    }
    cur = "";
  };
  for (const word of words) pushWord(word);
  if (cur) lines.push(cur);
  return lines;
}

function wrapCode(code: string, font: PDFFont, size: number, width: number): string[] {
  const lines: string[] = [];
  for (const raw of clean(code).split("\n")) {
    if (!raw) {
      lines.push("");
      continue;
    }
    let rest = raw;
    while (rest.length) {
      if (font.widthOfTextAtSize(rest, size) <= width) {
        lines.push(rest);
        break;
      }
      let cut = rest.length;
      while (cut > 1 && font.widthOfTextAtSize(rest.slice(0, cut), size) > width) cut -= 1;
      lines.push(rest.slice(0, cut));
      rest = rest.slice(cut);
    }
  }
  return lines.length ? lines : [""];
}

class NotesWriter {
  private page!: PDFPage;
  private y = 0;
  private pageNum = 0;
  private readonly lesson: PythonLmsLesson;

  constructor(
    private doc: PDFDocument,
    private font: PDFFont,
    private bold: PDFFont,
    private mono: PDFFont,
    lesson: PythonLmsLesson,
  ) {
    this.lesson = lesson;
  }

  private newPage() {
    this.page = this.doc.addPage([W, H]);
    this.pageNum += 1;
    this.page.drawRectangle({ x: 0, y: H - 8, width: W, height: 8, color: CORAL });
    const kicker = clean(
      `Learn Python  |  Lesson ${String(this.lesson.number).padStart(2, "0")}  |  ${this.lesson.title}`,
    );
    this.page.drawText(kicker, {
      x: M,
      y: H - 26,
      size: 8,
      font: this.bold,
      color: MUTED,
    });
    this.page.drawText(String(this.pageNum), {
      x: W - M - 10,
      y: 22,
      size: 8,
      font: this.font,
      color: MUTED,
    });
    this.page.drawText("Mentr  |  class notes  |  free", {
      x: M,
      y: 22,
      size: 8,
      font: this.font,
      color: MUTED,
    });
    this.y = H - 48;
  }

  private ensure(height: number) {
    if (this.y - height < 46) this.newPage();
  }

  private gap(n: number) {
    this.y -= n;
  }

  private paragraph(text: string, size: number, font: PDFFont, color: typeof INK, width = CONTENT, indent = 0) {
    const lines = wrap(text, font, size, width);
    const leading = size + 4;
    this.ensure(lines.length * leading + 2);
    for (const line of lines) {
      this.page.drawText(line, {
        x: M + indent,
        y: this.y - size,
        size,
        font,
        color,
      });
      this.y -= leading;
    }
  }

  private rule() {
    this.ensure(10);
    this.page.drawLine({
      start: { x: M, y: this.y },
      end: { x: W - M, y: this.y },
      thickness: 0.6,
      color: RULE,
    });
    this.gap(10);
  }

  cover() {
    this.newPage();
    this.paragraph("BEGINNER  |  FREE", 9, this.bold, CORAL);
    this.gap(6);
    this.paragraph(this.lesson.title, 26, this.bold, INK);
    this.gap(2);
    this.paragraph(this.lesson.subtitle, 12, this.font, BODY);
    this.gap(4);
    this.paragraph(
      `Lesson ${String(this.lesson.number).padStart(2, "0")}  |  about ${this.lesson.minutes} minutes`,
      10,
      this.font,
      MUTED,
    );
    this.gap(8);
    this.rule();
    this.paragraph("By the end of this lesson", 13, this.bold, INK);
    this.gap(4);
    for (const goal of this.lesson.goals) {
      this.paragraph(`-  ${goal}`, 11, this.font, BODY);
      this.gap(1);
    }
    this.gap(6);
    this.paragraph("You can", 11, this.bold, INK);
    this.gap(2);
    this.paragraph(this.lesson.canDo, 11, this.font, BODY);
    this.gap(12);
  }

  private codeBlock(code: string, output?: string, label?: string) {
    const lines = wrapCode(code, this.mono, 9, CONTENT - 20);
    const outLines =
      output !== undefined ? wrapCode(output || "(blank line)", this.mono, 9, CONTENT - 20) : [];
    const labelH = label ? 16 : 0;
    const outH = outLines.length ? 14 + outLines.length * 12 : 0;
    const boxH = 12 + labelH + lines.length * 12 + outH;
    this.ensure(boxH + 8);
    const top = this.y;
    this.page.drawRectangle({
      x: M,
      y: top - boxH,
      width: CONTENT,
      height: boxH,
      color: CODE_BG,
    });
    let ty = top - 14;
    if (label) {
      this.page.drawText(clean(label).toUpperCase(), {
        x: M + 10,
        y: ty,
        size: 7.5,
        font: this.bold,
        color: rgb(1, 1, 1),
      });
      ty -= 14;
    }
    for (const line of lines) {
      this.page.drawText(line || " ", {
        x: M + 10,
        y: ty,
        size: 9,
        font: this.mono,
        color: CODE_FG,
      });
      ty -= 12;
    }
    if (outLines.length) {
      this.page.drawText("OUTPUT", {
        x: M + 10,
        y: ty,
        size: 7,
        font: this.bold,
        color: rgb(0.7, 0.75, 0.72),
      });
      ty -= 12;
      for (const line of outLines) {
        this.page.drawText(line, {
          x: M + 10,
          y: ty,
          size: 9,
          font: this.mono,
          color: OUT_FG,
        });
        ty -= 12;
      }
    }
    this.y = top - boxH - 8;
  }

  private table(head: string[], rows: string[][]) {
    const cols = head.length;
    const colW = CONTENT / cols;
    const drawRow = (cells: string[], header: boolean) => {
      const wrapped = cells.map((cell) =>
        wrap(cell, header ? this.bold : this.font, header ? 8 : 9, colW - 10),
      );
      const lines = Math.max(...wrapped.map((w) => w.length), 1);
      const h = 8 + lines * 11;
      this.ensure(h);
      const top = this.y;
      this.page.drawRectangle({
        x: M,
        y: top - h,
        width: CONTENT,
        height: h,
        color: header ? INK : WASH,
        borderColor: RULE,
        borderWidth: 0.4,
      });
      wrapped.forEach((cellLines, i) => {
        cellLines.forEach((line, li) => {
          this.page.drawText(line, {
            x: M + i * colW + 5,
            y: top - 12 - li * 11,
            size: header ? 8 : 9,
            font: header ? this.bold : this.font,
            color: header ? rgb(1, 1, 1) : BODY,
          });
        });
      });
      this.y = top - h;
    };
    drawRow(head, true);
    for (const row of rows) drawRow(row, false);
    this.gap(8);
  }

  private block(block: NoteBlock) {
    switch (block.type) {
      case "lead":
        this.paragraph(block.text, 12.5, this.bold, INK);
        this.gap(4);
        return;
      case "p":
        this.paragraph(block.text, 11, this.font, BODY);
        this.gap(4);
        return;
      case "list":
        block.items.forEach((item, i) => {
          this.paragraph(`${block.ordered ? `${i + 1}.` : "-"}  ${item}`, 11, this.font, BODY);
          this.gap(1);
        });
        this.gap(4);
        return;
      case "code":
        if (block.inputs?.length) {
          this.paragraph(`Keyboard answers, one per input(): ${block.inputs.join("  |  ")}`, 10, this.font, MUTED);
          this.gap(2);
        }
        this.codeBlock(
          block.code,
          block.output,
          block.shell ? "Python shell" : block.filename,
        );
        return;
      case "callout": {
        const title =
          block.title ??
          (block.tone === "exam"
            ? "In exams"
            : block.tone === "warn"
              ? "Watch out"
              : block.tone === "fact"
                ? "Key fact"
                : "Remember");
        this.paragraph(title, 10, this.bold, CORAL);
        this.gap(1);
        this.paragraph(block.text, 11, this.font, BODY);
        this.gap(6);
        return;
      }
      case "compare":
        for (const side of [block.left, block.right]) {
          this.paragraph(side.label, 10, this.bold, INK);
          this.gap(2);
          this.codeBlock(side.code, side.output);
        }
        return;
      case "anatomy":
        this.paragraph("Parts of the line", 10, this.bold, MUTED);
        this.gap(2);
        for (const part of block.parts) {
          this.paragraph(`${part.token}   ${part.label}`, 11, this.font, BODY);
          this.gap(1);
        }
        this.gap(4);
        return;
      case "table":
        this.table(block.head, block.rows);
        return;
      case "flow":
        if (block.title) {
          this.paragraph(block.title, 10, this.bold, MUTED);
          this.gap(2);
        }
        block.steps.forEach((step, i) => {
          this.paragraph(`${i + 1}.  ${step.text}  (${step.kind})`, 11, this.font, BODY);
          this.gap(1);
        });
        this.gap(4);
        return;
      case "terms":
        for (const item of block.items) {
          this.paragraph(item.term, 11, this.bold, INK);
          this.gap(1);
          this.paragraph(item.meaning, 11, this.font, BODY);
          this.gap(3);
        }
        return;
      case "flashcards":
        block.cards.forEach((card, i) => {
          this.paragraph(`Q${i + 1}.  ${card.q}`, 11, this.bold, INK);
          this.gap(1);
          this.paragraph(card.a, 11, this.font, BODY);
          this.gap(4);
        });
        return;
      case "check": {
        this.paragraph(`Check.  ${block.question}`, 11, this.bold, INK);
        this.gap(2);
        if (block.code) this.codeBlock(block.code);
        block.options.forEach((opt, i) => {
          const mark = i === block.answer ? "*" : " ";
          this.paragraph(`${mark} ${String.fromCharCode(65 + i)}.  ${opt}`, 11, this.font, BODY);
          this.gap(1);
        });
        this.paragraph(`Answer: ${block.explain}`, 10.5, this.font, CORAL);
        this.gap(6);
        return;
      }
    }
  }

  slides() {
    let part = "";
    for (const slide of this.lesson.notes) {
      if (slide.part !== part) {
        part = slide.part;
        this.gap(6);
        this.rule();
        this.paragraph(slide.part, 9, this.bold, CORAL);
        this.gap(4);
      }
      this.paragraph(slide.title, 15, this.bold, INK);
      this.gap(4);
      for (const block of slide.blocks) this.block(block);
      this.gap(6);
    }
  }
}

export function pythonNotesFilename(lesson: PythonLmsLesson): string {
  const slug = lesson.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `Mentr-Learn-Python-Lesson-${String(lesson.number).padStart(2, "0")}-${slug}-Notes.pdf`;
}

export async function buildPythonNotesPdf(lesson: PythonLmsLesson): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle(`${lesson.title} | Learn Python notes`);
  doc.setAuthor("Mentr");
  doc.setSubject(`Lesson ${lesson.number} class notes`);
  const writer = new NotesWriter(
    doc,
    await doc.embedFont(StandardFonts.Helvetica),
    await doc.embedFont(StandardFonts.HelveticaBold),
    await doc.embedFont(StandardFonts.Courier),
    lesson,
  );
  writer.cover();
  writer.slides();
  return doc.save();
}

export async function downloadPythonNotesPdf(lesson: PythonLmsLesson): Promise<void> {
  const bytes = await buildPythonNotesPdf(lesson);
  const body = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(body).set(bytes);
  const blob = new Blob([body], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = pythonNotesFilename(lesson);
  a.click();
  URL.revokeObjectURL(url);
}
