/** Longest edge after resize — enough for handwriting, fewer vision tiles if we escalate. */
const MAX_EDGE = 1280;
const JPEG_QUALITY = 72;

export type PreparedSnapImage = {
  buffer: Buffer;
  mime: "image/jpeg";
  dataUrl: string;
  width: number;
  height: number;
  bytesIn: number;
  bytesOut: number;
};

export type LocalOcrResult = {
  text: string;
  meanConfidence: number;
  /** true when transcript looks usable without cloud vision */
  usable: boolean;
  durationMs: number;
};

type TesseractMod = typeof import("tesseract.js");
type SharpMod = typeof import("sharp");

let workerPromise: Promise<import("tesseract.js").Worker> | null = null;
let sharpPromise: Promise<SharpMod> | null = null;
let tesseractPromise: Promise<TesseractMod> | null = null;

async function loadSharp(): Promise<SharpMod> {
  if (!sharpPromise) {
    sharpPromise = import("sharp").catch((err) => {
      sharpPromise = null;
      throw err;
    });
  }
  return sharpPromise;
}

async function loadTesseract(): Promise<TesseractMod> {
  if (!tesseractPromise) {
    tesseractPromise = import("tesseract.js").catch((err) => {
      tesseractPromise = null;
      throw err;
    });
  }
  return tesseractPromise;
}

async function getOcrWorker(): Promise<import("tesseract.js").Worker> {
  if (!workerPromise) {
    workerPromise = (async () => {
      const Tesseract = await loadTesseract();
      const worker = await Tesseract.createWorker("eng", 1, {
        // Keep logs quiet in production
        logger: () => undefined,
      });
      await worker.setParameters({
        tessedit_pageseg_mode: Tesseract.PSM.AUTO,
        preserve_interword_spaces: "1",
      });
      return worker;
    })().catch((err) => {
      workerPromise = null;
      throw err;
    });
  }
  return workerPromise;
}

/**
 * Resize + JPEG compress for OCR / optional cloud vision.
 * Fast (sharp) and cuts tokens if we escalate to OpenAI.
 *
 * sharp/tesseract are loaded lazily so /api cold starts on Vercel do not
 * crash when the wrong platform native binary is traced into the lambda.
 */
export async function prepareSnapGradeImage(
  input: Buffer,
): Promise<PreparedSnapImage | { error: string }> {
  try {
    const sharp = (await loadSharp()).default;
    const bytesIn = input.length;
    const image = sharp(input, { failOn: "none" }).rotate(); // honor EXIF
    const meta = await image.metadata();
    const w = meta.width || 0;
    const h = meta.height || 0;
    if (w < 40 || h < 40) {
      return { error: "Photo is too small to read. Retake closer to the page." };
    }

    const pipeline = sharp(input, { failOn: "none" })
      .rotate()
      .resize({
        width: MAX_EDGE,
        height: MAX_EDGE,
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true });

    const buffer = await pipeline.toBuffer();
    const outMeta = await sharp(buffer).metadata();
    const dataUrl = `data:image/jpeg;base64,${buffer.toString("base64")}`;
    return {
      buffer,
      mime: "image/jpeg",
      dataUrl,
      width: outMeta.width || w,
      height: outMeta.height || h,
      bytesIn,
      bytesOut: buffer.length,
    };
  } catch (err) {
    console.error("[snap-grade-image] prepare failed:", err);
    return { error: "Could not process the photo. Try another image." };
  }
}

function cleanOcrText(raw: string): string {
  return raw
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[^\S\n]{2,}/g, " ")
    .trim();
}

/**
 * Local OCR (Tesseract). Handwriting is weaker than print — caller should
 * escalate to mini vision when `usable` is false.
 */
export async function runLocalOcr(buffer: Buffer): Promise<LocalOcrResult> {
  const started = Date.now();
  try {
    const worker = await getOcrWorker();
    const result = await worker.recognize(buffer);
    const text = cleanOcrText(result.data.text || "");
    const meanConfidence = Number(result.data.confidence) || 0;
    const letters = (text.match(/[A-Za-z0-9]/g) || []).length;
    const lines = text.split("\n").filter((l) => l.trim().length > 1).length;

    // Heuristic: usable enough to skip cloud vision
    const usable =
      text.length >= 24 &&
      letters >= 12 &&
      meanConfidence >= 48 &&
      (lines >= 2 || letters >= 40);

    return {
      text: text.slice(0, 4000),
      meanConfidence,
      usable,
      durationMs: Date.now() - started,
    };
  } catch (err) {
    console.error("[snap-grade-image] local OCR failed:", err);
    return {
      text: "",
      meanConfidence: 0,
      usable: false,
      durationMs: Date.now() - started,
    };
  }
}

/** Warm Tesseract once at boot so first request is fast. */
export function warmSnapGradeOcr(): void {
  void getOcrWorker().catch((err) => {
    console.warn("[snap-grade-image] OCR warm-up failed:", err);
  });
}
