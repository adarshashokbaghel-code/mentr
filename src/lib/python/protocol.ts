/** Message contract with public/py-worker.js. */

export type OutputStream = "stdout" | "stderr" | "stdin";

export type WorkerError = {
  /** Exception class, e.g. "NameError". */
  type: string;
  message: string;
  /** Line in main.py where the error was raised. */
  line?: number;
  /** Traceback trimmed to the learner's own code. */
  traceback: string;
};

export type ToWorker =
  | { type: "init"; indexURL: string; fallbackIndexURL: string; packageBaseUrl: string }
  | {
      type: "run";
      id: number;
      code: string;
      stdin: string;
      packages: boolean;
      maxOutput: number;
      /** When set, input() blocks and asks the page for each line (see INPUT_* layout). */
      inputBuffer?: SharedArrayBuffer;
    };

/**
 * Shared input buffer layout: Int32 [0] = flag (0 waiting, 1 answered), Int32 [1] = byte length (-1 = end of input),
 * then UTF-8 bytes from INPUT_HEADER_BYTES.
 */
export const INPUT_HEADER_BYTES = 8;
export const INPUT_BUFFER_BYTES = 64 * 1024;

export type FromWorker =
  | { type: "progress"; loaded: number; total: number }
  | { type: "starting" }
  | { type: "fallback"; reason: string }
  | { type: "ready"; source: "self" | "cdn"; pythonVersion: string; pyodideVersion: string }
  | { type: "init-error"; message: string }
  | { type: "status"; id: number; message: string }
  | { type: "started"; id: number }
  | { type: "input-request"; id: number }
  | { type: "output"; id: number; stream: OutputStream; text: string }
  | { type: "done"; id: number; ok: boolean; error: WorkerError | null; durationMs: number; truncated: boolean };
