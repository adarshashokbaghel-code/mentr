"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { useRoleAction } from "@/hooks/use-role-action";
import { ApiError, connectionsApi, type ConnectionStatus } from "@/lib/api";
import { whatsappLink } from "@/lib/teachers";
import { cn } from "@/lib/utils";
import {
  Check,
  Clock3,
  Loader2,
  Lock,
  MessageCircle,
  Send,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const MESSAGE_MIN = 10;
const MESSAGE_MAX = 500;

export interface ConnectTeacher {
  id: string;
  name: string;
  subjectLine: string;
  phone: string | null;
  connectionStatus?: "none" | ConnectionStatus;
  live?: boolean;
}

/**
 * The single gateway to a teacher's WhatsApp number.
 *
 * none/declined → "Connect" (opens the request modal, message compulsory)
 * pending       → "Requested" (waiting on the teacher)
 * accepted      → real WhatsApp link
 *
 * Logged out → role chooser. Faculty accounts see nothing: connections
 * are strictly parent → teacher.
 */
export function ConnectButton({
  teacher,
  className,
  requestedClassName,
  label = "Connect",
}: {
  teacher: ConnectTeacher;
  /** Applied to the actionable button/link state */
  className?: string;
  /** Applied to the disabled "Requested" state (falls back to className) */
  requestedClassName?: string;
  label?: string;
}) {
  const { user, openRoleChooser } = useAuth();
  const { requireParent } = useRoleAction();
  const pathname = usePathname();
  const [modalOpen, setModalOpen] = useState(false);
  const [status, setStatus] = useState<"none" | ConnectionStatus>(
    teacher.connectionStatus ?? "none",
  );
  const [phone, setPhone] = useState(teacher.phone);

  // Server data can arrive after first render (client-side fetches)
  useEffect(() => {
    setStatus(teacher.connectionStatus ?? "none");
    setPhone(teacher.phone);
  }, [teacher.connectionStatus, teacher.phone]);

  if (user && user.role !== "parent") {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          requireParent();
        }}
        className={className}
      >
        <MessageCircle className="h-[1em] w-[1em]" />
        {label}
      </button>
    );
  }

  if (!user) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          openRoleChooser(pathname ?? undefined);
        }}
        className={className}
      >
        <MessageCircle className="h-[1em] w-[1em]" />
        {label}
      </button>
    );
  }

  if (status === "accepted" && phone) {
    return (
      <a
        href={whatsappLink({
          name: teacher.name,
          subjectLine: teacher.subjectLine,
          phone,
        })}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className={className}
      >
        <MessageCircle className="h-[1em] w-[1em]" />
        WhatsApp
      </a>
    );
  }

  if (status === "pending") {
    return (
      <span
        className={cn(requestedClassName ?? className, "cursor-default")}
        title="Waiting for the tutor to accept your request"
      >
        <Clock3 className="h-[1em] w-[1em]" />
        Requested
      </span>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setModalOpen(true);
        }}
        className={className}
      >
        <MessageCircle className="h-[1em] w-[1em]" />
        {status === "declined" ? "Request again" : label}
      </button>

      {modalOpen && (
        <ConnectRequestModal
          teacher={teacher}
          onClose={() => setModalOpen(false)}
          onSent={() => setStatus("pending")}
        />
      )}
    </>
  );
}

export function ConnectRequestModal({
  teacher,
  onClose,
  onSent,
}: {
  teacher: ConnectTeacher;
  onClose: () => void;
  onSent: () => void;
}) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const isDemo = teacher.live !== true;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSend() {
    const trimmed = message.trim();
    if (trimmed.length < MESSAGE_MIN) {
      setError(
        `Write at least ${MESSAGE_MIN} characters so ${teacher.name.split(" ")[0]} knows what you need`,
      );
      return;
    }
    setError("");
    setSending(true);
    try {
      await connectionsApi.send(teacher.id, trimmed);
      setSent(true);
      onSent();
    } catch (err) {
      if (err instanceof ApiError && err.data?.code === "ALREADY_PENDING") {
        setSent(true);
        onSent();
      } else {
        setError(
          err instanceof ApiError ? err.message : "Failed to send. Try again.",
        );
      }
    } finally {
      setSending(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[110] flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="connect-modal-title"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        className="absolute inset-0 bg-ink/40"
        aria-label="Close"
        onClick={onClose}
      />

      <div className="champs-pop relative z-10 w-full max-w-md rounded-t-xl border border-hairline bg-white p-5 shadow-xl sm:rounded-xl sm:p-6">
        {sent ? (
          <div className="py-4 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sage-wash">
              <Check className="h-6 w-6 text-sage" />
            </span>
            <h2 className="mt-4 text-lg font-bold text-ink">Request sent</h2>
            <p className="mx-auto mt-1.5 max-w-[300px] text-sm leading-relaxed text-muted">
              {teacher.name} will review your message. Once they accept,
              their WhatsApp number unlocks for you — check your dashboard
              for updates.
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
                  id="connect-modal-title"
                  className="text-lg font-bold text-ink"
                >
                  Connect with {teacher.name.split(" ")[0]}
                </h2>
                <p className="mt-0.5 text-xs text-muted">
                  {teacher.subjectLine}
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

            <div className="mt-4 flex items-start gap-2.5 rounded-lg bg-butter/40 px-3.5 py-3">
              <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink/60" />
              <p className="text-xs leading-relaxed text-ink/80">
                Numbers stay private on Mentr. The tutor reads your message
                first — their WhatsApp number is shared with you only after
                they accept.
              </p>
            </div>

            {isDemo && (
              <p className="mt-3 rounded-md border border-hairline bg-cream px-3 py-2 text-xs font-medium text-muted">
                This is a demo profile for illustration — connect with a live
                tutor to try the flow.
              </p>
            )}

            <label className="mt-4 block">
              <span className="mb-1.5 flex items-baseline justify-between text-[13px] font-semibold text-ink">
                Your message
                <span
                  className={cn(
                    "text-[11px] font-medium tabular-nums",
                    message.length > MESSAGE_MAX ? "text-coral-dark" : "text-muted",
                  )}
                >
                  {message.length}/{MESSAGE_MAX}
                </span>
              </span>
              <textarea
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value.slice(0, MESSAGE_MAX))
                }
                rows={4}
                autoFocus
                placeholder={`e.g. Looking for ${teacher.subjectLine} classes for my daughter in Class 9 — weekends preferred. Are you available?`}
                className="w-full resize-none rounded-md border border-hairline bg-white px-3.5 py-3 text-sm leading-relaxed text-ink outline-none transition placeholder:text-muted/70 focus:border-ink/40"
              />
              <span className="mt-1 block text-[11px] text-muted">
                Helpful info — mention the class, subject and timings you need.
              </span>
            </label>

            {error && (
              <p className="mt-3 rounded-md border border-coral/40 bg-coral-wash px-3 py-2 text-[13px] font-medium text-coral-dark">
                {error}
              </p>
            )}

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
                onClick={handleSend}
                disabled={sending || isDemo || message.trim().length < MESSAGE_MIN}
                className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-md bg-coral text-sm font-semibold text-white transition hover:bg-coral-dark disabled:opacity-50"
              >
                {sending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {sending ? "Sending…" : "Send request"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
