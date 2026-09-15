/**
 * Class notes PDF — comic-panel layout, serious Helvetica typography.
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

const INK: RGB = [28, 36, 52];
const ORANGE: RGB = [255, 106, 26];
const CREAM: RGB = [255, 250, 245];
const WHITE: RGB = [255, 255, 255];
const MUTED: RGB = [90, 100, 114];
const HAIR: RGB = [232, 226, 216];
const TEAL: RGB = [13, 148, 136];
const DINO: RGB = [45, 160, 110];
const DINO_DARK: RGB = [28, 110, 78];

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

function strokeRect(
  x: number,
  y: number,
  w: number,
  h: number,
  color: RGB,
  width = 1.4,
): string {
  return `${rgbOp(color)} RG ${width} w ${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re S`;
}

function textAt(
  x: number,
  y: number,
  text: string,
  size: number,
  bold: boolean,
  color: RGB,
): string {
  return [
    "BT",
    `/F${bold ? 2 : 1} ${size} Tf`,
    `${rgbOp(color)} rg`,
    `1 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)} Tm`,
    `(${pdfEscape(text)}) Tj`,
    "ET",
  ].join(" ");
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

/** Tiny comic dino head (serious notes, playful mark). */
function drawDino(cx: number, cy: number, scale = 1): string[] {
  const s = scale;
  const ops: string[] = [];
  ops.push(fillCircle(cx, cy, 16 * s, DINO));
  ops.push(fillCircle(cx + 10 * s, cy + 2 * s, 10 * s, DINO)); // snout
  ops.push(fillCircle(cx - 5 * s, cy + 6 * s, 3.2 * s, WHITE)); // eye white
  ops.push(fillCircle(cx - 4.2 * s, cy + 6.2 * s, 1.6 * s, INK)); // pupil
  ops.push(fillCircle(cx + 14 * s, cy + 4 * s, 2.2 * s, DINO_DARK)); // nose
  // smile arc as thick line approximation with small rects
  ops.push(fillRect(cx + 6 * s, cy - 4 * s, 8 * s, 1.4 * s, DINO_DARK));
  return ops;
}

class NotesPdf {
  private pages: string[][] = [];
  private ops: string[] = [];
  private y = PAGE_H;

  private commit() {
    if (this.ops.length) this.pages.push(this.ops);
    this.ops = [];
  }

  private docMeta: LessonNotesDoc | null = null;
  private pageIndex = 0;
  private pageTotal = 2;

  startPage(doc: LessonNotesDoc, pageLabel?: string) {
    this.docMeta = doc;
    this.pageIndex += 1;
    this.commit();
    this.ops = [fillRect(0, 0, PAGE_W, PAGE_H, CREAM)];
    this.ops.push(fillRect(0, PAGE_H - 52, PAGE_W, 52, INK));
    this.ops.push(fillRect(0, PAGE_H - 56, PAGE_W, 4, ORANGE));
    this.ops.push(textAt(MARGIN, PAGE_H - 28, "MENTR LEARN", 11, true, ORANGE));
    this.ops.push(
      textAt(MARGIN + 88, PAGE_H - 28, "Class notes", 10, false, WHITE),
    );
    const label =
      pageLabel ?? `Page ${this.pageIndex} of ${this.pageTotal}`;
    this.ops.push(
      textAt(PAGE_W - MARGIN - 110, PAGE_H - 28, label, 9, false, [180, 186, 194]),
    );
    this.ops.push(...drawDino(PAGE_W - MARGIN - 22, PAGE_H - 26, 0.85));
    this.ops.push(
      textAt(MARGIN, PAGE_H - 72, `${doc.moduleId}  |  ${doc.chapterLabel}  |  ${doc.level}`, 9, true, ORANGE),
    );
    this.ops.push(textAt(MARGIN, PAGE_H - 90, doc.title, 18, true, INK));
    this.ops.push(textAt(MARGIN, PAGE_H - 106, doc.unitLabel, 10, false, MUTED));
    this.ops.push(fillRect(MARGIN, PAGE_H - 114, CONTENT_W, 1, HAIR));
    this.y = PAGE_H - 128;
  }

  private newPageIfNeeded(h: number) {
    if (this.y - h >= 48) return;
    if (!this.docMeta) return;
    this.pageTotal = Math.max(this.pageTotal, this.pageIndex + 1);
    this.startPage(this.docMeta);
  }

  gap(n: number) {
    this.y -= n;
  }

  ensure(h: number) {
    this.newPageIfNeeded(h);
    return this.y - h >= 48;
  }

  line(text: string, size: number, bold: boolean, color: RGB, leading = 4, x = MARGIN, maxW = CONTENT_W) {
    const lines = wrap(text, size, maxW);
    for (const line of lines) {
      this.ops.push(textAt(x, this.y - size, line, size, bold, color));
      this.y -= size + leading;
    }
  }

  /** Comic panel card with thick border */
  panel(title: string, lines: string[], accent: RGB = INK) {
    const pad = 12;
    const titleH = 16;
    const bodyLines = lines.flatMap((t) => wrap(t, 10, CONTENT_W - pad * 2 - 8));
    const bodyH = bodyLines.length * 14;
    const h = pad + titleH + 8 + bodyH + pad;
    if (!this.ensure(h + 10)) return;

    const boxY = this.y - h;
    // Drop shadow
    this.ops.push(fillRect(MARGIN + 2.5, boxY - 2.5, CONTENT_W, h, HAIR));
    this.ops.push(fillRect(MARGIN, boxY, CONTENT_W, h, WHITE));
    this.ops.push(strokeRect(MARGIN, boxY, CONTENT_W, h, accent, 1.8));
    this.ops.push(fillRect(MARGIN, boxY + h - 5, CONTENT_W, 5, accent));

    let ty = this.y - pad - 2;
    this.ops.push(textAt(MARGIN + pad, ty - 11, title.toUpperCase(), 9, true, accent));
    ty -= titleH + 4;
    for (const line of bodyLines) {
      this.ops.push(textAt(MARGIN + pad, ty - 10, line, 10, false, INK));
      ty -= 14;
    }
    this.y = boxY - 12;
  }

  defRow(term: string, meaning: string) {
    const meaningLines = wrap(meaning, 10, CONTENT_W - 110);
    const h = Math.max(28, meaningLines.length * 13 + 12);
    if (!this.ensure(h + 6)) return;
    const boxY = this.y - h;
    this.ops.push(fillRect(MARGIN, boxY, CONTENT_W, h, WHITE));
    this.ops.push(strokeRect(MARGIN, boxY, CONTENT_W, h, HAIR, 1));
    this.ops.push(fillRect(MARGIN, boxY, 4, h, ORANGE));
    this.ops.push(textAt(MARGIN + 14, boxY + h / 2 - 4, term, 11, true, ORANGE));
    let my = boxY + h - 14;
    for (const line of meaningLines) {
      this.ops.push(textAt(MARGIN + 100, my, line, 10, false, INK));
      my -= 13;
    }
    this.y = boxY - 8;
  }

  finish(): Uint8Array {
    this.commit();
    return packPdf(this.pages.map((ops) => ops.join("\n")));
  }
}

function packPdf(streams: string[]): Uint8Array {
  const objs: string[] = [];
  const kids: string[] = [];
  const font1 = 3 + streams.length * 2;
  const font2 = font1 + 1;
  const infoId = font2 + 1;
  const pagesObj = 2;

  streams.forEach((stream, i) => {
    const pageId = 3 + i * 2;
    const contentId = pageId + 1;
    kids.push(`${pageId} 0 R`);
    objs[pageId - 1] =
      `<< /Type /Page /Parent ${pagesObj} 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] ` +
      `/Contents ${contentId} 0 R /Resources << /Font << /F1 ${font1} 0 R /F2 ${font2} 0 R >> >> >>`;
    objs[contentId - 1] = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`;
  });

  objs[0] = `<< /Type /Catalog /Pages ${pagesObj} 0 R /ViewerPreferences << /DisplayDocTitle true >> >>`;
  objs[1] = `<< /Type /Pages /Kids [${kids.join(" ")}] /Count ${streams.length} >>`;
  objs[font1 - 1] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";
  objs[font2 - 1] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>";
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

  // Page 1 — big idea + definitions
  pdf.startPage(doc);
  pdf.panel("Big idea", [doc.bigIdea], ORANGE);
  pdf.gap(4);
  pdf.line("Words to know (simple meanings)", 12, true, INK, 8);
  for (const d of doc.definitions) {
    pdf.defRow(d.term, d.meaning);
  }
  pdf.gap(6);
  pdf.panel("Dino says", [doc.dinoLine], TEAL);

  // Stories + remember + check (auto-paginates)
  pdf.startPage(doc);
  for (const panel of doc.panels) {
    pdf.panel(panel.title, panel.body, INK);
  }
  pdf.panel("Remember", doc.remember, ORANGE);
  pdf.panel(
    "Check yourself",
    [`Q: ${doc.checkYourself.q}`, `A: ${doc.checkYourself.a}`],
    TEAL,
  );
  pdf.gap(8);
  pdf.line(
    "Notes from the class video script. Keep this for revision before the quiz.",
    9,
    false,
    MUTED,
    4,
  );
  pdf.line("mentr.in/learn", 10, true, ORANGE, 3);

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
