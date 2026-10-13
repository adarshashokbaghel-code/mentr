"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { BoardParentBlocked } from "@/components/auth/role-blocked-page";
import { Navbar } from "@/components/landing/navbar";
import { RequirementsFeed } from "@/components/requirements/tutor-board";
import { Skeleton } from "@/components/ui/skeleton";
import { Megaphone } from "lucide-react";
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
            <Skeleton className="h-20 max-w-xl rounded-2xl bg-white" />
            <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
              <Skeleton className="h-[520px] rounded-2xl bg-white" />
              <Skeleton className="hidden h-72 rounded-2xl bg-white xl:block" />
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
          <header className="mb-5 sm:mb-6">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-coral-wash px-2.5 py-1 text-[11px] font-bold tracking-wide text-coral-dark uppercase">
              <Megaphone className="h-3.5 w-3.5" />
              Requirements board
            </p>
            <h1 className="mt-2.5 text-2xl font-bold tracking-tight text-ink sm:text-[28px]">
              {firstName !== "there" ? `Hi ${firstName}, ` : ""}parents are looking for tutors
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted sm:text-[15px]">
              Pitch the posts that fit you. Parents compare pitches and book a
              free demo with the tutor they pick.
            </p>
          </header>

          <RequirementsFeed />
        </div>
      </main>
    </>
  );
}
