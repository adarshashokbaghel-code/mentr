import { Router, Response, Request } from "express";
import { config } from "../config";
import { ensureDb } from "../middleware/ensure-db";
import {
  requireAuth,
  type AuthenticatedRequest,
} from "../middleware/auth";
import { SnapGradeQuestion, type SnapGradeRecharge } from "../models/SnapGrade";
import { ensureSnapGradeSeed } from "../services/snap-grade-seed";
import {
  getOrCreateWallet,
  runSnapGradeEvaluation,
  transcribeSolutionPhoto,
  type SnapGradeRelevance,
} from "../services/snap-grade";
import {
  applyPaidRecharge,
  createSnapGradeRechargeOrder,
  handleRazorpayWebhookPayload,
  isRazorpayConfigured,
  MIN_RECHARGE_CREDITS,
  MAX_RECHARGE_CREDITS,
  snapGradeCreditPaise,
  verifyWebhookSignature,
} from "../services/snap-grade-razorpay";

const router = Router();

router.use(ensureDb);

/** Simple per-user sliding window to stop OCR/grade API abuse. */
const hitBuckets = new Map<string, number[]>();

function rateLimit(
  key: string,
  max: number,
  windowMs: number,
): boolean {
  const now = Date.now();
  const prev = hitBuckets.get(key) || [];
  const next = prev.filter((t) => now - t < windowMs);
  if (next.length >= max) {
    hitBuckets.set(key, next);
    return false;
  }
  next.push(now);
  hitBuckets.set(key, next);
  return true;
}

function serializeQuestion(
  q: InstanceType<typeof SnapGradeQuestion>,
  opts?: { includeReference?: boolean },
) {
  return {
    id: q._id.toString(),
    board: q.board,
    classLevel: q.classLevel,
    subject: q.subject,
    chapterNumber: q.chapterNumber,
    chapterName: q.chapterName,
    exercise: q.exercise,
    questionNumber: q.questionNumber,
    questionText: q.questionText,
    maxMarks: q.maxMarks,
    rubric: q.rubric,
    markingSchemeNotes: q.markingSchemeNotes,
    creditsCost: q.creditsCost,
    ...(opts?.includeReference
      ? { referenceNotes: q.referenceNotes || "" }
      : {}),
  };
}

function toDataUrl(imageBase64: string, mimeType?: string): string {
  return imageBase64.startsWith("data:")
    ? imageBase64
    : `data:${mimeType || "image/jpeg"};base64,${imageBase64}`;
}

const RELEVANCE_SET = new Set([
  "matches_question",
  "partial_question",
  "wrong_question",
  "blank",
  "unreadable",
]);

function parseClientRelevance(raw: unknown): SnapGradeRelevance | undefined {
  const v = String(raw || "").trim();
  if (RELEVANCE_SET.has(v)) return v as SnapGradeRelevance;
  return undefined;
}

function serializeHistoryEntry(h: {
  evaluationId: string;
  gradedAt: Date;
  board: string;
  classLevel: number;
  subject: string;
  chapterNumber: number;
  chapterName: string;
  exercise: string;
  questionNumber: string;
  questionText: string;
  marksAwarded: number;
  maxMarks: number;
  creditsDeducted: number;
  overallFeedback: string;
  transcript: string;
  relevance: string;
  steps: {
    stepId: string;
    label: string;
    marksPossible: number;
    marksAwarded: number;
    comment: string;
  }[];
}) {
  return {
    id: h.evaluationId,
    gradedAt: h.gradedAt,
    board: h.board,
    classLevel: h.classLevel,
    subject: h.subject,
    chapterNumber: h.chapterNumber,
    chapterName: h.chapterName,
    exercise: h.exercise,
    questionNumber: h.questionNumber,
    questionText: h.questionText,
    marksAwarded: h.marksAwarded,
    maxMarks: h.maxMarks,
    creditsDeducted: h.creditsDeducted,
    overallFeedback: h.overallFeedback,
    transcript: h.transcript,
    relevance: h.relevance,
    steps: h.steps,
  };
}

/** Public catalog tree + questions for selectors (guests OK). */
router.get("/catalog", async (_req, res: Response) => {
  try {
    void ensureSnapGradeSeed().catch((seedErr) => {
      console.warn("[snap-grade] background seed failed:", seedErr);
    });
    const questions = await SnapGradeQuestion.find({ active: true }).sort({
      sortOrder: 1,
      exercise: 1,
      questionNumber: 1,
    });

    const boards = [...new Set(questions.map((q) => q.board))];
    const classes = [...new Set(questions.map((q) => q.classLevel))].sort(
      (a, b) => a - b,
    );
    const subjects = [...new Set(questions.map((q) => q.subject))];
    const chapters = [
      ...new Map(
        questions.map((q) => [
          `${q.classLevel}:${q.subject}:${q.chapterNumber}`,
          {
            classLevel: q.classLevel,
            subject: q.subject,
            chapterNumber: q.chapterNumber,
            chapterName: q.chapterName,
          },
        ]),
      ).values(),
    ];
    const exercises = [
      ...new Map(
        questions.map((q) => [
          `${q.classLevel}:${q.subject}:${q.chapterNumber}:${q.exercise}`,
          {
            classLevel: q.classLevel,
            subject: q.subject,
            chapterNumber: q.chapterNumber,
            exercise: q.exercise,
          },
        ]),
      ).values(),
    ];

    res.json({
      boards,
      classes,
      subjects,
      chapters,
      exercises,
      questions: questions.map((q) => serializeQuestion(q)),
      seeded: true,
      pricing: {
        freeCredits: 100,
        minRecharge: MIN_RECHARGE_CREDITS,
        maxRecharge: MAX_RECHARGE_CREDITS,
        creditPaise: snapGradeCreditPaise(),
        paymentsEnabled: isRazorpayConfigured(),
      },
    });
  } catch (err) {
    console.error("snap-grade catalog error:", err);
    res.status(500).json({ error: "Failed to load question bank" });
  }
});

/** Full account: wallet + recent history + recharge meta (auth). */
router.get("/account", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const wallet = await getOrCreateWallet(req.auth!.sub);
    res.json({
      creditBalance: wallet.creditBalance,
      freeCreditsClaimed: wallet.freeCreditsClaimed,
      freeCreditsGranted: wallet.freeCreditsGranted || 0,
      totalRecharged: wallet.totalRecharged || 0,
      totalSpent: wallet.totalSpent || 0,
      history: (wallet.history || []).slice(0, 40).map(serializeHistoryEntry),
      recharges: (wallet.recharges || [])
        .slice(-20)
        .reverse()
        .map((r: SnapGradeRecharge) => ({
          orderId: r.razorpayOrderId,
          paymentId: r.razorpayPaymentId || null,
          credits: r.credits,
          amountPaise: r.amountPaise,
          status: r.status,
          createdAt: r.createdAt,
          paidAt: r.paidAt || null,
        })),
      pricing: {
        freeCredits: 100,
        minRecharge: MIN_RECHARGE_CREDITS,
        maxRecharge: MAX_RECHARGE_CREDITS,
        creditPaise: snapGradeCreditPaise(),
        paymentsEnabled: isRazorpayConfigured(),
      },
    });
  } catch (err) {
    console.error("snap-grade account error:", err);
    res.status(500).json({ error: "Failed to load account" });
  }
});

router.get("/wallet", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const wallet = await getOrCreateWallet(req.auth!.sub);
    res.json({
      creditBalance: wallet.creditBalance,
      freeCreditsClaimed: wallet.freeCreditsClaimed,
      freeCreditsGranted: wallet.freeCreditsGranted || 0,
      totalRecharged: wallet.totalRecharged || 0,
      totalSpent: wallet.totalSpent || 0,
      pricing: {
        freeCredits: 100,
        minRecharge: MIN_RECHARGE_CREDITS,
        creditPaise: snapGradeCreditPaise(),
        paymentsEnabled: isRazorpayConfigured(),
      },
    });
  } catch (err) {
    console.error("snap-grade wallet error:", err);
    res.status(500).json({ error: "Failed to load wallet" });
  }
});

/** Text-only grade history (no images). */
router.get("/history", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const wallet = await getOrCreateWallet(req.auth!.sub);
    const limit = Math.min(
      100,
      Math.max(1, parseInt(String(req.query.limit || "40"), 10) || 40),
    );
    const offset = Math.max(0, parseInt(String(req.query.offset || "0"), 10) || 0);
    const all = wallet.history || [];
    res.json({
      total: all.length,
      items: all.slice(offset, offset + limit).map(serializeHistoryEntry),
    });
  } catch (err) {
    console.error("snap-grade history error:", err);
    res.status(500).json({ error: "Failed to load history" });
  }
});

router.get("/questions/:id", async (req, res: Response) => {
  try {
    await ensureSnapGradeSeed();
    const q = await SnapGradeQuestion.findById(req.params.id);
    if (!q || !q.active) {
      res.status(404).json({ error: "Question not found" });
      return;
    }
    res.json({ question: serializeQuestion(q) });
  } catch (err) {
    console.error("snap-grade question error:", err);
    res.status(500).json({ error: "Failed to load question" });
  }
});

/** Create Razorpay order (min ₹1 / 1 credit). Credits via client verify + API confirm. */
router.post(
  "/recharge/order",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!rateLimit(`rzp-order:${req.auth!.sub}`, 8, 60_000)) {
        res.status(429).json({ error: "Too many payment attempts. Wait a minute." });
        return;
      }
      const credits = Number(req.body?.credits);
      const result = await createSnapGradeRechargeOrder(req.auth!.sub, credits);
      if ("error" in result) {
        const status =
          result.code === "PAYMENTS_OFF"
            ? 503
            : result.code === "TOO_MANY_ORDERS"
              ? 429
              : 400;
        res.status(status).json(result);
        return;
      }
      res.json(result);
    } catch (err) {
      console.error("snap-grade recharge order error:", err);
      res.status(500).json({ error: "Could not start payment" });
    }
  },
);

/**
 * Client payment confirmation — primary credit path (no webhook required).
 * HMAC signature + live Razorpay Payments API. Idempotent; safe to retry.
 */
router.post(
  "/recharge/verify",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      // Higher limit so mid-connection client retries can complete
      if (!rateLimit(`rzp-verify:${req.auth!.sub}`, 40, 60_000)) {
        res.status(429).json({ error: "Too many verify attempts" });
        return;
      }
      const orderId = String(req.body?.razorpay_order_id || req.body?.orderId || "");
      const paymentId = String(
        req.body?.razorpay_payment_id || req.body?.paymentId || "",
      );
      const signature = String(
        req.body?.razorpay_signature || req.body?.signature || "",
      );
      const result = await applyPaidRecharge({
        userId: req.auth!.sub,
        orderId,
        paymentId,
        signature,
        confirmWithApi: true,
      });
      if ("error" in result) {
        const code = String(result.code || "");
        const status =
          code === "FORBIDDEN"
            ? 403
            : code === "NOT_CAPTURED" || code === "FETCH_FAILED"
              ? 409
              : 400;
        res.status(status).json(result);
        return;
      }
      res.json(result);
    } catch (err) {
      console.error("snap-grade recharge verify error:", err);
      res.status(500).json({ error: "Could not confirm payment" });
    }
  },
);

/**
 * Optional Razorpay webhook (production later). Credits already applied via
 * /recharge/verify — this only acks so Razorpay stops retrying if enabled.
 */
export async function snapGradeRazorpayWebhook(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const signature = req.headers["x-razorpay-signature"] as string | undefined;
    const raw =
      (req as Request & { rawBody?: Buffer }).rawBody ||
      (Buffer.isBuffer(req.body)
        ? req.body
        : Buffer.from(
            typeof req.body === "string" ? req.body : JSON.stringify(req.body || {}),
          ));

    // If webhook secret not set, acknowledge without mutating (verify API is source of truth)
    if (!config.razorpay.webhookSecret) {
      res.json({ ok: true, ignored: true, reason: "webhook_disabled" });
      return;
    }

    if (!verifyWebhookSignature(raw, signature)) {
      res.status(400).json({ error: "Invalid webhook signature" });
      return;
    }

    const payload =
      typeof req.body === "object" && !Buffer.isBuffer(req.body)
        ? req.body
        : JSON.parse(raw.toString("utf8"));

    // Idempotent backup only — same applyPaidRecharge path
    const result = await handleRazorpayWebhookPayload(payload);
    if (result && "error" in result) {
      console.warn("[snap-grade webhook]", result);
      // Still 200 for order-not-found race; client verify may still be in flight
      res.json({ ok: false, ...result });
      return;
    }
    res.json({ ok: true, ...result });
  } catch (err) {
    console.error("snap-grade webhook error:", err);
    res.status(500).json({ error: "Webhook failed" });
  }
}

/** Free read: OCR photo → digital text (auth + rate-limited). */
router.post(
  "/transcribe",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!rateLimit(`ocr:${req.auth!.sub}`, 20, 60_000)) {
        res.status(429).json({
          error: "Too many photo reads. Wait a minute and try again.",
          code: "RATE_LIMIT",
        });
        return;
      }
      await ensureSnapGradeSeed();
      const questionId = String(req.body?.questionId || "");
      const imageBase64 = String(req.body?.imageBase64 || "");
      const mimeType = req.body?.mimeType
        ? String(req.body.mimeType)
        : undefined;

      if (!/^[a-f\d]{24}$/i.test(questionId)) {
        res.status(400).json({ error: "Pick a valid question" });
        return;
      }
      if (!imageBase64) {
        res.status(400).json({ error: "Upload a photo of your solution" });
        return;
      }
      // Reject absurd payloads (abuse / DoS)
      if (imageBase64.length > 12_000_000) {
        res.status(400).json({ error: "Image too large" });
        return;
      }

      const question = await SnapGradeQuestion.findById(questionId);
      if (!question || !question.active) {
        res.status(404).json({ error: "Question not found" });
        return;
      }

      const result = await transcribeSolutionPhoto(
        question,
        toDataUrl(imageBase64, mimeType),
      );
      if ("error" in result) {
        res.status(400).json(result);
        return;
      }

      res.json({
        transcript: result.transcript,
        relevance: result.relevance,
        notes: result.notes,
        imageReadable: result.imageReadable,
        creditsCharged: 0,
        question: serializeQuestion(question),
      });
    } catch (err) {
      console.error("snap-grade transcribe error:", err);
      res.status(500).json({ error: "Could not read photo" });
    }
  },
);

/** Grade confirmed digital text against curated question + rubric. */
router.post(
  "/evaluate",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!rateLimit(`grade:${req.auth!.sub}`, 12, 60_000)) {
        res.status(429).json({
          error: "Too many grading requests. Wait a minute.",
          code: "RATE_LIMIT",
        });
        return;
      }
      await ensureSnapGradeSeed();
      const questionId = String(req.body?.questionId || "");
      const imageBase64 = String(req.body?.imageBase64 || "");
      const mimeType = req.body?.mimeType
        ? String(req.body.mimeType)
        : undefined;
      const confirmedTranscript = String(req.body?.confirmedTranscript || "");
      const originalTranscript = String(req.body?.originalTranscript || "");
      const relevance = parseClientRelevance(req.body?.relevance);

      if (!/^[a-f\d]{24}$/i.test(questionId)) {
        res.status(400).json({ error: "Pick a valid question" });
        return;
      }
      if (!imageBase64) {
        res.status(400).json({ error: "Upload a photo of your solution" });
        return;
      }
      if (imageBase64.length > 12_000_000) {
        res.status(400).json({ error: "Image too large" });
        return;
      }
      if (!confirmedTranscript.trim()) {
        res.status(400).json({
          error:
            "Confirm the digital text from your photo before grading. Credits are only charged after you confirm.",
          code: "TRANSCRIPT_REQUIRED",
        });
        return;
      }

      const question = await SnapGradeQuestion.findById(questionId);
      if (!question || !question.active) {
        res.status(404).json({ error: "Question not found" });
        return;
      }

      const result = await runSnapGradeEvaluation({
        userId: req.auth!.sub,
        question,
        imageBase64,
        mimeType,
        confirmedTranscript,
        originalTranscript: originalTranscript || confirmedTranscript,
        relevance,
      });

      if ("error" in result) {
        const status =
          result.code === "INSUFFICIENT_CREDITS"
            ? 402
            : result.code === "TRANSCRIPT_REQUIRED"
              ? 400
              : 400;
        res.status(status).json(result);
        return;
      }

      const ev = result.evaluation;
      res.json({
        evaluation: {
          id: ev._id.toString(),
          marksAwarded: ev.marksAwarded,
          maxMarks: ev.maxMarks,
          creditsDeducted: ev.creditsDeducted,
          steps: ev.steps,
          overallFeedback: ev.overallFeedback,
          transcript: ev.transcript || "",
          originalTranscript: ev.originalTranscript || "",
          transcriptEdited: Boolean(ev.transcriptEdited),
          relevance: ev.relevance || "",
          // Images are not returned for history UX; keep url only for this response if needed
          imageUrl: ev.imageUrl,
          createdAt: ev.createdAt,
          model: ev.aiModel,
        },
        question: serializeQuestion(question),
        creditBalance: result.creditBalance,
      });
    } catch (err) {
      console.error("snap-grade evaluate error:", err);
      res.status(500).json({ error: "Evaluation failed" });
    }
  },
);

export default router;
