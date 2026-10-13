"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { BookDemoButton, type DemoFromPost } from "@/components/demo/book-demo-button";
import { MentorPhoto } from "@/components/ui/mentor-photo";
import {
  ApiError,
  requirementsApi,
  type NewRequirement,
  type RequirementMatch,
  type StartTimeline,
} from "@/lib/api";
import { resolveRegistrationSource } from "@/lib/marketing-client";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

export const SUBJECT_OPTIONS = [
  "Mathematics",
  "Science",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Hindi",
  "Kannada",
  "Social Science",
  "Coding",
  "Exam Prep",
  "Music",
];

const LEVEL_OPTIONS = [
  "Class 1–5",
  "Class 6–8",
  "Class 9–10",
  "Class 11–12",
  "JEE / NEET",
  "College",
  "Working professionals",
];

const BOARD_OPTIONS = ["CBSE", "ICSE", "State board", "IB", "IGCSE", "Other"];

const MODE_OPTIONS = [
  { id: "online", label: "Online" },
  { id: "student_home", label: "At my home" },
  { id: "tutor_home", label: "At tutor's place" },
] as const;

const TIMELINE_OPTIONS: { id: StartTimeline; label: string }[] = [
  { id: "immediately", label: "Right away" },
  { id: "within_week", label: "This week" },
  { id: "within_month", label: "This month" },
  { id: "flexible", label: "Just exploring" },
];

const TIME_OPTIONS = ["Mornings", "Evenings", "Weekends", "Any time"];

const OTHER = "__other";

const BUDGET_OPTIONS: {
  label: string;
  min: number | "";
  max: number | "";
}[] = [
  { label: "Under ₹300", min: "", max: 300 },
  { label: "₹300–500", min: 300, max: 500 },
  { label: "₹500–800", min: 500, max: 800 },
  { label: "₹800–1,200", min: 800, max: 1200 },
  { label: "₹1,200+", min: 1200, max: "" },
  { label: "Not sure yet", min: "", max: "" },
];

const GOAL_OPTIONS = [
  "Improve school marks",
  "Board exam prep",
  "JEE / NEET prep",
  "Homework help",
  "Learn a new skill",
  "Spoken / language",
];

const NOTE_MAX = 500;
const PHONE_RE = /^\+?[\d\s-]{10,15}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Survives the sign-in detour when a guest's email already has an account. */
export const REQUIREMENT_DRAFT_KEY = "req_draft";

type Draft = {
  subject: string;
  classLevel: string;
  board: string;
  modes: string[];
  area: string;
  startTimeline: StartTimeline | "";
  preferredTime: string;
  budget: string;
  goal: string;
  note: string;
};

const EMPTY_DRAFT: Draft = {
  subject: "",
  classLevel: "",
  board: "",
  modes: [],
  area: "",
  startTimeline: "",
  preferredTime: "",
  budget: "",
  goal: "",
  note: "",
};

const STEPS = [
  { title: "What does your child need?", hint: "Subject and class" },
  { title: "Where and when?", hint: "Online or at home, and when to start" },
  { title: "Budget and goal", hint: "Helps tutors pitch the right plan" },
  { title: "Where should tutors reach you?", hint: "Shared only with a tutor you book" },
];

function initialDraft(initialSubject: string): Draft {
  const draft: Draft = { ...EMPTY_DRAFT, subject: initialSubject };
  if (typeof window === "undefined") return draft;
  try {
    const saved = sessionStorage.getItem(REQUIREMENT_DRAFT_KEY);
    if (saved) {
      return { ...draft, ...(JSON.parse(saved) as Partial<Draft>) };
    }
  } catch {
    /* ignore malformed storage */
  }
  return draft;
}

function asChoice(value: string, options: readonly string[]): string {
  return value && !options.includes(value) ? OTHER : value;
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3 py-1.5 text-[12.5px] font-semibold transition sm:px-3.5 sm:py-2 sm:text-[13px]",
        active
          ? "border-ink bg-ink text-white"
          : "border-hairline bg-white text-ink hover:border-ink/30",
      )}
    >
      {children}
    </button>
  );
}

function Field({
  label,
  optional,
  children,
}: {
  label: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-1.5 text-[12.5px] font-semibold text-ink sm:mb-2 sm:text-[13px]">
        {label}
        {optional && <span className="ml-1 font-medium text-muted">(optional)</span>}
      </p>
      {children}
    </div>
  );
}

const inputCls =
  "h-10 w-full rounded-lg border border-hairline bg-white px-3 text-[16px] text-ink outline-none transition placeholder:text-muted/70 focus:border-ink/40 sm:h-11 sm:px-3.5 sm:text-[15px]";

/**
 * Post a requirement in four short steps, for signed-in parents and guests
 * alike, then show matching tutors right away with the option to wait for
 * pitches instead.
 */
export function PostRequirementWizard({
  initialSubject = "",
  onClose,
  onPosted,
}: {
  initialSubject?: string;
  onClose: () => void;
  /** Signed-in parents: refresh "My posts" */
  onPosted?: () => void;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const isParent = user?.role === "parent";
  const profile = isParent ? user?.parentProfile : undefined;

  const [step, setStep] = useState(0);
  const [init] = useState(() => initialDraft(initialSubject));
  const [draft, setDraft] = useState<Draft>(() => ({
    ...init,
    subject: asChoice(init.subject, SUBJECT_OPTIONS),
    classLevel: asChoice(init.classLevel, LEVEL_OPTIONS),
  }));
  const [customSubject, setCustomSubject] = useState(
    draft.subject === OTHER ? init.subject : "",
  );
  const [customLevel, setCustomLevel] = useState(
    draft.classLevel === OTHER ? init.classLevel : "",
  );
  const [name, setName] = useState(profile?.name ?? "");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(profile?.phoneNumber ?? "");
  const [acceptedLegal, setAcceptedLegal] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{
    matches: RequirementMatch[];
    email: string;
    post?: DemoFromPost;
    /** Posted while signed out; `accountExists` when the email already has an account */
    guest?: { accountExists: boolean };
  } | null>(null);

  useEffect(() => {
    try {
      sessionStorage.removeItem(REQUIREMENT_DRAFT_KEY);
    } catch {
      /* storage blocked */
    }
  }, []);

  useEffect(() => {
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
  }, [onClose]);

  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
    setError("");
  }

  const subject = draft.subject === OTHER ? customSubject.trim() : draft.subject;
  const classLevel =
    draft.classLevel === OTHER ? customLevel.trim() : draft.classLevel;
  const atHome = draft.modes.includes("student_home");

  const stepError = useMemo(() => {
    if (step === 0) {
      if (!subject) return "Pick a subject";
      if (!classLevel) return "Pick the class or level";
    }
    if (step === 1) {
      if (draft.modes.length === 0) return "Pick at least one way to learn";
      if (atHome && draft.area.trim().length < 2) {
        return "Add your area so nearby tutors see it";
      }
      if (!draft.startTimeline) return "Pick when you want to start";
    }
    if (step === 3) {
      if (!name.trim()) return "Add your name";
      if (!isParent) {
        if (!EMAIL_RE.test(email.trim())) return "Enter a valid email";
        if (!PHONE_RE.test(phone.trim())) return "Enter a valid WhatsApp number";
        if (!acceptedLegal) return "Accept the Terms and Privacy policy";
      } else if (phone.trim() && !PHONE_RE.test(phone.trim())) {
        return "Enter a valid WhatsApp number";
      }
    }
    return "";
  }, [step, subject, classLevel, atHome, draft, name, email, phone, acceptedLegal, isParent]);

  function payload(): NewRequirement {
    const budget = BUDGET_OPTIONS.find((b) => b.label === draft.budget);
    return {
      subject,
      classLevel,
      area: atHome ? draft.area.trim() : "",
      modes: draft.modes as NewRequirement["modes"],
      budgetMin: budget?.min ?? "",
      budgetMax: budget?.max ?? "",
      details: draft.note.trim(),
      startTimeline: draft.startTimeline as StartTimeline,
      board: draft.board || undefined,
      goal: draft.goal || undefined,
      preferredTime: draft.preferredTime || undefined,
    };
  }

  async function submit() {
    setSending(true);
    setError("");
    try {
      if (isParent) {
        const data = await requirementsApi.post({
          ...payload(),
          contactName: profile?.name ? undefined : name.trim(),
          contactPhone: phone.trim() || undefined,
        });
        setResult({
          matches: data.matches,
          email: user!.email,
          post: {
            id: data.requirement.id,
            subject: data.requirement.subject,
            classLevel: data.requirement.classLevel,
          },
        });
        onPosted?.();
      } else {
        const data = await requirementsApi.postGuest({
          ...payload(),
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          acceptedLegal: true,
          registrationSource: resolveRegistrationSource(),
        });
        setResult({
          matches: data.matches,
          email: data.email,
          guest: { accountExists: Boolean(data.accountExists) },
        });
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't post. Try again.");
    } finally {
      setSending(false);
    }
  }

  function next() {
    if (stepError) {
      setError(stepError);
      return;
    }
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      setError("");
      return;
    }
    void submit();
  }

  const progress = result ? 100 : ((step + 1) / (STEPS.length + 1)) * 100;

  return createPortal(
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center text-left sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="post-wizard-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-ink/40"
        aria-label="Close"
        onClick={onClose}
      />

      <div
        className={cn(
          "champs-pop relative z-10 flex max-h-[94dvh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl transition-[max-width] duration-300 sm:max-h-[90dvh] sm:rounded-2xl",
          result ? "max-w-3xl" : "max-w-lg",
        )}
      >
        <div className="h-1 w-full bg-cream">
          <div
            className="h-full bg-coral transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {result ? (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-white/70"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        ) : (
          <div className="flex items-start justify-between gap-3 px-4 pb-1.5 pt-3 sm:px-6 sm:pb-2 sm:pt-4">
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wider text-coral">
                Step {step + 1} of {STEPS.length}
              </p>
              <h2
                id="post-wizard-title"
                className="mt-0.5 text-base font-bold leading-snug text-ink sm:text-lg"
              >
                {STEPS[step].title}
              </h2>
              <p className="mt-0.5 text-[13px] text-muted">{STEPS[step].hint}</p>
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
        )}

        <div
          className={cn(
            "flex-1 overflow-y-auto px-4 pb-4 sm:px-6",
            result ? "pt-0" : "pt-2",
          )}
        >
          {result ? (
            <ResultView
              post={result.post}
              matches={result.matches}
              email={result.email}
              subject={subject}
              guest={result.guest}
            />
          ) : step === 0 ? (
            <div className="space-y-4 sm:space-y-5">
              <Field label="Subject">
                <div className="flex flex-wrap gap-2">
                  {SUBJECT_OPTIONS.map((s) => (
                    <Chip
                      key={s}
                      active={draft.subject === s}
                      onClick={() => update("subject", s)}
                    >
                      {s}
                    </Chip>
                  ))}
                  <Chip
                    active={draft.subject === OTHER}
                    onClick={() => update("subject", OTHER)}
                  >
                    Other
                  </Chip>
                </div>
                {draft.subject === OTHER && (
                  <input
                    autoFocus
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value.slice(0, 60))}
                    placeholder="e.g. Accountancy, French, Abacus"
                    className={cn(inputCls, "mt-2.5")}
                  />
                )}
              </Field>
              <Field label="Class / level">
                <div className="flex flex-wrap gap-2">
                  {LEVEL_OPTIONS.map((l) => (
                    <Chip
                      key={l}
                      active={draft.classLevel === l}
                      onClick={() => update("classLevel", l)}
                    >
                      {l}
                    </Chip>
                  ))}
                  <Chip
                    active={draft.classLevel === OTHER}
                    onClick={() => update("classLevel", OTHER)}
                  >
                    Other
                  </Chip>
                </div>
                {draft.classLevel === OTHER && (
                  <input
                    autoFocus
                    value={customLevel}
                    onChange={(e) => setCustomLevel(e.target.value.slice(0, 60))}
                    placeholder="e.g. Nursery, UKG, Diploma, Adult beginner"
                    className={cn(inputCls, "mt-2.5")}
                  />
                )}
              </Field>
              <Field label="Board" optional>
                <div className="flex flex-wrap gap-2">
                  {BOARD_OPTIONS.map((b) => (
                    <Chip
                      key={b}
                      active={draft.board === b}
                      onClick={() => update("board", draft.board === b ? "" : b)}
                    >
                      {b}
                    </Chip>
                  ))}
                </div>
              </Field>
            </div>
          ) : step === 1 ? (
            <div className="space-y-4 sm:space-y-5">
              <Field label="How should classes happen?">
                <div className="flex flex-wrap gap-2">
                  {MODE_OPTIONS.map((m) => (
                    <Chip
                      key={m.id}
                      active={draft.modes.includes(m.id)}
                      onClick={() =>
                        update(
                          "modes",
                          draft.modes.includes(m.id)
                            ? draft.modes.filter((x) => x !== m.id)
                            : [...draft.modes, m.id],
                        )
                      }
                    >
                      {m.label}
                    </Chip>
                  ))}
                </div>
              </Field>
              {atHome && (
                <Field label="Your area">
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                    <input
                      value={draft.area}
                      onChange={(e) => update("area", e.target.value.slice(0, 80))}
                      placeholder="e.g. HSR Layout, Bengaluru"
                      className={cn(inputCls, "pl-10")}
                    />
                  </div>
                  <p className="mt-1.5 text-[12px] text-muted">
                    Locality only, never your address.
                  </p>
                </Field>
              )}
              <Field label="When do you want to start?">
                <div className="grid grid-cols-2 gap-2">
                  {TIMELINE_OPTIONS.map((t) => (
                    <Chip
                      key={t.id}
                      active={draft.startTimeline === t.id}
                      onClick={() => update("startTimeline", t.id)}
                    >
                      {t.label}
                    </Chip>
                  ))}
                </div>
              </Field>
              <Field label="Best time for classes" optional>
                <div className="flex flex-wrap gap-2">
                  {TIME_OPTIONS.map((t) => (
                    <Chip
                      key={t}
                      active={draft.preferredTime === t}
                      onClick={() =>
                        update("preferredTime", draft.preferredTime === t ? "" : t)
                      }
                    >
                      {t}
                    </Chip>
                  ))}
                </div>
              </Field>
            </div>
          ) : step === 2 ? (
            <div className="space-y-4 sm:space-y-5">
              <Field label="Budget per hour" optional>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {BUDGET_OPTIONS.map((b) => (
                    <Chip
                      key={b.label}
                      active={draft.budget === b.label}
                      onClick={() =>
                        update("budget", draft.budget === b.label ? "" : b.label)
                      }
                    >
                      {b.label}
                    </Chip>
                  ))}
                </div>
              </Field>
              <Field label="Main goal" optional>
                <div className="flex flex-wrap gap-2">
                  {GOAL_OPTIONS.map((g) => (
                    <Chip
                      key={g}
                      active={draft.goal === g}
                      onClick={() => update("goal", draft.goal === g ? "" : g)}
                    >
                      {g}
                    </Chip>
                  ))}
                </div>
              </Field>
              <Field label="Anything tutors should know?" optional>
                <textarea
                  value={draft.note}
                  onChange={(e) => update("note", e.target.value.slice(0, NOTE_MAX))}
                  rows={3}
                  placeholder="e.g. Weak in algebra, board exam in March, prefers a female tutor"
                  className="w-full resize-none rounded-lg border border-hairline bg-white px-3.5 py-3 text-[15px] leading-relaxed text-ink outline-none transition placeholder:text-muted/70 focus:border-ink/40"
                />
              </Field>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start gap-2.5 rounded-lg bg-sage-wash px-3.5 py-3">
                <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sage" />
                <p className="text-[12px] leading-relaxed text-ink/80">
                  Tutors see your need, not your name or number. Your contact
                  unlocks only for the tutor you accept.
                </p>
              </div>

              {isParent && profile?.name ? (
                <div className="rounded-lg border border-hairline bg-cream/50 px-3.5 py-3">
                  <p className="text-[15px] font-semibold text-ink">{profile.name}</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-[13px] text-muted">
                    <Mail className="h-3.5 w-3.5" />
                    {user?.email}
                  </p>
                </div>
              ) : (
                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-semibold text-ink">
                    Your name
                  </span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value.slice(0, 80))}
                    autoComplete="name"
                    placeholder="e.g. Priya Sharma"
                    className={inputCls}
                  />
                </label>
              )}

              {isParent && !profile?.name && (
                <p className="flex items-center gap-1.5 text-[13px] text-muted">
                  <Mail className="h-3.5 w-3.5" />
                  {user?.email}
                </p>
              )}

              {!isParent && (
                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-semibold text-ink">
                    Email
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.slice(0, 160))}
                    autoComplete="email"
                    inputMode="email"
                    placeholder="you@example.com"
                    className={inputCls}
                  />
                  <span className="mt-1 block text-[12px] text-muted">
                    Tutor pitches arrive here. Sign in with this email anytime to
                    compare them.
                  </span>
                </label>
              )}

              <label className="block">
                <span className="mb-1.5 block text-[13px] font-semibold text-ink">
                  WhatsApp number
                  {isParent && (
                    <span className="ml-1 font-medium text-muted">(optional)</span>
                  )}
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.slice(0, 20))}
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="+91 98XXXXXXXX"
                  className={inputCls}
                />
                <span className="mt-1 block text-[12px] text-muted">
                  Shared only with the tutor you accept.
                </span>
              </label>

              {!isParent && (
                <label className="flex items-start gap-2.5 text-[13px] leading-snug text-muted">
                  <input
                    type="checkbox"
                    checked={acceptedLegal}
                    onChange={(e) => {
                      setAcceptedLegal(e.target.checked);
                      setError("");
                    }}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-coral"
                  />
                  <span>
                    I agree to the{" "}
                    <Link href="/terms" target="_blank" className="font-semibold text-ink underline">
                      Terms
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" target="_blank" className="font-semibold text-ink underline">
                      Privacy policy
                    </Link>
                    . A free parent account is created for this email.
                  </span>
                </label>
              )}
            </div>
          )}

          {error && !result && (
            <p className="mt-4 rounded-lg border border-coral/40 bg-coral-wash px-3 py-2 text-[13px] font-medium text-coral-dark">
              {error}
            </p>
          )}
        </div>

        {result && (
          <div className="flex gap-2 border-t border-hairline px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2.5 sm:justify-end sm:px-6 sm:pb-4 sm:pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex h-11 flex-1 items-center justify-center rounded-xl border border-hairline text-[14px] font-semibold sm:h-12 sm:text-[15px] text-ink transition hover:bg-cream sm:flex-none sm:px-6"
            >
              Not now
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                if (isParent) {
                  if (window.location.pathname === "/parent/dashboard") {
                    document
                      .getElementById("requirements")
                      ?.scrollIntoView({ behavior: "smooth" });
                  } else {
                    router.push("/parent/dashboard#requirements");
                  }
                } else {
                  router.push(trackHref("/parent", result.email));
                }
              }}
              className="flex h-11 flex-[1.4] items-center justify-center gap-1.5 rounded-xl bg-ink text-[14px] font-bold sm:h-12 sm:text-[15px] text-white transition hover:opacity-90 sm:flex-none sm:px-7"
            >
              See my posts
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {!result && (
          <div className="flex gap-2 border-t border-hairline px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2.5 sm:px-6 sm:pb-4 sm:pt-3">
            {step > 0 && (
              <button
                type="button"
                onClick={() => {
                  setStep(step - 1);
                  setError("");
                }}
                disabled={sending}
                className="flex h-11 w-11 shrink-0 items-center sm:h-12 sm:w-12 justify-center rounded-xl border border-hairline text-ink transition hover:bg-cream disabled:opacity-50"
                aria-label="Back"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              onClick={next}
              disabled={sending}
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-coral text-[14px] font-bold sm:h-12 sm:text-[15px] text-white transition hover:bg-coral-dark disabled:opacity-60"
            >
              {sending && <Loader2 className="h-4 w-4 animate-spin" />}
              {sending
                ? "Finding tutors…"
                : step === STEPS.length - 1
                  ? "Post & see matching tutors"
                  : "Continue"}
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

/** Parent login / signup with the posting email prefilled, landing on their posts. */
function trackHref(base: "/parent" | "/parent/signup", email: string): string {
  return `${base}?email=${encodeURIComponent(email)}&next=${encodeURIComponent(
    "/parent/dashboard#requirements",
  )}`;
}

function ResultView({
  post,
  matches,
  email,
  subject,
  guest,
}: {
  post?: DemoFromPost;
  matches: RequirementMatch[];
  email: string;
  subject: string;
  guest?: { accountExists: boolean };
}) {
  return (
    <div className="space-y-4 sm:space-y-5">
      <section className="-mx-4 bg-sage-wash px-5 pb-4 pt-5 text-center sm:-mx-6 sm:px-10 sm:pb-6 sm:pt-8">
        <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-sage text-white sm:h-14 sm:w-14">
          <Check className="h-5 w-5 sm:h-7 sm:w-7" strokeWidth={3} />
        </span>
        <h2
          id="post-wizard-title"
          className="mt-2.5 text-base font-bold leading-snug text-ink sm:mt-3 sm:text-xl"
        >
          Requirement posted successfully
        </h2>
        {guest ? (
          <p className="mx-auto mt-1 max-w-md break-words text-[12px] leading-relaxed text-ink/70 sm:text-sm">
            When tutors pitch on your requirement, you&apos;ll be notified at{" "}
            <span className="font-semibold text-ink">{email}</span>.
          </p>
        ) : (
          <p className="mx-auto mt-1 max-w-md break-words text-[12px] leading-relaxed text-ink/70 sm:text-sm">
            Verified {subject} tutors are being notified. Every pitch lands in{" "}
            <span className="font-semibold text-ink">{email}</span> and on your
            dashboard. Accept one to unlock their WhatsApp.
          </p>
        )}

        {guest && (
          <div className="mx-auto mt-3.5 max-w-md rounded-xl border border-sage/30 bg-white px-3.5 py-3 text-left sm:mt-4 sm:px-4">
            <p className="flex items-center gap-1.5 text-[13px] font-bold text-ink sm:text-[14px]">
              <Mail className="h-3.5 w-3.5 shrink-0 text-sage" />
              {guest.accountExists
                ? "Log in to track your requirement"
                : "Create an account or log in to track your requirement"}
            </p>
            <p className="mt-0.5 break-words text-[12px] leading-relaxed text-muted">
              Use <span className="font-semibold text-ink">{email}</span> — this
              post and every pitch show up on your dashboard automatically.
            </p>
            <div className="mt-2.5 flex gap-2">
              {!guest.accountExists && (
                <Link
                  href={trackHref("/parent/signup", email)}
                  className="flex h-9 flex-1 items-center justify-center rounded-lg bg-coral text-[12.5px] font-bold text-white transition hover:bg-coral-dark sm:text-[13px]"
                >
                  Create free account
                </Link>
              )}
              <Link
                href={trackHref("/parent", email)}
                className={cn(
                  "flex h-9 flex-1 items-center justify-center rounded-lg text-[12.5px] font-bold transition sm:text-[13px]",
                  guest.accountExists
                    ? "bg-coral text-white hover:bg-coral-dark"
                    : "border border-hairline text-ink hover:bg-cream",
                )}
              >
                Log in
              </Link>
            </div>
          </div>
        )}
      </section>

      <section>
        <p className="flex items-center gap-1.5 text-[15px] font-bold text-ink">
          <Sparkles className="h-4 w-4 text-coral" />
          Need a tutor right away?
        </p>
        <p className="mt-0.5 text-[13px] text-muted">
          {matches.length > 0
            ? "These profiles match your need. Review one and book a free demo."
            : "No instant match for this combination yet. Tutors on the board will pitch you directly."}
        </p>
        {matches.length > 0 && (
          <ul className="mt-3 grid gap-2.5 sm:grid-cols-2 sm:gap-3">
            {matches.map((m) => (
              <li
                key={m.id}
                className="flex min-w-0 flex-col rounded-xl border border-hairline bg-white p-3 transition sm:p-3.5 hover:border-ink/20 hover:shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <MentorPhoto
                    name={m.name}
                    imageUrl={m.profileImageUrl}
                    size="sm"
                    rounded="full"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="truncate text-[14px] font-bold text-ink sm:text-[15px]">{m.name}</p>
                      {m.hourlyRate != null && (
                        <p className="shrink-0 text-[13px] font-bold text-ink">
                          ₹{m.hourlyRate}
                          <span className="font-medium text-muted">/hr</span>
                        </p>
                      )}
                    </div>
                    {m.designation && (
                      <p className="truncate text-[12px] text-muted">{m.designation}</p>
                    )}
                    <p className="mt-0.5 truncate text-[11.5px] text-ink/70 sm:mt-1 sm:text-[12px]">
                      {m.subjects.slice(0, 3).join(" · ")}
                      {m.area || m.city ? ` · ${m.area || m.city}` : ""}
                    </p>
                    {(m.matchReason || m.responseHint) && (
                      <p className="mt-0.5 truncate text-[11.5px] font-medium text-sage sm:mt-1 sm:text-[12px]">
                        {m.matchReason || m.responseHint}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-auto flex gap-1.5 pt-2.5 sm:gap-2 sm:pt-3">
                  <Link
                    href={`/teachers/${m.id}`}
                    className="flex h-9 flex-1 items-center justify-center whitespace-nowrap rounded-lg border border-hairline text-[12.5px] font-semibold sm:h-10 sm:text-[13px] text-ink transition hover:bg-cream"
                  >
                    Review profile
                  </Link>
                  <BookDemoButton
                    teacher={{ id: m.id, name: m.name, subjects: m.subjects }}
                    fromPost={post}
                    label="Book free demo"
                    className="flex h-9 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-coral text-[12.5px] font-bold sm:h-10 sm:text-[13px] text-white transition hover:bg-coral-dark"
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="flex items-center justify-center gap-1.5 text-[12px] text-muted">
        <Clock3 className="h-3.5 w-3.5" />
        Prefer to wait? We&apos;ll email you as each pitch arrives.
      </p>
    </div>
  );
}
