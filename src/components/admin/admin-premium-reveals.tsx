"use client";

import { AdminSection, AdminStatCard } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  fetchAdminPremiumReveals,
  type AdminPremiumRevealPerson,
  type AdminPremiumRevealRow,
  type AdminPremiumRevealStats,
} from "@/lib/admin-api";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Eye,
  Loader2,
  MapPin,
  Phone,
  RefreshCw,
  Search,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

function formatWhen(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatRelative(iso: string | null) {
  if (!iso) return "";
  const ms = Date.now() - new Date(iso).getTime();
  if (!Number.isFinite(ms) || ms < 0) return "";
  const mins = Math.floor(ms / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 14) return `${days}d ago`;
  return "";
}

function PersonAvatar({
  person,
  tone,
}: {
  person: AdminPremiumRevealPerson;
  tone: "mentor" | "parent";
}) {
  const bg =
    tone === "mentor"
      ? "from-coral-wash to-butter/70 text-coral-dark"
      : "from-sage-wash to-sky/50 text-sage";

  return (
    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-hairline bg-cream-band sm:h-14 sm:w-14">
      {person.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={person.imageUrl}
          alt={person.name}
          className="h-full w-full object-cover"
        />
      ) : (
        <div
          className={cn(
            "flex h-full w-full items-center justify-center bg-gradient-to-br text-sm font-bold",
            bg,
          )}
        >
          {person.initials || "?"}
        </div>
      )}
    </div>
  );
}

function PersonBlock({
  person,
  role,
}: {
  person: AdminPremiumRevealPerson;
  role: "mentor" | "parent";
}) {
  const location = [person.area, person.city].filter(Boolean).join(", ");
  return (
    <div className="flex min-w-0 items-start gap-3">
      <PersonAvatar person={person} tone={role} />
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
          {role === "mentor" ? "Mentor" : "Parent"}
        </p>
        <p className="truncate text-sm font-bold text-ink">{person.name}</p>
        {person.email ? (
          <p className="truncate text-xs text-muted">{person.email}</p>
        ) : null}
        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-muted">
          {location ? (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3 shrink-0 text-coral" />
              <span className="truncate">{location}</span>
            </span>
          ) : null}
          {person.phone ? (
            <span className="inline-flex items-center gap-1 tabular-nums">
              <Phone className="h-3 w-3 shrink-0" />
              {person.phone}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function RevealCard({ row }: { row: AdminPremiumRevealRow }) {
  const rel = formatRelative(row.revealedAt);
  return (
    <article className="rounded-2xl border border-hairline bg-white p-4 shadow-[0_1px_2px_rgba(26,35,28,0.04)] transition hover:border-ink/15 hover:shadow-[0_8px_24px_rgba(26,35,28,0.06)] sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline pb-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-md bg-coral-wash px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-coral-dark">
            <Eye className="h-3 w-3" />
            Reveal
          </span>
          {row.hasPosted ? (
            <span className="rounded-md bg-sage-wash px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-sage">
              Had open posts
            </span>
          ) : (
            <span className="rounded-md bg-cream-band px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted">
              No board post
            </span>
          )}
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold text-ink">
            {formatWhen(row.revealedAt)}
          </p>
          {rel ? <p className="text-[11px] text-muted">{rel}</p> : null}
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <PersonBlock person={row.mentor} role="mentor" />
        <div className="hidden justify-center sm:flex">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline bg-cream text-coral">
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
        <PersonBlock person={row.parent} role="parent" />
      </div>
    </article>
  );
}

export function AdminPremiumReveals({ adminKey }: { adminKey: string }) {
  const [rows, setRows] = useState<AdminPremiumRevealRow[]>([]);
  const [stats, setStats] = useState<AdminPremiumRevealStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(query.trim()), 280);
    return () => window.clearTimeout(t);
  }, [query]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminPremiumReveals(adminKey, {
        q: debounced || undefined,
        limit: 150,
      });
      setRows(data.reveals);
      setStats(data.stats);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
      setRows([]);
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, [adminKey, debounced]);

  useEffect(() => {
    void load();
  }, [load]);

  const groupedToday = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return rows.filter(
      (r) => r.revealedAt && new Date(r.revealedAt) >= start,
    ).length;
  }, [rows]);

  return (
    <AdminSection
      id="premium-reveals"
      title="Premium reveals"
      description="Which paid mentor unlocked which parent contact — with photos, place, and time."
      actions={
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => void load()}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" />
          )}
          Refresh
        </Button>
      }
    >
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <AdminStatCard label="All reveals" value={stats?.total ?? 0} />
        <AdminStatCard
          label="Today"
          value={stats?.today ?? groupedToday}
          accent="coral"
        />
        <AdminStatCard
          label="Mentors who revealed"
          value={stats?.uniqueMentors ?? 0}
          accent="butter"
        />
        <AdminStatCard
          label="Parents unlocked"
          value={stats?.uniqueParents ?? 0}
          accent="sage"
        />
      </div>

      <div className="relative mt-4 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search mentor, parent, city, phone…"
          className="h-10 pl-9"
        />
      </div>

      {error ? (
        <p className="mt-4 rounded-lg border border-coral/30 bg-coral-wash/40 px-3 py-2 text-sm text-coral">
          {error}
        </p>
      ) : null}

      {loading && rows.length === 0 ? (
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading reveals…
        </div>
      ) : rows.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-hairline bg-white px-6 py-12 text-center">
          <Users className="mx-auto h-8 w-8 text-muted" />
          <p className="mt-3 text-sm font-semibold text-ink">No reveals yet</p>
          <p className="mt-1 text-xs text-muted">
            When Premium mentors unlock parent contacts, they show up here.
          </p>
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {rows.map((row) => (
            <li key={row.id}>
              <RevealCard row={row} />
            </li>
          ))}
        </ul>
      )}
    </AdminSection>
  );
}
