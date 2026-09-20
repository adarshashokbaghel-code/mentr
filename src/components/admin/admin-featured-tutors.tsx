"use client";

import { AdminPassDialog } from "@/components/admin/admin-pass-dialog";
import { AdminSection } from "@/components/admin/admin-ui";
import { MentorPhoto } from "@/components/ui/mentor-photo";
import { Button } from "@/components/ui/button";
import {
  fetchAdminFeaturedTutors,
  saveAdminFeaturedTutors,
  searchAdminFeaturedTutors,
  type FeaturedAdminTeacher,
} from "@/lib/admin-api";
import { cn } from "@/lib/utils";
import {
  ArrowDown,
  ArrowUp,
  Check,
  Loader2,
  Plus,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

function TeacherPickRow({
  teacher,
  selected,
  onToggle,
  onMove,
  onRemove,
  index,
  total,
}: {
  teacher: FeaturedAdminTeacher;
  selected?: boolean;
  onToggle?: () => void;
  onMove?: (dir: -1 | 1) => void;
  onRemove?: () => void;
  index?: number;
  total?: number;
}) {
  const place = [teacher.area, teacher.city].filter(Boolean).join(", ");
  const rate =
    teacher.hourlyRate != null && teacher.hourlyRate > 0
      ? `₹${Math.round(teacher.hourlyRate)}/hr`
      : null;

  return (
    <li
      className={cn(
        "flex items-center gap-3 rounded-xl border bg-white p-2.5",
        selected ? "border-coral/40 bg-coral/5" : "border-hairline",
        !teacher.profileComplete && "opacity-70",
      )}
    >
      <MentorPhoto
        name={teacher.name}
        initials={initialsOf(teacher.name)}
        imageUrl={teacher.imageUrl}
        size="sm"
        rounded="lg"
        showInitials={false}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ink">
          {teacher.name}
          {teacher.verified && (
            <span className="ml-1.5 text-[10px] font-bold uppercase text-sage">
              Verified
            </span>
          )}
        </p>
        <p className="truncate text-[11px] text-muted">
          {teacher.subjects.slice(0, 3).join(" · ") || "No subjects"}
          {place ? ` · ${place}` : ""}
          {rate ? ` · ${rate}` : ""}
        </p>
        {!teacher.profileComplete && (
          <p className="text-[10px] font-medium text-coral-dark">
            Profile incomplete — may not show on site
          </p>
        )}
      </div>

      {onMove && typeof index === "number" && typeof total === "number" && (
        <div className="flex flex-col gap-0.5">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => onMove(-1)}
            className="rounded p-1 text-muted hover:bg-cream hover:text-ink disabled:opacity-30"
            aria-label="Move up"
          >
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            disabled={index >= total - 1}
            onClick={() => onMove(1)}
            className="rounded p-1 text-muted hover:bg-cream hover:text-ink disabled:opacity-30"
            aria-label="Move down"
          >
            <ArrowDown className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          className="rounded-lg p-2 text-muted transition hover:bg-coral-wash hover:text-coral-dark"
          aria-label="Remove"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      ) : (
        <button
          type="button"
          onClick={onToggle}
          className={cn(
            "inline-flex h-8 items-center gap-1 rounded-lg px-2.5 text-xs font-semibold transition",
            selected
              ? "bg-ink text-white"
              : "border border-hairline bg-cream text-ink hover:border-ink/30",
          )}
        >
          {selected ? (
            <>
              <Check className="h-3.5 w-3.5" />
              Added
            </>
          ) : (
            <>
              <Plus className="h-3.5 w-3.5" />
              Add
            </>
          )}
        </button>
      )}
    </li>
  );
}

export function AdminFeaturedTutors({ adminKey }: { adminKey: string }) {
  const [selected, setSelected] = useState<FeaturedAdminTeacher[]>([]);
  const [max, setMax] = useState(8);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FeaturedAdminTeacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [passOpen, setPassOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [passError, setPassError] = useState<string | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);

  const selectedIds = useMemo(
    () => new Set(selected.map((t) => t.id)),
    [selected],
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminFeaturedTutors(adminKey);
      setSelected(data.selected);
      setMax(data.max);
      setDirty(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [adminKey]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const t = window.setTimeout(async () => {
      setSearching(true);
      try {
        const data = await searchAdminFeaturedTutors(adminKey, query);
        setResults(data.teachers);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 220);
    return () => window.clearTimeout(t);
  }, [adminKey, query]);

  function addTeacher(t: FeaturedAdminTeacher) {
    if (selectedIds.has(t.id)) return;
    if (selected.length >= max) {
      setError(`Max ${max} featured tutors`);
      return;
    }
    setSelected((prev) => [...prev, t]);
    setDirty(true);
    setError(null);
  }

  function removeTeacher(id: string) {
    setSelected((prev) => prev.filter((t) => t.id !== id));
    setDirty(true);
  }

  function moveTeacher(index: number, dir: -1 | 1) {
    setSelected((prev) => {
      const next = [...prev];
      const j = index + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[index], next[j]] = [next[j]!, next[index]!];
      return next;
    });
    setDirty(true);
  }

  async function confirmSave(adminPass: string) {
    setSaving(true);
    setPassError(null);
    try {
      const data = await saveAdminFeaturedTutors(
        adminKey,
        selected.map((t) => t.id),
        adminPass,
      );
      setSelected(data.selected);
      setMax(data.max);
      setDirty(false);
      setPassOpen(false);
      setSavedFlash(true);
      window.setTimeout(() => setSavedFlash(false), 2000);
    } catch (e) {
      setPassError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <p className="text-sm text-muted">
        <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
        Loading featured tutors…
      </p>
    );
  }

  return (
    <div className="space-y-5">
      <AdminSection
        id="featured-tutors"
        title="Featured tutors"
        description="Pick who appears in “Featured for parents” on the homepage. Order here = order on the site. Max 8."
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-semibold text-muted">
            <Star className="mr-1 inline h-3.5 w-3.5 text-coral" />
            {selected.length}/{max} selected
            {dirty && (
              <span className="ml-2 text-coral-dark">Unsaved changes</span>
            )}
            {savedFlash && (
              <span className="ml-2 text-sage">Saved · live on homepage</span>
            )}
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="h-8 text-xs"
              disabled={!dirty || saving}
              onClick={() => void load()}
            >
              Reset
            </Button>
            <Button
              size="sm"
              className="h-8 text-xs"
              disabled={!dirty || saving}
              onClick={() => {
                setPassError(null);
                setPassOpen(true);
              }}
            >
              Save to homepage
            </Button>
          </div>
        </div>

        {error && (
          <p className="mt-3 rounded-md border border-coral/30 bg-coral-wash px-3 py-2 text-xs font-medium text-coral-dark">
            {error}
          </p>
        )}

        <div className="mt-4 grid gap-5 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-muted">
              On homepage (in order)
            </p>
            {selected.length === 0 ? (
              <p className="rounded-xl border border-dashed border-hairline bg-cream/50 px-4 py-8 text-center text-sm text-muted">
                None selected — homepage falls back to auto picks until you
                save a list.
              </p>
            ) : (
              <ul className="space-y-2">
                {selected.map((t, i) => (
                  <TeacherPickRow
                    key={t.id}
                    teacher={t}
                    index={i}
                    total={selected.length}
                    onMove={(dir) => moveTeacher(i, dir)}
                    onRemove={() => removeTeacher(t.id)}
                  />
                ))}
              </ul>
            )}
          </div>

          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-muted">
              Search faculty to add
            </p>
            <div className="relative mb-3">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Name, subject, city…"
                className="h-9 w-full rounded-lg border border-hairline bg-white pl-9 pr-8 text-sm outline-none focus:border-ink"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted hover:text-ink"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            {searching && (
              <p className="mb-2 text-xs text-muted">
                <Loader2 className="mr-1 inline h-3 w-3 animate-spin" />
                Searching…
              </p>
            )}
            <ul className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
              {results.map((t) => (
                <TeacherPickRow
                  key={t.id}
                  teacher={t}
                  selected={selectedIds.has(t.id)}
                  onToggle={() =>
                    selectedIds.has(t.id)
                      ? removeTeacher(t.id)
                      : addTeacher(t)
                  }
                />
              ))}
              {!searching && results.length === 0 && (
                <p className="py-6 text-center text-sm text-muted">
                  No faculty matched.
                </p>
              )}
            </ul>
          </div>
        </div>
      </AdminSection>

      <AdminPassDialog
        open={passOpen}
        title="Save featured tutors"
        description="Confirm with admin password to publish this list on the homepage."
        confirmLabel="Save"
        busy={saving}
        error={passError}
        onConfirm={confirmSave}
        onClose={() => {
          if (!saving) setPassOpen(false);
        }}
      />
    </div>
  );
}
