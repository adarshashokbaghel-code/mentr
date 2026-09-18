"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { PARENT_ROLE_TOAST } from "@/hooks/use-role-action";
import { ApiError, profileApi } from "@/lib/api";
import {
  formatIcBudget,
  IC_BOARDS,
  IC_BUDGET_PRESETS,
  IC_CLASS_LEVELS,
  IC_LOOKING_FOR,
  IC_MODES,
  IC_SUBJECTS,
  instantConnectApi,
  trackIcEvent,
  type IcFormPayload,
  type IcMatchedTutor,
} from "@/lib/instant-connect";
import { cn } from "@/lib/utils";
import {
  BadgeCheck,
  Check,
  ExternalLink,
  Loader2,
  MapPin,
  Megaphone,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { createPortal } from "react-dom";

const OTHER = "Other";
/** Sheet form micro-steps + post-match flow */
export type IcSheetStep =
  | "looking"
  | "basics"
  | "setup"
  | "budget"
  | "results"
  | "phone"
  | "done";

export type InstantConnectStepperHandle = {
  advance: () => void | Promise<void>;
};

export type InstantConnectCtaState = {
  label: string;
  disabled: boolean;
  busy: boolean;
};

const inputCls =
  "h-10 w-full rounded-xl border border-white/15 bg-white/10 px-3 text-[13px] font-medium text-white outline-none transition placeholder:text-white/40 focus:border-white/40 sm:h-11 sm:text-sm [&_option]:bg-white [&_option]:text-ink";
const inputClsLight =
  "h-11 w-full rounded-xl border-2 border-ink/10 bg-white px-3 text-sm font-medium text-ink outline-none transition focus:border-ink/40";
const labelCls =
  "mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-white/55";
const labelClsLight =
  "mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-muted";

export type InstantConnectStepperProps = {
  variant?: "sheet" | "page";
  onDoneClose?: () => void;
  onCtaStateChange?: (state: InstantConnectCtaState) => void;
  className?: string;
};

export const InstantConnectStepper = forwardRef<
  InstantConnectStepperHandle,
  InstantConnectStepperProps
>(function InstantConnectStepper(
  { variant = "page", onDoneClose, onCtaStateChange, className },
  ref,
) {
  const sheet = variant === "sheet";
  const { user, loading: authLoading, refreshSession, openRoleChooser } =
    useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [step, setStep] = useState<IcSheetStep>(sheet ? "looking" : "looking");
  const [lookingFor, setLookingFor] = useState("either");
  const [classLevel, setClassLevel] = useState("");
  const [classOther, setClassOther] = useState("");
  const [subject, setSubject] = useState("");
  const [subjectOther, setSubjectOther] = useState("");
  const [board, setBoard] = useState("");
  const [mode, setMode] = useState("online");
  const [location, setLocation] = useState("");
  const [budgetIdx, setBudgetIdx] = useState(4);
  const [matches, setMatches] = useState<IcMatchedTutor[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [profileTutor, setProfileTutor] = useState<IcMatchedTutor | null>(null);

  useEffect(() => {
    trackIcEvent("instant_connect_opened");
  }, []);

  const resolvedClass =
    classLevel === OTHER ? classOther.trim() : classLevel;
  const resolvedSubject =
    subject === OTHER ? subjectOther.trim() : subject;

  const formPayload: IcFormPayload = useMemo(() => {
    const preset = IC_BUDGET_PRESETS[budgetIdx];
    return {
      lookingFor,
      classLevel: resolvedClass,
      subject: resolvedSubject,
      board,
      mode,
      location:
        mode === "offline" || mode === "either" ? location.trim() : undefined,
      budgetMin: preset?.min ?? null,
      budgetMax: preset?.max ?? null,
      preferredTime: "Flexible",
    };
  }, [
    lookingFor,
    resolvedClass,
    resolvedSubject,
    board,
    mode,
    location,
    budgetIdx,
  ]);

  const locationOk = mode === "online" || location.trim().length > 1;
  const basicsOk = Boolean(resolvedClass && resolvedSubject);
  const setupOk = Boolean(board && mode && locationOk);

  function loginReturnPath() {
    if (typeof window === "undefined") return "/search";
    return `${window.location.pathname}${window.location.search}` || "/search";
  }

  /** Only logged-in parents can notify mentors. */
  function requireParentForSubmit(): boolean {
    if (authLoading) return false;
    if (!user) {
      openRoleChooser(loginReturnPath());
      setError("Log in as a parent to notify mentors.");
      return false;
    }
    if (user.role !== "parent") {
      toast(PARENT_ROLE_TOAST);
      setError("Switch to a parent account to notify mentors.");
      return false;
    }
    return true;
  }

  const ctaState: InstantConnectCtaState = useMemo(() => {
    if (busy) {
      return { label: "…", disabled: true, busy: true };
    }
    switch (step) {
      case "looking":
        return { label: "Next", disabled: !lookingFor, busy: false };
      case "basics":
        return { label: "Next", disabled: !basicsOk, busy: false };
      case "setup":
        return { label: "Next", disabled: !setupOk, busy: false };
      case "budget":
        return { label: "Instant Connect", disabled: false, busy: false };
      case "results":
        if (matches.length === 0) {
          return { label: "Post to board", disabled: false, busy: false };
        }
        return {
          label: `Notify ${selected.length || matches.length}`,
          disabled: !consent || selected.length === 0,
          busy: false,
        };
      case "phone":
        return {
          label: "Instant Connect",
          disabled: !phoneInput.trim(),
          busy: false,
        };
      case "done":
        return { label: "Done", disabled: false, busy: false };
      default:
        return { label: "Next", disabled: false, busy: false };
    }
  }, [
    busy,
    step,
    lookingFor,
    basicsOk,
    setupOk,
    matches.length,
    selected.length,
    consent,
    phoneInput,
  ]);

  useEffect(() => {
    onCtaStateChange?.(ctaState);
  }, [ctaState, onCtaStateChange]);

  async function runMatch() {
    trackIcEvent("instant_connect_form_completed");
    setBusy(true);
    setError("");
    try {
      const res = await instantConnectApi.match(formPayload);
      setMatches(res.matches);
      setSelected(res.matches.map((m) => m.id));
      setStep("results");
      if (res.noMatch) trackIcEvent("instant_connect_no_match");
      else
        trackIcEvent("instant_connect_matches_shown", {
          count: res.matches.length,
        });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Matching failed");
    } finally {
      setBusy(false);
    }
  }

  async function savePhoneAndContinue() {
    if (!requireParentForSubmit()) return;
    setBusy(true);
    setError("");
    try {
      const pp = user?.parentProfile;
      if (!pp) {
        setError("Complete parent profiling first");
        router.push("/parent/profiling");
        return;
      }
      await profileApi.saveParent({
        name: pp.name || "Parent",
        phoneNumber: phoneInput.trim(),
        country: pp.country || "India",
        city: pp.city || "India",
        area: pp.area || "",
      });
      await refreshSession();
      await instantConnectApi.create({
        ...formPayload,
        matchedTutorIds: matches.map((m) => m.id),
        selectedTutorIds: selected,
        consentSharedPhone: true,
      });
      trackIcEvent("instant_connect_request_sent", {
        mentors: selected.length,
      });
      setStep("done");
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        openRoleChooser(loginReturnPath());
        setError("Log in as a parent to notify mentors.");
        return;
      }
      setError(err instanceof ApiError ? err.message : "Could not save phone");
    } finally {
      setBusy(false);
    }
  }

  async function notifySelected() {
    if (selected.length < 1) {
      setError("Select at least one mentor");
      return;
    }
    if (!consent) {
      setError("Agree to share your phone number to continue");
      return;
    }
    if (!requireParentForSubmit()) return;

    const hasPhone = Boolean(user?.parentProfile?.phoneNumber?.trim());
    if (!hasPhone) {
      setStep("phone");
      setPhoneInput(user?.parentProfile?.phoneNumber || "");
      return;
    }

    setBusy(true);
    setError("");
    try {
      await instantConnectApi.create({
        ...formPayload,
        matchedTutorIds: matches.map((m) => m.id),
        selectedTutorIds: selected,
        consentSharedPhone: true,
      });
      trackIcEvent("instant_connect_request_sent", {
        mentors: selected.length,
      });
      setStep("done");
    } catch (err) {
      if (err instanceof ApiError && err.data?.code === "PHONE_REQUIRED") {
        setStep("phone");
        return;
      }
      if (err instanceof ApiError && err.status === 401) {
        openRoleChooser(loginReturnPath());
        setError("Log in as a parent to notify mentors.");
        return;
      }
      setError(
        err instanceof ApiError ? err.message : "Could not notify mentors",
      );
    } finally {
      setBusy(false);
    }
  }

  function goBoardFallback() {
    if (!requireParentForSubmit()) return;
    trackIcEvent("instant_connect_board_fallback");
    try {
      sessionStorage.setItem(
        "ic_board_prefill",
        JSON.stringify({
          subject: formPayload.subject,
          classLevel: formPayload.classLevel,
          details: "",
          budgetMin: formPayload.budgetMin,
          budgetMax: formPayload.budgetMax,
          mode: formPayload.mode,
          location: formPayload.location,
        }),
      );
    } catch {
      /* ignore */
    }
    router.push("/parent/dashboard?icFallback=1#requirements");
  }

  async function advance() {
    setError("");
    switch (step) {
      case "looking":
        if (!lookingFor) return;
        setStep("basics");
        return;
      case "basics":
        if (!basicsOk) {
          setError(
            classLevel === OTHER || subject === OTHER
              ? "Enter class and subject (or describe Other)"
              : "Pick class and subject",
          );
          return;
        }
        setStep("setup");
        return;
      case "setup":
        if (!setupOk) {
          setError(
            mode === "online"
              ? "Pick board and mode"
              : "Add board, mode, and location",
          );
          return;
        }
        setStep("budget");
        return;
      case "budget":
        trackIcEvent("instant_connect_form_started");
        await runMatch();
        return;
      case "results":
        if (matches.length === 0) {
          goBoardFallback();
          return;
        }
        await notifySelected();
        return;
      case "phone":
        if (!phoneInput.trim()) {
          setError("Enter your phone number");
          return;
        }
        await savePhoneAndContinue();
        return;
      case "done":
        onDoneClose?.();
        return;
    }
  }

  useImperativeHandle(ref, () => ({ advance }), [
    step,
    lookingFor,
    basicsOk,
    setupOk,
    matches,
    selected,
    consent,
    phoneInput,
    formPayload,
    user,
  ]);

  const iCls = sheet ? inputCls : inputClsLight;
  const lCls = sheet ? labelCls : labelClsLight;

  const titles: Record<IcSheetStep, { h: string; s: string }> = {
    looking: {
      h: "Who are you looking for?",
      s: "Tutor, coach, or either — one tap.",
    },
    basics: {
      h: "Class & subject",
      s: "We'll match mentors who teach this.",
    },
    setup: {
      h: "Board & mode",
      s: "Online, in person, or either.",
    },
    budget: {
      h: "Budget (optional)",
      s: "Skip or pick a range — then we match.",
    },
    results: {
      h: matches.length ? "Your matches" : "No match yet",
      s: matches.length
        ? "Pick who to notify."
        : "Post on the board instead.",
    },
    phone: {
      h: "Your number",
      s: "Shared only with mentors you choose.",
    },
    done: {
      h: "You're set",
      s: "Mentors can reach you for 48 hours.",
    },
  };

  if (authLoading) {
    return (
      <div
        className={cn(
          "flex items-center justify-center py-10 text-sm font-semibold",
          sheet ? "text-white/70" : "text-muted",
          className,
        )}
      >
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading…
      </div>
    );
  }

  const showPageFooter = !sheet;

  return (
    <div
      className={cn(
        "font-sans",
        sheet ? "text-white" : "text-ink",
        className,
      )}
    >
      {sheet ? (
        <div className="mb-5 px-0.5 text-center sm:mb-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/45 sm:text-[11px]">
            Instant Connect
          </p>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-white sm:text-2xl">
            {titles[step].h}
          </h2>
          <p className="mt-1 text-xs font-medium text-white/50 sm:text-sm">
            {titles[step].s}
          </p>
          {step !== "results" && step !== "phone" && step !== "done" ? (
            <StepDots
              index={["looking", "basics", "setup", "budget"].indexOf(step)}
              total={4}
            />
          ) : null}
        </div>
      ) : (
        <div className="mb-6 flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border-2 border-ink bg-ink text-white shadow-[3px_3px_0_0_#1c1a17]">
            <Zap className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#3d3429]">
              Instant Connect
            </p>
            <h1 className="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
              {titles[step].h}
            </h1>
            <p className="mt-0.5 text-sm text-muted">{titles[step].s}</p>
          </div>
        </div>
      )}

      {error ? (
        <p
          className={cn(
            "mb-3 rounded-xl px-3 py-2.5 text-sm font-medium",
            sheet
              ? "border border-coral/40 bg-coral/15 text-coral"
              : "border-2 border-coral/40 bg-coral-wash text-coral-dark",
          )}
        >
          {error}
        </p>
      ) : null}

      {step === "looking" && (
        <div className="flex flex-wrap justify-center gap-2.5 px-1 sm:gap-3">
          {IC_LOOKING_FOR.map((o) => (
            <Chip
              key={o.value}
              sheet={sheet}
              active={lookingFor === o.value}
              onClick={() => setLookingFor(o.value)}
            >
              {o.label}
            </Chip>
          ))}
        </div>
      )}

      {step === "basics" && (
        <div className="space-y-4 sm:space-y-5">
          <Field label="Class / Level" labelClass={lCls}>
            <select
              className={iCls}
              value={classLevel}
              onChange={(e) => setClassLevel(e.target.value)}
            >
              <option value="">Select</option>
              {IC_CLASS_LEVELS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          {classLevel === OTHER ? (
            <Field label="Describe class / level" labelClass={lCls}>
              <input
                className={iCls}
                value={classOther}
                onChange={(e) => setClassOther(e.target.value)}
                placeholder="e.g. Class 7, Grade 9, Adult learner"
                autoFocus
              />
            </Field>
          ) : null}
          <Field label="Subject" labelClass={lCls}>
            <select
              className={iCls}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              <option value="">Select</option>
              {IC_SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
          {subject === OTHER ? (
            <Field label="Describe subject" labelClass={lCls}>
              <input
                className={iCls}
                value={subjectOther}
                onChange={(e) => setSubjectOther(e.target.value)}
                placeholder="e.g. French, Chess, Public speaking"
              />
            </Field>
          ) : null}
        </div>
      )}

      {step === "setup" && (
        <div className="space-y-5 sm:space-y-6">
          <Field label="Board" labelClass={lCls}>
            <select
              className={iCls}
              value={board}
              onChange={(e) => setBoard(e.target.value)}
            >
              <option value="">Select</option>
              {IC_BOARDS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </Field>
          <div className="pt-0.5">
            <span className={lCls}>Mode</span>
            <div className="mt-0.5 flex flex-wrap gap-2.5">
              {IC_MODES.map((o) => (
                <Chip
                  key={o.value}
                  sheet={sheet}
                  active={mode === o.value}
                  onClick={() => setMode(o.value)}
                >
                  {o.label}
                </Chip>
              ))}
            </div>
          </div>
          {(mode === "offline" || mode === "either") && (
            <Field label="Location" labelClass={lCls}>
              <input
                className={iCls}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City / area"
              />
            </Field>
          )}
        </div>
      )}

      {step === "budget" && (
        <div className="flex flex-wrap justify-center gap-2.5 px-1 sm:gap-3">
          {IC_BUDGET_PRESETS.map((b, i) => (
            <Chip
              key={b.label}
              sheet={sheet}
              active={budgetIdx === i}
              onClick={() => setBudgetIdx(i)}
            >
              {b.label}
            </Chip>
          ))}
        </div>
      )}

      {step === "results" && matches.length === 0 && (
        <p
          className={cn(
            "text-center text-sm",
            sheet ? "text-white/55" : "text-muted",
          )}
        >
          No verified mentor matched all requirements. Use the button below to
          post on the Requirements Board.
        </p>
      )}

      {step === "results" && matches.length > 0 && (
        <div className="space-y-3">
          <ul className="space-y-2.5">
            {matches.map((m) => {
              const on = selected.includes(m.id);
              return (
                <li
                  key={m.id}
                  className={cn(
                    "rounded-2xl border p-3 transition",
                    sheet
                      ? on
                        ? "border-white/40 bg-white/15"
                        : "border-white/10 bg-white/5"
                      : on
                        ? "border-2 border-ink bg-white shadow-[3px_3px_0_0_rgba(61,52,41,0.25)]"
                        : "border-2 border-ink/10 bg-white",
                  )}
                >
                  <div className="flex gap-3">
                    <button
                      type="button"
                      aria-label={on ? "Deselect" : "Select"}
                      onClick={() => {
                        setSelected((prev) =>
                          on
                            ? prev.filter((id) => id !== m.id)
                            : prev.length >= 3
                              ? prev
                              : [...prev, m.id],
                        );
                        trackIcEvent("instant_connect_mentor_selected");
                      }}
                      className={cn(
                        "mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2",
                        on
                          ? sheet
                            ? "border-white bg-white text-ink"
                            : "border-ink bg-ink text-white"
                          : sheet
                            ? "border-white/30 bg-transparent"
                            : "border-ink/25 bg-white",
                      )}
                    >
                      {on ? <Check className="h-3 w-3" /> : null}
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-3">
                        <Avatar name={m.name} src={m.profileImageUrl} />
                        <div className="min-w-0 flex-1">
                          <p
                            className={cn(
                              "flex flex-wrap items-center gap-2 font-bold",
                              sheet ? "text-white" : "text-ink",
                            )}
                          >
                            {m.name}
                            <span
                              className={cn(
                                "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase",
                                sheet
                                  ? "bg-sage/25 text-sage"
                                  : "bg-sage-wash text-sage",
                              )}
                            >
                              <BadgeCheck className="h-3 w-3" />
                              Verified
                            </span>
                          </p>
                          <p
                            className={cn(
                              "mt-0.5 text-sm",
                              sheet ? "text-white/55" : "text-muted",
                            )}
                          >
                            {(m.subjects[0] || m.designation) +
                              (m.levels[0] ? ` · ${m.levels[0]}` : "")}
                          </p>
                          <p
                            className={cn(
                              "mt-1 flex flex-wrap gap-x-3 text-xs font-semibold",
                              sheet ? "text-white/75" : "text-ink/80",
                            )}
                          >
                            <span>
                              {m.teachingModes.includes("online")
                                ? "Online"
                                : "In person"}
                            </span>
                            {m.hourlyRate != null ? (
                              <span>₹{m.hourlyRate}/hour</span>
                            ) : null}
                            {m.city ? (
                              <span className="inline-flex items-center gap-0.5">
                                <MapPin className="h-3 w-3" />
                                {m.city}
                              </span>
                            ) : null}
                          </p>
                          <button
                            type="button"
                            onClick={() => setProfileTutor(m)}
                            className={cn(
                              "mt-2 inline-flex items-center gap-1 text-[12px] font-bold underline underline-offset-2 transition hover:opacity-90",
                              sheet
                                ? "text-coral decoration-coral/70"
                                : "text-coral decoration-coral/50 hover:decoration-coral",
                            )}
                          >
                            <ExternalLink className="h-3 w-3 shrink-0" />
                            View profile
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <label
            className={cn(
              "flex cursor-pointer items-start gap-3 rounded-xl p-3 text-sm leading-relaxed",
              sheet
                ? "border border-white/10 bg-white/5 text-white/85"
                : "border-2 border-ink/10 bg-[#f3ebe3]/70 text-ink",
            )}
          >
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 h-4 w-4 accent-[var(--ink)]"
            />
            <span>
              Share my phone with the mentors I select until I close this
              request.
            </span>
          </label>
        </div>
      )}

      {step === "phone" && (
        <input
          className={iCls}
          value={phoneInput}
          onChange={(e) => setPhoneInput(e.target.value)}
          placeholder="+91 …"
        />
      )}

      {step === "done" && (
        <div className="text-center">
          <span
            className={cn(
              "mx-auto flex h-12 w-12 items-center justify-center rounded-full",
              sheet ? "bg-sage/25 text-sage" : "bg-sage-wash text-sage",
            )}
          >
            <Check className="h-6 w-6" />
          </span>
          <p
            className={cn(
              "mt-3 text-sm",
              sheet ? "text-white/55" : "text-muted",
            )}
          >
            {selected.length} mentor{selected.length === 1 ? "" : "s"} notified.
            Budget:{" "}
            {formatIcBudget(formPayload.budgetMin, formPayload.budgetMax)}.
          </p>
          {!sheet ? (
            <Link
              href="/search"
              className="mt-5 inline-flex h-11 items-center justify-center rounded-md border-2 border-ink/15 bg-white px-5 text-sm font-bold text-ink"
            >
              Back to search
            </Link>
          ) : null}
        </div>
      )}

      {profileTutor ? (
        <MatchProfileModal
          tutor={profileTutor}
          onClose={() => setProfileTutor(null)}
        />
      ) : null}

      {showPageFooter &&
      step !== "results" &&
      step !== "phone" &&
      step !== "done" ? (
        <Button
          type="button"
          className="mt-6 w-full bg-coral text-white hover:bg-coral-dark"
          disabled={ctaState.disabled || busy}
          onClick={() => void advance()}
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : step === "budget" ? (
            <Sparkles className="h-4 w-4" />
          ) : null}
          {ctaState.label}
        </Button>
      ) : null}

      {showPageFooter && step === "results" ? (
        <div className="mt-5 flex flex-col gap-2">
          <Button
            type="button"
            className="w-full bg-coral text-white hover:bg-coral-dark"
            disabled={ctaState.disabled || busy}
            onClick={() => void advance()}
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : matches.length === 0 ? (
              <Megaphone className="h-4 w-4" />
            ) : (
              <Zap className="h-4 w-4" />
            )}
            {ctaState.label}
          </Button>
          {matches.length > 0 ? (
            <Button
              type="button"
              variant="secondary"
              onClick={() => setStep("looking")}
            >
              Start over
            </Button>
          ) : (
            <Button
              type="button"
              variant="secondary"
              onClick={() => setStep("looking")}
            >
              Edit requirement
            </Button>
          )}
        </div>
      ) : null}

      {showPageFooter && step === "phone" ? (
        <Button
          type="button"
          className="mt-4 w-full"
          disabled={ctaState.disabled || busy}
          onClick={() => void advance()}
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {ctaState.label}
        </Button>
      ) : null}
    </div>
  );
});

function StepDots({ index, total }: { index: number; total: number }) {
  return (
    <div className="mt-4 flex justify-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-1.5 rounded-full transition-all duration-300",
            i === index ? "w-5 bg-white" : "w-1.5 bg-white/25",
          )}
        />
      ))}
    </div>
  );
}

function Field({
  label,
  labelClass,
  children,
}: {
  label: string;
  labelClass: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      {children}
    </label>
  );
}

function Chip({
  active,
  onClick,
  children,
  sheet,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  sheet: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-lg border px-2.5 py-1.5 text-[11px] font-bold transition sm:px-3 sm:py-2 sm:text-xs",
        sheet
          ? active
            ? "border-white bg-white text-ink"
            : "border-white/15 bg-white/5 text-white/80 hover:border-white/30"
          : active
            ? "border-2 border-ink bg-ink text-white"
            : "border-2 border-ink/10 bg-cream text-ink hover:border-ink/25",
      )}
    >
      {children}
    </button>
  );
}

function Avatar({
  name,
  src,
  light,
}: {
  name: string;
  src: string | null;
  light?: boolean;
}) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
  if (src) {
    return (
      <Image
        src={src}
        alt=""
        width={44}
        height={44}
        className="h-11 w-11 rounded-xl border border-white/10 object-cover"
      />
    );
  }
  return (
    <span
      className={cn(
        "flex h-11 w-11 items-center justify-center rounded-xl text-sm font-bold",
        light
          ? "border border-ink/10 bg-cream text-ink"
          : "border border-white/10 bg-white/10 text-white",
      )}
    >
      {initials}
    </span>
  );
}

function MatchProfileModal({
  tutor,
  onClose,
}: {
  tutor: IcMatchedTutor;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const modeLabel =
    tutor.teachingModes.includes("online") &&
    tutor.teachingModes.includes("offline")
      ? "Online & in person"
      : tutor.teachingModes.includes("online")
        ? "Online"
        : "In person";

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[400] flex items-stretch justify-center sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ic-profile-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-ink/60 backdrop-blur-[3px]"
        aria-label="Close profile"
        onClick={onClose}
      />

      <div
        className={cn(
          "relative z-10 flex h-full w-full flex-col bg-white",
          "sm:h-auto sm:max-h-[min(90vh,760px)] sm:max-w-lg sm:rounded-2xl sm:border-2 sm:border-ink sm:shadow-[4px_4px_0_0_#1c1a17]",
        )}
      >
        <div className="sticky top-0 z-10 shrink-0 border-b border-hairline bg-white px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-5 sm:pt-4">
          <div className="flex items-start gap-3">
            <ProfileAvatar name={tutor.name} src={tutor.profileImageUrl} />
            <div className="min-w-0 flex-1 pr-1">
              <h3
                id="ic-profile-title"
                className="flex flex-wrap items-center gap-2 text-base font-extrabold leading-snug tracking-tight text-ink sm:text-xl"
              >
                {tutor.name}
                <span className="inline-flex items-center gap-0.5 rounded-md bg-sage-wash px-1.5 py-0.5 text-[10px] font-bold uppercase text-sage">
                  <BadgeCheck className="h-3 w-3" />
                  Verified
                </span>
              </h3>
              <p className="mt-0.5 text-xs font-semibold text-coral sm:text-sm">
                {tutor.designation || tutor.subjects[0] || "Mentor"}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/10 bg-cream text-ink transition hover:bg-cream-band active:scale-95"
              aria-label="Close"
            >
              <X className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5">
          <dl className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
            <Detail
              label="Subjects"
              value={
                tutor.subjects.length ? tutor.subjects.join(", ") : null
              }
            />
            <Detail
              label="Levels"
              value={tutor.levels.length ? tutor.levels.join(", ") : null}
            />
            <Detail label="Mode" value={modeLabel} />
            <Detail
              label="Rate"
              value={
                tutor.hourlyRate != null
                  ? `₹${tutor.hourlyRate}/hour`
                  : null
              }
            />
            <Detail
              label="Location"
              value={
                tutor.city || tutor.area
                  ? [tutor.area, tutor.city].filter(Boolean).join(", ")
                  : null
              }
              className="sm:col-span-2"
            />
            <Detail
              label="Response"
              value={tutor.responseHint || null}
              className="sm:col-span-2"
            />
          </dl>

          <p className="mt-4 rounded-xl border border-hairline bg-cream px-3 py-2.5 text-xs font-medium leading-relaxed text-muted sm:text-[13px]">
            Full bio, reviews, and availability are on the mentor profile.
          </p>
        </div>

        <div className="shrink-0 border-t border-hairline bg-white px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 sm:px-5 sm:pb-4">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href={`/teachers/${tutor.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-full bg-coral px-4 text-sm font-bold text-white transition hover:bg-coral-dark active:scale-[0.99]"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Open full profile
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 flex-1 items-center justify-center rounded-full border-2 border-ink/15 bg-white px-4 text-sm font-bold text-ink transition hover:bg-cream active:scale-[0.99]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function Detail({
  label,
  value,
  className,
}: {
  label: string;
  value: string | null;
  className?: string;
}) {
  if (!value) return null;
  return (
    <div
      className={cn(
        "rounded-xl border border-ink/10 bg-cream/60 px-3 py-2.5",
        className,
      )}
    >
      <dt className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-semibold leading-snug text-ink">
        {value}
      </dd>
    </div>
  );
}

function ProfileAvatar({
  name,
  src,
}: {
  name: string;
  src: string | null;
}) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
  if (src) {
    return (
      <Image
        src={src}
        alt=""
        width={56}
        height={56}
        className="h-14 w-14 shrink-0 rounded-2xl border-2 border-ink/10 object-cover"
      />
    );
  }
  return (
    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 border-ink/10 bg-cream text-base font-bold text-ink">
      {initials}
    </span>
  );
}
