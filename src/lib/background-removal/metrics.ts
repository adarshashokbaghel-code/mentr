/**
 * Alpha-matte quality metrics for background removal.
 * Compare predicted alpha ∈ [0,1] against ground-truth alpha ∈ [0,1]
 * at the same width × height (caller must resize).
 */

export type AlphaMetrics = {
  /** Mean absolute error — lower is better */
  mae: number;
  /** Mean squared error — lower is better */
  mse: number;
  /** Sum of absolute differences (normalized by pixel count) — lower is better */
  sadNorm: number;
  /** Raw SAD (sum) — lower is better; scale depends on image size */
  sad: number;
  /** Intersection-over-Union on soft alphas thresholded at 0.5 */
  iou: number;
  /** Dice / F1 on soft alphas thresholded at 0.5 */
  dice: number;
  /** Fraction of pixels within ε of ground truth */
  nearExact: number;
  pixels: number;
};

const FG_THRESH = 0.5;
const NEAR_EPS = 0.05;

export function scoreAlpha(
  predicted: Float32Array | number[],
  groundTruth: Float32Array | number[],
): AlphaMetrics {
  const n = Math.min(predicted.length, groundTruth.length);
  if (n === 0) {
    return {
      mae: 1,
      mse: 1,
      sadNorm: 1,
      sad: 0,
      iou: 0,
      dice: 0,
      nearExact: 0,
      pixels: 0,
    };
  }

  let sad = 0;
  let sse = 0;
  let near = 0;
  let inter = 0;
  let union = 0;
  let diceNum = 0;
  let diceDen = 0;

  for (let i = 0; i < n; i++) {
    const p = clamp01(Number(predicted[i]));
    const g = clamp01(Number(groundTruth[i]));
    const d = Math.abs(p - g);
    sad += d;
    sse += d * d;
    if (d <= NEAR_EPS) near += 1;

    const pb = p >= FG_THRESH;
    const gb = g >= FG_THRESH;
    if (pb && gb) inter += 1;
    if (pb || gb) union += 1;
    if (pb) diceDen += 1;
    if (gb) diceDen += 1;
    if (pb && gb) diceNum += 2;
  }

  return {
    mae: sad / n,
    mse: sse / n,
    sadNorm: sad / n,
    sad,
    iou: union === 0 ? 1 : inter / union,
    dice: diceDen === 0 ? 1 : diceNum / diceDen,
    nearExact: near / n,
    pixels: n,
  };
}

function clamp01(v: number): number {
  if (Number.isNaN(v)) return 0;
  return Math.min(1, Math.max(0, v));
}

/** Decode a mask image (grayscale or alpha channel) → Float32 alpha [0,1]. */
export async function decodeMaskToAlpha(
  file: Blob,
  width: number,
  height: number,
): Promise<Float32Array> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    bitmap.close();
    throw new Error("Canvas unavailable");
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const { data } = ctx.getImageData(0, 0, width, height);
  const alpha = new Float32Array(width * height);
  for (let i = 0; i < alpha.length; i++) {
    const p = i * 4;
    const a = data[p + 3]!;
    // Prefer alpha channel if present; else luminance of RGB
    if (a < 255) {
      alpha[i] = a / 255;
    } else {
      const r = data[p]!;
      const g = data[p + 1]!;
      const b = data[p + 2]!;
      alpha[i] = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    }
  }
  return alpha;
}

/** Extract alpha channel from an RGBA PNG/WebP result blob. */
export async function decodeRgbaToAlpha(
  file: Blob,
): Promise<{ width: number; height: number; alpha: Float32Array }> {
  const bitmap = await createImageBitmap(file);
  const w = bitmap.width;
  const h = bitmap.height;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    bitmap.close();
    throw new Error("Canvas unavailable");
  }
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();
  const { data } = ctx.getImageData(0, 0, w, h);
  const alpha = new Float32Array(w * h);
  for (let i = 0; i < alpha.length; i++) {
    alpha[i] = data[i * 4 + 3]! / 255;
  }
  return { width: w, height: h, alpha };
}

export function formatMetrics(m: AlphaMetrics): string {
  return [
    `MAE ${(m.mae * 100).toFixed(2)}%`,
    `IoU ${(m.iou * 100).toFixed(1)}%`,
    `Dice ${(m.dice * 100).toFixed(1)}%`,
    `Near-exact ${(m.nearExact * 100).toFixed(1)}%`,
  ].join(" · ");
}
