/// <reference lib="webworker" />

/**
 * Background-removal Web Worker.
 * BiRefNet_lite 512 + crop-and-refine second pass for sharper subject edges.
 */

import {
  AutoModel,
  AutoProcessor,
  RawImage,
  env,
  type PreTrainedModel,
  type Processor,
} from "@huggingface/transformers";
import { BG_REMOVAL } from "./config";

env.allowLocalModels = false;
env.useBrowserCache = true;

type Backend = "webgpu" | "wasm";

let model: PreTrainedModel | null = null;
let processor: Processor | null = null;
let backend: Backend | null = null;

type InMsg =
  | { type: "init" }
  | {
      type: "process";
      buffer: ArrayBuffer;
      mime: string;
      requestId: number;
    };

function post(msg: Record<string, unknown>, transfer: Transferable[] = []) {
  self.postMessage(msg, { transfer });
}

function onProgress(info: { status?: string; loaded?: number; total?: number }) {
  if (info.status === "progress" && info.total && info.total > 0) {
    const pct = Math.min(99, Math.round(((info.loaded ?? 0) / info.total) * 100));
    post({ type: "progress", progress: pct });
  }
}

type OrtTensor = {
  dims: number[];
  data: Float32Array | Uint8Array | number[];
  sigmoid: () => { data: Float32Array | number[]; dims: number[] };
  squeeze: (dim?: number | null) => unknown;
  [index: number]: unknown;
};

function asTensor(value: unknown): OrtTensor {
  if (!value || typeof value !== "object") {
    throw new Error("Model returned no mask tensor.");
  }
  return value as OrtTensor;
}

function logitsToAlpha(
  output: Record<string, unknown>,
  outW: number,
  outH: number,
): Float32Array {
  const raw = output.logits ?? output.output_image;
  let t = Array.isArray(raw) ? asTensor(raw[0]) : asTensor(raw);

  while (t.dims.length > 2) {
    if (t.dims[0] === 1) {
      t = asTensor(t.squeeze(0));
    } else {
      t = asTensor(t[0]);
    }
  }

  if (t.dims.length !== 2) {
    throw new Error(`Unexpected mask shape: [${t.dims.join(", ")}]`);
  }

  const [mh, mw] = t.dims;
  const sig = t.sigmoid();
  const src = sig.data;
  const srcAlpha = new Float32Array(mh * mw);
  for (let i = 0; i < srcAlpha.length; i++) {
    srcAlpha[i] = Math.min(1, Math.max(0, Number(src[i] ?? 0)));
  }

  if (mw === outW && mh === outH) return srcAlpha;

  // Bicubic-ish smoother upsample (Catmull-Rom-lite via wider bilinear + sharpen)
  const out = new Float32Array(outW * outH);
  const xScale = (mw - 1) / Math.max(1, outW - 1);
  const yScale = (mh - 1) / Math.max(1, outH - 1);
  for (let y = 0; y < outH; y++) {
    const fy = y * yScale;
    const y0 = Math.floor(fy);
    const y1 = Math.min(mh - 1, y0 + 1);
    const wy = fy - y0;
    // Smoothstep for less blocky upscale
    const sy = wy * wy * (3 - 2 * wy);
    for (let x = 0; x < outW; x++) {
      const fx = x * xScale;
      const x0 = Math.floor(fx);
      const x1 = Math.min(mw - 1, x0 + 1);
      const wx = fx - x0;
      const sx = wx * wx * (3 - 2 * wx);
      const a00 = srcAlpha[y0 * mw + x0]!;
      const a01 = srcAlpha[y0 * mw + x1]!;
      const a10 = srcAlpha[y1 * mw + x0]!;
      const a11 = srcAlpha[y1 * mw + x1]!;
      out[y * outW + x] =
        a00 * (1 - sx) * (1 - sy) +
        a01 * sx * (1 - sy) +
        a10 * (1 - sx) * sy +
        a11 * sx * sy;
    }
  }
  return out;
}

function isDegenerateMask(alpha: Float32Array): boolean {
  let min = Infinity;
  let max = -Infinity;
  const n = Math.min(alpha.length, 4096);
  for (let i = 0; i < n; i++) {
    const v = alpha[i]!;
    if (v < min) min = v;
    if (v > max) max = v;
  }
  return max - min < 1e-3;
}

type BBox = { x0: number; y0: number; x1: number; y1: number };

function foregroundBBox(
  alpha: Float32Array,
  width: number,
  height: number,
  thresh = 0.35,
): BBox | null {
  let x0 = width;
  let y0 = height;
  let x1 = -1;
  let y1 = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (alpha[y * width + x]! >= thresh) {
        if (x < x0) x0 = x;
        if (y < y0) y0 = y;
        if (x > x1) x1 = x;
        if (y > y1) y1 = y;
      }
    }
  }
  if (x1 < x0 || y1 < y0) return null;
  return { x0, y0, x1, y1 };
}

function padBBox(box: BBox, width: number, height: number, padRatio = 0.12): BBox {
  const bw = box.x1 - box.x0 + 1;
  const bh = box.y1 - box.y0 + 1;
  const pad = Math.max(16, Math.round(Math.max(bw, bh) * padRatio));
  return {
    x0: Math.max(0, box.x0 - pad),
    y0: Math.max(0, box.y0 - pad),
    x1: Math.min(width - 1, box.x1 + pad),
    y1: Math.min(height - 1, box.y1 + pad),
  };
}

function shouldRefine(box: BBox, width: number, height: number): boolean {
  const bw = box.x1 - box.x0 + 1;
  const bh = box.y1 - box.y0 + 1;
  const area = bw * bh;
  const imgArea = width * height;
  const frac = area / imgArea;
  // Subject already fills most of the frame — second pass won't help much
  if (frac > 0.82) return false;
  // Tiny / empty — skip
  if (frac < 0.02) return false;
  // Crop must be large enough to re-infer useful detail
  if (bw < 48 || bh < 48) return false;
  return true;
}

async function runModel(image: RawImage): Promise<Float32Array> {
  if (!model || !processor) throw new Error("Model not ready");
  const inputs = await processor(image);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const output = (await (model as any)({
    input_image: inputs.pixel_values,
  })) as Record<string, unknown>;
  return logitsToAlpha(output, image.width, image.height);
}

/**
 * Second pass: re-run the model on a tight subject crop so 512² pixels
 * focus on edges/hair instead of empty background. Biggest quality win
 * without changing the model license.
 */
async function cropAndRefine(
  image: RawImage,
  coarse: Float32Array,
  requestId: number,
): Promise<Float32Array> {
  const ow = image.width;
  const oh = image.height;
  const box0 = foregroundBBox(coarse, ow, oh);
  if (!box0) return coarse;
  const box = padBBox(box0, ow, oh);
  if (!shouldRefine(box, ow, oh)) return coarse;

  post({
    type: "status",
    status: "processing",
    message: "Cleaning fine edges…",
    requestId,
  });

  const cropW = box.x1 - box.x0 + 1;
  const cropH = box.y1 - box.y0 + 1;
  const cropped = await image.crop([box.x0, box.y0, box.x1, box.y1]);
  const refined = await runModel(cropped);

  // Paste refined alpha into full canvas
  const out = new Float32Array(coarse);
  for (let y = 0; y < cropH; y++) {
    for (let x = 0; x < cropW; x++) {
      const fi = (box.y0 + y) * ow + (box.x0 + x);
      const ri = y * cropW + x;
      // Feather 3px at crop border so seams don't show
      const edge = Math.min(x, y, cropW - 1 - x, cropH - 1 - y);
      if (edge >= 3) {
        out[fi] = refined[ri]!;
      } else {
        const t = edge / 3;
        out[fi] = coarse[fi]! * (1 - t) + refined[ri]! * t;
      }
    }
  }
  return out;
}

async function loadWasm() {
  if (model) {
    try {
      await model.dispose();
    } catch {
      /* ignore */
    }
    model = null;
  }
  model = await AutoModel.from_pretrained(BG_REMOVAL.MODEL_ID, {
    device: "wasm",
    dtype: "fp32",
    progress_callback: onProgress,
  });
  backend = "wasm";
}

async function ensureModel() {
  if (model && processor) return;

  post({
    type: "status",
    status: "loading",
    message: "Getting ready…",
  });

  const hasGpu = typeof navigator !== "undefined" && "gpu" in navigator;
  if (hasGpu) {
    try {
      model = await AutoModel.from_pretrained(BG_REMOVAL.MODEL_ID, {
        device: "webgpu",
        dtype: "fp16",
        progress_callback: onProgress,
      });
      backend = "webgpu";
    } catch (err) {
      console.warn("[bg-remover] WebGPU failed, falling back to WASM", err);
      post({
        type: "status",
        status: "loading",
        message: "Optimizing for your device…",
      });
    }
  }

  if (!model) {
    await loadWasm();
  }

  processor = await AutoProcessor.from_pretrained(BG_REMOVAL.MODEL_ID, {
    progress_callback: onProgress,
  });

  post({
    type: "ready",
    backend,
    model: BG_REMOVAL.MODEL_NAME,
    version: BG_REMOVAL.MODEL_VERSION,
  });
}

self.onmessage = async (event: MessageEvent<InMsg>) => {
  const data = event.data;
  if (!data?.type) return;

  try {
    if (data.type === "init") {
      await ensureModel();
      return;
    }

    if (data.type === "process") {
      await ensureModel();
      if (!model || !processor) throw new Error("Model not ready");

      post({
        type: "status",
        status: "processing",
        message: "Finding your subject…",
        requestId: data.requestId,
      });

      const blob = new Blob([data.buffer], { type: data.mime || "image/png" });
      const image = (await RawImage.fromBlob(blob)).rgb();
      const ow = image.width;
      const oh = image.height;

      let alpha = await runModel(image);
      if (backend === "webgpu" && isDegenerateMask(alpha)) {
        post({
          type: "status",
          status: "loading",
          message: "Trying another path…",
          requestId: data.requestId,
        });
        await loadWasm();
        alpha = await runModel(image);
      }

      // Detail pass — subject fills the 512 window
      try {
        alpha = await cropAndRefine(image, alpha, data.requestId);
      } catch (err) {
        console.warn("[bg-remover] refine pass skipped", err);
      }

      const rgbaImg = image.rgba();
      const rgb = new Uint8ClampedArray(ow * oh * 4);
      rgb.set(rgbaImg.data);

      post(
        {
          type: "result",
          requestId: data.requestId,
          width: ow,
          height: oh,
          alpha,
          rgba: rgb.buffer,
          backend,
          model: BG_REMOVAL.MODEL_NAME,
          version: BG_REMOVAL.MODEL_VERSION,
          pipeline: BG_REMOVAL.PIPELINE_VERSION,
        },
        [alpha.buffer, rgb.buffer],
      );
    }
  } catch (err) {
    post({
      type: "error",
      message: err instanceof Error ? err.message : String(err),
      requestId: data.type === "process" ? data.requestId : undefined,
    });
  }
};

export {};
