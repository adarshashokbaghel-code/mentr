"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { profileApi } from "@/lib/api";
import { useEffect, useRef } from "react";

/**
 * Fires once when a signed-in parent lands on a tutor profile.
 * Public SSR pages load via /api/teachers/public — this closes the gap.
 */
export function ProfileViewBeacon({ teacherId }: { teacherId: string }) {
  const { user } = useAuth();
  const sent = useRef(false);

  useEffect(() => {
    if (!user || user.role !== "parent" || user.id === teacherId) return;
    if (sent.current) return;
    sent.current = true;

    profileApi.recordView(teacherId).catch(() => {
      sent.current = false;
    });
  }, [user, teacherId]);

  return null;
}
