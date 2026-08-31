"use client";

import {
  AdminBarList,
  AdminSection,
  AdminStatCard,
} from "@/components/admin/admin-ui";
import { AdminConnectionsTable } from "@/components/admin/admin-connections-table";
import { AdminEngagementTables } from "@/components/admin/admin-engagement-tables";
import { AdminMessenger } from "@/components/admin/admin-messenger";
import { AdminRequirementsTable } from "@/components/admin/admin-requirements-table";
import { AdminUsersTable } from "@/components/admin/admin-users-table";
import { fetchAdminStats, type AdminStats } from "@/lib/admin-api";
import { cn } from "@/lib/utils";
import {
  Activity,
  BarChart3,
  LayoutDashboard,
  Link2,
  Mail,
  Megaphone,
  RefreshCw,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const NAV = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "users", label: "User management", icon: Users },
  { id: "requirements", label: "Board posts", icon: Megaphone },
  { id: "connections", label: "Connections", icon: Link2 },
  { id: "messenger", label: "Messenger", icon: Mail },
  { id: "engagement", label: "Engagement", icon: Activity },
  { id: "supply", label: "Supply", icon: BarChart3 },
] as const;

type SectionId = (typeof NAV)[number]["id"];

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AdminDashboard({ adminKey }: { adminKey: string }) {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState<SectionId>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminStats(adminKey);
      setStats(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, [adminKey]);

  useEffect(() => {
    void load();
  }, [load]);

  const pick = (id: SectionId) => {
    setSection(id);
    setSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-cream">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[220px] flex-col border-r border-white/10 bg-ink text-white transition-transform lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="border-b border-white/10 px-4 py-4">
          <p className="text-xs font-bold uppercase tracking-wider text-white/50">
            Mentr
          </p>
          <p className="text-sm font-bold text-white">Admin</p>
        </div>

        <nav className="flex-1 space-y-0.5 p-2">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => pick(id)}
              className={cn(
                "flex min-h-10 w-full items-center gap-2.5 rounded-lg px-3 text-left text-sm font-medium touch-manipulation transition",
                section === id
                  ? "bg-white/10 text-butter"
                  : "text-white/70 hover:bg-white/5 hover:text-white",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            onClick={() => void load()}
            disabled={loading}
            className="flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-white/15 text-xs font-semibold text-white/80 touch-manipulation hover:bg-white/5 disabled:opacity-50"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
            Refresh
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-ink/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-hairline bg-white/95 px-4 py-3 backdrop-blur sm:px-5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-hairline lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <LayoutDashboard className="h-4 w-4" />
            </button>
            <div>
              <p className="text-sm font-bold text-ink capitalize">{section}</p>
              {stats && (
                <p className="text-[11px] text-muted">
                  Updated {formatTime(stats.generatedAt)}
                </p>
              )}
            </div>
          </div>
        </header>

        <main
          className={cn(
            "flex-1 overflow-y-auto",
            section === "messenger" ? "overflow-hidden p-0" : "p-4 sm:p-5 lg:p-6",
          )}
        >
          {error && section !== "messenger" && (
            <div className="mb-4 rounded-xl border-2 border-ink bg-butter/50 px-4 py-3 text-sm text-ink">
              {error}
            </div>
          )}

          {loading && !stats && (
            <p className="text-sm text-muted">Loading analytics…</p>
          )}

          {stats && section === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                <AdminStatCard label="Total users" value={stats.users.total} accent="coral" />
                <AdminStatCard
                  label="Live tutors"
                  value={stats.users.facultyLive}
                  sub={`${stats.users.faculty} registered`}
                  accent="sage"
                />
                <AdminStatCard label="Parents" value={stats.users.parents} />
                <AdminStatCard label="Board posts" value={stats.requirements.total} accent="coral" />
                <AdminStatCard
                  label="Connections"
                  value={stats.connections.total}
                  sub={`${stats.connections.accepted} accepted`}
                  accent="butter"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-hairline bg-white p-4">
                  <p className="text-xs font-bold text-ink">Marketplace pulse</p>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <AdminStatCard label="Open posts" value={stats.requirements.open} />
                    <AdminStatCard label="Board interests" value={stats.requirements.totalInterests} />
                    <AdminStatCard label="Profile views" value={stats.engagement.profileViews} />
                    <AdminStatCard label="New users (7d)" value={stats.users.newLast7Days} accent="coral" />
                  </div>
                </div>
                <div className="rounded-xl border border-hairline bg-white p-4">
                  <p className="text-xs font-bold text-ink">Connection funnel</p>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg bg-cream-band px-2 py-3">
                      <p className="text-lg font-bold text-ink">{stats.connections.pending}</p>
                      <p className="text-[10px] text-muted">Pending</p>
                    </div>
                    <div className="rounded-lg bg-sage-wash px-2 py-3">
                      <p className="text-lg font-bold text-sage">{stats.connections.accepted}</p>
                      <p className="text-[10px] text-muted">Accepted</p>
                    </div>
                    <div className="rounded-lg bg-cream-band px-2 py-3">
                      <p className="text-lg font-bold text-ink">{stats.connections.acceptanceRate}%</p>
                      <p className="text-[10px] text-muted">Accept rate</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {section === "messenger" && <AdminMessenger adminKey={adminKey} />}

          {stats && section === "users" && (
            <AdminSection
              id="users"
              title="User management"
              description="Registered users — parents and tutors (demo accounts excluded)"
            >
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                <AdminStatCard label="Total" value={stats.users.total} />
                <AdminStatCard label="Parents" value={stats.users.parents} accent="coral" />
                <AdminStatCard label="Faculty" value={stats.users.faculty} accent="sage" />
                <AdminStatCard label="Email verified" value={stats.users.verified} />
                <AdminStatCard label="Live tutor profiles" value={stats.users.facultyLive} accent="sage" />
                <AdminStatCard label="Complete parent profiles" value={stats.users.parentsComplete} />
                <AdminStatCard label="New (7 days)" value={stats.users.newLast7Days} accent="coral" />
                <AdminStatCard label="Active (30 days)" value={stats.users.activeLast30Days} />
              </div>
              <AdminUsersTable adminKey={adminKey} />
            </AdminSection>
          )}

          {stats && section === "connections" && (
            <AdminSection
              id="connections"
              title="Connections"
              description="Every parent ↔ tutor connect request — who reached out to whom"
            >
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                <AdminStatCard label="Total" value={stats.connections.total} />
                <AdminStatCard label="Pending" value={stats.connections.pending} accent="butter" />
                <AdminStatCard label="Accepted" value={stats.connections.accepted} accent="sage" />
                <AdminStatCard label="Declined" value={stats.connections.declined} />
                <AdminStatCard label="Parent initiated" value={stats.connections.parentInitiated} />
                <AdminStatCard label="Tutor pitched" value={stats.connections.teacherInitiated} accent="coral" />
                <AdminStatCard label="Acceptance rate" value={`${stats.connections.acceptanceRate}%`} accent="sage" />
              </div>
              <AdminConnectionsTable adminKey={adminKey} />
            </AdminSection>
          )}

          {stats && section === "requirements" && (
            <AdminSection
              id="requirements"
              title="Board posts"
              description="Requirement threads posted by parents on the tutor board"
            >
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                <AdminStatCard label="Total posted" value={stats.requirements.total} />
                <AdminStatCard label="Open" value={stats.requirements.open} accent="sage" />
                <AdminStatCard label="Closed" value={stats.requirements.closed} />
                <AdminStatCard label="Expired" value={stats.requirements.expired} />
                <AdminStatCard label="Total interests" value={stats.requirements.totalInterests} accent="coral" />
                <AdminStatCard label="Avg interests / post" value={stats.requirements.avgInterestsPerPost} />
              </div>
              <div className="mt-4 rounded-xl border border-hairline bg-white p-4">
                <p className="text-xs font-bold text-ink">Top subjects on board</p>
                <div className="mt-3">
                  <AdminBarList
                    items={stats.requirements.topSubjects.map((s) => ({
                      label: s.subject,
                      value: s.count,
                    }))}
                  />
                </div>
              </div>
              <AdminRequirementsTable adminKey={adminKey} />
            </AdminSection>
          )}

          {stats && section === "engagement" && (
            <AdminSection
              id="engagement"
              title="Engagement"
              description="Profile views, tutor discovery, and auth activity — full detail"
            >
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                <AdminStatCard label="Profile views (total)" value={stats.engagement.profileViews} accent="coral" />
                <AdminStatCard label="Teachers viewed" value={stats.engagement.teachersViewed} />
                <AdminStatCard label="OTP sessions (24h)" value={stats.engagement.otpSessions24h} accent="butter" />
              </div>
              <AdminEngagementTables adminKey={adminKey} />
            </AdminSection>
          )}

          {stats && section === "supply" && (
            <AdminSection id="supply" title="Tutor supply" description="Where tutors are and what they teach">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-hairline bg-white p-4">
                  <p className="text-xs font-bold text-ink">Tutors by city</p>
                  <div className="mt-3">
                    <AdminBarList
                      items={stats.supply.facultyByCity.map((c) => ({
                        label: c.city,
                        value: c.count,
                      }))}
                      emptyLabel="No live tutors yet"
                    />
                  </div>
                </div>
                <div className="rounded-xl border border-hairline bg-white p-4">
                  <p className="text-xs font-bold text-ink">Top tutor subjects</p>
                  <div className="mt-3">
                    <AdminBarList
                      items={stats.supply.topSubjects.map((s) => ({
                        label: s.subject,
                        value: s.count,
                      }))}
                      emptyLabel="No subjects listed"
                    />
                  </div>
                </div>
              </div>
            </AdminSection>
          )}
        </main>
      </div>
    </div>
  );
}
