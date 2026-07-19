"use client";

import { useAuth } from "@/components/auth/auth-provider";
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
}

export function FacultyAuthForm({
  className,
  variant = "login",
  role = "faculty",
  next,
  onComplete,
}: FacultyAuthFormProps) {
  const { setUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [errorCode, setErrorCode] = useState("");
  const [mismatchRole, setMismatchRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const base = role === "parent" ? "/parent" : "/faculty";
  const nextSuffix = next ? `?next=${encodeURIComponent(next)}` : "";

  const registrationSource = useMemo(() => {
    if (variant !== "signup" || typeof window === "undefined") return undefined;
    const ref = searchParams?.get("ref");
    if (!ref) return undefined;
    const url = new URL(window.location.href);
    url.searchParams.set("ref", ref);
    return url.toString();
  }, [variant, searchParams]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const sendOtpRequest = useCallback(async () => {
    setError("");
    setErrorCode("");
    setMismatchRole(null);
    setLoading(true);
    try {
      const data = await authApi.sendOtp(
        email.trim(),
        variant,
        role,
        registrationSource,
      );
      setSessionId(data.sessionId);
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
  }, [email, variant, role, registrationSource]);

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
      onComplete?.();

      if (data.user.role === "parent") {
        router.push(
          data.profileCompleted
            ? next || "/search"
            : `/parent/profiling${nextSuffix}`,
        );
      } else {
        router.push(data.profileCompleted ? "/dashboard" : "/profiling");
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
      : variant === "signup"
        ? "Create a new account"
        : "Sign in to your account";

  const subtitle =
    step === "email"
      ? variant === "signup"
        ? role === "parent"
          ? "Find trusted tutors near you. Contact free on WhatsApp."
          : "List worldwide. Parents reach you on WhatsApp."
        : null
      : `Sent to ${email}`;

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-7">
        <h1 className="text-[26px] font-bold tracking-tight text-ink sm:text-[28px]">
          {title}
        </h1>
        {subtitle && <p className="mt-1.5 text-sm text-muted">{subtitle}</p>}
      </div>

      {error && (
        <div className="mb-4 text-sm font-medium text-coral-dark">
          <p>{error}</p>
          {errorCode === "EMAIL_EXISTS" && (
            <Link
              href={`${base}${nextSuffix}`}
              className="mt-1 inline-block font-semibold text-ink underline underline-offset-2"
            >
              Go to login
            </Link>
          )}
          {errorCode === "NO_ACCOUNT" && (
            <Link
              href={`${base}/signup${nextSuffix}`}
              className="mt-1 inline-block font-semibold text-ink underline underline-offset-2"
            >
              Create a free account
            </Link>
          )}
          {errorCode === "ROLE_MISMATCH" && mismatchRole && (
            <Link
              href={mismatchRole === "parent" ? `/parent${nextSuffix}` : "/faculty"}
              className="mt-1 inline-block font-semibold text-ink underline underline-offset-2"
            >
              {mismatchRole === "parent"
                ? "Go to parent login"
                : "Go to tutor login"}
            </Link>
          )}
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
              className={field}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-coral text-[15px] font-semibold text-white transition hover:bg-coral-dark disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : variant === "signup" ? (
              "Create free account"
            ) : (
              "Sign in"
            )}
          </button>

          <p className="pt-1 text-center text-sm text-muted">
            {variant === "login" ? (
              <>
                Or{" "}
                <Link
                  href={`${base}/signup${nextSuffix}`}
                  className="font-semibold text-ink underline underline-offset-2 hover:text-coral"
                >
                  create a new account
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link
                  href={`${base}${nextSuffix}`}
                  className="font-semibold text-ink underline underline-offset-2 hover:text-coral"
                >
                  Login
                </Link>
              </>
            )}
          </p>

          <p className="text-center text-xs text-muted">
            We&apos;ll email a one-time code. No password needed.
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
                field,
                "h-12 text-center text-xl font-semibold tracking-[0.3em]",
              )}
            />
          </label>
          <button
            type="submit"
            disabled={loading || otp.length < 6}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-coral text-[15px] font-semibold text-white transition hover:bg-coral-dark disabled:opacity-60"
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
              className={cn(
                "font-semibold",
                cooldown > 0 ? "text-muted" : "text-ink underline underline-offset-2",
              )}
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
