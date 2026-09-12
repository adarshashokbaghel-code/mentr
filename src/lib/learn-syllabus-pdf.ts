import { PARENT_GUIDE, SYLLABUS_COUNTS, getSyllabusTracks } from "@/lib/learn-syllabus-doc";

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 40;
const CONTENT_W = PAGE_W - MARGIN * 2;
const BOTTOM = 52;
const HEADER_H = 54;

const INK: RGB = [28, 36, 52];
const ORANGE: RGB = [255, 106, 26];
const CREAM: RGB = [255, 250, 245];
const WHITE: RGB = [255, 255, 255];
const MUTED: RGB = [90, 100, 114];
const HAIR: RGB = [239, 230, 216];
const WASH: RGB = [246, 244, 240];
const SAGE: RGB = [47, 158, 110];
const LAVENDER: RGB = [124, 106, 214];

type RGB = [number, number, number];
type SubjectId = "cs" | "ai" | "math";

const SUBJECT_ACCENT: Record<SubjectId, RGB> = {
  cs: ORANGE,
  ai: LAVENDER,
  math: SAGE,
};

const SUBJECT_NAME: Record<SubjectId, string> = {
  cs: "CS Basics",
  ai: "AI Basics",
  math: "Math for CS",
};

function rgbOp(c: RGB): string {
  return `${(c[0] / 255).toFixed(3)} ${(c[1] / 255).toFixed(3)} ${(c[2] / 255).toFixed(3)}`;
}

function pdfEscape(raw: string): string {
  return asciiSafe(raw).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function asciiSafe(raw: string): string {
  return raw
    .replace(/[–—]/g, "-")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/₹/g, "Rs ")
    .replace(/→/g, "->")
    .replace(/×/g, "x")
    .replace(/·/g, " - ")
    .replace(/…/g, "...")
    .replace(/[^\x20-\x7E]/g, " ");
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

class Brochure {
  private pages: string[][] = [];
  private ops: string[] = [];
  private y = 0;
  private kind: "cover" | "inside" = "inside";
  private lock = false;

  startCover() {
    this.kind = "cover";
    this.ops = [];
    this.y = PAGE_H;
  }

  startInside() {
    if (this.ops.length) this.commit();
    this.kind = "inside";
    this.ops = [fillRect(0, 0, PAGE_W, PAGE_H, CREAM)];
    this.ops.push(fillRect(0, PAGE_H - 8, PAGE_W, 8, ORANGE));
    this.ops.push(textAt(MARGIN, PAGE_H - 32, "MENTR LEARN", 9, true, ORANGE));
    this.ops.push(
      textAt(MARGIN + 92, PAGE_H - 32, "Class 3-5 parent syllabus", 9, false, MUTED),
    );
    this.ops.push(fillRect(MARGIN, PAGE_H - 42, CONTENT_W, 1.2, HAIR));
    this.y = PAGE_H - HEADER_H;
  }

  private commit() {
    this.pages.push(this.ops);
    this.ops = [];
  }

  ensure(height: number) {
    if (this.lock || this.kind === "cover") return;
    if (this.y - height < BOTTOM) this.startInside();
  }

  gap(n: number) {
    this.y -= n;
  }

  line(text: string, size: number, bold: boolean, color: RGB, gap = 4, x = MARGIN, maxW = CONTENT_W) {
    const lines = wrap(text, size, maxW);
    this.ensure(lines.length * (size + gap) + 2);
    for (const line of lines) {
      this.ops.push(textAt(x, this.y - size, line, size, bold, color));
      this.y -= size + gap;
    }
  }

  bar(color: RGB, h = 3) {
    this.ensure(h + 8);
    this.ops.push(fillRect(MARGIN, this.y - h, 48, h, color));
    this.y -= h + 8;
  }

  card(pad: number, draw: (innerW: number) => void, accent?: RGB) {
    const startY = this.y;
    const innerW = CONTENT_W - pad * 2;
    const saved = this.ops.length;
    const savedY = this.y;
    this.lock = true;
    this.y -= pad;
    draw(innerW);
    this.y -= pad;
    this.lock = false;
    const height = savedY - this.y;
    if (savedY - height < BOTTOM) {
      this.ops.splice(saved);
      this.y = savedY;
      this.startInside();
      this.card(pad, draw, accent);
      return;
    }
    const boxY = this.y;
    const chrome = [
      fillRect(MARGIN, boxY, CONTENT_W, height, WHITE),
      fillRect(MARGIN, boxY, CONTENT_W, 0.8, HAIR),
      fillRect(MARGIN, boxY + height - 0.8, CONTENT_W, 0.8, HAIR),
      fillRect(MARGIN, boxY, 0.8, height, HAIR),
      fillRect(MARGIN + CONTENT_W - 0.8, boxY, 0.8, height, HAIR),
    ];
    if (accent) chrome.push(fillRect(MARGIN, boxY, 4, height, accent));
    this.ops.splice(saved, 0, ...chrome);
  }

  finish(): string[] {
    if (this.ops.length) this.commit();
    const count = this.pages.length;
    return this.pages.map((ops, i) => {
      const pageOps = [...ops];
      if (this.pageKind(i) === "inside") {
        pageOps.push(fillRect(0, 0, PAGE_W, 36, INK));
        pageOps.push(textAt(MARGIN, 16, "Mentr Learn  |  Free for Class 3-5  |  mentr.in/learn", 8, false, WHITE));
        const label = `${i + 1} / ${count}`;
        pageOps.push(
          textAt(PAGE_W - MARGIN - estimateWidth(label, 8), 16, label, 8, false, WHITE),
        );
      }
      return pageOps.join("\n");
    });
  }

  private pageKind(i: number): "cover" | "inside" {
    return i === 0 ? "cover" : "inside";
  }

  getY() {
    return this.y;
  }

  addOp(op: string) {
    this.ops.push(op);
  }

  setY(y: number) {
    this.y = y;
  }
}

function buildCover(doc: Brochure) {
  doc.startCover();
  doc.addOp(fillRect(0, 0, PAGE_W, PAGE_H, CREAM));
  doc.addOp(fillRect(0, PAGE_H - 220, PAGE_W, 220, INK));
  doc.addOp(fillRect(0, PAGE_H - 8, PAGE_W, 8, ORANGE));
  doc.addOp(textAt(MARGIN, PAGE_H - 48, "MENTR LEARN", 11, true, ORANGE));
  doc.addOp(textAt(MARGIN, PAGE_H - 92, "Class 3-5", 32, true, WHITE));
  doc.addOp(textAt(MARGIN, PAGE_H - 128, "CS, AI & Math syllabus", 22, true, WHITE));
  doc.addOp(
    textAt(MARGIN, PAGE_H - 158, "A parent brochure for the free learning path.", 12, false, [255, 232, 214]),
  );
  doc.addOp(
    textAt(
      MARGIN,
      PAGE_H - 186,
      "3 subjects   |   4 modules each   |   5 chapters per module   |   60 chapters",
      10,
      false,
      [210, 214, 220],
    ),
  );

  doc.setY(PAGE_H - 250);
  const stats = [
    [`${SYLLABUS_COUNTS.modules}`, "Chapters"],
    [`${SYLLABUS_COUNTS.practiceTotal}`, "Practice questions"],
    [`${SYLLABUS_COUNTS.checksTotal}`, "Progress checks"],
    [`${SYLLABUS_COUNTS.bosses}`, "Boss challenges"],
  ];
  const boxW = (CONTENT_W - 18) / 2;
  const boxH = 58;
  stats.forEach(([value, label], i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = MARGIN + col * (boxW + 18);
    const y = PAGE_H - 320 - row * (boxH + 12);
    doc.addOp(fillRect(x, y, boxW, boxH, WHITE));
    doc.addOp(fillRect(x, y, 4, boxH, ORANGE));
    doc.addOp(textAt(x + 16, y + 32, value, 18, true, ORANGE));
    doc.addOp(textAt(x + 16, y + 14, label, 10, false, MUTED));
  });

  doc.setY(PAGE_H - 460);
  doc.addOp(textAt(MARGIN, PAGE_H - 455, "What each chapter includes", 14, true, INK));
  PARENT_GUIDE.provided.forEach((item, i) => {
    const y = PAGE_H - 490 - i * 52;
    doc.addOp(fillRect(MARGIN, y, CONTENT_W, 44, WHITE));
    doc.addOp(fillRect(MARGIN, y, 4, 44, ORANGE));
    doc.addOp(textAt(MARGIN + 16, y + 26, `${i + 1}.  ${item.title}`, 11, true, INK));
    const body = wrap(item.body, 9, CONTENT_W - 32)[0];
    doc.addOp(textAt(MARGIN + 16, y + 12, body, 9, false, MUTED));
  });

  doc.addOp(fillRect(0, 0, PAGE_W, 56, INK));
  doc.addOp(textAt(MARGIN, 26, "Rs 0 forever    |    mentr.in/learn    |    A Paprly product", 10, true, WHITE));
}

function buildInside(doc: Brochure) {
  const tracks = getSyllabusTracks();

  doc.startInside();
  doc.bar(ORANGE);
  doc.line("How the path is organised", 16, true, INK, 6);
  doc.line(
    "Pick a subject, then a module, then a chapter. Same path for Class 3, 4, and 5. Later modules stretch. No Class 6 algebra and no typed code.",
    10,
    false,
    MUTED,
    4,
  );
  doc.gap(10);

  const steps = [
    ["1", "Subject", "CS Basics, AI Basics, or Math for CS."],
    ["2", "4 modules", "Easy, then Building, then Stretch, then Apply."],
    ["3", "5 chapters", "A video, 10 practice questions, and 1 check you can see."],
    ["4", "A boss", "A bigger game or mini-project after every module."],
  ];
  steps.forEach(([n, title, body]) => {
    doc.card(12, (w) => {
      doc.line(`${n}   ${title}`, 12, true, INK, 4, MARGIN + 12, w);
      doc.line(body, 10, false, MUTED, 3, MARGIN + 12, w);
    }, ORANGE);
    doc.gap(8);
  });

  doc.gap(8);
  doc.line("A sitting is 12-18 minutes. Videos grow from about 3 minutes to 6. Every video is narrated.", 10, false, MUTED, 4);

  for (const { track, units } of tracks) {
    const id = track.id as SubjectId;
    const accent = SUBJECT_ACCENT[id];
    doc.startInside();
    doc.addOp(fillRect(MARGIN, doc.getY() - 64, CONTENT_W, 64, INK));
    doc.addOp(fillRect(MARGIN, doc.getY() - 64, 6, 64, accent));
    doc.addOp(textAt(MARGIN + 18, doc.getY() - 28, SUBJECT_NAME[id].toUpperCase(), 10, true, accent));
    doc.addOp(textAt(MARGIN + 18, doc.getY() - 48, track.tagline, 14, true, WHITE));
    doc.setY(doc.getY() - 80);
    doc.line("4 modules  ·  20 chapters  ·  4 bosses", 10, false, MUTED, 6);

    units.forEach((bundle, mi) => {
      const { unit, modules } = bundle;
      doc.ensure(90);
      doc.gap(6);
      doc.card(14, (w) => {
        doc.line(`MODULE ${mi + 1} OF 4`, 8, true, accent, 4, MARGIN + 18, w - 8);
        doc.line(unit.title, 13, true, INK, 4, MARGIN + 18, w - 8);
        doc.line(unit.description, 10, false, MUTED, 4, MARGIN + 18, w - 8);
        doc.line(`5 chapters  ·  then boss: ${unit.bossChallenge}`, 9, false, MUTED, 3, MARGIN + 18, w - 8);
      }, accent);
      doc.gap(8);

      modules.forEach((mod, ci) => {
        doc.ensure(130);
        doc.card(12, (w) => {
          doc.line(
            `Chapter ${ci + 1}   ${mod.id}   ${mod.detail.level}`,
            8,
            true,
            accent,
            3,
            MARGIN + 16,
            w,
          );
          doc.line(mod.title, 11, true, INK, 3, MARGIN + 16, w);
          doc.line(mod.concept, 9, false, MUTED, 4, MARGIN + 16, w);
          doc.line(`They watch: ${mod.detail.teach[0] ?? ""}`, 9, false, INK, 3, MARGIN + 16, w);
          doc.line(`They can: ${mod.detail.outcomes[0] ?? ""}`, 9, false, INK, 3, MARGIN + 16, w);
          doc.line(`You'll know they got it: ${mod.detail.checkpoint}`, 9, false, MUTED, 2, MARGIN + 16, w);
        });
        doc.gap(6);
      });
    });
  }

  doc.startInside();
  doc.bar(ORANGE);
  doc.line("A note for parents", 16, true, INK, 8);
  doc.line(
    "This brochure is for you. It is not a teacher script. It shows what Mentr Learn provides so you can see the path before your child starts.",
    11,
    false,
    INK,
    5,
  );
  doc.gap(8);
  doc.line(
    "Class 3 and Class 5 share the same 60 chapters. Difficulty lives in later modules. Class 6-8 and 9-12 are coming later and are not in this brochure.",
    10,
    false,
    MUTED,
    4,
  );
  doc.gap(16);
  doc.card(16, (w) => {
    doc.line("Start free", 12, true, ORANGE, 5, MARGIN + 16, w);
    doc.line("mentr.in/learn", 14, true, INK, 5, MARGIN + 16, w);
    doc.line("Create a parent account. Rs 0 forever.", 10, false, MUTED, 3, MARGIN + 16, w);
  }, ORANGE);
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
    "<< /Title (Mentr Learn Class 3-5 Syllabus) /Author (Mentr Learn) /Creator (Mentr) /Subject (Parent brochure - CS, AI and Math) >>";

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

export function buildSyllabusPdf(): Uint8Array {
  const doc = new Brochure();
  buildCover(doc);
  buildInside(doc);
  return packPdf(doc.finish());
}
