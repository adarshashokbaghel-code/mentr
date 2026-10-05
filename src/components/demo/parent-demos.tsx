"use client";

import { formatDemoDate } from "@/components/demo/book-demo-button";
import { demoRequestsApi, type ParentDemoRequest } from "@/lib/api";
import { cn } from "@/lib/utils";
import { CalendarDays, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const STATUS: Record<
  ParentDemoRequest["status"],
  { label: string; cls: string }
> = {
  pending: { label: "Waiting", cls: "bg-butter/70 text-ink" },
  accepted: { label: "Accepted", cls: "bg-sage-wash text-sage" },
  declined: { label: "Declined", cls: "bg-cream-band text-muted" },
};

export function ParentDemos({
  onWaiting,
}: {
  onWaiting?: (count: number) => void;
}) {
  const [demos, setDemos] = useState<ParentDemoRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    demoRequestsApi
      .mine()
      .then((data) => setDemos(data.demos))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    onWaiting?.(demos.filter((d) => d.status === "pending").length);
  }, [demos, onWaiting]);

  if (loading) {
    return <p className="text-sm text-muted">Loading demo requests…</p>;
  }

  if (demos.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-hairline bg-white px-4 py-10 text-center">
        <CalendarDays className="mx-auto h-5 w-5 text-muted" />
        <p className="mt-2 text-sm font-semibold text-ink">No demo requests yet</p>
        <p className="mx-auto mt-1 max-w-sm text-sm text-muted">
          Book an online demo from a tutor&apos;s card. They see your number
          as soon as you send it.
        </p>
        <Link
          href="/search"
          className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-lg border border-hairline bg-white px-3 text-sm font-semibold text-ink hover:bg-cream"
        >
          <Search className="h-3.5 w-3.5" />
          Find a tutor
        </Link>
      </div>
    );
  }

  return (
    <section id="demos">
      <h2 className="text-lg font-semibold text-ink">
        {demos.length === 1
          ? "1 demo requested"
          : `${demos.length} demos requested`}
      </h2>
      <p className="mt-0.5 text-xs text-muted">
        The tutor already has your number and confirms the time.
      </p>
      <ul className="mt-3 space-y-2.5">
        {demos.map((demo) => {
          const status = STATUS[demo.status];
          return (
            <li
              key={demo.id}
              className="rounded-xl border border-hairline bg-white px-3.5 py-3"
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className="min-w-0 flex-1 truncate text-sm font-semibold text-ink">
                  {demo.teacherName}
                </p>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[11px] font-bold",
                    status.cls,
                  )}
                >
                  {status.label}
                </span>
              </div>
              <p className="mt-1 text-[13px] text-ink/80">
                {demo.subject} · {demo.classLevel}
                {demo.board ? ` · ${demo.board}` : ""}
              </p>
              <p className="mt-0.5 text-xs text-muted">
                {formatDemoDate(demo.preferredDate)} · {demo.preferredTime} ·
                Online
              </p>
              {demo.tutorNote ? (
                <p className="mt-2 rounded-lg bg-cream px-2.5 py-2 text-[13px] leading-relaxed text-ink/80">
                  {demo.tutorNote}
                </p>
              ) : null}
              <Link
                href={`/teachers/${demo.teacherId}`}
                className="mt-2 inline-flex text-xs font-semibold text-ink underline-offset-2 hover:underline"
              >
                View profile
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
