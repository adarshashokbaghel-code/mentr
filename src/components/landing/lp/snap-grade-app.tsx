"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { NcertChapterPdfSection } from "@/components/landing/lp/ncert-chapter-pdfs";
import {
  SnapGradeFinalCta,
  SnapGradeInlineConvert,
  SnapGradeSubjectsCta,
} from "@/components/landing/lp/snap-grade-convert";
import {
  ApiError,
  snapGradeApi,
  type SnapGradeEvaluation,
  type SnapGradeHistoryItem,
  type SnapGradePricing,
  type SnapGradeQuestion,
} from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  FileText,
  Gift,
  History,
  Loader2,
  RefreshCw,
  Upload,
  Wallet,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

const RETURN_PATH = "/snapandgrade/grade";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, cb: (resp: unknown) => void) => void;
    };
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const existing = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

function formatExerciseLabel(exercise: string): string {
  if (exercise.endsWith("-optional") || exercise.endsWith(".E-optional")) {
    const core = exercise.replace(/-optional$/, "").replace(/\.E$/i, "");
    return `Optional · Ex ${core}`;
  }
  if (/^\d+\.E$/i.test(exercise) || exercise === "Exercises") {
    return "Exercises";
  }
  if (exercise === "EOC" || exercise.startsWith("EOC")) {
    return "End of chapter";
  }
  if (exercise.includes("-TR")) {
    return `Think & Reflect · ${exercise.replace(/-TR$/, "")}`;
  }
  return `Exercise ${exercise}`;
}

/** Match Free NCERT PDFs / Learn / open-source page width */
const SHELL =
  "mx-auto w-full min-w-0 max-w-[1400px] px-4 sm:px-6 lg:px-10";

const field =
  "h-10 w-full min-w-0 appearance-none rounded-lg border border-ink/12 bg-white px-2.5 text-[13px] font-medium text-ink outline-none transition focus:border-ink/40 focus:ring-2 focus:ring-coral/20 sm:text-[14px]";

type FlowStep = "upload" | "review" | "graded";

function relevanceLabel(r: string): string {
  return r.replace(/_/g, " ");
}

function relevanceTone(r: string): string {
  if (r === "matches_question") return "bg-sage-wash text-sage";
  if (r === "partial_question") return "bg-butter/70 text-ink";
  return "bg-coral-wash text-coral-dark";
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Could not read image"));
    reader.readAsDataURL(file);
  });
}

export function SnapGradeApp() {
  const { user, loading: authLoading, openRoleChooser } = useAuth();

  const [catalogLoading, setCatalogLoading] = useState(true);
  const [accountLoading, setAccountLoading] = useState(false);
  const [questions, setQuestions] = useState<SnapGradeQuestion[]>([]);
  const [boards, setBoards] = useState<string[]>([]);
  const [classes, setClasses] = useState<number[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);

  const [board, setBoard] = useState("CBSE");
  const [classLevel, setClassLevel] = useState(9);
  const [subject, setSubject] = useState("Mathematics");
  const [chapterNumber, setChapterNumber] = useState(1);
  const [exercise, setExercise] = useState("");
  const [questionId, setQuestionId] = useState("");

      const [credits, setCredits] = useState<number | null>(null);
  const [premiumUnlimited, setPremiumUnlimited] = useState(false);
  const [pricing, setPricing] = useState<SnapGradePricing | null>(null);
  const [history, setHistory] = useState<SnapGradeHistoryItem[]>([]);
  const [recharges, setRecharges] = useState<
    {
      orderId: string;
      paymentId: string | null;
      credits: number;
      amountPaise: number;
      status: string;
      createdAt: string;
      paidAt: string | null;
    }[]
  >([]);
  const [freeCreditsClaimed, setFreeCreditsClaimed] = useState(false);
  const [freeCreditsGranted, setFreeCreditsGranted] = useState(0);
  const [totalRecharged, setTotalRecharged] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelTab, setPanelTab] = useState<"grades" | "account">("grades");
  const [historyDetail, setHistoryDetail] =
    useState<SnapGradeHistoryItem | null>(null);
  const [rechargeCredits, setRechargeCredits] = useState(1);
  const [recharging, setRecharging] = useState(false);

  const [preview, setPreview] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | undefined>();
  const [flowStep, setFlowStep] = useState<FlowStep>("upload");
  const [reading, setReading] = useState(false);
  const [grading, setGrading] = useState(false);
  const [error, setError] = useState("");
  const [originalTranscript, setOriginalTranscript] = useState("");
  const [editTranscript, setEditTranscript] = useState("");
  const [relevance, setRelevance] = useState("");
  const [readNotes, setReadNotes] = useState("");
  const [result, setResult] = useState<{
    evaluation: SnapGradeEvaluation;
    question: SnapGradeQuestion;
  } | null>(null);

  const requireLogin = useCallback(() => {
    openRoleChooser(RETURN_PATH);
  }, [openRoleChooser]);

  const loadCatalog = useCallback(async () => {
    setCatalogLoading(true);
    setError("");
    try {
      const cat = await snapGradeApi.catalog();
      setQuestions(cat.questions);
      setBoards(cat.boards);
      setClasses(cat.classes);
      setSubjects(cat.subjects);
      if (cat.pricing) setPricing(cat.pricing);
      if (cat.boards[0]) setBoard(cat.boards[0]);
      if (cat.classes[0]) setClassLevel(cat.classes[0]);
      if (cat.subjects[0]) setSubject(cat.subjects[0]);
      if (cat.pricing?.minRecharge) {
        setRechargeCredits(cat.pricing.minRecharge);
      }
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Could not load question bank",
      );
    } finally {
      setCatalogLoading(false);
    }
  }, []);

  const loadAccount = useCallback(async () => {
    if (!user) {
      setCredits(null);
      setPremiumUnlimited(false);
      setHistory([]);
      setRecharges([]);
      setFreeCreditsClaimed(false);
      setFreeCreditsGranted(0);
      setTotalRecharged(0);
      setTotalSpent(0);
      return;
    }
    setAccountLoading(true);
    try {
      const acc = await snapGradeApi.account();
      setCredits(acc.creditBalance);
      setPremiumUnlimited(Boolean(acc.premiumUnlimited));
      setHistory(acc.history || []);
      setRecharges(acc.recharges || []);
      setFreeCreditsClaimed(Boolean(acc.freeCreditsClaimed));
      setFreeCreditsGranted(acc.freeCreditsGranted || 0);
      setTotalRecharged(acc.totalRecharged || 0);
      setTotalSpent(acc.totalSpent || 0);
      if (acc.pricing) setPricing(acc.pricing);
      if (acc.pricing?.minRecharge) {
        setRechargeCredits((c) =>
          Math.max(acc.pricing.minRecharge, c || acc.pricing.minRecharge),
        );
      }
    } catch {
      try {
        const w = await snapGradeApi.wallet();
        setCredits(w.creditBalance);
        setFreeCreditsClaimed(Boolean(w.freeCreditsClaimed));
        setFreeCreditsGranted(w.freeCreditsGranted || 0);
        setTotalRecharged(w.totalRecharged || 0);
        setTotalSpent(w.totalSpent || 0);
      } catch {
        /* guest-like */
      }
    } finally {
      setAccountLoading(false);
    }
  }, [user]);

  const openPanel = useCallback(
    (tab: "grades" | "account" = "grades") => {
      if (!user) {
        requireLogin();
        return;
      }
      setPanelTab(tab);
      setHistoryDetail(null);
      setPanelOpen(true);
      void loadAccount();
      void confirmPendingPayment(true);
    },
    // confirmPendingPayment is stable enough for open; defined later as function
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, requireLogin, loadAccount],
  );

  const closePanel = useCallback(() => {
    setPanelOpen(false);
    setHistoryDetail(null);
  }, []);

  useEffect(() => {
    void loadCatalog();
  }, [loadCatalog]);

  useEffect(() => {
    if (authLoading) return;
    void loadAccount();
  }, [authLoading, user, loadAccount]);

  const chapters = useMemo(() => {
    const map = new Map<number, string>();
    for (const q of questions) {
      if (
        q.board === board &&
        q.classLevel === classLevel &&
        q.subject === subject
      ) {
        map.set(q.chapterNumber, q.chapterName);
      }
    }
    return [...map.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([num, name]) => ({ chapterNumber: num, chapterName: name }));
  }, [questions, board, classLevel, subject]);

  const exercises = useMemo(() => {
    const set = new Set<string>();
    for (const q of questions) {
      if (
        q.board === board &&
        q.classLevel === classLevel &&
        q.subject === subject &&
        q.chapterNumber === chapterNumber
      ) {
        set.add(q.exercise);
      }
    }
    return [...set].sort((a, b) => {
      const parse = (ex: string) => {
        const opt = ex.endsWith("-optional");
        const core = ex.replace(/-optional$/, "");
        const [maj, min] = core.split(".").map(Number);
        return { maj: maj || 0, min: min || 0, opt: opt ? 1 : 0 };
      };
      const A = parse(a);
      const B = parse(b);
      return A.maj - B.maj || A.min - B.min || A.opt - B.opt;
    });
  }, [questions, board, classLevel, subject, chapterNumber]);

  const filteredQuestions = useMemo(() => {
    return questions.filter(
      (q) =>
        q.board === board &&
        q.classLevel === classLevel &&
        q.subject === subject &&
        q.chapterNumber === chapterNumber &&
        (!exercise || q.exercise === exercise),
    );
  }, [questions, board, classLevel, subject, chapterNumber, exercise]);

  const selected = useMemo(
    () => questions.find((q) => q.id === questionId) || null,
    [questions, questionId],
  );

  const questionIndex = useMemo(
    () => filteredQuestions.findIndex((q) => q.id === questionId),
    [filteredQuestions, questionId],
  );

  useEffect(() => {
    if (chapters.length && !chapters.some((c) => c.chapterNumber === chapterNumber)) {
      setChapterNumber(chapters[0]!.chapterNumber);
    }
  }, [chapters, chapterNumber]);

  useEffect(() => {
    if (exercises.length && !exercises.includes(exercise)) {
      setExercise(exercises[0]!);
    }
  }, [exercises, exercise]);

  useEffect(() => {
    if (
      filteredQuestions.length &&
      !filteredQuestions.some((q) => q.id === questionId)
    ) {
      setQuestionId(filteredQuestions[0]!.id);
    }
  }, [filteredQuestions, questionId]);

  function clearExtraction() {
    setOriginalTranscript("");
    setEditTranscript("");
    setRelevance("");
    setReadNotes("");
    setFlowStep("upload");
  }

  function resetWork() {
    setResult(null);
    setPreview(null);
    clearExtraction();
    setError("");
  }

  function selectQuestion(id: string) {
    setQuestionId(id);
    setResult(null);
    clearExtraction();
  }

  async function onPickFile(file: File | undefined) {
    if (!file) return;
    if (!user) {
      requireLogin();
      return;
    }
    setError("");
    setResult(null);
    clearExtraction();
    if (!/^image\/(jpeg|png|webp)$/i.test(file.type)) {
      setError("Use a JPEG, PNG, or WebP photo");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("Keep the photo under 8 MB");
      return;
    }
    const dataUrl = await readFileAsDataUrl(file);
    setPreview(dataUrl);
    setMimeType(file.type);
  }

  async function handleReadPhoto() {
    if (!user) {
      requireLogin();
      return;
    }
    if (!selected || !preview) {
      setError("Select a question and upload your solution photo");
      return;
    }
    setReading(true);
    setError("");
    setResult(null);
    try {
      const data = await snapGradeApi.transcribe({
        questionId: selected.id,
        imageBase64: preview,
        mimeType,
      });
      setOriginalTranscript(data.transcript);
      setEditTranscript(data.transcript);
      setRelevance(data.relevance);
      setReadNotes(data.notes || "");
      setFlowStep("review");
      if (
        data.relevance === "wrong_question" ||
        data.relevance === "blank" ||
        data.relevance === "unreadable"
      ) {
        setError(
          data.relevance === "wrong_question"
            ? "This photo doesn't match the selected question. Change photo or edit the text before grading."
            : data.relevance === "blank"
              ? "No usable working found. Upload a clearer photo."
              : "Photo is hard to read. Re-upload sharper, or fix the digital text.",
        );
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        requireLogin();
        return;
      }
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not read the photo. Try again.",
      );
    } finally {
      setReading(false);
    }
  }

  async function handleConfirmGrade() {
    if (!user) {
      requireLogin();
      return;
    }
    if (!selected || !preview || !editTranscript.trim()) {
      setError("Review and confirm the digital text before grading");
      return;
    }
    if (
      !premiumUnlimited &&
      credits !== null &&
      selected.creditsCost > credits
    ) {
      setError(
        `Not enough credits (need ${selected.creditsCost}, have ${credits}). Recharge to continue.`,
      );
      openPanel("account");
      return;
    }
    setGrading(true);
    setError("");
    try {
      const data = await snapGradeApi.evaluate({
        questionId: selected.id,
        imageBase64: preview,
        mimeType,
        confirmedTranscript: editTranscript,
        originalTranscript,
        relevance: relevance || undefined,
      });
      setResult({ evaluation: data.evaluation, question: data.question });
      setCredits(data.creditBalance);
      if (data.premiumUnlimited) setPremiumUnlimited(true);
      setFlowStep("graded");
      void loadAccount();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        requireLogin();
        return;
      }
      if (err instanceof ApiError && err.status === 402) {
        setError(err.message);
        openPanel("account");
        return;
      }
      setError(
        err instanceof ApiError ? err.message : "Grading failed. Try again.",
      );
    } finally {
      setGrading(false);
    }
  }

  async function handleRecharge() {
    if (!user) {
      requireLogin();
      return;
    }
    const min = pricing?.minRecharge ?? 1;
    const max = pricing?.maxRecharge ?? 5000;
    const qty = Math.floor(rechargeCredits);
    if (qty < min) {
      setError(`Minimum recharge is ${min} credit${min === 1 ? "" : "s"}`);
      return;
    }
    if (qty > max) {
      setError(`Maximum recharge is ${max} credits`);
      return;
    }
    if (pricing && !pricing.paymentsEnabled) {
      setError("Payments are temporarily unavailable");
      return;
    }
    setRecharging(true);
    setError("");
    try {
      const order = await snapGradeApi.createRechargeOrder(qty);
      const ok = await loadRazorpayScript();
      if (!ok || !window.Razorpay) {
        setError("Could not load payment checkout. Try again.");
        setRecharging(false);
        return;
      }
      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amountPaise,
        currency: order.currency,
        name: "Snap & Grade",
        description: `${order.credits} credit${order.credits === 1 ? "" : "s"}`,
        order_id: order.orderId,
        handler: async (response: unknown) => {
          const r = response as {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
          };
          const payload = {
            razorpay_order_id: r.razorpay_order_id,
            razorpay_payment_id: r.razorpay_payment_id,
            razorpay_signature: r.razorpay_signature,
          };
          // Survive mid-connection drops — retry verify with backoff
          try {
            if (typeof sessionStorage !== "undefined") {
              sessionStorage.setItem(
                "snap_grade_pending_payment",
                JSON.stringify(payload),
              );
            }
          } catch {
            /* ignore */
          }
          const delays = [0, 800, 1600, 3200, 5000];
          let lastErr: unknown;
          for (let i = 0; i < delays.length; i++) {
            if (delays[i]! > 0) {
              await new Promise((resolve) => setTimeout(resolve, delays[i]));
            }
            try {
              const verified = await snapGradeApi.verifyRecharge(payload);
              try {
                sessionStorage.removeItem("snap_grade_pending_payment");
              } catch {
                /* ignore */
              }
              setCredits(verified.creditBalance);
              setError("");
              void loadAccount();
              setRecharging(false);
              return;
            } catch (err) {
              lastErr = err;
              // Hard auth / signature errors — don't burn retries
              if (
                err instanceof ApiError &&
                (err.status === 401 ||
                  err.status === 403 ||
                  err.status === 400)
              ) {
                break;
              }
            }
          }
          setError(
            lastErr instanceof ApiError
              ? lastErr.message
              : "Payment may have succeeded — open Account to refresh balance.",
          );
          setRecharging(false);
        },
        theme: { color: "#e85d4c" },
        modal: {
          ondismiss: () => setRecharging(false),
        },
      });
      rzp.open();
    } catch (err) {
      setRecharging(false);
      setError(
        err instanceof ApiError ? err.message : "Could not start payment",
      );
    }
  }

  async function confirmPendingPayment(silent = false) {
    if (!user) {
      if (!silent) requireLogin();
      return;
    }
    type PendingPay = {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    };
    let payload: PendingPay | null = null;
    try {
      const raw = sessionStorage.getItem("snap_grade_pending_payment");
      if (raw) payload = JSON.parse(raw) as PendingPay;
    } catch {
      payload = null;
    }
    if (!payload?.razorpay_order_id || !payload.razorpay_payment_id) {
      if (!silent) setError("No pending payment to confirm");
      return;
    }
    setRecharging(true);
    if (!silent) setError("");
    try {
      const verified = await snapGradeApi.verifyRecharge(payload);
      try {
        sessionStorage.removeItem("snap_grade_pending_payment");
      } catch {
        /* ignore */
      }
      setCredits(verified.creditBalance);
      void loadAccount();
    } catch (err) {
      if (!silent) {
        setError(
          err instanceof ApiError
            ? err.message
            : "Could not confirm payment. Try again.",
        );
      }
    } finally {
      setRecharging(false);
    }
  }

  useEffect(() => {
    if (!user || authLoading) return;
    void confirmPendingPayment(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one-shot pending recovery on login
  }, [user, authLoading]);

  const transcriptDirty =
    editTranscript.trim() !== originalTranscript.trim() &&
    originalTranscript.length > 0;

  const canConfirmGrade =
    Boolean(selected && preview && editTranscript.trim()) &&
    flowStep === "review" &&
    relevance !== "blank" &&
    relevance !== "unreadable";

  const stepIndex = flowStep === "upload" ? 0 : flowStep === "review" ? 1 : 2;
  const minRecharge = pricing?.minRecharge ?? 1;
  const creditPaise = pricing?.creditPaise ?? 100;
  const rechargeInr = Math.round((rechargeCredits * creditPaise) / 100);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream text-sm text-muted">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading…
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main id="grade-top" className="bg-[#f3eee6] pb-16 sm:pb-6">
        <div className={cn(SHELL, "pt-6 sm:pt-8")}>
          {/* Compact top bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
            <div className="min-w-0">
              <h1 className="text-base font-extrabold tracking-tight text-ink sm:text-lg">
                Grade now
              </h1>
              <p className="hidden text-[11px] text-muted sm:block">
                {user
                  ? premiumUnlimited
                    ? "Premium mentor · unlimited grading"
                    : "100 free credits once · recharge from ₹1"
                  : "Browse free · log in to grade · 100 free credits"}{" "}
                ·{" "}
                <a
                  href="#ncert-maths-pdfs"
                  className="font-semibold text-coral hover:text-coral-dark"
                >
                  PDFs ↓
                </a>
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => {
                  if (!user) {
                    requireLogin();
                    return;
                  }
                  openPanel("account");
                }}
                className="inline-flex h-9 items-center gap-2 rounded-full border border-ink/10 bg-white pl-2.5 pr-2 shadow-sm transition hover:border-ink/25"
                aria-label="Open account and history"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-coral/10 text-coral">
                  <Wallet className="h-3.5 w-3.5" />
                </span>
                <span className="text-[14px] font-extrabold tabular-nums text-ink">
                  {accountLoading
                    ? "…"
                    : user
                      ? premiumUnlimited
                        ? "∞"
                        : (credits ?? "—")
                      : "—"}
                </span>
                <span className="hidden text-[10px] font-bold uppercase tracking-wide text-muted sm:inline">
                  {premiumUnlimited ? "prem" : "cr"}
                </span>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f3eee6] text-muted">
                  <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </button>
            </div>
          </div>

          {error ? (
            <div
              role="alert"
              className="mt-3 flex items-start gap-3 rounded-xl border border-coral/25 bg-coral-wash/80 px-3.5 py-2.5 text-[13px] text-coral-dark"
            >
              <p className="min-w-0 flex-1 font-medium leading-snug">{error}</p>
              <button
                type="button"
                aria-label="Dismiss"
                onClick={() => setError("")}
                className="shrink-0 rounded-md p-0.5 hover:bg-white/50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : null}

          {catalogLoading ? (
            <div className="mt-6 space-y-3">
              <div className="h-24 animate-pulse rounded-2xl bg-white/80" />
              <div className="grid gap-3 lg:grid-cols-2">
                <div className="h-64 animate-pulse rounded-2xl bg-white/80" />
                <div className="h-64 animate-pulse rounded-2xl bg-white/80" />
              </div>
            </div>
          ) : (
            <div className="mt-3 space-y-2.5 sm:mt-3.5 sm:space-y-3">
              {/* Filter toolbar — always visible, full width */}
              <div className="rounded-xl border border-ink/10 bg-white p-2.5 sm:p-3">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
                  <label className="block min-w-0">
                    <span className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-muted">
                      Board
                    </span>
                    <select
                      className={field}
                      value={board}
                      onChange={(e) => setBoard(e.target.value)}
                    >
                      {boards.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block min-w-0">
                    <span className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-muted">
                      Class
                    </span>
                    <select
                      className={field}
                      value={classLevel}
                      onChange={(e) => setClassLevel(Number(e.target.value))}
                    >
                      {classes.map((c) => (
                        <option key={c} value={c}>
                          Class {c}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block min-w-0">
                    <span className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-muted">
                      Subject
                    </span>
                    <select
                      className={field}
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    >
                      {subjects.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="col-span-2 block min-w-0 sm:col-span-1 lg:col-span-1">
                    <span className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-muted">
                      Chapter
                    </span>
                    <select
                      className={field}
                      value={chapterNumber}
                      onChange={(e) =>
                        setChapterNumber(Number(e.target.value))
                      }
                    >
                      {chapters.map((c) => (
                        <option key={c.chapterNumber} value={c.chapterNumber}>
                          Ch {c.chapterNumber} · {c.chapterName}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block min-w-0">
                    <span className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-muted">
                      Exercise
                    </span>
                    <select
                      className={field}
                      value={exercise}
                      onChange={(e) => setExercise(e.target.value)}
                    >
                      {exercises.map((ex) => (
                        <option key={ex} value={ex}>
                          {formatExerciseLabel(ex)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block min-w-0">
                    <span className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-muted">
                      Question
                    </span>
                    <select
                      className={field}
                      value={questionId}
                      onChange={(e) => selectQuestion(e.target.value)}
                    >
                      {filteredQuestions.map((q) => (
                        <option key={q.id} value={q.id}>
                          Q{q.questionNumber} · {q.maxMarks}m
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>

              {/* Main workspace: question | work — side by side on lg+ */}
              <div className="grid gap-2.5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:max-h-[min(42vh,380px)] lg:overflow-hidden">
                {/* Left: question */}
                <div className="flex min-h-0 flex-col gap-2.5 lg:overflow-hidden">
                  {selected ? (
                    <article className="flex min-h-0 flex-1 flex-col rounded-xl border border-ink/10 bg-white lg:overflow-hidden">
                      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/8 px-3 py-2 sm:px-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              aria-label="Previous question"
                              disabled={questionIndex <= 0}
                              onClick={() => {
                                const prev = filteredQuestions[questionIndex - 1];
                                if (prev) selectQuestion(prev.id);
                              }}
                              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-ink/12 bg-[#faf7f2] text-ink transition hover:border-ink/30 disabled:pointer-events-none disabled:opacity-35"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </button>
                            <p className="min-w-0 truncate text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
                              {formatExerciseLabel(selected.exercise)} · Q
                              {selected.questionNumber} of{" "}
                              {filteredQuestions.length}
                            </p>
                            <button
                              type="button"
                              aria-label="Next question"
                              disabled={
                                questionIndex < 0 ||
                                questionIndex >= filteredQuestions.length - 1
                              }
                              onClick={() => {
                                const next = filteredQuestions[questionIndex + 1];
                                if (next) selectQuestion(next.id);
                              }}
                              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-ink/12 bg-[#faf7f2] text-ink transition hover:border-ink/30 disabled:pointer-events-none disabled:opacity-35"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="mt-0.5 truncate text-[12px] font-semibold text-ink">
                            Ch {selected.chapterNumber} · {selected.chapterName}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full bg-ink px-2 py-0.5 text-[10px] font-bold tabular-nums text-white">
                          {selected.maxMarks} mark
                          {selected.maxMarks === 1 ? "" : "s"} ·{" "}
                          {selected.creditsCost} cr
                        </span>
                      </header>
                      <div className="flex-1 overflow-y-auto px-3 py-3 sm:px-4 sm:py-3.5 lg:min-h-0">
                        <p className="whitespace-pre-wrap text-[14px] leading-[1.65] text-ink sm:text-[15px]">
                          <span className="mr-1.5 font-bold">
                            {selected.questionNumber}.
                          </span>
                          {selected.questionText}
                        </p>
                      </div>
                      <details className="border-t border-ink/8 px-3 py-2 sm:px-4">
                        <summary className="cursor-pointer text-[11px] font-bold text-muted marker:content-none [&::-webkit-details-marker]:hidden">
                          Rubric · {selected.maxMarks} marks
                        </summary>
                        <ul className="mt-1.5 max-h-24 space-y-1 overflow-y-auto pb-1">
                          {selected.rubric.map((s) => (
                            <li
                              key={s.id}
                              className="flex justify-between gap-2 text-[11px]"
                            >
                              <span>
                                <span className="font-bold text-ink">
                                  {s.label}
                                </span>
                                <span className="text-muted"> — {s.criteria}</span>
                              </span>
                              <span className="shrink-0 font-extrabold tabular-nums">
                                {s.marks}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </details>
                    </article>
                  ) : (
                    <div className="rounded-xl border border-ink/10 bg-white p-6 text-center text-sm text-muted">
                      No questions for this selection.
                    </div>
                  )}
                </div>

                {/* Right: photo / text / result */}
                <div className="flex min-h-0 flex-col gap-2.5 lg:overflow-y-auto">
                  {/* Photo panel */}
                  {flowStep !== "graded" ? (
                    <div className="rounded-xl border border-ink/10 bg-white p-3 sm:p-3.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                          {(["Photo", "Text", "Marks"] as const).map((label, i) => (
                            <span
                              key={label}
                              className={cn(
                                "rounded-full px-2 py-0.5 text-[11px] font-bold",
                                i === stepIndex
                                  ? "bg-ink text-white"
                                  : i < stepIndex
                                    ? "bg-sage-wash text-sage"
                                    : "bg-[#faf7f2] text-muted",
                              )}
                            >
                              {i < stepIndex ? "✓" : i + 1} {label}
                            </span>
                          ))}
                        </div>
                        {preview ? (
                          <div className="flex shrink-0 items-center gap-3">
                            <label className="cursor-pointer text-[12px] font-bold text-coral hover:text-coral-dark">
                              Change
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                className="hidden"
                                capture="environment"
                                onChange={(e) => {
                                  void onPickFile(e.target.files?.[0]);
                                  e.target.value = "";
                                }}
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                setPreview(null);
                                clearExtraction();
                              }}
                              className="text-[12px] font-bold text-muted hover:text-ink"
                            >
                              Remove
                            </button>
                          </div>
                        ) : null}
                      </div>

                      <label
                        className={cn(
                          "mt-2 flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-ink/18 bg-[#faf7f2] transition hover:border-coral/40",
                          preview
                            ? "min-h-[88px] px-2 py-1.5"
                            : "min-h-[100px] px-3 py-4 sm:min-h-[110px]",
                        )}
                      >
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          capture="environment"
                          onChange={(e) => {
                            void onPickFile(e.target.files?.[0]);
                            e.target.value = "";
                          }}
                        />
                        {preview ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={preview}
                            alt="Your solution"
                            className="max-h-[120px] w-auto rounded-lg object-contain sm:max-h-[140px]"
                          />
                        ) : (
                          <>
                            <Camera className="h-6 w-6 text-coral" />
                            <p className="mt-1.5 text-[13px] font-bold text-ink">
                              Take or upload photo
                            </p>
                            <p className="mt-0.5 text-[10px] text-muted">
                              JPEG · PNG · WebP · under 8 MB
                            </p>
                          </>
                        )}
                      </label>

                      {preview && flowStep === "upload" ? (
                        <button
                          type="button"
                          disabled={reading || !selected}
                          onClick={() => void handleReadPhoto()}
                          className="mt-2.5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-ink text-[13px] font-bold text-white hover:bg-ink/90 disabled:opacity-50"
                        >
                          {reading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <FileText className="h-4 w-4" />
                          )}
                          {reading ? "Reading…" : "Read photo · free"}
                        </button>
                      ) : null}
                    </div>
                  ) : null}

                  {/* Review text */}
                  {flowStep === "review" ? (
                    <div className="rounded-xl border border-ink/10 bg-white p-3 sm:p-3.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-coral">
                          2 · Digital text
                        </p>
                        {relevance ? (
                          <span
                            className={cn(
                              "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                              relevanceTone(relevance),
                            )}
                          >
                            {relevanceLabel(relevance)}
                          </span>
                        ) : null}
                      </div>
                      {readNotes ? (
                        <p className="mt-1 text-[11px] leading-snug text-muted">
                          {readNotes}
                        </p>
                      ) : null}
                      <textarea
                        value={editTranscript}
                        onChange={(e) => setEditTranscript(e.target.value)}
                        rows={5}
                        spellCheck={false}
                        className="mt-2 w-full resize-y rounded-lg border border-ink/12 bg-[#faf7f2] px-3 py-2 font-mono text-[12px] leading-relaxed text-ink outline-none focus:border-ink/35 focus:ring-2 focus:ring-coral/15 lg:min-h-[100px]"
                        placeholder="Text from your photo…"
                      />
                      <div className="mt-1 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted">
                        <span>
                          {editTranscript.length.toLocaleString()} chars
                          {transcriptDirty ? " · edited" : ""}
                        </span>
                        {transcriptDirty ? (
                          <button
                            type="button"
                            onClick={() =>
                              setEditTranscript(originalTranscript)
                            }
                            className="inline-flex items-center gap-1 font-semibold text-ink"
                          >
                            <RefreshCw className="h-3 w-3" />
                            Reset OCR
                          </button>
                        ) : null}
                      </div>

                      <div className="mt-2.5 hidden gap-2 sm:flex">
                        <button
                          type="button"
                          disabled={reading || !preview}
                          onClick={() => void handleReadPhoto()}
                          className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl border border-ink/15 text-[13px] font-bold text-ink hover:border-ink/30 disabled:opacity-50"
                        >
                          {reading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <RefreshCw className="h-4 w-4" />
                          )}
                          Re-read
                        </button>
                        <button
                          type="button"
                          disabled={grading || !canConfirmGrade}
                          onClick={() => void handleConfirmGrade()}
                          className="inline-flex h-10 flex-[1.5] items-center justify-center gap-1.5 rounded-xl bg-coral text-[13px] font-bold text-white hover:bg-coral-dark disabled:opacity-50"
                        >
                          {grading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Upload className="h-4 w-4" />
                          )}
                          {grading
                            ? "Grading…"
                            : `Confirm & grade · ${selected?.creditsCost ?? 5}`}
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {/* Result */}
                  {flowStep === "graded" && result ? (
                    <div className="rounded-2xl border border-ink/10 bg-white p-3.5 sm:p-5">
                      <div className="flex flex-wrap items-end justify-between gap-3">
                        <div>
                          <p className="inline-flex items-center gap-1.5 text-[12px] font-bold text-sage">
                            <Check className="h-3.5 w-3.5" />
                            Graded
                          </p>
                          <p className="mt-1 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                            {result.evaluation.marksAwarded}
                            <span className="text-lg text-muted">
                              /{result.evaluation.maxMarks}
                            </span>
                          </p>
                          {result.evaluation.relevance ? (
                            <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-muted">
                              {relevanceLabel(result.evaluation.relevance)}
                              {result.evaluation.transcriptEdited
                                ? " · edited"
                                : ""}
                            </p>
                          ) : null}
                        </div>
                        <p className="rounded-full bg-[#faf7f2] px-2.5 py-1 text-[11px] font-bold text-muted">
                          −{result.evaluation.creditsDeducted} credits
                        </p>
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-[auto_1fr]">
                        {preview ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={preview}
                            alt="Graded solution"
                            className="max-h-28 w-auto rounded-lg object-contain"
                          />
                        ) : null}
                        <ul className="space-y-1.5">
                          {result.evaluation.steps.map((s) => (
                            <li
                              key={s.stepId}
                              className={cn(
                                "rounded-xl px-3 py-2 text-[13px]",
                                s.marksAwarded >= s.marksPossible
                                  ? "bg-sage-wash"
                                  : s.marksAwarded > 0
                                    ? "bg-butter/50"
                                    : "bg-coral-wash",
                              )}
                            >
                              <div className="flex justify-between gap-2 font-bold text-ink">
                                <span>{s.label}</span>
                                <span className="tabular-nums">
                                  {s.marksAwarded}/{s.marksPossible}
                                </span>
                              </div>
                              {s.comment ? (
                                <p className="mt-0.5 text-[12px] text-muted">
                                  {s.comment}
                                </p>
                              ) : null}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {result.evaluation.overallFeedback ? (
                        <p className="mt-3 text-[14px] leading-relaxed text-ink">
                          {result.evaluation.overallFeedback}
                        </p>
                      ) : null}

                      <details className="mt-3 rounded-xl bg-[#faf7f2] px-3 py-2">
                        <summary className="cursor-pointer text-[11px] font-bold uppercase tracking-wide text-muted">
                          Text used for marking
                        </summary>
                        <p className="mt-1.5 whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-ink/90">
                          {result.evaluation.transcript}
                        </p>
                      </details>

                      <button
                        type="button"
                        onClick={resetWork}
                        className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-xl bg-ink text-[14px] font-bold text-white hover:bg-ink/90 sm:w-auto sm:px-5"
                      >
                        Grade another photo
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile sticky CTA — review step only */}
        {flowStep === "review" && !catalogLoading ? (
          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-white/95 p-2.5 backdrop-blur sm:hidden">
            <div className={cn(SHELL, "flex gap-2 !px-0")}>
              <button
                type="button"
                disabled={reading || !preview}
                onClick={() => void handleReadPhoto()}
                className="inline-flex h-11 flex-1 items-center justify-center gap-1 rounded-xl border border-ink/15 text-[12px] font-bold text-ink disabled:opacity-50"
              >
                {reading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="h-3.5 w-3.5" />
                )}
                Re-read
              </button>
              <button
                type="button"
                disabled={grading || !canConfirmGrade}
                onClick={() => void handleConfirmGrade()}
                className="inline-flex h-11 flex-[1.6] items-center justify-center gap-1 rounded-xl bg-coral text-[12px] font-bold text-white disabled:opacity-50"
              >
                {grading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Upload className="h-3.5 w-3.5" />
                )}
                Grade · {selected?.creditsCost ?? 5}
              </button>
            </div>
          </div>
        ) : null}
      </main>


      {!user ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-white/95 p-3 backdrop-blur sm:hidden">
          <button
            type="button"
            onClick={requireLogin}
            className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-coral text-[14px] font-bold text-white"
          >
            Log in to grade · 100 free credits
          </button>
        </div>
      ) : null}

      {panelOpen ? (
        <div className="fixed inset-0 z-[90] flex justify-end">
          <button
            type="button"
            className="absolute inset-0 bg-ink/40 transition-opacity"
            aria-label="Close menu"
            onClick={closePanel}
          />
          <aside className="relative z-10 flex h-full w-full max-w-[420px] flex-col bg-white shadow-2xl animate-in fade-in-0 slide-in-from-right duration-200">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-ink/8 px-4 py-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-coral/10 text-coral">
                <Wallet className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-wide text-muted">
                  Snap &amp; Grade
                </p>
                <p className="truncate text-[16px] font-extrabold text-ink">
                  {accountLoading ? "…" : `${credits ?? 0} credits`}
                </p>
              </div>
              <button
                type="button"
                onClick={closePanel}
                className="rounded-full p-2 text-muted hover:bg-[#f3eee6]"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="grid grid-cols-2 gap-1 border-b border-ink/8 bg-[#faf7f2] p-1.5">
              {(
                [
                  ["grades", "Grades", History],
                  ["account", "Account", Wallet],
                ] as const
              ).map(([key, label, Icon]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setPanelTab(key);
                    setHistoryDetail(null);
                  }}
                  className={cn(
                    "inline-flex h-10 items-center justify-center gap-1.5 rounded-xl text-[13px] font-bold transition",
                    panelTab === key
                      ? "bg-white text-ink shadow-sm"
                      : "text-muted hover:text-ink",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              ))}
            </div>

            {/* Body */}
            <div className="min-h-0 flex-1 overflow-y-auto">
              {panelTab === "grades" ? (
                <div className="p-3.5">
                  {historyDetail ? (
                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={() => setHistoryDetail(null)}
                        className="inline-flex items-center gap-1 text-[12px] font-bold text-coral"
                      >
                        <ChevronLeft className="h-3.5 w-3.5" />
                        All grades
                      </button>
                      <p className="text-[11px] font-bold uppercase tracking-wide text-muted">
                        Class {historyDetail.classLevel} · {historyDetail.subject}{" "}
                        · Ch{historyDetail.chapterNumber} · Q
                        {historyDetail.questionNumber}
                      </p>
                      <p className="whitespace-pre-wrap text-[14px] leading-relaxed text-ink">
                        {historyDetail.questionText}
                      </p>
                      <div className="flex items-end justify-between gap-2 rounded-2xl bg-[#faf7f2] px-3.5 py-3">
                        <div>
                          <p className="text-[10px] font-bold uppercase text-muted">
                            Score
                          </p>
                          <p className="text-2xl font-extrabold text-ink">
                            {historyDetail.marksAwarded}/{historyDetail.maxMarks}
                          </p>
                        </div>
                        <p className="text-right text-[11px] text-muted">
                          −{historyDetail.creditsDeducted} cr
                          <br />
                          {new Date(historyDetail.gradedAt).toLocaleString()}
                        </p>
                      </div>
                      {historyDetail.overallFeedback ? (
                        <p className="text-[13px] leading-relaxed text-ink">
                          {historyDetail.overallFeedback}
                        </p>
                      ) : null}
                      <ul className="space-y-1.5">
                        {historyDetail.steps.map((s) => (
                          <li
                            key={s.stepId}
                            className="rounded-xl bg-[#faf7f2] px-3 py-2 text-[12px]"
                          >
                            <div className="flex justify-between font-bold">
                              <span>{s.label}</span>
                              <span>
                                {s.marksAwarded}/{s.marksPossible}
                              </span>
                            </div>
                            {s.comment ? (
                              <p className="mt-0.5 text-muted">{s.comment}</p>
                            ) : null}
                          </li>
                        ))}
                      </ul>
                      {historyDetail.transcript ? (
                        <details className="rounded-xl bg-[#faf7f2] px-3 py-2">
                          <summary className="cursor-pointer text-[11px] font-bold uppercase text-muted">
                            Your solution text
                          </summary>
                          <p className="mt-1.5 whitespace-pre-wrap font-mono text-[11px]">
                            {historyDetail.transcript}
                          </p>
                        </details>
                      ) : null}
                    </div>
                  ) : history.length === 0 ? (
                    <div className="flex flex-col items-center px-4 py-16 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f3eee6] text-muted">
                        <History className="h-6 w-6" />
                      </div>
                      <p className="mt-3 text-[14px] font-bold text-ink">
                        No grades yet
                      </p>
                      <p className="mt-1 text-[12px] text-muted">
                        Graded solutions will show up here.
                      </p>
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      {history.map((h) => (
                        <li key={h.id}>
                          <button
                            type="button"
                            onClick={() => setHistoryDetail(h)}
                            className="flex w-full items-center gap-3 rounded-2xl border border-ink/8 bg-white px-3 py-3 text-left transition hover:border-ink/20 hover:bg-[#faf7f2]"
                          >
                            <span className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl bg-ink text-white">
                              <span className="text-[13px] font-extrabold leading-none tabular-nums">
                                {h.marksAwarded}
                              </span>
                              <span className="text-[9px] font-bold opacity-70">
                                /{h.maxMarks}
                              </span>
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-[13px] font-bold text-ink">
                                Q{h.questionNumber} · Ch{h.chapterNumber} ·{" "}
                                {h.subject}
                              </span>
                              <span className="mt-0.5 block text-[11px] text-muted">
                                −{h.creditsDeducted} cr ·{" "}
                                {new Date(h.gradedAt).toLocaleString()}
                              </span>
                            </span>
                            <ChevronRight className="h-4 w-4 shrink-0 text-muted" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <div className="space-y-4 p-3.5">
                  {/* Balance card */}
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1c1a17] via-[#2a2622] to-[#1a3a32] px-4 py-4 text-white">
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 opacity-[0.14]"
                      style={{
                        backgroundImage:
                          "linear-gradient(rgba(255,255,255,0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.55) 1px, transparent 1px)",
                        backgroundSize: "22px 22px",
                      }}
                    />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full bg-coral/25 blur-2xl"
                    />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -bottom-12 -left-6 h-32 w-32 rounded-full bg-sage/20 blur-2xl"
                    />

                    <div className="relative flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wide text-white/55">
                          Current balance
                        </p>
                        <p className="mt-1 text-3xl font-extrabold tabular-nums tracking-tight">
                          {accountLoading ? "…" : (credits ?? 0)}
                          <span className="ml-1.5 text-[13px] font-bold text-white/65">
                            credits
                          </span>
                        </p>
                      </div>
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10 backdrop-blur-sm">
                        <Wallet className="h-5 w-5 text-white/90" />
                      </span>
                    </div>

                    <div className="relative mt-4 grid grid-cols-3 gap-2">
                      <div className="rounded-xl border border-white/10 bg-white/8 px-2.5 py-2 backdrop-blur-sm">
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-coral/25 text-coral">
                          <ArrowDownLeft className="h-3 w-3" />
                        </span>
                        <p className="mt-1.5 text-[9px] font-bold uppercase tracking-wide text-white/50">
                          Spent
                        </p>
                        <p className="text-[14px] font-extrabold tabular-nums">
                          {totalSpent}
                        </p>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/8 px-2.5 py-2 backdrop-blur-sm">
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-sage/25 text-[#9dcfb8]">
                          <ArrowUpRight className="h-3 w-3" />
                        </span>
                        <p className="mt-1.5 text-[9px] font-bold uppercase tracking-wide text-white/50">
                          Recharged
                        </p>
                        <p className="text-[14px] font-extrabold tabular-nums">
                          {totalRecharged}
                        </p>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/8 px-2.5 py-2 backdrop-blur-sm">
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-butter/25 text-[#f0d48a]">
                          <Gift className="h-3 w-3" />
                        </span>
                        <p className="mt-1.5 text-[9px] font-bold uppercase tracking-wide text-white/50">
                          Free
                        </p>
                        <p className="text-[14px] font-extrabold tabular-nums">
                          {freeCreditsClaimed
                            ? freeCreditsGranted || pricing?.freeCredits || 100
                            : "—"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Recharge */}
                  <div className="rounded-2xl border border-ink/10 bg-white p-3.5">
                    <p className="text-[12px] font-extrabold text-ink">
                      Add credits
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted">
                      ₹{(creditPaise / 100).toFixed(0)} / credit · min{" "}
                      {minRecharge}
                    </p>
                    <label className="mt-3 block text-[11px] font-bold text-muted">
                      Amount
                      <input
                        type="number"
                        min={minRecharge}
                        max={pricing?.maxRecharge ?? 5000}
                        step={1}
                        value={rechargeCredits}
                        onChange={(e) =>
                          setRechargeCredits(Number(e.target.value))
                        }
                        className="mt-1 h-10 w-full rounded-xl border border-ink/12 px-3 text-[14px] font-bold outline-none focus:border-ink/40"
                      />
                    </label>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {[1, 10, 50, 100, 200]
                        .filter((n) => n >= minRecharge)
                        .map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setRechargeCredits(n)}
                            className={cn(
                              "rounded-lg border px-2.5 py-1 text-[12px] font-bold",
                              rechargeCredits === n
                                ? "border-ink bg-ink text-white"
                                : "border-ink/12 text-ink",
                            )}
                          >
                            {n === 1 ? "₹1" : n}
                          </button>
                        ))}
                    </div>
                    <button
                      type="button"
                      disabled={
                        recharging ||
                        !Number.isFinite(rechargeCredits) ||
                        rechargeCredits < minRecharge ||
                        Boolean(pricing && !pricing.paymentsEnabled)
                      }
                      onClick={() => void handleRecharge()}
                      className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-coral text-[14px] font-bold text-white hover:bg-coral-dark disabled:opacity-50"
                    >
                      {recharging ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Wallet className="h-4 w-4" />
                      )}
                      {recharging
                        ? "Opening checkout…"
                        : `Pay ₹${rechargeInr}`}
                    </button>
                    {pricing && !pricing.paymentsEnabled ? (
                      <p className="mt-2 text-center text-[11px] text-muted">
                        Payments temporarily unavailable
                      </p>
                    ) : null}
                  </div>

                  {/* Recharge history */}
                  <div>
                    <p className="mb-2 px-0.5 text-[11px] font-bold uppercase tracking-wide text-muted">
                      Recharge history
                    </p>
                    {recharges.length === 0 ? (
                      <p className="rounded-2xl bg-[#faf7f2] px-4 py-6 text-center text-[12px] text-muted">
                        No recharges yet
                      </p>
                    ) : (
                      <ul className="space-y-1.5">
                        {recharges.map((r) => (
                          <li
                            key={r.orderId}
                            className="flex items-center justify-between gap-3 rounded-xl border border-ink/8 bg-[#faf7f2] px-3 py-2.5"
                          >
                            <div className="min-w-0">
                              <p className="text-[13px] font-bold text-ink">
                                +{r.credits} credits
                              </p>
                              <p className="truncate text-[11px] text-muted">
                                ₹{(r.amountPaise / 100).toFixed(0)} ·{" "}
                                {r.status}
                                {" · "}
                                {new Date(
                                  r.paidAt || r.createdAt,
                                ).toLocaleString()}
                              </p>
                            </div>
                            <span
                              className={cn(
                                "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                                r.status === "paid" || r.status === "captured"
                                  ? "bg-sage-wash text-sage"
                                  : "bg-butter/60 text-ink",
                              )}
                            >
                              {r.status}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Usage from grades */}
                  <div>
                    <p className="mb-2 px-0.5 text-[11px] font-bold uppercase tracking-wide text-muted">
                      Recent credit usage
                    </p>
                    {history.length === 0 ? (
                      <p className="rounded-2xl bg-[#faf7f2] px-4 py-6 text-center text-[12px] text-muted">
                        No usage yet
                      </p>
                    ) : (
                      <ul className="space-y-1.5">
                        {history.slice(0, 12).map((h) => (
                          <li
                            key={`use-${h.id}`}
                            className="flex items-center justify-between gap-2 rounded-xl border border-ink/8 px-3 py-2"
                          >
                            <span className="min-w-0 truncate text-[12px] text-ink">
                              Grade Q{h.questionNumber} · Ch{h.chapterNumber}
                            </span>
                            <span className="shrink-0 text-[12px] font-bold tabular-nums text-coral-dark">
                              −{h.creditsDeducted}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      ) : null}

      <SnapGradeInlineConvert
        loggedIn={Boolean(user)}
        onLogin={requireLogin}
      />
      <SnapGradeSubjectsCta compact />
      <NcertChapterPdfSection
        activeChapter={chapterNumber}
        activeClassLevel={classLevel}
        activeSubject={subject}
        compact
      />
      <SnapGradeFinalCta
        compact
        primaryLabel={
          user ? "Pick another question" : "Log in · 100 free credits"
        }
        primaryHref="#grade-top"
        onPrimaryClick={
          user
            ? undefined
            : () => {
                requireLogin();
              }
        }
        secondaryLabel="Snap & Grade home"
        secondaryHref="/snapandgrade"
      />
      <Footer />
    </>
  );
}
