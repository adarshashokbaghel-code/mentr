import { profileApi, type AuthUser } from "@/lib/api";

export const SHORTLIST_STORAGE_KEY = "champs_parent_shortlist";
export const MAX_SHORTLIST = 3;

export function readGuestShortlist(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SHORTLIST_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((id) => String(id || "").trim())
      .filter((id) => /^[a-f\d]{24}$/i.test(id))
      .filter((id, i, arr) => arr.indexOf(id) === i)
      .slice(0, MAX_SHORTLIST);
  } catch {
    return [];
  }
}

export function writeGuestShortlist(ids: string[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      SHORTLIST_STORAGE_KEY,
      JSON.stringify(ids.slice(0, MAX_SHORTLIST)),
    );
  } catch {
    /* quota / private mode */
  }
}

export function clearGuestShortlist() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(SHORTLIST_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function mergeShortlistIds(local: string[], server: string[]): string[] {
  const merged: string[] = [];
  for (const id of [...local, ...server]) {
    if (!merged.includes(id)) merged.push(id);
    if (merged.length >= MAX_SHORTLIST) break;
  }
  return merged;
}

export function canPersistShortlist(user: AuthUser | null): boolean {
  return Boolean(
    user?.role === "parent" &&
      user.profileCompleted &&
      user.parentProfile?.name,
  );
}

/** Merge guest localStorage shortlist into the parent account after login. */
export async function syncShortlistAfterAuth(
  user: AuthUser,
  setUser: (user: AuthUser) => void,
): Promise<void> {
  const local = readGuestShortlist();
  if (!local.length || !canPersistShortlist(user)) return;

  const server = user.parentProfile?.shortlistedTeacherIds ?? [];
  const merged = mergeShortlistIds(local, server);
  writeGuestShortlist([]);

  if (
    merged.length === server.length &&
    merged.every((id, i) => id === server[i])
  ) {
    return;
  }

  try {
    const { user: updated } = await profileApi.saveShortlist(merged);
    setUser(updated);
  } catch {
    writeGuestShortlist(local);
  }
}

export function feeHint(hourlyRate?: number | null): string {
  if (hourlyRate != null && hourlyRate > 0) {
    return `₹${hourlyRate.toLocaleString("en-IN")}/hr`;
  }
  return "Ask on connect";
}

export function compareFeeDisplay(hourlyRate?: number | null): {
  primary: string;
  secondary: string;
} {
  if (hourlyRate != null && hourlyRate > 0) {
    return {
      primary: `₹${hourlyRate.toLocaleString("en-IN")}/hr`,
      secondary: "Indicative rate — confirm on WhatsApp",
    };
  }
  return {
    primary: "Not listed on profile",
    secondary: "Ask when you connect — Mentr takes no cut",
  };
}

export function compareSlotsForTeacher(teacher: {
  slots: { label: string; available: boolean }[];
  openSlots: number;
}): {
  open: { label: string; available: boolean }[];
  booked: { label: string; available: boolean }[];
} {
  const open = teacher.slots.filter((s) => s.available);
  const booked = teacher.slots.filter((s) => !s.available);
  return { open, booked };
}
