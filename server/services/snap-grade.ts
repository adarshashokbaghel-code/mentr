import { randomUUID } from "crypto";
import { decodeMentorImagePayload } from "./mentor-profile-image";
import {
  ensureMentorProfileBucket,
  getSupabaseAdmin,
  publicObjectUrl,
} from "../lib/supabase";
import { MENTOR_PROFILE_BUCKET } from "../lib/supabase-secrets";
import { config } from "../config";
import type {
  ISnapGradeQuestion,
  RubricStep,
  StepAward,
} from "../models/SnapGrade";
import {
  SnapGradeEvaluation,
  SnapGradeWallet,
} from "../models/SnapGrade";
import type { Types } from "mongoose";

export const FREE_CREDITS = 100;

/** OpenAI list prices USD / 1M tokens (approx Mar 2026) */
const PRICE: Record<string, { in: number; out: number }> = {
  "gpt-4o": { in: 2.5, out: 10 },
  "gpt-4o-mini": { in: 0.15, out: 0.6 },
  "gpt-4.1-mini": { in: 0.4, out: 1.6 },
  "gpt-4.1-nano": { in: 0.1, out: 0.4 },
};

export type TokenUsage = {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  model: string;
  estUsd: number;
};

export type PipelineCost = {
  path: "local_ocr" | "local_ocr+mini_vision" | "mini_vision";
  localOcrMs: number;
  localOcrConfidence: number;
  imageBytesIn: number;
  imageBytesOut: number;
  openaiCalls: TokenUsage[];
  estUsd: number;
  estInr: number;
};

function priceFor(model: string): { in: number; out: number } {
  if (PRICE[model]) return PRICE[model]!;
  if (model.includes("mini")) return PRICE["gpt-4o-mini"]!;
  if (model.includes("nano")) return PRICE["gpt-4.1-nano"]!;
  return PRICE["gpt-4o"]!;
}

function estimateUsd(model: string, prompt: number, completion: number): number {
  const p = priceFor(model);
  return (prompt * p.in + completion * p.out) / 1_000_000;
}

function sumCost(usages: TokenUsage[]): number {
  return usages.reduce((a, u) => a + u.estUsd, 0);
}

const HISTORY_CAP = 100;
const LEDGER_CAP = 200;

function isDuplicateKey(err: unknown): boolean {
  return Boolean(
    err &&
      typeof err === "object" &&
      "code" in err &&
      (err as { code?: number }).code === 11000,
  );
}

export async function getOrCreateWallet(userId: string) {
  let wallet = await SnapGradeWallet.findOne({ user: userId });
  if (!wallet) {
    try {
      wallet = await SnapGradeWallet.create({
        user: userId,
        creditBalance: FREE_CREDITS,
        freeCreditsClaimed: true,
        freeCreditsGranted: FREE_CREDITS,
        totalRecharged: 0,
        totalSpent: 0,
        recharges: [],
        history: [],
        ledger: [
          {
            type: "free_grant",
            credits: FREE_CREDITS,
            balanceAfter: FREE_CREDITS,
            note: "Welcome credits (once)",
            at: new Date(),
          },
        ],
      });
    } catch (err) {
      if (!isDuplicateKey(err)) throw err;
      wallet = await SnapGradeWallet.findOne({ user: userId });
      if (!wallet) throw err;
    }
  }
  if (!wallet.freeCreditsClaimed) {
    const granted = await SnapGradeWallet.findOneAndUpdate(
      { _id: wallet._id, freeCreditsClaimed: false },
      {
        $set: {
          freeCreditsClaimed: true,
          freeCreditsGranted: FREE_CREDITS,
        },
        $inc: { creditBalance: FREE_CREDITS },
        $push: {
          ledger: {
            $each: [
              {
                type: "free_grant" as const,
                credits: FREE_CREDITS,
                balanceAfter: wallet.creditBalance + FREE_CREDITS,
                note: "Welcome credits (once)",
                at: new Date(),
              },
            ],
            $slice: -LEDGER_CAP,
          },
        },
      },
      { new: true },
    );
    if (granted) wallet = granted;
    else {
      const fresh = await SnapGradeWallet.findById(wallet._id);
      if (fresh) wallet = fresh;
    }
  }
  return wallet;
}

export async function uploadSnapGradeImage(
  userId: string,
  payload: { imageBase64: string; mimeType?: string },
): Promise<{ imageUrl: string; imagePath: string } | { error: string }> {
  const decoded = decodeMentorImagePayload(payload);
  if ("error" in decoded) return decoded;

  // Always store a resized JPEG — smaller + matches OCR input
  const { prepareSnapGradeImage } = await import("./snap-grade-image");
  const prepared = await prepareSnapGradeImage(decoded.buffer);
  if ("error" in prepared) return prepared;

  await ensureMentorProfileBucket();
  const path = `snap-grade/${userId}/${randomUUID()}.jpg`;
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.storage
    .from(MENTOR_PROFILE_BUCKET)
    .upload(path, prepared.buffer, {
      contentType: "image/jpeg",
      upsert: false,
    });
  if (error) {
    console.error("snap-grade upload error:", error.message);
    return { error: "Failed to upload solution photo" };
  }
  return { imageUrl: publicObjectUrl(path), imagePath: path };
}

type Relevance =
  | "matches_question"
  | "partial_question"
  | "wrong_question"
  | "blank"
  | "unreadable";

export type SnapGradeRelevance = Relevance;

type GradeModelResult = {
  steps: StepAward[];
  marksAwarded: number;
  overallFeedback: string;
  transcript: string;
  originalTranscript: string;
  transcriptEdited: boolean;
  relevance: Relevance;
  raw: string;
  model: string;
  markUsage?: TokenUsage;
};

export type TranscriptResult = {
  transcript: string;
  relevance: Relevance;
  notes: string;
  imageReadable: boolean;
  model: string;
  raw: string;
  /** Resized JPEG data URL — reuse for upload / retries */
  preparedDataUrl?: string;
  cost?: PipelineCost;
};

type TranscriptJson = {
  imageReadable?: boolean;
  relevance?: string;
  transcript?: string;
  notes?: string;
};

type MarkJson = {
  steps?: Array<{
    stepId?: string;
    label?: string;
    marksPossible?: number;
    marksAwarded?: number;
    evidenceQuote?: string;
    criteriaMet?: boolean | "partial" | "no" | "yes";
    comment?: string;
  }>;
  marksAwarded?: number;
  overallFeedback?: string;
};

function clampMarks(n: number, max: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(max, Math.round(n * 2) / 2));
}

function parseRelevance(raw: string | undefined): Relevance {
  const v = String(raw || "")
    .trim()
    .toLowerCase();
  if (v === "matches_question" || v === "match") return "matches_question";
  if (v === "partial_question" || v === "partial") return "partial_question";
  if (v === "wrong_question" || v === "wrong") return "wrong_question";
  if (v === "blank" || v === "empty") return "blank";
  if (v === "unreadable" || v === "illegible") return "unreadable";
  return "unreadable";
}

function normalizeForMatch(s: string): string {
  return s
    .toLowerCase()
    .replace(/[“”"']/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Quote must appear in transcript (allow short fuzzy whitespace diffs). */
function evidenceInTranscript(evidence: string, transcript: string): boolean {
  const e = normalizeForMatch(evidence);
  const t = normalizeForMatch(transcript);
  if (!e || e.length < 2) return false;
  if (t.includes(e)) return true;
  // Allow quote fragments ≥ 8 chars that appear as contiguous tokens
  const compactE = e.replace(/[^a-z0-9−-]/g, "");
  const compactT = t.replace(/[^a-z0-9−-]/g, "");
  return compactE.length >= 6 && compactT.includes(compactE);
}

/** T/F + reason / counterexample style — full marks or zero only. */
function isAllOrNothingStep(criteria: string): boolean {
  return /counter\s*example|T\/F|true\/false|true or false|reason|justify|justification|with (a )?valid|all[\s-]or[\s-]nothing|must (also )?include|both /i.test(
    criteria,
  );
}

function requiresEvidenceBeyondTf(criteria: string): boolean {
  return /counter\s*example|reason|justify|justification|with (a )?valid|show that|prove|working|method|formula/i.test(
    criteria,
  );
}

function zeroSteps(question: ISnapGradeQuestion, reason: string): StepAward[] {
  return question.rubric.map((r) => ({
    stepId: r.id,
    label: r.label,
    marksPossible: r.marks,
    marksAwarded: 0,
    comment: reason,
  }));
}

function snapGradeMarkModel(): string {
  return config.openaiSnapGradeModel || "gpt-4o-mini";
}

function snapGradeOcrModel(): string {
  return config.openaiSnapGradeOcrModel || "gpt-4o-mini";
}

async function openaiJson(
  messages: Array<{
    role: "system" | "user" | "assistant";
    content: string | Array<Record<string, unknown>>;
  }>,
  opts?: { temperature?: number; model?: string },
): Promise<
  | { raw: string; model: string; usage: TokenUsage }
  | { error: string }
> {
  const key = config.openaiApiKey;
  if (!key) {
    return { error: "OPENAI_API_KEY is not configured on the server" };
  }
  const model = opts?.model || snapGradeMarkModel();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 70_000);

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: opts?.temperature ?? 0,
        response_format: { type: "json_object" },
        messages,
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error(
        "[snap-grade] OpenAI error",
        res.status,
        errText.slice(0, 400),
      );
      return { error: "Grading model failed. Try again in a moment." };
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
      usage?: {
        prompt_tokens?: number;
        completion_tokens?: number;
        total_tokens?: number;
      };
    };
    const raw = data.choices?.[0]?.message?.content || "";
    const promptTokens = Number(data.usage?.prompt_tokens) || 0;
    const completionTokens = Number(data.usage?.completion_tokens) || 0;
    const totalTokens =
      Number(data.usage?.total_tokens) || promptTokens + completionTokens;
    const usage: TokenUsage = {
      promptTokens,
      completionTokens,
      totalTokens,
      model,
      estUsd: estimateUsd(model, promptTokens, completionTokens),
    };
    return { raw, model, usage };
  } catch (err) {
    console.error("[snap-grade] openai call error:", err);
    return { error: "Could not grade this photo. Try a clearer image." };
  } finally {
    clearTimeout(timeout);
  }
}

function buildTranscriptPrompt(question: ISnapGradeQuestion): string {
  return `You are a handwriting OCR + exam triage assistant for CBSE Class ${question.classLevel} ${question.subject}.

TASK: Read the student's PHOTO only. Do NOT grade. Do NOT invent text.

Question they were asked (for relevance check only):
---
${question.questionText}
---
Chapter ${question.chapterNumber} · Ex ${question.exercise} · Q${question.questionNumber}

Rules:
1. Transcribe EVERY visible mark: T/F, words, numbers, equations, labelled diagrams briefly, crossed-out lines.
2. Unclear handwriting → write [illegible]. Never guess the intended answer.
3. relevance:
   - matches_question: clearly attempting THIS question
   - partial_question: only some parts of THIS question
   - wrong_question: different / unrelated work
   - blank: empty page / doodles / no answer work
   - unreadable: too blurry/dark/cropped to read

Return ONLY JSON:
{
  "imageReadable": true,
  "relevance": "matches_question",
  "transcript": "full line-by-line transcription…",
  "notes": "optional one line about photo quality"
}`;
}

function buildMarkFromTranscriptPrompt(
  question: ISnapGradeQuestion,
  transcript: string,
  relevance: Relevance,
): string {
  const rubric = question.rubric.map((s: RubricStep) => ({
    stepId: s.id,
    label: s.label,
    marks: s.marks,
    criteria: s.criteria,
  }));

  return `You are a STRICT CBSE Class ${question.classLevel} ${question.subject} board examiner.

You mark ONLY from the STUDENT TRANSCRIPT below. You have NO photo. Never invent working that is not in the transcript.

═══ STUDENT TRANSCRIPT (source of truth) ═══
${transcript}

═══ TRIAGE RELEVANCE (already decided) ═══
${relevance}

═══ FULL QUESTION ═══
Board: ${question.board}
Subject: ${question.subject}
Class: ${question.classLevel}
Chapter ${question.chapterNumber}: ${question.chapterName}
Exercise ${question.exercise} · Question ${question.questionNumber}
Max marks: ${question.maxMarks}

${question.questionText}

═══ EXAMINER KEY (do not leak verbatim as if student wrote it) ═══
${question.referenceNotes || "Use standard NCERT / CBSE answers."}

═══ MARKING NOTES ═══
${question.markingSchemeNotes}

═══ RUBRIC ═══
${JSON.stringify(rubric, null, 2)}

═══ STRICT RULES ═══
1. Award a step ONLY if the transcript clearly satisfies EVERY part of that step's criteria.
2. evidenceQuote MUST be an exact contiguous quote copied from the transcript. If you cannot quote it → marksAwarded = 0 for that step.
3. All-or-nothing: if criteria require True/False AND reason/counterexample, and transcript only has T/F (or only "false" without an example) → marksAwarded = 0 (NOT 0.5).
4. Wrong answer / wrong reasoning → 0 for that step.
5. Partial marks (0.5) ONLY for arithmetic slips when the correct method is fully present in the transcript. NEVER for incomplete reasons or missing counterexamples.
6. No marks for neatness, effort, or restating the question.
7. marksAwarded total must equal the sum of step marksAwarded.

Return ONLY JSON:
{
  "steps": [
    {
      "stepId": "s1",
      "label": "…",
      "marksPossible": 1,
      "marksAwarded": 0,
      "criteriaMet": "no",
      "evidenceQuote": "exact quote from transcript or empty",
      "comment": "one short factual examiner line"
    }
  ],
  "marksAwarded": 0,
  "overallFeedback": "2–3 factual sentences. No fluff."
}`;
}

function enforceStrictSteps(
  question: ISnapGradeQuestion,
  parsed: MarkJson,
  relevance: Relevance,
  transcript: string,
): { steps: StepAward[]; marksAwarded: number } {
  if (
    relevance === "blank" ||
    relevance === "unreadable" ||
    relevance === "wrong_question" ||
    !transcript ||
    transcript.length < 3
  ) {
    const reason =
      relevance === "wrong_question"
        ? "Photo does not answer this NCERT question — 0 marks."
        : relevance === "blank"
          ? "No usable solution visible — 0 marks."
          : "Photo unreadable or empty transcript — 0 marks.";
    return {
      steps: zeroSteps(question, reason),
      marksAwarded: 0,
    };
  }

  const byId = new Map(
    (Array.isArray(parsed.steps) ? parsed.steps : []).map((s) => [
      String(s.stepId || ""),
      s,
    ]),
  );

  const steps: StepAward[] = question.rubric.map((r) => {
    const hit = byId.get(r.id);
    let awarded = clampMarks(Number(hit?.marksAwarded ?? 0), r.marks);
    const evidence = String(hit?.evidenceQuote || "").trim();
    const met = hit?.criteriaMet;
    const comment = String(hit?.comment || "").trim();
    const allOrNothing = isAllOrNothingStep(r.criteria);

    // No usable evidence quote, or quote not in transcript → zero
    if (
      !evidence ||
      evidence.length < 2 ||
      !evidenceInTranscript(evidence, transcript)
    ) {
      awarded = 0;
    }

    // Model says criteria not met → zero
    if (met === false || met === "no") {
      awarded = 0;
    }

    // Soft language admitting gaps while awarding → zero
    if (
      awarded > 0 &&
      requiresEvidenceBeyondTf(r.criteria) &&
      /lack|missing|without|no (clear )?counter|did not provide|didn't provide|incomplete|only (said|wrote|stated)|no (valid )?reason/i.test(
        comment,
      )
    ) {
      awarded = 0;
    }

    // T/F + reason style: NEVER partial — full marks or 0
    if (allOrNothing && awarded > 0 && awarded < r.marks) {
      awarded = 0;
    }

    // criteriaMet "partial" on all-or-nothing → 0
    if (allOrNothing && met === "partial") {
      awarded = 0;
    }

    return {
      stepId: r.id,
      label: r.label,
      marksPossible: r.marks,
      marksAwarded: awarded,
      comment:
        (comment ||
          (awarded === 0
            ? "Criteria not fully met from visible work."
            : "Awarded from visible evidence.")) +
        (evidence && awarded > 0
          ? ` Evidence: “${evidence.slice(0, 160)}”`
          : evidence
            ? ` (no credit — quote: “${evidence.slice(0, 100)}”)`
            : ""),
    };
  });

  const marksAwarded = clampMarks(
    steps.reduce((a, s) => a + s.marksAwarded, 0),
    question.maxMarks,
  );

  return { steps, marksAwarded };
}

export async function transcribeSolutionPhoto(
  question: ISnapGradeQuestion,
  imageDataUrl: string,
): Promise<TranscriptResult | { error: string }> {
  const decoded = decodeMentorImagePayload({ imageBase64: imageDataUrl });
  if ("error" in decoded) return decoded;

  const { prepareSnapGradeImage, runLocalOcr } = await import(
    "./snap-grade-image"
  );
  const prepared = await prepareSnapGradeImage(decoded.buffer);
  if ("error" in prepared) return prepared;

  const openaiCalls: TokenUsage[] = [];
  const local = await runLocalOcr(prepared.buffer);

  let transcript = local.text;
  let relevance: Relevance = "unreadable";
  let notes = "";
  let imageReadable = true;
  let model = "tesseract.js";
  let raw = JSON.stringify({
    path: "local_ocr",
    confidence: local.meanConfidence,
    ms: local.durationMs,
  });
  let path: PipelineCost["path"] = "local_ocr";

  if (local.usable) {
    // Cheap text-only relevance (no image tokens)
    const rel = await openaiJson(
      [
        {
          role: "system",
          content:
            "You triage whether a student OCR transcript answers a given CBSE question. Reply JSON only.",
        },
        {
          role: "user",
          content: `Question:\n${question.questionText.slice(0, 1200)}\n\nStudent transcript (OCR):\n${transcript.slice(0, 2500)}\n\nReturn JSON: {"relevance":"matches_question|partial_question|wrong_question|blank|unreadable","notes":"one short line"}`,
        },
      ],
      { temperature: 0, model: snapGradeOcrModel() },
    );
    if ("error" in rel) {
      // Still return OCR text — student can confirm; default relevance
      relevance = transcript.length > 40 ? "matches_question" : "partial_question";
      notes = `Local OCR (${Math.round(local.meanConfidence)}% conf). Relevance check skipped.`;
    } else {
      openaiCalls.push(rel.usage);
      try {
        const parsed = JSON.parse(rel.raw) as {
          relevance?: string;
          notes?: string;
        };
        relevance = parseRelevance(parsed.relevance);
        notes = String(parsed.notes || "").trim();
      } catch {
        relevance = "partial_question";
      }
      model = `tesseract+${rel.model}`;
      raw = JSON.stringify({
        path: "local_ocr",
        confidence: local.meanConfidence,
        ms: local.durationMs,
        relevanceRaw: rel.raw,
      });
    }
  } else {
    // Escalate: mini vision on resized JPEG, detail low
    path = local.text ? "local_ocr+mini_vision" : "mini_vision";
    const phase1 = await openaiJson(
      [
        {
          role: "system",
          content:
            "You transcribe student notebook photos for CBSE exams. Never invent text. Reply with JSON only.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text:
                buildTranscriptPrompt(question) +
                (local.text
                  ? `\n\nLocal OCR draft (may be wrong — prefer what you see in the photo):\n${local.text.slice(0, 1500)}`
                  : ""),
            },
            {
              type: "image_url",
              image_url: { url: prepared.dataUrl, detail: "low" },
            },
          ],
        },
      ],
      { temperature: 0, model: snapGradeOcrModel() },
    );
    if ("error" in phase1) return phase1;
    openaiCalls.push(phase1.usage);

    let triage: TranscriptJson;
    try {
      triage = JSON.parse(phase1.raw) as TranscriptJson;
    } catch {
      return { error: "Could not read the photo. Try a clearer image." };
    }

    relevance = parseRelevance(triage.relevance);
    transcript = String(triage.transcript || "").trim() || local.text;
    imageReadable = triage.imageReadable !== false;
    if (!imageReadable) relevance = "unreadable";
    notes = [
      String(triage.notes || "").trim(),
      `Local OCR weak (conf ${Math.round(local.meanConfidence)}%) → cloud vision.`,
    ]
      .filter(Boolean)
      .join(" ");
    model = phase1.model;
    raw = phase1.raw;
  }

  if (!transcript || transcript.length < 3) {
    imageReadable = false;
    relevance = "unreadable";
  }

  const cost: PipelineCost = {
    path,
    localOcrMs: local.durationMs,
    localOcrConfidence: local.meanConfidence,
    imageBytesIn: prepared.bytesIn,
    imageBytesOut: prepared.bytesOut,
    openaiCalls,
    estUsd: sumCost(openaiCalls),
    estInr: Math.round(sumCost(openaiCalls) * 83 * 100) / 100,
  };

  return {
    transcript: transcript.slice(0, 4000),
    relevance,
    notes: notes.slice(0, 400),
    imageReadable,
    model,
    raw,
    preparedDataUrl: prepared.dataUrl,
    cost,
  };
}

async function markFromConfirmedTranscript(
  question: ISnapGradeQuestion,
  transcript: string,
  relevance: Relevance,
  meta?: { originalTranscript?: string; triageRaw?: string },
): Promise<GradeModelResult | { error: string }> {
  const clean = transcript.trim();
  const original = (meta?.originalTranscript || clean).trim();
  const transcriptEdited =
    normalizeForMatch(original) !== normalizeForMatch(clean);

  if (
    relevance === "blank" ||
    relevance === "unreadable" ||
    relevance === "wrong_question" ||
    clean.length < 3
  ) {
    const reason =
      relevance === "wrong_question"
        ? "Photo does not answer this NCERT question — 0 marks."
        : relevance === "blank"
          ? "No usable solution visible — 0 marks."
          : "Photo unreadable or empty — 0 marks.";
    return {
      steps: zeroSteps(question, reason),
      marksAwarded: 0,
      overallFeedback: reason,
      transcript: clean || "(none)",
      originalTranscript: original || "(none)",
      transcriptEdited,
      relevance,
      raw: JSON.stringify({
        phase: "mark-skipped",
        triageRaw: meta?.triageRaw || null,
        mark: null,
      }),
      model: snapGradeMarkModel(),
    };
  }

  const phase2 = await openaiJson(
    [
      {
        role: "system",
        content:
          "You are a strict CBSE board examiner. Mark only from the provided transcript against the rubric. Never invent work. Reply with JSON only.",
      },
      {
        role: "user",
        content: buildMarkFromTranscriptPrompt(question, clean, relevance),
      },
    ],
    { temperature: 0, model: snapGradeMarkModel() },
  );
  if ("error" in phase2) return phase2;

  let marked: MarkJson;
  try {
    marked = JSON.parse(phase2.raw) as MarkJson;
  } catch {
    return { error: "Grader returned invalid JSON. Try again." };
  }

  const enforced = enforceStrictSteps(question, marked, relevance, clean);
  const feedback =
    String(marked.overallFeedback || "").trim() ||
    (enforced.marksAwarded === 0
      ? "No marks awarded — solution missing, wrong, or incomplete against the CBSE rubric."
      : "Marked strictly from visible work against the CBSE step rubric.");

  return {
    steps: enforced.steps,
    marksAwarded: enforced.marksAwarded,
    overallFeedback: feedback.slice(0, 1200),
    transcript: clean.slice(0, 4000),
    originalTranscript: original.slice(0, 4000),
    transcriptEdited,
    relevance,
    raw: JSON.stringify({
      phase: "mark",
      triageRaw: meta?.triageRaw || null,
      mark: marked,
      transcriptEdited,
      markUsage: phase2.usage,
    }),
    model: phase2.model,
    markUsage: phase2.usage,
  };
}

export async function gradeSolutionWithOpenAi(
  question: ISnapGradeQuestion,
  imageDataUrl: string,
  opts?: {
    confirmedTranscript?: string;
    originalTranscript?: string;
    relevance?: Relevance;
  },
): Promise<GradeModelResult | { error: string }> {
  // Paid confirm path: user already reviewed/edited the digital text
  if (opts?.confirmedTranscript?.trim()) {
    const relevance = opts.relevance || "matches_question";
    return markFromConfirmedTranscript(
      question,
      opts.confirmedTranscript,
      relevance,
      {
        originalTranscript: opts.originalTranscript,
      },
    );
  }

  const triage = await transcribeSolutionPhoto(question, imageDataUrl);
  if ("error" in triage) return triage;

  return markFromConfirmedTranscript(
    question,
    triage.transcript,
    triage.relevance,
    {
      originalTranscript: triage.transcript,
      triageRaw: triage.raw,
    },
  );
}

export async function runSnapGradeEvaluation(opts: {
  userId: string;
  question: ISnapGradeQuestion;
  imageBase64: string;
  mimeType?: string;
  /** User-confirmed (possibly edited) digital extraction */
  confirmedTranscript?: string;
  originalTranscript?: string;
  relevance?: Relevance;
}) {
  await getOrCreateWallet(opts.userId);
  const cost = opts.question.creditsCost || 5;

  if (!opts.confirmedTranscript?.trim()) {
    return {
      error:
        "Confirm the digital text we read from your photo before grading. Credits are only charged after you confirm.",
      code: "TRANSCRIPT_REQUIRED" as const,
    };
  }

  const reserved = await SnapGradeWallet.findOneAndUpdate(
    { user: opts.userId, creditBalance: { $gte: cost } },
    { $inc: { creditBalance: -cost, totalSpent: cost } },
    { new: true },
  );
  if (!reserved) {
    const latest = await SnapGradeWallet.findOne({ user: opts.userId });
    return {
      error: `Not enough credits (need ${cost}, have ${latest?.creditBalance ?? 0})`,
      code: "INSUFFICIENT_CREDITS" as const,
      creditBalance: latest?.creditBalance ?? 0,
    };
  }

  const refundCredits = async () => {
    await SnapGradeWallet.findOneAndUpdate(
      { user: opts.userId },
      { $inc: { creditBalance: cost, totalSpent: -cost } },
    );
  };

  const uploaded = await uploadSnapGradeImage(opts.userId, {
    imageBase64: opts.imageBase64,
    mimeType: opts.mimeType,
  });
  if ("error" in uploaded) {
    await refundCredits();
    return { error: uploaded.error };
  }

  const dataUrl = opts.imageBase64.startsWith("data:")
    ? opts.imageBase64
    : `data:${opts.mimeType || "image/jpeg"};base64,${opts.imageBase64}`;

  const graded = await gradeSolutionWithOpenAi(opts.question, dataUrl, {
    confirmedTranscript: opts.confirmedTranscript,
    originalTranscript: opts.originalTranscript,
    relevance: opts.relevance,
  });
  if ("error" in graded) {
    await refundCredits();
    return { error: graded.error };
  }

  let evaluation;
  try {
    evaluation = await SnapGradeEvaluation.create({
      user: opts.userId as unknown as Types.ObjectId,
      question: opts.question._id,
      imageUrl: uploaded.imageUrl,
      imagePath: uploaded.imagePath,
      marksAwarded: graded.marksAwarded,
      maxMarks: opts.question.maxMarks,
      creditsDeducted: cost,
      steps: graded.steps,
      overallFeedback: graded.overallFeedback,
      transcript: graded.transcript,
      originalTranscript: graded.originalTranscript,
      transcriptEdited: graded.transcriptEdited,
      relevance: graded.relevance,
      aiModel: graded.model,
      rawModelJson: graded.raw,
    });
  } catch (err) {
    await refundCredits();
    throw err;
  }

  const q = opts.question;
  const updated = await SnapGradeWallet.findOneAndUpdate(
    { user: opts.userId },
    {
      $push: {
        history: {
          $each: [
            {
              evaluationId: evaluation._id.toString(),
              gradedAt: evaluation.createdAt || new Date(),
              board: q.board,
              classLevel: q.classLevel,
              subject: q.subject,
              chapterNumber: q.chapterNumber,
              chapterName: q.chapterName,
              exercise: q.exercise,
              questionNumber: q.questionNumber,
              questionText: q.questionText,
              marksAwarded: graded.marksAwarded,
              maxMarks: q.maxMarks,
              creditsDeducted: cost,
              overallFeedback: graded.overallFeedback || "",
              transcript: graded.transcript || "",
              relevance: graded.relevance || "",
              steps: graded.steps || [],
            },
          ],
          $position: 0,
          $slice: HISTORY_CAP,
        },
        ledger: {
          $each: [
            {
              type: "spend" as const,
              credits: -cost,
              balanceAfter: reserved.creditBalance,
              note: `Grade Q${q.questionNumber}`,
              refId: evaluation._id.toString(),
              at: new Date(),
            },
          ],
          $slice: -LEDGER_CAP,
        },
      },
    },
    { new: true },
  );

  return {
    evaluation,
    creditBalance: updated?.creditBalance ?? reserved.creditBalance,
  };
}
