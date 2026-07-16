"use client";

import { FacultyAuthForm } from "@/components/auth/faculty-auth-form";
import { FacultyAuthShell } from "@/components/auth/faculty-auth-shell";
import { useAuth } from "@/components/auth/auth-provider";
import { homeFor } from "@/lib/auth-routes";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function ParentSignupContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || undefined;

  useEffect(() => {
    if (!loading && user) {
      router.replace(homeFor(user, next));
    }
  }, [loading, user, router, next]);

  return (
    <FacultyAuthShell variant="parent">
      {loading ? (
        <p className="py-16 text-center text-sm text-muted">Loading…</p>
      ) : (
        <FacultyAuthForm variant="signup" role="parent" next={next} />
      )}
    </FacultyAuthShell>
  );
}

export default function ParentSignupPage() {
  return (
    <Suspense fallback={null}>
      <ParentSignupContent />
    </Suspense>
  );
}
