import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { certificateDate, certificateSummary, certificateVerifyPath } from "@/lib/python-lms/certificate";
import { SITE_URL } from "@/lib/seo";
import type { PyCertificate } from "@/lib/python-lms/sync-client";

const W = 842;
const H = 595;
const INK = rgb(0.06, 0.09, 0.07);
const GREEN = rgb(0.12, 0.42, 0.29);
const GOLD = rgb(0.72, 0.58, 0.27);
const MUTED = rgb(0.38, 0.4, 0.38);
const CREAM = rgb(0.988, 0.976, 0.953);

/** Standard PDF fonts only cover Latin-1; drop anything they cannot draw rather than failing. */
function drawable(font: PDFFont, text: string) {
  return [...text]
    .filter((ch) => {
      try {
        font.encodeText(ch);
        return true;
      } catch {
        return false;
      }
    })
    .join("");
}

function centered(page: PDFPage, text: string, y: number, font: PDFFont, size: number, color = INK) {
  const t = drawable(font, text);
  page.drawText(t, { x: (W - font.widthOfTextAtSize(t, size)) / 2, y, size, font, color });
}

function wrap(font: PDFFont, text: string, size: number, max: number) {
  const lines: string[] = [];
  let line = "";
  for (const word of drawable(font, text).split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) > max && line) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

export async function buildCertificatePdf(cert: PyCertificate): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle(`${cert.course} certificate | ${cert.name}`);
  doc.setAuthor("Mentr");
  doc.setSubject(`Certificate ${cert.id}`);
  const page = doc.addPage([W, H]);
  const sans = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const serif = await doc.embedFont(StandardFonts.TimesRomanBoldItalic);

  page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: CREAM });
  page.drawRectangle({ x: 18, y: 18, width: W - 36, height: H - 36, borderColor: GREEN, borderWidth: 6 });
  page.drawRectangle({ x: 32, y: 32, width: W - 64, height: H - 64, borderColor: GOLD, borderWidth: 1 });
  page.drawRectangle({ x: 32, y: H - 40, width: W - 64, height: 8, color: GREEN });

  page.drawText("MENTR", { x: 58, y: H - 82, size: 16, font: bold, color: INK });
  page.drawText("LEARN PYTHON", { x: 58 + bold.widthOfTextAtSize("MENTR", 16) + 10, y: H - 82, size: 10, font: bold, color: GREEN });
  const idLabel = `No. ${cert.id}`;
  page.drawText(idLabel, { x: W - 58 - sans.widthOfTextAtSize(idLabel, 10), y: H - 80, size: 10, font: sans, color: MUTED });

  centered(page, "CERTIFICATE OF COMPLETION", H - 150, bold, 28, INK);
  page.drawLine({ start: { x: W / 2 - 60, y: H - 166 }, end: { x: W / 2 + 60, y: H - 166 }, thickness: 1.5, color: GOLD });
  centered(page, `${cert.course.toUpperCase()} COURSE`, H - 188, bold, 11, GREEN);
  centered(page, "This certifies that", H - 228, sans, 13, MUTED);

  let nameSize = 42;
  const name = drawable(serif, cert.name) || cert.id;
  while (serif.widthOfTextAtSize(name, nameSize) > W - 220 && nameSize > 22) nameSize -= 2;
  centered(page, name, H - 284, serif, nameSize, INK);
  page.drawLine({ start: { x: 190, y: H - 298 }, end: { x: W - 190, y: H - 298 }, thickness: 0.8, color: GOLD });

  const summary = `has earned the ${cert.course} certificate on Mentr ${certificateSummary(cert)}`;
  wrap(sans, summary, 12.5, W - 260).forEach((line, i) => centered(page, line, H - 330 - i * 19, sans, 12.5, INK));

  const footY = 96;
  page.drawText(certificateDate(cert.issuedAt), { x: 110, y: footY + 8, size: 12, font: bold, color: INK });
  page.drawLine({ start: { x: 110, y: footY }, end: { x: 290, y: footY }, thickness: 0.8, color: MUTED });
  page.drawText("Date issued", { x: 110, y: footY - 15, size: 9.5, font: sans, color: MUTED });

  page.drawText(`${cert.stats.xp} XP`, { x: W - 290, y: footY + 8, size: 12, font: bold, color: INK });
  page.drawLine({ start: { x: W - 290, y: footY }, end: { x: W - 110, y: footY }, thickness: 0.8, color: MUTED });
  page.drawText("Earned in the course", { x: W - 290, y: footY - 15, size: 9.5, font: sans, color: MUTED });

  page.drawCircle({ x: W / 2, y: footY + 2, size: 40, color: GREEN });
  page.drawCircle({ x: W / 2, y: footY + 2, size: 34, borderColor: GOLD, borderWidth: 1.2 });
  centered(page, "MENTR", footY + 8, bold, 11, rgb(1, 1, 1));
  centered(page, "VERIFIED", footY - 6, bold, 7.5, rgb(0.85, 0.78, 0.55));

  const verify = `Verify: ${SITE_URL.replace(/^https?:\/\//, "")}${certificateVerifyPath(cert.id)}`;
  centered(page, verify, 46, sans, 9, MUTED);
  return doc.save();
}

export async function downloadCertificatePdf(cert: PyCertificate): Promise<void> {
  const bytes = await buildCertificatePdf(cert);
  const body = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(body).set(bytes);
  const url = URL.createObjectURL(new Blob([body], { type: "application/pdf" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `mentr-python-certificate-${cert.id}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}
