/** Client-side multi-page A4 text PDF helper (pdf-lib). */

import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";

const A4: [number, number] = [595.28, 841.89];
const MARGIN = 48;
const LINE = 14;
const COLOR = rgb(0.11, 0.14, 0.2);
const MUTED = rgb(0.45, 0.48, 0.52);

export type PdfLine =
  | { type: "h1"; text: string }
  | { type: "h2"; text: string }
  | { type: "p"; text: string }
  | { type: "meta"; text: string }
  | { type: "blank"; height?: number }
  | { type: "hr" }
  | { type: "li"; text: string; bullet?: string };

function wrap(text: string, font: PDFFont, size: number, maxW: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (!words.length) return [""];
  const lines: string[] = [];
  let cur = words[0]!;
  for (let i = 1; i < words.length; i++) {
    const next = `${cur} ${words[i]}`;
    if (font.widthOfTextAtSize(next, size) <= maxW) cur = next;
    else {
      lines.push(cur);
      cur = words[i]!;
    }
  }
  lines.push(cur);
  return lines;
}

export async function createTextPdf(
  lines: PdfLine[],
  opts?: { footer?: string },
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const maxW = A4[0] - MARGIN * 2;
  const footer = opts?.footer ?? "Mentr Tools · free · mentr.in/tools";

  let page: PDFPage = doc.addPage(A4);
  let y = A4[1] - MARGIN;

  function newPage() {
    page = doc.addPage(A4);
    y = A4[1] - MARGIN;
  }

  function ensure(need: number) {
    if (y - need < MARGIN + 24) newPage();
  }

  function drawFooter() {
    page.drawText(footer.slice(0, 80), {
      x: MARGIN,
      y: 22,
      size: 8,
      font: regular,
      color: MUTED,
    });
  }

  drawFooter();

  for (const line of lines) {
    if (line.type === "blank") {
      y -= line.height ?? LINE;
      continue;
    }
    if (line.type === "hr") {
      ensure(16);
      page.drawLine({
        start: { x: MARGIN, y },
        end: { x: A4[0] - MARGIN, y },
        thickness: 0.8,
        color: rgb(0.82, 0.84, 0.86),
      });
      y -= 14;
      continue;
    }

    const isH1 = line.type === "h1";
    const isH2 = line.type === "h2";
    const isMeta = line.type === "meta";
    const isLi = line.type === "li";
    const size = isH1 ? 18 : isH2 ? 13 : isMeta ? 10 : 11;
    const font = isH1 || isH2 ? bold : regular;
    const prefix = isLi ? `${line.bullet ?? "•"} ` : "";
    const raw = `${prefix}${line.text}`.replace(/\s+/g, " ").trim();
    const chunks = wrap(raw, font, size, maxW);
    const gap = isH1 ? 6 : isH2 ? 4 : 2;

    for (const chunk of chunks) {
      ensure(size + gap + 2);
      page.drawText(chunk, {
        x: MARGIN,
        y: y - size,
        size,
        font,
        color: isMeta ? MUTED : COLOR,
      });
      y -= size + gap;
    }
    if (isH1) y -= 4;
    if (isH2) y -= 2;
  }

  // footers on all pages
  const pages = doc.getPages();
  for (const p of pages) {
    p.drawText(footer.slice(0, 80), {
      x: MARGIN,
      y: 22,
      size: 8,
      font: regular,
      color: MUTED,
    });
  }

  return doc.save({ useObjectStreams: true });
}

export function slugFilename(parts: string[]): string {
  const body = parts
    .map((p) =>
      p
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
    )
    .filter(Boolean)
    .join("-")
    .slice(0, 80);
  return `mentr-${body || "document"}.pdf`;
}
