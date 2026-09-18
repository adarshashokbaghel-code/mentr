"use client";

import {
  ToolsActionBar,
  ToolsDropzone,
  ToolsFileList,
  ToolsPrimaryButton,
  downloadBlob,
} from "@/components/tools/tools-ui";
import { trackToolEvent } from "@/lib/tools-analytics";
import {
  compressPdf,
  getPdfPageCount,
  imagesToPdf,
  mergePdfs,
  organizePdf,
  parsePageRanges,
  splitEveryPage,
  splitPdfByRanges,
} from "@/lib/tools-pdf";
import { useEffect, useState } from "react";
import JSZip from "./tools-zip-lite";

function useToolOpen(slug: string) {
  useEffect(() => {
    trackToolEvent("tool_open", { slug });
  }, [slug]);
}

export function ToolPdfMerge() {
  useToolOpen("pdf-merge");
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function move(from: number, to: number) {
    setFiles((prev) => {
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item!);
      return next;
    });
  }

  async function run() {
    if (files.length < 2) {
      setError("Add at least two PDFs.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const bytes = await mergePdfs(files);
      downloadBlob(
        new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" }),
        "merged.pdf",
      );
      trackToolEvent("tool_complete", { slug: "pdf-merge" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Merge failed");
      trackToolEvent("tool_error", {
        slug: "pdf-merge",
        detail: e instanceof Error ? e.message : "fail",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <ToolsDropzone
        accept="application/pdf,.pdf"
        multiple
        label="Drop PDFs here or click to choose"
        hint="Order them below, then merge. Files stay on your device."
        onFiles={(list) => setFiles((prev) => [...prev, ...list])}
        disabled={busy}
      />
      <ToolsFileList
        files={files}
        onRemove={(i) => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
        onMove={move}
      />
      <ToolsActionBar busy={busy} error={error}>
        <ToolsPrimaryButton onClick={() => void run()} disabled={busy || files.length < 2}>
          Merge & download
        </ToolsPrimaryButton>
      </ToolsActionBar>
    </div>
  );
}

export function ToolPdfSplit() {
  useToolOpen("pdf-split");
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [mode, setMode] = useState<"range" | "every">("range");
  const [ranges, setRanges] = useState("1-2");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFile(files: File[]) {
    const f = files[0];
    if (!f) return;
    setFile(f);
    try {
      setPageCount(await getPdfPageCount(f));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read PDF");
    }
  }

  async function run() {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const parts =
        mode === "every"
          ? await splitEveryPage(file)
          : await splitPdfByRanges(
              file,
              parsePageRanges(ranges, pageCount),
            );
      if (!parts.length) {
        setError("No valid pages selected.");
        return;
      }
      if (parts.length === 1) {
        downloadBlob(
          new Blob([parts[0]!.bytes.buffer as ArrayBuffer], {
            type: "application/pdf",
          }),
          parts[0]!.name,
        );
      } else {
        const zip = await JSZip.fromPdfs(parts);
        downloadBlob(zip, "split-pages.zip");
      }
      trackToolEvent("tool_complete", { slug: "pdf-split" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Split failed");
      trackToolEvent("tool_error", {
        slug: "pdf-split",
        detail: e instanceof Error ? e.message : "fail",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <ToolsDropzone
        accept="application/pdf,.pdf"
        label="Choose a PDF to split"
        onFiles={(list) => void onFile(list)}
        disabled={busy}
      />
      {file ? (
        <p className="mt-3 text-[13px] font-semibold text-muted">
          {file.name} · {pageCount} page{pageCount === 1 ? "" : "s"}
        </p>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2">
        {(
          [
            { id: "range" as const, label: "Page ranges" },
            { id: "every" as const, label: "Every page" },
          ] as const
        ).map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMode(m.id)}
            className={`rounded-full px-3.5 py-1.5 text-[12px] font-extrabold ${
              mode === m.id
                ? "bg-ink text-white"
                : "bg-cream text-muted hover:text-ink"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>
      {mode === "range" ? (
        <label className="mt-3 block">
          <span className="text-[12px] font-bold text-muted">
            Ranges (e.g. 1-3,5)
          </span>
          <input
            value={ranges}
            onChange={(e) => setRanges(e.target.value)}
            className="mt-1 w-full rounded-xl border border-hairline bg-white px-3 py-2.5 text-[14px] font-semibold text-ink"
          />
        </label>
      ) : null}
      <ToolsActionBar busy={busy} error={error}>
        <ToolsPrimaryButton onClick={() => void run()} disabled={busy || !file}>
          Split & download
        </ToolsPrimaryButton>
      </ToolsActionBar>
    </div>
  );
}

export function ToolPdfCompress() {
  useToolOpen("pdf-compress");
  const [file, setFile] = useState<File | null>(null);
  const [strength, setStrength] = useState<"light" | "strong">("light");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<string | null>(null);

  async function run() {
    if (!file) return;
    setBusy(true);
    setError(null);
    setStats(null);
    try {
      const { bytes, before, after } = await compressPdf(file, strength);
      downloadBlob(
        new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" }),
        file.name.replace(/\.pdf$/i, "") + "-compressed.pdf",
      );
      const pct = before ? Math.round((1 - after / before) * 100) : 0;
      setStats(
        `${(before / 1024).toFixed(0)} KB → ${(after / 1024).toFixed(0)} KB (${pct}% smaller)`,
      );
      trackToolEvent("tool_complete", { slug: "pdf-compress" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Compress failed");
      trackToolEvent("tool_error", {
        slug: "pdf-compress",
        detail: e instanceof Error ? e.message : "fail",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <ToolsDropzone
        accept="application/pdf,.pdf"
        label="Choose a PDF to compress"
        hint="Great for WhatsApp limits. Stronger mode scales pages slightly."
        onFiles={(list) => setFile(list[0] ?? null)}
        disabled={busy}
      />
      {file ? (
        <p className="mt-3 text-[13px] font-semibold text-muted">
          {file.name} · {(file.size / 1024).toFixed(0)} KB
        </p>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2">
        {(
          [
            { id: "light" as const, label: "Light" },
            { id: "strong" as const, label: "Strong" },
          ] as const
        ).map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setStrength(m.id)}
            className={`rounded-full px-3.5 py-1.5 text-[12px] font-extrabold ${
              strength === m.id
                ? "bg-ink text-white"
                : "bg-cream text-muted hover:text-ink"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>
      {stats ? (
        <p className="mt-3 text-[13px] font-bold text-sage">{stats}</p>
      ) : null}
      <ToolsActionBar busy={busy} error={error}>
        <ToolsPrimaryButton onClick={() => void run()} disabled={busy || !file}>
          Compress & download
        </ToolsPrimaryButton>
      </ToolsActionBar>
    </div>
  );
}

export function ToolImagesToPdf() {
  useToolOpen("images-to-pdf");
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function move(from: number, to: number) {
    setFiles((prev) => {
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item!);
      return next;
    });
  }

  async function run() {
    if (!files.length) return;
    setBusy(true);
    setError(null);
    try {
      const bytes = await imagesToPdf(files, 0.72);
      downloadBlob(
        new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" }),
        "images.pdf",
      );
      trackToolEvent("tool_complete", { slug: "images-to-pdf" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion failed");
      trackToolEvent("tool_error", {
        slug: "images-to-pdf",
        detail: e instanceof Error ? e.message : "fail",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <ToolsDropzone
        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        multiple
        label="Drop photos or screenshots"
        hint="Homework camera shots work well. Reorder before creating the PDF."
        onFiles={(list) => setFiles((prev) => [...prev, ...list])}
        disabled={busy}
      />
      <ToolsFileList
        files={files}
        onRemove={(i) => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
        onMove={move}
      />
      <ToolsActionBar busy={busy} error={error}>
        <ToolsPrimaryButton onClick={() => void run()} disabled={busy || !files.length}>
          Create PDF
        </ToolsPrimaryButton>
      </ToolsActionBar>
    </div>
  );
}

export function ToolPdfOrganize() {
  useToolOpen("pdf-organize");
  const [file, setFile] = useState<File | null>(null);
  const [order, setOrder] = useState<number[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFile(files: File[]) {
    const f = files[0];
    if (!f) return;
    setFile(f);
    try {
      const n = await getPdfPageCount(f);
      setOrder(Array.from({ length: n }, (_, i) => i));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read PDF");
    }
  }

  function move(from: number, to: number) {
    setOrder((prev) => {
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item!);
      return next;
    });
  }

  async function run() {
    if (!file || !order.length) return;
    setBusy(true);
    setError(null);
    try {
      const bytes = await organizePdf(file, order);
      downloadBlob(
        new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" }),
        "organized.pdf",
      );
      trackToolEvent("tool_complete", { slug: "pdf-organize" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Organize failed");
      trackToolEvent("tool_error", {
        slug: "pdf-organize",
        detail: e instanceof Error ? e.message : "fail",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <ToolsDropzone
        accept="application/pdf,.pdf"
        label="Choose a PDF to organize"
        onFiles={(list) => void onFile(list)}
        disabled={busy}
      />
      {order.length ? (
        <ul className="mt-3 space-y-2">
          {order.map((pageIndex, i) => (
            <li
              key={`${pageIndex}-${i}`}
              className="flex items-center gap-2 rounded-xl border border-hairline bg-white px-3 py-2"
            >
              <span className="text-[13px] font-extrabold text-ink">
                Page {pageIndex + 1}
              </span>
              <span className="ml-auto flex gap-1">
                <button
                  type="button"
                  disabled={i === 0}
                  onClick={() => move(i, i - 1)}
                  className="rounded-md px-2 py-1 text-[11px] font-bold disabled:opacity-40"
                >
                  ↑
                </button>
                <button
                  type="button"
                  disabled={i === order.length - 1}
                  onClick={() => move(i, i + 1)}
                  className="rounded-md px-2 py-1 text-[11px] font-bold disabled:opacity-40"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setOrder((prev) => prev.filter((_, idx) => idx !== i))
                  }
                  className="rounded-md px-2 py-1 text-[11px] font-bold text-coral"
                >
                  Delete
                </button>
              </span>
            </li>
          ))}
        </ul>
      ) : null}
      <ToolsActionBar busy={busy} error={error}>
        <ToolsPrimaryButton
          onClick={() => void run()}
          disabled={busy || !file || !order.length}
        >
          Download organized PDF
        </ToolsPrimaryButton>
      </ToolsActionBar>
    </div>
  );
}
