"use client";

import { DeleteAccountSection } from "@/components/account/delete-account-section";
import { useAuth } from "@/components/auth/auth-provider";
import { ParentRequirementsSection } from "@/components/requirements/parent-requirements";
import { ParentDemos } from "@/components/demo/parent-demos";
import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarDays, ClipboardList, Megaphone, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type DashTab = "posts" | "demos";

export default function ParentDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [dashTab, setDashTab] = useState<DashTab>("posts");
  const [demoWaiting, setDemoWaiting] = useState(0);
  const [postOpen, setPostOpen] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      const { pathname, search, hash } = window.location;
      router.replace(`/parent?next=${encodeURIComponent(pathname + search + hash)}`);
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
      ? "1 demo awaiting a reply"
      : demoWaiting > 1
        ? `${demoWaiting} demos awaiting a reply`
        : "Book a demo from search, or post what you need.";

  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-16">
        <div className="mx-auto max-w-[1400px] px-3 py-3.5 sm:px-6 sm:py-7 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3">
            <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-coral text-[13px] font-bold text-white sm:h-11 sm:w-11 sm:text-sm">
                {firstName.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0">
                <h1 className="text-lg font-bold leading-tight tracking-tight text-ink sm:text-2xl">
                  Hi, {firstName}
                </h1>
                <p className="truncate text-[11.5px] text-muted sm:text-[13px]">{subtitle}</p>
              </div>
            </div>
            <div className="flex w-full gap-2 sm:w-auto">
              <Link href="/search" className="min-w-0 flex-1 sm:flex-none">
                <Button
                  size="sm"
                  className="h-9 w-full gap-1.5 bg-coral px-3 text-[12.5px] font-bold text-white hover:bg-coral-dark sm:h-10 sm:px-4 sm:text-[13px]"
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
                className="inline-flex h-9 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-md border border-hairline bg-white px-3 text-[12.5px] font-bold text-ink transition hover:bg-cream sm:h-10 sm:flex-none sm:px-4 sm:text-[13px]"
              >
                <Megaphone className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">Post a requirement</span>
              </button>
            </div>
          </div>

          <div className="mt-3.5 sm:mt-6">
            <div className="min-w-0">
              <div
                role="tablist"
                aria-label="Parent dashboard"
                className="mx-auto flex w-fit gap-0.5 rounded-full border border-hairline bg-white p-0.5"
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
                      label: "My Scheduled Demos",
                      shortLabel: "Demos",
                      Icon: CalendarDays,
                      count: demoWaiting || undefined,
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
                      "relative flex items-center justify-center gap-1 rounded-full px-3 py-1.5 text-[12px] font-semibold leading-tight transition sm:gap-1.5 sm:px-3.5 sm:text-[12.5px]",
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

              <div className="mt-3 sm:mt-4">
                {dashTab === "posts" ? (
                  <div id="requirements">
                    <ParentRequirementsSection
                      requestOpen={postOpen}
                      onRequestOpenChange={setPostOpen}
                    />
                  </div>
                ) : null}

                <div className={dashTab === "demos" ? "mx-auto max-w-2xl" : "hidden"}>
                  <ParentDemos onWaiting={setDemoWaiting} />
                </div>
              </div>
            </div>
          </div>
          <DeleteAccountSection />
        </div>
      </main>
      <Footer />
    </>
  );
}
