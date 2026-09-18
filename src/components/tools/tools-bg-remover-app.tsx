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
import { Download, RotateCcw, Shield, Sparkles } from "lucide-react";
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
      setStatus(p.message);
      setProgress(p.progress ?? null);
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
      const v = await validateAndNormalizeImage(file);
      previewRef.current = v.previewUrl;
      setValidated(v);
      setBusy(true);
      setStatus("Scanning your photo…");
      trackToolEvent("tool_generated", {
        slug: SLUG,
        detail: resolutionBucket(v.processWidth, v.processHeight),
      });

      const client = clientRef.current;
      if (!client) throw new Error("Processor unavailable");

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
          ) : null}

          <ToolsActionBar busy={busy} error={error}>
            {resultUrl ? (
              <ToolsPrimaryButton onClick={download} disabled={busy}>
                <Download className="mr-1.5 h-4 w-4" />
                Download PNG
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
  const label = friendlyStatus(status);
  const bar =
    progress != null
      ? progress
      : label.includes("edge")
        ? 78
        : label.includes("subject")
          ? 52
          : label.includes("ready") || label.includes("Setting")
            ? Math.max(12, progress ?? 18)
            : 35;

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-ink/10 bg-ink">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={previewUrl}
          alt=""
          className="h-full w-full object-contain opacity-80"
          draggable={false}
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/20 via-transparent to-ink/50"
          aria-hidden
        />
        {/* Scanning beam */}
        <div
          className="mentr-bg-scan pointer-events-none absolute inset-x-0 h-28 bg-gradient-to-b from-transparent via-coral/55 to-transparent"
          aria-hidden
        />
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
          <div className="flex items-center gap-2 text-white">
            <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-coral/90">
              <Sparkles className="h-4 w-4 animate-pulse" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-extrabold tracking-tight">
                {label}
              </p>
              <p className="text-[11px] font-medium text-white/65">
                Private on your device · almost there
              </p>
            </div>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-coral transition-[width] duration-500 ease-out"
              style={{ width: `${Math.min(96, bar)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function friendlyStatus(raw: string | null): string {
  const s = (raw || "").toLowerCase();
  if (s.includes("edge") || s.includes("clean") || s.includes("detail")) {
    return "Cleaning fine edges…";
  }
  if (s.includes("subject") || s.includes("finding") || s.includes("remov")) {
    return "Finding your subject…";
  }
  if (s.includes("optim") || s.includes("another") || s.includes("path")) {
    return "Tuning for your device…";
  }
  if (s.includes("ready") || s.includes("setting") || s.includes("getting")) {
    return "Getting ready…";
  }
  if (s.includes("scan")) return "Scanning your photo…";
  return raw?.trim() || "Working on your photo…";
}
