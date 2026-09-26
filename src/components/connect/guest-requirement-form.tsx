"use client";

import { ApiError, guestRequirementsApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Check, Loader2, Send, ShieldCheck, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { GuestPremiumConnect } from "@/components/auth/auth-provider";

const DESC_MIN = 10;
const DESC_MAX = 1000;

/**
 * Guest form: send a need to a Premium mentor without creating an account.
 */
export function GuestRequirementForm({
  teacher,
  onClose,
}: {
  teacher: GuestPremiumConnect;
  onClose: () => void;
}) {
  const firstName = teacher.teacherName.split(" ")[0] || "mentor";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [requirement, setRequirement] = useState(
    teacher.subjectLine?.trim() || "",
  );
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  async function handleSend() {
    if (!name.trim()) {
      setError("Add your name");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email");
      return;
    }
    if (!/^\+?[\d\s-]{10,15}$/.test(phone.trim())) {
      setError("Enter a valid phone number");
      return;
    }
    if (requirement.trim().length < 3) {
      setError("Add what you need — subject and class help");
      return;
    }
    if (description.trim().length < DESC_MIN) {
      setError(
        `Add at least ${DESC_MIN} characters so ${firstName} knows the details`,
      );
      return;
    }

    setError("");
    setSending(true);
    try {
      await guestRequirementsApi.send({
        teacherId: teacher.teacherId,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        requirement: requirement.trim(),
        description: description.trim(),
      });
      setSent(true);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not send. Try again.",
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[110] flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="guest-req-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-ink/40"
        aria-label="Close"
        onClick={onClose}
      />

      <div className="champs-pop relative z-10 max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-xl border border-hairline bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-xl sm:rounded-xl sm:p-6 sm:pb-6">
        {sent ? (
          <div className="py-4 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sage-wash">
              <Check className="h-6 w-6 text-sage" />
            </span>
            <h2 className="mt-4 text-lg font-bold text-ink">Sent to {firstName}</h2>
            <p className="mx-auto mt-1.5 max-w-[320px] text-sm leading-relaxed text-muted">
              {firstName} can call or email you directly. Fees, schedule, and
              class details stay between you two — Mentr takes no cut.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-5 inline-flex h-10 items-center justify-center rounded-md bg-ink px-6 text-sm font-semibold text-white transition hover:bg-ink/85"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2
                  id="guest-req-title"
                  className="text-lg font-bold text-ink"
                >
                  Send need to {firstName}
                </h2>
                <p className="mt-0.5 text-xs text-muted">
                  No signup. They get your name, phone, and email.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-cream"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 flex items-start gap-2.5 rounded-lg bg-butter/50 px-3.5 py-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-ink/70" />
              <p className="text-[12px] leading-relaxed text-ink/85">
                <span className="font-semibold text-ink">
                  Mentr connects you free.
                </span>{" "}
                No platform fee, no cut on tutor fees. Final fee, schedule, and
                class mode stay between you and {firstName}.
              </p>
            </div>

            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="mb-1 block text-[12px] font-semibold text-ink">
                  Your name
                </span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  placeholder="Parent / student name"
                  className="h-10 w-full rounded-md border border-hairline px-3 text-sm text-ink outline-none focus:border-ink/40"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-[12px] font-semibold text-ink">
                  Email
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  placeholder="you@email.com"
                  className="h-10 w-full rounded-md border border-hairline px-3 text-sm text-ink outline-none focus:border-ink/40"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-[12px] font-semibold text-ink">
                  Phone
                </span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="+91 98xxxxxxxx"
                  className="h-10 w-full rounded-md border border-hairline px-3 text-sm text-ink outline-none focus:border-ink/40"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1 block text-[12px] font-semibold text-ink">
                  Requirement
                </span>
                <input
                  value={requirement}
                  onChange={(e) => setRequirement(e.target.value.slice(0, 120))}
                  placeholder="e.g. Class 10 Maths · weekends"
                  className="h-10 w-full rounded-md border border-hairline px-3 text-sm text-ink outline-none focus:border-ink/40"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1.5 flex items-baseline justify-between text-[12px] font-semibold text-ink">
                  Details
                  <span
                    className={cn(
                      "text-[11px] font-medium tabular-nums",
                      description.length > DESC_MAX
                        ? "text-coral-dark"
                        : "text-muted",
                    )}
                  >
                    {description.length}/{DESC_MAX}
                  </span>
                </span>
                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value.slice(0, DESC_MAX))
                  }
                  rows={4}
                  placeholder="Board, timings, location or online, and anything else they should know."
                  className="w-full resize-none rounded-md border border-hairline bg-white px-3.5 py-3 text-sm leading-relaxed text-ink outline-none transition placeholder:text-muted/70 focus:border-ink/40"
                />
              </label>
            </div>

            {error ? (
              <p className="mt-3 rounded-md border border-coral/40 bg-coral-wash px-3 py-2 text-[13px] font-medium text-coral-dark">
                {error}
              </p>
            ) : null}

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={sending}
                className="flex h-11 flex-1 items-center justify-center rounded-md border border-hairline bg-white text-sm font-semibold text-ink transition hover:bg-cream disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleSend()}
                disabled={sending}
                className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-md bg-coral text-sm font-semibold text-white transition hover:bg-coral-dark disabled:opacity-50"
              >
                {sending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {sending ? "Sending…" : "Send requirement"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
