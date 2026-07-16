"use client";

import { FacultyAuthForm } from "@/components/auth/faculty-auth-form";
import { useAuth } from "@/components/auth/auth-provider";
import { X } from "lucide-react";
import { useEffect } from "react";

/** Kept for dashboard gate fallbacks; prefer /faculty page. */
export function FacultyLoginModal() {
  const { loginOpen, closeLogin } = useAuth();

  useEffect(() => {
    if (!loginOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLogin();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [loginOpen, closeLogin]);

  if (!loginOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="faculty-login-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-ink/40"
        aria-label="Close dialog"
        onClick={closeLogin}
      />
      <div className="relative z-10 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border-2 border-ink bg-white p-6 shadow-[4px_4px_0_0_#1c1a17] sm:p-8">
        <button
          type="button"
          onClick={closeLogin}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full text-muted hover:bg-cream"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 id="faculty-login-title" className="sr-only">
          Faculty login
        </h2>
        <FacultyAuthForm onComplete={closeLogin} />
      </div>
    </div>
  );
}
