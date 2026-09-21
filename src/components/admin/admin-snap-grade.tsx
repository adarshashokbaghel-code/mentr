"use client";

import { AdminPassDialog } from "@/components/admin/admin-pass-dialog";
import { AdminSection, AdminStatCard } from "@/components/admin/admin-ui";
import {
  fetchSnapGradeAdmin,
  fetchSnapGradeEvaluations,
  updateSnapGradeQuestion,
  type SnapGradeAdminEvaluation,
  type SnapGradeAdminQuestion,
} from "@/lib/admin-api";
import { cn } from "@/lib/utils";
import { ClipboardCheck, Loader2, Save } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

const field =
  "mt-1.5 h-10 w-full rounded-lg border border-hairline bg-white px-3 text-sm text-ink";

function weightLabel(src: SnapGradeAdminQuestion["weightSource"]) {
  if (src === "admin_curated") return "Admin curated";
  if (src === "official_sqp") return "Official SQP";
  return "Practice CBSE-style";
}

export function AdminSnapGrade({ adminKey }: { adminKey: string }) {
  const [questions, setQuestions] = useState<SnapGradeAdminQuestion[]>([]);
  const [evaluations, setEvaluations] = useState<SnapGradeAdminEvaluation[]>(
    [],
  );
  const [evalCount, setEvalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [draft, setDraft] = useState<SnapGradeAdminQuestion | null>(null);
  const [saving, setSaving] = useState(false);
  const [passOpen, setPassOpen] = useState(false);
  const [passMode, setPassMode] = useState<"save" | "unlock">("save");
  const [message, setMessage] = useState("");

  const [classLevel, setClassLevel] = useState<number | "all">("all");
  const [chapterNumber, setChapterNumber] = useState<number | "all">("all");
  const [exercise, setExercise] = useState<string>("all");
  const [activeOnly, setActiveOnly] = useState(true);
  const [lockedOnly, setLockedOnly] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [data, evals] = await Promise.all([
        fetchSnapGradeAdmin(adminKey),
        fetchSnapGradeEvaluations(adminKey, 40).catch(() => ({
          evaluations: [] as SnapGradeAdminEvaluation[],
        })),
      ]);
      setQuestions(data.questions);
      setEvalCount(data.evalCount);
      setEvaluations(evals.evaluations);
      if (data.questions[0]) {
        setSelectedId((cur) => cur || data.questions[0].id);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [adminKey]);

  useEffect(() => {
    void load();
  }, [load]);

  const classes = useMemo(
    () =>
      [...new Set(questions.map((q) => q.classLevel))].sort((a, b) => a - b),
    [questions],
  );

  const chapters = useMemo(() => {
    const rows = questions.filter(
      (q) => classLevel === "all" || q.classLevel === classLevel,
    );
    const map = new Map<number, string>();
    for (const q of rows) {
      if (!map.has(q.chapterNumber)) map.set(q.chapterNumber, q.chapterName);
    }
    return [...map.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([number, name]) => ({ number, name }));
  }, [questions, classLevel]);

  const exercises = useMemo(() => {
    const rows = questions.filter(
      (q) =>
        (classLevel === "all" || q.classLevel === classLevel) &&
        (chapterNumber === "all" || q.chapterNumber === chapterNumber),
    );
    return [...new Set(rows.map((q) => q.exercise))].sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true }),
    );
  }, [questions, classLevel, chapterNumber]);

  const filtered = useMemo(() => {
    return questions.filter((q) => {
      if (classLevel !== "all" && q.classLevel !== classLevel) return false;
      if (chapterNumber !== "all" && q.chapterNumber !== chapterNumber)
        return false;
      if (exercise !== "all" && q.exercise !== exercise) return false;
      if (activeOnly && !q.active) return false;
      if (lockedOnly && !q.adminLocked) return false;
      return true;
    });
  }, [
    questions,
    classLevel,
    chapterNumber,
    exercise,
    activeOnly,
    lockedOnly,
  ]);

  useEffect(() => {
    if (!filtered.some((q) => q.id === selectedId)) {
      setSelectedId(filtered[0]?.id || "");
    }
  }, [filtered, selectedId]);

  useEffect(() => {
    const q = questions.find((x) => x.id === selectedId) || null;
    setDraft(q ? structuredClone(q) : null);
    setMessage("");
  }, [selectedId, questions]);

  // Reset dependent filters when parent changes
  useEffect(() => {
    setChapterNumber("all");
    setExercise("all");
  }, [classLevel]);

  useEffect(() => {
    setExercise("all");
  }, [chapterNumber]);

  async function saveWithPass(adminPass: string) {
    if (!draft) return;
    setSaving(true);
    setMessage("");
    try {
      await updateSnapGradeQuestion(adminKey, draft.id, adminPass, {
        rubric: draft.rubric,
        markingSchemeNotes: draft.markingSchemeNotes,
        referenceNotes: draft.referenceNotes,
        questionText: draft.questionText,
        creditsCost: draft.creditsCost,
        active: draft.active,
        adminLocked: true,
      });
      setMessage(
        "Saved & locked — seed will keep this rubric; AI uses it on the next grade.",
      );
      await load();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
      setPassOpen(false);
    }
  }

  async function unlockWithPass(adminPass: string) {
    if (!draft) return;
    setSaving(true);
    setMessage("");
    try {
      await updateSnapGradeQuestion(adminKey, draft.id, adminPass, {
        adminLocked: false,
      });
      setMessage("Unlocked — next seed refresh can restore practice marks.");
      await load();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Unlock failed");
    } finally {
      setSaving(false);
      setPassOpen(false);
    }
  }

  const filteredEvals = useMemo(() => {
    return evaluations.filter((e) => {
      if (classLevel !== "all" && e.classLevel !== classLevel) return false;
      if (chapterNumber !== "all" && e.chapterNumber !== chapterNumber)
        return false;
      if (exercise !== "all" && e.exercise !== exercise) return false;
      return true;
    });
  }, [evaluations, classLevel, chapterNumber, exercise]);

  if (loading) {
    return (
      <p className="flex items-center gap-2 text-sm text-muted">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading Snap & Grade…
      </p>
    );
  }

  if (error) {
    return <p className="text-sm font-medium text-coral-dark">{error}</p>;
  }

  const curatedCount = questions.filter((q) => q.adminLocked).length;
  const draftMarks = draft
    ? draft.rubric.reduce((a, s) => a + (Number(s.marks) || 0), 0)
    : 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          label="Questions in bank"
          value={String(questions.length)}
        />
        <AdminStatCard label="In this filter" value={String(filtered.length)} />
        <AdminStatCard label="Evaluations" value={String(evalCount)} />
        <AdminStatCard label="Admin-locked keys" value={String(curatedCount)} />
      </div>

      <div className="rounded-xl border border-hairline bg-cream/40 p-4 text-sm leading-relaxed text-muted">
        <p className="font-bold text-ink">How question weights work</p>
        <p className="mt-1.5">
          NCERT exercises have no official per-question marking key. Each item
          starts with <span className="font-semibold text-ink">practice CBSE-style</span>{" "}
          step weights (≈1–2 short, 3 prove/construct, 1/part for T/F+reason,
          up to 5 for long multi-part). Saving a rubric{" "}
          <span className="font-semibold text-ink">locks</span> it so seed
          refresh won’t overwrite. Optional later: import board SQP keys as{" "}
          <span className="font-semibold text-ink">official_sqp</span>.
        </p>
      </div>

      <AdminSection
        id="snap-grade-rubrics"
        title="Class 9–12 Maths · NCERT rubrics"
        description="Filter by class → chapter → exercise, then edit the step key students are graded against."
      >
        <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <label className="text-xs font-bold uppercase text-muted">
            Class
            <select
              className={field}
              value={classLevel === "all" ? "all" : String(classLevel)}
              onChange={(e) => {
                const v = e.target.value;
                setClassLevel(v === "all" ? "all" : Number(v));
              }}
            >
              <option value="all">All classes</option>
              {classes.map((c) => (
                <option key={c} value={c}>
                  Class {c}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs font-bold uppercase text-muted">
            Chapter
            <select
              className={field}
              value={chapterNumber === "all" ? "all" : String(chapterNumber)}
              onChange={(e) => {
                const v = e.target.value;
                setChapterNumber(v === "all" ? "all" : Number(v));
              }}
            >
              <option value="all">All chapters</option>
              {chapters.map((c) => (
                <option key={c.number} value={c.number}>
                  Ch {c.number} · {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs font-bold uppercase text-muted">
            Exercise
            <select
              className={field}
              value={exercise}
              onChange={(e) => setExercise(e.target.value)}
            >
              <option value="all">All exercises</option>
              {exercises.map((ex) => (
                <option key={ex} value={ex}>
                  {ex.endsWith("-optional")
                    ? `Optional · ${ex.replace(/-optional$/, "")}`
                    : `Ex ${ex}`}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-end gap-2 pb-2 text-xs font-semibold text-ink">
            <input
              type="checkbox"
              checked={activeOnly}
              onChange={(e) => setActiveOnly(e.target.checked)}
            />
            Active only
          </label>
          <label className="flex items-end gap-2 pb-2 text-xs font-semibold text-ink">
            <input
              type="checkbox"
              checked={lockedOnly}
              onChange={(e) => setLockedOnly(e.target.checked)}
            />
            Locked only
          </label>
        </div>

        <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
          <div className="max-h-[640px] space-y-1 overflow-y-auto rounded-xl border border-hairline bg-cream/40 p-2">
            {filtered.length === 0 ? (
              <p className="p-3 text-xs text-muted">No questions in filter.</p>
            ) : (
              filtered.map((q) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setSelectedId(q.id)}
                  className={cn(
                    "w-full rounded-lg px-3 py-2.5 text-left text-sm transition",
                    selectedId === q.id
                      ? "bg-ink text-white"
                      : "hover:bg-white text-ink",
                  )}
                >
                  <span className="font-bold">
                    C{q.classLevel} · Ch{q.chapterNumber} · Ex {q.exercise} · Q
                    {q.questionNumber}
                  </span>
                  <span className="mt-0.5 block truncate text-[11px] opacity-70">
                    {q.maxMarks}m · {q.creditsCost} cr
                    {q.adminLocked ? " · locked" : ""}
                  </span>
                </button>
              ))
            )}
          </div>

          {draft ? (
            <div className="space-y-4 rounded-xl border border-hairline bg-white p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-bold text-ink">
                    Class {draft.classLevel} · Ch{draft.chapterNumber}{" "}
                    {draft.chapterName}
                  </p>
                  <p className="mt-0.5 text-xs text-muted">
                    Ex {draft.exercise} · Q{draft.questionNumber} ·{" "}
                    {weightLabel(draft.weightSource)}
                    {draft.adminLocked ? " · locked" : ""}
                  </p>
                </div>
                <label className="flex items-center gap-2 text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={draft.active}
                    onChange={(e) =>
                      setDraft({ ...draft, active: e.target.checked })
                    }
                  />
                  Active
                </label>
              </div>

              <label className="block text-xs font-bold uppercase text-muted">
                Question text
                <textarea
                  value={draft.questionText}
                  onChange={(e) =>
                    setDraft({ ...draft, questionText: e.target.value })
                  }
                  rows={4}
                  className="mt-1.5 w-full rounded-lg border border-hairline px-3 py-2 text-sm text-ink"
                />
              </label>

              <label className="block text-xs font-bold uppercase text-muted">
                Marking scheme notes (student-visible)
                <textarea
                  value={draft.markingSchemeNotes}
                  onChange={(e) =>
                    setDraft({ ...draft, markingSchemeNotes: e.target.value })
                  }
                  rows={3}
                  className="mt-1.5 w-full rounded-lg border border-hairline px-3 py-2 text-sm text-ink"
                />
              </label>

              <label className="block text-xs font-bold uppercase text-muted">
                Reference notes (grader only)
                <textarea
                  value={draft.referenceNotes}
                  onChange={(e) =>
                    setDraft({ ...draft, referenceNotes: e.target.value })
                  }
                  rows={2}
                  className="mt-1.5 w-full rounded-lg border border-hairline px-3 py-2 text-sm text-ink"
                />
              </label>

              <div className="flex flex-wrap items-end gap-4">
                <label className="block text-xs font-bold uppercase text-muted">
                  Credits cost
                  <input
                    type="number"
                    min={1}
                    value={draft.creditsCost}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        creditsCost: Number(e.target.value) || 5,
                      })
                    }
                    className="mt-1.5 h-10 w-28 rounded-lg border border-hairline px-3 text-sm"
                  />
                </label>
                <p className="pb-2 text-xs font-semibold text-muted">
                  Step total → max marks:{" "}
                  <span className="text-ink">{draftMarks}</span>
                </p>
              </div>

              <div>
                <p className="flex items-center gap-2 text-xs font-bold uppercase text-muted">
                  <ClipboardCheck className="h-3.5 w-3.5" />
                  Rubric steps
                </p>
                <div className="mt-2 space-y-3">
                  {draft.rubric.map((step, i) => (
                    <div
                      key={step.id + i}
                      className="rounded-lg border border-hairline bg-cream/30 p-3"
                    >
                      <div className="grid gap-2 sm:grid-cols-[1fr_80px]">
                        <input
                          value={step.label}
                          onChange={(e) => {
                            const rubric = [...draft.rubric];
                            rubric[i] = { ...step, label: e.target.value };
                            setDraft({ ...draft, rubric });
                          }}
                          className="h-9 rounded-md border border-hairline px-2 text-sm font-semibold"
                          placeholder="Step label"
                        />
                        <input
                          type="number"
                          step={0.5}
                          min={0}
                          value={step.marks}
                          onChange={(e) => {
                            const rubric = [...draft.rubric];
                            rubric[i] = {
                              ...step,
                              marks: Number(e.target.value) || 0,
                            };
                            setDraft({ ...draft, rubric });
                          }}
                          className="h-9 rounded-md border border-hairline px-2 text-sm"
                        />
                      </div>
                      <textarea
                        value={step.criteria}
                        onChange={(e) => {
                          const rubric = [...draft.rubric];
                          rubric[i] = { ...step, criteria: e.target.value };
                          setDraft({ ...draft, rubric });
                        }}
                        rows={2}
                        className="mt-2 w-full rounded-md border border-hairline px-2 py-1.5 text-sm"
                        placeholder="Criteria"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {message ? (
                <p className="text-sm font-medium text-ink">{message}</p>
              ) : null}

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => {
                    setPassMode("save");
                    setPassOpen(true);
                  }}
                  className="inline-flex h-11 items-center gap-2 rounded-lg bg-ink px-4 text-sm font-bold text-white disabled:opacity-60"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save & lock rubric
                </button>
                {draft.adminLocked ? (
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => {
                      setPassMode("unlock");
                      setPassOpen(true);
                    }}
                    className="inline-flex h-11 items-center gap-2 rounded-lg border border-hairline px-4 text-sm font-bold text-ink disabled:opacity-60"
                  >
                    Unlock for seed refresh
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </AdminSection>

      <AdminSection
        id="snap-grade-evals"
        title="Recent evaluations"
        description="Filtered by the same class / chapter / exercise selectors above."
      >
        {filteredEvals.length === 0 ? (
          <p className="text-sm text-muted">No evaluations in this filter.</p>
        ) : (
          <ul className="divide-y divide-hairline rounded-xl border border-hairline bg-white">
            {filteredEvals.map((e) => (
              <li
                key={e.id}
                className="flex flex-wrap items-start justify-between gap-3 px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-semibold text-ink">{e.questionLabel}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    {e.userEmail} · {new Date(e.createdAt).toLocaleString()}
                  </p>
                </div>
                <p className="font-bold tabular-nums text-ink">
                  {e.marksAwarded}/{e.maxMarks}
                  <span className="ml-2 text-xs font-medium text-muted">
                    −{e.creditsDeducted} cr
                  </span>
                </p>
              </li>
            ))}
          </ul>
        )}
      </AdminSection>

      <AdminPassDialog
        open={passOpen}
        onClose={() => setPassOpen(false)}
        title={passMode === "unlock" ? "Confirm unlock" : "Confirm rubric save"}
        description={
          passMode === "unlock"
            ? "Enter admin password to unlock this question for seed refresh."
            : "Enter admin password to lock this marking key (seed will not overwrite)."
        }
        busy={saving}
        onConfirm={(pass) => {
          if (passMode === "unlock") void unlockWithPass(pass);
          else void saveWithPass(pass);
        }}
      />
    </div>
  );
}
