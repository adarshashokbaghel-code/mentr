"use client";

import { useAuth } from "@/components/auth/auth-provider";
import {
  InstantConnectStepper,
  type InstantConnectCtaState,
  type InstantConnectStepperHandle,
} from "@/components/instant-connect/instant-connect-stepper";
import { useToast } from "@/components/ui/toast";
import { PARENT_ROLE_TOAST } from "@/hooks/use-role-action";
import { cn } from "@/lib/utils";
import { Loader2, Play, X, Zap } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";

type Panel = "closed" | "guide" | "stepper";

/** Matches Zero Nav spring: bounce 0.2, duration ~0.4s */
const OPEN_MS = 420;
const EASE = "cubic-bezier(0.22, 1.2, 0.36, 1)";

const GUIDE_STEPS = [
  {
    title: "Tell us what you need",
    body: "A few quick taps — class, subject, board, mode.",
  },
  {
    title: "We match verified mentors",
    body: "Up to 3 tutors. You choose who gets your number.",
  },
  {
    title: "They call you",
    body: "Shared only until you close the request (or 48h).",
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

  const mainLabel =
    !mounted || panel === "closed"
      ? "Instant Connect"
      : panel === "guide"
        ? "Instant Connect"
        : cta.label;

  const mainDisabled =
    loading || (panel === "stepper" && mounted && (cta.disabled || cta.busy));

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]",
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

      {/* Fixed-width shell — same 410px rect open & closed (Zero Nav) */}
      <div
        className="pointer-events-auto relative w-full max-w-[410px]"
        role="dialog"
        aria-modal={mounted}
        aria-labelledby={mounted ? titleId : undefined}
      >
        <div
          className={cn(
            "flex w-full flex-col overflow-hidden rounded-[32px] p-1.5 font-sans shadow-[0_12px_40px_rgba(0,0,0,0.28)] ring-1 transition-[background-color,box-shadow,backdrop-filter]",
            mounted
              ? "bg-[rgba(28,28,28,0.78)] shadow-[0_16px_48px_rgba(0,0,0,0.35)] ring-white/12 backdrop-blur-[20px]"
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
                className="max-h-[min(56vh,480px)] overflow-y-auto overscroll-contain px-4 pb-2 pt-5"
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
            className="relative z-10 flex items-center gap-1.5"
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
              className={cn(
                "flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full transition hover:scale-[1.03] active:scale-[0.98]",
                mounted
                  ? "bg-white/15 text-white ring-1 ring-white/20"
                  : "bg-white text-sage shadow-sm",
              )}
            >
              <Play className="h-4 w-4 fill-current" />
            </button>

            <button
              type="button"
              onClick={() => void onMainCta()}
              disabled={mainDisabled}
              className={cn(
                "flex h-[50px] min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full px-4 text-[15px] font-bold tracking-tight transition active:scale-[0.99] disabled:opacity-50",
                mounted
                  ? "bg-white text-ink hover:bg-white/90"
                  : "bg-ink text-white shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.3),inset_0_-1.5px_0.5px_rgba(0,0,0,0.3),0_2px_5px_rgba(0,0,0,0.25)] hover:bg-[#2a231c]",
              )}
            >
              {cta.busy && panel === "stepper" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : mainLabel === "Instant Connect" ||
                mainLabel.startsWith("Notify") ? (
                <Zap className="h-3.5 w-3.5 shrink-0 opacity-90" />
              ) : null}
              {mainLabel}
            </button>

            {mounted ? (
              <button
                type="button"
                aria-label="Close"
                onClick={close}
                className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full bg-white text-ink transition hover:scale-[1.03] active:scale-[0.98]"
              >
                <X className="h-4 w-4" strokeWidth={2.5} />
              </button>
            ) : (
              <button
                type="button"
                aria-label="Instant Connect"
                onClick={openStepper}
                disabled={loading}
                className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full bg-white text-ink shadow-sm transition hover:scale-[1.03] active:scale-[0.98] disabled:opacity-60"
              >
                <Zap className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function GuidePanel() {
  return (
    <div className="pb-1 font-sans text-center text-white">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">
        Quick guide
      </p>
      <h2 className="mt-1 text-2xl font-bold tracking-tight">
        How it works
      </h2>
      <ol className="mt-6 space-y-5 text-left">
        {GUIDE_STEPS.map((s, i) => (
          <li key={s.title} className="flex gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white ring-1 ring-white/15">
              {i + 1}
            </span>
            <div>
              <p className="text-lg font-bold tracking-tight text-white">
                {s.title}
              </p>
              <p className="mt-0.5 text-sm font-medium leading-relaxed text-white/50">
                {s.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
