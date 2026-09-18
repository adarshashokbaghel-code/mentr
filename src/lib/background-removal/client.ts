"use client";

import { BG_REMOVAL } from "@/lib/background-removal/config";
import {
  composeRgba,
  decontaminateEdges,
  enhanceAlpha,
  rgbaToPngBlob,
} from "@/lib/background-removal/postprocess";

export type BgRemovalProgress = {
  phase: "idle" | "loading" | "processing" | "ready" | "error";
  message: string;
  progress?: number;
  backend?: string;
};

export type BgRemovalResult = {
  pngBlob: Blob;
  width: number;
  height: number;
  backend: string;
  model: string;
  version: string;
  pipeline: string;
  objectUrl: string;
};

type WorkerResultMsg = {
  type: "result";
  requestId: number;
  width: number;
  height: number;
  alpha: Float32Array;
  rgba: ArrayBuffer;
  backend: string;
  model: string;
  version: string;
  pipeline: string;
};

/**
 * Lazy Web Worker client for local background removal.
 * Do not construct on /tools hub — only on the tool page.
 */
export class BackgroundRemovalClient {
  private worker: Worker | null = null;
  private requestId = 0;
  private pending = new Map<
    number,
    {
      resolve: (v: WorkerResultMsg) => void;
      reject: (e: Error) => void;
    }
  >();
  private onProgress: ((p: BgRemovalProgress) => void) | null = null;

  setProgressHandler(fn: ((p: BgRemovalProgress) => void) | null) {
    this.onProgress = fn;
  }

  private emit(p: BgRemovalProgress) {
    this.onProgress?.(p);
  }

  private ensureWorker() {
    if (this.worker) return;
    this.worker = new Worker(
      new URL("./worker.ts", import.meta.url),
      { type: "module" },
    );
    this.worker.onmessage = (ev: MessageEvent) => {
      const msg = ev.data as Record<string, unknown>;
      if (msg.type === "progress") {
        this.emit({
          phase: "loading",
          message: "Setting things up…",
          progress: Number(msg.progress ?? 0),
        });
        return;
      }
      if (msg.type === "status") {
        this.emit({
          phase: msg.status === "processing" ? "processing" : "loading",
          message: String(msg.message ?? "Working…"),
        });
        return;
      }
      if (msg.type === "ready") {
        this.emit({
          phase: "ready",
          message: "Ready",
          backend: String(msg.backend ?? ""),
        });
        return;
      }
      if (msg.type === "result") {
        const id = Number(msg.requestId);
        const p = this.pending.get(id);
        if (p) {
          this.pending.delete(id);
          p.resolve(msg as unknown as WorkerResultMsg);
        }
        return;
      }
      if (msg.type === "error") {
        const id = msg.requestId != null ? Number(msg.requestId) : null;
        const err = new Error(String(msg.message ?? "Processing failed"));
        if (id != null && this.pending.has(id)) {
          this.pending.get(id)!.reject(err);
          this.pending.delete(id);
        } else {
          this.emit({ phase: "error", message: err.message });
        }
      }
    };
    this.worker.onerror = (e) => {
      this.emit({
        phase: "error",
        message: e.message || "Worker crashed",
      });
    };
  }

  /** Warm model download without an image (optional). */
  async init() {
    this.ensureWorker();
    this.emit({
      phase: "loading",
      message: "Getting ready…",
    });
    this.worker!.postMessage({ type: "init" });
  }

  async process(blob: Blob): Promise<BgRemovalResult> {
    this.ensureWorker();
    const id = ++this.requestId;
    const buffer = await blob.arrayBuffer();

    const result = await new Promise<WorkerResultMsg>((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.worker!.postMessage(
        {
          type: "process",
          buffer,
          mime: blob.type || "image/png",
          requestId: id,
        },
        [buffer],
      );
    });

    const alphaRaw = result.alpha;
    const rgbaSrc = new Uint8ClampedArray(result.rgba);
    const { width, height } = result;

    const alpha = enhanceAlpha(alphaRaw, rgbaSrc, width, height);
    const cleaned = decontaminateEdges(rgbaSrc, alpha, width, height);
    const composed = composeRgba(cleaned, alpha, width, height);
    const pngBlob = await rgbaToPngBlob(composed);
    const objectUrl = URL.createObjectURL(pngBlob);

    return {
      pngBlob,
      width,
      height,
      backend: result.backend,
      model: result.model || BG_REMOVAL.MODEL_NAME,
      version: result.version || BG_REMOVAL.MODEL_VERSION,
      pipeline: result.pipeline || BG_REMOVAL.PIPELINE_VERSION,
      objectUrl,
    };
  }

  dispose() {
    for (const [, p] of this.pending) {
      p.reject(new Error("Cancelled"));
    }
    this.pending.clear();
    this.worker?.terminate();
    this.worker = null;
  }
}
