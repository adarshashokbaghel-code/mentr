"use client";

import { timeAgo } from "@/components/dashboard/widgets";
import { BookDemoButton, type DemoFromPost } from "@/components/demo/book-demo-button";
import { MentorPhoto } from "@/components/ui/mentor-photo";
import { type MyRequirement, type RequirementInterest } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Check, MessageCircle, Star, Trophy, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const MODE_SHORT: Record<string, string> = {
  online: "Online",
  student_home: "Home",
  tutor_home: "Tutor's place",
};

/** Declined last, then best match first, then newest. */
export function rankPitches(list: RequirementInterest[]): RequirementInterest[] {
  return [...list].sort((a, b) => {
    const declined = Number(a.status === "declined") - Number(b.status === "declined");
    if (declined) return declined;
    const score = (b.matchScore ?? 0) - (a.matchScore ?? 0);
    if (score) return score;
    return new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime();
  });
}

export function ScoreStars({
  score,
  className,
}: {
  score: number;
  className?: string;
}) {
  const stars = [0, 1, 2, 3, 4];
  return (
    <span
      className={cn("relative inline-flex shrink-0", className)}
      aria-label={`${score.toFixed(1)} out of 5`}
    >
      <span className="flex text-hairline">
        {stars.map((i) => (
          <Star key={i} className="h-3.5 w-3.5" fill="currentColor" strokeWidth={0} />
        ))}
      </span>
      <span
        className="absolute inset-y-0 left-0 flex overflow-hidden text-coral"
        style={{ width: `${(Math.max(0, Math.min(5, score)) / 5) * 100}%` }}
      >
        {stars.map((i) => (
          <Star
            key={i}
            className="h-3.5 w-3.5 shrink-0"
            fill="currentColor"
            strokeWidth={0}
          />
        ))}
      </span>
    </span>
  );
}

export function ScorePill({ score }: { score: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-coral-wash px-2 py-0.5 text-[11px] font-bold tabular-nums text-coral-dark">
      <Star className="h-3 w-3" fill="currentColor" strokeWidth={0} />
      {score.toFixed(1)}
    </span>
  );
}

/**
 * Every pitch on a post side by side, ranked by how well each tutor fits,
 * with demo booking right on the card.
 */
export function ComparePitchesDialog({
  requirement: r,
  onClose,
}: {
  requirement: MyRequirement;
  onClose: () => void;
}) {
  const ranked = rankPitches(r.interests);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[110] flex items-end justify-center text-left sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="compare-pitches-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-ink/40"
        aria-label="Close"
        onClick={onClose}
      />
      <div
        className={cn(
          "champs-pop relative z-10 flex max-h-[96dvh] w-full flex-col overflow-hidden rounded-t-2xl bg-cream shadow-xl sm:max-h-[90dvh] sm:rounded-2xl",
          ranked.length === 1
            ? "sm:max-w-md"
            : ranked.length === 2
              ? "sm:max-w-3xl"
              : "h-[96dvh] sm:h-auto sm:max-w-6xl",
        )}
      >
        <div className="flex items-start justify-between gap-3 border-b border-hairline bg-white px-4 py-3 sm:px-6 sm:py-4">
          <div className="min-w-0">
            <h2
              id="compare-pitches-title"
              className="text-base font-bold leading-snug text-ink sm:text-lg"
            >
              Compare {ranked.length} pitch{ranked.length === 1 ? "" : "es"}
            </h2>
            <p className="mt-0.5 truncate text-[12px] text-muted sm:text-[13px]">
              {r.subject} · {r.classLevel} · best match first
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

        <div className="flex-1 overflow-y-auto px-3 pb-4 pt-3 sm:p-6">
          <ul
            className={cn(
              "grid gap-3.5 pt-1.5 sm:gap-4",
              ranked.length === 2 && "sm:grid-cols-2",
              ranked.length > 2 && "sm:grid-cols-2 lg:grid-cols-3",
            )}
          >
            {ranked.map((i, index) => (
              <PitchCard
                key={i.id}
                pitch={i}
                post={{ id: r.id, subject: r.subject, classLevel: r.classLevel }}
                best={index === 0 && i.status !== "declined" && ranked.length > 1}
              />
            ))}
          </ul>
          <p className="mt-4 px-2 text-center text-[11px] leading-relaxed text-muted sm:mt-5 sm:text-[12px]">
            Match score compares each tutor&apos;s subjects, classes, mode and
            fee with your post. Book a free demo with whoever fits best.
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function PitchCard({
  pitch: i,
  post,
  best,
}: {
  pitch: RequirementInterest;
  post: DemoFromPost;
  best: boolean;
}) {
  const [showFull, setShowFull] = useState(false);
  const gone = i.teacherName === "Deleted user";
  const score = i.matchScore ?? 0;
  const modes = (i.teachingModes ?? []).map((m) => MODE_SHORT[m]).filter(Boolean);
  const facts = [
    ["Fee", i.hourlyRate != null ? `₹${i.hourlyRate}/hr` : "Ask tutor"],
    [
      "Experience",
      i.experienceYears ? `${i.experienceYears} yr${i.experienceYears === 1 ? "" : "s"}` : "New",
    ],
    ["Teaches", modes.length ? modes.join(" · ") : "-"],
  ];

  return (
    <li
      className={cn(
        "relative flex min-w-0 flex-col rounded-2xl border bg-white p-3.5 transition sm:p-4",
        best ? "border-coral/50 shadow-[0_6px_24px_-12px_rgba(255,122,61,0.45)]" : "border-hairline",
        i.status === "declined" && "opacity-60",
      )}
    >
      {best && (
        <span className="absolute -top-2.5 left-3.5 inline-flex items-center gap-1 rounded-full bg-coral px-2 py-0.5 text-[10.5px] font-bold text-white sm:left-4 sm:px-2.5 sm:text-[11px]">
          <Trophy className="h-3 w-3" />
          Best match
        </span>
      )}

      <div className="flex items-start gap-2.5 sm:gap-3">
        <MentorPhoto name={i.teacherName} imageUrl={i.teacherImageUrl} size="sm" rounded="full" />
        <div className="min-w-0 flex-1">
          {gone ? (
            <p className="text-[14px] font-bold text-muted sm:text-[15px]">Deleted user</p>
          ) : (
            <Link
              href={`/teachers/${i.teacherId}`}
              className="block truncate text-[14px] font-bold text-ink hover:text-coral sm:text-[15px]"
            >
              {i.teacherName}
            </Link>
          )}
          <p className="truncate text-[11.5px] text-muted sm:text-[12px]">
            {[i.designation, i.teacherArea].filter(Boolean).join(" · ") || timeAgo(i.sentAt)}
          </p>
        </div>
        {i.status === "accepted" && (
          <span className="shrink-0 rounded-full bg-sage-wash px-2 py-0.5 text-[11px] font-bold text-sage">
            Connected
          </span>
        )}
        {i.status === "declined" && (
          <span className="shrink-0 rounded-full bg-cream-band px-2 py-0.5 text-[11px] font-bold text-muted">
            Declined
          </span>
        )}
      </div>

      {score > 0 && (
        <div className="mt-2.5 flex items-center gap-2 sm:mt-3">
          <ScoreStars score={score} />
          <span className="text-[12.5px] font-bold tabular-nums text-ink sm:text-[13px]">
            {score.toFixed(1)}
            <span className="font-medium text-muted">/5 match</span>
          </span>
        </div>
      )}

      <dl className="mt-2.5 grid grid-cols-3 gap-1.5 rounded-xl bg-cream/70 px-2.5 py-2 sm:mt-3 sm:gap-2 sm:p-2.5">
        {facts.map(([label, value]) => (
          <div key={label} className="min-w-0">
            <dt className="text-[9.5px] font-bold uppercase tracking-wide text-muted sm:text-[10px]">
              {label}
            </dt>
            <dd className="mt-0.5 truncate text-[12px] font-semibold text-ink sm:text-[13px]">
              {value}
            </dd>
          </div>
        ))}
      </dl>

      {(i.matchReasons?.length ?? 0) > 0 && (
        <ul className="mt-2.5 flex flex-wrap gap-1 sm:mt-3 sm:gap-1.5">
          {i.matchReasons!.slice(0, 4).map((reason) => (
            <li
              key={reason}
              className="inline-flex items-center gap-1 rounded-full bg-sage-wash px-2 py-0.5 text-[11px] font-semibold text-sage sm:text-[11.5px]"
            >
              <Check className="h-3 w-3 shrink-0" strokeWidth={3} />
              {reason}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-2.5 border-t border-hairline pt-2.5 sm:mt-3 sm:pt-3">
        <p className="text-[9.5px] font-bold uppercase tracking-wide text-muted sm:text-[10px]">
          Their pitch · {timeAgo(i.sentAt)}
        </p>
        <p
          className={cn(
            "mt-1 whitespace-pre-line text-[12.5px] leading-relaxed text-ink/85 sm:text-[13px]",
            !showFull && "line-clamp-3 sm:line-clamp-4",
          )}
        >
          {i.message}
        </p>
        {i.message.length > 140 && (
          <button
            type="button"
            onClick={() => setShowFull((v) => !v)}
            className="mt-0.5 text-[11.5px] font-semibold text-ink underline underline-offset-2 sm:text-[12px]"
          >
            {showFull ? "Show less" : "Read full pitch"}
          </button>
        )}
      </div>

      {!gone && (
        <div className="mt-auto space-y-1.5 pt-3 sm:space-y-2 sm:pt-4">
          <BookDemoButton
            teacher={{ id: i.teacherId, name: i.teacherName, subjects: i.subjects }}
            fromPost={post}
            label="Book free demo"
            className="flex h-10 w-full items-center justify-center gap-1.5 rounded-xl bg-coral text-[13.5px] font-bold text-white transition hover:bg-coral-dark sm:h-11 sm:text-[14px]"
          />
          {i.status === "accepted" && i.phone && (
            <a
              href={`https://wa.me/${i.phone}?text=${encodeURIComponent(
                `Hi ${i.teacherName.split(" ")[0]}, we connected on Mentr. When can we talk about classes?`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-full items-center justify-center gap-1.5 rounded-xl bg-sage text-[12.5px] font-bold text-white transition hover:opacity-90 sm:h-10 sm:text-[13px]"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Chat on WhatsApp · +{i.phone}
            </a>
          )}
        </div>
      )}
    </li>
  );
}
