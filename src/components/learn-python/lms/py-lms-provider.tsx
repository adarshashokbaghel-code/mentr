"use client";

import {
  ACHIEVEMENTS,
  PY_XP,
  autoAchievements,
  levelFor,
  streakFor,
  todayKey,
  type AchievementId,
} from "@/lib/python-lms/game";
import { PY_LESSON_ORDER } from "@/lib/python-lms";
import { mergeLessonProgress, unlockedLessons } from "@/lib/python-lms/lesson-progress";
import {
  MAX_DAYS_KEPT,
  readPyProgress,
  writePyProgress,
  type PyLessonProgress,
  type PyProjectProgress,
  type PyStore,
} from "@/lib/python-lms/progress";
import { mergeProjectProgress } from "@/lib/python-lms/project-progress";
import { loginAwardKey, projectAwardKey } from "@/lib/python-lms/rules";
import { syncPyProgress, type PyServerState } from "@/lib/python-lms/sync-client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

export type PyToast =
  | { id: number; kind: "xp"; xp: number; label?: string }
  | { id: number; kind: "achievement"; achievement: AchievementId }
  | { id: number; kind: "level"; level: number; title: string; band: string };

export type GuideTab = "achievements" | "levels" | "xp";
export type GuideState = { open: boolean; tab: GuideTab; focus?: AchievementId };

type PyLmsContextValue = {
  userId: string;
  progress: Record<string, PyLessonProgress>;
  store: PyStore;
  xp: number;
  streak: number;
  updateLesson: (slug: string, patch: Partial<PyLessonProgress>) => void;
  resetPractice: (slug: string) => void;
  /** Grants XP once per key. Returns the XP granted (0 if already earned). */
  award: (key: string, xp: number, label?: string) => number;
  unlock: (id: AchievementId) => void;
  hasAward: (key: string) => boolean;
  /** True once the first load from the server has finished (or failed and fell back to this device). */
  ready: boolean;
  isLessonUnlocked: (slug: string) => boolean;
  projects: Record<string, PyProjectProgress>;
  /** Marks a project complete the first time it passes. Returns whether it is complete. */
  completeProject: (id: string, code: string) => boolean;
  viewProjectSolution: (id: string) => void;
  recordProjectHint: (id: string, shown: number) => void;
  certificateId: string | null;
  setCertificateId: (id: string) => void;
  /** Sends anything not yet saved to the server and waits for it. */
  syncNow: () => Promise<void>;
  toasts: PyToast[];
  dismissToast: (id: number) => void;
  guide: GuideState;
  openGuide: (tab: GuideTab, focus?: AchievementId) => void;
  closeGuide: () => void;
};

const PyLmsContext = createContext<PyLmsContextValue | null>(null);

const sumXp = (s: PyStore) => Object.values(s.awarded).reduce((a, b) => a + b, 0);

const SYNC_DELAY_MS = 1200;
const RETRY_DELAY_MS = 15000;

type Pending = { awards: Set<string>; lessons: Set<string>; achievements: Set<string>; projects: Set<string> };

const emptyPending = (): Pending => ({ awards: new Set(), lessons: new Set(), achievements: new Set(), projects: new Set() });

/** Adds any total-based achievements (streak, level) the store now qualifies for. */
function withAutoAchievements(s: PyStore): { store: PyStore; unlocked: AchievementId[] } {
  const unlocked = autoAchievements(sumXp(s), streakFor(s.days)).filter((id) => !s.achievements[id]);
  if (!unlocked.length) return { store: s, unlocked };
  const now = new Date().toISOString();
  return {
    store: { ...s, achievements: { ...s.achievements, ...Object.fromEntries(unlocked.map((id) => [id, now])) } },
    unlocked,
  };
}

/** Opening the course while signed in is today's login: it adds a streak day and the daily login XP (announced once the server confirms). */
function bootstrap(userId: string): { store: PyStore; toasts: PyToast[] } {
  const read = readPyProgress(userId);
  const today = todayKey();
  const login = loginAwardKey(today);
  const logged: PyStore = {
    ...read,
    days: read.days.includes(today) ? read.days : [...read.days, today].slice(-MAX_DAYS_KEPT),
    awarded: login in read.awarded ? read.awarded : { ...read.awarded, [login]: PY_XP.dailyLogin },
  };
  const { store, unlocked } = withAutoAchievements(logged);
  return { store, toasts: unlocked.map((achievement, i) => ({ id: -1 - i, kind: "achievement", achievement })) };
}

/** The server copy wins for XP; lesson progress is merged so neither side loses work. */
function mergeServer(local: PyStore, server: PyServerState, pending: Pending): PyStore {
  const awarded = { ...server.awarded };
  for (const key of pending.awards) {
    if (key in local.awarded && !(key in awarded)) awarded[key] = local.awarded[key];
  }
  const lessons: Record<string, PyLessonProgress> = {};
  for (const slug of new Set([...Object.keys(server.lessons), ...Object.keys(local.lessons)])) {
    lessons[slug] = mergeLessonProgress(server.lessons[slug], local.lessons[slug]);
  }
  // The server decides what a project counts as; local changes it has not seen yet are kept on top.
  const projects: Record<string, PyProjectProgress> = { ...(server.projects ?? {}) };
  for (const id of pending.projects) {
    if (local.projects[id]) projects[id] = mergeProjectProgress(projects[id], local.projects[id]);
  }
  return {
    ...local,
    awarded,
    lessons,
    projects,
    achievements: { ...local.achievements, ...server.achievements },
    days: [...new Set([...server.days, ...local.days])].sort().slice(-MAX_DAYS_KEPT),
  };
}

/** Mounted only after auth resolves on the client, so localStorage is safe to read up front. */
export function PyLmsProvider({ userId, children }: { userId: string; children: ReactNode }) {
  const [initial] = useState(() => bootstrap(userId));
  const [store, setStore] = useState<PyStore>(initial.store);
  const storeRef = useRef(store);
  const [toasts, setToasts] = useState<PyToast[]>(initial.toasts);
  const [guide, setGuide] = useState<GuideState>({ open: false, tab: "achievements" });
  const [ready, setReady] = useState(false);
  const [serverUnlocked, setServerUnlocked] = useState<string[]>([]);
  const [certificateId, setCertificateId] = useState<string | null>(null);
  const toastId = useRef(1);

  // Everything on this device goes up on the first sync, so progress made before the backend existed is kept.
  const pending = useRef<Pending>({
    awards: new Set(Object.keys(initial.store.awarded)),
    lessons: new Set(Object.keys(initial.store.lessons)),
    achievements: new Set(Object.keys(initial.store.achievements)),
    projects: new Set(Object.keys(initial.store.projects)),
  });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inFlight = useRef(false);
  const again = useRef(false);
  const flushRef = useRef<() => Promise<void>>(async () => undefined);

  const pushToast = useCallback((t: Omit<PyToast, "id"> & Record<string, unknown>) => {
    const id = toastId.current++;
    setToasts((list) => {
      const kept = t.kind === "xp" ? list.filter((x) => x.kind !== "xp") : list;
      return [...kept.slice(-2), { ...t, id } as PyToast];
    });
  }, []);

  const takePayload = useCallback(() => {
    const s = storeRef.current;
    const p = pending.current;
    const snapshot: Pending = {
      awards: new Set(p.awards),
      lessons: new Set(p.lessons),
      achievements: new Set(p.achievements),
      projects: new Set(p.projects),
    };
    pending.current = emptyPending();
    const payload = {
      day: todayKey(),
      awards: [...snapshot.awards].filter((k) => k in s.awarded),
      lessons: Object.fromEntries([...snapshot.lessons].filter((slug) => s.lessons[slug]).map((slug) => [slug, s.lessons[slug]])),
      achievements: Object.fromEntries([...snapshot.achievements].filter((id) => s.achievements[id]).map((id) => [id, s.achievements[id]])),
      projects: Object.fromEntries([...snapshot.projects].filter((id) => s.projects[id]).map((id) => [id, s.projects[id]])),
    };
    return { snapshot, payload };
  }, []);

  const restore = useCallback((snapshot: Pending) => {
    snapshot.awards.forEach((k) => pending.current.awards.add(k));
    snapshot.lessons.forEach((k) => pending.current.lessons.add(k));
    snapshot.achievements.forEach((k) => pending.current.achievements.add(k));
    snapshot.projects.forEach((k) => pending.current.projects.add(k));
  }, []);

  const flush = useCallback(async () => {
    if (inFlight.current) {
      again.current = true;
      return;
    }
    inFlight.current = true;
    const { snapshot, payload } = takePayload();
    try {
      const server = await syncPyProgress(payload);
      if (server.loginAwarded) pushToast({ kind: "xp", xp: PY_XP.dailyLogin, label: "Daily login" });
      const merged = mergeServer(storeRef.current, server, pending.current);
      const { store: final, unlocked } = withAutoAchievements(merged);
      unlocked.forEach((id) => {
        pending.current.achievements.add(id);
        pushToast({ kind: "achievement", achievement: id });
      });
      storeRef.current = final;
      writePyProgress(userId, final);
      setStore(final);
      setServerUnlocked(server.unlockedLessons ?? []);
      setCertificateId(server.certificateId ?? null);
      setReady(true);
      if (unlocked.length) again.current = true;
    } catch {
      setReady(true);
      restore(snapshot);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => void flushRef.current(), RETRY_DELAY_MS);
    } finally {
      inFlight.current = false;
      if (again.current) {
        again.current = false;
        void flushRef.current();
      }
    }
  }, [userId, takePayload, restore, pushToast]);

  useEffect(() => {
    flushRef.current = flush;
  }, [flush]);

  const syncNow = useCallback(async () => {
    const settle = async () => {
      while (inFlight.current) await new Promise((r) => setTimeout(r, 120));
    };
    await settle();
    if (timer.current) clearTimeout(timer.current);
    await flush();
    await settle();
  }, [flush]);

  const scheduleSync = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => void flush(), SYNC_DELAY_MS);
  }, [flush]);

  useEffect(() => {
    writePyProgress(userId, initial.store);
    void flush();
  }, [userId, initial.store, flush]);

  useEffect(() => {
    const flushOnLeave = () => {
      if (document.visibilityState !== "hidden") return;
      const p = pending.current;
      if (!p.awards.size && !p.lessons.size && !p.achievements.size && !p.projects.size) return;
      const { snapshot, payload } = takePayload();
      syncPyProgress(payload, { keepalive: true }).catch(() => restore(snapshot));
    };
    document.addEventListener("visibilitychange", flushOnLeave);
    return () => {
      document.removeEventListener("visibilitychange", flushOnLeave);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [takePayload, restore]);

  /** Saves the store, unlocking streak/level achievements and announcing level-ups. */
  const commit = useCallback(
    (next: PyStore) => {
      const before = levelFor(sumXp(storeRef.current)).level;
      const { store: final, unlocked } = withAutoAchievements(next);
      storeRef.current = final;
      writePyProgress(userId, final);
      setStore(final);
      const after = levelFor(sumXp(final));
      if (after.level > before) pushToast({ kind: "level", level: after.level, title: after.title, band: after.band.name });
      unlocked.forEach((achievement) => {
        pending.current.achievements.add(achievement);
        pushToast({ kind: "achievement", achievement });
      });
      scheduleSync();
    },
    [userId, pushToast, scheduleSync],
  );

  const dismissToast = useCallback((id: number) => setToasts((list) => list.filter((t) => t.id !== id)), []);

  const updateLesson = useCallback(
    (slug: string, patch: Partial<PyLessonProgress>) => {
      const s = storeRef.current;
      pending.current.lessons.add(slug);
      commit({ ...s, lessons: { ...s.lessons, [slug]: { ...s.lessons[slug], ...patch } } });
    },
    [commit],
  );

  const resetPractice = useCallback(
    (slug: string) => {
      const s = storeRef.current;
      const lesson = { ...s.lessons[slug] };
      delete lesson.practice;
      commit({ ...s, lessons: { ...s.lessons, [slug]: lesson } });
    },
    [commit],
  );

  const award = useCallback(
    (key: string, xp: number, label?: string) => {
      const s = storeRef.current;
      if (key in s.awarded) return 0;
      pending.current.awards.add(key);
      commit({ ...s, awarded: { ...s.awarded, [key]: xp } });
      pushToast({ kind: "xp", xp, label });
      return xp;
    },
    [commit, pushToast],
  );

  const unlock = useCallback(
    (id: AchievementId) => {
      const s = storeRef.current;
      if (s.achievements[id] || !ACHIEVEMENTS[id]) return;
      pending.current.achievements.add(id);
      commit({ ...s, achievements: { ...s.achievements, [id]: new Date().toISOString() } });
      pushToast({ kind: "achievement", achievement: id });
    },
    [commit, pushToast],
  );

  const patchProject = useCallback(
    (id: string, next: PyProjectProgress) => {
      const s = storeRef.current;
      pending.current.projects.add(id);
      commit({ ...s, projects: { ...s.projects, [id]: next } });
    },
    [commit],
  );

  const completeProject = useCallback(
    (id: string, code: string) => {
      const cur = storeRef.current.projects[id];
      if (cur?.completedAt) return true;
      const s = storeRef.current;
      const key = projectAwardKey(id);
      const fresh = !(key in s.awarded);
      pending.current.projects.add(id);
      commit({
        ...s,
        projects: { ...s.projects, [id]: { ...cur, completedAt: new Date().toISOString(), code } },
        awarded: fresh ? { ...s.awarded, [key]: PY_XP.project } : s.awarded,
      });
      if (fresh) pushToast({ kind: "xp", xp: PY_XP.project, label: "Project complete" });
      return true;
    },
    [commit, pushToast],
  );

  const viewProjectSolution = useCallback(
    (id: string) => {
      const cur = storeRef.current.projects[id];
      if (cur?.solutionViewedAt) return;
      patchProject(id, { ...cur, solutionViewedAt: new Date().toISOString() });
    },
    [patchProject],
  );

  const recordProjectHint = useCallback(
    (id: string, shown: number) => {
      const cur = storeRef.current.projects[id];
      if ((cur?.hintsUsed ?? 0) >= shown) return;
      patchProject(id, { ...cur, hintsUsed: shown });
    },
    [patchProject],
  );

  const hasAward = useCallback((key: string) => key in storeRef.current.awarded, []);
  const openGuide = useCallback((tab: GuideTab, focus?: AchievementId) => setGuide({ open: true, tab, focus }), []);
  const closeGuide = useCallback(() => setGuide((g) => ({ ...g, open: false })), []);

  const unlockedSet = useMemo(() => {
    const open = unlockedLessons(PY_LESSON_ORDER, store.lessons);
    serverUnlocked.forEach((slug) => open.add(slug));
    return open;
  }, [store.lessons, serverUnlocked]);
  const isLessonUnlocked = useCallback((slug: string) => unlockedSet.has(slug), [unlockedSet]);

  const value = useMemo(
    () => ({
      userId,
      progress: store.lessons,
      store,
      xp: sumXp(store),
      streak: streakFor(store.days),
      updateLesson,
      resetPractice,
      award,
      unlock,
      hasAward,
      ready,
      isLessonUnlocked,
      projects: store.projects,
      completeProject,
      viewProjectSolution,
      recordProjectHint,
      certificateId,
      setCertificateId,
      syncNow,
      toasts,
      dismissToast,
      guide,
      openGuide,
      closeGuide,
    }),
    [
      userId,
      store,
      updateLesson,
      resetPractice,
      award,
      unlock,
      hasAward,
      ready,
      isLessonUnlocked,
      completeProject,
      viewProjectSolution,
      recordProjectHint,
      certificateId,
      syncNow,
      toasts,
      dismissToast,
      guide,
      openGuide,
      closeGuide,
    ],
  );

  return <PyLmsContext.Provider value={value}>{children}</PyLmsContext.Provider>;
}

export function usePyLms(): PyLmsContextValue {
  const ctx = useContext(PyLmsContext);
  if (!ctx) throw new Error("usePyLms must be used within PyLmsProvider");
  return ctx;
}
