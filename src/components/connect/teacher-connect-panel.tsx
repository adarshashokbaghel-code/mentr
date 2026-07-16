"use client";

import { useAuth } from "@/components/auth/auth-provider";
import {
  ConnectRequestModal,
  type ConnectTeacher,
} from "@/components/connect/connect-button";
import { type ConnectionStatus } from "@/lib/api";
import { whatsappLink } from "@/lib/teachers";
import { cn } from "@/lib/utils";
import {
  BadgeCheck,
  Clock3,
  LayoutDashboard,
  MessageCircle,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

/**
 * The contact block on a teacher's profile page: one card that owns the
 * whole connection lifecycle — request → pending → accepted/declined —
 * plus the "Mentr stays out of it" reassurance.
 */
export function TeacherConnectPanel({
  teacher,
  available,
  className,
}: {
  teacher: ConnectTeacher;
  available: boolean;
  className?: string;
}) {
  const { user, openRoleChooser } = useAuth();
  const pathname = usePathname();
  const [modalOpen, setModalOpen] = useState(false);
  const [status, setStatus] = useState<"none" | ConnectionStatus>(
    teacher.connectionStatus ?? "none",
  );

  const firstName = teacher.name.split(" ")[0];
  const isFaculty = !!user && user.role !== "parent";

  const staysOut = (
    <p className="mt-3 text-xs leading-relaxed text-muted">
      Mentr stays out of it — ₹0 platform fee · 100% to faculty · contact
      always free.
    </p>
  );

  return (
    <section
      className={cn(
        "mt-10 rounded-2xl border border-hairline bg-white p-5 sm:p-6",
        className,
      )}
    >
      {/* ------------------------- state: connected ------------------------- */}
      {status === "accepted" && teacher.phone ? (
        <>
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sage-wash">
              <BadgeCheck className="h-5 w-5 text-sage" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-ink">
                You&apos;re connected with {firstName}
              </p>
              <p className="mt-0.5 text-sm text-muted">
                They accepted your request — chat on WhatsApp and arrange
                timing, fees &amp; location yourselves.
              </p>
            </div>
          </div>
          <a
            href={whatsappLink({
              name: teacher.name,
              subjectLine: teacher.subjectLine,
              phone: teacher.phone,
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-sage text-sm font-semibold text-white transition hover:opacity-90 sm:w-auto sm:px-8"
          >
            <MessageCircle className="h-4 w-4" />
            Chat on WhatsApp
          </a>
          {staysOut}
        </>
      ) : status === "pending" ? (
        /* ------------------------- state: pending ------------------------- */
        <>
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-butter/70">
              <Clock3 className="h-5 w-5 text-ink/70" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-ink">
                Request sent — waiting for {firstName}
              </p>
              <p className="mt-0.5 text-sm leading-relaxed text-muted">
                They&apos;re reviewing your message. The moment they accept,
                their WhatsApp number unlocks right here.
              </p>
            </div>
          </div>
          <Link
            href="/parent/dashboard"
            className="mt-4 inline-flex h-10 items-center gap-2 rounded-md border border-hairline bg-white px-4 text-[13px] font-semibold text-ink transition hover:bg-cream"
          >
            <LayoutDashboard className="h-3.5 w-3.5 text-muted" />
            Track it in My connections
          </Link>
        </>
      ) : status === "declined" ? (
        /* ------------------------ state: declined ------------------------- */
        <>
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream-band">
              <XCircle className="h-5 w-5 text-muted" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-ink">
                {firstName} declined your request
              </p>
              <p className="mt-0.5 text-sm text-muted">
                You can send a fresh request with a new message — or find
                another great tutor nearby.
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {available && (
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="inline-flex h-10 items-center gap-2 rounded-md bg-coral px-5 text-[13px] font-semibold text-white transition hover:bg-coral-dark"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                Request again
              </button>
            )}
            <Link
              href="/search"
              className="inline-flex h-10 items-center rounded-md border border-hairline bg-white px-5 text-[13px] font-semibold text-ink transition hover:bg-cream"
            >
              Browse other tutors
            </Link>
          </div>
        </>
      ) : isFaculty ? (
        /* -------------------- state: faculty viewing --------------------- */
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-sage" />
          <div>
            <p className="font-semibold text-ink">
              Parents connect through requests
            </p>
            <p className="mt-0.5 text-sm leading-relaxed text-muted">
              Numbers stay private on Mentr — parents send a request with a
              message, and the tutor&apos;s WhatsApp is shared only after they
              accept.
            </p>
          </div>
        </div>
      ) : (
        /* -------------------- state: not connected yet -------------------- */
        <>
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-coral-wash">
              <MessageCircle className="h-5 w-5 text-coral" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-ink">
                Want to talk to {firstName}?
              </p>
              <p className="mt-0.5 text-sm leading-relaxed text-muted">
                Send a connect request with a short note about what you need.
                Once {firstName} accepts, their WhatsApp number unlocks and
                you arrange timing, fees &amp; location yourselves.
              </p>
            </div>
          </div>
          {available ? (
            <button
              type="button"
              onClick={() =>
                user ? setModalOpen(true) : openRoleChooser(pathname)
              }
              className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-coral text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-coral-dark active:scale-[0.98] sm:w-auto sm:px-8"
            >
              <MessageCircle className="h-4 w-4" />
              Connect with {firstName}
            </button>
          ) : (
            <span className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-xl bg-cream text-sm font-semibold text-muted sm:w-auto sm:px-8">
              Fully booked right now
            </span>
          )}
          {staysOut}
        </>
      )}

      {modalOpen && (
        <ConnectRequestModal
          teacher={teacher}
          onClose={() => setModalOpen(false)}
          onSent={() => setStatus("pending")}
        />
      )}
    </section>
  );
}
