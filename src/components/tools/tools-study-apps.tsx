"use client";

import {
  ToolsActionBar,
  ToolsDropzone,
  ToolsPrimaryButton,
  downloadBlob,
} from "@/components/tools/tools-ui";
import { trackToolEvent } from "@/lib/tools-analytics";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { useEffect, useMemo, useState } from "react";

function useToolOpen(slug: string) {
  useEffect(() => {
    trackToolEvent("tool_open", { slug });
  }, [slug]);
}

export function ToolPdfExtractText() {
  useToolOpen("pdf-extract-text");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFiles(files: File[]) {
    const file = files[0];
    if (!file) return;
    setBusy(true);
    setError(null);
    setText("");
    try {
      const pdfjs = await import("pdfjs-dist");
      // Prefer package worker; CDN fallback matches installed major.
      try {
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url,
        ).toString();
      } catch {
        pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
      }
      const data = new Uint8Array(await file.arrayBuffer());
      const doc = await pdfjs.getDocument({ data }).promise;
      const chunks: string[] = [];
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        const line = content.items
          .map((item) => ("str" in item ? item.str : ""))
          .join(" ");
        chunks.push(`--- Page ${i} ---\n${line}`);
      }
      setText(chunks.join("\n\n"));
      trackToolEvent("tool_complete", { slug: "pdf-extract-text" });
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Could not extract text (scanned PDFs need OCR).",
      );
      trackToolEvent("tool_error", {
        slug: "pdf-extract-text",
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
        label="Choose a text-based PDF"
        hint="Works best on typed PDFs. Scanned photos need OCR elsewhere."
        onFiles={(list) => void onFiles(list)}
        disabled={busy}
      />
      <ToolsActionBar busy={busy} error={error}>
        {text ? (
          <ToolsPrimaryButton
            onClick={() => {
              void navigator.clipboard.writeText(text);
            }}
          >
            Copy all text
          </ToolsPrimaryButton>
        ) : null}
      </ToolsActionBar>
      {text ? (
        <textarea
          readOnly
          value={text}
          className="mt-4 h-64 w-full rounded-2xl border border-hairline bg-cream/40 p-3 font-mono text-[12px] text-ink"
        />
      ) : null}
    </div>
  );
}

export function ToolNameTags() {
  useToolOpen("name-tags");
  const [namesText, setNamesText] = useState("Aarav\nMia\nKabir\nSara");
  const [perPage, setPerPage] = useState(6);
  const [busy, setBusy] = useState(false);

  async function run() {
    const names = namesText
      .split("\n")
      .map((n) => n.trim())
      .filter(Boolean);
    if (!names.length) return;
    setBusy(true);
    try {
      const doc = await PDFDocument.create();
      const font = await doc.embedFont(StandardFonts.HelveticaBold);
      const fontReg = await doc.embedFont(StandardFonts.Helvetica);
      const cols = perPage === 4 ? 2 : perPage === 8 ? 2 : 2;
      const rows = perPage / cols;
      const pageW = 595.28;
      const pageH = 841.89;
      const margin = 36;
      const gap = 12;
      const cellW = (pageW - margin * 2 - gap * (cols - 1)) / cols;
      const cellH = (pageH - margin * 2 - gap * (rows - 1)) / rows;

      for (let i = 0; i < names.length; i += perPage) {
        const page = doc.addPage([pageW, pageH]);
        const batch = names.slice(i, i + perPage);
        batch.forEach((name, idx) => {
          const col = idx % cols;
          const row = Math.floor(idx / cols);
          const x = margin + col * (cellW + gap);
          const y = pageH - margin - (row + 1) * cellH - row * gap;
          page.drawRectangle({
            x,
            y,
            width: cellW,
            height: cellH,
            borderColor: rgb(0.11, 0.14, 0.2),
            borderWidth: 2,
            color: rgb(1, 0.98, 0.95),
          });
          page.drawText("Hello, my name is", {
            x: x + 14,
            y: y + cellH - 28,
            size: 10,
            font: fontReg,
            color: rgb(0.55, 0.58, 0.62),
          });
          page.drawText(name.slice(0, 28), {
            x: x + 14,
            y: y + cellH / 2 - 8,
            size: Math.min(22, cellW / (name.length * 0.55)),
            font,
            color: rgb(0.11, 0.14, 0.2),
          });
        });
      }
      const bytes = await doc.save();
      downloadBlob(
        new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" }),
        "name-tags.pdf",
      );
      trackToolEvent("tool_complete", { slug: "name-tags" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="text-[12px] font-bold text-muted">
          Names (one per line)
        </span>
        <textarea
          value={namesText}
          onChange={(e) => setNamesText(e.target.value)}
          className="mt-1 h-40 w-full rounded-xl border border-hairline px-3 py-2.5 text-[14px] font-semibold"
        />
      </label>
      <div className="flex flex-wrap gap-2">
        {[4, 6, 8].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setPerPage(n)}
            className={`rounded-full px-3.5 py-1.5 text-[12px] font-extrabold ${
              perPage === n ? "bg-ink text-white" : "bg-cream text-muted"
            }`}
          >
            {n} / page
          </button>
        ))}
      </div>
      <ToolsActionBar busy={busy}>
        <ToolsPrimaryButton onClick={() => void run()} disabled={busy}>
          Download name tags PDF
        </ToolsPrimaryButton>
      </ToolsActionBar>
    </div>
  );
}

export function ToolWordCounter() {
  useToolOpen("word-counter");
  const [text, setText] = useState("");
  const [tracked, setTracked] = useState(false);

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, "").length;
    const sentences = trimmed
      ? trimmed.split(/[.!?]+/).filter((s) => s.trim()).length
      : 0;
    const readingMin = words / 200;
    return { words, chars, charsNoSpace, sentences, readingMin };
  }, [text]);

  useEffect(() => {
    if (!tracked && stats.words >= 10) {
      setTracked(true);
      trackToolEvent("tool_complete", {
        slug: "word-counter",
        detail: String(stats.words),
      });
    }
  }, [stats.words, tracked]);

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste essay, blog draft, or homework here…"
        className="h-56 w-full rounded-2xl border border-hairline bg-white px-4 py-3 text-[15px] font-medium text-ink"
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Words", value: stats.words },
          { label: "Characters", value: stats.chars },
          { label: "No spaces", value: stats.charsNoSpace },
          { label: "Sentences", value: stats.sentences },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-hairline bg-cream/50 p-3"
          >
            <p className="text-[11px] font-bold uppercase text-muted">
              {s.label}
            </p>
            <p className="mt-1 text-[1.35rem] font-extrabold tabular-nums text-ink">
              {s.value}
            </p>
          </div>
        ))}
      </div>
      <p className="text-[13px] font-semibold text-muted">
        Reading time ≈{" "}
        <span className="font-extrabold text-ink">
          {stats.readingMin < 1
            ? "< 1 min"
            : `${stats.readingMin.toFixed(1)} min`}
        </span>{" "}
        (≈200 wpm)
      </p>
    </div>
  );
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
const SLOTS = ["Morning", "Afternoon", "Evening"] as const;

export function ToolStudyTimetable() {
  useToolOpen("study-timetable");
  const [title, setTitle] = useState("My study week");
  const [grid, setGrid] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  function key(day: string, slot: string) {
    return `${day}:${slot}`;
  }

  async function run() {
    setBusy(true);
    try {
      const doc = await PDFDocument.create();
      const font = await doc.embedFont(StandardFonts.HelveticaBold);
      const fontReg = await doc.embedFont(StandardFonts.Helvetica);
      const page = doc.addPage([841.89, 595.28]); // A4 landscape
      const { width, height } = page.getSize();
      page.drawText(title.slice(0, 50), {
        x: 36,
        y: height - 36,
        size: 18,
        font,
        color: rgb(0.11, 0.14, 0.2),
      });
      page.drawText("Mentr Tools · free study timetable", {
        x: 36,
        y: height - 54,
        size: 9,
        font: fontReg,
        color: rgb(0.55, 0.58, 0.62),
      });

      const left = 36;
      const top = height - 80;
      const colW = (width - 72) / (DAYS.length + 1);
      const rowH = (top - 36) / (SLOTS.length + 1);

      for (let c = 0; c <= DAYS.length; c++) {
        for (let r = 0; r <= SLOTS.length; r++) {
          const x = left + c * colW;
          const y = top - (r + 1) * rowH;
          page.drawRectangle({
            x,
            y,
            width: colW,
            height: rowH,
            borderColor: rgb(0.8, 0.82, 0.85),
            borderWidth: 0.8,
            color: r === 0 || c === 0 ? rgb(0.98, 0.96, 0.93) : rgb(1, 1, 1),
          });
          let label = "";
          if (r === 0 && c === 0) label = "";
          else if (r === 0) label = DAYS[c - 1]!;
          else if (c === 0) label = SLOTS[r - 1]!;
          else label = grid[key(DAYS[c - 1]!, SLOTS[r - 1]!)] || "";
          if (label) {
            page.drawText(label.slice(0, 18), {
              x: x + 6,
              y: y + rowH / 2 - 4,
              size: 9,
              font: r === 0 || c === 0 ? font : fontReg,
              color: rgb(0.11, 0.14, 0.2),
            });
          }
        }
      }

      const bytes = await doc.save();
      downloadBlob(
        new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" }),
        "study-timetable.pdf",
      );
      trackToolEvent("tool_complete", { slug: "study-timetable" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="text-[12px] font-bold text-muted">Title</span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full rounded-xl border border-hairline px-3 py-2.5 text-[14px] font-semibold"
        />
      </label>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-[12px]">
          <thead>
            <tr>
              <th className="border border-hairline bg-cream p-2" />
              {DAYS.map((d) => (
                <th
                  key={d}
                  className="border border-hairline bg-cream p-2 font-extrabold"
                >
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SLOTS.map((slot) => (
              <tr key={slot}>
                <th className="border border-hairline bg-cream p-2 text-left font-extrabold">
                  {slot}
                </th>
                {DAYS.map((day) => (
                  <td key={day} className="border border-hairline p-1">
                    <input
                      value={grid[key(day, slot)] || ""}
                      onChange={(e) =>
                        setGrid((prev) => ({
                          ...prev,
                          [key(day, slot)]: e.target.value,
                        }))
                      }
                      placeholder="Subject"
                      className="w-full rounded-md bg-white px-2 py-1.5 text-[12px] font-semibold"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ToolsActionBar busy={busy}>
        <ToolsPrimaryButton onClick={() => void run()} disabled={busy}>
          Download timetable PDF
        </ToolsPrimaryButton>
      </ToolsActionBar>
    </div>
  );
}
