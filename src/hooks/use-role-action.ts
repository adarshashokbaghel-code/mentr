"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { useToast } from "@/components/ui/toast";
import { useCallback } from "react";

export const PARENT_ROLE_TOAST =
  "You're logged in as a tutor. Log in as a parent to explore this.";
export const FACULTY_ROLE_TOAST =
  "You're logged in as a parent. Log in as a tutor to use this.";

/** Gate parent-only actions (search, post requirement, connect). */
export function useRoleAction() {
  const { user, loading, openRoleChooser } = useAuth();
  const { toast } = useToast();

  const requireParent = useCallback(
    (opts?: { href?: string; onAllowed?: () => void }): boolean => {
      if (loading) return false;
      if (!user) {
        openRoleChooser(opts?.href);
        return false;
      }
      if (user.role !== "parent") {
        toast(PARENT_ROLE_TOAST);
        return false;
      }
      opts?.onAllowed?.();
      return true;
    },
    [loading, user, openRoleChooser, toast],
  );

  const requireFaculty = useCallback(
    (opts?: { href?: string; onAllowed?: () => void }): boolean => {
      if (loading) return false;
      if (!user) {
        openRoleChooser(opts?.href);
        return false;
      }
      if (user.role === "parent") {
        toast(FACULTY_ROLE_TOAST);
        return false;
      }
      opts?.onAllowed?.();
      return true;
    },
    [loading, user, openRoleChooser, toast],
  );

  return { requireParent, requireFaculty, user, loading };
}
