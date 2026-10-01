/**
 * Class notes PDF — same cards, type, and colors as the Read lesson screen.
 * No external deps. Client-safe.
 */

import {
  A1_LESSON_NOTES,
  getLessonNotes,
  type LessonNotesDoc,
} from "@/lib/learn-lesson-notes";

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 36;
const CONTENT_W = PAGE_W - MARGIN * 2;

type RGB = [number, number, number];

const INK: RGB = [28, 36, 52]; // #1c2434
const BODY: RGB = [57, 66, 79]; // #39424f
const ORANGE: RGB = [255, 106, 26]; // #ff6a1a
const META: RGB = [138, 146, 156]; // #8a929c
const TEAL: RGB = [13, 148, 136]; // #0d9488
const PEACH: RGB = [255, 244, 232]; // #fff4e8
const CARD: RGB = [250, 248, 244]; // #faf8f4
const CARD_LINE: RGB = [240, 235, 227]; // #f0ebe3
const REMEMBER_BG: RGB = [230, 247, 244]; // #e6f7f4
const CHECK_BG: RGB = [238, 242, 255]; // #eef2ff
const INDIGO: RGB = [79, 70, 229]; // #4f46e5
const WHITE: RGB = [255, 255, 255];

function rgbOp(c: RGB): string {
  return `${(c[0] / 255).toFixed(3)} ${(c[1] / 255).toFixed(3)} ${(c[2] / 255).toFixed(3)}`;
}

function asciiSafe(raw: string): string {
  return raw
    .replace(/[–—]/g, "-")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/→/g, "->")
    .replace(/·/g, " - ")
    .replace(/…/g, "...")
    .replace(/↔/g, "<->")
    .replace(/×/g, "x")
    .replace(/÷/g, "/")
    .replace(/−/g, "-")
    .replace(/≠/g, "!=")
    .replace(/≈/g, "~")
    .replace(/°/g, " deg")
    .replace(/₹/g, "Rs ")
    .replace(/●/g, "(circle)")
    .replace(/▲/g, "(triangle)")
    .replace(/■/g, "(square)")
    .replace(/★/g, "(star)")
    .replace(/✔/g, "(tick)")
    .replace(/[^\x20-\x7E]/g, " ");
}

function pdfEscape(raw: string): string {
  return asciiSafe(raw).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function estimateWidth(text: string, size: number): number {
  return asciiSafe(text).length * size * 0.5;
}

function wrap(text: string, size: number, width: number): string[] {
  const words = asciiSafe(text).split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let cur = "";
  for (const word of words) {
    const next = cur ? `${cur} ${word}` : word;
    if (estimateWidth(next, size) > width && cur) {
      lines.push(cur);
      cur = word;
    } else {
      cur = next;
    }
  }
  if (cur) lines.push(cur);
  return lines.length ? lines : [""];
}

function fillRect(x: number, y: number, w: number, h: number, color: RGB): string {
  return `${rgbOp(color)} rg ${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re f`;
}

function textAt(
  x: number,
  y: number,
  text: string,
  size: number,
  font: 1 | 2 | 3,
  color: RGB,
): string {
  return [
    "BT",
    `/F${font} ${size} Tf`,
    `${rgbOp(color)} rg`,
    `1 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)} Tm`,
    `(${pdfEscape(text)}) Tj`,
    "ET",
  ].join(" ");
}

function roundBox(
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  fill: RGB,
  stroke?: RGB,
  sw = 1.2,
): string {
  const radius = Math.min(r, w / 2, h / 2);
  const k = radius * 0.5522847498;
  const path = [
    `${(x + radius).toFixed(2)} ${y.toFixed(2)} m`,
    `${(x + w - radius).toFixed(2)} ${y.toFixed(2)} l`,
    `${(x + w - radius + k).toFixed(2)} ${y.toFixed(2)} ${(x + w).toFixed(2)} ${(y + k).toFixed(2)} ${(x + w).toFixed(2)} ${(y + radius).toFixed(2)} c`,
    `${(x + w).toFixed(2)} ${(y + h - radius).toFixed(2)} l`,
    `${(x + w).toFixed(2)} ${(y + h - radius + k).toFixed(2)} ${(x + w - radius + k).toFixed(2)} ${(y + h).toFixed(2)} ${(x + w - radius).toFixed(2)} ${(y + h).toFixed(2)} c`,
    `${(x + radius).toFixed(2)} ${(y + h).toFixed(2)} l`,
    `${(x + radius - k).toFixed(2)} ${(y + h).toFixed(2)} ${x.toFixed(2)} ${(y + h - radius + k).toFixed(2)} ${x.toFixed(2)} ${(y + h - radius).toFixed(2)} c`,
    `${x.toFixed(2)} ${(y + radius).toFixed(2)} l`,
    `${x.toFixed(2)} ${(y + radius - k).toFixed(2)} ${(x + radius - k).toFixed(2)} ${y.toFixed(2)} ${(x + radius).toFixed(2)} ${y.toFixed(2)} c`,
  ].join(" ");
  if (!stroke) return `${rgbOp(fill)} rg ${path} f`;
  return `${rgbOp(fill)} rg ${rgbOp(stroke)} RG ${sw} w ${path} B`;
}

function fillCircle(cx: number, cy: number, r: number, color: RGB): string {
  // Bezier circle approximation
  const k = 0.5522847498 * r;
  return [
    `${rgbOp(color)} rg`,
    `${(cx + r).toFixed(2)} ${cy.toFixed(2)} m`,
    `${(cx + r).toFixed(2)} ${(cy + k).toFixed(2)} ${(cx + k).toFixed(2)} ${(cy + r).toFixed(2)} ${cx.toFixed(2)} ${(cy + r).toFixed(2)} c`,
    `${(cx - k).toFixed(2)} ${(cy + r).toFixed(2)} ${(cx - r).toFixed(2)} ${(cy + k).toFixed(2)} ${(cx - r).toFixed(2)} ${cy.toFixed(2)} c`,
    `${(cx - r).toFixed(2)} ${(cy - k).toFixed(2)} ${(cx - k).toFixed(2)} ${(cy - r).toFixed(2)} ${cx.toFixed(2)} ${(cy - r).toFixed(2)} c`,
    `${(cx + k).toFixed(2)} ${(cy - r).toFixed(2)} ${(cx + r).toFixed(2)} ${(cy - k).toFixed(2)} ${(cx + r).toFixed(2)} ${cy.toFixed(2)} c`,
    "f",
  ].join(" ");
}

function checkMark(x: number, y: number): string {
  return [
    `${rgbOp(TEAL)} RG 1.5 w 1 J`,
    `${x.toFixed(2)} ${(y + 2).toFixed(2)} m ${(x + 2.4).toFixed(2)} ${y.toFixed(2)} l S`,
    `${(x + 2.4).toFixed(2)} ${y.toFixed(2)} m ${(x + 6.2).toFixed(2)} ${(y + 5.2).toFixed(2)} l S`,
  ].join(" ");
}

class NotesPdf {
  private pages: string[][] = [];
  private ops: string[] = [];
  private y = PAGE_H;
  private readonly bottom = 42;

  private commit() {
    if (this.ops.length) this.pages.push(this.ops);
    this.ops = [];
  }

  private docMeta: LessonNotesDoc | null = null;
  private pageIndex = 0;

  private room() {
    return this.y - this.bottom;
  }

  startPage(doc: LessonNotesDoc, continued = false) {
    this.docMeta = doc;
    this.pageIndex += 1;
    this.commit();
    this.ops = [fillRect(0, 0, PAGE_W, PAGE_H, WHITE)];
    this.ops.push(
      textAt(PAGE_W - MARGIN - 72, 22, `@@P${this.pageIndex}@@`, 8, 1, META),
    );

    if (!continued) {
      this.y = PAGE_H - 34;
      this.ops.push(textAt(MARGIN, this.y - 9, "READ THE LESSON", 9, 2, ORANGE));
      this.y -= 24;
      for (const line of wrap(doc.title, 16, CONTENT_W)) {
        this.ops.push(textAt(MARGIN, this.y - 16, line, 16, 2, INK));
        this.y -= 20;
      }
      this.y -= 2;
      const meta = `${doc.unitLabel}   |   ${doc.chapterLabel}   |   ${doc.level}`;
      for (const line of wrap(meta, 9, CONTENT_W)) {
        this.ops.push(textAt(MARGIN, this.y - 9, line, 9, 1, META));
        this.y -= 13;
      }
      this.y -= 12;
      return;
    }

    this.y = PAGE_H - 32;
    this.ops.push(textAt(MARGIN, this.y - 11, doc.title, 11, 2, INK));
    this.y -= 16;
    this.ops.push(
      textAt(MARGIN, this.y - 8, `${doc.chapterLabel}   |   ${doc.level}`, 8, 1, META),
    );
    this.y -= 14;
    this.ops.push(fillRect(MARGIN, this.y, CONTENT_W, 1, CARD_LINE));
    this.y -= 14;
  }

  private turnPage() {
    if (!this.docMeta) return;
    this.startPage(this.docMeta, true);
  }

  bigIdea(text: string) {
    const pad = 14;
    const body = wrap(text, 11, CONTENT_W - pad * 2);
    const h = pad + 16 + body.length * 15 + pad;
    if (h > this.room()) this.turnPage();
    const boxY = this.y - h;
    this.ops.push(roundBox(MARGIN, boxY, CONTENT_W, h, 12, PEACH));
    let ty = this.y - pad;
    this.ops.push(textAt(MARGIN + pad, ty - 8, "BIG IDEA", 8, 2, ORANGE));
    ty -= 16;
    for (const line of body) {
      this.ops.push(textAt(MARGIN + pad, ty - 11, line, 11, 2, INK));
      ty -= 15;
    }
    this.y = boxY - 16;
  }

  heading(text: string) {
    if (20 > this.room()) this.turnPage();
    this.ops.push(textAt(MARGIN, this.y - 12, text, 12, 2, INK));
    this.y -= 20;
  }

  definitions(items: { term: string; meaning: string }[]) {
    const gap = 8;
    const colW = (CONTENT_W - gap) / 2;
    const inner = colW - 20;
    for (let i = 0; i < items.length; i += 2) {
      const pair = items.slice(i, i + 2);
      const measured = pair.map((d) => {
        const term = wrap(d.term, 10, inner);
        const meaning = wrap(d.meaning, 9, inner);
        const h = 10 + term.length * 13 + 3 + meaning.length * 12 + 10;
        return { term, meaning, h };
      });
      const h = Math.max(...measured.map((m) => m.h));
      if (h > this.room()) this.turnPage();
      measured.forEach((m, idx) => {
        const x = MARGIN + idx * (colW + gap);
        const boxY = this.y - h;
        this.ops.push(roundBox(x, boxY, colW, h, 8, CARD, CARD_LINE, 0.9));
        let ty = this.y - 10;
        for (const line of m.term) {
          this.ops.push(textAt(x + 10, ty - 10, line, 10, 2, TEAL));
          ty -= 13;
        }
        ty -= 2;
        for (const line of m.meaning) {
          this.ops.push(textAt(x + 10, ty - 9, line, 9, 1, BODY));
          ty -= 12;
        }
      });
      this.y -= h + 6;
    }
    this.y -= 8;
  }

  bullets(title: string, lines: string[]) {
    const titleLines = wrap(title, 11, CONTENT_W);
    const rows = lines.flatMap((src) =>
      wrap(src, 10, CONTENT_W - 16).map((line, i) => ({ line, dot: i === 0 })),
    );
    if (titleLines.length * 14 + 18 > this.room()) this.turnPage();
    for (const line of titleLines) {
      this.ops.push(textAt(MARGIN, this.y - 11, line, 11, 2, INK));
      this.y -= 14;
    }
    this.y -= 3;
    for (const row of rows) {
      if (16 > this.room()) this.turnPage();
      if (row.dot) this.ops.push(fillCircle(MARGIN + 3, this.y - 6, 2.1, ORANGE));
      this.ops.push(textAt(MARGIN + 12, this.y - 10, row.line, 10, 1, BODY));
      this.y -= 14;
    }
    this.y -= 8;
  }

  remember(lines: string[]) {
    const pad = 12;
    const rows = lines.flatMap((src) =>
      wrap(src, 10, CONTENT_W - pad * 2 - 16).map((line, i) => ({
        line,
        mark: i === 0,
      })),
    );
    let cursor = 0;
    let part = 0;
    while (part === 0 || cursor < rows.length) {
      part += 1;
      const title = part === 1 ? "Remember" : "Remember (continued)";
      if (pad + 18 + 16 + pad > this.room()) this.turnPage();
      const fit = Math.max(1, Math.floor((this.room() - pad - 18 - pad) / 15));
      const chunk = rows.slice(cursor, cursor + fit);
      cursor += chunk.length;
      const h = pad + 18 + chunk.length * 15 + pad;
      const boxY = this.y - h;
      this.ops.push(roundBox(MARGIN, boxY, CONTENT_W, h, 12, REMEMBER_BG, TEAL, 1.7));
      let ty = this.y - pad;
      this.ops.push(textAt(MARGIN + pad, ty - 11, title, 11, 2, TEAL));
      ty -= 18;
      for (const row of chunk) {
        if (row.mark) this.ops.push(checkMark(MARGIN + pad, ty - 9));
        this.ops.push(textAt(MARGIN + pad + 12, ty - 10, row.line, 10, 1, INK));
        ty -= 15;
      }
      this.y = boxY - 12;
      if (cursor >= rows.length) break;
    }
  }

  check(question: string, answer: string) {
    const pad = 12;
    const qLines = wrap(question, 10, CONTENT_W - pad * 2);
    const aLines = wrap(answer, 10, CONTENT_W - pad * 2);
    const h = pad + 18 + qLines.length * 14 + 6 + aLines.length * 14 + pad;
    if (h > this.room()) this.turnPage();
    const boxY = this.y - h;
    this.ops.push(roundBox(MARGIN, boxY, CONTENT_W, h, 12, CHECK_BG));
    let ty = this.y - pad;
    this.ops.push(textAt(MARGIN + pad, ty - 11, "Check yourself", 11, 2, INDIGO));
    ty -= 18;
    for (const line of qLines) {
      this.ops.push(textAt(MARGIN + pad, ty - 10, line, 10, 2, INK));
      ty -= 14;
    }
    ty -= 4;
    for (const line of aLines) {
      this.ops.push(textAt(MARGIN + pad, ty - 10, line, 10, 1, BODY));
      ty -= 14;
    }
    this.y = boxY - 12;
  }

  dino(line: string) {
    const rows = wrap(`Dino says: ${line}`, 10, CONTENT_W);
    if (rows.length * 14 > this.room()) this.turnPage();
    for (const row of rows) {
      this.ops.push(textAt(MARGIN, this.y - 10, row, 10, 3, TEAL));
      this.y -= 14;
    }
  }

  finish(): Uint8Array {
    this.commit();
    const total = this.pages.length;
    const streams = this.pages.map((ops) =>
      ops
        .join("\n")
        .replace(/@@P(\d+)@@/g, (_, n) => `Page ${n} of ${total}`),
    );
    return packPdf(streams);
  }
}

function packPdf(streams: string[]): Uint8Array {
  const objs: string[] = [];
  const kids: string[] = [];
  const font1 = 3 + streams.length * 2;
  const font2 = font1 + 1;
  const font3 = font2 + 1;
  const infoId = font3 + 1;
  const pagesObj = 2;

  streams.forEach((stream, i) => {
    const pageId = 3 + i * 2;
    const contentId = pageId + 1;
    kids.push(`${pageId} 0 R`);
    objs[pageId - 1] =
      `<< /Type /Page /Parent ${pagesObj} 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] ` +
      `/Contents ${contentId} 0 R /Resources << /Font << /F1 ${font1} 0 R /F2 ${font2} 0 R /F3 ${font3} 0 R >> >> >>`;
    objs[contentId - 1] = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`;
  });

  objs[0] = `<< /Type /Catalog /Pages ${pagesObj} 0 R /ViewerPreferences << /DisplayDocTitle true >> >>`;
  objs[1] = `<< /Type /Pages /Kids [${kids.join(" ")}] /Count ${streams.length} >>`;
  objs[font1 - 1] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";
  objs[font2 - 1] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>";
  objs[font3 - 1] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique >>";
  objs[infoId - 1] =
    "<< /Title (Mentr Learn Class Notes) /Author (Mentr Learn) /Creator (Mentr) /Subject (Lesson class notes) >>";

  let body = "%PDF-1.4\n";
  const offsets = [0];
  objs.forEach((obj, i) => {
    offsets.push(body.length);
    body += `${i + 1} 0 obj\n${obj}\nendobj\n`;
  });
  const xrefAt = body.length;
  body += `xref\n0 ${objs.length + 1}\n`;
  body += "0000000000 65535 f \n";
  for (let i = 1; i <= objs.length; i++) {
    body += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  body += `trailer << /Size ${objs.length + 1} /Root 1 0 R /Info ${infoId} 0 R >>\nstartxref\n${xrefAt}\n%%EOF`;
  return new TextEncoder().encode(body);
}

export function buildLessonNotesPdf(doc: LessonNotesDoc = A1_LESSON_NOTES): Uint8Array {
  const pdf = new NotesPdf();
  pdf.startPage(doc);
  pdf.bigIdea(doc.bigIdea);
  pdf.heading("Key words");
  pdf.definitions(doc.definitions);
  for (const panel of doc.panels) pdf.bullets(panel.title, panel.body);
  pdf.remember(doc.remember);
  pdf.check(doc.checkYourself.q, doc.checkYourself.a);
  pdf.dino(doc.dinoLine);
  return pdf.finish();
}

export function downloadLessonNotes(moduleId: string): boolean {
  const doc = getLessonNotes(moduleId);
  if (!doc) return false;
  const bytes = buildLessonNotesPdf(doc);
  const body = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(body).set(bytes);
  const blob = new Blob([body], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = doc.filename;
  a.click();
  URL.revokeObjectURL(url);
  return true;
}
