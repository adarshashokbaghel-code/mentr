"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { useToast } from "@/components/ui/toast";
import type { AuthUser } from "@/lib/api";
import { profileApi } from "@/lib/api";
import {
  canPersistShortlist,
  MAX_SHORTLIST,
  readGuestShortlist,
  writeGuestShortlist,
} from "@/lib/shortlist";
import type { Teacher } from "@/lib/teachers";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ShortlistContextValue = {
  ids: string[];
  savedTeachers: Teacher[];
  isSaved: (teacherId: string) => boolean;
  toggle: (teacherId: string) => Promise<void>;
  remove: (teacherId: string) => Promise<void>;
  atCapacity: boolean;
};

const ShortlistContext = createContext<ShortlistContextValue | null>(null);

function serverIds(user: AuthUser | null): string[] {
  if (!canPersistShortlist(user)) return [];
  return user?.parentProfile?.shortlistedTeacherIds ?? [];
}

export function ShortlistProvider({
  catalog,
  children,
}: {
  catalog: Teacher[];
  children: ReactNode;
}) {
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  const [guestIds, setGuestIds] = useState<string[]>(() => readGuestShortlist());

  const ids = useMemo(() => {
    if (canPersistShortlist(user)) return serverIds(user);
    return guestIds;
  }, [user, guestIds]);

  const catalogById = useMemo(
    () => new Map(catalog.map((t) => [t.id, t])),
    [catalog],
  );

  const savedTeachers = useMemo(
    () =>
      ids
        .map((id) => catalogById.get(id))
        .filter((t): t is Teacher => Boolean(t)),
    [ids, catalogById],
  );

  const persist = useCallback(
    async (nextIds: string[]) => {
      if (canPersistShortlist(user)) {
        const { user: updated } = await profileApi.saveShortlist(nextIds);
        setUser(updated);
      } else {
        setGuestIds(nextIds);
        writeGuestShortlist(nextIds);
      }
    },
    [user, setUser],
  );

  const toggle = useCallback(
    async (teacherId: string) => {
      const current = canPersistShortlist(user) ? serverIds(user) : guestIds;
      if (current.includes(teacherId)) {
        await persist(current.filter((id) => id !== teacherId));
        return;
      }
      if (current.length >= MAX_SHORTLIST) {
        toast(`You can save up to ${MAX_SHORTLIST} tutors — remove one to add another`);
        return;
      }
      await persist([...current, teacherId]);
    },
    [user, guestIds, persist, toast],
  );

  const remove = useCallback(
    async (teacherId: string) => {
      const current = canPersistShortlist(user) ? serverIds(user) : guestIds;
      await persist(current.filter((id) => id !== teacherId));
    },
    [user, guestIds, persist],
  );

  const value = useMemo<ShortlistContextValue>(
    () => ({
      ids,
      savedTeachers,
      isSaved: (teacherId) => ids.includes(teacherId),
      toggle,
      remove,
      atCapacity: ids.length >= MAX_SHORTLIST,
    }),
    [ids, savedTeachers, toggle, remove],
  );

  return (
    <ShortlistContext.Provider value={value}>{children}</ShortlistContext.Provider>
  );
}

export function useShortlist() {
  const ctx = useContext(ShortlistContext);
  if (!ctx) {
    throw new Error("useShortlist must be used within ShortlistProvider");
  }
  return ctx;
}
