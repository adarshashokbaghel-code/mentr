"use client";

import {
  ToolActionRow,
  ToolBtn,
  ToolField,
  ToolWorkspace,
  toolInputClass,
} from "@/components/tools/tool-workspace";
import { downloadBlob } from "@/components/tools/tools-ui";
import { trackToolEvent } from "@/lib/tools-analytics";
import {
  createTextPdf,
  slugFilename,
  type PdfLine,
} from "@/lib/tools/pdf/create-text-pdf";
import {
  generatePracticeQuestions,
  type GeneratedQuestion,
  type QType,
} from "@/lib/tools/generators/practice-questions";
import { useEffect, useMemo, useState } from "react";

function useToolOpen(slug: string) {
  useEffect(() => {
    trackToolEvent("tool_viewed", { slug });
    trackToolEvent("tool_open", { slug });
  }, [slug]);
}

const QTYPE_LABELS: { id: QType; label: string }[] = [
  { id: "mcq", label: "Multiple choice" },
  { id: "fill", label: "Fill in blanks" },
  { id: "short", label: "Short answer" },
  { id: "truefalse", label: "True / false" },
  { id: "long", label: "Long answer" },
];

function questionsToPdfLines(
  title: string,
  meta: string[],
  questions: GeneratedQuestion[],
  mode: "worksheet" | "paper" | "key",
): PdfLine[] {
  const lines: PdfLine[] = [
    { type: "h1", text: title },
    { type: "meta", text: "Mentr Tools · sample practice (not an official board paper)" },
    { type: "blank", height: 6 },
  ];
  for (const m of meta) lines.push({ type: "meta", text: m });
  lines.push({ type: "hr" });

  if (mode === "key") {
    lines.push({ type: "h2", text: "ANSWER KEY" });
    questions.forEach((q, i) => {
      lines.push({
        type: "li",
        bullet: `${i + 1}.`,
        text: `${q.answer}${q.marks ? ` (${q.marks} mark${q.marks === 1 ? "" : "s"})` : ""}${q.note ? ` — ${q.note}` : ""}`,
      });
    });
    return lines;
  }

  if (mode === "worksheet") {
    lines.push({ type: "p", text: "Student Name: ____________________" });
    lines.push({ type: "p", text: "Date: ______________    Class: ______________" });
    lines.push({ type: "blank", height: 8 });
  }

  questions.forEach((q, i) => {
    lines.push({
      type: "p",
      text: `${i + 1}. (${q.marks} mark${q.marks === 1 ? "" : "s"}) ${q.prompt}`,
    });
    if (q.options?.length) {
      for (const o of q.options) lines.push({ type: "li", text: o });
    }
    if (mode === "worksheet" && (q.type === "short" || q.type === "long" || q.type === "fill")) {
      lines.push({ type: "blank", height: q.type === "long" ? 48 : 28 });
    } else {
      lines.push({ type: "blank", height: 8 });
    }
  });
  return lines;
}

export function ToolWorksheetGenerator() {
  useToolOpen("worksheet-generator");
  const [klass, setKlass] = useState("5");
  const [subject, setSubject] = useState("Mathematics");
  const [topic, setTopic] = useState("Fractions");
  const [difficulty, setDifficulty] = useState("Medium");
  const [count, setCount] = useState(8);
  const [types, setTypes] = useState<QType[]>(["mcq", "short"]);
  const [instructions, setInstructions] = useState(
    "Answer all questions. Show working where needed.",
  );
  const [questions, setQuestions] = useState<GeneratedQuestion[] | null>(null);
  const [seed, setSeed] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleType(t: QType) {
    setTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );
  }

  function generate() {
    setError(null);
    if (!types.length) {
      setError("Select at least one question type.");
      return;
    }
    trackToolEvent("tool_started", { slug: "worksheet-generator" });
    const qs = generatePracticeQuestions({
      classLevel: klass,
      subject,
      topic,
      difficulty,
      count,
      types,
      seedExtra: String(seed),
    });
    setQuestions(qs);
    trackToolEvent("tool_generated", { slug: "worksheet-generator" });
  }

  async function download() {
    if (!questions?.length) {
      setError("Generate a worksheet first.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const lines = questionsToPdfLines(
        "Mentr Worksheet",
        [
          `Class: ${klass}    Subject: ${subject}`,
          `Topic: ${topic}    Difficulty: ${difficulty}`,
          `Instructions: ${instructions}`,
        ],
        questions,
        "worksheet",
      );
      const bytes = await createTextPdf(lines);
      downloadBlob(
        new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" }),
        slugFilename(["worksheet", `class-${klass}`, subject, topic]),
      );
      trackToolEvent("tool_downloaded", { slug: "worksheet-generator" });
      trackToolEvent("tool_complete", { slug: "worksheet-generator" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create PDF");
      trackToolEvent("tool_error", {
        slug: "worksheet-generator",
        detail: "pdf",
      });
    } finally {
      setBusy(false);
    }
  }

  function printPreview() {
    if (!questions?.length) {
      setError("Generate a worksheet first.");
      return;
    }
    trackToolEvent("tool_printed", { slug: "worksheet-generator" });
    window.print();
  }

  function reset() {
    setQuestions(null);
    setSeed(1);
    setError(null);
    trackToolEvent("tool_reset", { slug: "worksheet-generator" });
  }

  return (
    <div>
      <ToolWorkspace
        emptyPreview={!questions}
        form={
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <ToolField label="Class">
                <input
                  className={toolInputClass}
                  value={klass}
                  onChange={(e) => setKlass(e.target.value)}
                />
              </ToolField>
              <ToolField label="Subject">
                <input
                  className={toolInputClass}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </ToolField>
              <ToolField label="Topic">
                <input
                  className={toolInputClass}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </ToolField>
              <ToolField label="Difficulty">
                <select
                  className={toolInputClass}
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  {["Easy", "Medium", "Hard"].map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </ToolField>
              <ToolField label={`Questions: ${count}`}>
                <input
                  type="range"
                  min={4}
                  max={20}
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="mt-2 w-full"
                />
              </ToolField>
            </div>
            <ToolField label="Question types">
              <div className="flex flex-wrap gap-2">
                {QTYPE_LABELS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => toggleType(t.id)}
                    className={`rounded-full px-3 py-1.5 text-[12px] font-extrabold ${
                      types.includes(t.id)
                        ? "bg-ink text-white"
                        : "bg-cream text-muted"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </ToolField>
            <ToolField label="Instructions (optional)">
              <textarea
                className={toolInputClass}
                rows={2}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              />
            </ToolField>
            <p className="text-[11px] font-medium text-muted">
              Questions are algorithmic practice samples — not official board
              papers.
            </p>
            <ToolActionRow busy={busy} error={error}>
              <ToolBtn onClick={generate}>Generate</ToolBtn>
              <ToolBtn
                variant="secondary"
                onClick={() => {
                  const next = seed + 1;
                  setSeed(next);
                  setError(null);
                  trackToolEvent("tool_started", { slug: "worksheet-generator" });
                  const qs = generatePracticeQuestions({
                    classLevel: klass,
                    subject,
                    topic,
                    difficulty,
                    count,
                    types,
                    seedExtra: String(next),
                  });
                  setQuestions(qs);
                  trackToolEvent("tool_generated", { slug: "worksheet-generator" });
                }}
                disabled={!questions}
              >
                Regenerate
              </ToolBtn>
              <ToolBtn variant="secondary" onClick={() => void download()} disabled={busy}>
                Download PDF
              </ToolBtn>
              <ToolBtn variant="ghost" onClick={printPreview}>
                Print
              </ToolBtn>
              <ToolBtn variant="ghost" onClick={reset}>
                Reset
              </ToolBtn>
            </ToolActionRow>
          </>
        }
        preview={
          !questions ? (
            <p>Set class, subject and topic, then generate a printable worksheet.</p>
          ) : (
            <div className="space-y-3 print:text-black" id="worksheet-preview">
              <p className="text-[15px] font-extrabold">Mentr Worksheet</p>
              <p className="text-[12px] text-muted">
                Class {klass} · {subject} · {topic}
              </p>
              <p className="text-[12px]">Student Name: __________ · Date: __________</p>
              <ol className="list-decimal space-y-3 pl-5">
                {questions.map((q) => (
                  <li key={q.id}>
                    <span className="font-semibold">({q.marks}) </span>
                    {q.prompt}
                    {q.options ? (
                      <ul className="mt-1 list-none space-y-0.5 pl-0 text-muted">
                        {q.options.map((o) => (
                          <li key={o}>{o}</li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                ))}
              </ol>
            </div>
          )
        }
      />
    </div>
  );
}

export function ToolQuestionPaperGenerator() {
  useToolOpen("question-paper-generator");
  const [klass, setKlass] = useState("8");
  const [subject, setSubject] = useState("Mathematics");
  const [board, setBoard] = useState("CBSE");
  const [topic, setTopic] = useState("Linear equations");
  const [difficulty, setDifficulty] = useState("Medium");
  const [totalMarks, setTotalMarks] = useState(40);
  const [duration, setDuration] = useState(90);
  const [count, setCount] = useState(12);
  const [types, setTypes] = useState<QType[]>(["mcq", "short", "long"]);
  const [instructions, setInstructions] = useState(
    "Read all questions carefully. Write neatly. Internal choice where indicated by your teacher.",
  );
  const [questions, setQuestions] = useState<GeneratedQuestion[] | null>(null);
  const [seed, setSeed] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const marksSum = useMemo(
    () => questions?.reduce((n, q) => n + q.marks, 0) ?? 0,
    [questions],
  );

  function generate() {
    setError(null);
    if (!types.length) {
      setError("Select at least one question type.");
      return;
    }
    trackToolEvent("tool_started", { slug: "question-paper-generator" });
    const qs = generatePracticeQuestions({
      classLevel: klass,
      subject,
      topic,
      difficulty,
      count,
      types,
      seedExtra: `paper-${seed}`,
    });
    setQuestions(qs);
    try {
      sessionStorage.setItem(
        "mentr-answer-key-draft",
        JSON.stringify({
          klass,
          subject,
          board,
          topic,
          questions: qs,
        }),
      );
    } catch {
      /* ignore */
    }
    trackToolEvent("tool_generated", { slug: "question-paper-generator" });
  }

  async function download() {
    if (!questions?.length) {
      setError("Generate a paper first.");
      return;
    }
    setBusy(true);
    try {
      const lines = questionsToPdfLines(
        "QUESTION PAPER",
        [
          `Class ${klass} · ${subject} · ${board}`,
          `Topic / chapter: ${topic}`,
          `Time: ${duration} minutes · Maximum Marks: ${totalMarks} (generated total ${marksSum})`,
          `Instructions: ${instructions}`,
        ],
        questions,
        "paper",
      );
      const bytes = await createTextPdf(lines);
      downloadBlob(
        new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" }),
        slugFilename(["question-paper", `class-${klass}`, subject]),
      );
      trackToolEvent("tool_downloaded", { slug: "question-paper-generator" });
      trackToolEvent("tool_complete", { slug: "question-paper-generator" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "PDF failed");
      trackToolEvent("tool_error", { slug: "question-paper-generator", detail: "pdf" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <ToolWorkspace
        emptyPreview={!questions}
        form={
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <ToolField label="Class">
                <input className={toolInputClass} value={klass} onChange={(e) => setKlass(e.target.value)} />
              </ToolField>
              <ToolField label="Subject">
                <input className={toolInputClass} value={subject} onChange={(e) => setSubject(e.target.value)} />
              </ToolField>
              <ToolField label="Board (label only)">
                <select className={toolInputClass} value={board} onChange={(e) => setBoard(e.target.value)}>
                  {["CBSE", "ICSE", "State", "Other"].map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
              </ToolField>
              <ToolField label="Topic / chapter">
                <input className={toolInputClass} value={topic} onChange={(e) => setTopic(e.target.value)} />
              </ToolField>
              <ToolField label="Difficulty">
                <select className={toolInputClass} value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                  {["Easy", "Medium", "Hard"].map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </ToolField>
              <ToolField label="Duration (minutes)">
                <input
                  type="number"
                  className={toolInputClass}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value) || 0)}
                />
              </ToolField>
              <ToolField label="Total marks (header)">
                <input
                  type="number"
                  className={toolInputClass}
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(Number(e.target.value) || 0)}
                />
              </ToolField>
              <ToolField label={`Questions: ${count}`}>
                <input
                  type="range"
                  min={5}
                  max={25}
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="mt-2 w-full"
                />
              </ToolField>
            </div>
            <ToolField label="Question types">
              <div className="flex flex-wrap gap-2">
                {QTYPE_LABELS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() =>
                      setTypes((prev) =>
                        prev.includes(t.id)
                          ? prev.filter((x) => x !== t.id)
                          : [...prev, t.id],
                      )
                    }
                    className={`rounded-full px-3 py-1.5 text-[12px] font-extrabold ${
                      types.includes(t.id) ? "bg-ink text-white" : "bg-cream text-muted"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </ToolField>
            <ToolField label="Instructions">
              <textarea
                className={toolInputClass}
                rows={2}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              />
            </ToolField>
            <p className="text-[11px] font-medium text-muted">
              Board field is a label only. Questions are practice samples — not
              official {board} papers.
            </p>
            <ToolActionRow busy={busy} error={error}>
              <ToolBtn onClick={generate}>Generate</ToolBtn>
              <ToolBtn
                variant="secondary"
                onClick={() => {
                  const next = seed + 1;
                  setSeed(next);
                  setError(null);
                  trackToolEvent("tool_started", { slug: "question-paper-generator" });
                  const qs = generatePracticeQuestions({
                    classLevel: klass,
                    subject,
                    topic,
                    difficulty,
                    count,
                    types,
                    seedExtra: `paper-${next}`,
                  });
                  setQuestions(qs);
                  try {
                    sessionStorage.setItem(
                      "mentr-answer-key-draft",
                      JSON.stringify({
                        klass,
                        subject,
                        board,
                        topic,
                        questions: qs,
                      }),
                    );
                  } catch {
                    /* ignore */
                  }
                  trackToolEvent("tool_generated", { slug: "question-paper-generator" });
                }}
              >
                Regenerate
              </ToolBtn>
              <ToolBtn variant="secondary" onClick={() => void download()} disabled={busy}>
                Download PDF
              </ToolBtn>
              <a
                href="/tools/answer-key-generator"
                className="inline-flex min-h-11 items-center rounded-xl border-2 border-ink bg-white px-4 text-[13px] font-extrabold text-ink"
                onClick={() =>
                  trackToolEvent("tool_cta_click", {
                    slug: "question-paper-generator",
                    cta: "answer-key",
                  })
                }
              >
                Generate answer key
              </a>
            </ToolActionRow>
          </>
        }
        preview={
          !questions ? (
            <p>Fill details and generate a printable sample question paper.</p>
          ) : (
            <div className="space-y-2">
              <p className="text-[15px] font-extrabold">QUESTION PAPER</p>
              <p className="text-[12px] text-muted">
                Class {klass} · {subject} · {board}
              </p>
              <p className="text-[12px]">
                Time: {duration} min · Max marks: {totalMarks} · Generated marks:{" "}
                {marksSum}
              </p>
              <ol className="mt-3 list-decimal space-y-2 pl-5">
                {questions.map((q) => (
                  <li key={q.id}>
                    ({q.marks}) {q.prompt}
                    {q.options?.map((o) => (
                      <div key={o} className="text-muted">
                        {o}
                      </div>
                    ))}
                  </li>
                ))}
              </ol>
            </div>
          )
        }
      />
    </div>
  );
}

export function ToolAnswerKeyGenerator() {
  useToolOpen("answer-key-generator");
  const [manual, setManual] = useState(
    "1. B\n2. 24\n3. Photosynthesis\n4. True\n5. See marking notes",
  );
  const [title, setTitle] = useState("ANSWER KEY");
  const [fromPaper, setFromPaper] = useState<GeneratedQuestion[] | null>(null);
  const [meta, setMeta] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("mentr-answer-key-draft");
      if (!raw) return;
      const data = JSON.parse(raw) as {
        klass?: string;
        subject?: string;
        board?: string;
        topic?: string;
        questions?: GeneratedQuestion[];
      };
      if (data.questions?.length) {
        setFromPaper(data.questions);
        setMeta(
          `Class ${data.klass ?? ""} · ${data.subject ?? ""} · ${data.board ?? ""} · ${data.topic ?? ""}`,
        );
        setManual(
          data.questions
            .map((q, i) => `${i + 1}. ${q.answer}`)
            .join("\n"),
        );
      }
    } catch {
      /* ignore */
    }
  }, []);

  async function download() {
    setBusy(true);
    setError(null);
    try {
      trackToolEvent("tool_started", { slug: "answer-key-generator" });
      let lines: PdfLine[];
      if (fromPaper?.length) {
        lines = questionsToPdfLines(
          title,
          [meta, "Sample practice key — verify against your textbook."],
          fromPaper,
          "key",
        );
      } else {
        const rows = manual
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean);
        if (!rows.length) {
          setError("Enter at least one answer line.");
          return;
        }
        lines = [
          { type: "h1", text: title },
          { type: "meta", text: meta || "Mentr Tools · answer key" },
          { type: "hr" },
          ...rows.map((r) => ({ type: "p" as const, text: r })),
        ];
      }
      const bytes = await createTextPdf(lines);
      downloadBlob(
        new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" }),
        slugFilename(["answer-key"]),
      );
      trackToolEvent("tool_downloaded", { slug: "answer-key-generator" });
      trackToolEvent("tool_complete", { slug: "answer-key-generator" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "PDF failed");
      trackToolEvent("tool_error", { slug: "answer-key-generator", detail: "pdf" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <ToolWorkspace
        form={
          <>
            <ToolField label="Title">
              <input className={toolInputClass} value={title} onChange={(e) => setTitle(e.target.value)} />
            </ToolField>
            <ToolField label="Header line (optional)">
              <input className={toolInputClass} value={meta} onChange={(e) => setMeta(e.target.value)} />
            </ToolField>
            {fromPaper ? (
              <p className="rounded-xl bg-sage-wash px-3 py-2 text-[12px] font-semibold text-sage">
                Loaded {fromPaper.length} answers from your last Mentr question
                paper. You can still edit the text below.
              </p>
            ) : (
              <p className="text-[12px] font-medium text-muted">
                Tip: generate a paper first, then open this tool — answers load
                automatically when available.
              </p>
            )}
            <ToolField label="Answers (one per line)" hint="Include marks or notes after the answer if needed.">
              <textarea
                className={toolInputClass}
                rows={10}
                value={manual}
                onChange={(e) => {
                  setManual(e.target.value);
                  setFromPaper(null);
                }}
              />
            </ToolField>
            <ToolActionRow busy={busy} error={error}>
              <ToolBtn onClick={() => void download()} disabled={busy}>
                Download PDF
              </ToolBtn>
              <a
                href="/tools/question-paper-generator"
                className="inline-flex min-h-11 items-center text-[13px] font-extrabold text-coral hover:underline"
              >
                Open question paper →
              </a>
            </ToolActionRow>
          </>
        }
        preview={
          <div className="space-y-2 whitespace-pre-wrap font-mono text-[12px]">
            <p className="font-sans text-[15px] font-extrabold">{title}</p>
            {meta ? <p className="font-sans text-[12px] text-muted">{meta}</p> : null}
            {manual}
          </div>
        }
      />
    </div>
  );
}

export function ToolCgpaCalculator() {
  useToolOpen("cgpa-calculator");
  const [cgpa, setCgpa] = useState("8.2");
  const [method, setMethod] = useState<"cbse9.5" | "gtu10" | "custom">("cbse9.5");
  const [customMult, setCustomMult] = useState("9.5");

  const result = useMemo(() => {
    const n = Number(cgpa);
    if (!Number.isFinite(n) || n < 0 || n > 10) {
      return { ok: false as const, msg: "Enter a CGPA between 0 and 10." };
    }
    const mult =
      method === "cbse9.5"
        ? 9.5
        : method === "gtu10"
          ? 10
          : Number(customMult);
    if (!Number.isFinite(mult) || mult <= 0) {
      return { ok: false as const, msg: "Enter a valid custom multiplier." };
    }
    const pct = n * mult;
    return {
      ok: true as const,
      pct: Math.round(pct * 100) / 100,
      mult,
      label:
        method === "cbse9.5"
          ? "Approximate CBSE-style (× 9.5) — confirm with your school"
          : method === "gtu10"
            ? "Simple × 10 scale — confirm with your university"
            : `Custom × ${mult} — confirm with your institution`,
    };
  }, [cgpa, method, customMult]);

  useEffect(() => {
    if (result.ok) {
      trackToolEvent("tool_generated", { slug: "cgpa-calculator" });
    }
  }, [result]);

  return (
    <div>
      <ToolWorkspace
        form={
          <>
            <ToolField label="CGPA">
              <input
                className={toolInputClass}
                inputMode="decimal"
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
              />
            </ToolField>
            <ToolField label="Conversion method">
              <select
                className={toolInputClass}
                value={method}
                onChange={(e) => setMethod(e.target.value as typeof method)}
              >
                <option value="cbse9.5">Approx. × 9.5 (often cited for CBSE)</option>
                <option value="gtu10">× 10 (some universities)</option>
                <option value="custom">Custom multiplier</option>
              </select>
            </ToolField>
            {method === "custom" ? (
              <ToolField label="Custom multiplier">
                <input
                  className={toolInputClass}
                  inputMode="decimal"
                  value={customMult}
                  onChange={(e) => setCustomMult(e.target.value)}
                />
              </ToolField>
            ) : null}
            <p className="rounded-xl border border-butter/40 bg-[#fff8e8] px-3 py-2 text-[12px] font-medium text-muted">
              CGPA conversion depends on your institution&apos;s rules. This
              calculator is informational only — always verify with your school
              or university.
            </p>
          </>
        }
        preview={
          !result.ok ? (
            <p className="text-coral">{result.msg}</p>
          ) : (
            <div className="space-y-2">
              <p className="text-[12px] font-bold uppercase text-muted">Approximate %</p>
              <p className="text-[2.5rem] font-extrabold tabular-nums text-ink">
                {result.pct}%
              </p>
              <p className="text-[13px] text-muted">
                CGPA {cgpa} × {result.mult} = {result.pct}%
              </p>
              <p className="text-[12px] font-medium text-muted">{result.label}</p>
            </div>
          )
        }
      />
    </div>
  );
}

export function ToolLessonPlanGenerator() {
  useToolOpen("lesson-plan-generator");
  const [klass, setKlass] = useState("7");
  const [subject, setSubject] = useState("Science");
  const [topic, setTopic] = useState("Photosynthesis");
  const [duration, setDuration] = useState("40 minutes");
  const [objectives, setObjectives] = useState(
    "Students will explain the process of photosynthesis and identify inputs and outputs.",
  );
  const [difficulty, setDifficulty] = useState("Medium");
  const [method, setMethod] = useState("Discussion + diagram");
  const [homework, setHomework] = useState(
    "Draw and label a leaf cross-section; 5 short questions from textbook.",
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const preview = useMemo(
    () => ({
      objectives,
      materials: "Textbook, blackboard/whiteboard, diagram handout",
      intro: `Hook with a question: Why do plants need sunlight? Link to ${topic}.`,
      teaching: `Explain ${topic} using ${method}. Cover key terms for Class ${klass} ${subject}.`,
      guided: "Work through one example together; check for misconceptions.",
      independent: "Students complete a short practice set or diagram labeling.",
      assessment: "Exit ticket: 2 questions on today’s learning objectives.",
      homework,
    }),
    [objectives, topic, method, klass, subject, homework],
  );

  async function download() {
    if (!topic.trim() || !objectives.trim()) {
      setError("Enter topic and learning objectives.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      trackToolEvent("tool_started", { slug: "lesson-plan-generator" });
      const lines: PdfLine[] = [
        { type: "h1", text: "LESSON PLAN" },
        { type: "meta", text: `Class ${klass} · ${subject} · ${topic}` },
        { type: "meta", text: `Duration: ${duration} · Difficulty: ${difficulty}` },
        { type: "meta", text: `Method: ${method}` },
        { type: "hr" },
        { type: "h2", text: "Learning Objectives" },
        { type: "p", text: preview.objectives },
        { type: "h2", text: "Materials Required" },
        { type: "p", text: preview.materials },
        { type: "h2", text: "Introduction" },
        { type: "p", text: preview.intro },
        { type: "h2", text: "Teaching Activity" },
        { type: "p", text: preview.teaching },
        { type: "h2", text: "Guided Practice" },
        { type: "p", text: preview.guided },
        { type: "h2", text: "Independent Practice" },
        { type: "p", text: preview.independent },
        { type: "h2", text: "Assessment" },
        { type: "p", text: preview.assessment },
        { type: "h2", text: "Homework" },
        { type: "p", text: preview.homework || "None" },
      ];
      const bytes = await createTextPdf(lines);
      downloadBlob(
        new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" }),
        slugFilename(["lesson-plan", `class-${klass}`, subject, topic]),
      );
      setReady(true);
      trackToolEvent("tool_downloaded", { slug: "lesson-plan-generator" });
      trackToolEvent("tool_complete", { slug: "lesson-plan-generator" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "PDF failed");
      trackToolEvent("tool_error", { slug: "lesson-plan-generator", detail: "pdf" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <ToolWorkspace
        form={
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <ToolField label="Class">
                <input className={toolInputClass} value={klass} onChange={(e) => setKlass(e.target.value)} />
              </ToolField>
              <ToolField label="Subject">
                <input className={toolInputClass} value={subject} onChange={(e) => setSubject(e.target.value)} />
              </ToolField>
              <ToolField label="Topic">
                <input className={toolInputClass} value={topic} onChange={(e) => setTopic(e.target.value)} />
              </ToolField>
              <ToolField label="Duration">
                <input className={toolInputClass} value={duration} onChange={(e) => setDuration(e.target.value)} />
              </ToolField>
              <ToolField label="Difficulty">
                <select className={toolInputClass} value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                  {["Easy", "Medium", "Hard"].map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </ToolField>
              <ToolField label="Teaching method">
                <input className={toolInputClass} value={method} onChange={(e) => setMethod(e.target.value)} />
              </ToolField>
            </div>
            <ToolField label="Learning objectives">
              <textarea className={toolInputClass} rows={3} value={objectives} onChange={(e) => setObjectives(e.target.value)} />
            </ToolField>
            <ToolField label="Homework (optional)">
              <textarea className={toolInputClass} rows={2} value={homework} onChange={(e) => setHomework(e.target.value)} />
            </ToolField>
            <ToolActionRow busy={busy} error={error}>
              <ToolBtn
                onClick={() => {
                  setReady(true);
                  trackToolEvent("tool_generated", { slug: "lesson-plan-generator" });
                }}
              >
                Generate preview
              </ToolBtn>
              <ToolBtn variant="secondary" onClick={() => void download()} disabled={busy}>
                Download PDF
              </ToolBtn>
              <ToolBtn
                variant="ghost"
                onClick={() => {
                  setReady(false);
                  trackToolEvent("tool_reset", { slug: "lesson-plan-generator" });
                }}
              >
                Reset
              </ToolBtn>
            </ToolActionRow>
          </>
        }
        preview={
          !ready ? (
            <p>Fill the form and generate a structured lesson plan preview.</p>
          ) : (
            <div className="space-y-3">
              <p className="text-[15px] font-extrabold">LESSON PLAN</p>
              <p className="text-[12px] text-muted">
                Class {klass} · {subject} · {topic} · {duration}
              </p>
              {(
                [
                  ["Learning Objectives", preview.objectives],
                  ["Materials Required", preview.materials],
                  ["Introduction", preview.intro],
                  ["Teaching Activity", preview.teaching],
                  ["Guided Practice", preview.guided],
                  ["Independent Practice", preview.independent],
                  ["Assessment", preview.assessment],
                  ["Homework", preview.homework],
                ] as const
              ).map(([h, body]) => (
                <div key={h}>
                  <p className="text-[12px] font-extrabold text-ink">{h}</p>
                  <p className="text-[13px] text-muted">{body}</p>
                </div>
              ))}
            </div>
          )
        }
      />
    </div>
  );
}
