"use client";

import { certificateDate, certificateSummary } from "@/lib/python-lms/certificate";
import type { PyCertificate } from "@/lib/python-lms/sync-client";
import { cn } from "@/lib/utils";

const cq = (n: number) => `${n}cqw`;

/** The certificate as it prints: A4 landscape, scales with its container width. */
export function CertificateArt({ cert, className }: { cert: PyCertificate; className?: string }) {
  return (
    <div className={cn("w-full [container-type:inline-size]", className)}>
      <div
        className="relative aspect-[842/595] w-full overflow-hidden bg-[#fcf9f3] text-[#0f1712] shadow-[0_18px_50px_-24px_rgba(15,23,18,0.45)]"
        style={{ fontSize: cq(1.6) }}
      >
        <div className="absolute border-[#1f6b4a]" style={{ inset: cq(2.1), borderWidth: cq(0.7) }} />
        <div className="absolute border border-[#b8944a]" style={{ inset: cq(3.8) }} />
        <div className="absolute bg-[#1f6b4a]" style={{ left: cq(3.8), right: cq(3.8), top: cq(3.8), height: cq(0.95) }} />
        <svg className="absolute right-0 top-0 h-full opacity-[0.05]" viewBox="0 0 100 100" preserveAspectRatio="xMaxYMid meet" aria-hidden>
          <path d="M60 10c-18 0-20 8-20 14v8h21v4H30c-11 0-18 8-18 22s6 22 16 22h7V68c0-9 8-17 17-17h21c8 0 14-6 14-14V24c0-8-7-14-21-14z" fill="#1f6b4a" />
        </svg>

        <div className="absolute flex items-baseline gap-[0.8em]" style={{ left: cq(6.9), top: cq(8.6) }}>
          <span className="font-extrabold tracking-tight" style={{ fontSize: cq(1.95) }}>
            MENTR
          </span>
          <span className="font-bold tracking-[0.08em] text-[#1f6b4a]" style={{ fontSize: cq(1.2) }}>
            LEARN PYTHON
          </span>
        </div>
        <span className="absolute font-mono text-[#626662]" style={{ right: cq(6.9), top: cq(8.8), fontSize: cq(1.15) }}>
          No. {cert.id}
        </span>

        <div className="absolute inset-x-0 text-center" style={{ top: cq(14.5) }}>
          <p className="font-extrabold tracking-[0.06em]" style={{ fontSize: cq(3.35) }}>
            CERTIFICATE OF COMPLETION
          </p>
          <div className="mx-auto bg-[#b8944a]" style={{ width: cq(14), height: cq(0.18), marginTop: cq(1.2) }} />
          <p className="font-bold tracking-[0.14em] text-[#1f6b4a]" style={{ fontSize: cq(1.3), marginTop: cq(1.3) }}>
            {cert.course.toUpperCase()} COURSE
          </p>
          <p className="text-[#626662]" style={{ fontSize: cq(1.55), marginTop: cq(3) }}>
            This certifies that
          </p>
          <p
            className="mx-auto truncate font-serif font-bold italic leading-tight"
            style={{ fontSize: cq(cert.name.length > 26 ? 3.8 : 5), marginTop: cq(1.6), maxWidth: cq(74) }}
          >
            {cert.name}
          </p>
          <div className="mx-auto bg-[#b8944a]" style={{ width: cq(55), height: cq(0.1), marginTop: cq(0.9) }} />
          <p className="mx-auto leading-[1.55]" style={{ fontSize: cq(1.48), marginTop: cq(2.2), maxWidth: cq(68) }}>
            has earned the {cert.course} certificate on Mentr {certificateSummary(cert)}
          </p>
        </div>

        <div className="absolute flex items-end justify-between" style={{ left: cq(13), right: cq(13), bottom: cq(9) }}>
          <div style={{ width: cq(21.5) }}>
            <p className="font-bold" style={{ fontSize: cq(1.42) }}>
              {certificateDate(cert.issuedAt)}
            </p>
            <div className="bg-[#626662]" style={{ height: cq(0.1), marginTop: cq(0.5) }} />
            <p className="text-[#626662]" style={{ fontSize: cq(1.12), marginTop: cq(0.5) }}>
              Date issued
            </p>
          </div>
          <div
            className="flex flex-col items-center justify-center rounded-full bg-[#1f6b4a] text-white"
            style={{ width: cq(9.5), height: cq(9.5), boxShadow: `inset 0 0 0 ${cq(0.7)} #1f6b4a, inset 0 0 0 ${cq(0.85)} #b8944a` }}
          >
            <span className="font-extrabold" style={{ fontSize: cq(1.3) }}>
              MENTR
            </span>
            <span className="font-bold tracking-[0.1em] text-[#d9c78c]" style={{ fontSize: cq(0.9) }}>
              VERIFIED
            </span>
          </div>
          <div style={{ width: cq(21.5) }}>
            <p className="font-bold" style={{ fontSize: cq(1.42) }}>
              {cert.stats.xp} XP
            </p>
            <div className="bg-[#626662]" style={{ height: cq(0.1), marginTop: cq(0.5) }} />
            <p className="text-[#626662]" style={{ fontSize: cq(1.12), marginTop: cq(0.5) }}>
              Earned in the course
            </p>
          </div>
        </div>

        <p className="absolute inset-x-0 text-center text-[#626662]" style={{ bottom: cq(4.9), fontSize: cq(1.05) }}>
          Verify: mentr.in/learnpython/certificate/{cert.id}
        </p>
      </div>
    </div>
  );
}
