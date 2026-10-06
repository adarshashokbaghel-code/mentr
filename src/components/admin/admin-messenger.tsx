"use client";

import { AdminPassDialog } from "@/components/admin/admin-pass-dialog";
import {
  fetchAdminCoupons,
  fetchMessengerTemplates,
  previewMessengerEmail,
  searchAdminUsers,
  sendMessengerEmails,
  type AdminCoupon,
  type AdminUserRow,
  type MessengerTemplateMeta,
} from "@/lib/admin-api";
import { cn } from "@/lib/utils";
import { Check, Loader2, Search, Send } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type Props = {
  adminKey: string;
};

const JOINED_FILTERS = [
  { id: "all", label: "All joined", days: null },
  { id: "7", label: "Last 7 days", days: 7 },
  { id: "10", label: "Last 10 days", days: 10 },
  { id: "15", label: "Last 15 days", days: 15 },
] as const;

type JoinedFilterId = (typeof JOINED_FILTERS)[number]["id"];

function sentStorageKey(templateId: string) {
  return `mentr-messenger-sent:${templateId}`;
}

function readSentIds(templateId: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(sentStorageKey(templateId));
    const ids = raw ? (JSON.parse(raw) as unknown) : [];
    return new Set(Array.isArray(ids) ? ids.filter((id) => typeof id === "string") : []);
  } catch {
    return new Set();
  }
}

function joinedWithin(iso: string, days: number) {
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return false;
  return Date.now() - t <= days * 24 * 60 * 60 * 1000;
}

function joinedLabel(iso: string) {
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return "";
  const days = Math.floor((Date.now() - t) / (24 * 60 * 60 * 1000));
  if (days <= 0) return "joined today";
  if (days === 1) return "joined yesterday";
  return `joined ${days}d ago`;
}

export function AdminMessenger({ adminKey }: Props) {
  const [templates, setTemplates] = useState<MessengerTemplateMeta[]>([]);
  const [templateId, setTemplateId] = useState("initial-user");
  const [previewName, setPreviewName] = useState("Educator");
  const [couponCode, setCouponCode] = useState("");
  const [couponOptions, setCouponOptions] = useState<AdminCoupon[]>([]);
  const [previewHtml, setPreviewHtml] = useState("");
  const [previewSubject, setPreviewSubject] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);

  const [query, setQuery] = useState("");
  const [joinedFilter, setJoinedFilter] = useState<JoinedFilterId>("all");
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const [sending, setSending] = useState(false);
  const [sendProgress, setSendProgress] = useState<{
    sent: number;
    total: number;
    active: number;
  } | null>(null);
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  const [passOpen, setPassOpen] = useState(false);
  const [passError, setPassError] = useState<string | null>(null);

  useEffect(() => {
    void fetchMessengerTemplates(adminKey)
      .then((data) => {
        setTemplates(data.templates);
        if (data.templates[0]) setTemplateId(data.templates[0].id);
      })
      .catch((e) =>
        setStatus({ type: "err", msg: e instanceof Error ? e.message : "Load failed" }),
      );
  }, [adminKey]);

  const activeTemplate = templates.find((t) => t.id === templateId);
  const templateAudience = activeTemplate?.audience;
  const needsCoupon = Boolean(activeTemplate?.requiresCoupon);
  const couponReady = !needsCoupon || couponCode.trim().length > 0;
  const joinedDays = JOINED_FILTERS.find((f) => f.id === joinedFilter)?.days ?? null;
  const visibleUsers =
    joinedDays == null
      ? users
      : users.filter((u) => joinedWithin(u.createdAt, joinedDays));

  useEffect(() => {
    if (!activeTemplate) return;
    setPreviewName(activeTemplate.audience === "parent" ? "Parent" : "Educator");
    setSelected(new Set());
    setJoinedFilter("all");
    setSentIds(readSentIds(activeTemplate.id));
  }, [activeTemplate?.id, activeTemplate?.audience]);

  useEffect(() => {
    if (!needsCoupon) return;
    void fetchAdminCoupons(adminKey)
      .then((data) =>
        setCouponOptions(data.coupons.filter((c) => c.status === "active")),
      )
      .catch(() => setCouponOptions([]));
  }, [adminKey, needsCoupon]);

  const loadPreview = useCallback(async () => {
    setPreviewLoading(true);
    try {
      const data = await previewMessengerEmail(adminKey, {
        templateId,
        name: previewName,
        role: templateAudience,
        ...(needsCoupon ? { couponCode } : {}),
      });
      setPreviewHtml(data.html);
      setPreviewSubject(data.subject);
      setStatus((prev) => (prev?.type === "err" ? null : prev));
    } catch (e) {
      setPreviewHtml("");
      setPreviewSubject("");
      setStatus({ type: "err", msg: e instanceof Error ? e.message : "Preview failed" });
    } finally {
      setPreviewLoading(false);
    }
  }, [adminKey, templateId, previewName, templateAudience, needsCoupon, couponCode]);

  useEffect(() => {
    const t = setTimeout(() => void loadPreview(), 250);
    return () => clearTimeout(t);
  }, [loadPreview]);

  const loadUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const data = await searchAdminUsers(adminKey, query, templateAudience);
      setUsers(data.users);
    } catch (e) {
      setStatus({ type: "err", msg: e instanceof Error ? e.message : "Search failed" });
    } finally {
      setUsersLoading(false);
    }
  }, [adminKey, query, templateAudience]);

  useEffect(() => {
    const t = setTimeout(() => void loadUsers(), 300);
    return () => clearTimeout(t);
  }, [loadUsers]);

  useEffect(() => {
    if (joinedDays == null) return;
    setSelected((prev) => {
      const next = new Set(
        [...prev].filter((id) => {
          const user = users.find((u) => u.id === id);
          return user ? joinedWithin(user.createdAt, joinedDays) : false;
        }),
      );
      return next.size === prev.size ? prev : next;
    });
  }, [joinedDays, users]);

  const toggleUser = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const markSent = (id: string) => {
    setSentIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      try {
        localStorage.setItem(sentStorageKey(templateId), JSON.stringify([...next]));
      } catch {
        /* ignore quota */
      }
      return next;
    });
    setSelected((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleSend = async (adminPass: string) => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    setSending(true);
    setStatus(null);
    setPassError(null);
    setSendProgress({ sent: 0, total: ids.length, active: 1 });
    let sent = 0;
    let failed = 0;
    try {
      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        setSendProgress({ sent, total: ids.length, active: i + 1 });
        try {
          const result = await sendMessengerEmails(adminKey, {
            templateId,
            userIds: [id],
            adminPass,
            ...(needsCoupon ? { couponCode } : {}),
          });
          const row = result.results.find((r) => r.userId === id) ?? result.results[0];
          if (row?.ok) {
            sent += 1;
            markSent(id);
          } else {
            failed += 1;
            setPassError(row?.error || "Send failed");
          }
        } catch (e) {
          const msg = e instanceof Error ? e.message : "Send failed";
          setPassError(msg);
          setStatus({
            type: "err",
            msg: `Stopped at ${sent}/${ids.length}. ${ids.length - sent} still to send.`,
          });
          setSendProgress({ sent, total: ids.length, active: i + 1 });
          return;
        }
        setSendProgress({ sent, total: ids.length, active: Math.min(i + 2, ids.length) });
      }
      setStatus({
        type: failed ? "err" : "ok",
        msg: failed
          ? `${sent}/${ids.length} sent, ${failed} failed — those stay selected`
          : `${sent}/${ids.length} sent`,
      });
      if (failed === 0) setPassOpen(false);
      void loadUsers();
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-57px)] flex-col lg:h-[calc(100vh-65px)]">
      {/* Toolbar */}
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-hairline bg-white px-4 py-2.5 sm:px-5">
        <select
          value={templateId}
          onChange={(e) => setTemplateId(e.target.value)}
          className="h-8 min-w-[200px] rounded border border-hairline bg-white px-2 text-xs font-medium text-ink outline-none focus:border-ink"
        >
          <optgroup label="Mentor templates">
            {templates
              .filter((t) => t.audience === "faculty")
              .map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
          </optgroup>
          <optgroup label="Parent templates">
            {templates
              .filter((t) => t.audience === "parent")
              .map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
          </optgroup>
        </select>

        {needsCoupon && (
          <>
            <input
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              list="messenger-coupon-codes"
              spellCheck={false}
              autoCapitalize="characters"
              placeholder="Coupon code"
              aria-label="Coupon code"
              className="h-8 w-[148px] rounded border border-hairline bg-white px-2 font-mono text-xs uppercase tracking-wide text-ink outline-none focus:border-ink"
            />
            <datalist id="messenger-coupon-codes">
              {couponOptions.map((coupon) => (
                <option key={coupon.id} value={coupon.code}>
                  {`₹${coupon.discountInr} off`}
                </option>
              ))}
            </datalist>
          </>
        )}

        {activeTemplate && (
          <span className="hidden text-[10px] font-medium uppercase tracking-wide text-muted sm:inline">
            For {activeTemplate.audience === "faculty" ? "tutors" : "parents"}
          </span>
        )}

        <div className="relative min-w-[140px] flex-1 sm:max-w-[160px]">
          <input
            value={previewName}
            onChange={(e) => setPreviewName(e.target.value)}
            className="h-8 w-full rounded border border-hairline bg-white px-2 text-xs text-ink outline-none focus:border-ink"
            placeholder="Preview name"
          />
        </div>

        <div className="relative min-w-[160px] flex-[2] sm:max-w-xs">
          <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-8 w-full rounded border border-hairline bg-white pl-7 pr-2 text-xs text-ink outline-none focus:border-ink"
            placeholder="Search recipients"
          />
        </div>

        <select
          value={joinedFilter}
          onChange={(e) => setJoinedFilter(e.target.value as JoinedFilterId)}
          aria-label="Filter by when they joined"
          className="h-8 rounded border border-hairline bg-white px-2 text-xs font-medium text-ink outline-none focus:border-ink"
        >
          {JOINED_FILTERS.map((f) => (
            <option key={f.id} value={f.id}>
              {f.label}
            </option>
          ))}
        </select>

        <span className="text-[11px] font-medium text-ink">
          {sending && sendProgress
            ? `${sendProgress.sent}/${sendProgress.total}`
            : `${selected.size} selected`}
        </span>

        <button
          type="button"
          onClick={() => {
            setPassError(null);
            setPassOpen(true);
          }}
          disabled={sending || selected.size === 0 || !couponReady}
          className="ml-auto flex h-8 items-center gap-1.5 rounded bg-ink px-3 text-xs font-semibold text-white disabled:opacity-40"
        >
          {sending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Send className="h-3.5 w-3.5" />
          )}
          {sending && sendProgress
            ? `${sendProgress.sent}/${sendProgress.total}`
            : "Send"}
        </button>
      </div>

      {status && (
        <div
          className={cn(
            "shrink-0 px-4 py-1.5 text-[11px] font-medium sm:px-5",
            status.type === "ok"
              ? "bg-sage-wash text-sage"
              : "bg-butter/60 text-ink",
          )}
        >
          {status.msg}
        </div>
      )}

      {/* Split pane */}
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* Recipients list */}
        <div className="flex w-full shrink-0 flex-col border-b border-hairline lg:w-[300px] lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between border-b border-hairline px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
              {templateAudience === "parent"
                ? "Parent recipients"
                : templateAudience === "faculty"
                  ? "Tutor recipients"
                  : "Recipients"}
              {visibleUsers.length > 0 && (
                <span className="ml-1 font-normal normal-case text-muted/80">
                  ({visibleUsers.length})
                </span>
              )}
            </p>
            <button
              type="button"
              onClick={() => {
                const selectable = visibleUsers
                  .filter((u) => !sentIds.has(u.id))
                  .map((u) => u.id);
                const allSelected =
                  selectable.length > 0 && selectable.every((id) => selected.has(id));
                setSelected(allSelected ? new Set() : new Set(selectable));
              }}
              disabled={visibleUsers.length === 0 || sending}
              className="text-[10px] font-medium text-muted hover:text-ink disabled:opacity-40"
            >
              {visibleUsers.filter((u) => !sentIds.has(u.id)).every((u) => selected.has(u.id)) &&
              visibleUsers.some((u) => !sentIds.has(u.id))
                ? "None"
                : "All"}
            </button>
          </div>

          <div className="min-h-[140px] flex-1 overflow-y-auto lg:min-h-0">
            {usersLoading ? (
              <p className="flex items-center gap-1.5 px-3 py-4 text-[11px] text-muted">
                <Loader2 className="h-3 w-3 animate-spin" />
                Loading
              </p>
            ) : visibleUsers.length === 0 ? (
              <p className="px-3 py-4 text-[11px] text-muted">
                {joinedDays
                  ? `No ${templateAudience === "parent" ? "parents" : "tutors"} joined in the last ${joinedDays} days`
                  : templateAudience === "parent"
                    ? "No parents found"
                    : templateAudience === "faculty"
                      ? "No tutors found"
                      : "No users"}
              </p>
            ) : (
              <ul>
                {visibleUsers.map((user) => {
                  const checked = selected.has(user.id);
                  const sent = sentIds.has(user.id);
                  return (
                    <li key={user.id} className="border-b border-hairline/60 last:border-0">
                      <button
                        type="button"
                        onClick={() => toggleUser(user.id)}
                        className={cn(
                          "flex w-full items-center gap-2.5 px-3 py-2 text-left transition hover:bg-cream",
                          checked && "bg-cream-band/80",
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-3.5 w-3.5 shrink-0 items-center justify-center border",
                            checked
                              ? "border-ink bg-ink text-white"
                              : "border-hairline bg-white",
                          )}
                        >
                          {checked && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-xs font-medium text-ink">
                            {user.name}
                          </span>
                          <span className="block truncate text-[10px] text-muted">
                            {user.email} · {joinedLabel(user.createdAt)}
                          </span>
                        </span>
                        {sent ? (
                          <span className="shrink-0 text-[9px] font-semibold uppercase tracking-wide text-sage">
                            Sent
                          </span>
                        ) : user.referralUrl ? (
                          <span className="shrink-0 text-[9px] font-medium uppercase tracking-wide text-sage">
                            Ref
                          </span>
                        ) : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Preview */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-cream">
          <div className="flex shrink-0 items-center gap-2 border-b border-hairline bg-white px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
              Preview
            </p>
            {previewLoading && (
              <Loader2 className="h-3 w-3 animate-spin text-muted" />
            )}
            {previewSubject && (
              <p className="min-w-0 flex-1 truncate text-[11px] text-ink">
                <span className="text-muted">Subject · </span>
                {previewSubject}
              </p>
            )}
          </div>

          <div className="flex flex-1 items-start justify-center overflow-y-auto p-4">
            {previewHtml ? (
              <iframe
                title="Email preview"
                srcDoc={previewHtml}
                className="h-full min-h-[480px] w-full max-w-[560px] border border-hairline bg-white shadow-sm"
                sandbox=""
              />
            ) : (
              <p className="py-12 text-xs text-muted">Loading preview…</p>
            )}
          </div>
        </div>
      </div>

      <AdminPassDialog
        open={passOpen}
        title="Send emails?"
        description={
          sending && sendProgress
            ? `Sending “${activeTemplate?.label || "this template"}” — ${sendProgress.sent}/${sendProgress.total} sent.`
            : `Send “${activeTemplate?.label || "this template"}” to ${selected.size} recipient${selected.size === 1 ? "" : "s"}. Enter ADMIN_PASS to confirm.`
        }
        confirmLabel="Send emails"
        busy={sending}
        busyLabel={
          sendProgress ? `${sendProgress.sent}/${sendProgress.total}` : undefined
        }
        error={passError}
        onConfirm={(pass) => void handleSend(pass)}
        onClose={() => {
          if (!sending) {
            setPassOpen(false);
            setPassError(null);
          }
        }}
      />
    </div>
  );
}
