"use client";

import { BookDemoButton } from "@/components/demo/book-demo-button";
import { useAuth } from "@/components/auth/auth-provider";
import { type ConnectTeacher } from "@/components/connect/connect-button";
import { cn } from "@/lib/utils";
import { MessageCircle, ShieldCheck } from "lucide-react";

/**
 * Profile contact block. Parents book a demo.
 */
export function TeacherConnectPanel({
  teacher,
  available,
  subjects,
  className,
}: {
  teacher: ConnectTeacher;
  available: boolean;
  subjects?: string[];
  className?: string;
}) {
  const { user } = useAuth();
  const firstName = teacher.name.split(" ")[0];
  const isFaculty = !!user && user.role !== "parent";

  return (
    <section
      className={cn(
        "mt-10 rounded-2xl border border-hairline bg-white p-5 sm:p-6",
        className,
      )}
    >
      {isFaculty ? (
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-sage" />
          <div>
            <p className="font-semibold text-ink">
              Parents book a demo from this profile
            </p>
            <p className="mt-0.5 text-sm leading-relaxed text-muted">
              They pick a subject, class, and time. You confirm the demo in
              your inbox. You can also pitch on the requirements board.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-coral-wash">
              <MessageCircle className="h-5 w-5 text-coral" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-ink">
                Book a demo with {firstName}
              </p>
              <p className="mt-0.5 text-sm leading-relaxed text-muted">
                Pick the subject, class, and a time. {firstName} sees your
                number and confirms the demo. You agree fees directly after
                that.
              </p>
            </div>
          </div>
          {available ? (
            <BookDemoButton
              teacher={{ id: teacher.id, name: teacher.name, subjects }}
              className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-ink text-sm font-semibold text-white transition hover:bg-ink/85 sm:w-auto sm:px-8"
            />
          ) : (
            <span className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-xl bg-cream text-sm font-semibold text-muted sm:w-auto sm:px-8">
              Fully booked right now
            </span>
          )}
          <p className="mt-3 text-xs leading-relaxed text-muted">
            Mentr stays out of it — ₹0 platform fee · 100% to faculty · contact
            always free.
          </p>
        </>
      )}
    </section>
  );
}
