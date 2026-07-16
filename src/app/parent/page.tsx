"use client";

import { FacultyAuthForm } from "@/components/auth/faculty-auth-form";
import { FacultyAuthShell } from "@/components/auth/faculty-auth-shell";
import { useAuth } from "@/components/auth/auth-provider";
import { homeFor } from "@/lib/auth-routes";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function ParentLoginContent() {
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
    <FacultyAuthShell
      variant="parent"
      footerNote={
        <>
          Want to teach instead?{" "}
          <Link
            href="/faculty/signup"
            className="font-semibold text-ink underline underline-offset-2"
          >
            List free as a tutor
          </Link>
        </>
      }
    >
      {loading ? (
        <p className="py-16 text-center text-sm text-muted">Loading…</p>
      ) : (
        <FacultyAuthForm variant="login" role="parent" next={next} />
      )}
    </FacultyAuthShell>
  );
}

export default function ParentLoginPage() {
  return (
    <Suspense fallback={null}>
      <ParentLoginContent />
    </Suspense>
  );
}
