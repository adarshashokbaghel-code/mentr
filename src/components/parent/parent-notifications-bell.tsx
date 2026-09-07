"use client";

import { timeAgo } from "@/components/dashboard/widgets";
import {
  notificationsApi,
  type ParentNotification,
  type ParentNotificationType,
} from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  Bell,
  Calendar,
  Check,
  Loader2,
  Megaphone,
  UserPlus,
  X,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const POLL_MS = 60_000;

function iconForType(type: ParentNotificationType) {
  switch (type) {
    case "connection_accepted":
      return { Icon: Check, className: "bg-sage-wash text-sage" };
    case "connection_declined":
      return { Icon: X, className: "bg-cream-band text-muted" };
    case "requirement_pitch":
      return { Icon: Megaphone, className: "bg-lavender text-ink" };
    case "teacher_outreach":
      return { Icon: UserPlus, className: "bg-coral-wash text-coral" };
    case "tutor_slots_open":
      return { Icon: Calendar, className: "bg-coral-wash text-coral" };
    default:
      return { Icon: Bell, className: "bg-cream-band text-ink" };
  }
}

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

/** Parent in-app notification bell — backed by `/api/notifications`. */
export function ParentNotificationsBell() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ParentNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const refresh = useCallback(async () => {
    try {
      const data = await notificationsApi.list();
      setItems(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch {
      /* ignore — bell stays usable with last known state */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const id = window.setInterval(() => void refresh(), POLL_MS);
    return () => window.clearInterval(id);
  }, [refresh]);

  const close = useCallback(() => setOpen(false), []);
  const ref = useDismiss(open, close);

  async function openPanel() {
    setOpen(true);
    if (unreadCount > 0) {
      try {
        await notificationsApi.markAllRead();
        setUnreadCount(0);
        setItems((prev) => prev.map((n) => ({ ...n, read: true })));
      } catch {
        /* badge may reappear on next poll */
      }
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} new)` : ""}`}
        onClick={() => (open ? close() : void openPanel())}
        className={cn(
          "relative flex h-10 w-10 items-center justify-center rounded-lg border border-hairline bg-white transition hover:bg-cream",
          open && "bg-cream",
        )}
      >
        <Bell className="h-[18px] w-[18px] text-ink" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-coral px-1 text-[10px] font-bold text-white ring-2 ring-cream">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Notifications"
          className="champs-pop absolute right-0 top-[calc(100%+8px)] z-50 w-[320px] rounded-xl border border-hairline bg-white p-1.5 shadow-[0_12px_32px_rgba(26,35,28,0.14)]"
        >
          <div className="flex items-center justify-between rounded-lg bg-cream px-3 py-2.5">
            <p className="text-sm font-bold text-ink">Updates</p>
            {unreadCount > 0 && (
              <span className="rounded-md bg-coral px-2 py-0.5 text-[11px] font-bold text-white">
                {unreadCount} new
              </span>
            )}
          </div>

          {loading && items.length === 0 ? (
            <div className="flex items-center justify-center py-10 text-muted">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted">
              No updates yet — connect with tutors or post a requirement to get
              notified here.
            </p>
          ) : (
            <ul className="max-h-[320px] overflow-y-auto py-1">
              {items.map((n) => {
                const { Icon, className } = iconForType(n.type);
                return (
                  <li key={n.id}>
                    <Link
                      href={n.href}
                      role="menuitem"
                      onClick={() => {
                        close();
                        if (!n.read) {
                          void notificationsApi.markRead(n.id);
                        }
                      }}
                      className={cn(
                        "flex items-start gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-cream",
                        !n.read && "bg-coral-wash/50",
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                          className,
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-semibold leading-snug text-ink">
                          {n.title}
                        </p>
                        <p className="line-clamp-2 text-xs text-muted">
                          {n.body}
                        </p>
                      </div>
                      <span className="shrink-0 text-[11px] font-medium text-muted">
                        {timeAgo(n.createdAt)}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="border-t border-hairline px-3 py-2">
            <Link
              href="/parent/dashboard"
              className="text-xs font-semibold text-coral hover:underline"
              onClick={close}
            >
              Open dashboard →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
