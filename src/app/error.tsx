"use client";

import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { Button } from "@/components/ui/button";
import { hardShadowSm, LpGridBg } from "@/components/landing/lp/shared";
import { cn } from "@/lib/utils";
import { AlertCircle, ArrowRight, Home, Mail, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  reset: () => void;
  unstable_retry?: () => void;
}) {
  useEffect(() => {
    // Log unexpected runtime error to console or telemetry
    console.error("Application error boundary caught:", error);
  }, [error]);

  const handleRetry = () => {
    if (typeof unstable_retry === "function") {
      unstable_retry();
    } else {
      reset();
    }
  };

  return (
    <>
      <Navbar />
      <main className="relative flex min-h-[calc(100vh-4rem)] flex-col justify-center bg-cream px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <LpGridBg className="opacity-40" />

        <div className="relative mx-auto w-full max-w-xl text-center">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-coral-wash px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-coral-dark shadow-xs backdrop-blur-sm">
            <AlertCircle className="h-3.5 w-3.5" />
            Temporary Error
          </span>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Something didn’t go as planned
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted sm:text-base">
            We ran into an unexpected hitch while loading this page. You can try refreshing or returning to the home page.
          </p>

          {/* Action buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Button
              onClick={handleRetry}
              size="lg"
              className={cn("gap-2", hardShadowSm)}
            >
              <RotateCcw className="h-4 w-4" />
              Try again
            </Button>
            <Link href="/">
              <Button
                variant="secondary"
                size="lg"
                className={cn("gap-2", hardShadowSm)}
              >
                <Home className="h-4 w-4" />
                Back to home
              </Button>
            </Link>
          </div>

          {/* Error Digest (safe identifier for support without exposing stack traces) */}
          {error.digest && (
            <p className="mt-6 font-mono text-xs text-muted/80">
              Error reference: <span className="font-semibold text-ink">{error.digest}</span>
            </p>
          )}
        </div>

        {/* Helpful assistance card */}
        <div className="relative mx-auto mt-12 w-full max-w-lg">
          <div className="rounded-2xl border border-hairline bg-white/80 p-5 shadow-xs backdrop-blur-sm sm:p-6">
            <div className="flex items-start gap-4">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-lavender text-ink">
                <Mail className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-bold text-ink">Need help or seeing this repeatedly?</h2>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  If this issue continues, please reach out to our team with the steps you took so we can resolve it quickly.
                </p>
                <Link
                  href="/contact"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-coral-dark hover:underline"
                >
                  Contact support
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
