"use client";

import { Button } from "@/components/ui/button";
import { hardShadowSm } from "@/components/landing/lp/shared";
import {
  CONTACT_KINDS,
  FEEDBACK_TYPES,
  INTERACTION_CITIES,
  INTERACTION_ROLES,
  type ContactKindId,
  type FeedbackTypeId,
  type InteractionRoleId,
} from "@/lib/user-interaction";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Check, Loader2, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const DRAFT_KEY = "mentr_feedback_draft";

const STEPS = [
  { id: 0, label: "You & type", sub: "Contact type + details" },
  { id: 1, label: "Your message", sub: "Feedback, feature, or review" },
] as const;

const field =
  "mt-1.5 h-11 w-full rounded-lg border-2 border-ink/10 bg-white px-3 text-sm font-medium text-ink outline-none placeholder:text-muted/70 focus:border-ink/40 focus:ring-2 focus:ring-ink/5";
const area =
  "mt-1.5 w-full resize-none rounded-lg border-2 border-ink/10 bg-white px-3 py-2.5 text-sm leading-relaxed text-ink outline-none placeholder:text-muted/70 focus:border-ink/40 focus:ring-2 focus:ring-ink/5";

const KIND_PANEL: Record<
  ContactKindId,
  { title: string; panel: string }
> = {
  feedback: {
    title: "Share your feedback",
    panel: "border-coral/25 bg-coral-wash/40",
  },
  feature: {
    title: "Request a feature",
    panel: "border-lavender bg-lavender/35",
  },
  review: {
    title: "Review Mentr",
    panel: "border-butter/60 bg-butter/35",
  },
};

type Draft = {
  step: number;
  contactKind: ContactKindId;
  name: string;
  email: string;
  city: string;
  role: InteractionRoleId;
  feedbackType: FeedbackTypeId;
  feedback: string;
  featureTitle: string;
  featureDescription: string;
  rating: number;
  review: string;
};

function loadDraft(page: string): Partial<Draft> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`${DRAFT_KEY}:${page}`);
    return raw ? (JSON.parse(raw) as Partial<Draft>) : null;
  } catch {
    return null;
  }
}

function saveDraft(page: string, draft: Draft) {
  try {
    localStorage.setItem(`${DRAFT_KEY}:${page}`, JSON.stringify(draft));
  } catch {
    /* ignore */
  }
}

function clearDraft(page: string) {
  try {
    localStorage.removeItem(`${DRAFT_KEY}:${page}`);
  } catch {
    /* ignore */
  }
}

export function FeedbackForm({
  page,
  contactKind,
  onContactKindChange,
  step,
  onStepChange,
}: {
  page: "/contact" | "/request-feature";
  contactKind: ContactKindId;
  onContactKindChange: (kind: ContactKindId) => void;
  step: number;
  onStepChange: (step: number) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("Bengaluru");
  const [role, setRole] = useState<InteractionRoleId>("parent");
  const [feedbackType, setFeedbackType] = useState<FeedbackTypeId>("general");
  const [feedback, setFeedback] = useState("");
  const [featureTitle, setFeatureTitle] = useState("");
  const [featureDescription, setFeatureDescription] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const draft = loadDraft(page);
    if (draft) {
      if (draft.contactKind) onContactKindChange(draft.contactKind);
      if (typeof draft.step === "number") onStepChange(draft.step);
      if (draft.name) setName(draft.name);
      if (draft.email) setEmail(draft.email);
      if (draft.city) setCity(draft.city);
      if (draft.role) setRole(draft.role);
      if (draft.feedbackType) setFeedbackType(draft.feedbackType);
      if (draft.feedback) setFeedback(draft.feedback);
      if (draft.featureTitle) setFeatureTitle(draft.featureTitle);
      if (draft.featureDescription) setFeatureDescription(draft.featureDescription);
      if (draft.rating) setRating(draft.rating);
      if (draft.review) setReview(draft.review);
    } else if (page === "/request-feature") {
      onContactKindChange("feature");
    }
    setHydrated(true);
  }, [page, onContactKindChange, onStepChange]);

  useEffect(() => {
    if (!hydrated || sent) return;
    saveDraft(page, {
      step,
      contactKind,
      name,
      email,
      city,
      role,
      feedbackType,
      feedback,
      featureTitle,
      featureDescription,
      rating,
      review,
    });
  }, [
    hydrated,
    sent,
    page,
    step,
    contactKind,
    name,
    email,
    city,
    role,
    feedbackType,
    feedback,
    featureTitle,
    featureDescription,
    rating,
    review,
  ]);

  const panel = KIND_PANEL[contactKind];
  const kindMeta = CONTACT_KINDS.find((k) => k.id === contactKind)!;
  const isStep1 = step === 0;
  const isStep2 = step === 1;

  const apiFeedbackType = useMemo((): FeedbackTypeId => {
    if (contactKind === "feature") return "feature";
    if (contactKind === "review") return "review";
    return feedbackType;
  }, [contactKind, feedbackType]);

  function validateStep1(): string | null {
    if (!name.trim()) return "Add your name so we know who to reply to.";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return "Add a valid email for a reply.";
    }
    return null;
  }

  function validateStep2(): string | null {
    if (contactKind === "feedback" && feedback.trim().length < 10) {
      return "A few more words help — at least 10 characters.";
    }
    if (contactKind === "feature" && !featureTitle.trim()) {
      return "Add a feature title so we can track the request.";
    }
    if (contactKind === "review" && rating < 1) {
      return "Tap a star rating — it takes one second.";
    }
    return null;
  }

  function handleContinue() {
    const err = validateStep1();
    if (err) {
      setError(err);
      return;
    }
    setError("");
    onStepChange(1);
  }

  function handleBack() {
    setError("");
    onStepChange(0);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validateStep2();
    if (err) {
      setError(err);
      return;
    }
    setError("");
    setSending(true);

    const payloadFeedback =
      contactKind === "feature"
        ? featureDescription.trim() ||
          `Feature request: ${featureTitle.trim()}`
        : contactKind === "review"
          ? review.trim() || feedback.trim() || `Rating: ${rating}/5`
          : feedback.trim();

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          city,
          country: city.includes("worldwide") ? "Worldwide" : "India",
          role,
          feedbackType: apiFeedbackType,
          feedback: payloadFeedback,
          featureTitle: contactKind === "feature" ? featureTitle : "",
          featureDescription:
            contactKind === "feature" ? featureDescription : "",
          rating: contactKind === "review" ? rating : 0,
          review: contactKind === "review" ? review : "",
          page,
        }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(body.error || "Could not send");
      clearDraft(page);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send. Try again.");
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div
        className={cn(
          "rounded-2xl border-2 border-ink bg-white px-6 py-12 text-center sm:px-10",
          hardShadowSm,
        )}
      >
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sage-wash">
          <Check className="h-7 w-7 text-sage" />
        </span>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-ink">
          Received — thank you
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
          The Mentr team in Bengaluru reads every note. If you asked for a
          reply, we&apos;ll write back within one working day (IST).
        </p>
        {contactKind === "review" && rating > 0 && (
          <p className="mt-4 text-xs font-semibold text-sage">
            {rating} / 5 · {city} · {name.split(" ")[0] || "You"}
          </p>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={isStep2 ? handleSubmit : (e) => e.preventDefault()}
      className={cn(
        "rounded-2xl border-2 border-ink bg-white p-5 sm:p-7",
        hardShadowSm,
      )}
    >
      {/* 2-step indicator */}
      <div className="flex gap-2">
        {STEPS.map((s, i) => {
          const done = step > i;
          const active = step === i;
          return (
            <button
              key={s.id}
              type="button"
              disabled={i > step}
              onClick={() => i < step && onStepChange(i)}
              className={cn(
                "flex min-w-0 flex-1 flex-col rounded-xl border-2 px-3 py-2.5 text-left transition-all sm:px-4 sm:py-3",
                active
                  ? "border-ink bg-cream shadow-[3px_3px_0_0_#1c1a17]"
                  : done
                    ? "border-sage/30 bg-sage-wash/50 cursor-pointer"
                    : "border-ink/10 bg-white opacity-60",
              )}
            >
              <span className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                    done
                      ? "bg-sage text-white"
                      : active
                        ? "bg-ink text-white"
                        : "bg-ink/10 text-muted",
                  )}
                >
                  {done ? <Check className="h-3.5 w-3.5" strokeWidth={2.5} /> : i + 1}
                </span>
                <span
                  className={cn(
                    "text-xs font-bold sm:text-sm",
                    active ? "text-ink" : "text-muted",
                  )}
                >
                  {s.label}
                </span>
              </span>
              <span className="mt-0.5 hidden text-[11px] text-muted sm:block">
                {s.sub}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink/8">
        <div
          className="h-full rounded-full bg-gradient-to-r from-sage to-coral transition-all duration-400"
          style={{ width: step === 0 ? "50%" : "100%" }}
        />
      </div>

      <h2 className="mt-5 text-xl font-bold tracking-tight text-ink sm:text-2xl">
        {isStep1 ? "Who are you & what do you need?" : panel.title}
      </h2>
      <p className="mt-1 text-sm text-muted">
        {isStep1
          ? "Pick a contact type and tell us how to reach you."
          : kindMeta.hint}
      </p>

      <div className="mt-5 min-h-[240px]">
        {isStep1 && (
          <div className="space-y-5">
            <label className="block">
              <span className="text-[12px] font-bold text-ink">Contact type</span>
              <select
                value={contactKind}
                onChange={(e) => {
                  setError("");
                  onContactKindChange(e.target.value as ContactKindId);
                }}
                className={cn(field, "font-semibold")}
              >
                {CONTACT_KINDS.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="text-[12px] font-bold text-ink">Your name</span>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  placeholder="Priya Sharma"
                  className={field}
                  autoFocus
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-[12px] font-bold text-ink">Email</span>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  placeholder="you@email.com"
                  className={field}
                />
              </label>
              <label className="block">
                <span className="text-[12px] font-bold text-ink">City</span>
                <select
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={field}
                >
                  {INTERACTION_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-[12px] font-bold text-ink">I am a</span>
                <select
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value as InteractionRoleId)}
                  className={field}
                >
                  {INTERACTION_ROLES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        )}

        {isStep2 && (
          <div
            className={cn(
              "rounded-xl border-2 p-4 sm:p-5 transition-colors",
              panel.panel,
            )}
          >
            {contactKind === "feedback" && (
              <div className="space-y-3">
                <label className="block">
                  <span className="text-[12px] font-bold text-ink">
                    What is this about?
                  </span>
                  <select
                    value={feedbackType}
                    onChange={(e) =>
                      setFeedbackType(e.target.value as FeedbackTypeId)
                    }
                    className={field}
                  >
                    {FEEDBACK_TYPES.filter(
                      (t) => t.id !== "feature" && t.id !== "review",
                    ).map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-[12px] font-bold text-ink">
                    Your message
                  </span>
                  <textarea
                    required
                    minLength={10}
                    rows={5}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="What worked, what didn’t, or what you needed today…"
                    className={area}
                    autoFocus
                  />
                  <span className="mt-1 block text-[11px] text-muted">
                    {feedback.length}/10 characters minimum
                  </span>
                </label>
              </div>
            )}

            {contactKind === "feature" && (
              <div className="space-y-3">
                <label className="block">
                  <span className="text-[12px] font-bold text-ink">
                    Feature title
                  </span>
                  <input
                    value={featureTitle}
                    onChange={(e) => setFeatureTitle(e.target.value)}
                    placeholder="e.g. Compare 3 tutors side by side"
                    className={field}
                    autoFocus
                  />
                </label>
                <label className="block">
                  <span className="text-[12px] font-bold text-ink">
                    Feature description
                  </span>
                  <textarea
                    rows={4}
                    value={featureDescription}
                    onChange={(e) => setFeatureDescription(e.target.value)}
                    placeholder="Who is it for, and what should happen?"
                    className={area}
                  />
                </label>
              </div>
            )}

            {contactKind === "review" && (
              <div className="space-y-3">
                <div>
                  <p className="text-[12px] font-bold text-ink">Your rating</p>
                  <div
                    className="mt-2 flex flex-wrap items-center gap-1"
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    {[1, 2, 3, 4, 5].map((n) => {
                      const active = (hoverRating || rating) >= n;
                      return (
                        <button
                          key={n}
                          type="button"
                          aria-label={`${n} star${n === 1 ? "" : "s"}`}
                          onMouseEnter={() => setHoverRating(n)}
                          onClick={() => setRating(n)}
                          className={cn(
                            "flex h-12 w-12 items-center justify-center rounded-xl border-2 transition hover:scale-105",
                            active
                              ? "border-butter bg-white"
                              : "border-ink/10 bg-white/80 hover:border-ink/25",
                          )}
                        >
                          <Star
                            className={cn(
                              "h-7 w-7",
                              active ? "fill-coral text-coral" : "text-hairline",
                            )}
                          />
                        </button>
                      );
                    })}
                    <span className="ml-2 text-sm font-bold tabular-nums text-ink">
                      {rating ? `${rating} / 5` : "Tap a star"}
                    </span>
                  </div>
                </div>
                <label className="block">
                  <span className="text-[12px] font-bold text-ink">
                    Review note{" "}
                    <span className="font-normal text-muted">(optional)</span>
                  </span>
                  <textarea
                    rows={3}
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Would you recommend Mentr to a parent in your city? Why?"
                    className={area}
                  />
                </label>
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-coral/40 bg-coral-wash px-3 py-2 text-sm font-medium text-coral-dark"
        >
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
        {isStep2 ? (
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={handleBack}
            className="h-11 gap-2 border-2 border-ink/15"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        ) : (
          <span className="hidden sm:block" />
        )}

        {isStep1 ? (
          <Button
            type="button"
            size="lg"
            onClick={handleContinue}
            className="h-12 w-full gap-2 border-2 border-ink shadow-[3px_3px_0_0_#1c1a17] sm:w-auto sm:min-w-[180px]"
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="submit"
            size="lg"
            disabled={sending}
            className="h-12 w-full gap-2 border-2 border-ink shadow-[3px_3px_0_0_#1c1a17] sm:w-auto sm:min-w-[220px]"
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            {sending ? "Sending…" : "Send to Mentr team"}
          </Button>
        )}
      </div>

      <p className="mt-3 text-center text-[11px] text-muted sm:text-left">
        Step {step + 1} of 2 · Draft saved locally
      </p>
    </form>
  );
}
