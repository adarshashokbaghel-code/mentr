"use client";

import {
  fetchMessengerTemplates,
  previewMessengerEmail,
  searchAdminUsers,
  sendMessengerEmails,
  type AdminUserRow,
  type MessengerTemplateMeta,
} from "@/lib/admin-api";
import { cn } from "@/lib/utils";
import { Check, Loader2, Search, Send } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type Props = {
  adminKey: string;
};

export function AdminMessenger({ adminKey }: Props) {
  const [templates, setTemplates] = useState<MessengerTemplateMeta[]>([]);
  const [templateId, setTemplateId] = useState("initial-user");
  const [previewName, setPreviewName] = useState("Educator");
  const [previewHtml, setPreviewHtml] = useState("");
  const [previewSubject, setPreviewSubject] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);

  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ type: "ok" | "err"; msg: string } | null>(null);

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

  useEffect(() => {
    if (!activeTemplate) return;
    setPreviewName(activeTemplate.audience === "parent" ? "Parent" : "Educator");
    setSelected(new Set());
  }, [activeTemplate?.id, activeTemplate?.audience]);

  const loadPreview = useCallback(async () => {
    setPreviewLoading(true);
    try {
      const data = await previewMessengerEmail(adminKey, {
        templateId,
        name: previewName,
        role: templateAudience,
      });
      setPreviewHtml(data.html);
      setPreviewSubject(data.subject);
    } catch (e) {
      setStatus({ type: "err", msg: e instanceof Error ? e.message : "Preview failed" });
    } finally {
      setPreviewLoading(false);
    }
  }, [adminKey, templateId, previewName, templateAudience]);

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

  const toggleUser = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSend = async () => {
    if (selected.size === 0) return;
    setSending(true);
    setStatus(null);
    try {
      const result = await sendMessengerEmails(adminKey, {
        templateId,
        userIds: Array.from(selected),
      });
      setStatus({
        type: "ok",
        msg: `${result.sent} sent${result.failed ? `, ${result.failed} failed` : ""}`,
      });
      setSelected(new Set());
      void loadUsers();
    } catch (e) {
      setStatus({ type: "err", msg: e instanceof Error ? e.message : "Send failed" });
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

        <span className="hidden text-[11px] text-muted sm:inline">
          {selected.size} selected
        </span>

        <button
          type="button"
          onClick={() => void handleSend()}
          disabled={sending || selected.size === 0}
          className="ml-auto flex h-8 items-center gap-1.5 rounded bg-ink px-3 text-xs font-semibold text-white disabled:opacity-40"
        >
          {sending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Send className="h-3.5 w-3.5" />
          )}
          Send
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
              {users.length > 0 && (
                <span className="ml-1 font-normal normal-case text-muted/80">
                  ({users.length})
                </span>
              )}
            </p>
            <button
              type="button"
              onClick={() =>
                setSelected(
                  selected.size === users.length
                    ? new Set()
                    : new Set(users.map((u) => u.id)),
                )
              }
              disabled={users.length === 0}
              className="text-[10px] font-medium text-muted hover:text-ink disabled:opacity-40"
            >
              {selected.size === users.length && users.length > 0 ? "None" : "All"}
            </button>
          </div>

          <div className="min-h-[140px] flex-1 overflow-y-auto lg:min-h-0">
            {usersLoading ? (
              <p className="flex items-center gap-1.5 px-3 py-4 text-[11px] text-muted">
                <Loader2 className="h-3 w-3 animate-spin" />
                Loading
              </p>
            ) : users.length === 0 ? (
              <p className="px-3 py-4 text-[11px] text-muted">
                {templateAudience === "parent"
                  ? "No parents found"
                  : templateAudience === "faculty"
                    ? "No tutors found"
                    : "No users"}
              </p>
            ) : (
              <ul>
                {users.map((user) => {
                  const checked = selected.has(user.id);
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
                            {user.email} · {user.role}
                          </span>
                        </span>
                        {user.referralUrl ? (
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
    </div>
  );
}
