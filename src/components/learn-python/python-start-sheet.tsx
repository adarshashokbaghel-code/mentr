"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { LegalConsentCheckbox } from "@/components/auth/legal-consent-checkbox";
import { PythonBadge } from "@/components/learn-python/python-badge";
import { ApiError, authApi, saveToken, type UserRole } from "@/lib/api";
import { resolveAcquisition } from "@/lib/marketing-client";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Check, GraduationCap, Loader2, Users, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Tab = "signup" | "login";

const PERKS = ["10 lessons, self-paced", "Run real Python in your browser", "Progress saved as you go"];

export function PythonStartSheet({
  open,
  onClose,
  onSignedIn,
}: {
  open: boolean;
  onClose: () => void;
  onSignedIn: () => void;
}) {
  const { setUser } = useAuth();
  const [tab, setTab] = useState<Tab>("signup");
  const [role, setRole] = useState<UserRole>("parent");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [otp, setOtp] = useState("");
  const [acceptedLegal, setAcceptedLegal] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const acquisition = useMemo(() => resolveAcquisition(), []);
  const emailRef = useRef<HTMLInputElement>(null);
  const otpRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => emailRef.current?.focus(), 260);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      clearTimeout(t);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  async function sendOtp(opts: { tab?: Tab; role?: UserRole; retried?: boolean } = {}) {
    const useTab = opts.tab ?? tab;
    const useRole = opts.role ?? role;
    setError("");
    if (useTab === "signup" && !acceptedLegal) {
      setError("Tick the box to accept the Terms and Privacy policy.");
      return;
    }
    setBusy(true);
    try {
      const data = await authApi.sendOtp(
        email.trim(),
        useTab,
        useRole,
        acquisition.registrationSource,
        { slug: acquisition.acquisitionSlug, kind: acquisition.acquisitionKind },
        useTab === "signup" ? { acceptedLegal: true } : undefined,
      );
      setSessionId(data.sessionId);
      setStep("otp");
      setCooldown(60);
      setTimeout(() => otpRef.current?.focus(), 50);
    } catch (err) {
      const code = err instanceof ApiError ? String(err.data?.code ?? "") : "";
      if (!opts.retried && code === "EMAIL_EXISTS") {
        setTab("login");
        setNote("You already have an account, so we’re logging you in.");
        setBusy(false);
        return sendOtp({ tab: "login", role: useRole, retried: true });
      }
      if (!opts.retried && code === "ROLE_MISMATCH" && err instanceof ApiError && err.data?.role) {
        const actual = err.data.role as UserRole;
        setRole(actual);
        setTab("login");
        setNote(`This email has a ${actual === "faculty" ? "tutor" : "parent"} account, so we’re logging you in with it.`);
        setBusy(false);
        return sendOtp({ tab: "login", role: actual, retried: true });
      }
      if (code === "NO_ACCOUNT") {
        setTab("signup");
        setNote("");
        setError("No account with this email yet. Accept the terms below to create one.");
      } else {
        setError(err instanceof Error ? err.message : "Couldn’t send the code. Try again.");
      }
      if (err instanceof ApiError && err.data?.retryAfter) setCooldown(Number(err.data.retryAfter));
    } finally {
      setBusy(false);
    }
  }

  async function verifyOtp() {
    setError("");
    setBusy(true);
    try {
      const data = await authApi.verifyOtp({ email: email.trim(), sessionId, code: otp.trim() });
      saveToken(data.token);
      setUser(data.user);
      onSignedIn();
    } catch (err) {
      setError(err instanceof Error ? err.message : "That code didn’t work.");
      setBusy(false);
    }
  }

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="py-start-title"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="py-fade absolute inset-0 bg-[#0b100d]/60 backdrop-blur-[3px]"
      />

      <div className="py-sheet-up relative z-10 flex max-h-[94dvh] w-full max-w-[440px] flex-col overflow-hidden border border-[#1f2a23] bg-white shadow-[0_-12px_60px_rgba(0,0,0,0.35)] sm:shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
        <div className="relative shrink-0 overflow-hidden bg-[#0f1612] px-5 pb-5 pt-3 text-white sm:px-6 sm:pt-5">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:22px_22px]"
          />
          <span className="mx-auto mb-3 block h-1 w-10 bg-white/20 sm:hidden" aria-hidden />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center text-white/50 transition hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="relative flex items-center gap-4">
            <PythonBadge tier="beginner" idSuffix="sheet" className="w-[62px] shrink-0" />
            <div className="min-w-0 pr-6">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#5ee0a0]">10 lessons · certificate · no card</p>
              <h2 id="py-start-title" className="mt-1 text-[20px] font-extrabold leading-tight sm:text-[22px]">
                {step === "otp" ? "Check your email" : "Start Python Beginner"}
              </h2>
            </div>
          </div>
          {step === "email" && (
            <ul className="relative mt-4 flex flex-wrap gap-x-4 gap-y-1.5">
              {PERKS.map((p) => (
                <li key={p} className="flex items-center gap-1.5 text-[12.5px] text-white/70">
                  <Check className="h-3.5 w-3.5 text-[#5ee0a0]" strokeWidth={3} /> {p}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="overflow-y-auto px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5 sm:px-6 sm:pb-6">
          {step === "email" ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void sendOtp();
              }}
            >
              <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">I am a</p>
              <div className="mt-2 grid grid-cols-2 border border-hairline">
                {(
                  [
                    { id: "parent", label: "Parent / student", icon: Users },
                    { id: "faculty", label: "Tutor", icon: GraduationCap },
                  ] as const
                ).map((r, i) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => {
                      setRole(r.id);
                      setError("");
                      setNote("");
                    }}
                    aria-pressed={role === r.id}
                    className={cn(
                      "flex items-center justify-center gap-2 py-2.5 text-[13.5px] font-bold transition",
                      i > 0 && "border-l border-hairline",
                      role === r.id ? "bg-ink text-white" : "text-muted hover:text-ink",
                    )}
                  >
                    <r.icon className="h-4 w-4" /> {r.label}
                  </button>
                ))}
              </div>

              <label className="mt-4 block">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">Email</span>
                <input
                  ref={emailRef}
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="mt-2 h-12 w-full border border-hairline bg-white px-3.5 text-[16px] text-ink outline-none transition placeholder:text-[#a39e96] focus:border-ink"
                />
              </label>

              {tab === "signup" && (
                <LegalConsentCheckbox
                  id="py-legal-consent"
                  checked={acceptedLegal}
                  onCheckedChange={setAcceptedLegal}
                  className="mt-3.5"
                />
              )}

              {note && <p className="mt-3 text-[13px] font-semibold text-[#2f7a55]">{note}</p>}
              {error && <p className="mt-3 text-[13px] font-semibold text-[#c2410c]">{error}</p>}

              <button
                type="submit"
                disabled={busy || !email.trim() || (tab === "signup" && !acceptedLegal)}
                className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 bg-coral text-[15px] font-bold text-ink transition hover:bg-coral-dark hover:text-white disabled:cursor-not-allowed disabled:opacity-55"
              >
                {busy ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    {tab === "signup" ? "Get my code" : "Send login code"} <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <p className="mt-4 text-center text-[13px] text-muted">
                {tab === "signup" ? "Already have an account?" : "New to Mentr?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setTab(tab === "signup" ? "login" : "signup");
                    setError("");
                    setNote("");
                  }}
                  className="font-bold text-ink underline underline-offset-4"
                >
                  {tab === "signup" ? "Log in" : "Create a free account"}
                </button>
              </p>
            </form>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void verifyOtp();
              }}
            >
              <p className="text-[14px] text-muted">
                We sent a code to <span className="font-bold text-ink">{email}</span>
              </p>
              {note && <p className="mt-2 text-[13px] font-semibold text-[#2f7a55]">{note}</p>}
              <label className="mt-4 block">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">6-digit code</span>
                <input
                  ref={otpRef}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="••••••"
                  className="mt-2 h-14 w-full border border-hairline bg-white px-3.5 text-center font-mono text-[24px] font-semibold tracking-[0.5em] text-ink outline-none transition focus:border-ink"
                />
              </label>
              {error && <p className="mt-3 text-[13px] font-semibold text-[#c2410c]">{error}</p>}
              <button
                type="submit"
                disabled={busy || otp.length < 4}
                className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 bg-[#2f9e6e] text-[15px] font-bold text-white transition hover:bg-[#278a5f] disabled:cursor-not-allowed disabled:opacity-55"
              >
                {busy ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Verify & start Lesson 1 <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
              <div className="mt-4 flex items-center justify-between text-[13px] font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setOtp("");
                    setError("");
                  }}
                  className="inline-flex items-center gap-1 text-muted hover:text-ink"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Change email
                </button>
                <button
                  type="button"
                  disabled={busy || cooldown > 0}
                  onClick={() => void sendOtp({ retried: true })}
                  className="text-coral-dark disabled:text-muted/60"
                >
                  {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
