"use client";

import { fetchAdminUsers, type AdminUserRow } from "@/lib/admin-api";
import { cn } from "@/lib/utils";
import { ChevronDown, Loader2, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function RoleBadge({ role }: { role: string }) {
  return (
    <span
      className={cn(
        "inline-block px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        role === "faculty" ? "bg-sage-wash text-sage" : "bg-coral-wash text-coral-dark",
      )}
    >
      {role}
    </span>
  );
}

function DetailItem({ label, value }: { label: string; value?: string | number | null }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-0.5 break-words text-xs text-ink">{value}</p>
    </div>
  );
}

function UserDetailPanel({ user }: { user: AdminUserRow }) {
  return (
    <div className="border-t border-hairline bg-cream/80 px-4 py-3">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-muted">
        Full platform details
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <DetailItem label="User ID" value={user.id} />
        <DetailItem label="Email" value={user.email} />
        <DetailItem label="Phone" value={user.phone} />
        <DetailItem label="Email verified" value={user.emailVerified ? "Yes" : "No"} />
        <DetailItem label="Profile complete" value={user.profileComplete ? "Yes" : "No"} />
        <DetailItem label="Country" value={user.country} />
        <DetailItem label="City" value={user.city} />
        <DetailItem label="Area" value={user.area} />
        <DetailItem label="Joined" value={formatDate(user.createdAt)} />
        <DetailItem label="Last updated" value={formatDate(user.updatedAt)} />
        <DetailItem label="Last login" value={formatDate(user.lastLoginAt)} />
        <DetailItem label="Referral URL" value={user.referralUrl} />
        <DetailItem label="Registration source" value={user.registrationSource} />
      </div>

      {user.faculty && (
        <div className="mt-4 border-t border-hairline pt-3">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-sage">
            Tutor profile
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <DetailItem label="Designation" value={user.faculty.designation} />
            <DetailItem label="Qualification" value={user.faculty.qualification} />
            <DetailItem
              label="Experience"
              value={
                user.faculty.experienceYears
                  ? `${user.faculty.experienceYears} years`
                  : undefined
              }
            />
            <DetailItem label="Hourly rate" value={user.faculty.hourlyRate ? `₹${user.faculty.hourlyRate}` : undefined} />
            <DetailItem label="Workplace" value={user.faculty.workplace} />
            <DetailItem label="Gender" value={user.faculty.gender} />
            <DetailItem label="Timezone" value={user.faculty.timezone} />
            <DetailItem
              label="Availability slots"
              value={user.faculty.availabilitySlots}
            />
            <DetailItem label="Subjects" value={user.faculty.subjects.join(", ") || undefined} />
            <DetailItem label="Levels" value={user.faculty.levels.join(", ") || undefined} />
            <DetailItem label="Languages" value={user.faculty.languages.join(", ") || undefined} />
            <DetailItem
              label="Teaching modes"
              value={user.faculty.teachingModes.join(", ") || undefined}
            />
            <DetailItem
              label="Certifications"
              value={user.faculty.certifications.join(", ") || undefined}
            />
            <DetailItem
              label="Achievements"
              value={user.faculty.achievements.join(", ") || undefined}
            />
          </div>
          {user.faculty.bio && (
            <div className="mt-3">
              <DetailItem label="Bio" value={user.faculty.bio} />
            </div>
          )}
        </div>
      )}

      {user.parent && (
        <div className="mt-4 border-t border-hairline pt-3">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-coral-dark">
            Parent profile
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <DetailItem label="Phone" value={user.parent.phoneNumber} />
            <DetailItem label="City" value={user.parent.city} />
            <DetailItem label="Area" value={user.parent.area} />
            <DetailItem label="Country" value={user.parent.country} />
          </div>
        </div>
      )}
    </div>
  );
}

type Props = {
  adminKey: string;
};

export function AdminUsersTable({ adminKey }: Props) {
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminUsers(adminKey, query);
      setUsers(data.users);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [adminKey, query]);

  useEffect(() => {
    const t = setTimeout(() => void load(), 250);
    return () => clearTimeout(t);
  }, [load]);

  return (
    <div className="mt-4 border border-hairline bg-white">
      <div className="flex flex-wrap items-center gap-2 border-b border-hairline px-3 py-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
          All users · {users.length}
        </p>
        <p className="text-[11px] text-muted">Click a row for full details</p>
        <div className="relative ml-auto min-w-[180px] flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by name or email"
            className="h-8 w-full border border-hairline bg-cream pl-7 pr-2 text-xs text-ink outline-none focus:border-ink"
          />
        </div>
      </div>

      {error && (
        <p className="border-b border-hairline bg-butter/40 px-3 py-2 text-xs text-ink">
          {error}
        </p>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[880px] border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-hairline bg-cream-band/60 text-[10px] font-semibold uppercase tracking-wider text-muted">
              <th className="w-8 px-2 py-2" />
              <th className="px-3 py-2 font-semibold">Name</th>
              <th className="px-3 py-2 font-semibold">Email</th>
              <th className="px-3 py-2 font-semibold">Role</th>
              <th className="px-3 py-2 font-semibold">Profile</th>
              <th className="px-3 py-2 font-semibold">Location</th>
              <th className="px-3 py-2 font-semibold">Phone</th>
              <th className="px-3 py-2 font-semibold">Joined</th>
              <th className="px-3 py-2 font-semibold">Last login</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="px-3 py-8 text-center text-muted">
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Loading users…
                  </span>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-3 py-8 text-center text-muted">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const open = expandedId === user.id;
                return (
                  <tr key={user.id} className="group border-b border-hairline/70">
                    <td colSpan={9} className="p-0">
                      <button
                        type="button"
                        onClick={() => setExpandedId(open ? null : user.id)}
                        className={cn(
                          "flex w-full min-w-[880px] items-center text-left transition hover:bg-cream/50",
                          open && "bg-cream-band/50",
                        )}
                      >
                        <span className="flex w-8 shrink-0 justify-center px-2 py-2">
                          <ChevronDown
                            className={cn(
                              "h-3.5 w-3.5 text-muted transition",
                              open && "rotate-180",
                            )}
                          />
                        </span>
                        <span className="min-w-[120px] flex-1 px-3 py-2 font-medium text-ink">
                          {user.name}
                        </span>
                        <span className="min-w-[160px] flex-1 truncate px-3 py-2 text-muted">
                          {user.email}
                        </span>
                        <span className="w-20 shrink-0 px-3 py-2">
                          <RoleBadge role={user.role} />
                        </span>
                        <span className="w-24 shrink-0 px-3 py-2 text-muted">
                          {user.profileComplete ? "Complete" : "Incomplete"}
                        </span>
                        <span className="min-w-[100px] flex-1 px-3 py-2 text-muted">
                          {user.city}
                          {user.area && user.area !== "—" ? ` · ${user.area}` : ""}
                        </span>
                        <span className="w-28 shrink-0 truncate px-3 py-2 text-muted">
                          {user.phone || "—"}
                        </span>
                        <span className="w-24 shrink-0 whitespace-nowrap px-3 py-2 text-muted">
                          {formatDate(user.createdAt).split(",")[0]}
                        </span>
                        <span className="w-24 shrink-0 whitespace-nowrap px-3 py-2 text-muted">
                          {user.lastLoginAt
                            ? formatDate(user.lastLoginAt).split(",")[0]
                            : "—"}
                        </span>
                      </button>
                      {open && <UserDetailPanel user={user} />}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
