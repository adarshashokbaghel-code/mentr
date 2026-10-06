"use client";

import {
  CDN_INDEX_URL,
  LESSON_TIMEOUT_MS,
  MAX_OUTPUT_CHARS,
  SELF_HOSTED_INDEX_URL,
  WORKER_URL,
} from "@/lib/python/config";
import {
  INPUT_BUFFER_BYTES,
  INPUT_HEADER_BYTES,
  type FromWorker,
  type OutputStream,
  type ToWorker,
  type WorkerError,
} from "@/lib/python/protocol";

export type RuntimePhase = "idle" | "loading" | "ready" | "running" | "error";

export type RuntimeState = {
  phase: RuntimePhase;
  /** 0–1 while downloading; null when unknown or not loading. */
  progress: number | null;
  /** Short human status, e.g. "Downloading Python" or "Installing numpy". */
  detail: string | null;
  source: "self" | "cdn" | null;
  pythonVersion: string | null;
  error: string | null;
};

export type OutputChunk = { stream: OutputStream; text: string };

export type RunStatus = "ok" | "error" | "timeout" | "stopped" | "load-failed";

export type RunError = WorkerError & { hint?: string };

export type RunResult = {
  ok: boolean;
  status: RunStatus;
  /** Everything the program printed to stdout, in order. */
  stdout: string;
  /** stdout, stderr and echoed input, in the order they happened. */
  output: OutputChunk[];
  error?: RunError;
  durationMs: number;
  truncated: boolean;
};

export type RunOptions = {
  /** Lines fed to input(), one per line. */
  stdin?: string;
  timeoutMs?: number;
  /** Install third-party packages (numpy, …) imported by the code before running. */
  packages?: boolean;
  onOutput?: (chunk: OutputChunk) => void;
  /**
   * Ask for each input() line while the program runs (answer with provideInput). Ignored, and `stdin` used
   * instead, when the page isn't cross-origin isolated.
   */
  interactive?: boolean;
  onInputRequest?: () => void;
};

/** True when input() can pause the program and wait for typing (needs a cross-origin isolated page). */
export function supportsInteractiveInput(): boolean {
  return typeof window !== "undefined" && window.crossOriginIsolated === true && typeof SharedArrayBuffer !== "undefined";
}

const INITIAL: RuntimeState = { phase: "idle", progress: null, detail: null, source: null, pythonVersion: null, error: null };

/** Waiting for package installs before the program itself starts is capped separately. */
const START_TIMEOUT_MS = 90_000;

const HINTS: Record<string, string> = {
  EOFError: "Your program called input() but there was nothing left to read. Type your input in the Input box, one value per line.",
  ModuleNotFoundError: "That module isn't available here. The Python standard library works, plus popular packages like numpy.",
  IndentationError: "Check the spaces at the start of the line. Lines in the same block must line up exactly.",
  SyntaxError: "Python couldn't read this line. Look for a missing bracket, quote or colon.",
  NameError: "A name is used before it's defined, or it's misspelt. Python is case-sensitive.",
  TypeError: "Two values of the wrong types were used together, like adding text to a number.",
  ZeroDivisionError: "A number was divided by zero.",
};

type Active = {
  id: number;
  opts: RunOptions;
  output: OutputChunk[];
  resolve: (r: RunResult) => void;
  timer: ReturnType<typeof setTimeout>;
  inputBuffer?: SharedArrayBuffer;
  waitingForInput: boolean;
};

function stdoutOf(output: OutputChunk[]): string {
  return output.filter((c) => c.stream === "stdout").map((c) => c.text).join("");
}

/**
 * One shared Python runtime per tab. Code runs in a Web Worker so the page never freezes;
 * a stuck program is stopped by terminating the worker, then a fresh one warms up from cache.
 */
export class PythonEngine {
  private worker: Worker | null = null;
  private ready: Promise<void> | null = null;
  private active: Active | null = null;
  private nextId = 1;
  private state: RuntimeState = INITIAL;
  private listeners = new Set<() => void>();

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getSnapshot = (): RuntimeState => this.state;

  static serverSnapshot = (): RuntimeState => INITIAL;

  private set(patch: Partial<RuntimeState>) {
    this.state = { ...this.state, ...patch };
    this.listeners.forEach((l) => l());
  }

  private send(msg: ToWorker) {
    this.worker?.postMessage(msg);
  }

  /** Starts downloading Python. Safe to call any number of times. */
  preload(): Promise<void> {
    if (this.ready) return this.ready;
    this.set({ phase: "loading", progress: 0, detail: "Downloading Python", error: null });
    const worker = new Worker(WORKER_URL, { type: "module", name: "mentr-python" });
    this.worker = worker;
    this.ready = new Promise<void>((resolve, reject) => {
      worker.onmessage = (e: MessageEvent<FromWorker>) => this.onMessage(e.data, resolve, reject);
      worker.onerror = (e) => {
        e.preventDefault();
        this.crash("Python stopped unexpectedly. It may have run out of memory.");
        reject(new Error("worker error"));
      };
    });
    this.ready.catch(() => undefined);
    this.send({
      type: "init",
      indexURL: new URL(SELF_HOSTED_INDEX_URL, window.location.origin).href,
      fallbackIndexURL: CDN_INDEX_URL,
      packageBaseUrl: CDN_INDEX_URL,
    });
    return this.ready;
  }

  private onMessage(msg: FromWorker, resolve: () => void, reject: (e: Error) => void) {
    switch (msg.type) {
      case "progress":
        this.set({ progress: msg.total ? msg.loaded / msg.total : null });
        return;
      case "starting":
        this.set({ progress: 1, detail: "Starting Python" });
        return;
      case "fallback":
        this.set({ progress: 0, detail: "Retrying from backup server" });
        return;
      case "ready":
        this.set({
          phase: this.active ? "running" : "ready",
          progress: null,
          detail: null,
          source: msg.source,
          pythonVersion: msg.pythonVersion,
        });
        resolve();
        return;
      case "init-error":
        this.teardown();
        this.set({ phase: "error", progress: null, detail: null, error: "Couldn't load Python. Check your internet connection and try again." });
        reject(new Error(msg.message));
        return;
      case "status":
        if (this.active?.id === msg.id) this.set({ detail: msg.message });
        return;
      case "started":
        if (this.active?.id === msg.id) {
          this.startTimer(this.active);
          this.set({ detail: null });
        }
        return;
      case "input-request":
        if (this.active?.id === msg.id) {
          // Time spent waiting for the learner to type doesn't count towards the run limit.
          clearTimeout(this.active.timer);
          this.active.waitingForInput = true;
          this.active.opts.onInputRequest?.();
        }
        return;
      case "output":
        if (this.active?.id === msg.id) {
          const chunk = { stream: msg.stream, text: msg.text };
          this.active.output.push(chunk);
          this.active.opts.onOutput?.(chunk);
        }
        return;
      case "done": {
        const a = this.active;
        if (!a || a.id !== msg.id) return;
        this.active = null;
        clearTimeout(a.timer);
        this.set({ phase: "ready", detail: null });
        a.resolve({
          ok: msg.ok,
          status: msg.ok ? "ok" : "error",
          stdout: stdoutOf(a.output),
          output: a.output,
          error: msg.error ? { ...msg.error, hint: HINTS[msg.error.type] } : undefined,
          durationMs: msg.durationMs,
          truncated: msg.truncated,
        });
        return;
      }
    }
  }

  /** Runs one program. A run already in progress is stopped first. */
  async run(code: string, opts: RunOptions = {}): Promise<RunResult> {
    if (this.active) this.abort("stopped");
    try {
      await this.preload();
    } catch {
      return {
        ok: false,
        status: "load-failed",
        stdout: "",
        output: [],
        error: { type: "LoadError", message: this.state.error ?? "Couldn't load Python.", traceback: "" },
        durationMs: 0,
        truncated: false,
      };
    }
    return new Promise<RunResult>((resolve) => {
      const id = this.nextId++;
      const inputBuffer =
        opts.interactive && supportsInteractiveInput() ? new SharedArrayBuffer(INPUT_HEADER_BYTES + INPUT_BUFFER_BYTES) : undefined;
      this.active = {
        id,
        opts,
        output: [],
        resolve,
        timer: setTimeout(() => this.abort("timeout"), START_TIMEOUT_MS),
        inputBuffer,
        waitingForInput: false,
      };
      this.set({ phase: "running", detail: opts.packages ? "Preparing" : null });
      this.send({
        type: "run",
        id,
        code,
        stdin: opts.stdin ?? "",
        packages: Boolean(opts.packages),
        maxOutput: MAX_OUTPUT_CHARS,
        inputBuffer,
      });
    });
  }

  /** Answers the input() the program is waiting on. `null` sends end of input (EOFError in Python). */
  provideInput(line: string | null) {
    const a = this.active;
    if (!a?.inputBuffer || !a.waitingForInput) return;
    a.waitingForInput = false;
    const ctrl = new Int32Array(a.inputBuffer, 0, 2);
    if (line === null) {
      Atomics.store(ctrl, 1, -1);
    } else {
      const bytes = new TextEncoder().encode(line).slice(0, INPUT_BUFFER_BYTES);
      new Uint8Array(a.inputBuffer, INPUT_HEADER_BYTES, INPUT_BUFFER_BYTES).set(bytes);
      Atomics.store(ctrl, 1, bytes.length);
    }
    Atomics.store(ctrl, 0, 1);
    Atomics.notify(ctrl, 0);
    this.startTimer(a);
  }

  private startTimer(a: Active) {
    clearTimeout(a.timer);
    a.timer = setTimeout(() => this.abort("timeout"), a.opts.timeoutMs ?? LESSON_TIMEOUT_MS);
  }

  /** Stops the running program immediately. */
  stop() {
    this.abort("stopped");
  }

  /** Clears a load error so the next run tries again. */
  retry(): Promise<void> {
    if (this.state.phase === "error") this.teardown();
    return this.preload();
  }

  private abort(status: "timeout" | "stopped") {
    const a = this.active;
    if (!a) return;
    this.active = null;
    clearTimeout(a.timer);
    this.teardown();
    const seconds = Math.round((a.opts.timeoutMs ?? LESSON_TIMEOUT_MS) / 1000);
    a.resolve({
      ok: false,
      status,
      stdout: stdoutOf(a.output),
      output: a.output,
      error:
        status === "timeout"
          ? {
              type: "TimeoutError",
              message: `Your program ran for more than ${seconds} seconds and was stopped.`,
              traceback: "",
              hint: "Look for a loop that never ends, or an input() waiting for more lines.",
            }
          : { type: "Stopped", message: "Program stopped.", traceback: "" },
      durationMs: 0,
      truncated: false,
    });
    void this.preload().catch(() => undefined);
  }

  private crash(message: string) {
    const a = this.active;
    this.active = null;
    this.teardown();
    this.set({ phase: "error", error: message, detail: null, progress: null });
    if (a) {
      clearTimeout(a.timer);
      a.resolve({
        ok: false,
        status: "error",
        stdout: stdoutOf(a.output),
        output: a.output,
        error: { type: "RuntimeError", message, traceback: "" },
        durationMs: 0,
        truncated: false,
      });
    }
  }

  private teardown() {
    this.worker?.terminate();
    this.worker = null;
    this.ready = null;
    this.set({ phase: "idle", progress: null, detail: null });
  }
}

let engine: PythonEngine | null = null;

/** The tab-wide engine. Browser only. */
export function getPythonEngine(): PythonEngine {
  engine ??= new PythonEngine();
  return engine;
}
