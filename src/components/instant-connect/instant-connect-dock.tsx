"use client";

import { useAuth } from "@/components/auth/auth-provider";
import {
  InstantConnectStepper,
  type InstantConnectCtaState,
  type InstantConnectStepperHandle,
} from "@/components/instant-connect/instant-connect-stepper";
import { useToast } from "@/components/ui/toast";
import { useActiveInstantConnect } from "@/hooks/use-active-instant-connect";
import { PARENT_ROLE_TOAST } from "@/hooks/use-role-action";
import { cn } from "@/lib/utils";
import {
  BadgeCheck,
  LayoutDashboard,
  Loader2,
  Pause,
  Phone,
  Play,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";

type Panel = "closed" | "guide" | "stepper";

/** Matches Zero Nav spring: bounce 0.2, duration ~0.4s */
const OPEN_MS = 420;
const EASE = "cubic-bezier(0.22, 1.2, 0.36, 1)";
const GUIDE_BEAT_MS = 4200;

const GUIDE_BEATS = [
  {
    step: "1",
    title: "Answer a few simple questions",
    caption: "Class, subject, board, and online or in person — like filling a short form.",
  },
  {
    step: "2",
    title: "We show you matching tutors",
    caption: "Up to 3 verified mentors. You tap who you want to talk to.",
  },
  {
    step: "3",
    title: "They call you on your phone",
    caption: "Your number is shared only with tutors you pick — then you can close anytime.",
  },
] as const;

type InstantConnectDockProps = {
  className?: string;
};

/**
 * Zero-style bottom nav (zero.university):
 * fixed width (~410px), same rounded rect open + closed —
 * content slides up by growing height, not a circle morph.
 */
export function InstantConnectDock({ className }: InstantConnectDockProps) {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const { showTrackFlash } = useActiveInstantConnect();
  const [panel, setPanel] = useState<Panel>("closed");
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);
  const [cta, setCta] = useState<InstantConnectCtaState>({
    label: "Instant Connect",
    disabled: false,
    busy: false,
  });
  const titleId = useId();
  const stepperRef = useRef<InstantConnectStepperHandle>(null);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const open = panel !== "closed";

  /** Brief post-submit CTA, or while confirmation is open in the dock. */
  const onDoneScreen =
    mounted && panel === "stepper" && cta.label === "Track request";
  const showTrack =
    Boolean(user?.role === "parent") &&
    (onDoneScreen ||
      (showTrackFlash && (!mounted || panel === "closed")));

  const onCtaStateChange = useCallback((state: InstantConnectCtaState) => {
    setCta(state);
  }, []);

  useEffect(() => {
    return () => {
      if (exitTimer.current) clearTimeout(exitTimer.current);
    };
  }, []);

  /** Guests can open the form; faculty blocked. Parent auth is enforced at notify. */
  function canOpenStepper(): boolean {
    if (loading) return false;
    if (user && user.role !== "parent") {
      toast(PARENT_ROLE_TOAST);
      return false;
    }
    return true;
  }

  function openPanel(next: "guide" | "stepper") {
    if (next === "stepper" && !canOpenStepper()) return;
    if (exitTimer.current) {
      clearTimeout(exitTimer.current);
      exitTimer.current = null;
    }
    setPanel(next);
    if (mounted && shown) return;
    setMounted(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setShown(true));
    });
  }

  function close() {
    setShown(false);
    if (exitTimer.current) clearTimeout(exitTimer.current);
    exitTimer.current = setTimeout(() => {
      setPanel("closed");
      setMounted(false);
      setCta({
        label: "Instant Connect",
        disabled: false,
        busy: false,
      });
      exitTimer.current = null;
    }, OPEN_MS);
  }

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function openGuide() {
    if (panel === "guide" && shown) {
      close();
      return;
    }
    openPanel("guide");
  }

  function openStepper() {
    openPanel("stepper");
  }

  async function onMainCta() {
    if (loading) return;
    if (showTrack) return;
    if (!mounted || panel === "closed") {
      openStepper();
      return;
    }
    if (panel === "guide") {
      openStepper();
      return;
    }
    await stepperRef.current?.advance();
  }

  const mainLabel = showTrack
    ? "Track request"
    : !mounted || panel === "closed"
      ? "Instant Connect"
      : panel === "guide"
        ? "Instant Connect"
        : cta.label;

  const mainDisabled =
    loading || (panel === "stepper" && mounted && (cta.disabled || cta.busy));

  return (
    <div
      data-ic-dock=""
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-[max(0.65rem,env(safe-area-inset-bottom))] short:pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:px-4",
        className,
      )}
    >
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 top-[-100vh] bg-ink/25 transition-opacity",
          shown
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
        style={{ transitionDuration: `${OPEN_MS}ms`, transitionTimingFunction: EASE }}
        onClick={close}
        aria-hidden={!shown}
      />

      {/* Fixed-width shell — same rect open & closed (Zero Nav) */}
      <div
        className="pointer-events-auto relative w-full max-w-[min(100%,440px)]"
        role="dialog"
        aria-modal={mounted}
        aria-labelledby={mounted ? titleId : undefined}
      >
        <div
          className={cn(
            "flex w-full max-h-[min(100dvh-0.75rem,100vh-0.75rem)] flex-col overflow-hidden rounded-[28px] p-2 font-sans shadow-[0_12px_40px_rgba(0,0,0,0.28)] ring-1 transition-[background-color,box-shadow,backdrop-filter] short:rounded-[24px] short:p-1.5 sm:rounded-[32px] sm:p-2.5 short:sm:rounded-[28px] short:sm:p-2",
            mounted
              ? "bg-[rgba(28,28,28,0.78)] shadow-[0_16px_48px_rgba(0,0,0,0.35)] ring-white/12 backdrop-blur-[20px]"
              : showTrack
                ? "bg-ic-blue/95 ring-ic-blue/30 backdrop-blur-md"
                : "bg-[#c4b5a0]/95 ring-ink/10 backdrop-blur-md",
          )}
          style={{
            transitionDuration: `${OPEN_MS}ms`,
            transitionTimingFunction: EASE,
          }}
        >
          {/* Height grows upward — fixed width, no circle/scale morph */}
          <div
            className="grid transition-[grid-template-rows]"
            style={{
              gridTemplateRows: shown ? "1fr" : "0fr",
              transitionDuration: `${OPEN_MS}ms`,
              transitionTimingFunction: EASE,
              transitionDelay: shown ? "40ms" : "0ms",
            }}
          >
            <div className="min-h-0 overflow-hidden">
              <div
                id={titleId}
                className="max-h-[min(calc(100dvh-7.25rem),720px)] overflow-y-auto overscroll-contain px-4 pb-3 pt-5 short:max-h-[min(calc(100dvh-6.25rem),560px)] short:px-3 short:pb-2 short:pt-3 shorter:max-h-[min(calc(100dvh-5.75rem),420px)] short-landscape:max-h-[min(calc(100dvh-5.25rem),320px)] sm:max-h-[min(calc(100dvh-7.5rem),680px)] sm:px-6 sm:pb-4 sm:pt-6 short:sm:px-4 short:sm:pb-3 short:sm:pt-4"
                style={{
                  opacity: shown ? 1 : 0,
                  transform: shown ? "translateY(0)" : "translateY(18px)",
                  transitionProperty: "opacity, transform",
                  transitionDuration: `${OPEN_MS}ms`,
                  transitionTimingFunction: EASE,
                  transitionDelay: shown ? "60ms" : "0ms",
                }}
              >
                {panel === "guide" ? <GuidePanel /> : null}
                {panel === "stepper" ? (
                  <InstantConnectStepper
                    key="ic-sheet-stepper"
                    ref={stepperRef}
                    variant="sheet"
                    onDoneClose={close}
                    onCtaStateChange={onCtaStateChange}
                  />
                ) : null}
              </div>
            </div>
          </div>

          <div
            className="relative z-10 flex shrink-0 items-center gap-1.5 px-0.5 pt-0.5 short:gap-1 sm:gap-2"
            role="navigation"
            aria-label="Instant Connect"
          >
            <button
              type="button"
              aria-label={
                panel === "guide" ? "Close guide" : "How Instant Connect works"
              }
              aria-pressed={panel === "guide"}
              onClick={openGuide}
              disabled={showTrack}
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition hover:scale-[1.03] active:scale-[0.98] short:h-9 short:w-9 sm:h-[50px] sm:w-[50px] short:sm:h-11 short:sm:w-11",
                mounted
                  ? "bg-white/15 text-white ring-1 ring-white/20"
                  : "bg-white text-sage shadow-sm",
                showTrack && "opacity-50",
              )}
            >
              <Play className="h-3.5 w-3.5 fill-current sm:h-4 sm:w-4" />
            </button>

            {showTrack ? (
              <Link
                href="/parent/dashboard#instant-connect"
                className="flex h-10 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full bg-white px-3 text-[13px] font-bold tracking-tight text-ink shadow-sm transition hover:bg-white/95 active:scale-[0.99] short:h-9 short:text-[12px] sm:h-[50px] sm:px-4 sm:text-[15px] short:sm:h-11 short:sm:text-[13px]"
              >
                <LayoutDashboard className="h-3.5 w-3.5 shrink-0 opacity-90" />
                Track request
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => void onMainCta()}
                disabled={mainDisabled}
                className={cn(
                  "flex h-10 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full px-3 text-[13px] font-bold tracking-tight transition active:scale-[0.99] disabled:opacity-50 short:h-9 short:text-[12px] sm:h-[50px] sm:px-4 sm:text-[15px] short:sm:h-11 short:sm:text-[13px]",
                  mounted
                    ? "bg-white text-ink hover:bg-white/90"
                    : "bg-ink text-white shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.3),inset_0_-1.5px_0.5px_rgba(0,0,0,0.3),0_2px_5px_rgba(0,0,0,0.25)] hover:bg-[#2a231c]",
                )}
              >
                {cta.busy && panel === "stepper" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : mainLabel === "Instant Connect" ||
                  mainLabel === "Find mentors" ||
                  mainLabel === "AI match" ||
                  mainLabel.startsWith("Notify") ? (
                  <Zap className="h-3.5 w-3.5 shrink-0 opacity-90" />
                ) : null}
                {mainLabel}
              </button>
            )}

            {mounted ? (
              <button
                type="button"
                aria-label="Close"
                onClick={close}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-ink transition hover:scale-[1.03] active:scale-[0.98] short:h-9 short:w-9 sm:h-[50px] sm:w-[50px] short:sm:h-11 short:sm:w-11"
              >
                <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2.5} />
              </button>
            ) : showTrack ? (
              <Link
                href="/parent/dashboard#instant-connect"
                aria-label="Track Instant Connect request"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-ink shadow-sm transition hover:scale-[1.03] active:scale-[0.98] short:h-9 short:w-9 sm:h-[50px] sm:w-[50px] short:sm:h-11 short:sm:w-11"
              >
                <LayoutDashboard className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Link>
            ) : (
              <button
                type="button"
                aria-label="Instant Connect"
                onClick={openStepper}
                disabled={loading}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-ink shadow-sm transition hover:scale-[1.03] active:scale-[0.98] disabled:opacity-60 short:h-9 short:w-9 sm:h-[50px] sm:w-[50px] short:sm:h-11 short:sm:w-11"
              >
                <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function GuidePanel() {
  const [beat, setBeat] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const beatStarted = useRef(Date.now());

  useEffect(() => {
    beatStarted.current = Date.now();
    setProgress(0);
  }, [beat]);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      const elapsed = Date.now() - beatStarted.current;
      if (elapsed >= GUIDE_BEAT_MS) {
        beatStarted.current = Date.now();
        setProgress(0);
        setBeat((b) => (b + 1) % GUIDE_BEATS.length);
        return;
      }
      setProgress(elapsed / GUIDE_BEAT_MS);
    }, 40);
    return () => window.clearInterval(id);
  }, [playing, beat]);

  const current = GUIDE_BEATS[beat]!;

  return (
    <div className="pb-1 font-sans text-white short:pb-0">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/45 short:text-[9px]">
            Quick guide
          </p>
          <h2 className="mt-0.5 text-xl font-extrabold leading-tight tracking-tight short:text-lg sm:text-[1.35rem] short:sm:text-xl">
            How Instant Connect works
          </h2>
        </div>
        <button
          type="button"
          aria-label={playing ? "Pause guide" : "Play guide"}
          onClick={() => setPlaying((p) => !p)}
          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/15 transition hover:bg-white/15 short:h-8 short:w-8"
        >
          {playing ? (
            <Pause className="h-3.5 w-3.5" fill="currentColor" />
          ) : (
            <Play className="h-3.5 w-3.5 translate-x-px" fill="currentColor" />
          )}
        </button>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-1.5 short:mt-2 short:gap-1">
        {GUIDE_BEATS.map((b, i) => (
          <button
            key={b.step}
            type="button"
            aria-label={`Step ${b.step}`}
            aria-current={i === beat}
            onClick={() => {
              setBeat(i);
              setPlaying(true);
            }}
            className={cn(
              "rounded-lg px-1 py-1.5 text-center transition short:py-1 sm:py-2 short:sm:py-1.5",
              i === beat
                ? "bg-white text-ink shadow-sm"
                : "bg-white/10 text-white/70 ring-1 ring-white/10 hover:bg-white/15",
            )}
          >
            <span className="block text-[9px] font-bold uppercase tracking-wide opacity-70">
              Step {b.step}
            </span>
            <span className="mt-0.5 block text-[11px] font-extrabold leading-tight short:text-[10px]">
              {i === 0 ? "Ask" : i === 1 ? "Match" : "Call"}
            </span>
          </button>
        ))}
      </div>

      {/* Fixed-height stage — scenes must fit; never spill */}
      <div className="relative mt-3 overflow-hidden rounded-2xl bg-[#12100e] ring-1 ring-white/12 short:mt-2 short:rounded-xl">
        <div className="relative h-[168px] w-full overflow-hidden short:h-[120px] shorter:h-[96px] short-landscape:h-[88px] sm:h-[180px] short:sm:h-[132px]">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(ellipse at 25% 15%, rgba(255,154,77,0.22), transparent 50%), radial-gradient(ellipse at 85% 85%, rgba(47,158,110,0.16), transparent 48%)",
            }}
            aria-hidden
          />
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden p-3 short:p-2">
            {beat === 0 ? <GuideSceneNeed key={`need-${beat}`} /> : null}
            {beat === 1 ? <GuideSceneMatch key={`match-${beat}`} /> : null}
            {beat === 2 ? <GuideSceneCall key={`call-${beat}`} /> : null}
          </div>
        </div>

        <div className="border-t border-white/10 px-3 py-2.5 short:px-2.5 short:py-2 sm:px-3.5 sm:py-3 short:sm:py-2">
          <p
            key={current.title}
            className="mentr-ic-guide-caption text-[13px] font-extrabold leading-snug tracking-tight text-white short:text-[12px] sm:text-[14px]"
          >
            <span className="mr-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-coral text-[10px] font-extrabold text-white short:h-4 short:w-4 short:text-[9px]">
              {current.step}
            </span>
            {current.title}
          </p>
          <p
            key={current.caption}
            className="mentr-ic-guide-caption mt-1 line-clamp-2 text-[11px] font-medium leading-snug text-white/60 short:mt-0.5 short:line-clamp-1 short:text-[10px] sm:text-[12px]"
            style={{ animationDelay: "70ms" }}
          >
            {current.caption}
          </p>
        </div>

        <div className="h-0.5 w-full bg-white/10">
          <div
            className="h-full bg-coral transition-[width] duration-75 ease-linear"
            style={{ width: `${Math.min(100, progress * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function GuideSceneNeed() {
  const rows = [
    { label: "Class", value: "Class 10", delay: 80 },
    { label: "Subject", value: "Maths", delay: 200 },
    { label: "Board", value: "CBSE", delay: 320 },
    { label: "Mode", value: "Online", delay: 440 },
  ];
  return (
    <div className="mentr-ic-guide-scene w-full max-w-[280px] rounded-xl border border-white/15 bg-white/[0.09] p-2.5 shadow-lg backdrop-blur-sm sm:max-w-[300px] sm:p-3">
      <div className="mb-2 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-coral text-white">
          <Zap className="h-3 w-3" />
        </span>
        <p className="text-[11px] font-extrabold text-white">Your requirement</p>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {rows.map((r) => (
          <div
            key={r.label}
            className="mentr-ic-guide-chip flex items-center justify-between gap-1 rounded-lg border border-white/12 bg-white/[0.07] px-2 py-1.5"
            style={{ animationDelay: `${r.delay}ms` }}
          >
            <div className="min-w-0">
              <p className="text-[8px] font-bold uppercase tracking-wide text-white/40">
                {r.label}
              </p>
              <p className="truncate text-[12px] font-extrabold text-white">
                {r.value}
              </p>
            </div>
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-sage text-[9px] text-white">
              ✓
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function GuideSceneMatch() {
  const tutors = [
    { name: "Tutor A", sub: "Maths · CBSE", delay: 80 },
    { name: "Tutor B", sub: "Class 10 · Online", delay: 200 },
    { name: "Tutor C", sub: "Exam prep", delay: 320 },
  ];
  return (
    <div className="mentr-ic-guide-scene flex w-full max-w-[280px] flex-col gap-1.5 sm:max-w-[300px]">
      {tutors.map((t, i) => (
        <div
          key={t.name}
          className="mentr-ic-guide-card flex items-center gap-2 rounded-xl border border-white/12 bg-white/[0.09] px-2.5 py-1.5 backdrop-blur-sm"
          style={{ animationDelay: `${t.delay}ms` }}
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#f7f0e8] text-[10px] font-extrabold text-ink">
            {t.name.slice(-1)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1 text-[12px] font-extrabold text-white">
              {t.name}
              <BadgeCheck className="h-3 w-3 text-sage" />
            </p>
            <p className="text-[10px] font-medium text-white/50">{t.sub}</p>
          </div>
          <span
            className={cn(
              "rounded-md px-2 py-1 text-[9px] font-extrabold",
              i === 0 ? "bg-coral text-white" : "bg-white/15 text-white/80",
            )}
          >
            Select
          </span>
        </div>
      ))}
    </div>
  );
}

function GuideSceneCall() {
  return (
    <div className="mentr-ic-guide-scene flex w-full max-w-[240px] flex-col items-center">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <span className="mentr-ic-guide-ring absolute inset-0 rounded-full border-2 border-sage/45" />
        <span
          className="mentr-ic-guide-ring absolute inset-1 rounded-full border border-sage/30"
          style={{ animationDelay: "0.4s" }}
        />
        <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-sage text-white shadow-lg">
          <Phone className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-2.5 text-[13px] font-extrabold text-white">
        Tutor is calling you
      </p>
      <p className="mt-0.5 text-center text-[11px] font-medium text-white/55">
        Only selected mentors see your number
      </p>
    </div>
  );
}
