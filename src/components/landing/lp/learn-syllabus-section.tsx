"use client";

import type { LearnTrackId } from "@/lib/learn-curriculum";
import {
  SYLLABUS_COUNTS,
  SYLLABUS_DOWNLOAD_HREF,
  SYLLABUS_VIEW_HREF,
  getSyllabusTracks,
  type SyllabusModule,
  type SyllabusUnit,
} from "@/lib/learn-syllabus-doc";
import { cn } from "@/lib/utils";
import { ChevronDown, Download, FileText, Trophy } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { LEARN_SHELL } from "./learn-shell";
import { SectionHeader } from "./shared";

const SUBJECT_ORDER: LearnTrackId[] = ["cs", "ai", "math"];

function levelPill(level: string) {
  if (level === "Easy") return "bg-sage-wash text-sage";
  if (level === "Building") return "bg-butter/70 text-ink";
  if (level === "Stretch") return "bg-lavender text-ink";
  return "bg-coral-wash text-coral-dark";
}

function ChapterRow({ chapter, index }: { chapter: SyllabusModule; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <li className="border-t border-hairline">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-start justify-between gap-3 px-4 py-3 text-left"
      >
        <span className="min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-wide text-muted">
            Chapter {index} · {chapter.id}
          </span>
          <span className="mt-0.5 block text-sm font-bold text-ink">{chapter.title}</span>
          <span className="mt-0.5 block text-xs text-muted">{chapter.concept}</span>
        </span>
        <span className="flex shrink-0 items-center gap-2 pt-0.5">
          <span
            className={cn(
              "rounded-md px-2 py-0.5 text-[10px] font-bold",
              levelPill(chapter.detail.level),
            )}
          >
            {chapter.detail.level}
          </span>
          <ChevronDown
            className={cn("h-4 w-4 text-muted transition", open && "rotate-180")}
          />
        </span>
      </button>
      {open && (
        <div className="space-y-3 px-4 pb-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted">
                What’s in the video
              </p>
              <ul className="mt-1 list-disc space-y-1 pl-4 text-xs leading-relaxed text-ink">
                {chapter.detail.teach.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted">
                Your child will be able to
              </p>
              <ul className="mt-1 list-disc space-y-1 pl-4 text-xs leading-relaxed text-ink">
                {chapter.detail.outcomes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <p className="rounded-md bg-white px-2.5 py-2 text-xs leading-relaxed text-ink">
              <span className="font-bold">They practise:</span> {chapter.detail.practice}
            </p>
            <p className="rounded-md bg-white px-2.5 py-2 text-xs leading-relaxed text-ink">
              <span className="font-bold">You’ll know they got it:</span> {chapter.detail.checkpoint}
            </p>
          </div>
        </div>
      )}
    </li>
  );
}

function ModulePick({
  bundle,
  index,
  selected,
  onSelect,
}: {
  bundle: SyllabusUnit;
  index: number;
  selected: boolean;
  onSelect: () => void;
}) {
  const { unit, modules } = bundle;
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "h-full rounded-lg border-2 p-4 text-left transition",
        selected
          ? "border-ink bg-white"
          : "border-transparent bg-[#f6f4f0] hover:border-ink/15",
      )}
    >
      <span className="text-[10px] font-bold uppercase tracking-wide text-[#ff6a1a]">
        Module {index} of 4
      </span>
      <span className="mt-1 block text-[15px] font-extrabold leading-snug text-ink">
        {unit.title}
      </span>
      <span className="mt-1.5 block text-[13px] leading-relaxed text-muted">
        {unit.description}
      </span>
      <span className="mt-2 block text-[12px] font-semibold text-ink/70">
        5 chapters · {modules[0]?.detail.level} → {modules[modules.length - 1]?.detail.level}
      </span>
    </button>
  );
}

export function LearnSyllabusSection() {
  const tracks = useMemo(() => getSyllabusTracks(), []);
  const [subject, setSubject] = useState<LearnTrackId>("cs");
  const active = tracks.find((t) => t.track.id === subject) ?? tracks[0];
  const [openModule, setOpenModule] = useState<string | null>(
    active.units[0]?.unit.id ?? null,
  );
  const openIndex = active.units.findIndex((u) => u.unit.id === openModule);
  const openBundle = openIndex >= 0 ? active.units[openIndex] : null;

  function pickSubject(id: LearnTrackId) {
    setSubject(id);
    const next = tracks.find((t) => t.track.id === id);
    setOpenModule(next?.units[0]?.unit.id ?? null);
  }

  return (
    <section id="curriculum" className="scroll-mt-20 border-t border-hairline bg-white py-14 sm:py-20">
      <div className={LEARN_SHELL}>
        <SectionHeader
          eyebrow="Full syllabus"
          title="See what they learn"
          description="Class 3–5 · 3 subjects · 4 modules each · 5 chapters in every module."
        />

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <a
            href={SYLLABUS_DOWNLOAD_HREF}
            download
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-coral px-4 text-sm font-semibold text-white hover:bg-coral-dark"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </a>
          <Link
            href={SYLLABUS_VIEW_HREF}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-hairline bg-cream px-4 text-sm font-semibold text-ink hover:bg-cream-band"
          >
            <FileText className="h-4 w-4" />
            Parent guide
          </Link>
        </div>

        <div className="mt-10">
          <p className="text-[11px] font-bold uppercase tracking-wide text-muted">
            Subject
          </p>
          <div className="mt-2 grid grid-cols-3 gap-2 sm:gap-3">
            {SUBJECT_ORDER.map((id) => {
              const bundle = tracks.find((t) => t.track.id === id);
              if (!bundle) return null;
              const on = subject === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => pickSubject(id)}
                  className={cn(
                    "h-12 rounded-md px-3 text-sm font-bold sm:text-base",
                    on
                      ? "bg-[#1c2434] text-white"
                      : "border border-hairline bg-white text-ink hover:bg-cream",
                  )}
                >
                  {bundle.track.shortLabel}
                </button>
              );
            })}
          </div>

          <p className="mt-4 text-[14px] text-muted">
            <span className="font-semibold text-ink">{active.track.shortLabel}</span>
            {" · "}
            4 modules · 20 chapters
          </p>
        </div>

        <div className="mt-8">
          <p className="text-[11px] font-bold uppercase tracking-wide text-muted">
            Modules in {active.track.shortLabel}
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {active.units.map((bundle, i) => (
              <ModulePick
                key={bundle.unit.id}
                bundle={bundle}
                index={i + 1}
                selected={openModule === bundle.unit.id}
                onSelect={() => setOpenModule(bundle.unit.id)}
              />
            ))}
          </div>
        </div>

        {openBundle && (
          <div className="mt-6 overflow-hidden rounded-lg border-2 border-ink/10 bg-white">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-hairline px-5 py-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#ff6a1a]">
                  Module {openIndex + 1} of 4 · 5 chapters
                </p>
                <h3 className="mt-0.5 text-lg font-extrabold text-ink">{openBundle.unit.title}</h3>
                <p className="mt-1 text-sm text-muted">{openBundle.unit.description}</p>
              </div>
              <p className="max-w-xl text-[13px] text-muted">
                <strong className="text-ink">After this module, your child can:</strong>{" "}
                {openBundle.goals.join(" · ")}
              </p>
            </div>
            <ol>
              {openBundle.modules.map((chapter, i) => (
                <ChapterRow key={chapter.id} chapter={chapter} index={i + 1} />
              ))}
            </ol>
            <div className="flex flex-wrap items-start justify-between gap-3 border-t border-hairline px-5 py-4">
              <div className="flex items-start gap-2">
                <Trophy className="mt-0.5 h-4 w-4 shrink-0 text-coral" />
                <span>
                  <span className="block text-[10px] font-bold uppercase text-coral">
                    Module boss
                  </span>
                  <span className="text-sm font-bold text-ink">{openBundle.unit.bossChallenge}</span>
                </span>
              </div>
              <p className="text-[12px] text-muted">
                Each chapter: video + {SYLLABUS_COUNTS.practicePerLesson} practice +{" "}
                {SYLLABUS_COUNTS.checksPerLesson} check
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
