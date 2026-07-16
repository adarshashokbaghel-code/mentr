"use client";

import { FacultyAuthForm } from "@/components/auth/faculty-auth-form";
import { FacultyAuthShell } from "@/components/auth/faculty-auth-shell";
import { useAuth } from "@/components/auth/auth-provider";
import { homeFor } from "@/lib/auth-routes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function FacultyLoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace(homeFor(user));
    }
  }, [loading, user, router]);

  return (
    <FacultyAuthShell
      footerNote={
        <>
          Need a teacher?{" "}
          <Link href="/search" className="font-semibold text-ink underline underline-offset-2">
            Search Bengaluru
          </Link>
        </>
      }
    >
      {loading ? (
        <p className="py-16 text-center text-sm text-muted">Loading…</p>
      ) : (
        <FacultyAuthForm variant="login" />
      )}
    </FacultyAuthShell>
  );
}
