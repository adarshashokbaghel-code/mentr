"use client";

import { FacultyAuthForm } from "@/components/auth/faculty-auth-form";
import { FacultyAuthShell } from "@/components/auth/faculty-auth-shell";
import { useAuth } from "@/components/auth/auth-provider";
import { homeFor } from "@/lib/auth-routes";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function FacultySignupPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace(homeFor(user));
    }
  }, [loading, user, router]);

  return (
    <FacultyAuthShell>
      {loading ? (
        <p className="py-16 text-center text-sm text-muted">Loading…</p>
      ) : (
        <FacultyAuthForm variant="signup" />
      )}
    </FacultyAuthShell>
  );
}
