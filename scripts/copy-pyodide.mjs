#!/usr/bin/env node
/**
 * Copy the Pyodide runtime from node_modules into public/ so Python loads same-origin
 * (Vercel CDN, immutable cache) instead of depending on a third-party CDN.
 *
 * Usage: node scripts/copy-pyodide.mjs   (runs on predev:next and prebuild)
 */

import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "node_modules/pyodide");
const PUBLIC_DIR = join(ROOT, "public/pyodide");

const FILES = ["pyodide.mjs", "pyodide.asm.mjs", "pyodide.asm.wasm", "python_stdlib.zip", "pyodide-lock.json"];

function log(msg) {
  console.log(`[copy-pyodide] ${msg}`);
}

function expectedVersion() {
  const config = readFileSync(join(ROOT, "src/lib/python/config.ts"), "utf8");
  const m = /PYODIDE_VERSION\s*=\s*"([^"]+)"/.exec(config);
  if (!m) throw new Error("PYODIDE_VERSION not found in src/lib/python/config.ts");
  return m[1];
}

function main() {
  if (!existsSync(SRC)) throw new Error("node_modules/pyodide is missing. Run npm install.");
  const installed = JSON.parse(readFileSync(join(SRC, "package.json"), "utf8")).version;
  const expected = expectedVersion();
  if (installed !== expected) {
    throw new Error(`pyodide ${installed} is installed but src/lib/python/config.ts expects ${expected}.`);
  }

  const dest = join(PUBLIC_DIR, `v${installed}`);
  mkdirSync(dest, { recursive: true });

  const sizes = {};
  for (const name of FILES) {
    const from = join(SRC, name);
    if (!existsSync(from)) throw new Error(`Missing ${name} in node_modules/pyodide`);
    const to = join(dest, name);
    const size = statSync(from).size;
    if (!existsSync(to) || statSync(to).size !== size) copyFileSync(from, to);
    sizes[name] = size;
  }
  writeFileSync(join(dest, "manifest.json"), JSON.stringify({ version: installed, sizes }, null, 2));

  for (const entry of readdirSync(PUBLIC_DIR)) {
    if (entry !== `v${installed}`) {
      rmSync(join(PUBLIC_DIR, entry), { recursive: true, force: true });
      log(`removed old ${entry}`);
    }
  }
  const total = Object.values(sizes).reduce((a, b) => a + b, 0);
  log(`ready public/pyodide/v${installed} (${(total / 1e6).toFixed(1)} MB uncompressed)`);
}

try {
  main();
} catch (err) {
  console.error(`[copy-pyodide] ${err.message}`);
  process.exit(1);
}
