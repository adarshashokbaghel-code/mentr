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

const WORK_ROOT = "/mnt/mentr";

function safeRel(path) {
  const parts = String(path || "")
    .replace(/\\/g, "/")
    .split("/")
    .filter(Boolean);
  if (!parts.length || parts.some((part) => part === "." || part === "..")) return null;
  return parts.join("/");
}

function ensureDir(FS, dir) {
  if (typeof FS.mkdirTree === "function") {
    FS.mkdirTree(dir);
    return;
  }
  let current = "";
  for (const part of String(dir).split("/").filter(Boolean)) {
    current += `/${part}`;
    try {
      FS.mkdir(current);
    } catch {
      // Already created.
    }
  }
}

function currentDir(py) {
  try {
    if (typeof py.FS.cwd === "function") return py.FS.cwd();
  } catch {
    // Fall through to the Python process directory.
  }
  return "/home/pyodide";
}

function clearWorkspaceModules(py) {
  py.runPython(`
import sys
root = ${JSON.stringify(WORK_ROOT)}
for name, mod in list(sys.modules.items()):
    path = getattr(mod, "__file__", None)
    if isinstance(path, str) and (path == root or path.startswith(root + "/")):
        del sys.modules[name]
for entry in list(sys.path):
    if entry == root or (isinstance(entry, str) and entry.startswith(root + "/")):
        sys.path.remove(entry)
`);
}

function mountWorkspace(py, files) {
  const FS = py.FS;
  clearWorkspaceModules(py);
  const wipe = (dir) => {
    let names = [];
    try {
      names = FS.readdir(dir);
    } catch {
      return;
    }
    for (const name of names) {
      if (name === "." || name === "..") continue;
      const child = `${dir}/${name}`;
      if (FS.isDir(FS.stat(child).mode)) wipe(child);
      else {
        try {
          FS.unlink(child);
        } catch {
          // Already gone.
        }
      }
    }
    if (dir !== WORK_ROOT) {
      try {
        FS.rmdir(dir);
      } catch {
        // Directory still in use.
      }
    }
  };
  try {
    if (!FS.analyzePath(WORK_ROOT).exists) ensureDir(FS, WORK_ROOT);
  } catch {
    try {
      ensureDir(FS, WORK_ROOT);
    } catch {
      // Root already exists.
    }
  }
  wipe(WORK_ROOT);
  for (const file of files || []) {
    const rel = safeRel(file && file.path);
    if (!rel) continue;
    const full = `${WORK_ROOT}/${rel}`;
    const dir = full.slice(0, full.lastIndexOf("/"));
    try {
      ensureDir(FS, dir);
    } catch {
      // Parent already exists.
    }
    if (!file.kind || file.kind === "file") FS.writeFile(full, String(file.content ?? ""));
  }
}

function armImports(py, filename) {
  const rel = safeRel(filename) || "main.py";
  const full = `${WORK_ROOT}/${rel}`;
  const scriptDir = full.slice(0, full.lastIndexOf("/"));
  const pkg = rel.includes("/") ? rel.slice(0, rel.lastIndexOf("/")).replaceAll("/", ".") : "";
  py.runPython(`
import sys, os
root = ${JSON.stringify(WORK_ROOT)}
script_dir = ${JSON.stringify(scriptDir)}
os.chdir(script_dir)
sys.path.insert(0, script_dir)
if root != script_dir and root not in sys.path:
    sys.path.insert(1, root)
`);
  return { full, pkg };
}

function parseError(err, filename) {
  const raw = String(err && err.message ? err.message : err);
  const lines = raw.replace(/\s+$/, "").split("\n");
  const marker = filename ? `File "${filename}"` : 'File "main.py"';
  const start = lines.findIndex((l) => l.includes(marker) || l.includes('File "/mnt/mentr/') || l.includes('File "main.py"'));
  const traceback = (start >= 0 ? ["Traceback (most recent call last):", ...lines.slice(start)].join("\n") : lines[lines.length - 1]).replaceAll(
    `File "${WORK_ROOT}/`,
    'File "',
  );
  let line;
  let file;
  for (const l of lines) {
    const m = /File "([^"]+)", line (\d+)/.exec(l);
    if (m) {
      file = m[1];
      line = Number(m[2]);
    }
  }
  const entry = filename || "main.py";
  const inEntry = file === entry || file === "main.py" || (file && file.endsWith(`/${entry}`));
  const last = lines[lines.length - 1] || "Error";
  const colon = last.indexOf(":");
  const type = (err && err.type) || (colon > 0 ? last.slice(0, colon) : "Error");
  const message = colon > 0 ? last.slice(colon + 1).trim() : last;
  return { type, message, line: inEntry ? line : undefined, traceback };
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

async function run({ id, code, stdin, packages, maxOutput, inputBuffer, files, filename }) {
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
  const linked = Array.isArray(files) && files.length > 0;
  const entryName = linked ? filename || "main.py" : "main.py";
  let result = { ok: true, error: null };
  const previousDir = currentDir(py);
  try {
    if (packages) {
      const sources = linked ? [code, ...files.map((file) => String(file.content || ""))].join("\n") : code;
      await py.loadPackagesFromImports(sources, {
        messageCallback: (m) => post({ type: "status", id, message: m }),
        errorCallback: (m) => post({ type: "status", id, message: m }),
      });
    }
    let runFile = "main.py";
    if (linked) {
      mountWorkspace(py, files);
      const armed = armImports(py, entryName);
      runFile = armed.full;
      ns.set("__file__", armed.full);
      if (armed.pkg) ns.set("__package__", armed.pkg);
    }
    post({ type: "started", id });
    const t0 = performance.now();
    try {
      await py.runPythonAsync(code, { globals: ns, filename: runFile });
    } catch (e) {
      result = { ok: false, error: parseError(e, runFile) };
    }
    result.durationMs = Math.round(performance.now() - t0);
  } catch (e) {
    result = { ok: false, error: parseError(e, linked ? `${WORK_ROOT}/${safeRel(entryName) || "main.py"}` : "main.py"), durationMs: 0 };
  } finally {
    if (linked) {
      try {
        clearWorkspaceModules(py);
      } catch {
        // Import state already cleared.
      }
      try {
        py.FS.chdir(previousDir);
      } catch {
        // Previous directory is gone.
      }
    }
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

/** live-py-tutor's tracer, loaded once into its own module so its frames are not part of the user's trace. */
let traceFn = null;
let traceNs = null;
let loadingTracer = null;

function ensureTracer() {
  if (traceFn) return Promise.resolve(traceFn);
  if (!loadingTracer) {
    loadingTracer = (async () => {
      const res = await fetch(new URL("/live-py-tutor/run.py?v=5", self.location.origin));
      if (!res.ok) throw new Error("Could not load the visualizer");
      const ns = pyodide.globals.get("dict")();
      ns.set("__name__", "mentr_live_tutor");
      ns.set("__builtins__", pyodide.globals.get("__builtins__"));
      const fn = pyodide.runPython(await res.text(), { globals: ns });
      traceNs = ns;
      traceFn = fn;
      return fn;
    })().catch((err) => {
      loadingTracer = null;
      throw err;
    });
  }
  return loadingTracer;
}

function stdinLines(stdin) {
  if (!stdin) return [];
  return stdin.replace(/\r\n/g, "\n").replace(/\n$/, "").split("\n");
}

async function traceProgram({ id, code, stdin, inputBuffer, files, filename }) {
  const linked = Array.isArray(files) && files.length > 0;
  const previousDir = linked ? currentDir(pyodide) : "";
  try {
    if (linked) {
      mountWorkspace(pyodide, files);
      armImports(pyodide, filename || "main.py");
    }
    const fn = await ensureTracer();
    // Same contract as Run: one read is one line. The prefilled Input box is used first;
    // with inputBuffer, the next input() pauses until the page sends a line.
    traceNs.set("_mentr_lines", stdinLines(stdin));
    traceNs.set("mentr_trace_fetch", inputBuffer ? () => waitForLine(id, inputBuffer) : () => null);
    traceNs.set(
      "mentr_trace_hook",
      inputBuffer
        ? (text) => {
            const s = String(text);
            if (s) post({ type: "output", id, stream: "stdout", text: s });
          }
        : null,
    );
    pyodide.runPython(
      "raw_input_wrapper.queue = list(_mentr_lines)\nraw_input_wrapper.fetch = mentr_trace_fetch\n_StdoutTee.hook = mentr_trace_hook",
      { globals: traceNs },
    );
    const raw = fn(code);
    const text = typeof raw === "string" ? raw : String(raw);
    if (raw && typeof raw.destroy === "function") raw.destroy();
    post({ type: "trace", id, ok: true, data: JSON.parse(text) });
  } catch (err) {
    const message = String(err && err.message ? err.message : err).replace(/\s+$/, "");
    const last = message.split("\n").pop() || "Could not visualize this program";
    post({ type: "trace", id, ok: false, error: last });
  } finally {
    try {
      if (traceNs) pyodide.runPython("_StdoutTee.hook = None\nraw_input_wrapper.fetch = None", { globals: traceNs });
    } catch {
      // Tracer already finished.
    }
    try {
      pyodide.runPython("import sys\nsys.settrace(None)");
    } catch {
      // Tracer already finished.
    }
    if (linked) {
      try {
        clearWorkspaceModules(pyodide);
      } catch {
        // Import state already cleared.
      }
      try {
        pyodide.FS.chdir(previousDir);
      } catch {
        // Previous directory is gone.
      }
    }
  }
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
    return;
  }
  if (msg.type === "trace") {
    await booting;
    if (!pyodide) {
      post({ type: "trace", id: msg.id, ok: false, error: "Python is not loaded" });
      return;
    }
    await traceProgram(msg);
  }
};
