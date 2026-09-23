"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-provider";
import { profileApi, type AuthUser } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  BadgeCheck,
  CheckCircle2,
  Clock3,
  Crown,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

const QR_SRC = "/premium-mentor-qr.jpeg";

function ReadFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

function UploadSsDialog({
  open,
  busy,
  error,
  onClose,
  onSubmit,
}: {
  open: boolean;
  busy: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (dataUrl: string, mimeType: string) => void;
}) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [mime, setMime] = useState("image/jpeg");
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setPreview(null);
      setMime("image/jpeg");
      setLocalError(null);
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, busy, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
        aria-label="Dismiss"
        disabled={busy}
        onClick={() => {
          if (!busy) onClose();
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="premium-ss-title"
        className={cn(
          "relative z-10 w-full max-w-md overflow-hidden",
          "rounded-t-2xl border border-hairline bg-white",
          "shadow-[0_20px_50px_rgba(26,35,28,0.18)]",
          "sm:rounded-2xl",
        )}
      >
        <button
          type="button"
          disabled={busy}
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-cream hover:text-ink disabled:opacity-50"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="px-5 pb-5 pt-6 sm:px-6">
          <h2
            id="premium-ss-title"
            className="pr-8 text-lg font-bold tracking-tight text-ink"
          >
            Upload payment screenshot
          </h2>
          <p className="mt-1 text-sm text-muted">
            Attach the PhonePe / UPI success screen so we can verify your payment.
          </p>

          <input
            ref={inputRef}
            id={inputId}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/*"
            className="sr-only"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (!file) return;
              if (!file.type.startsWith("image/")) {
                setLocalError("Please choose an image file");
                return;
              }
              if (file.size > 8 * 1024 * 1024) {
                setLocalError("Image must be under 8 MB");
                return;
              }
              try {
                const dataUrl = await ReadFileAsDataUrl(file);
                setPreview(dataUrl);
                setMime(file.type || "image/jpeg");
                setLocalError(null);
              } catch {
                setLocalError("Could not read that image");
              }
            }}
          />

          <label
            htmlFor={inputId}
            className={cn(
              "mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-hairline bg-cream/60 px-4 py-8 text-center transition hover:border-coral/40 hover:bg-coral-wash/30",
              preview && "py-3",
            )}
          >
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview}
                alt="Payment screenshot preview"
                className="max-h-56 w-auto rounded-lg object-contain"
              />
            ) : (
              <>
                <Upload className="h-6 w-6 text-coral" />
                <span className="text-sm font-semibold text-ink">
                  Tap to choose screenshot
                </span>
                <span className="text-xs text-muted">JPG, PNG, or WebP</span>
              </>
            )}
          </label>

          {(localError || error) && (
            <p className="mt-3 text-sm font-medium text-coral" role="alert">
              {localError || error}
            </p>
          )}

          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={busy}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={busy || !preview}
              onClick={() => {
                if (preview) onSubmit(preview, mime);
              }}
            >
              {busy ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Submitting…
                </>
              ) : (
                "Submit for verification"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function PremiumMentorCard({ className }: { className?: string }) {
  const { user, setUser } = useAuth();
  const [openPay, setOpenPay] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user || user.role !== "faculty") return null;

  const status = user.premiumMentorStatus || "none";

  async function submitSs(dataUrl: string, mimeType: string) {
    setBusy(true);
    setError(null);
    try {
      const res = await profileApi.submitPremiumMentor(dataUrl, mimeType);
      setUser(res.user as AuthUser);
      setUploadOpen(false);
      setOpenPay(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  if (status === "verified") {
    return (
      <section
        className={cn(
          "flex flex-wrap items-center gap-3 rounded-xl border border-sage/30 bg-sage-wash/60 px-4 py-3",
          className,
        )}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-sage text-white">
          <Crown className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-ink">Premium Mentor</p>
          <p className="text-xs text-muted">
            Verified
            {user.premiumMentorVerifiedAt
              ? ` · ${new Date(user.premiumMentorVerifiedAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}`
              : ""}
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-sage">
          <BadgeCheck className="h-3.5 w-3.5" />
          Active
        </span>
      </section>
    );
  }

  if (status === "pending") {
    return (
      <section
        className={cn(
          "flex flex-wrap items-center gap-3 rounded-xl border border-butter/50 bg-butter/20 px-4 py-3",
          className,
        )}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-butter text-ink">
          <Clock3 className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-ink">Premium verification pending</p>
          <p className="text-xs text-muted">
            We received your payment screenshot. You&apos;ll see Premium once
            admin verifies it.
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => {
            setError(null);
            setUploadOpen(true);
          }}
        >
          Re-upload SS
        </Button>
        <UploadSsDialog
          open={uploadOpen}
          busy={busy}
          error={error}
          onClose={() => {
            if (!busy) setUploadOpen(false);
          }}
          onSubmit={submitSs}
        />
      </section>
    );
  }

  return (
    <>
      <section
        className={cn(
          "overflow-hidden rounded-xl border border-hairline bg-white",
          className,
        )}
      >
        <div className="flex flex-wrap items-center gap-3 px-4 py-3 sm:px-5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-coral-wash text-coral">
            <Crown className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-ink">Become a Premium Mentor</p>
            <p className="text-xs text-muted">
              ₹949 for 2 months (~$10) · pay via QR, upload screenshot, get verified.
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={() => setOpenPay((v) => !v)}
          >
            {openPay ? "Hide QR" : "Become Premium"}
          </Button>
        </div>

        {openPay ? (
          <div className="border-t border-hairline bg-cream/40 px-4 py-5 sm:px-5">
            <div className="mx-auto max-w-sm text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                Scan with PhonePe / any UPI app
              </p>
              <p className="mt-2 text-2xl font-bold tracking-tight text-ink">
                ₹949<span className="text-base font-semibold text-muted">/-</span>
              </p>
              <p className="mt-0.5 text-sm font-medium text-ink">
                2 months Premium
              </p>
              <p className="mt-0.5 text-xs text-muted">≈ $10</p>
            </div>
            <div className="mx-auto mt-3 w-full max-w-[240px] overflow-hidden rounded-xl border border-hairline bg-white p-3 shadow-sm">
              <Image
                src={QR_SRC}
                alt="Premium Mentor payment QR code"
                width={720}
                height={611}
                className="h-auto w-full"
                priority={false}
              />
            </div>
            <p className="mx-auto mt-3 max-w-sm text-center text-[11px] text-muted">
              Pay <span className="font-semibold text-ink">₹949</span> for{" "}
              <span className="font-semibold text-ink">2 months</span> of Premium
              Mentor access (~$10).
            </p>
            <div className="mx-auto mt-4 flex max-w-sm flex-col gap-2">
              <Button
                type="button"
                className="w-full"
                onClick={() => {
                  setError(null);
                  setUploadOpen(true);
                }}
              >
                <CheckCircle2 className="h-4 w-4" />
                Payment completed
              </Button>
              <p className="text-center text-[11px] text-muted">
                After paying, tap above and upload your payment screenshot.
              </p>
            </div>
          </div>
        ) : null}
      </section>

      <UploadSsDialog
        open={uploadOpen}
        busy={busy}
        error={error}
        onClose={() => {
          if (!busy) setUploadOpen(false);
        }}
        onSubmit={submitSs}
      />
    </>
  );
}
