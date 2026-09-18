"use client";

import {
  downloadBlob,
  ToolsActionBar,
  ToolsDropzone,
  ToolsPrimaryButton,
} from "@/components/tools/tools-ui";
import { BackgroundRemovalClient } from "@/lib/background-removal/client";
import { BG_REMOVAL } from "@/lib/background-removal/config";
import {
  resolutionBucket,
  validateAndNormalizeImage,
  type ValidatedImage,
} from "@/lib/background-removal/validate-image";
import { trackToolEvent } from "@/lib/tools-analytics";
import { relatedTools } from "@/lib/tools-catalog";
import { cn } from "@/lib/utils";
import { Download, RefreshCw, RotateCcw, Shield } from "lucide-react";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

const SLUG = "background-remover";

function useToolOpen() {
  useEffect(() => {
    trackToolEvent("tool_viewed", { slug: SLUG });
    trackToolEvent("tool_open", { slug: SLUG });
  }, []);
}

function BeforeAfterSlider({
  originalUrl,
  resultUrl,
}: {
  originalUrl: string;
  resultUrl: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(50);

  const move = useCallback((clientX: number) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    setPct(Math.round(x * 100));
  }, []);

  function onPointerDown(e: ReactPointerEvent) {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    move(e.clientX);
  }

  return (
    <div
      ref={wrapRef}
      className="relative aspect-[4/3] w-full cursor-col-resize overflow-hidden rounded-xl border border-hairline bg-[length:16px_16px] bg-[linear-gradient(45deg,#e8e4dc_25%,transparent_25%),linear-gradient(-45deg,#e8e4dc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#e8e4dc_75%),linear-gradient(-45deg,transparent_75%,#e8e4dc_75%)] bg-[position:0_0,0_8px,8px_-8px,-8px_0] select-none"
      onPointerDown={onPointerDown}
      onPointerMove={(e) => {
        if (e.buttons !== 1) return;
        move(e.clientX);
      }}
      role="slider"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      aria-label="Compare original and transparent result"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") setPct((p) => Math.max(0, p - 2));
        if (e.key === "ArrowRight") setPct((p) => Math.min(100, p + 2));
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={resultUrl}
        alt="Background removed"
        className="absolute inset-0 h-full w-full object-contain"
        draggable={false}
      />
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={originalUrl}
          alt="Original"
          className="h-full w-full object-contain"
          draggable={false}
        />
      </div>
      <div
        className="absolute inset-y-0 w-0.5 bg-ink"
        style={{ left: `${pct}%` }}
      >
        <span className="absolute top-1/2 left-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-ink bg-white text-[11px] font-extrabold shadow">
          ↔
        </span>
      </div>
      <span className="absolute top-2 left-2 rounded-md bg-black/55 px-2 py-0.5 text-[10px] font-bold text-white">
        Original
      </span>
      <span className="absolute top-2 right-2 rounded-md bg-black/55 px-2 py-0.5 text-[10px] font-bold text-white">
        Removed
      </span>
    </div>
  );
}

export function ToolBackgroundRemover() {
  useToolOpen();
  const clientRef = useRef<BackgroundRemovalClient | null>(null);
  const previewRef = useRef<string | null>(null);
  const resultRef = useRef<string | null>(null);
  const [validated, setValidated] = useState<ValidatedImage | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const related = relatedTools(SLUG, 3).filter((t) =>
    ["images-to-pdf", "pdf-merge", "pdf-compress"].includes(t.slug),
  );

  useEffect(() => {
    const client = new BackgroundRemovalClient();
    clientRef.current = client;
    client.setProgressHandler((p) => {
      if (p.phase === "ready") {
        setStatus(null);
        setProgress(null);
        return;
      }
      setStatus(p.message);
      setProgress(p.progress ?? null);
    });
    // Warm model as soon as the tool page opens (critical on mobile)
    void client.init().catch(() => {
      /* process() will retry; avoid noisy banner before upload */
    });
    return () => {
      client.dispose();
      clientRef.current = null;
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
      if (resultRef.current) URL.revokeObjectURL(resultRef.current);
    };
  }, []);

  function clearAssets() {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    if (resultRef.current) URL.revokeObjectURL(resultRef.current);
    previewRef.current = null;
    resultRef.current = null;
    setValidated(null);
    setResultUrl(null);
    setError(null);
    setStatus(null);
    setProgress(null);
  }

  function reset() {
    clearAssets();
    trackToolEvent("tool_reset", { slug: SLUG });
  }

  async function retryProcess() {
    const v = validated;
    const client = clientRef.current;
    if (!v || !client) return;
    setError(null);
    setBusy(true);
    setStatus("Trying again…");
    try {
      await client.hardReset();
      client.setProgressHandler((p) => {
        if (p.phase === "ready") {
          setStatus(null);
          setProgress(null);
          return;
        }
        setStatus(p.message);
        setProgress(p.progress ?? null);
      });
      const out = await client.process(v.processBlob);
      resultRef.current = out.objectUrl;
      setResultUrl(out.objectUrl);
      setStatus(null);
      trackToolEvent("tool_complete", {
        slug: SLUG,
        detail: `retry-${out.backend}`,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Processing failed";
      setError(msg);
      trackToolEvent("tool_error", { slug: SLUG, detail: msg.slice(0, 80) });
    } finally {
      setBusy(false);
      setProgress(null);
    }
  }

  async function onFiles(files: File[]) {
    const file = files[0];
    if (!file) return;
    clearAssets();
    setError(null);
    trackToolEvent("tool_started", {
      slug: SLUG,
      detail: "upload",
    });
    try {
      const client = clientRef.current;
      if (!client) throw new Error("Processor unavailable");
      const profile = client.getDeviceProfile();
      const v = await validateAndNormalizeImage(file, {
        maxProcessSide: profile.maxProcessSide,
      });
      previewRef.current = v.previewUrl;
      setValidated(v);
      setBusy(true);
      setStatus("Scanning your photo…");
      trackToolEvent("tool_generated", {
        slug: SLUG,
        detail: resolutionBucket(v.processWidth, v.processHeight),
      });

      const out = await client.process(v.processBlob);
      resultRef.current = out.objectUrl;
      setResultUrl(out.objectUrl);
      setStatus(null);
      trackToolEvent("tool_complete", {
        slug: SLUG,
        detail: out.backend,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Processing failed";
      setError(msg);
      trackToolEvent("tool_error", { slug: SLUG, detail: msg.slice(0, 80) });
    } finally {
      setBusy(false);
      setProgress(null);
    }
  }

  function download() {
    if (!resultUrl || !validated) return;
    void fetch(resultUrl)
      .then((r) => r.blob())
      .then((blob) => {
        const base = validated.file.name.replace(/\.[^.]+$/, "") || "image";
        downloadBlob(blob, `${base}-no-bg.png`);
        trackToolEvent("tool_downloaded", { slug: SLUG, detail: "png" });
      });
  }

  return (
    <div>
      <div className="mb-4 flex items-start gap-2 rounded-xl border border-sage/30 bg-[#e6f7f4]/60 px-3 py-2.5 text-[12px] font-semibold text-ink">
        <Shield className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
        <p>
          <span className="font-extrabold">100% free · private · no watermark.</span>{" "}
          Your image stays on this device — Mentr never uploads your photo.
        </p>
      </div>

      {!validated ? (
        <ToolsDropzone
          accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
          label="Upload your image"
          hint={`Drag & drop or choose a file · JPG PNG WEBP · max ${Math.round(BG_REMOVAL.MAX_FILE_SIZE / (1024 * 1024))} MB`}
          onFiles={(list) => void onFiles(list)}
          disabled={busy}
        />
      ) : null}

      {validated ? (
        <div className="space-y-4">
          {busy ? (
            <ProcessingStage
              previewUrl={validated.previewUrl}
              status={status}
              progress={progress}
            />
          ) : resultUrl ? (
            <BeforeAfterSlider
              originalUrl={validated.previewUrl}
              resultUrl={resultUrl}
            />
          ) : (
            <div className="overflow-hidden rounded-xl border border-hairline bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={validated.previewUrl}
                alt="Upload preview"
                className="mx-auto max-h-[320px] w-full object-contain"
              />
            </div>
          )}

          <ToolsActionBar busy={busy} error={error}>
            {resultUrl ? (
              <ToolsPrimaryButton onClick={download} disabled={busy}>
                <Download className="mr-1.5 h-4 w-4" />
                Download PNG
              </ToolsPrimaryButton>
            ) : null}
            {error && !resultUrl ? (
              <ToolsPrimaryButton
                onClick={() => void retryProcess()}
                disabled={busy}
              >
                <RefreshCw className="mr-1.5 h-4 w-4" />
                Retry
              </ToolsPrimaryButton>
            ) : null}
            <button
              type="button"
              onClick={reset}
              disabled={busy}
              className={cn(
                "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-hairline bg-white px-4 text-[14px] font-bold text-ink hover:bg-cream disabled:opacity-50",
              )}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Start over
            </button>
          </ToolsActionBar>

          {resultUrl ? (
            <div className="rounded-xl border border-hairline bg-white p-4">
              <p className="text-[12px] font-bold uppercase tracking-wider text-muted">
                Need another tool?
              </p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {(related.length ? related : relatedTools(SLUG, 3)).map((t) => (
                  <li key={t.slug}>
                    <Link
                      href={`/tools/${t.slug}`}
                      className="inline-flex rounded-lg border border-hairline px-3 py-1.5 text-[13px] font-bold text-ink hover:border-coral hover:text-coral"
                    >
                      {t.shortTitle}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function ProcessingStage({
  previewUrl,
  status,
  progress,
}: {
  previewUrl: string;
  status: string | null;
  progress: number | null;
}) {
  const step = statusToStep(status);
  const [tick, setTick] = useState(0);
  const started = useRef(Date.now());

  useEffect(() => {
    started.current = Date.now();
    const id = window.setInterval(() => setTick((t) => t + 1), 400);
    return () => window.clearInterval(id);
  }, []);

  const elapsed = Math.max(0, Math.floor((Date.now() - started.current) / 1000));
  void tick; // drive re-render for elapsed

  const pct = computeProgress(step, progress, elapsed);

  const steps = [
    { id: 0, label: "Prepare" },
    { id: 1, label: "Scan" },
    { id: 2, label: "Cut out" },
    { id: 3, label: "Finish" },
  ] as const;

  return (
    <div className="overflow-hidden rounded-2xl border border-hairline bg-white shadow-sm">
      <div className="grid gap-0 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="relative aspect-[4/3] bg-[#f6f4ef] sm:aspect-auto sm:min-h-[280px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt=""
            className="h-full w-full object-contain"
            draggable={false}
          />
          {/* Thin professional highlight — not a toy scan beam */}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent"
            aria-hidden
          />
          <div className="absolute bottom-3 left-3 rounded-md bg-ink/80 px-2 py-1 text-[10px] font-bold tracking-wide text-white uppercase">
            Processing
          </div>
        </div>

        <div className="flex flex-col justify-center gap-4 border-t border-hairline p-4 sm:border-t-0 sm:border-l sm:p-5">
          <div>
            <p className="text-[15px] font-extrabold tracking-tight text-ink">
              {friendlyStatus(status)}
            </p>
            <p className="mt-1 text-[12px] font-medium text-muted">
              Safe to switch tabs — progress continues in the background.
            </p>
          </div>

          <div>
            <div className="mb-1.5 flex items-baseline justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
                Progress
              </span>
              <span className="tabular-nums text-[13px] font-extrabold text-ink">
                {pct}%
                <span className="ml-2 text-[11px] font-semibold text-muted">
                  {elapsed}s
                </span>
              </span>
            </div>
            <div
              className="h-2 overflow-hidden rounded-full bg-cream"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={pct}
              aria-label="Background removal progress"
            >
              <div
                className={cn(
                  "h-full rounded-full bg-ink transition-[width] duration-500 ease-out",
                  progress == null && step < 3
                    ? "mentr-bg-progress-indeterminate"
                    : "",
                )}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          <ol className="grid grid-cols-4 gap-1.5">
            {steps.map((s) => {
              const done = step > s.id;
              const active = step === s.id;
              return (
                <li
                  key={s.id}
                  className={cn(
                    "rounded-lg border px-1.5 py-2 text-center",
                    done && "border-sage/40 bg-[#e6f7f4]/70",
                    active && "border-ink bg-ink text-white",
                    !done && !active && "border-hairline bg-cream/40 text-muted",
                  )}
                >
                  <p
                    className={cn(
                      "text-[10px] font-extrabold uppercase tracking-wide",
                      active ? "text-white" : done ? "text-sage" : "text-muted",
                    )}
                  >
                    {done ? "Done" : active ? "Now" : s.id + 1}
                  </p>
                  <p
                    className={cn(
                      "mt-0.5 text-[11px] font-bold",
                      active ? "text-white" : "text-ink",
                    )}
                  >
                    {s.label}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}

function statusToStep(raw: string | null): number {
  const s = (raw || "").toLowerCase();
  if (s.includes("edge") || s.includes("clean") || s.includes("detail") || s.includes("finish")) {
    return 3;
  }
  if (s.includes("subject") || s.includes("finding") || s.includes("remov") || s.includes("cut")) {
    return 2;
  }
  if (s.includes("scan") || s.includes("working") || s.includes("photo")) {
    return 1;
  }
  // prepare / download / getting ready / retry / optimize
  return 0;
}

function computeProgress(
  step: number,
  downloadPct: number | null,
  elapsed: number,
): number {
  if (downloadPct != null && step === 0) {
    return Math.min(42, Math.max(4, Math.round(downloadPct * 0.42)));
  }
  const bases = [8, 28, 58, 82];
  const base = bases[step] ?? 8;
  // Gentle time creep within the step so the bar feels alive
  const creep = Math.min(14, Math.floor(elapsed / 3) + (elapsed % 5));
  const caps = [42, 55, 78, 96];
  return Math.min(caps[step] ?? 96, base + creep);
}

function friendlyStatus(raw: string | null): string {
  const s = (raw || "").toLowerCase();
  if (s.includes("edge") || s.includes("clean") || s.includes("detail")) {
    return "Refining edges";
  }
  if (s.includes("subject") || s.includes("finding") || s.includes("remov")) {
    return "Removing background";
  }
  if (s.includes("optim") || s.includes("another") || s.includes("path") || s.includes("phone") || s.includes("device")) {
    return "Optimizing for your device";
  }
  if (s.includes("retry")) {
    return "Retrying setup";
  }
  if (s.includes("ready") || s.includes("setting") || s.includes("getting") || s.includes("prepar")) {
    return "Preparing model";
  }
  if (s.includes("scan")) return "Scanning photo";
  return raw?.replace(/…/g, "").trim() || "Working on your photo";
}
