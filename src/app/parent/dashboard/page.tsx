"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { ParentRequirementsSection } from "@/components/requirements/parent-requirements";
import { InstantConnectParentSection } from "@/components/instant-connect/instant-connect-parent-section";
import { ParentDemos } from "@/components/demo/parent-demos";
import { HiringChecklist } from "@/components/parent/hiring-checklist";
import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarDays, ClipboardList, Megaphone, Search, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type DashTab = "posts" | "demos" | "instant";

export default function ParentDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [dashTab, setDashTab] = useState<DashTab>("posts");
  const [demoWaiting, setDemoWaiting] = useState(0);
  const [postOpen, setPostOpen] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/parent");
      return;
    }
    if (user.role !== "parent") {
      router.replace("/dashboard");
      return;
    }
    if (!user.profileCompleted) router.replace("/parent/profiling");
  }, [loading, user, router]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (hash === "#demos") setDashTab("demos");
    if (hash === "#instant-connect") setDashTab("instant");
  }, []);

  if (loading || !user || user.role !== "parent") {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-[1400px] px-4 py-12 sm:py-20 text-center text-muted">
          Loading…
        </main>
      </>
    );
  }

  const name = user.parentProfile?.name || "there";
  const firstName = name.split(" ")[0];
  const subtitle =
    demoWaiting === 1
      ? "1 demo requested"
      : demoWaiting > 1
        ? `${demoWaiting} demos requested`
        : "Book a demo from search, or post what you need.";

  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-16">
        <div className="mx-auto max-w-[1400px] px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-coral text-sm font-bold text-white">
                {firstName.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0">
                <h1 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
                  Hi, {firstName}
                </h1>
                <p className="text-xs text-muted sm:text-[13px]">{subtitle}</p>
              </div>
            </div>
            <div className="flex w-full gap-2 sm:w-auto">
              <Link href="/search" className="min-w-0 flex-1 sm:flex-none">
                <Button
                  size="sm"
                  className="h-10 w-full gap-1.5 bg-coral px-3 text-[13px] font-bold text-white hover:bg-coral-dark sm:px-4"
                >
                  <Search className="h-3.5 w-3.5 shrink-0" />
                  Find a mentor
                </Button>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setDashTab("posts");
                  setPostOpen(true);
                }}
                className="inline-flex h-10 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-md border border-hairline bg-white px-3 text-[13px] font-bold text-ink transition hover:bg-cream sm:flex-none sm:px-4"
              >
                <Megaphone className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">Post a requirement</span>
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
            <div className="min-w-0">
              <div
                role="tablist"
                aria-label="Parent dashboard"
                className="flex gap-1 rounded-xl border border-hairline bg-white p-1"
              >
                {(
                  [
                    {
                      id: "posts" as const,
                      label: "My posts",
                      shortLabel: "Posts",
                      Icon: ClipboardList,
                    },
                    {
                      id: "demos" as const,
                      label: "Demos",
                      shortLabel: "Demos",
                      Icon: CalendarDays,
                      count: demoWaiting || undefined,
                    },
                    {
                      id: "instant" as const,
                      label: "Instant Connect",
                      shortLabel: "Instant",
                      Icon: Zap,
                    },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={dashTab === tab.id}
                    onClick={() => setDashTab(tab.id)}
                    className={cn(
                      "relative flex flex-1 items-center justify-center gap-1 rounded-lg px-1.5 py-2.5 text-[11px] font-bold leading-tight transition sm:gap-1.5 sm:px-2 sm:text-[13px]",
                      dashTab === tab.id
                        ? "bg-ink text-white shadow-sm"
                        : "text-muted hover:bg-cream hover:text-ink",
                    )}
                  >
                    <tab.Icon className="h-3.5 w-3.5 shrink-0" />
                    <span className="sm:hidden">{tab.shortLabel}</span>
                    <span className="hidden sm:inline">{tab.label}</span>
                    {"count" in tab && tab.count ? (
                      <span
                        className={cn(
                          "rounded-full px-1.5 py-0.5 text-[10px] font-extrabold tabular-nums",
                          dashTab === tab.id
                            ? "bg-coral text-white"
                            : "bg-coral-wash text-coral-dark",
                        )}
                      >
                        {tab.count}
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>

              <div className="mt-4">
                {dashTab === "posts" ? (
                  <div id="requirements">
                    <ParentRequirementsSection
                      requestOpen={postOpen}
                      onRequestOpenChange={setPostOpen}
                    />
                  </div>
                ) : null}

                <div className={dashTab === "demos" ? "" : "hidden"}>
                  <ParentDemos onWaiting={setDemoWaiting} />
                </div>

                {dashTab === "instant" ? (
                  <InstantConnectParentSection />
                ) : null}
              </div>
            </div>

            <aside className="lg:sticky lg:top-20">
              <HiringChecklist />
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
