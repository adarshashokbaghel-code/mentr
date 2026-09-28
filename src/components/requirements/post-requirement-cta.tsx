"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { PARENT_ROLE_TOAST } from "@/hooks/use-role-action";
import { homeFor } from "@/lib/auth-routes";
import { cn } from "@/lib/utils";
import { Loader2, Megaphone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const POST_DEST = "/parent/dashboard";

const GATE_STEPS = [
  {
    title: "Post your need",
    body: "Subject, class and area. You stay anonymous.",
  },
  {
    title: "Get free pitches",
    body: "Verified tutors reply with their profile.",
  },
  {
    title: "Pick one and chat",
    body: "Accept a tutor and WhatsApp unlocks. No fees, ever.",
  },
];

type PostRequirementButtonProps = {
  label?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  showIcon?: boolean;
};

/** Parent-only gate: post a learning need to the requirements board. */
export function PostRequirementButton({
  label = "Post your requirement",
  size = "md",
  variant = "secondary",
  className,
  showIcon = true,
}: PostRequirementButtonProps) {
  const { user, loading, logout } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [gateOpen, setGateOpen] = useState(false);
  const [switching, setSwitching] = useState(false);

  function handleClick() {
    if (loading) return;
    if (user?.role === "parent") {
      router.push(homeFor(user, POST_DEST));
      return;
    }
    if (user) {
      toast(PARENT_ROLE_TOAST);
      return;
    }
    setGateOpen(true);
  }

  async function handleLoginAsParent() {
    setSwitching(true);
    try {
      if (user) await logout();
      router.push(`/parent/signup?next=${encodeURIComponent(POST_DEST)}`);
      setGateOpen(false);
    } finally {
      setSwitching(false);
    }
  }

  return (
    <>
      <Button
        type="button"
        size={size}
        variant={variant}
        className={cn(className)}
        onClick={handleClick}
        disabled={loading}
      >
        {showIcon && <Megaphone className="h-4 w-4" />}
        {label}
      </Button>

      <Dialog open={gateOpen} onOpenChange={setGateOpen}>
        <DialogContent className="max-h-[min(92dvh,640px)] gap-0 overflow-y-auto rounded-t-3xl border-0 bg-white p-0 sm:max-w-[420px] sm:rounded-3xl sm:p-0">
          <span
            aria-hidden
            className="mx-auto mt-2.5 block h-1 w-10 rounded-full bg-hairline sm:hidden"
          />

          <DialogHeader className="px-5 pb-1 pt-5 text-left sm:px-7 sm:pt-7">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-coral-wash">
              <Megaphone className="h-5 w-5 text-coral" />
            </span>
            <DialogTitle className="mt-4 text-[1.35rem] font-bold leading-tight tracking-tight text-ink sm:text-2xl">
              Post what your child needs
            </DialogTitle>
            <DialogDescription className="mt-1.5 text-[14px] leading-relaxed text-muted">
              Posting is for parents only. Tutors reply to you — you decide who
              to talk to.
            </DialogDescription>
          </DialogHeader>

          <ol className="relative mx-5 mt-5 space-y-4 sm:mx-7">
            <span
              aria-hidden
              className="absolute bottom-4 left-[15px] top-4 w-px bg-hairline"
            />
            {GATE_STEPS.map((step, i) => (
              <li key={step.title} className="relative flex gap-3.5">
                <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[13px] font-bold text-coral ring-2 ring-coral/25">
                  {i + 1}
                </span>
                <div className="min-w-0 pt-1">
                  <p className="text-[15px] font-semibold leading-tight text-ink">
                    {step.title}
                  </p>
                  <p className="mt-1 text-[13px] leading-snug text-muted">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-6 space-y-2 border-t border-hairline px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 sm:px-7 sm:pb-7">
            <Button
              className="h-12 w-full rounded-xl text-[15px] font-bold"
              onClick={handleLoginAsParent}
              disabled={switching}
            >
              {switching ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {switching ? "Just a sec…" : "Create free parent account"}
            </Button>
            <button
              type="button"
              onClick={() => setGateOpen(false)}
              disabled={switching}
              className="h-10 w-full rounded-xl text-sm font-semibold text-muted transition hover:bg-cream hover:text-ink"
            >
              Not now
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
