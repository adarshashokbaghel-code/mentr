"use client";

import { cn } from "@/lib/utils";
import type { ConnectionRequest, ProfileViewsResponse } from "@/lib/api";
import {
  Bell,
  ChevronDown,
  Eye,
  Sparkles,
  UserPlus,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

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

export function WhoViewedCard({
  data,
  loading,
}: {
  data: ProfileViewsResponse | null;
  loading: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useDismiss(open, () => setOpen(false));

  const viewers = data?.views ?? [];
  const preview = viewers.slice(0, 4);

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
              {viewers.map((v, i) => (
                <li
                  key={v.id}
                  className="flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-cream"
                >
                  <LetterAvatar name={v.name} index={i} className="h-9 w-9 text-sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">
                      {v.name}
                    </p>
                    <p className="truncate text-xs text-muted">
                      {v.area ? `${v.area} · ` : ""}
                      {v.count > 1 ? `${v.count} visits` : "1 visit"}
                    </p>
                  </div>
                  <span className="shrink-0 text-[11px] font-medium text-muted">
                    {timeAgo(v.lastViewedAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <p className="border-t border-hairline px-3 py-2 text-[11px] text-muted">
            Parents who opened your listing while signed in.
          </p>
        </div>
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
