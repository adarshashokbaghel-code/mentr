"use client";

import {
  requirementsApi,
  type MyRequirement,
  type StartTimeline,
} from "@/lib/api";
import { timeAgo } from "@/components/dashboard/widgets";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  Megaphone,
  MoreHorizontal,
  Plus,
  Share2,
  Users,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ComparePitchesDialog,
  rankPitches,
  ScorePill,
} from "@/components/requirements/compare-pitches";
import {
  PostRequirementWizard,
  REQUIREMENT_DRAFT_KEY,
  SUBJECT_OPTIONS,
} from "@/components/requirements/post-requirement-wizard";
import { REQUIREMENT_POSTED_EVENT } from "@/components/requirements/post-requirement-host";
import { MentorPhoto } from "@/components/ui/mentor-photo";

export const TIMELINE_LABELS: Record<StartTimeline, string> = {
  immediately: "Starts immediately",
  within_week: "Starts within a week",
  within_month: "Starts within a month",
  flexible: "Flexible start",
};

/**
 * "Post your need, tutors come to you" — the parent side of the
 * requirements board. Owns its own data; notifies the dashboard when a
 * pitch is accepted so the connections list refreshes too.
 */
export function ParentRequirementsSection({
  onConnectionsChanged,
  requestOpen = false,
  onRequestOpenChange,
}: {
  onConnectionsChanged?: () => void;
  requestOpen?: boolean;
  onRequestOpenChange?: (open: boolean) => void;
}) {
  const [requirements, setRequirements] = useState<MyRequirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [initialSubject, setInitialSubject] = useState("");

  const reload = useCallback(() => {
    requirementsApi
      .mine()
      .then((data) => setRequirements(data.requirements))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(reload, [reload]);

  useEffect(() => {
    window.addEventListener(REQUIREMENT_POSTED_EVENT, reload);
    return () => window.removeEventListener(REQUIREMENT_POSTED_EVENT, reload);
  }, [reload]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (
      params.get("icFallback") === "1" ||
      sessionStorage.getItem("ic_board_prefill") ||
      sessionStorage.getItem(REQUIREMENT_DRAFT_KEY)
    ) {
      setModalOpen(true);
    }
    // Blog CTAs link here as ?post=<Subject> to open the form with that subject picked.
    const post = params.get("post");
    if (post !== null) {
      const subject = SUBJECT_OPTIONS.find(
        (s) => s.toLowerCase() === post.trim().toLowerCase(),
      );
      setInitialSubject(subject ?? "");
      setModalOpen(true);
      params.delete("post");
      const qs = params.toString();
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`,
      );
    }
  }, []);

  useEffect(() => {
    if (requestOpen) setModalOpen(true);
  }, [requestOpen]);

  const open = requirements.filter((r) => r.status === "open").length;

  return (
    <section>
      {loading ? (
        <div className="space-y-3">
          {[0, 1].map((i) => (
            <div key={i} className="h-36 animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
      ) : requirements.length === 0 ? (
        <div className="rounded-2xl border border-hairline bg-white px-5 py-10 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-coral-wash">
            <Megaphone className="h-5 w-5 text-coral" />
          </span>
          <p className="mt-3 text-[15px] font-bold text-ink">
            Let tutors come to you
          </p>
          <p className="mx-auto mt-1 max-w-[340px] text-[13px] leading-relaxed text-muted">
            Post what your child needs. Tutors pitch you, you compare them
            side by side and book a free demo.
          </p>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="mt-4 inline-flex h-11 items-center gap-1.5 rounded-xl bg-coral px-5 text-[14px] font-bold text-white transition hover:bg-coral-dark"
          >
            <Plus className="h-4 w-4" />
            Post a requirement
          </button>
        </div>
      ) : (
        <>
          <p className="mb-2 px-0.5 text-[12px] text-muted sm:mb-3 sm:text-[13px]">
            {open} open post{open === 1 ? "" : "s"} · tutors pitch you, you pick
          </p>
          <ul className="space-y-2.5 sm:space-y-3">
            {requirements.map((r) => (
              <RequirementCard
                key={r.id}
                requirement={r}
                onChanged={() => {
                  reload();
                  onConnectionsChanged?.();
                }}
              />
            ))}
          </ul>
        </>
      )}

      {modalOpen && (
        <PostRequirementWizard
          initialSubject={initialSubject}
          onClose={() => {
            setModalOpen(false);
            onRequestOpenChange?.(false);
          }}
          onPosted={reload}
        />
      )}
    </section>
  );
}

const MODE_LABELS: Record<string, string> = {
  online: "Online",
  student_home: "At home",
  tutor_home: "At tutor's place",
};

const PREVIEW_COUNT = 3;

function daysLeft(expiresAt: string): number {
  return Math.max(
    0,
    Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 86_400_000),
  );
}

function requirementShareUrl(shareToken: string): string {
  const origin =
    typeof window !== "undefined" ? window.location.origin : "https://mentr.in";
  return `${origin}/looking/${shareToken}`;
}

function formatBudget(r: MyRequirement): string | null {
  if (r.budgetMin == null && r.budgetMax == null) return null;
  if (r.budgetMin != null && r.budgetMax != null) {
    return `₹${r.budgetMin}–${r.budgetMax}/hr`;
  }
  return r.budgetMax != null ? `Up to ₹${r.budgetMax}/hr` : `₹${r.budgetMin}+/hr`;
}

function RequirementCard({
  requirement: r,
  onChanged,
}: {
  requirement: MyRequirement;
  onChanged: () => void;
}) {
  const [compareOpen, setCompareOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const ranked = rankPitches(r.interests);
  const newCount = r.interests.filter((i) => i.status === "pending").length;
  const isOpen = r.status === "open";
  const expiresInDays = daysLeft(r.expiresAt);
  const meta = [
    r.modes.map((m) => MODE_LABELS[m]).filter(Boolean).join(" or "),
    r.area,
    formatBudget(r),
    TIMELINE_LABELS[r.startTimeline],
  ].filter(Boolean);

  async function copyShareLink() {
    if (!r.shareToken) return;
    const url = requirementShareUrl(r.shareToken);
    try {
      await navigator.clipboard.writeText(url);
      setShareCopied(true);
      window.setTimeout(() => setShareCopied(false), 2000);
    } catch {
      window.prompt("Copy this link:", url);
    }
  }

  async function handleClose() {
    setClosing(true);
    try {
      await requirementsApi.close(r.id);
      setConfirmOpen(false);
      onChanged();
    } catch {
      setClosing(false);
    }
  }

  return (
    <li className="overflow-hidden rounded-2xl border border-hairline bg-white shadow-[0_1px_3px_rgba(28,26,23,0.05)]">
      <div className="px-3.5 pb-3 pt-3 sm:p-5">
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <h3 className="text-[15px] font-bold leading-snug text-ink sm:text-[16px]">
                {r.subject} · {r.classLevel}
              </h3>
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-bold sm:text-[11px]",
                  isOpen ? "bg-sage-wash text-sage" : "bg-cream-band text-muted",
                )}
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    isOpen ? "bg-sage" : "bg-muted",
                  )}
                />
                {isOpen
                  ? expiresInDays === 0
                    ? "Open · closes today"
                    : `Open · ${expiresInDays}d left`
                  : "Closed"}
              </span>
            </div>
            <p className="mt-0.5 text-[12px] leading-snug text-muted sm:mt-1 sm:text-[13px]">
              {meta.join(" · ")}
            </p>
          </div>
          {isOpen && (
            <CardMenu
              shareLabel={shareCopied ? "Link copied" : "Share with family"}
              onShare={() => void copyShareLink()}
              onClosePost={() => setConfirmOpen(true)}
            />
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowDetails((v) => !v)}
          className={cn(
            "mt-2 block w-full text-left text-[12.5px] leading-relaxed text-ink/75 sm:mt-2.5 sm:text-[13px]",
            !showDetails && "line-clamp-2",
          )}
          aria-expanded={showDetails}
        >
          {r.details}
        </button>
        <p className="mt-1 text-[11px] text-muted">Posted {timeAgo(r.postedAt)}</p>
      </div>

      <div className="border-t border-hairline bg-cream/40 px-3 py-3 sm:px-5 sm:py-3.5">
        {ranked.length === 0 ? (
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              {isOpen && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-coral/60" />
              )}
              <span
                className={cn(
                  "relative inline-flex h-2.5 w-2.5 rounded-full",
                  isOpen ? "bg-coral" : "bg-muted",
                )}
              />
            </span>
            <p className="text-[13px] text-muted">
              {isOpen
                ? `Waiting for pitches. ${r.subject} tutors are being notified and we'll email you.`
                : "No tutors pitched on this post."}
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-2">
              <p className="flex min-w-0 items-center gap-1.5 text-[12.5px] font-bold text-ink sm:text-[13px]">
                <Users className="h-3.5 w-3.5 shrink-0 text-muted sm:h-4 sm:w-4" />
                {ranked.length} tutor{ranked.length === 1 ? "" : "s"} pitched
                {newCount > 0 && (
                  <span className="rounded-full bg-coral px-1.5 py-0.5 text-[10px] font-extrabold text-white">
                    {newCount} new
                  </span>
                )}
              </p>
              <button
                type="button"
                onClick={() => setCompareOpen(true)}
                className="inline-flex h-8 shrink-0 items-center gap-0.5 rounded-lg bg-ink px-3 text-[12px] font-bold text-white transition hover:opacity-90 sm:h-9 sm:gap-1 sm:px-3.5 sm:text-[13px]"
              >
                Compare all
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <ul className="mt-2 divide-y divide-hairline overflow-hidden rounded-xl border border-hairline bg-white sm:mt-2.5">
              {ranked.slice(0, PREVIEW_COUNT).map((i) => (
                <li key={i.id}>
                  <button
                    type="button"
                    onClick={() => setCompareOpen(true)}
                    className="flex w-full items-center gap-2.5 px-2.5 py-2 text-left transition hover:bg-cream/60 sm:gap-3 sm:px-3 sm:py-2.5"
                  >
                    <MentorPhoto
                      name={i.teacherName}
                      imageUrl={i.teacherImageUrl}
                      size="xs"
                      rounded="full"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5">
                        <span className="truncate text-[13px] font-bold text-ink">
                          {i.teacherName}
                        </span>
                        {i.status === "accepted" && (
                          <span className="shrink-0 rounded-full bg-sage-wash px-1.5 py-0.5 text-[10px] font-bold text-sage">
                            Connected
                          </span>
                        )}
                        {i.status === "declined" && (
                          <span className="shrink-0 rounded-full bg-cream-band px-1.5 py-0.5 text-[10px] font-bold text-muted">
                            Passed
                          </span>
                        )}
                      </span>
                      <span className="block truncate text-[11.5px] text-muted sm:text-[12px]">
                        {[
                          i.hourlyRate != null ? `₹${i.hourlyRate}/hr` : null,
                          i.experienceYears ? `${i.experienceYears} yrs` : null,
                          timeAgo(i.sentAt),
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    </span>
                    {(i.matchScore ?? 0) > 0 && <ScorePill score={i.matchScore!} />}
                  </button>
                </li>
              ))}
            </ul>
            {ranked.length > PREVIEW_COUNT && (
              <button
                type="button"
                onClick={() => setCompareOpen(true)}
                className="mt-2 text-[12px] font-semibold text-ink underline underline-offset-2"
              >
                +{ranked.length - PREVIEW_COUNT} more pitch
                {ranked.length - PREVIEW_COUNT === 1 ? "" : "es"}
              </button>
            )}
          </>
        )}
      </div>

      {compareOpen && (
        <ComparePitchesDialog
          requirement={r}
          onClose={() => setCompareOpen(false)}
        />
      )}

      {confirmOpen && (
        <CloseConfirmModal
          subject={r.subject}
          classLevel={r.classLevel}
          closing={closing}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={handleClose}
        />
      )}
    </li>
  );
}

function CardMenu({
  shareLabel,
  onShare,
  onClosePost,
}: {
  shareLabel: string;
  onShare: () => void;
  onClosePost: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-cream hover:text-ink"
        aria-label="Post options"
        aria-expanded={open}
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-9 z-20 w-48 overflow-hidden rounded-xl border border-hairline bg-white py-1 shadow-lg">
          <button
            type="button"
            onClick={() => {
              onShare();
              window.setTimeout(() => setOpen(false), 900);
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] font-semibold text-ink transition hover:bg-cream"
          >
            <Share2 className="h-3.5 w-3.5" />
            {shareLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onClosePost();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] font-semibold text-coral-dark transition hover:bg-coral-wash"
          >
            <X className="h-3.5 w-3.5" />
            Close post
          </button>
        </div>
      )}
    </div>
  );
}

function CloseConfirmModal({
  subject,
  classLevel,
  closing,
  onCancel,
  onConfirm,
}: {
  subject: string;
  classLevel: string;
  closing: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="close-post-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-ink/40"
        aria-label="Cancel"
        onClick={onCancel}
      />

      <div className="champs-pop relative z-10 w-full max-w-sm rounded-xl border border-hairline bg-white p-5 shadow-xl">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-coral-wash">
          <X className="h-5 w-5 text-coral-dark" />
        </span>
        <h2 id="close-post-title" className="mt-3 text-base font-bold text-ink">
          Close this post?
        </h2>
        <p className="mt-1 text-[13px] leading-relaxed text-muted">
          <span className="font-semibold text-ink">
            {subject} · {classLevel}
          </span>{" "}
          will stop showing to tutors on the board and won&apos;t receive new
          pitches.
        </p>
        <p className="mt-2 rounded-md bg-sage-wash px-3 py-2 text-[12px] font-medium leading-relaxed text-sage">
          Pitches already on this post stay here. Closing it only stops new ones.
        </p>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={closing}
            className="h-10 flex-1 rounded-md border border-hairline bg-white text-sm font-semibold text-ink transition hover:bg-cream disabled:opacity-50"
          >
            Keep it open
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={closing}
            className="h-10 flex-1 rounded-md bg-coral text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {closing ? "Closing…" : "Close post"}
          </button>
        </div>
      </div>
    </div>
  );
}
