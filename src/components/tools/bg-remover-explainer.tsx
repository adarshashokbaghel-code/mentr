import { BG_REMOVAL } from "@/lib/background-removal/config";
import {
  BadgeCheck,
  Cpu,
  HardDrive,
  Layers,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const SPECS = [
  { label: "Pipeline", value: BG_REMOVAL.PIPELINE_VERSION },
  { label: "Model", value: `${BG_REMOVAL.MODEL_NAME} · ${BG_REMOVAL.MODEL_VERSION}` },
  { label: "Inference", value: "512×512 + detail crop" },
  { label: "Working size", value: `≤ ${BG_REMOVAL.MAX_PROCESS_SIDE}px (≤${BG_REMOVAL.MAX_PROCESS_SIDE_MOBILE} mobile)` },
  { label: "Model size", value: "~94 MB (same-origin cache)" },
  { label: "Runtime", value: "On-device · WASM-first on phones" },
  { label: "Watermark", value: "None" },
  { label: "Signup", value: "Not required" },
] as const;

const FLOW = [
  {
    title: "Upload & validate",
    body: "MIME sniffing, decode check, EXIF orientation, pixel caps — bad files stop here.",
  },
  {
    title: "Find the subject",
    body: "On-device processing builds a soft transparency matte (not a hard cut).",
  },
  {
    title: "Detail pass",
    body: "We zoom into the subject and run again so edges and hair get more pixels.",
  },
  {
    title: "Clean edges",
    body: "Guided refine, hole fill, and color-spill cleanup for a usable PNG.",
  },
  {
    title: "Download",
    body: "Transparent PNG — no watermark. Everything stayed on your device.",
  },
] as const;

const EXAMPLES = [
  {
    title: "Portraits & class photos",
    body: "Clean subject cutouts for ID-style cards, yearbook layouts, or tutor profiles.",
  },
  {
    title: "Products & worksheets",
    body: "Isolate an object for a worksheet, slide, or WhatsApp flyer without a studio backdrop.",
  },
  {
    title: "Animals & fine edges",
    body: "Soft alpha helps fur and hair better than a binary stamp — still inspect zoomed edges.",
  },
] as const;

/** Rich quality + how-it-works block for /tools/background-remover */
export function BgRemoverExplainer() {
  return (
    <div id="quality" className="scroll-mt-24 space-y-10">
      <section>
        <p className="text-[11px] font-bold uppercase tracking-wider text-coral">
          Verified product facts
        </p>
        <h2 className="mt-1 text-[1.25rem] font-extrabold text-ink">
          Quality you can verify — free forever, private by design
        </h2>
        <p className="mt-3 text-[15px] font-medium leading-relaxed text-muted">
          Mentr&apos;s Background Remover is built so teachers, parents, and
          students can cut out a subject and download a transparent PNG without
          paying, signing up, or sending photos to our servers. Quality comes
          from an open MIT model (BiRefNet_lite), a soft alpha pipeline, and
          browser engineering — not from a paid GPU farm. Below are the facts we
          stand behind, with a full technical write-up if you want the deep dive.
        </p>
        <p className="mt-3 text-[14px] font-medium leading-relaxed text-muted">
          Context:{" "}
          <span className="font-bold text-ink">
            remove.bg&apos;s standalone site is scheduled to shut down on 1
            December 2026
          </span>{" "}
          as background removal moves into Canva (announced on remove.bg). Many
          people still need a simple, free cutout tool that is not locked behind
          a design suite. That is the gap this Mentr utility fills — with an
          honest architecture note on cost and infrastructure.
        </p>
        <Link
          href="/technical/bgremover"
          className="mt-4 inline-flex items-center gap-2 rounded-xl border-2 border-ink bg-white px-4 py-2.5 text-[13px] font-extrabold text-ink shadow-[2px_2px_0_0_#1c1a17] hover:bg-cream"
        >
          Read the technical article →
        </Link>
      </section>

      <section className="overflow-hidden rounded-2xl border-2 border-ink/10 bg-cream/30">
        <div className="border-b border-hairline px-4 py-3 sm:px-5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
            Announcement on remove.bg (source screenshot)
          </p>
        </div>
        <div className="relative bg-white p-3 sm:p-4">
          <Image
            src="/technical/removebg-moving-to-canva.png"
            alt="remove.bg banner stating background removal is moving to Canva and the standalone site ends 1 December 2026"
            width={1200}
            height={420}
            className="h-auto w-full rounded-lg border border-hairline"
            priority={false}
          />
          <p className="mt-2 text-[11px] font-medium text-muted">
            Source: remove.bg homepage banner — used to document the Canva
            migration date, not as a partnership claim.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-[1.15rem] font-extrabold text-ink">
          Specs we publish (engineering-verified)
        </h2>
        <p className="mt-2 text-[14px] font-medium leading-relaxed text-muted">
          These are configuration and license facts from the shipping pipeline (
          {BG_REMOVAL.PIPELINE_VERSION}), not invented “% better than brand X”
          scores.
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {SPECS.map((s) => (
            <li
              key={s.label}
              className="flex items-center justify-between gap-3 rounded-xl border border-hairline bg-cream/40 px-3.5 py-2.5"
            >
              <span className="text-[12px] font-bold uppercase tracking-wider text-muted">
                {s.label}
              </span>
              <span className="text-right text-[13px] font-extrabold text-ink">
                {s.value}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="flex items-center gap-2 text-[1.15rem] font-extrabold text-ink">
          <Layers className="h-5 w-5 text-coral" />
          How quality is produced (full flow)
        </h2>
        <p className="mt-2 text-[14px] font-medium leading-relaxed text-muted">
          A hard black/white mask looks sharp in a thumbnail and fails on hair.
          We keep a continuous alpha matte, refine edges lightly, then compose
          RGBA for PNG download.
        </p>
        <ol className="mt-4 space-y-3">
          {FLOW.map((step, i) => (
            <li
              key={step.title}
              className="flex gap-3 rounded-xl border border-hairline bg-white p-3.5"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink text-[13px] font-extrabold text-white">
                {i + 1}
              </span>
              <div>
                <p className="text-[14px] font-extrabold text-ink">
                  {step.title}
                </p>
                <p className="mt-0.5 text-[13px] font-medium leading-relaxed text-muted">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="text-[1.15rem] font-extrabold text-ink">
          Example uses (same pipeline)
        </h2>
        <ul className="mt-3 grid gap-3 sm:grid-cols-3">
          {EXAMPLES.map((ex) => (
            <li
              key={ex.title}
              className="rounded-xl border border-hairline bg-cream/30 p-4"
            >
              <p className="text-[13px] font-extrabold text-ink">{ex.title}</p>
              <p className="mt-1.5 text-[12px] font-medium leading-relaxed text-muted">
                {ex.body}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-sage/30 bg-sage-wash/50 p-4">
          <p className="inline-flex items-center gap-1.5 text-[12px] font-extrabold text-sage">
            <Shield className="h-3.5 w-3.5" />
            Privacy
          </p>
          <p className="mt-1.5 text-[13px] font-medium leading-relaxed text-muted">
            Images are not uploaded to Mentr for this tool. Inference runs in a
            Web Worker on your device (WebGPU when available, otherwise WASM).
          </p>
        </div>
        <div className="rounded-xl border border-hairline bg-white p-4">
          <p className="inline-flex items-center gap-1.5 text-[12px] font-extrabold text-ink">
            <HardDrive className="h-3.5 w-3.5 text-coral" />
            Caching
          </p>
          <p className="mt-1.5 text-[13px] font-medium leading-relaxed text-muted">
            Transformers.js stores model weights in the browser cache after the
            first download so return visits skip the ~94 MB fetch.
          </p>
        </div>
        <div className="rounded-xl border border-hairline bg-white p-4">
          <p className="inline-flex items-center gap-1.5 text-[12px] font-extrabold text-ink">
            <Cpu className="h-3.5 w-3.5 text-coral" />
            Why not a GPU server?
          </p>
          <p className="mt-1.5 text-[13px] font-medium leading-relaxed text-muted">
            Always-on GPUs would force usage limits or fees. Browser inference
            keeps the tool free forever within your device limits.
          </p>
        </div>
        <div className="rounded-xl border border-hairline bg-white p-4">
          <p className="inline-flex items-center gap-1.5 text-[12px] font-extrabold text-ink">
            <BadgeCheck className="h-3.5 w-3.5 text-coral" />
            License
          </p>
          <p className="mt-1.5 text-[13px] font-medium leading-relaxed text-muted">
            Production weights: BiRefNet_lite browser export under MIT — not
            BRIA RMBG-2.0 (non-commercial / paid) and not AGPL packages.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border-2 border-ink bg-ink p-5 text-white sm:p-6">
        <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-white/55">
          <Sparkles className="h-3.5 w-3.5 text-coral" />
          Promise
        </p>
        <p className="mt-2 text-[1.05rem] font-extrabold leading-snug">
          Free background removal with downloadable transparent PNGs — no
          watermark, no mandatory signup, processed on your device.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href="#tool"
            className="inline-flex h-10 items-center rounded-xl bg-coral px-4 text-[13px] font-extrabold text-white hover:brightness-110"
          >
            <Zap className="mr-1.5 h-3.5 w-3.5" />
            Use the tool
          </a>
          <Link
            href="/technical/bgremover"
            className="inline-flex h-10 items-center rounded-xl border border-white/25 px-4 text-[13px] font-bold text-white/90 hover:bg-white/10"
          >
            Engineering deep dive
          </Link>
        </div>
      </section>
    </div>
  );
}
