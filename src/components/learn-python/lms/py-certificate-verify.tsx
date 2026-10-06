"use client";

import { CertificateArt } from "@/components/learn-python/lms/py-certificate";
import { LEARN_PYTHON_PATH } from "@/lib/learn-python";
import { CERT_ID_RE, certificateDate, certificateProjectTitles } from "@/lib/python-lms/certificate";
import { verifyPyCertificate, type PyCertificate } from "@/lib/python-lms/sync-client";
import { BadgeCheck, Loader2, SearchX } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type State = { phase: "loading" } | { phase: "found"; cert: PyCertificate } | { phase: "missing" } | { phase: "error" };

export function PyCertificateVerify({ id }: { id: string }) {
  const valid = CERT_ID_RE.test(id);
  const [state, setState] = useState<State>(valid ? { phase: "loading" } : { phase: "missing" });

  useEffect(() => {
    if (!valid) return;
    let alive = true;
    verifyPyCertificate(id)
      .then((cert) => alive && setState({ phase: "found", cert }))
      .catch((e: { status?: number }) => alive && setState({ phase: e.status === 404 ? "missing" : "error" }));
    return () => {
      alive = false;
    };
  }, [id, valid]);

  return (
    <div className="mx-auto w-full max-w-[1000px] px-4 pb-20 pt-10 sm:px-6 lg:px-8">
      <p className="font-mono text-[11.5px] uppercase tracking-[0.16em] text-coral">Certificate check</p>
      <h1 className="mt-1 break-all font-mono text-[24px] font-extrabold sm:text-[30px]">{id}</h1>

      {state.phase === "loading" && (
        <p className="mt-8 flex items-center gap-2 text-[15px] text-muted">
          <Loader2 className="h-4 w-4 animate-spin" /> Checking…
        </p>
      )}

      {state.phase === "error" && <p className="mt-8 text-[15px] text-muted">Could not reach the server. Try again in a moment.</p>}

      {state.phase === "missing" && (
        <div className="mt-8 flex gap-3 border border-[#f0c9bd] bg-[#fdf3ef] px-5 py-4">
          <SearchX className="mt-0.5 h-5 w-5 shrink-0 text-[#b2401f]" />
          <div>
            <p className="text-[16px] font-extrabold">No certificate with this id</p>
            <p className="mt-1 text-[14px] leading-relaxed text-muted">
              Mentr never issued a certificate numbered {id}. Check it was typed exactly, including the dashes.
            </p>
          </div>
        </div>
      )}

      {state.phase === "found" && (
        <div className="mt-6 space-y-5">
          <div className="flex gap-3 border border-[#2f9e6e] bg-[#eef8f2] px-5 py-4">
            <BadgeCheck className="mt-0.5 h-6 w-6 shrink-0 text-[#2f9e6e]" />
            <div>
              <p className="text-[16px] font-extrabold">Verified. This certificate is genuine.</p>
              <p className="mt-1 text-[14px] leading-relaxed text-[#2d4a3b]">
                Issued by Mentr to <b>{state.cert.name}</b> on {certificateDate(state.cert.issuedAt)} for the {state.cert.course} course.
              </p>
            </div>
          </div>
          <CertificateArt cert={state.cert} />
          <dl className="grid grid-cols-2 gap-px border border-hairline bg-hairline sm:grid-cols-4">
            {[
              ["Lessons studied", state.cert.stats.lessonsStudied],
              ["Practice solved", state.cert.stats.practiceSolved],
              ["Examples solved", state.cert.stats.examplesSolved],
              ["Projects built", certificateProjectTitles(state.cert.stats.projects).join(", ") || "None"],
            ].map(([label, value]) => (
              <div key={label} className="bg-white px-4 py-3">
                <dt className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted">{label}</dt>
                <dd className="mt-1 text-[15px] font-extrabold">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="text-[13px] leading-relaxed text-muted">
            The numbers above were recorded from the learner&apos;s saved progress at the moment the certificate was issued and cannot be edited.
            It is a Mentr course certificate, not a school or board qualification.
          </p>
          <Link href={LEARN_PYTHON_PATH} className="inline-block text-[14px] font-bold underline underline-offset-4">
            Learn Python free on Mentr
          </Link>
        </div>
      )}
    </div>
  );
}
