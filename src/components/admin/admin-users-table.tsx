"use client";

import { fetchAdminUsers, type AdminUserRow } from "@/lib/admin-api";
import { cn } from "@/lib/utils";
import { Loader2, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "2-digit",
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

function BoolBadge({ ok, yes = "Yes", no = "No" }: { ok: boolean; yes?: string; no?: string }) {
  return (
    <span
      className={cn(
        "text-[11px] font-medium",
        ok ? "text-sage" : "text-muted",
      )}
    >
      {ok ? yes : no}
    </span>
  );
}

type Props = {
  adminKey: string;
};

export function AdminUsersTable({ adminKey }: Props) {
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [query, setQuery] = useState("");
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
              <th className="px-3 py-2 font-semibold">Name</th>
              <th className="px-3 py-2 font-semibold">Email</th>
              <th className="px-3 py-2 font-semibold">Role</th>
              <th className="px-3 py-2 font-semibold">Profile</th>
              <th className="px-3 py-2 font-semibold">City</th>
              <th className="px-3 py-2 font-semibold">Joined</th>
              <th className="px-3 py-2 font-semibold">Last login</th>
              <th className="px-3 py-2 font-semibold">Referral</th>
              <th className="px-3 py-2 font-semibold">Source</th>
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
              users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-hairline/70 last:border-0 hover:bg-cream/50"
                >
                  <td className="px-3 py-2 font-medium text-ink">{user.name}</td>
                  <td className="max-w-[180px] truncate px-3 py-2 text-muted">{user.email}</td>
                  <td className="px-3 py-2">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="px-3 py-2">
                    <BoolBadge ok={user.profileComplete} yes="Complete" no="Incomplete" />
                  </td>
                  <td className="px-3 py-2 text-muted">{user.city}</td>
                  <td className="whitespace-nowrap px-3 py-2 text-muted">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-muted">
                    {formatDate(user.lastLoginAt)}
                  </td>
                  <td className="px-3 py-2">
                    <BoolBadge ok={Boolean(user.referralUrl)} yes="Yes" no="—" />
                  </td>
                  <td className="max-w-[120px] truncate px-3 py-2 text-[10px] text-muted">
                    {user.registrationSource ? (
                      <span title={user.registrationSource}>
                        {user.registrationSource.replace(/^https?:\/\//, "")}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
