/**
 * Mentr Python runtime worker (ES module). Runs Pyodide (CPython → WebAssembly) off the main thread.
 * Protocol is mirrored in src/lib/python/protocol.ts — keep the two in sync and bump WORKER_REVISION.
 */

/** @type {any} */
let pyodide = null;
/** @type {Promise<void> | null} */
let booting = null;

const post = (msg) => self.postMessage(msg);

/** Big files fetched with progress; the HTTP cache then serves them to Pyodide instantly. */
const PREFETCH = ["pyodide.asm.wasm", "python_stdlib.zip", "pyodide.asm.mjs"];

async function prefetch(indexURL) {
  let sizes = null;
  try {
    const res = await fetch(`${indexURL}manifest.json`);
    if (res.ok) sizes = (await res.json()).sizes;
  } catch {
    // Progress becomes indeterminate; loading still works.
  }
  const total = sizes ? PREFETCH.reduce((a, f) => a + (sizes[f] || 0), 0) : 0;
  let loaded = 0;
  let lastPost = 0;
  await Promise.all(
    PREFETCH.map(async (file) => {
      const res = await fetch(indexURL + file);
      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status} for ${file}`);
      const reader = res.body.getReader();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        loaded += value.byteLength;
        const now = Date.now();
        if (total && now - lastPost > 80) {
          lastPost = now;
          post({ type: "progress", loaded: Math.min(loaded, total), total });
        }
      }
    }),
  );
  if (total) post({ type: "progress", loaded: total, total });
}

async function boot(indexURL, packageBaseUrl) {
  await prefetch(indexURL);
  post({ type: "starting" });
  const { loadPyodide } = await import(`${indexURL}pyodide.mjs`);
  return loadPyodide({ indexURL, packageBaseUrl });
}

async function init({ indexURL, fallbackIndexURL, packageBaseUrl }) {
  let source = "self";
  try {
    pyodide = await boot(indexURL, packageBaseUrl);
  } catch (first) {
    source = "cdn";
    post({ type: "fallback", reason: String(first && first.message ? first.message : first) });
    pyodide = await boot(fallbackIndexURL, packageBaseUrl);
  }
  const pythonVersion = pyodide.runPython("import sys; sys.version.split()[0]");
  post({ type: "ready", source, pythonVersion, pyodideVersion: pyodide.version });
}

function parseError(err) {
  const raw = String(err && err.message ? err.message : err);
  const lines = raw.replace(/\s+$/, "").split("\n");
  const start = lines.findIndex((l) => l.includes('File "main.py"'));
  const traceback = start >= 0 ? ["Traceback (most recent call last):", ...lines.slice(start)].join("\n") : lines[lines.length - 1];
  let line;
  for (const l of lines) {
    const m = /File "main\.py", line (\d+)/.exec(l);
    if (m) line = Number(m[1]);
  }
  const last = lines[lines.length - 1] || "Error";
  const colon = last.indexOf(":");
  const type = (err && err.type) || (colon > 0 ? last.slice(0, colon) : "Error");
  const message = colon > 0 ? last.slice(colon + 1).trim() : last;
  return { type, message, line, traceback };
}

/** Blocks this worker until the page writes a line into the shared buffer. Returns null at end of input. */
function waitForLine(id, sab) {
  const ctrl = new Int32Array(sab, 0, 2);
  Atomics.store(ctrl, 0, 0);
  post({ type: "input-request", id });
  while (Atomics.load(ctrl, 0) === 0) Atomics.wait(ctrl, 0, 0);
  const len = Atomics.load(ctrl, 1);
  if (len < 0) return null;
  return new TextDecoder().decode(new Uint8Array(sab, 8, len).slice());
}

async function run({ id, code, stdin, packages, maxOutput, inputBuffer }) {
  const py = pyodide;
  let size = 0;
  let truncated = false;
  let buf = "";
  let stream = "stdout";
  let lastFlush = Date.now();

  const flush = () => {
    if (buf) post({ type: "output", id, stream, text: buf });
    buf = "";
    lastFlush = Date.now();
  };
  const emit = (s, text) => {
    if (truncated || !text) return;
    if (s !== stream) {
      flush();
      stream = s;
    }
    if (size + text.length > maxOutput) {
      text = text.slice(0, Math.max(0, maxOutput - size));
      truncated = true;
    }
    size += text.length;
    buf += text;
    if (buf.length > 4096 || Date.now() - lastFlush > 40) flush();
  };

  const out = new TextDecoder();
  const err = new TextDecoder();
  py.setStdout({ write: (b) => (emit("stdout", out.decode(b, { stream: true })), b.length) });
  py.setStderr({ write: (b) => (emit("stderr", err.decode(b, { stream: true })), b.length) });

  if (inputBuffer) {
    // Low-level reader: one read() returns at most one typed line, like a terminal. The `stdin` option would keep
    // asking for more lines to fill Python's buffer before returning the first one.
    const enc = new TextEncoder();
    let pending = new Uint8Array(0);
    py.setStdin({
      read: (buffer) => {
        if (!pending.length) {
          flush();
          const line = waitForLine(id, inputBuffer);
          if (line === null) return 0;
          emit("stdin", `${line}\n`);
          pending = enc.encode(`${line}\n`);
        }
        const n = Math.min(pending.length, buffer.length);
        buffer.set(pending.subarray(0, n));
        pending = pending.subarray(n);
        return n;
      },
    });
  } else {
    const queue = stdin ? stdin.replace(/\r\n/g, "\n").replace(/\n$/, "").split("\n") : [];
    py.setStdin({
      stdin: () => {
        if (!queue.length) return null;
        const line = queue.shift();
        emit("stdin", `${line}\n`);
        return `${line}\n`;
      },
      autoEOF: false,
    });
  }

  // Print each line as it happens instead of in blocks, like a terminal.
  py.runPython("import sys\nsys.stdout.reconfigure(line_buffering=True)\nsys.stderr.reconfigure(line_buffering=True)");

  const ns = py.globals.get("dict")();
  ns.set("__name__", "__main__");
  let result = { ok: true, error: null };
  try {
    if (packages) {
      await py.loadPackagesFromImports(code, {
        messageCallback: (m) => post({ type: "status", id, message: m }),
        errorCallback: (m) => post({ type: "status", id, message: m }),
      });
    }
    post({ type: "started", id });
    const t0 = performance.now();
    try {
      await py.runPythonAsync(code, { globals: ns, filename: "main.py" });
    } catch (e) {
      result = { ok: false, error: parseError(e) };
    }
    result.durationMs = Math.round(performance.now() - t0);
  } catch (e) {
    result = { ok: false, error: parseError(e), durationMs: 0 };
  } finally {
    try {
      py.runPython("import sys\nsys.stdout.flush()\nsys.stderr.flush()");
    } catch {
      // Streams already closed.
    }
    emit("stdout", out.decode());
    emit("stderr", err.decode());
    flush();
    ns.destroy();
  }
  post({ type: "done", id, ok: result.ok, error: result.error, durationMs: result.durationMs || 0, truncated });
}

self.onmessage = async (e) => {
  const msg = e.data;
  if (msg.type === "init") {
    booting ??= init(msg).catch((err) => {
      booting = null;
      post({ type: "init-error", message: String(err && err.message ? err.message : err) });
    });
    return;
  }
  if (msg.type === "run") {
    await booting;
    if (!pyodide) {
      post({ type: "done", id: msg.id, ok: false, error: { type: "RuntimeError", message: "Python is not loaded", traceback: "" }, durationMs: 0, truncated: false });
      return;
    }
    await run(msg);
  }
};
