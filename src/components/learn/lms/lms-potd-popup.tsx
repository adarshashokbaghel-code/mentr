"use client";

import { LmsPotdSolve } from "@/components/learn/lms/lms-potd-solve";
import {
  fetchPotdByDate,
  fetchPotdToday,
  type PotdTodayDto,
} from "@/lib/learn-progress-client";
import { CalendarDays, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const SEEN_KEY = "mentr_learn_potd_seen";

type Props = {
  open: boolean;
  dateKey?: string;
  onClose: () => void;
  initialToday?: PotdTodayDto | null;
  onSolved?: (next: PotdTodayDto) => void;
};

export function LmsPotdPopup({
  open,
  dateKey,
  onClose,
  initialToday,
  onSolved,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<PotdTodayDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    if (initialToday && (!dateKey || dateKey === initialToday.dateKey)) {
      setData(initialToday);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    async function load() {
      try {
        const dto = dateKey
          ? await fetchPotdByDate(dateKey)
          : await fetchPotdToday();
        if (cancelled) return;
        setData(dto);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load POTD");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [open, dateKey, initialToday]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  function dismiss() {
    if (data) localStorage.setItem(SEEN_KEY, data.dateKey);
    onClose();
  }

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center bg-black/50 p-4 sm:items-center"
      role="presentation"
      onClick={dismiss}
    >
      <div
        role="dialog"
        aria-modal
        className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-3xl border-2 border-[#1c2434] bg-white shadow-[0_24px_64px_rgba(0,0,0,0.28)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#f0ebe3] bg-white px-4 py-3">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-[#0d9488]" />
            <div>
              <p className="text-[13px] font-extrabold text-[#1c2434]">
                Problem of the Day
              </p>
              <p className="text-[11px] font-semibold text-[#8a929c]">
                {data
                  ? `${data.dateKey}${data.isToday ? " · Today" : ""}`
                  : "Loading…"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={dismiss}
            className="rounded-xl p-2 text-[#8a929c] hover:bg-[#faf8f4]"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 sm:p-5">
          <LmsPotdSolve
            data={data}
            loading={loading}
            error={error}
            onAttempted={(next) => {
              setData(next);
              onSolved?.(next);
            }}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}
