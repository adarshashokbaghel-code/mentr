"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { ParentActionLink } from "@/components/auth/role-guard-link";
import { hardShadowSm } from "@/components/landing/lp/shared";
import { PostRequirementWizard } from "@/components/requirements/post-requirement-wizard";
import { REQUIREMENT_POSTED_EVENT } from "@/components/requirements/post-requirement-host";
import { cn } from "@/lib/utils";
import { Search, Sparkles } from "lucide-react";
import Link from "next/link";

export function ParentNeedFinder({ className }: { className?: string }) {
  const { user, loading } = useAuth();
  const isTeacher = Boolean(user && user.role !== "parent");

  return (
    <section
      id="post-requirement"
      className={cn(
        "min-w-0 overflow-x-clip border-b border-hairline bg-lavender/40",
        className,
      )}
    >
      <div className="mx-auto w-full min-w-0 max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div
          className={cn(
            "min-w-0 rounded-2xl border-2 border-ink bg-white p-3.5 sm:p-5 lg:p-6",
            hardShadowSm,
          )}
        >
          <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
            <div className="min-w-0">
              <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-coral">
                <Sparkles className="h-3 w-3 shrink-0" />
                For parents
              </p>
              <h2 className="mt-0.5 text-lg font-bold tracking-tight text-ink sm:text-xl">
                Tell us what you&apos;re looking for
              </h2>
              <p className="mt-0.5 text-[13px] text-muted sm:text-sm">
                Tutors send you quotes by email — free to post.
              </p>
            </div>
            <ParentActionLink
              href="/search?tier=regular"
              className="inline-flex shrink-0 items-center gap-1 text-[12px] font-semibold text-muted transition hover:text-coral"
            >
              <Search className="h-3.5 w-3.5" />
              Search tutors instead
            </ParentActionLink>
          </div>

          {!loading && isTeacher ? (
            <div className="mt-4 rounded-xl border border-dashed border-ink/15 bg-cream/50 px-4 py-5 text-center sm:py-6">
              <p className="text-sm font-semibold text-ink">
                Sign in as a parent to post a requirement
              </p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                <Link
                  href="/board"
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-ink/15 bg-white px-4 text-[13px] font-bold text-ink"
                >
                  Board
                </Link>
                <Link
                  href="/parent/signup"
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-ink px-4 text-[13px] font-bold text-white"
                >
                  Parent signup
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-3 min-w-0 sm:mt-4">
              <PostRequirementWizard
                presentation="inline"
                initialSubject=""
                onClose={() => {}}
                onPosted={() =>
                  window.dispatchEvent(new Event(REQUIREMENT_POSTED_EVENT))
                }
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
