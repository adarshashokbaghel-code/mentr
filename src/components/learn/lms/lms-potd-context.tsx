"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { LmsPotdPopup } from "@/components/learn/lms/lms-potd-popup";
import {
  fetchPotdToday,
  type PotdTodayDto,
} from "@/lib/learn-progress-client";

const SEEN_KEY = "mentr_learn_potd_seen";

export type PotdAttemptPatch = {
  attempted: true;
  correct: boolean;
};

type PotdContextValue = {
  openPotd: (dateKey?: string) => void;
  closePotd: () => void;
  today: PotdTodayDto | null;
  setToday: (next: PotdTodayDto | null) => void;
  refreshToday: () => Promise<void>;
  /** Local calendar highlights after solving (any date). */
  attemptPatches: Record<string, PotdAttemptPatch>;
  noteAttempt: (dateKey: string, correct: boolean) => void;
};

const PotdContext = createContext<PotdContextValue | null>(null);

export function LmsPotdProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [dateKey, setDateKey] = useState<string | undefined>(undefined);
  const [nonce, setNonce] = useState(0);
  const [today, setToday] = useState<PotdTodayDto | null>(null);
  const [attemptPatches, setAttemptPatches] = useState<
    Record<string, PotdAttemptPatch>
  >({});

  const noteAttempt = useCallback((key: string, correct: boolean) => {
    setAttemptPatches((prev) => ({
      ...prev,
      [key]: { attempted: true, correct },
    }));
  }, []);

  const refreshToday = useCallback(async () => {
    try {
      const dto = await fetchPotdToday();
      setToday(dto);
      if (dto.attempted && dto.attempt) {
        setAttemptPatches((prev) => ({
          ...prev,
          [dto.dateKey]: {
            attempted: true,
            correct: dto.attempt!.correct,
          },
        }));
      }
    } catch {
      /* ignore */
    }
  }, []);

  const openPotd = useCallback((key?: string) => {
    setDateKey(key);
    setNonce((n) => n + 1);
    setOpen(true);
  }, []);

  const closePotd = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    void fetchPotdToday()
      .then((dto) => {
        if (cancelled) return;
        setToday(dto);
        if (dto.attempted && dto.attempt) {
          setAttemptPatches((prev) => ({
            ...prev,
            [dto.dateKey]: {
              attempted: true,
              correct: dto.attempt!.correct,
            },
          }));
        }
        const seen = localStorage.getItem(SEEN_KEY);
        if (seen !== dto.dateKey) {
          setDateKey(undefined);
          setNonce((n) => n + 1);
          setOpen(true);
        }
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({
      openPotd,
      closePotd,
      today,
      setToday,
      refreshToday,
      attemptPatches,
      noteAttempt,
    }),
    [openPotd, closePotd, today, refreshToday, attemptPatches, noteAttempt],
  );

  return (
    <PotdContext.Provider value={value}>
      {children}
      <LmsPotdPopup
        key={`${dateKey ?? "today"}-${nonce}`}
        open={open}
        dateKey={dateKey}
        onClose={closePotd}
        initialToday={today}
        onSolved={(next) => {
          // Only official today attempts paint the calendar / count as solved
          if (next.isToday && !next.practiceOnly) {
            noteAttempt(next.dateKey, Boolean(next.attempt?.correct));
            setToday(next);
          }
        }}
      />
    </PotdContext.Provider>
  );
}

export function useLmsPotd() {
  const ctx = useContext(PotdContext);
  if (!ctx) {
    throw new Error("useLmsPotd must be used within LmsPotdProvider");
  }
  return ctx;
}
