"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { homeFor } from "@/lib/auth-routes";
import { cn } from "@/lib/utils";
import { Loader2, Megaphone, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const POST_DEST = "/parent/dashboard";

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
  const router = useRouter();
  const [gateOpen, setGateOpen] = useState(false);
  const [switching, setSwitching] = useState(false);

  function goToPost() {
    if (!user || user.role !== "parent") return;
    router.push(homeFor(user, POST_DEST));
  }

  function handleClick() {
    if (loading) return;
    if (user?.role === "parent") {
      goToPost();
      return;
    }
    setGateOpen(true);
  }

  async function handleLoginAsParent() {
    setSwitching(true);
    try {
      if (user) await logout();
      router.push(
        `/parent?next=${encodeURIComponent(POST_DEST)}`,
      );
      setGateOpen(false);
    } finally {
      setSwitching(false);
    }
  }

  const signedInAsTutor = user?.role === "faculty";

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
        <DialogContent className="gap-0 overflow-hidden border-hairline bg-white p-0 sm:max-w-md">
          <DialogHeader className="border-b border-hairline bg-cream/30 px-6 py-5">
            <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-coral-wash">
              <Users className="h-5 w-5 text-coral" />
            </span>
            <DialogTitle className="text-lg font-bold text-ink">
              Parents post requirements
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed text-muted">
              {signedInAsTutor
                ? "You're signed in as a tutor. Only parent accounts can post a learning need — tutors respond on the board instead."
                : "Only parents can post what their child needs. Verified tutors pitch on the board; you pick who to connect with on WhatsApp."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 px-6 py-5">
            <ul className="space-y-2 text-sm text-ink">
              <li className="flex gap-2">
                <span className="font-bold text-coral">1.</span>
                Post subject, class & area — stay anonymous
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-coral">2.</span>
                Tutors send free pitches with their profile
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-coral">3.</span>
                Accept one → WhatsApp unlocks. ₹0 fees
              </li>
            </ul>
            {signedInAsTutor && (
              <p className="rounded-lg border border-hairline bg-cream/60 px-3.5 py-2.5 text-xs text-muted">
                Continuing will sign you out of your tutor account.
              </p>
            )}
          </div>

          <DialogFooter className="border-t border-hairline bg-cream/20 px-6 py-4 sm:justify-stretch">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setGateOpen(false)}
              disabled={switching}
            >
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleLoginAsParent} disabled={switching}>
              {switching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Users className="h-4 w-4" />
              )}
              {switching ? "Switching…" : "Login as parent"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
