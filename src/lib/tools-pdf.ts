/** Shared client-side PDF helpers (pdf-lib). */

import { PDFDocument } from "pdf-lib";

export async function readFileBytes(file: File): Promise<Uint8Array> {
  const buf = await file.arrayBuffer();
  return new Uint8Array(buf);
}

export async function mergePdfs(files: File[]): Promise<Uint8Array> {
  const out = await PDFDocument.create();
  for (const file of files) {
    const bytes = await readFileBytes(file);
    const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const pages = await out.copyPages(doc, doc.getPageIndices());
    for (const page of pages) out.addPage(page);
  }
  return out.save({ useObjectStreams: true });
}

export async function splitPdfByRanges(
  file: File,
  ranges: number[][],
): Promise<{ name: string; bytes: Uint8Array }[]> {
  const bytes = await readFileBytes(file);
  const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const total = src.getPageCount();
  const results: { name: string; bytes: Uint8Array }[] = [];

  for (const range of ranges) {
    const indices = range.filter((i) => i >= 0 && i < total);
    if (!indices.length) continue;
    const doc = await PDFDocument.create();
    const pages = await doc.copyPages(src, indices);
    for (const p of pages) doc.addPage(p);
    const label =
      indices.length === 1
        ? `page-${indices[0]! + 1}`
        : `pages-${indices[0]! + 1}-${indices[indices.length - 1]! + 1}`;
    results.push({
      name: `${label}.pdf`,
      bytes: await doc.save({ useObjectStreams: true }),
    });
  }
  return results;
}

export async function splitEveryPage(
  file: File,
): Promise<{ name: string; bytes: Uint8Array }[]> {
  const bytes = await readFileBytes(file);
  const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const results: { name: string; bytes: Uint8Array }[] = [];
  for (let i = 0; i < src.getPageCount(); i++) {
    const doc = await PDFDocument.create();
    const [page] = await doc.copyPages(src, [i]);
    doc.addPage(page!);
    results.push({
      name: `page-${i + 1}.pdf`,
      bytes: await doc.save({ useObjectStreams: true }),
    });
  }
  return results;
}

/** Parse "1-3,5,8-9" (1-based) into zero-based index groups. */
export function parsePageRanges(
  input: string,
  pageCount: number,
): number[][] {
  const groups: number[][] = [];
  const parts = input.split(",").map((s) => s.trim()).filter(Boolean);
  for (const part of parts) {
    if (part.includes("-")) {
      const [a, b] = part.split("-").map((x) => Number(x.trim()));
      if (!Number.isFinite(a) || !Number.isFinite(b)) continue;
      const start = Math.max(1, Math.min(a!, b!));
      const end = Math.min(pageCount, Math.max(a!, b!));
      const idxs: number[] = [];
      for (let p = start; p <= end; p++) idxs.push(p - 1);
      if (idxs.length) groups.push(idxs);
    } else {
      const n = Number(part);
      if (Number.isFinite(n) && n >= 1 && n <= pageCount) {
        groups.push([n - 1]);
      }
    }
  }
  return groups;
}

export async function compressPdf(
  file: File,
  strength: "light" | "strong",
): Promise<{ bytes: Uint8Array; before: number; after: number }> {
  const before = file.size;
  const bytes = await readFileBytes(file);
  const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const out = await PDFDocument.create();
  const indices = src.getPageIndices();
  const copied = await out.copyPages(src, indices);

  if (strength === "strong") {
    for (const page of copied) {
      const { width, height } = page.getSize();
      const scale = 0.85;
      page.setSize(width * scale, height * scale);
      page.scaleContent(scale, scale);
      out.addPage(page);
    }
  } else {
    for (const page of copied) out.addPage(page);
  }

  out.setTitle("");
  out.setAuthor("");
  out.setSubject("");
  out.setKeywords([]);
  out.setProducer("Mentr Tools");
  out.setCreator("Mentr Tools");

  const saved = await out.save({ useObjectStreams: true });
  return { bytes: saved, before, after: saved.byteLength };
}

export async function imagesToPdf(
  files: File[],
  quality = 0.75,
): Promise<Uint8Array> {
  const out = await PDFDocument.create();
  for (const file of files) {
    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    const maxW = 1200;
    const scale = Math.min(1, maxW / bitmap.width);
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    const jpeg = await new Promise<Uint8Array>((resolve, reject) => {
      canvas.toBlob(
        async (blob) => {
          if (!blob) {
            reject(new Error("Could not encode image"));
            return;
          }
          resolve(new Uint8Array(await blob.arrayBuffer()));
        },
        "image/jpeg",
        quality,
      );
    });

    const img = await out.embedJpg(jpeg);
    const page = out.addPage([img.width, img.height]);
    page.drawImage(img, {
      x: 0,
      y: 0,
      width: img.width,
      height: img.height,
    });
  }
  return out.save({ useObjectStreams: true });
}

export async function organizePdf(
  file: File,
  order: number[],
): Promise<Uint8Array> {
  const bytes = await readFileBytes(file);
  const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const out = await PDFDocument.create();
  const valid = order.filter((i) => i >= 0 && i < src.getPageCount());
  const pages = await out.copyPages(src, valid);
  for (const p of pages) out.addPage(p);
  return out.save({ useObjectStreams: true });
}

export async function getPdfPageCount(file: File): Promise<number> {
  const bytes = await readFileBytes(file);
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  return doc.getPageCount();
}
