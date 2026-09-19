"use client";

import {
  clearIcTrackFlash,
  IC_ACTIVE_CHANGED,
  icTrackFlashRemaining,
} from "@/lib/instant-connect-active";
import { useCallback, useEffect, useState } from "react";

/**
 * Briefly true right after a parent submits Instant Connect,
 * then auto-clears so the dock returns to normal Instant Connect.
 */
export function useActiveInstantConnect() {
  const [showTrackFlash, setShowTrackFlash] = useState(false);

  const syncFromStorage = useCallback(() => {
    const left = icTrackFlashRemaining();
    setShowTrackFlash(left > 0);
    return left;
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    const scheduleClear = (left: number) => {
      if (timer) clearTimeout(timer);
      timer = null;
      if (left <= 0) {
        if (icTrackFlashRemaining() <= 0) clearIcTrackFlash();
        setShowTrackFlash(false);
        return;
      }
      setShowTrackFlash(true);
      timer = setTimeout(() => {
        clearIcTrackFlash();
        setShowTrackFlash(false);
        timer = null;
      }, left);
    };

    scheduleClear(syncFromStorage());

    const onChange = () => {
      scheduleClear(syncFromStorage());
    };
    window.addEventListener(IC_ACTIVE_CHANGED, onChange);
    return () => {
      window.removeEventListener(IC_ACTIVE_CHANGED, onChange);
      if (timer) clearTimeout(timer);
    };
  }, [syncFromStorage]);

  return {
    /** @deprecated use showTrackFlash — only briefly true after submit */
    hasActive: showTrackFlash,
    showTrackFlash,
    checking: false,
    refresh: syncFromStorage,
  };
}
