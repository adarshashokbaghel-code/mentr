"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { BoardParentBlocked } from "@/components/auth/role-blocked-page";
import { Navbar } from "@/components/landing/navbar";
import { RequirementsFeed } from "@/components/requirements/tutor-board";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function BoardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/faculty");
      return;
    }
    if (user.role !== "parent" && !user.profileCompleted) {
      router.replace("/profiling");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pb-20">
          <div className="mx-auto w-full max-w-[1400px] px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
            <Skeleton className="h-14 rounded-lg bg-white" />
            <div className="mt-6 grid gap-6 2xl:grid-cols-[minmax(0,220px)_minmax(0,1fr)_minmax(0,260px)] xl:grid-cols-[minmax(0,1fr)_minmax(0,260px)]">
              <Skeleton className="hidden h-72 rounded-xl bg-white xl:block" />
              <Skeleton className="h-[520px] rounded-xl bg-white" />
              <Skeleton className="hidden h-72 rounded-xl bg-white lg:block" />
            </div>
          </div>
        </main>
      </>
    );
  }

  if (!user) return null;

  if (user.role === "parent") {
    return <BoardParentBlocked />;
  }

  const name = user.profile?.name || "there";
  const firstName = name.split(" ")[0];

  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-20">
        <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <header className="mb-6 border-b border-hairline pb-5">
            <h1 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
              Requirements board
              {firstName !== "there" && (
                <span className="font-medium text-muted">
                  {" "}
                  · Hi, {firstName}
                </span>
              )}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted sm:text-[15px]">
              Parents post what they need — anonymously. Send a free pitch with
              your profile. If they accept, you&apos;re connected on WhatsApp.
            </p>
          </header>

          <RequirementsFeed />
        </div>
      </main>
    </>
  );
}
