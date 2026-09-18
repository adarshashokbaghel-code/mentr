/**
 * Quality post-process for continuous alpha mattes.
 * Image-guided edge sharpening + spill cleanup — no hard global threshold.
 */

export type RgbaBitmap = {
  width: number;
  height: number;
  rgba: Uint8ClampedArray;
};

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

function lum(r: number, g: number, b: number): number {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

/**
 * Color-guided bilateral refine: pull alpha toward neighbors with similar RGB.
 * Sharpens cutouts along real image edges (hair/product boundaries) without
 * the mush of a plain blur.
 */
export function guidedAlphaRefine(
  alpha: Float32Array,
  rgba: Uint8ClampedArray,
  width: number,
  height: number,
  radius = 2,
  colorSigma = 28,
): Float32Array {
  const out = new Float32Array(alpha.length);
  const invTwoSigma2 = 1 / (2 * colorSigma * colorSigma);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      const a0 = alpha[i]!;
      // Keep solid FG / BG mostly intact
      if (a0 < 0.04 || a0 > 0.96) {
        out[i] = a0;
        continue;
      }

      const p = i * 4;
      const r0 = rgba[p]!;
      const g0 = rgba[p + 1]!;
      const b0 = rgba[p + 2]!;

      let wSum = 0;
      let aSum = 0;
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const xx = x + dx;
          const yy = y + dy;
          if (xx < 0 || yy < 0 || xx >= width || yy >= height) continue;
          const j = yy * width + xx;
          const q = j * 4;
          const dr = r0 - rgba[q]!;
          const dg = g0 - rgba[q + 1]!;
          const db = b0 - rgba[q + 2]!;
          const colorDist2 = dr * dr + dg * dg + db * db;
          const spatial = dx * dx + dy * dy;
          const w =
            Math.exp(-colorDist2 * invTwoSigma2) *
            Math.exp(-spatial / (2 * 2.2 * 2.2));
          wSum += w;
          aSum += w * alpha[j]!;
        }
      }
      out[i] = wSum > 0 ? aSum / wSum : a0;
    }
  }
  return out;
}

/**
 * Edge-aware contrast: tighten mid alpha only where the photo has a strong
 * luminance edge (typical subject boundary). Leaves soft hair bands alone.
 */
export function edgeAwareContrast(
  alpha: Float32Array,
  rgba: Uint8ClampedArray,
  width: number,
  height: number,
): Float32Array {
  const out = new Float32Array(alpha.length);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      const a = alpha[i]!;
      if (a < 0.08 || a > 0.92) {
        out[i] = a;
        continue;
      }

      const p = i * 4;
      const c = lum(rgba[p]!, rgba[p + 1]!, rgba[p + 2]!);
      let grad = 0;
      if (x + 1 < width) {
        const q = (i + 1) * 4;
        grad = Math.max(
          grad,
          Math.abs(c - lum(rgba[q]!, rgba[q + 1]!, rgba[q + 2]!)),
        );
      }
      if (y + 1 < height) {
        const q = (i + width) * 4;
        grad = Math.max(
          grad,
          Math.abs(c - lum(rgba[q]!, rgba[q + 1]!, rgba[q + 2]!)),
        );
      }

      // Strong photo edge → push alpha away from 0.5
      if (grad > 18) {
        const t = Math.min(1, (grad - 18) / 40);
        const strength = 1 + 0.55 * t;
        out[i] = clamp01(0.5 + (a - 0.5) * strength);
      } else {
        out[i] = a;
      }
    }
  }
  return out;
}

/** Remove tiny foreground speckles (noise islands). */
export function removeTinyForeground(
  alpha: Float32Array,
  width: number,
  height: number,
  maxPixels = 48,
): Float32Array {
  const out = new Float32Array(alpha);
  const seen = new Uint8Array(width * height);
  const stack: number[] = [];

  for (let i = 0; i < alpha.length; i++) {
    if (seen[i] || alpha[i]! < 0.55) continue;
    stack.length = 0;
    stack.push(i);
    seen[i] = 1;
    const comp: number[] = [];
    while (stack.length) {
      const cur = stack.pop()!;
      comp.push(cur);
      const x = cur % width;
      const y = (cur / width) | 0;
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ] as const) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
        const ni = ny * width + nx;
        if (seen[ni] || alpha[ni]! < 0.55) continue;
        seen[ni] = 1;
        stack.push(ni);
      }
    }
    if (comp.length > 0 && comp.length <= maxPixels) {
      for (const idx of comp) out[idx] = 0;
    }
  }
  return out;
}

/**
 * Fill small background holes inside the subject (e.g. missed patches).
 */
export function fillSmallHoles(
  alpha: Float32Array,
  width: number,
  height: number,
  maxPixels = 80,
): Float32Array {
  const out = new Float32Array(alpha);
  const seen = new Uint8Array(width * height);
  const stack: number[] = [];

  for (let i = 0; i < alpha.length; i++) {
    if (seen[i] || alpha[i]! > 0.4) continue;
    stack.length = 0;
    stack.push(i);
    seen[i] = 1;
    const comp: number[] = [];
    let touchesBorder = false;
    while (stack.length) {
      const cur = stack.pop()!;
      comp.push(cur);
      const x = cur % width;
      const y = (cur / width) | 0;
      if (x === 0 || y === 0 || x === width - 1 || y === height - 1) {
        touchesBorder = true;
      }
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ] as const) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
        const ni = ny * width + nx;
        if (seen[ni] || alpha[ni]! > 0.4) continue;
        seen[ni] = 1;
        stack.push(ni);
      }
    }
    if (!touchesBorder && comp.length > 0 && comp.length <= maxPixels) {
      for (const idx of comp) out[idx] = 1;
    }
  }
  return out;
}

/**
 * Reduce background color spill on semi-transparent edge pixels.
 */
export function decontaminateEdges(
  rgba: Uint8ClampedArray,
  alpha: Float32Array,
  width: number,
  height: number,
): Uint8ClampedArray {
  const out = new Uint8ClampedArray(rgba);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      const a = alpha[i]!;
      if (a <= 0.04 || a >= 0.97) continue;

      let br = 0;
      let bg = 0;
      let bb = 0;
      let bn = 0;
      for (let dy = -3; dy <= 3; dy++) {
        for (let dx = -3; dx <= 3; dx++) {
          const xx = x + dx;
          const yy = y + dy;
          if (xx < 0 || yy < 0 || xx >= width || yy >= height) continue;
          const j = yy * width + xx;
          if (alpha[j]! < 0.1) {
            const p = j * 4;
            br += rgba[p]!;
            bg += rgba[p + 1]!;
            bb += rgba[p + 2]!;
            bn++;
          }
        }
      }
      if (bn < 3) continue;

      br /= bn;
      bg /= bn;
      bb /= bn;
      const p = i * 4;
      const t = 1 - a;
      // Stronger unspill on mid-alpha fringe
      const strength = a < 0.5 ? 1 : 0.85;
      const fr = Math.min(
        255,
        Math.max(0, (rgba[p]! - t * br * strength) / Math.max(a, 0.08)),
      );
      const fg = Math.min(
        255,
        Math.max(0, (rgba[p + 1]! - t * bg * strength) / Math.max(a, 0.08)),
      );
      const fb = Math.min(
        255,
        Math.max(0, (rgba[p + 2]! - t * bb * strength) / Math.max(a, 0.08)),
      );
      out[p] = fr;
      out[p + 1] = fg;
      out[p + 2] = fb;
    }
  }
  return out;
}

/** Full quality stack applied after model alpha. */
export function enhanceAlpha(
  alpha: Float32Array,
  rgba: Uint8ClampedArray,
  width: number,
  height: number,
): Float32Array {
  let a = removeTinyForeground(alpha, width, height);
  a = fillSmallHoles(a, width, height);
  a = guidedAlphaRefine(a, rgba, width, height);
  a = edgeAwareContrast(a, rgba, width, height);
  a = guidedAlphaRefine(a, rgba, width, height, 1, 22);
  return a;
}

export function composeRgba(
  rgb: Uint8ClampedArray,
  alpha: Float32Array,
  width: number,
  height: number,
): RgbaBitmap {
  const rgba = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    const p = i * 4;
    rgba[p] = rgb[p]!;
    rgba[p + 1] = rgb[p + 1]!;
    rgba[p + 2] = rgb[p + 2]!;
    rgba[p + 3] = Math.round(clamp01(alpha[i]!) * 255);
  }
  return { width, height, rgba };
}

export async function rgbaToPngBlob(bitmap: RgbaBitmap): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  const copy = new Uint8ClampedArray(bitmap.rgba.length);
  copy.set(bitmap.rgba);
  ctx.putImageData(new ImageData(copy, bitmap.width, bitmap.height), 0, 0);
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("PNG encode failed"))),
      "image/png",
    );
  });
}
