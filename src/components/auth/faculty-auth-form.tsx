"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { LegalConsentCheckbox } from "@/components/auth/legal-consent-checkbox";
import { trackSignUp } from "@/lib/analytics";
import { resolveAcquisition } from "@/lib/marketing-client";
import { skipsProfiling } from "@/lib/public-browse";
import { syncShortlistAfterAuth } from "@/lib/shortlist";
import { ApiError, authApi, saveToken, type UserRole } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

type Step = "email" | "otp";

const field =
  "mt-1.5 h-11 w-full rounded-md border border-[#e5e2dc] bg-white px-3 text-[15px] text-ink outline-none placeholder:text-[#a39e96] focus:border-ink";

interface FacultyAuthFormProps {
  className?: string;
  variant?: "login" | "signup";
  role?: UserRole;
  /** Path to return to after a parent finishes logging in (e.g. /search) */
  next?: string;
  onComplete?: () => void;
  /** Stay on the current page after a successful code. Used by the ad landing. */
  stay?: boolean;
  /** When `stay` is set, a role mismatch switches the form instead of leaving the page. */
  onSwitchRole?: (role: UserRole) => void;
  /** Compiler popup uses the blue IDE buttons and lets the dialog own the title. */
  tone?: "default" | "compiler";
  onStage?: (stage: { step: Step; mode: "login" | "signup"; email: string }) => void;
}

export function FacultyAuthForm({
  className,
  variant = "login",
  role = "faculty",
  next,
  onComplete,
  stay = false,
  onSwitchRole,
  tone = "default",
  onStage,
}: FacultyAuthFormProps) {
  const { setUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState(() => searchParams?.get("email") ?? "");
  const [sessionId, setSessionId] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [errorCode, setErrorCode] = useState("");
  const [mismatchRole, setMismatchRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  /** Signup only — must be explicitly checked (legal apps do not pre-tick). */
  const [acceptedLegal, setAcceptedLegal] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">(variant ?? "login");

  const base = role === "parent" ? "/parent" : "/faculty";
  const nextSuffix = next ? `?next=${encodeURIComponent(next)}` : "";

  const acquisition = useMemo(() => {
    if (mode !== "signup") return {};
    return resolveAcquisition();
  }, [mode, searchParams]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  useEffect(() => {
    onStage?.({ step, mode, email });
  }, [onStage, step, mode, email]);

  const compiler = tone === "compiler";
  const linkClass = compiler
    ? "font-semibold text-ink underline underline-offset-2 hover:text-[#3d84c6]"
    : "font-semibold text-ink underline underline-offset-2 hover:text-coral";
  const submitClass = compiler
    ? "flex h-10 w-full items-center justify-center gap-2 bg-[#3d84c6] text-[13px] font-bold text-white transition hover:bg-[#2f6fad] disabled:cursor-not-allowed disabled:hover:bg-[#3d84c6]"
    : "flex h-11 w-full items-center justify-center gap-2 rounded-md bg-coral text-[15px] font-semibold text-white transition hover:bg-coral-dark disabled:opacity-60";
  const inputClass = cn(field, compiler && "focus:border-[#3d84c6]");

  const sendOtpRequest = useCallback(async () => {
    setError("");
    setErrorCode("");
    setMismatchRole(null);
    if (mode === "signup" && !acceptedLegal) {
      setError("Please accept the Terms of service and Privacy policy to continue.");
      return;
    }
    setLoading(true);
    try {
      const data = await authApi.sendOtp(
        email.trim(),
        mode,
        role,
        acquisition.registrationSource,
        {
          slug: acquisition.acquisitionSlug,
          kind: acquisition.acquisitionKind,
        },
        mode === "signup" ? { acceptedLegal: true } : undefined,
      );
      setSessionId(data.sessionId);
      setIsNewUser(Boolean(data.isNewUser));
      setStep("otp");
      setCooldown(60);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.data?.code) setErrorCode(String(err.data.code));
        if (err.data?.code === "ROLE_MISMATCH" && err.data?.role) {
          setMismatchRole(err.data.role as UserRole);
        }
        if (err.data?.retryAfter) {
          setCooldown(Number(err.data.retryAfter));
          if (err.data.sessionId) {
            setSessionId(String(err.data.sessionId));
            setStep("otp");
          }
        }
      }
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [email, mode, role, acquisition, acceptedLegal]);

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    await sendOtpRequest();
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await authApi.verifyOtp({
        email: email.trim(),
        sessionId,
        code: otp.trim(),
      });

      saveToken(data.token);
      setUser(data.user);
      if (isNewUser) {
        trackSignUp({ userId: data.user.id, role: data.user.role });
      }
      if (data.user.role === "parent" && data.profileCompleted) {
        await syncShortlistAfterAuth(data.user, setUser);
      }
      onComplete?.();
      if (stay) return;

      if (data.user.role === "parent") {
        const skipProfiling = next && skipsProfiling(next);
        router.push(
          data.profileCompleted || skipProfiling
            ? next || "/search"
            : `/parent/profiling${nextSuffix}`,
        );
      } else {
        const safeNext =
          next && next.startsWith("/") && !next.startsWith("//") ? next : null;
        router.push(
          safeNext && skipsProfiling(safeNext)
            ? safeNext
            : data.profileCompleted
              ? safeNext || "/dashboard"
              : "/profiling",
        );
      }
    } catch (err) {
      if (err instanceof ApiError && err.data?.code) {
        setErrorCode(String(err.data.code));
        if (err.data.code === "ROLE_MISMATCH" && err.data.role) {
          setMismatchRole(err.data.role as UserRole);
        }
      }
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const title =
    step === "otp"
      ? "Enter the code"
      : mode === "signup"
        ? "Create a new account"
        : "Sign in to your account";

  const subtitle =
    step === "email"
      ? mode === "signup"
        ? role === "parent"
          ? "Find trusted tutors near you. Contact free on WhatsApp."
          : "List worldwide. Parents reach you on WhatsApp."
        : null
      : `Sent to ${email}`;

  return (
    <div className={cn("w-full", className)}>
      {compiler ? null : (
      <div className={stay ? "mb-4" : "mb-7"}>
        {stay ? (
          <h2 className="text-xl font-bold tracking-tight text-ink">{title}</h2>
        ) : (
          <h1 className="text-[26px] font-bold tracking-tight text-ink sm:text-[28px]">
            {title}
          </h1>
        )}
        {subtitle && <p className="mt-1.5 text-sm text-muted">{subtitle}</p>}
      </div>
      )}

      {error && (
        <div className="mb-4 text-sm font-medium text-coral-dark">
          <p>{error}</p>
          {errorCode === "EMAIL_EXISTS" &&
            (stay ? (
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError("");
                  setErrorCode("");
                }}
                className={cn("mt-1 inline-block", linkClass)}
              >
                Go to login
              </button>
            ) : (
              <Link
                href={`${base}${nextSuffix}`}
                className={cn("mt-1 inline-block", linkClass)}
              >
                Go to login
              </Link>
            ))}
          {errorCode === "NO_ACCOUNT" &&
            (stay ? (
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setError("");
                  setErrorCode("");
                }}
                className={cn("mt-1 inline-block", linkClass)}
              >
                Create a free account
              </button>
            ) : (
              <Link
                href={`${base}/signup${nextSuffix}`}
                className={cn("mt-1 inline-block", linkClass)}
              >
                Create a free account
              </Link>
            ))}
          {errorCode === "ROLE_MISMATCH" && mismatchRole &&
            (stay && onSwitchRole ? (
              <button
                type="button"
                onClick={() => onSwitchRole(mismatchRole)}
                className={cn("mt-1 inline-block", linkClass)}
              >
                {mismatchRole === "parent" ? "Sign in as a parent" : "Sign in as a tutor"}
              </button>
            ) : (
              <Link
                href={mismatchRole === "parent" ? `/parent${nextSuffix}` : "/faculty"}
                className={cn("mt-1 inline-block", linkClass)}
              >
                {mismatchRole === "parent" ? "Go to parent login" : "Go to tutor login"}
              </Link>
            ))}
        </div>
      )}

      {step === "email" && (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <label className="block">
            <span className="text-[13px] font-semibold text-ink">
              Email address
            </span>
            <input
              type="email"
              required
              autoFocus
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={role === "parent" ? "you@gmail.com" : "you@school.edu"}
              className={inputClass}
            />
          </label>

          {mode === "signup" ? (
            <LegalConsentCheckbox
              checked={acceptedLegal}
              onCheckedChange={setAcceptedLegal}
              linkClassName={linkClass}
            />
          ) : null}

          <button
            type="submit"
            disabled={loading || (mode === "signup" && !acceptedLegal)}
            className={submitClass}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : mode === "signup" ? (
              "Create free account"
            ) : (
              "Sign in"
            )}
          </button>

          <p className="pt-1 text-center text-sm text-muted">
            {mode === "login" ? (
              <>
                Or{" "}
                {stay ? (
                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                    className={linkClass}
                  >
                    create a new account
                  </button>
                ) : (
                  <Link
                    href={`${base}/signup${nextSuffix}`}
                    className={linkClass}
                  >
                    create a new account
                  </Link>
                )}
              </>
            ) : (
              <>
                Already have an account?{" "}
                {stay ? (
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className={linkClass}
                  >
                    Login
                  </button>
                ) : (
                  <Link
                    href={`${base}${nextSuffix}`}
                    className={linkClass}
                  >
                    Login
                  </Link>
                )}
              </>
            )}
          </p>

          <p className="text-center text-xs text-muted">
            We&apos;ll email a one-time code. No password needed.
            {mode === "login" ? (
              <>
                {" "}
                By signing in you continue under our{" "}
                <Link href="/terms" className={linkClass}>
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className={linkClass}>
                  Privacy policy
                </Link>
                .
              </>
            ) : null}
          </p>
        </form>
      )}

      {step === "otp" && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <label className="block">
            <span className="text-[13px] font-semibold text-ink">
              6-digit code
            </span>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              required
              autoFocus
              autoComplete="one-time-code"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="000000"
              className={cn(
                inputClass,
                "h-12 text-center text-xl font-semibold tracking-[0.3em]",
              )}
            />
          </label>
          <button
            type="submit"
            disabled={loading || otp.length < 6}
            className={submitClass}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Continue"
            )}
          </button>
          <div className="flex flex-col gap-2 pt-1 text-center text-sm">
            <button
              type="button"
              disabled={cooldown > 0 || loading}
              onClick={sendOtpRequest}
              className={cn("font-semibold", cooldown > 0 ? "text-muted" : linkClass)}
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep("email");
                setOtp("");
                setError("");
                setErrorCode("");
                setMismatchRole(null);
              }}
              className="text-muted hover:text-ink"
            >
              Use a different email
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
