import { cn } from "@/lib/utils";
import {
  ArrowDown,
  ArrowRight,
  ArrowLeftRight,
  Cpu,
  FileCode2,
  Globe,
  HardDrive,
  Keyboard,
  Laptop,
  Layers,
  MonitorSmartphone,
  Server,
  ShieldCheck,
  Smartphone,
  Timer,
  Zap,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

const COMPILER = "/openpythoncompiler";

const SECTIONS = [
  ["problem", "The problem"],
  ["overview", "The big picture"],
  ["runtime", "1. Python in the browser"],
  ["worker", "2. A worker keeps the page smooth"],
  ["run", "3. What happens when you press Run"],
  ["input", "4. Making input() work"],
  ["safety", "5. Safety nets"],
  ["errors", "6. Errors a beginner can read"],
  ["editor", "7. The editor"],
  ["devices", "8. Phone and desktop"],
  ["saving", "9. Saving your work"],
  ["packages", "10. numpy and friends"],
  ["limits", "What it can't do"],
  ["numbers", "The numbers"],
] as const;

function Section({ id, kicker, title, children }: { id: string; kicker: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-hairline pt-10">
      <p className="font-mono text-[11.5px] uppercase tracking-[0.16em] text-coral">{kicker}</p>
      <h2 className="mt-1.5 text-[26px] font-extrabold leading-tight tracking-tight sm:text-[30px]">{title}</h2>
      <div className="mt-4 space-y-4 text-[16px] leading-[1.75] text-ink/85">{children}</div>
    </section>
  );
}

function Code({ title, children }: { title: string; children: string }) {
  return (
    <figure className="overflow-hidden border border-[#2a332d] bg-[#0f1411]">
      <figcaption className="flex items-center gap-2 border-b border-white/10 px-4 py-2 font-mono text-[11px] text-white/45">
        <FileCode2 className="h-3.5 w-3.5" /> {title}
      </figcaption>
      <pre className="overflow-x-auto px-4 py-3 font-mono text-[12.5px] leading-[1.7] text-[#e8ece9]">{children}</pre>
    </figure>
  );
}

function Note({ children, tone = "info" }: { children: ReactNode; tone?: "info" | "warn" }) {
  return (
    <div
      className={cn(
        "border-l-4 px-4 py-3 text-[15px] leading-relaxed",
        tone === "warn" ? "border-[#e0a83a] bg-[#fff7e6] text-[#5c4300]" : "border-[#2f9e6e] bg-[#eef8f2] text-[#1d4a35]",
      )}
    >
      {children}
    </div>
  );
}

function Box({ icon: Icon, title, sub, dark, className }: { icon: typeof Cpu; title: string; sub?: string; dark?: boolean; className?: string }) {
  return (
    <div className={cn("flex items-start gap-3 border px-4 py-3", dark ? "border-[#2a332d] bg-[#0f1612] text-white" : "border-hairline bg-white", className)}>
      <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", dark ? "text-[#5ee0a0]" : "text-[#2f9e6e]")} />
      <div className="min-w-0">
        <p className="text-[14.5px] font-bold leading-snug">{title}</p>
        {sub && <p className={cn("mt-0.5 text-[13px] leading-snug", dark ? "text-white/60" : "text-muted")}>{sub}</p>}
      </div>
    </div>
  );
}

function Flow({ steps }: { steps: { who: string; what: string }[] }) {
  return (
    <ol className="relative space-y-0 border border-hairline bg-white">
      {steps.map((s, i) => (
        <li key={i} className="flex gap-3 border-b border-hairline px-4 py-3 last:border-b-0">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-ink font-mono text-[11px] font-bold text-white">{i + 1}</span>
          <div className="min-w-0 text-[14.5px] leading-snug">
            <span className="mr-2 inline-block border border-hairline bg-[#faf8f4] px-1.5 py-px font-mono text-[10.5px] uppercase tracking-[0.08em] text-muted">
              {s.who}
            </span>
            {s.what}
          </div>
        </li>
      ))}
    </ol>
  );
}

function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto border border-hairline bg-white">
      <table className="w-full text-left text-[14px]">
        <thead className="bg-[#faf8f4] font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
          <tr>
            {head.map((h) => (
              <th key={h} className="px-4 py-2.5 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-hairline align-top">
              {r.map((c, j) => (
                <td key={j} className={cn("px-4 py-2.5", j === 0 && "font-semibold")}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const mono = (s: string) => <code className="bg-[#f1ede4] px-1 py-px font-mono text-[0.88em] text-ink">{s}</code>;

export function CompilerArchitectureArticle() {
  return (
    <article className="mx-auto w-full max-w-[1120px] px-4 pb-24 pt-10 sm:px-6 lg:px-8">
      <header className="max-w-[820px]">
        <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-coral">Engineering · Mentr Learn</p>
        <h1 className="mt-2 text-[34px] font-extrabold leading-[1.1] tracking-tight sm:text-[46px]">
          How we built a Python compiler that runs entirely in your browser
        </h1>
        <p className="mt-4 text-[17px] leading-relaxed text-muted sm:text-[18px]">
          No server runs your code. Python itself is downloaded once, then runs on your own phone or laptop. This is the full architecture,
          step by step, with the real numbers and the real trade-offs.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={COMPILER} className="inline-flex items-center gap-2 bg-ink px-5 py-3 text-[15px] font-bold text-white transition hover:bg-black">
            Try the compiler <ArrowRight className="h-4 w-4" />
          </Link>
          <a href="#overview" className="inline-flex items-center gap-2 border border-ink px-5 py-3 text-[15px] font-bold">
            Jump to the diagram
          </a>
        </div>
      </header>

      <div className="mt-10 grid grid-cols-2 gap-px border border-hairline bg-hairline md:grid-cols-4">
        {[
          ["0", "servers running your code"],
          ["Python 3.14.2", "real CPython, compiled to WebAssembly"],
          ["≈ 6.3 MB", "first visit (gzip), then cached"],
          ["1 codebase", "for phones and desktops"],
        ].map(([n, l]) => (
          <div key={l} className="bg-white px-5 py-5">
            <p className="text-[24px] font-extrabold leading-none sm:text-[28px]">{n}</p>
            <p className="mt-1.5 text-[13px] leading-snug text-muted">{l}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav aria-label="Contents" className="hidden lg:block">
          <div className="sticky top-24">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Contents</p>
            <ol className="mt-3 space-y-1.5 text-[13.5px]">
              {SECTIONS.map(([id, label]) => (
                <li key={id}>
                  <a href={`#${id}`} className="text-muted transition hover:text-ink">
                    {label}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>

        <div className="min-w-0 max-w-[780px] space-y-12">
          <Section id="problem" kicker="Why" title="The problem we were solving">
            <p>
              Our students learn Python in short lessons. Every lesson needs them to <b>run code</b>: in quick examples, in practice questions,
              in projects, and in a free-form compiler. Many of them are on a phone or a shared school laptop where they can&apos;t install
              anything.
            </p>
            <p>The usual answer is a server that receives code, runs it in a container and sends the output back. We didn&apos;t want that:</p>
            <ul className="list-disc space-y-1.5 pl-6">
              <li>
                <b>Running strangers&apos; code on our servers</b> is a security job of its own: sandboxing, resource limits, abuse.
              </li>
              <li>
                <b>Cost grows with every Run click.</b> A class of 40 students pressing Run every few seconds is a lot of containers.
              </li>
              <li>
                <b>Latency.</b> Every run is a network round trip, and <code>input()</code> becomes a chat between browser and server.
              </li>
            </ul>
            <p>
              So we flipped it: <b>ship Python to the browser once, and run everything on the student&apos;s device.</b>
            </p>
          </Section>

          <Section id="overview" kicker="Architecture" title="The big picture">
            <p>There are only three moving parts. Our server never sees or executes the program; it only serves static files.</p>
            <div className="border border-hairline bg-[#faf8f4] p-4 sm:p-6">
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Inside one browser tab</p>
              <div className="grid items-stretch gap-3 md:grid-cols-[1fr_auto_1fr]">
                <div className="space-y-2 border border-ink/15 bg-white p-3">
                  <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-ink">Main thread · React UI</p>
                  <Box icon={FileCode2} title="Editor" sub="textarea + syntax colours" />
                  <Box icon={Layers} title="Output console" sub="streams text as it arrives" />
                  <Box icon={Cpu} title="PythonEngine" sub="one per tab: start, run, stop, timeouts" />
                </div>
                <div className="flex flex-row items-center justify-center gap-2 py-1 md:flex-col">
                  <ArrowLeftRight className="h-6 w-6 rotate-90 text-[#2f9e6e] md:rotate-0" />
                  <p className="max-w-[120px] text-center font-mono text-[10.5px] leading-tight text-muted">postMessage + SharedArrayBuffer</p>
                </div>
                <div className="space-y-2 border border-[#2a332d] bg-[#0f1612] p-3 text-white">
                  <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#5ee0a0]">Web Worker · background thread</p>
                  <Box dark icon={Zap} title="Pyodide" sub="CPython 3.14.2 compiled to WebAssembly" />
                  <Box dark icon={HardDrive} title="Python standard library" sub="python_stdlib.zip, in-memory files" />
                  <Box dark icon={Keyboard} title="stdin / stdout / stderr" sub="wired to the page" />
                </div>
              </div>
              <div className="my-3 flex justify-center">
                <ArrowDown className="h-5 w-5 text-muted" />
              </div>
              <p className="mb-2 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Downloaded once, then cached for a year</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <Box icon={Server} title="mentr.in/pyodide/v314.0.7/" sub="our own copy of the runtime (first choice)" />
                <Box icon={Globe} title="cdn.jsdelivr.net" sub="backup copy, and optional packages like numpy" />
              </div>
            </div>
            <Note>
              The same engine powers four places: lesson examples, practice questions, Final Challenge projects and the full-screen compiler.
              Build it once, use it everywhere.
            </Note>
          </Section>

          <Section id="runtime" kicker="Step 1" title="Getting real Python into the browser">
            <p>
              Browsers only run JavaScript and <b>WebAssembly</b> (a compact binary format that runs at near-native speed). We use{" "}
              <a href="https://pyodide.org" className="font-semibold underline underline-offset-4" target="_blank" rel="noreferrer">
                Pyodide
              </a>
              , an open-source project that compiles the official CPython interpreter to WebAssembly. It is not a re-implementation: it is the
              same Python, so behaviour and error messages match what students will see on a real computer.
            </p>
            <p>These are the files a browser downloads the first time (sizes measured from our build):</p>
            <Table
              head={["File", "What it is", "Size", "Gzipped"]}
              rows={[
                [mono("pyodide.asm.wasm"), "The Python interpreter, compiled", "9.6 MB", "3.5 MB"],
                [mono("python_stdlib.zip"), "Standard library (math, random, json…)", "2.5 MB", "2.5 MB"],
                [mono("pyodide.asm.mjs"), "JavaScript glue for the WebAssembly", "1.25 MB", "0.26 MB"],
                [mono("pyodide.mjs"), "Loader", "18 KB", "7 KB"],
              ]}
            />
            <p>
              We <b>self-host</b> these files instead of loading them from a public CDN. A small build script copies them from the npm package
              into a versioned folder, {mono("public/pyodide/v314.0.7/")}. Because the version is in the path, the files never change, so we
              serve them with {mono("Cache-Control: immutable")} for a year. A second visit loads Python from the browser cache.
            </p>
            <Code title="scripts/copy-pyodide.mjs (runs before every dev start and build)">{`const installed = pkg.version;            // from node_modules/pyodide
const expected  = PYODIDE_VERSION;        // from src/lib/python/config.ts
if (installed !== expected) throw new Error("version mismatch");  // build fails

copy(["pyodide.mjs", "pyodide.asm.mjs", "pyodide.asm.wasm",
      "python_stdlib.zip", "pyodide-lock.json"], \`public/pyodide/v\${installed}\`);
write("manifest.json", { version, sizes });   // used for the progress bar
removeOlderVersions();`}</Code>
            <Note>
              If our own copy ever fails to load, the worker automatically retries from jsDelivr&apos;s copy of the exact same version, and
              the status line says &ldquo;Retrying from backup server&rdquo;.
            </Note>
          </Section>

          <Section id="worker" kicker="Step 2" title="A Web Worker keeps the page smooth">
            <p>
              Python runs in a <b>Web Worker</b>: a background thread with no access to the page. If a student writes{" "}
              {mono("while True: pass")}, only the worker is busy; buttons, scrolling and typing keep working, and the Stop button can still be
              pressed.
            </p>
            <p>
              On the page side, one {mono("PythonEngine")} object per tab owns the worker. It is a small state machine that every screen
              subscribes to (through React&apos;s {mono("useSyncExternalStore")}):
            </p>
            <div className="flex flex-wrap items-center gap-2 font-mono text-[12.5px]">
              {["idle", "loading", "ready", "running", "ready"].map((s, i, a) => (
                <span key={i} className="flex items-center gap-2">
                  <span className={cn("border px-2.5 py-1", s === "running" ? "border-[#2f9e6e] bg-[#eef8f2]" : "border-hairline bg-white")}>{s}</span>
                  {i < a.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-muted" />}
                </span>
              ))}
              <span className="ml-1 text-muted">(or error → Retry)</span>
            </div>
            <ul className="list-disc space-y-1.5 pl-6">
              <li>
                <b>Preload:</b> opening the compiler starts the download straight away, so Python is usually ready before the first Run.
              </li>
              <li>
                <b>Real progress bar:</b> the worker streams the three big files itself, counts bytes against the sizes in{" "}
                {mono("manifest.json")}, and reports progress. Pyodide then loads them instantly from the HTTP cache.
              </li>
              <li>
                <b>Live status:</b> the header shows &ldquo;Downloading Python · 42%&rdquo;, &ldquo;Starting Python&rdquo;, then &ldquo;Python
                3.14.2 · runs in your browser&rdquo;.
              </li>
            </ul>
          </Section>

          <Section id="run" kicker="Step 3" title="What happens when you press Run">
            <Flow
              steps={[
                { who: "page", what: "Clears the output and sends { type: \"run\", code, stdin } to the worker." },
                { who: "worker", what: "If the code imports a package such as numpy, installs it first (the status line shows progress)." },
                { who: "worker", what: "Connects Python's stdout and stderr to the page and turns on line buffering, so each print appears as it happens." },
                { who: "worker", what: "Runs the code as a file called main.py in a fresh namespace, so variables from the previous run don't leak in." },
                { who: "worker", what: "Batches output and sends it every 40 ms or 4 KB, whichever comes first. Streaming without flooding the page." },
                { who: "page", what: "Appends each chunk to the console: normal output in white, errors in red, typed input in green." },
                { who: "worker", what: "Sends done with success or error and the run time, e.g. \"finished in 12 ms\"." },
              ]}
            />
            <Code title="public/py-worker.js, simplified">{`py.setStdout({ write: (bytes) => emit("stdout", decode(bytes)) });
py.setStderr({ write: (bytes) => emit("stderr", decode(bytes)) });
py.runPython("import sys; sys.stdout.reconfigure(line_buffering=True)");

const ns = py.globals.get("dict")();       // fresh globals every run
ns.set("__name__", "__main__");
await py.runPythonAsync(code, { globals: ns, filename: "main.py" });`}</Code>
          </Section>

          <Section id="input" kicker="Step 4 · the hard part" title="Making input() feel like a real terminal">
            <p>
              Beginners&apos; programs are full of {mono('name = input("Your name? ")')}. In a terminal, Python <b>pauses</b> until you type.
              But a browser never lets JavaScript pause and wait; everything is asynchronous. So how does Python, running inside JavaScript,
              stop in the middle of a line and wait for the keyboard?
            </p>
            <p>
              The answer: the worker <b>does</b> block, on purpose, using a shared piece of memory that both threads can see.
            </p>
            <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
              <div className="border border-[#2a332d] bg-[#0f1612] p-4 text-white">
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#5ee0a0]">Worker (Python)</p>
                <ol className="mt-2 list-decimal space-y-1 pl-5 text-[13.5px] text-white/80">
                  <li>Python calls input() and wants bytes</li>
                  <li>Sets the flag to 0, posts &ldquo;input-request&rdquo;</li>
                  <li>
                    Sleeps on <code className="text-[#ffb27a]">Atomics.wait()</code>
                  </li>
                  <li>Wakes up, reads the line, Python continues</li>
                </ol>
              </div>
              <div className="flex flex-col items-center gap-1 text-center font-mono text-[10.5px] text-muted">
                <ArrowLeftRight className="h-6 w-6 text-[#2f9e6e]" />
                SharedArrayBuffer
              </div>
              <div className="border border-hairline bg-white p-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#1d6b49]">Page (you)</p>
                <ol className="mt-2 list-decimal space-y-1 pl-5 text-[13.5px] text-muted">
                  <li>Shows a blinking answer box right after the prompt</li>
                  <li>You type and press Enter</li>
                  <li>Writes the text into shared memory</li>
                  <li>
                    Sets the flag to 1 and calls <code>Atomics.notify()</code>
                  </li>
                </ol>
              </div>
            </div>
            <p>The shared buffer has a tiny, fixed layout:</p>
            <div className="flex overflow-x-auto font-mono text-[12px]">
              <div className="shrink-0 border border-ink/30 bg-[#fff7e6] px-3 py-2">
                Int32 [0]
                <br />
                <span className="text-muted">flag: 0 wait · 1 answered</span>
              </div>
              <div className="shrink-0 border border-l-0 border-ink/30 bg-[#eef5fb] px-3 py-2">
                Int32 [1]
                <br />
                <span className="text-muted">byte length · −1 = end</span>
              </div>
              <div className="min-w-[220px] flex-1 border border-l-0 border-ink/30 bg-[#eef8f2] px-3 py-2">
                bytes 8 … 65,543
                <br />
                <span className="text-muted">the typed line, UTF-8 (64 KB max)</span>
              </div>
            </div>
            <Code title="the worker side of input()">{`function waitForLine(id, sab) {
  const ctrl = new Int32Array(sab, 0, 2);
  Atomics.store(ctrl, 0, 0);                  // "I'm waiting"
  post({ type: "input-request", id });
  while (Atomics.load(ctrl, 0) === 0) Atomics.wait(ctrl, 0, 0);
  const len = Atomics.load(ctrl, 1);
  if (len < 0) return null;                   // Ctrl+D → EOFError in Python
  return new TextDecoder().decode(new Uint8Array(sab, 8, len).slice());
}`}</Code>
            <p>Three details that matter:</p>
            <ul className="list-disc space-y-1.5 pl-6">
              <li>
                <b>One line per read.</b> We give Python a low-level reader that returns exactly one typed line, like a terminal. A
                higher-level option kept asking for more lines before returning the first.
              </li>
              <li>
                <b>Thinking time is free.</b> The run timer is paused while the program waits for you, and restarts when you press Enter.
              </li>
              <li>
                <b>Ctrl+D</b> in an empty answer box sends &ldquo;end of input&rdquo;, which Python reports as {mono("EOFError")}, as in a real
                terminal.
              </li>
            </ul>
            <Note tone="warn">
              <b>The catch:</b> browsers only allow {mono("SharedArrayBuffer")} on pages that are <b>cross-origin isolated</b>. We send two
              headers only on the pages that run code interactively (the compiler and the course projects): {mono("Cross-Origin-Opener-Policy: same-origin")} and{" "}
              {mono("Cross-Origin-Embedder-Policy: require-corp")}, and mark our runtime files {mono("Cross-Origin-Resource-Policy: same-origin")}.
              Because isolation applies to a fresh page load, the &ldquo;Open in compiler&rdquo; buttons do a full navigation.
            </Note>
            <p>
              <b>Fallback:</b> if a browser can&apos;t isolate the page, the compiler quietly switches to an <b>Input box</b>: you type every
              answer up front, one per line, and each {mono("input()")} takes the next line. The output still shows what was &ldquo;typed&rdquo;
              in green so it reads like a terminal session.
            </p>
          </Section>

          <Section id="safety" kicker="Step 5" title="Safety nets">
            <Table
              head={["Problem", "What we do"]}
              rows={[
                ["Infinite loop", "Stopped after 15 s in the compiler (6 s in lessons). The message suggests looking for a loop that never ends."],
                ["Stop button", "Terminates the worker instantly; it's the only reliable way to stop WebAssembly mid-loop. A fresh worker warms up from cache in the background."],
                ["print() in a runaway loop", "Output is capped at 200,000 characters so the tab can't run out of memory drawing text."],
                ["Slow package installs", "Capped separately at 90 s before the program starts."],
                ["Out of memory / crash", "Worker errors are caught; the UI shows a clear message and a Retry."],
                ["Your files", "Code runs inside the browser's WebAssembly sandbox with its own in-memory file system. It can't read files on your computer, and that memory is gone when the page closes."],
              ]}
            />
            <div className="grid gap-3 sm:grid-cols-3">
              <Box icon={Timer} title="15 s" sub="run limit in the compiler" />
              <Box icon={ShieldCheck} title="200,000 chars" sub="output cap" />
              <Box icon={Zap} title="New worker" sub="after every Stop or timeout" />
            </div>
          </Section>

          <Section id="errors" kicker="Step 6" title="Errors a beginner can actually read">
            <p>A raw Pyodide traceback includes many lines of interpreter internals. The worker cleans it up before it reaches the page:</p>
            <ul className="list-disc space-y-1.5 pl-6">
              <li>
                Keeps only the part that starts at {mono('File "main.py"')}, the student&apos;s own code.
              </li>
              <li>Finds the line number, highlights that line in the editor, and shows a &ldquo;Line 4 in main.py&rdquo; link that jumps to it.</li>
              <li>Adds a plain-English hint for the most common beginner errors.</li>
              <li>The full traceback is still one click away for curious students.</li>
            </ul>
            <Table
              head={["Error", "Hint we show"]}
              rows={[
                [mono("NameError"), "A name is used before it's defined, or it's misspelt. Python is case-sensitive."],
                [mono("IndentationError"), "Check the spaces at the start of the line. Lines in the same block must line up exactly."],
                [mono("SyntaxError"), "Python couldn't read this line. Look for a missing bracket, quote or colon."],
                [mono("TypeError"), "Two values of the wrong types were used together, like adding text to a number."],
                [mono("EOFError"), "Your program called input() but there was nothing left to read."],
              ]}
            />
          </Section>

          <Section id="editor" kicker="Step 7" title="A small editor, built for students">
            <p>
              We didn&apos;t pull in a heavyweight code-editor library. The editor is a normal {mono("<textarea>")} with transparent text,
              laid exactly over a coloured copy of the same code. You type into the real textarea, so the phone&apos;s own keyboard, selection,
              copy-paste and accessibility all work, and you see the coloured layer underneath.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Box icon={Layers} title="Two layers, one grid cell" sub="highlighted <pre> below, transparent <textarea> on top" />
              <Box icon={Keyboard} title="Python-aware keys" sub="Tab = 4 spaces · auto-indent after a colon · Ctrl/⌘ + Enter runs" />
            </div>
            <p>
              Syntax colours come from a single regular expression that recognises comments, strings, keywords, common built-ins and numbers.
              It is deliberately simple: fast enough to re-colour on every keystroke.
            </p>
          </Section>

          <Section id="devices" kicker="Step 8" title="One compiler, two very different screens">
            <p>
              Same component, same engine. Only the layout changes, using CSS breakpoints. No separate mobile app or mobile version.
            </p>
            <div className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
              <figure>
                <div className="border border-[#2a332d] bg-[#0f1612] p-2">
                  <div className="flex items-center gap-2 border-b border-white/10 px-2 pb-2 text-[10px] text-white/50">
                    <span className="h-3 w-3 bg-[#2f9e6e]" /> Online Python compiler
                    <span className="ml-auto bg-[#2f9e6e] px-2 py-0.5 font-bold text-white">▶ Run</span>
                  </div>
                  <div className="flex h-[170px]">
                    <div className="w-[55%] space-y-1 bg-[#141b16] p-2 font-mono text-[9px] text-white/60">
                      <p>
                        <span className="text-[#a9c7ff]">print</span>(<span className="text-[#9be3b8]">&quot;Hi&quot;</span>)
                      </p>
                      <p>
                        <span className="text-[#ffb27a]">for</span> i <span className="text-[#ffb27a]">in</span> range(3):
                      </p>
                      <p className="pl-3">print(i)</p>
                    </div>
                    <div className="w-[5px] bg-[#5ee0a0]/50" />
                    <div className="flex-1 bg-[#0b100d] p-2 font-mono text-[9px] text-white/70">
                      Hi
                      <br />0<br />1<br />2
                    </div>
                  </div>
                </div>
                <figcaption className="mt-2 flex items-center gap-1.5 text-[13px] text-muted">
                  <Laptop className="h-4 w-4" /> Desktop: code and output side by side
                </figcaption>
              </figure>
              <figure className="flex flex-col items-center">
                <div className="w-[170px] border-[6px] border-[#1d1d1d] bg-[#0f1612] rounded-[22px] p-1.5">
                  <div className="grid grid-cols-3 border-b border-white/10 text-center text-[8.5px] font-bold text-white/50">
                    <span className="border-b-2 border-[#5ee0a0] py-1 text-white">Code</span>
                    <span className="py-1">Input</span>
                    <span className="py-1">Output</span>
                  </div>
                  <div className="h-[150px] space-y-1 bg-[#141b16] p-2 font-mono text-[8.5px] text-white/60">
                    <p>
                      <span className="text-[#a9c7ff]">print</span>(<span className="text-[#9be3b8]">&quot;Hi&quot;</span>)
                    </p>
                  </div>
                  <div className="flex items-center justify-between bg-[#141b16] px-1.5 py-1.5 text-[8px] text-white/45">
                    Runs on your device
                    <span className="bg-[#2f9e6e] px-1.5 py-0.5 font-bold text-white">▶ Run</span>
                  </div>
                </div>
                <figcaption className="mt-2 flex items-center gap-1.5 text-[13px] text-muted">
                  <Smartphone className="h-4 w-4" /> Phone: tabs + thumb-reach Run
                </figcaption>
              </figure>
            </div>
            <Table
              head={["", "Desktop (≥ 1024 px)", "Phone"]}
              rows={[
                ["Layout", "Code left, output right", "Tabs: Code · Input · Output"],
                ["Resize", "Drag the divider (30–75%). Saved; double-click resets", "Full-width panes"],
                ["Run", "Button in the header, or Ctrl/⌘ + Enter", "Big button in a bottom bar, inside the safe area"],
                ["After Run", "Output streams in on the right", "Switches to the Output tab automatically"],
                ["Error", "Line highlighted in place", "“Line N” link jumps back to the Code tab"],
                ["Typing", "13.5 px monospace", "16 px, so iOS Safari doesn't zoom in on focus"],
                ["input()", "Answer box inline in the output", "Same, with an “Enter = send” keyboard hint"],
              ]}
            />
            <Note>
              The page height uses {mono("100dvh")} (dynamic viewport height), so the Run bar stays visible when the phone&apos;s browser bars
              slide in and out.
            </Note>
          </Section>

          <Section id="saving" kicker="Step 9" title="Saving your work without an account">
            <ul className="list-disc space-y-1.5 pl-6">
              <li>
                Code and input are <b>autosaved to the browser&apos;s localStorage</b> 300 ms after you stop typing. Reload and it&apos;s still
                there. Nothing is uploaded.
              </li>
              <li>
                <b>Examples menu</b> loads ready programs (hello world, input(), loops, if/elif, lists and functions, random dice, star
                pattern).
              </li>
              <li>
                <b>Open a .py file</b> (up to 200 KB), <b>Download main.py</b>, and <b>Copy</b>: everything happens locally.
              </li>
              <li>Inside the course, lessons can hand code to the compiler with an &ldquo;Open in compiler&rdquo; button.</li>
            </ul>
          </Section>

          <Section id="packages" kicker="Step 10" title="numpy and friends, on demand">
            <p>
              The standard library ships with the runtime. For anything else, the compiler reads the program&apos;s {mono("import")} lines
              before running and asks Pyodide to install matching packages ({mono("loadPackagesFromImports")}). The Pyodide distribution we
              use lists <b>357 packages</b>, including numpy. They download from jsDelivr only the first time a program imports them, then the
              browser caches them.
            </p>
            <p>Lesson exercises skip this step on purpose, so they start instantly.</p>
          </Section>

          <Section id="limits" kicker="Honesty" title="What it can't do (yet)">
            <ul className="list-disc space-y-1.5 pl-6">
              <li>
                <b>First load is a real download</b> (about 6.3 MB compressed). On a slow connection the first Run takes a few seconds; after
                that it&apos;s cached.
              </li>
              <li>
                <b>No desktop windows.</b> {mono("tkinter")} (and {mono("turtle")}, which is built on it) need a window system that doesn&apos;t
                exist inside a browser tab.
              </li>
              <li>
                <b>Only packages Pyodide has built for WebAssembly.</b> If a library isn&apos;t in that list, you get {mono("ModuleNotFoundError")}{" "}
                with an explanation.
              </li>
              <li>
                <b>Interactive input() needs a modern browser</b> that supports cross-origin isolation; older ones get the Input box instead.
              </li>
              <li>
                <b>Long jobs are cut off</b> at 15 seconds. This is a learning tool, not a place to train models.
              </li>
              <li>
                <b>Your code lives on one device.</b> Clearing site data, or switching to another phone, starts fresh.
              </li>
            </ul>
          </Section>

          <Section id="numbers" kicker="Summary" title="The numbers, in one place">
            <Table
              head={["What", "Value"]}
              rows={[
                ["Python version", "3.14.2 (Pyodide 314.0.7)"],
                ["Runtime download (first visit)", "≈ 13.4 MB raw · ≈ 6.3 MB gzip"],
                ["Repeat visits", "From browser cache (immutable, 1 year)"],
                ["Run time limit", "15 s compiler · 6 s lessons (input wait not counted)"],
                ["Output cap", "200,000 characters"],
                ["Max line for input()", "64 KB"],
                ["Upload limit", ".py files up to 200 KB"],
                ["Optional packages available", "357 (loaded on first import)"],
                ["Core code", "Worker ≈ 215 lines · engine ≈ 360 lines · compiler UI ≈ 600 lines"],
              ]}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <Box icon={MonitorSmartphone} title="Stack" sub="Next.js + React + TypeScript · Pyodide (CPython → WebAssembly) · Web Worker · SharedArrayBuffer + Atomics" />
              <Box icon={Server} title="Server's job" sub="Serve static files with the right cache and isolation headers. That's it." />
            </div>
          </Section>

          <section className="border border-[#1f2a23] bg-[#0f1612] px-6 py-8 text-white sm:px-8">
            <h2 className="text-[24px] font-extrabold leading-tight sm:text-[28px]">Try it yourself</h2>
            <p className="mt-2 max-w-[56ch] text-[15px] leading-relaxed text-white/70">
              Free, no sign-up. Open it on your phone and on your laptop. It&apos;s the same compiler.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href={COMPILER} className="inline-flex items-center gap-2 bg-[#2f9e6e] px-5 py-3 text-[15px] font-bold transition hover:bg-[#278a5f]">
                Open the Python compiler <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/learnpython" className="inline-flex items-center gap-2 border border-white/30 px-5 py-3 text-[15px] font-bold transition hover:border-white">
                Learn Python free
              </Link>
            </div>
          </section>
        </div>
      </div>
    </article>
  );
}
