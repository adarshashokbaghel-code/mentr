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
import { ApiError, authApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CONFIRM_WORD = "delete";

export function DeleteAccountSection() {
  const { logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const confirmed = typed.trim() === CONFIRM_WORD;

  function close() {
    if (busy) return;
    setOpen(false);
    setTyped("");
    setError("");
  }

  async function onDelete() {
    if (!confirmed || busy) return;
    setBusy(true);
    setError("");
    try {
      await authApi.deleteAccount();
      await logout();
      router.replace("/");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not delete this account. Try again.",
      );
      setBusy(false);
    }
  }

  return (
    <section className="mt-10 border-t border-hairline pt-6">
      <h2 className="text-sm font-bold text-ink">Delete account</h2>
      <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-muted">
        Removes your profile, posts, and sign-in. This does not refund a Premium
        payment. Razorpay may keep the record of a charge that already went through.
      </p>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 text-[13px] font-semibold text-coral underline-offset-2 hover:underline"
      >
        Delete my account
      </button>

      <Dialog open={open} onOpenChange={(next) => (next ? setOpen(true) : close())}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete this account?</DialogTitle>
            <DialogDescription>
              Your profile comes down and you are signed out. Type {CONFIRM_WORD} to
              confirm. This cannot be undone from the dashboard.
            </DialogDescription>
          </DialogHeader>
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-semibold text-ink">
              Type {CONFIRM_WORD}
            </span>
            <input
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              disabled={busy}
              className="h-11 w-full rounded-md border border-hairline bg-white px-3 text-[15px] text-ink outline-none focus:border-ink/40"
            />
          </label>
          {error ? (
            <p className="text-[13px] font-medium text-coral">{error}</p>
          ) : null}
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={close} disabled={busy}>
              Cancel
            </Button>
            <Button type="button" onClick={() => void onDelete()} disabled={!confirmed || busy}>
              {busy ? "Deleting…" : "Delete account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
