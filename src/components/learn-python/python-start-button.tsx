"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { PythonStartSheet } from "@/components/learn-python/python-start-sheet";
import { LEARN_PYTHON_LMS_PATH } from "@/lib/learn-python";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState, type ReactNode } from "react";

/**
 * Signed-in visitors go straight to `to` (the course by default); guests get the sign-in sheet first.
 * `fullLoad` uses a document navigation, needed for pages with their own isolation headers (the compiler).
 */
export function PythonStartButton({
  className,
  children,
  to = LEARN_PYTHON_LMS_PATH,
  fullLoad = false,
}: {
  className?: string;
  children: ReactNode;
  to?: string;
  fullLoad?: boolean;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  if (user) {
    return fullLoad ? (
      <a href={to} className={className}>
        {children}
      </a>
    ) : (
      <Link href={to} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {children}
      </button>
      <PythonStartSheet
        open={open}
        onClose={close}
        onSignedIn={() => {
          setOpen(false);
          if (fullLoad) window.location.assign(to);
          else router.push(to);
        }}
      />
    </>
  );
}
