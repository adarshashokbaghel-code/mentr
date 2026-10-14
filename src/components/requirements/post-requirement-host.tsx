"use client";

import { useAuth } from "@/components/auth/auth-provider";
import {
  PostRequirementWizard,
  SUBJECT_OPTIONS,
} from "@/components/requirements/post-requirement-wizard";
import { useToast } from "@/components/ui/toast";
import { PARENT_ROLE_TOAST } from "@/hooks/use-role-action";
import { useCallback, useEffect, useState } from "react";

export const POST_REQUIREMENT_EVENT = "mentr:post-requirement";
export const REQUIREMENT_POSTED_EVENT = "mentr:requirement-posted";

/** Works without JS too: signup → dashboard, which opens the form from `?post=`. */
export const POST_REQUIREMENT_HREF = `/parent/signup?next=${encodeURIComponent(
  "/parent/dashboard?post=1",
)}`;

export function openPostRequirement(subject = "") {
  window.dispatchEvent(
    new CustomEvent(POST_REQUIREMENT_EVENT, { detail: { subject } }),
  );
}

export function matchSubject(raw: string | null | undefined): string {
  const value = (raw ?? "").trim().toLowerCase();
  return SUBJECT_OPTIONS.find((s) => s.toLowerCase() === value) ?? "";
}

/** `?post=` value carried by a "post requirement" link, directly or via `next`. */
function postParam(href: string): string | null {
  try {
    const url = new URL(href, window.location.origin);
    if (url.origin !== window.location.origin) return null;
    if (url.pathname === "/parent/dashboard") return url.searchParams.get("post");
    if (url.pathname === "/parent/signup" || url.pathname === "/parent/login") {
      const next = url.searchParams.get("next");
      if (!next) return null;
      return new URL(next, window.location.origin).searchParams.get("post");
    }
  } catch {
    /* not a URL */
  }
  return null;
}

/**
 * Opens the post-requirement form on top of the current page for any
 * "post requirement" link or `openPostRequirement()` call, so nobody is
 * bounced to signup or the dashboard first.
 */
export function PostRequirementHost() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [subject, setSubject] = useState<string | null>(null);

  const open = useCallback(
    (subject: string) => {
      if (user && user.role !== "parent") {
        toast(PARENT_ROLE_TOAST);
        return;
      }
      setSubject(subject);
    },
    [user, toast],
  );

  useEffect(() => {
    // Typed subjects that aren't presets open the form as "Other: <text>".
    const onOpen = (e: Event) => {
      const raw = (e as CustomEvent<{ subject?: string }>).detail?.subject ?? "";
      open(matchSubject(raw) || raw.trim().slice(0, 60));
    };
    const onClick = (e: MouseEvent) => {
      if (loading || e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as Element | null)?.closest?.("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target && anchor.target !== "_self") return;
      const post = postParam(anchor.getAttribute("href") ?? "");
      if (post === null) return;
      e.preventDefault();
      open(matchSubject(post));
    };
    window.addEventListener(POST_REQUIREMENT_EVENT, onOpen);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener(POST_REQUIREMENT_EVENT, onOpen);
      document.removeEventListener("click", onClick, true);
    };
  }, [open, loading]);

  if (subject === null) return null;
  return (
    <PostRequirementWizard
      initialSubject={subject}
      onClose={() => setSubject(null)}
      onPosted={() => window.dispatchEvent(new Event(REQUIREMENT_POSTED_EVENT))}
    />
  );
}
