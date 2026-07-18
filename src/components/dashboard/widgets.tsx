"use client";

import { cn } from "@/lib/utils";
import {
  ApiError,
  connectionsApi,
  type ConnectionRequest,
  type ProfileViewer,
  type ProfileViewsResponse,
} from "@/lib/api";
import {
  Bell,
  Check,
  ChevronDown,
  Eye,
  Loader2,
  Send,
  Sparkles,
  UserPlus,
  UsersRound,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const MESSAGE_MIN = 10;
const MESSAGE_MAX = 500;

/* ------------------------------ helpers ------------------------------ */

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

const AVATAR_TONES = [
  "bg-coral text-white",
  "bg-sage text-white",
  "bg-butter-deep text-ink",
  "bg-lavender-deep text-ink",
  "bg-sky text-ink",
];

function LetterAvatar({
  name,
  index,
  className,
}: {
  name: string;
  index: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full text-xs font-bold",
        AVATAR_TONES[index % AVATAR_TONES.length],
        className,
      )}
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}

/** Click-outside + Escape for popovers */
function useDismiss(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);
  return ref;
}

/* ------------------------------ stat card ------------------------------ */

/**
 * Standard dashboard KPI card: muted label + tinted icon up top, big
 * tabular number, and a hairline-separated context footer.
 */
export function StatCard({
  label,
  value,
  icon: Icon,
  tone,
  footer,
}: {
  label: string;
  /** null renders a loading skeleton */
  value: number | null;
  icon: LucideIcon;
  tone: string;
  footer?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-hairline bg-white p-4 shadow-[0_1px_3px_rgba(28,26,23,0.05)] transition sm:p-5",
        "hover:border-ink/15 hover:shadow-[0_4px_14px_rgba(28,26,23,0.08)]",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-[13px] font-medium text-muted">{label}</p>
        <span
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg",
            tone,
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>

      {value === null ? (
        <span className="mt-4 block h-8 w-14 animate-pulse rounded-md bg-cream-band" />
      ) : (
        <p className="mt-4 text-[32px] font-bold leading-none tracking-tight text-ink tabular-nums">
          {value}
        </p>
      )}

      {footer !== undefined && (
        <div className="mt-4 flex min-h-[26px] items-center border-t border-hairline pt-2.5">
          {typeof footer === "string" ? (
            <span className="truncate text-xs text-muted">{footer}</span>
          ) : (
            footer
          )}
        </div>
      )}
    </div>
  );
}

/* --------------------------- who viewed card --------------------------- */

function viewerStatusLabel(v: ProfileViewer): string | null {
  if (v.connectionStatus === "accepted") return "Connected";
  if (v.connectionStatus === "pending" && v.requestedBy === "parent") {
    return "In your inbox";
  }
  if (v.connectionStatus === "pending" && v.requestedBy === "teacher") {
    return "Request sent";
  }
  return null;
}

function ViewerOutreachModal({
  viewer,
  onClose,
  onSent,
}: {
  viewer: ProfileViewer;
  onClose: () => void;
  onSent: () => void;
}) {
  const [message, setMessage] = useState("");
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
    const trimmed = message.trim();
    if (trimmed.length < MESSAGE_MIN) {
      setError(
        `Write at least ${MESSAGE_MIN} characters so ${viewer.name.split(" ")[0]} knows why you're reaching out`,
      );
      return;
    }
    setError("");
    setSending(true);
    try {
      await connectionsApi.outreach(viewer.id, trimmed);
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
      aria-labelledby="outreach-modal-title"
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
              {viewer.name.split(" ")[0]} will review your message. If they
              accept, your WhatsApp number unlocks for them.
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
                  id="outreach-modal-title"
                  className="text-lg font-bold text-ink"
                >
                  Connect with {viewer.name.split(" ")[0]}
                </h2>
                <p className="mt-0.5 text-xs text-muted">
                  {viewer.area ? `${viewer.area} · ` : ""}
                  viewed your profile
                  {viewer.count > 1 ? ` · ${viewer.count} visits` : ""}
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

            <p className="mt-4 rounded-lg bg-butter/40 px-3.5 py-3 text-xs leading-relaxed text-ink/80">
              They looked at your listing but haven&apos;t connected yet. Send a
              short intro — your WhatsApp number is shared only if they accept.
            </p>

            <label className="mt-4 block">
              <span className="mb-1.5 flex items-baseline justify-between text-[13px] font-semibold text-ink">
                Your message
                <span
                  className={cn(
                    "text-[11px] font-medium tabular-nums",
                    message.length > MESSAGE_MAX
                      ? "text-coral-dark"
                      : "text-muted",
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
                placeholder={`e.g. Hi — I saw you viewed my profile. I teach Class 9–12 Maths with online and home options in ${viewer.area || "your area"}. Happy to discuss timings if you're still looking.`}
                className="w-full resize-none rounded-md border border-hairline bg-white px-3.5 py-3 text-sm leading-relaxed text-ink outline-none transition placeholder:text-muted/70 focus:border-ink/40"
              />
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
                disabled={sending || message.trim().length < MESSAGE_MIN}
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

export function WhoViewedCard({
  data,
  loading,
  onRefresh,
}: {
  data: ProfileViewsResponse | null;
  loading: boolean;
  onRefresh?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [outreachTarget, setOutreachTarget] = useState<ProfileViewer | null>(
    null,
  );
  const ref = useDismiss(open, () => setOpen(false));

  const viewers = data?.views ?? [];
  const preview = viewers.slice(0, 4);

  function handleOutreachSent() {
    onRefresh?.();
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "w-full rounded-xl border border-hairline bg-white p-4 text-left shadow-[0_1px_3px_rgba(28,26,23,0.05)] transition sm:p-5",
          "hover:border-ink/15 hover:shadow-[0_4px_14px_rgba(28,26,23,0.08)]",
          open && "border-ink/15 shadow-[0_4px_14px_rgba(28,26,23,0.08)]",
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <p className="text-[13px] font-medium text-muted">
            Profile views
            <span className="ml-1.5 rounded bg-cream px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted">
              7d
            </span>
          </p>
          <span className="flex items-center gap-1">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-coral-wash">
              <Eye className="h-4 w-4 text-coral" />
            </span>
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 text-muted transition-transform",
                open && "rotate-180",
              )}
            />
          </span>
        </div>

        {loading ? (
          <span className="mt-4 block h-8 w-14 animate-pulse rounded-md bg-cream-band" />
        ) : (
          <p className="mt-4 text-[32px] font-bold leading-none tracking-tight text-ink tabular-nums">
            {data?.weekCount ?? 0}
          </p>
        )}

        <div className="mt-4 flex min-h-[26px] items-center justify-between gap-2 border-t border-hairline pt-2.5">
          {preview.length > 0 ? (
            <>
              <span className="flex -space-x-1.5">
                {preview.map((v, i) => (
                  <LetterAvatar
                    key={v.id}
                    name={v.name}
                    index={i}
                    className="h-5 w-5 text-[10px] ring-2 ring-white"
                  />
                ))}
              </span>
              <span className="truncate text-xs text-muted">
                {data?.totalViewers ?? 0} parent
                {(data?.totalViewers ?? 0) === 1 ? "" : "s"} all time
              </span>
            </>
          ) : (
            <span className="truncate text-xs text-muted">
              {loading ? "Loading…" : "No views yet — share your listing"}
            </span>
          )}
        </div>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Who saw your profile"
          className="champs-pop absolute left-0 top-[calc(100%+8px)] z-40 w-full min-w-[300px] rounded-xl border border-hairline bg-white p-1.5 shadow-[0_12px_32px_rgba(26,35,28,0.14)] sm:w-[340px]"
        >
          <div className="flex items-center justify-between rounded-lg bg-cream px-3 py-2.5">
            <p className="text-sm font-bold text-ink">Who saw your profile</p>
            <span className="rounded-md bg-white px-2 py-0.5 text-xs font-semibold text-muted">
              {data?.totalViewers ?? 0} parent{(data?.totalViewers ?? 0) === 1 ? "" : "s"}
            </span>
          </div>

          {viewers.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <UsersRound className="mx-auto h-6 w-6 text-hairline" />
              <p className="mt-2 text-sm font-medium text-ink">No views yet</p>
              <p className="mt-1 text-xs text-muted">
                When parents open your listing, they&apos;ll show up here.
              </p>
            </div>
          ) : (
            <ul className="max-h-[320px] overflow-y-auto py-1">
              {viewers.map((v, i) => {
                const status = viewerStatusLabel(v);
                return (
                  <li
                    key={v.id}
                    className="flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-cream"
                  >
                    <LetterAvatar
                      name={v.name}
                      index={i}
                      className="h-9 w-9 text-sm"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink">
                        {v.name}
                      </p>
                      <p className="truncate text-xs text-muted">
                        {v.area ? `${v.area} · ` : ""}
                        {v.count > 1 ? `${v.count} visits` : "1 visit"}
                        {status ? ` · ${status}` : ""}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <span className="text-[11px] font-medium text-muted">
                        {timeAgo(v.lastViewedAt)}
                      </span>
                      {v.canReachOut && (
                        <button
                          type="button"
                          onClick={() => setOutreachTarget(v)}
                          className="inline-flex h-7 items-center gap-1 rounded-md bg-coral px-2.5 text-[11px] font-bold text-white transition hover:bg-coral-dark"
                        >
                          <UserPlus className="h-3 w-3" />
                          Connect
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          <p className="border-t border-hairline px-3 py-2 text-[11px] text-muted">
            Parents who opened your listing while signed in. Send a connect
            request with a message — no lead fees.
          </p>
        </div>
      )}

      {outreachTarget && (
        <ViewerOutreachModal
          viewer={outreachTarget}
          onClose={() => setOutreachTarget(null)}
          onSent={handleOutreachSent}
        />
      )}
    </div>
  );
}

/* --------------------------- notifications bell --------------------------- */

const SEEN_KEY = "mentr_notifications_seen_at";

interface NotificationItem {
  id: string;
  text: string;
  detail?: string;
  at: string | null;
  icon: "eye" | "spark" | "request";
}

export function NotificationsBell({
  data,
  requests = [],
}: {
  data: ProfileViewsResponse | null;
  requests?: ConnectionRequest[];
}) {
  const [open, setOpen] = useState(false);
  const [seenAt, setSeenAt] = useState<number>(() =>
    typeof window === "undefined"
      ? Date.now()
      : Number(localStorage.getItem(SEEN_KEY) || 0),
  );
  const ref = useDismiss(open, () => setOpen(false));

  const pendingRequests = requests.filter((r) => r.status === "pending");

  const items: NotificationItem[] = [
    ...pendingRequests.slice(0, 6).map((r) => ({
      id: `request-${r.id}`,
      text: `${r.parentName} wants to connect`,
      detail: r.message,
      at: r.sentAt,
      icon: "request" as const,
    })),
    ...(data?.views ?? []).slice(0, 6).map((v) => ({
      id: `view-${v.id}-${v.lastViewedAt}`,
      text: `${v.name} viewed your profile`,
      detail: v.area ?? undefined,
      at: v.lastViewedAt,
      icon: "eye" as const,
    })),
    {
      id: "live",
      text: "Your profile is live on Mentr",
      detail: "Parents nearby can find and contact you",
      at: null,
      icon: "spark" as const,
    },
  ];

  const unread =
    (data?.views ?? []).filter(
      (v) => new Date(v.lastViewedAt).getTime() > seenAt,
    ).length +
    pendingRequests.filter((r) => new Date(r.sentAt).getTime() > seenAt)
      .length;

  function toggle() {
    setOpen((o) => {
      const next = !o;
      if (next) {
        const now = Date.now();
        localStorage.setItem(SEEN_KEY, String(now));
        // delay clearing the badge until close so the count is visible in the panel
      }
      return next;
    });
  }

  function close() {
    setOpen(false);
    setSeenAt(Number(localStorage.getItem(SEEN_KEY) || 0));
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Notifications${unread > 0 ? ` (${unread} new)` : ""}`}
        onClick={() => (open ? close() : toggle())}
        className={cn(
          "relative flex h-10 w-10 items-center justify-center rounded-lg border border-hairline bg-white transition hover:bg-cream",
          open && "bg-cream",
        )}
      >
        <Bell className="h-[18px] w-[18px] text-ink" />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-coral px-1 text-[10px] font-bold text-white ring-2 ring-cream">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Notifications"
          className="champs-pop absolute right-0 top-[calc(100%+8px)] z-40 w-[320px] rounded-xl border border-hairline bg-white p-1.5 shadow-[0_12px_32px_rgba(26,35,28,0.14)]"
        >
          <div className="flex items-center justify-between rounded-lg bg-cream px-3 py-2.5">
            <p className="text-sm font-bold text-ink">Notifications</p>
            {unread > 0 && (
              <span className="rounded-md bg-coral px-2 py-0.5 text-[11px] font-bold text-white">
                {unread} new
              </span>
            )}
          </div>

          <ul className="max-h-[320px] overflow-y-auto py-1">
            {items.map((n) => {
              const isNew =
                n.at !== null && new Date(n.at).getTime() > seenAt;
              return (
                <li
                  key={n.id}
                  className={cn(
                    "flex items-start gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-cream",
                    isNew && "bg-coral-wash/50",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                      n.icon === "eye"
                        ? "bg-coral-wash text-coral"
                        : n.icon === "request"
                          ? "bg-lavender text-ink"
                          : "bg-sage-wash text-sage",
                    )}
                  >
                    {n.icon === "eye" ? (
                      <Eye className="h-4 w-4" />
                    ) : n.icon === "request" ? (
                      <UserPlus className="h-4 w-4" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold leading-snug text-ink">
                      {n.text}
                    </p>
                    {n.detail && (
                      <p className="truncate text-xs text-muted">{n.detail}</p>
                    )}
                  </div>
                  {n.at && (
                    <span className="shrink-0 text-[11px] font-medium text-muted">
                      {timeAgo(n.at)}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
