"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { LearnDino } from "@/components/landing/lp/learn-dino";
import {
  downloadReceiptForEnrollment,
  enrollInMentrStarter,
  LEARN_APP_HREF,
  LEARN_COURSE_NAME,
  LEARN_COURSE_TAGLINE,
  type LearnEnrollmentDto,
} from "@/lib/learn-enroll";
import { resolveAcquisition } from "@/lib/marketing-client";
import { ApiError, authApi, saveToken, type UserRole } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Check,
  Download,
  Loader2,
  LogOut,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

type Phase = "auth" | "wrong-role" | "enrolling" | "enroll-error" | "success";
type AuthTab = "signup" | "login";
type AuthStep = "email" | "otp";

type LearnEnrollModalProps = {
  open: boolean;
  onClose: () => void;
  onEnrolled?: () => void;
};

export function LearnEnrollModal({
  open,
  onClose,
  onEnrolled,
}: LearnEnrollModalProps) {
  const { user, loading: authLoading, setUser, logout } = useAuth();
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("auth");
  const [tab, setTab] = useState<AuthTab>("signup");
  const [step, setStep] = useState<AuthStep>("email");
  const [email, setEmail] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [enrollment, setEnrollment] = useState<LearnEnrollmentDto | null>(null);
  const [enrollAttemptedFor, setEnrollAttemptedFor] = useState<string | null>(
    null,
  );

  const acquisition = useMemo(() => resolveAcquisition(), []);

  useEffect(() => {
    if (!open) return;
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
  }, [open, onClose]);

  useEffect(() => {
    if (!open || authLoading) return;
    if (!user) {
      setPhase("auth");
      setEnrollAttemptedFor(null);
      return;
    }
    if (user.role !== "parent") {
      setPhase("wrong-role");
      return;
    }
    if (enrollAttemptedFor === user.id && (enrollment || phase === "success")) {
      return;
    }
    if (enrollAttemptedFor === user.id && phase === "enrolling") return;
    setEnrollAttemptedFor(user.id);
    void completeEnrollment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, authLoading, user?.id, user?.role]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  useEffect(() => {
    if (!open) {
      setTab("signup");
      setStep("email");
      setEmail("");
      setSessionId("");
      setOtp("");
      setError("");
      setBusy(false);
      setCooldown(0);
      setEnrollment(null);
      setEnrollAttemptedFor(null);
    }
  }, [open]);

  async function completeEnrollment() {
    setPhase("enrolling");
    setError("");
    try {
      const data = await enrollInMentrStarter();
      setEnrollment(data.enrollment);
      onEnrolled?.();
      setPhase("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Enrollment failed");
      setPhase("enroll-error");
    }
  }

  async function sendOtp() {
    setError("");
    setBusy(true);
    try {
      const data = await authApi.sendOtp(
        email.trim(),
        tab,
        "parent",
        acquisition.registrationSource,
        {
          slug: acquisition.acquisitionSlug,
          kind: acquisition.acquisitionKind,
        },
      );
      setSessionId(data.sessionId);
      setStep("otp");
      setCooldown(60);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send code");
      if (err instanceof ApiError && err.data?.retryAfter) {
        setCooldown(Number(err.data.retryAfter));
      }
    } finally {
      setBusy(false);
    }
  }

  async function verifyOtp() {
    setError("");
    setBusy(true);
    try {
      const data = await authApi.verifyOtp({
        email: email.trim(),
        sessionId,
        code: otp.trim(),
      });
      saveToken(data.token);
      setUser(data.user);
      if (data.user.role !== "parent") {
        setPhase("wrong-role");
        return;
      }
      setBusy(false);
      await completeEnrollment();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid code");
      setBusy(false);
    }
  }

  async function handleLogoutThenAuth() {
    setBusy(true);
    try {
      await logout();
      setPhase("auth");
      setTab("signup");
      setStep("email");
    } finally {
      setBusy(false);
    }
  }

  function goToLms() {
    onClose();
    router.push(LEARN_APP_HREF);
  }

  function handleDownloadReceipt() {
    if (!enrollment || !user) return;
    downloadReceiptForEnrollment(enrollment, {
      name: user.parentProfile?.name || "",
      email: user.email,
      userId: user.id,
    });
  }

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="learn-enroll-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[#1c2434]/45 backdrop-blur-[2px]"
        aria-label="Close"
        onClick={onClose}
      />

      <div className="relative z-10 max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-3xl border border-[#e8e2d8] bg-white shadow-[0_24px_64px_rgba(28,36,52,0.2)] sm:rounded-3xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full text-[#8a929c] hover:bg-[#f6f4ef]"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {authLoading || phase === "enrolling" ? (
          <div className="flex flex-col items-center justify-center gap-4 px-6 py-14 sm:py-16">
            <div className="learn-enroll-pulse" aria-hidden>
              <span className="learn-enroll-pulse__ring" />
              <span className="learn-enroll-pulse__ring" />
              <div className="learn-enroll-pulse__core">
                <LearnDino size={40} className="h-10 w-10" />
              </div>
            </div>
            <div className="text-center">
              <p
                id="learn-enroll-title"
                className="text-[1.05rem] font-extrabold tracking-tight text-[#1c2434]"
              >
                {phase === "enrolling" ? "Enrolling you" : "Loading"}
              </p>
              <p className="mt-1.5 flex items-center justify-center gap-1.5 text-[13px] font-semibold text-[#5a6472]">
                {phase === "enrolling"
                  ? "Unlocking Mentr Starter"
                  : "Checking your account"}
                <span className="learn-enroll-dots ml-0.5 inline-flex gap-1">
                  <span />
                  <span />
                  <span />
                </span>
              </p>
            </div>
            {phase === "enrolling" ? (
              <div className="mt-1 w-full max-w-[200px]">
                <div className="h-1.5 overflow-hidden rounded-full bg-[#e8f5f2]">
                  <div className="h-full w-2/3 animate-pulse rounded-full bg-[#0d9488]" />
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        {!authLoading && phase === "enroll-error" ? (
          <div className="px-5 pb-6 pt-6 sm:px-7 sm:pt-7">
            <h2
              id="learn-enroll-title"
              className="pr-8 text-[1.35rem] font-extrabold tracking-tight text-[#1c2434]"
            >
              Couldn&apos;t enroll
            </h2>
            <p className="mt-2 text-[14px] font-medium text-[#c2410c]">
              {error || "Something went wrong. Please try again."}
            </p>
            <button
              type="button"
              onClick={() => {
                setEnrollAttemptedFor(null);
                void completeEnrollment();
              }}
              className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#ff6a1a] text-[15px] font-extrabold text-white"
            >
              Try again
            </button>
          </div>
        ) : null}

        {!authLoading && phase === "auth" ? (
          <div className="px-5 pb-6 pt-6 sm:px-7 sm:pt-7">
            <div className="flex items-center gap-3 pr-8">
              <LearnDino size={44} className="h-11 w-11 shrink-0" />
              <div>
                <p className="text-[12px] font-bold uppercase tracking-wider text-[#ff6a1a]">
                  Parent account
                </p>
                <h2
                  id="learn-enroll-title"
                  className="text-[1.35rem] font-extrabold tracking-tight text-[#1c2434]"
                >
                  Enroll in {LEARN_COURSE_NAME}
                </h2>
              </div>
            </div>
            <p className="mt-2 text-[13px] font-medium text-[#5a6472]">
              {LEARN_COURSE_TAGLINE}. Sign in as a parent — then your child can
              open the learning app.
            </p>

            {error ? (
              <p className="mt-4 text-[13px] font-semibold text-[#c2410c]">
                {error}
              </p>
            ) : null}

            <div className="mt-5 grid grid-cols-2 gap-1 rounded-2xl bg-[#f3f0ea] p-1">
              {(
                [
                  { id: "signup" as const, label: "Sign up" },
                  { id: "login" as const, label: "Log in" },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setTab(t.id);
                    setStep("email");
                    setError("");
                    setOtp("");
                  }}
                  className={cn(
                    "rounded-xl py-2.5 text-[13px] font-bold transition",
                    tab === t.id
                      ? "bg-white text-[#1c2434] shadow-sm"
                      : "text-[#8a929c]",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {step === "email" ? (
              <form
                className="mt-4 space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  void sendOtp();
                }}
              >
                <label className="block">
                  <span className="text-[12px] font-bold text-[#5a6472]">
                    Parent email
                  </span>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="mt-1.5 h-12 w-full rounded-xl border border-[#e8e2d8] bg-white px-3.5 text-[15px] text-[#1c2434] outline-none placeholder:text-[#a39e96] focus:border-[#1c2434]"
                  />
                </label>
                <button
                  type="submit"
                  disabled={busy || !email.trim()}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#ff6a1a] text-[15px] font-extrabold text-white transition hover:bg-[#e55d12] disabled:opacity-60"
                >
                  {busy ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Continue with email
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form
                className="mt-4 space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  void verifyOtp();
                }}
              >
                <p className="text-[13px] font-medium text-[#5a6472]">
                  Code sent to{" "}
                  <span className="font-bold text-[#1c2434]">{email}</span>
                </p>
                <label className="block">
                  <span className="text-[12px] font-bold text-[#5a6472]">
                    6-digit code
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    required
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="••••••"
                    className="mt-1.5 h-12 w-full rounded-xl border border-[#e8e2d8] bg-white px-3.5 text-center text-[20px] font-bold tracking-[0.35em] text-[#1c2434] outline-none focus:border-[#1c2434]"
                  />
                </label>
                <button
                  type="submit"
                  disabled={busy || otp.length < 4}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#ff6a1a] text-[15px] font-extrabold text-white transition hover:bg-[#e55d12] disabled:opacity-60"
                >
                  {busy ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "Verify & enroll"
                  )}
                </button>
                <div className="flex items-center justify-between gap-2 text-[12px] font-semibold">
                  <button
                    type="button"
                    className="text-[#8a929c] hover:text-[#1c2434]"
                    onClick={() => {
                      setStep("email");
                      setOtp("");
                      setError("");
                    }}
                  >
                    ← Change email
                  </button>
                  <button
                    type="button"
                    disabled={busy || cooldown > 0}
                    className="text-[#ff6a1a] disabled:text-[#a39e96]"
                    onClick={() => void sendOtp()}
                  >
                    {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : null}

        {!authLoading && phase === "wrong-role" ? (
          <div className="px-5 pb-6 pt-6 sm:px-7 sm:pt-7">
            <h2
              id="learn-enroll-title"
              className="pr-8 text-[1.35rem] font-extrabold tracking-tight text-[#1c2434]"
            >
              Switch to a parent account
            </h2>
            <p className="mt-2 text-[14px] font-medium leading-relaxed text-[#5a6472]">
              You&apos;re signed in as a{" "}
              <span className="font-bold text-[#1c2434]">
                {(user?.role as UserRole) === "parent" ? "parent" : "tutor"}
              </span>
              . Mentr Learn enrollment is for parents (who open the app for
              their child).
            </p>
            <div className="mt-5 space-y-2.5">
              <button
                type="button"
                disabled={busy}
                onClick={() => void handleLogoutThenAuth()}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#1c2434] text-[15px] font-extrabold text-white"
              >
                {busy ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <LogOut className="h-4 w-4" />
                    Log out &amp; continue as parent
                  </>
                )}
              </button>
              <Link
                href="/faculty"
                onClick={onClose}
                className="inline-flex h-11 w-full items-center justify-center rounded-2xl border border-[#e8e2d8] text-[13px] font-bold text-[#5a6472]"
              >
                Stay on tutor dashboard
              </Link>
            </div>
          </div>
        ) : null}

        {!authLoading && phase === "success" ? (
          <div className="px-5 pb-7 pt-8 text-center sm:px-7">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e6f7f4] ring-4 ring-[#0d9488]/15">
              <Check className="h-8 w-8 text-[#0d9488]" strokeWidth={2.75} />
            </div>
            <p className="mt-5 text-[12px] font-bold uppercase tracking-wider text-[#0d9488]">
              You&apos;re enrolled
            </p>
            <h2
              id="learn-enroll-title"
              className="mt-1 text-[1.45rem] font-extrabold tracking-tight text-[#1c2434]"
            >
              {LEARN_COURSE_NAME}
            </h2>
            <p className="mt-2 text-[14px] font-medium text-[#5a6472]">
              {LEARN_COURSE_TAGLINE}
            </p>
            {enrollment?.receiptNumber ? (
              <p className="mt-2 text-[12px] font-semibold text-[#8a929c]">
                Receipt {enrollment.receiptNumber}
              </p>
            ) : null}
            <p className="mx-auto mt-3 max-w-sm text-[13px] leading-relaxed text-[#8a929c]">
              Your child can start Module A1 now — Watch → Quiz → Play in the
              learning app.
            </p>

            <div className="mt-6 space-y-2.5">
              <button
                type="button"
                onClick={goToLms}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#ff6a1a] text-[15px] font-extrabold text-white shadow-[3px_3px_0_0_#1c2434]"
              >
                Open learning app
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleDownloadReceipt}
                disabled={!enrollment}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-[#e8e2d8] bg-white text-[13px] font-bold text-[#1c2434] disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                Download enrollment receipt
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
