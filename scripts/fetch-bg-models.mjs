#!/usr/bin/env node
/**
 * Download Background Remover ONNX + ORT wasm into public/ for same-origin serving.
 * Run on postinstall / prebuild so production never depends on Hugging Face or jsDelivr.
 *
 * Usage: node scripts/fetch-bg-models.mjs
 */

import { createWriteStream, existsSync, mkdirSync, copyFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const MODEL_DIR = join(ROOT, "public/models/birefnet-lite-512");
const ORT_DIR = join(ROOT, "public/ort");

const HF = "https://huggingface.co/studioludens/birefnet-lite-512/resolve/main";

const MODEL_FILES = [
  { url: `${HF}/config.json`, dest: join(MODEL_DIR, "config.json"), minBytes: 20 },
  {
    url: `${HF}/preprocessor_config.json`,
    dest: join(MODEL_DIR, "preprocessor_config.json"),
    minBytes: 50,
  },
  // fp16 only (~94 MB) — never ship the 192 MB fp32 graph
  {
    url: `${HF}/onnx/model_fp16.onnx`,
    dest: join(MODEL_DIR, "onnx/model_fp16.onnx"),
    minBytes: 50_000_000,
  },
];

const ORT_COPIES = [
  "ort-wasm-simd-threaded.mjs",
  "ort-wasm-simd-threaded.wasm",
  "ort-wasm-simd-threaded.asyncify.mjs",
  "ort-wasm-simd-threaded.asyncify.wasm",
  "ort-wasm-simd-threaded.jsep.mjs",
  "ort-wasm-simd-threaded.jsep.wasm",
];

function log(msg) {
  console.log(`[fetch-bg-models] ${msg}`);
}

async function download(url, dest, minBytes) {
  if (existsSync(dest)) {
    const { size } = await import("node:fs").then((fs) => fs.statSync(dest));
    if (size >= minBytes) {
      log(`skip (exists) ${dest.replace(ROOT + "/", "")} ${(size / 1e6).toFixed(1)} MB`);
      return;
    }
  }
  mkdirSync(dirname(dest), { recursive: true });
  log(`download ${url}`);
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok || !res.body) {
    throw new Error(`Failed ${res.status} ${url}`);
  }
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
  const { size } = await import("node:fs").then((fs) => fs.statSync(dest));
  if (size < minBytes) {
    throw new Error(`Too small after download: ${dest} (${size} bytes)`);
  }
  log(`ok ${dest.replace(ROOT + "/", "")} ${(size / 1e6).toFixed(1)} MB`);
}

function copyOrt() {
  mkdirSync(ORT_DIR, { recursive: true });
  const fromDir = join(ROOT, "node_modules/onnxruntime-web/dist");
  for (const name of ORT_COPIES) {
    const from = join(fromDir, name);
    const to = join(ORT_DIR, name);
    if (!existsSync(from)) {
      log(`warn missing ${name} — skip`);
      continue;
    }
    copyFileSync(from, to);
    log(`copy ort/${name}`);
  }
}

async function main() {
  mkdirSync(join(MODEL_DIR, "onnx"), { recursive: true });
  writeFileSync(
    join(MODEL_DIR, "NOTICE.txt"),
    [
      "BiRefNet_lite browser export (MIT)",
      "Source: https://huggingface.co/studioludens/birefnet-lite-512",
      "Upstream: https://github.com/ZhengPeng7/BiRefNet",
      "Served same-origin by Mentr for reliable mobile loading.",
      "",
    ].join("\n"),
  );

  for (const f of MODEL_FILES) {
    await download(f.url, f.dest, f.minBytes);
  }
  copyOrt();
  log("done");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
