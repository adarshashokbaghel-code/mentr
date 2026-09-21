"use client";

import {
  hardShadow,
  hardShadowSm,
} from "@/components/landing/lp/shared";
import {
  NCERT_MATHS_TEXTBOOKS,
  type NcertMathsChapter,
} from "@/lib/ncert-maths-chapters";
import {
  NCERT_SCIENCE_TEXTBOOKS,
  type NcertScienceChapter,
} from "@/lib/ncert-science-chapters";
import {
  NCERT_PHYSICS_TEXTBOOKS,
  type NcertPhysicsChapter,
} from "@/lib/ncert-physics-chapters";
import {
  NCERT_CHEMISTRY_TEXTBOOKS,
  type NcertChemistryChapter,
} from "@/lib/ncert-chemistry-chapters";
import {
  NCERT_BIOLOGY_TEXTBOOKS,
  type NcertBiologyChapter,
} from "@/lib/ncert-biology-chapters";
import { cn } from "@/lib/utils";
import { BookOpen, Download, Eye, Loader2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const SHELL =
  "mx-auto w-full min-w-0 max-w-[1400px] px-4 sm:px-6 lg:px-10";

type SubjectTab =
  | "Mathematics"
  | "Science"
  | "Physics"
  | "Chemistry"
  | "Biology";
type PdfChapter =
  | NcertMathsChapter
  | NcertScienceChapter
  | NcertPhysicsChapter
  | NcertChemistryChapter
  | NcertBiologyChapter;

const SENIOR_SCIENCE: SubjectTab[] = ["Physics", "Chemistry", "Biology"];

type Props = {
  activeChapter?: number;
  activeClassLevel?: number;
  activeSubject?: string;
  className?: string;
  compact?: boolean;
};

function PdfReaderModal({
  classLevel,
  subject,
  chapter,
  onClose,
}: {
  classLevel: number;
  subject: SubjectTab;
  chapter: PdfChapter;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/60 p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`PDF reader — Class ${classLevel} ${subject} Chapter ${chapter.number}`}
      onClick={onClose}
    >
      <div
        className={cn(
          "flex h-[min(92vh,900px)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border-2 border-ink bg-white",
          hardShadow,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b-2 border-ink/10 px-4 py-3 sm:px-5">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wide text-muted">
              Class {classLevel} · {subject} · Chapter {chapter.number} · PDF
              reader
            </p>
            <p className="truncate text-sm font-extrabold text-ink sm:text-base">
              {chapter.name}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <a
              href={chapter.downloadUrl}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border-2 border-ink/15 px-3 text-xs font-bold text-ink hover:border-ink/40"
            >
              <Download className="h-3.5 w-3.5" />
              Save
            </a>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border-2 border-ink/15 text-ink hover:border-ink/40"
              aria-label="Close PDF reader"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <iframe
          title={`NCERT Class ${classLevel} ${subject} Chapter ${chapter.number}`}
          src={chapter.viewUrl}
          className="h-full w-full flex-1 bg-cream"
        />
      </div>
    </div>
  );
}

function bookFor(subject: SubjectTab, classLevel: number) {
  if (subject === "Science") return NCERT_SCIENCE_TEXTBOOKS[classLevel as 9 | 10];
  if (subject === "Physics") return NCERT_PHYSICS_TEXTBOOKS[classLevel as 11 | 12];
  if (subject === "Chemistry")
    return NCERT_CHEMISTRY_TEXTBOOKS[classLevel as 11 | 12];
  if (subject === "Biology") return NCERT_BIOLOGY_TEXTBOOKS[classLevel as 11 | 12];
  return NCERT_MATHS_TEXTBOOKS[classLevel as 9 | 10 | 11 | 12];
}

/**
 * Chapter-wise NCERT PDF downloads — Maths 9–12 + Science 9–10 + Physics/Chemistry/Biology 11–12.
 */
export function NcertChapterPdfSection({
  activeChapter,
  activeClassLevel,
  activeSubject,
  className,
  compact,
}: Props) {
  const initialSubject: SubjectTab =
    activeSubject === "Science" ||
    activeSubject === "Physics" ||
    activeSubject === "Chemistry" ||
    activeSubject === "Biology"
      ? activeSubject
      : "Mathematics";
  const initialClass =
    activeClassLevel === 9 ||
    activeClassLevel === 10 ||
    activeClassLevel === 11 ||
    activeClassLevel === 12
      ? activeClassLevel
      : 9;

  const [subject, setSubject] = useState<SubjectTab>(initialSubject);
  const [classLevel, setClassLevel] = useState<number>(() => {
    if (initialSubject === "Science" && initialClass > 10) return 9;
    if (SENIOR_SCIENCE.includes(initialSubject) && initialClass < 11) return 11;
    return initialClass;
  });
  const [busy, setBusy] = useState<number | "all" | null>(null);
  const [error, setError] = useState("");
  const [viewer, setViewer] = useState<PdfChapter | null>(null);

  useEffect(() => {
    if (
      activeSubject === "Science" ||
      activeSubject === "Mathematics" ||
      activeSubject === "Physics" ||
      activeSubject === "Chemistry" ||
      activeSubject === "Biology"
    ) {
      setSubject(activeSubject);
    }
  }, [activeSubject]);

  useEffect(() => {
    if (
      activeClassLevel === 9 ||
      activeClassLevel === 10 ||
      activeClassLevel === 11 ||
      activeClassLevel === 12
    ) {
      if (subject === "Science" && activeClassLevel > 10) {
        setClassLevel(9);
      } else if (SENIOR_SCIENCE.includes(subject) && activeClassLevel < 11) {
        setClassLevel(11);
      } else {
        setClassLevel(activeClassLevel);
      }
    }
  }, [activeClassLevel, subject]);

  const classTabs =
    subject === "Science"
      ? ([9, 10] as const)
      : SENIOR_SCIENCE.includes(subject)
        ? ([11, 12] as const)
        : ([9, 10, 11, 12] as const);

  const book = bookFor(subject, classLevel);
  const chapters = useMemo(() => book?.chapters ?? [], [book]);

  async function downloadOne(ch: PdfChapter) {
    setError("");
    setBusy(ch.number);
    try {
      const res = await fetch(ch.downloadUrl, { credentials: "same-origin" });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(body?.error || "Download failed. Try again.");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = ch.filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed");
    } finally {
      setBusy(null);
    }
  }

  async function downloadAll() {
    setError("");
    setBusy("all");
    try {
      for (const ch of chapters) {
        setBusy(ch.number);
        const res = await fetch(ch.downloadUrl, { credentials: "same-origin" });
        if (!res.ok) {
          throw new Error(
            `Chapter ${ch.number} not ready offline yet — retry shortly.`,
          );
        }
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = ch.filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        await new Promise((r) => setTimeout(r, 350));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download all failed");
    } finally {
      setBusy(null);
    }
  }

  return (
    <section
      id="ncert-maths-pdfs"
      aria-labelledby="ncert-pdfs-heading"
      className={cn(
        "scroll-mt-24 border-t border-hairline bg-gradient-to-b from-cream via-[#fff8ef] to-cream",
        compact ? "pt-4 pb-8 sm:pt-5 sm:pb-10" : "py-16 sm:py-20",
        className,
      )}
    >
      <div className={SHELL}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-coral">
              Free NCERT PDFs
            </p>
            <h2
              id="ncert-pdfs-heading"
              className="mt-2 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl"
            >
              Download Class {classLevel} {subject} — chapter-wise
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">
              {book?.sourceNote} View opens a reader on this page — no redirect.
              Snap &amp; Grade questions match these PDFs.
            </p>
          </div>
          <button
            type="button"
            disabled={busy !== null || chapters.length === 0}
            onClick={() => void downloadAll()}
            className={cn(
              "inline-flex h-11 items-center justify-center gap-2 rounded-xl border-2 border-ink bg-ink px-4 text-sm font-bold text-white transition hover:bg-ink/90 disabled:opacity-50",
              hardShadowSm,
            )}
          >
            {busy !== null ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <BookOpen className="h-4 w-4" />
            )}
            {busy !== null
              ? `Saving${busy === "all" ? "" : ` Ch ${busy}`}…`
              : "Download all available"}
          </button>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {(
            [
              "Mathematics",
              "Science",
              "Physics",
              "Chemistry",
              "Biology",
            ] as const
          ).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setSubject(s);
                setClassLevel(
                  s === "Science" ? 9 : SENIOR_SCIENCE.includes(s) ? 11 : 9,
                );
                setError("");
                setViewer(null);
              }}
              className={cn(
                "inline-flex h-10 items-center rounded-xl border-2 px-4 text-sm font-bold transition",
                subject === s
                  ? "border-ink bg-ink text-white"
                  : "border-ink/15 bg-white text-ink hover:border-ink/35",
              )}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {classTabs.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                setClassLevel(c);
                setError("");
                setViewer(null);
              }}
              className={cn(
                "inline-flex h-10 items-center rounded-xl border-2 px-4 text-sm font-bold transition",
                classLevel === c
                  ? "border-ink bg-coral text-white"
                  : "border-ink/15 bg-white text-ink hover:border-ink/35",
              )}
            >
              Class {c}
            </button>
          ))}
        </div>

        {error ? (
          <p className="mt-4 text-sm font-medium text-coral-dark">{error}</p>
        ) : null}

        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {chapters.map((ch) => {
            const active =
              activeChapter === ch.number &&
              (activeClassLevel == null || activeClassLevel === classLevel) &&
              (activeSubject == null || activeSubject === subject);
            const loading = busy === ch.number;
            return (
              <li key={`${subject}-${classLevel}-${ch.number}`}>
                <div
                  data-chapter={ch.slug}
                  className={cn(
                    "flex h-full flex-col rounded-2xl border-2 bg-white p-4",
                    active ? "border-ink" : "border-ink/10",
                    hardShadowSm,
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wide text-muted">
                        Chapter {ch.number}
                        {active ? " · selected" : ""}
                        {ch.localReady ? " · ready" : ""}
                      </p>
                      <p className="mt-1 text-[15px] font-extrabold leading-snug text-ink">
                        {ch.name}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 flex-1 text-xs leading-relaxed text-muted">
                    {ch.blurb}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={busy !== null}
                      onClick={() => void downloadOne(ch)}
                      className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl border-2 border-ink bg-coral px-3 text-xs font-bold text-white transition hover:bg-coral-dark disabled:opacity-50"
                    >
                      {loading ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Download className="h-3.5 w-3.5" />
                      )}
                      {loading ? "Saving…" : "Download PDF"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewer(ch)}
                      className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border-2 border-ink/15 bg-cream px-3 text-xs font-bold text-ink transition hover:border-ink/35"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div
          className={cn(
            "mt-8 rounded-2xl border-2 border-ink/10 bg-white p-5 sm:p-6",
            hardShadow,
          )}
        >
          <p className="text-sm font-bold text-ink">Matched to NCERT PDFs</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Maths Classes 9–12, Science Classes 9–10, and Physics, Chemistry
            &amp; Biology Classes 11–12 are graded from the same NCERT PDFs you
            can open here. Exercise numbers follow the book print.
          </p>
        </div>
      </div>

      {viewer ? (
        <PdfReaderModal
          classLevel={classLevel}
          subject={subject}
          chapter={viewer}
          onClose={() => setViewer(null)}
        />
      ) : null}
    </section>
  );
}
