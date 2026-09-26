import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";
import { BG_REMOVAL } from "@/lib/background-removal/config";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";
import {
  ArrowRight,
  BadgeCheck,
  Clock,
  Cpu,
  HardDrive,
  Layers,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: {
    absolute: `remove.bg Moves to Canva in Dec 2026 — How Mentr Built a Free On-Device Background Remover | ${SITE_NAME}`,
  },
  description:
    "remove.bg’s standalone site ends 1 December 2026 as background removal moves to Canva. Mentr’s free forever on-device remover: BiRefNet_lite, crop-and-refine, guided alpha, same-origin model host, WebGPU/WASM — pipeline bg-pipeline-0.3.",
  keywords: [
    "remove.bg shutdown",
    "remove.bg Canva",
    "free background remover",
    "browser background removal",
    "BiRefNet",
    "crop and refine matting",
    "on-device ML",
    "Mentr tools",
  ],
  alternates: { canonical: "/technical/bgremover" },
  openGraph: {
    title: "remove.bg → Canva (Dec 2026) and Mentr’s free on-device alternative",
    description:
      "Engineering deep dive for bg-pipeline-0.3: same-origin weights, mobile WASM path, crop-and-refine, MIT BiRefNet_lite.",
    url: absoluteUrl("/technical/bgremover"),
    type: "article",
    images: [
      {
        url: absoluteUrl("/technical/removebg-moving-to-canva.png"),
        width: 1200,
        height: 420,
        alt: "remove.bg announcement: moving to Canva",
      },
    ],
  },
};

const TOC = [
  { id: "proof", label: "Announcement proof" },
  { id: "problem", label: "Infra & cost problem" },
  { id: "approach", label: "Technical approach" },
  { id: "specs", label: "Shipped specs" },
  { id: "flowchart", label: "System flowchart" },
  { id: "pipeline", label: "Pipeline steps" },
  { id: "refine", label: "Crop-and-refine" },
  { id: "caching", label: "Caching & mobile" },
  { id: "changelog", label: "Version log" },
  { id: "licensing", label: "Licensing choices" },
  { id: "limits", label: "Honest limits" },
  { id: "try", label: "Try the tool" },
] as const;

const SPECS = [
  { k: "Pipeline", v: BG_REMOVAL.PIPELINE_VERSION },
  { k: "Model", v: `${BG_REMOVAL.MODEL_NAME} (${BG_REMOVAL.MODEL_VERSION})` },
  { k: "Weights", v: BG_REMOVAL.MODEL_ID },
  { k: "License", v: BG_REMOVAL.LICENSE_TAG },
  { k: "Model size", v: "~94 MB fp16 (same-origin /models)" },
  { k: "Inference grid", v: "512 × 512 (×2 passes when useful)" },
  { k: "Working long side", v: `≤ ${BG_REMOVAL.MAX_PROCESS_SIDE}px (≤${BG_REMOVAL.MAX_PROCESS_SIDE_MOBILE} mobile)` },
  { k: "Runtime", v: "Phones: WASM-first · Desktop: WebGPU → WASM" },
  { k: "Thread", v: "Dedicated Web Worker" },
  { k: "Alpha", v: "Continuous [0,1] soft matte" },
  { k: "Post", v: "Guided refine · hole fill · decontaminate" },
  { k: "Upload to Mentr", v: "Never (Mode A)" },
] as const;

export default function TechnicalBgRemoverPage() {
  const published = "September 2026";

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Technical", path: "/technical/bgremover" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "TechArticle",
            headline:
              "remove.bg Website to Shut Down in December 2026 as Background Removal Moves to Canva — How Mentr Built a Free Forever On-Device Alternative",
            datePublished: "2026-09-19",
            dateModified: "2026-09-19",
            author: { "@type": "Organization", name: SITE_NAME },
            publisher: { "@type": "Organization", name: SITE_NAME },
            description:
              "Engineering article on Mentr bg-pipeline-0.3 after remove.bg’s Canva migration announcement.",
            image: absoluteUrl("/technical/removebg-moving-to-canva.png"),
            mainEntityOfPage: absoluteUrl("/technical/bgremover"),
          },
        ]}
      />
      <Navbar />
      <main className="min-h-screen bg-[#f3f0ea]">
        <div className="border-b border-hairline bg-gradient-to-b from-[#faf7f2] to-[#f3f0ea]">
          <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
            <p className="text-[11px] font-bold uppercase tracking-wider text-coral">
              Technical · Mentr Engineering
            </p>
            <h1 className="mt-2 w-full text-[1.75rem] font-extrabold tracking-tight text-ink sm:text-[2.35rem] sm:leading-[1.12] lg:text-[2.5rem]">
              remove.bg Website to Shut Down in December 2026 as Background
              Removal Moves to Canva — How We Built a Free Forever On-Device
              Alternative
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] font-semibold text-muted">
              <span>Mentr Engineering</span>
              <span aria-hidden>·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {published}
              </span>
              <span aria-hidden>·</span>
              <span>~10 min read</span>
              <span aria-hidden>·</span>
              <span className="rounded-md bg-ink px-2 py-0.5 text-[11px] font-bold text-white">
                {BG_REMOVAL.PIPELINE_VERSION}
              </span>
            </div>
            <p className="mt-5 max-w-3xl text-[16px] font-medium leading-relaxed text-muted">
              remove.bg is ending its standalone website on{" "}
              <strong className="text-ink">
                1 December 2026 at 9:00am CET
              </strong>
              , integrating background removal into Canva. Here is what that
              means — and the exact engineering behind Mentr&apos;s{" "}
              <strong className="text-ink">
                100% free, no-watermark, unlimited on-device remover
              </strong>{" "}
              ({BG_REMOVAL.PIPELINE_VERSION}): BiRefNet_lite, crop-and-refine,
              guided alpha, same-origin model host, mobile WASM path.
            </p>
          </div>
        </div>

        <div className="mx-auto grid max-w-[1400px] gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:px-8 lg:py-12 xl:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <nav
              aria-label="Article sections"
              className="sticky top-20 overflow-hidden rounded-2xl border-2 border-ink bg-white shadow-[3px_3px_0_0_#1c2434]"
            >
              <p className="border-b border-hairline bg-cream/60 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-muted">
                In this article
              </p>
              <ol className="max-h-[calc(100vh-8rem)] space-y-0.5 overflow-y-auto p-2 text-[13px] font-bold">
                {TOC.map((t, i) => (
                  <li key={t.id}>
                    <a
                      href={`#${t.id}`}
                      className="block rounded-lg px-3 py-2 text-ink transition hover:bg-cream hover:text-coral"
                    >
                      {i + 1}. {t.label}
                    </a>
                  </li>
                ))}
              </ol>
              <div className="border-t border-hairline p-3">
                <Link
                  href="/tools/background-remover"
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-coral px-3 py-2.5 text-[13px] font-extrabold text-white hover:brightness-95"
                >
                  <Zap className="h-3.5 w-3.5" />
                  Open the tool
                </Link>
              </div>
            </nav>
          </aside>

          <article className="min-w-0 space-y-12 rounded-2xl border border-hairline bg-white p-5 sm:p-8 lg:p-10">
            <nav
              aria-label="Mobile table of contents"
              className="rounded-xl border border-hairline bg-cream/40 p-4 lg:hidden"
            >
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
                Jump to
              </p>
              <ol className="mt-2 columns-2 gap-x-4 text-[12px] font-bold text-ink">
                {TOC.map((t, i) => (
                  <li key={t.id} className="break-inside-avoid py-0.5">
                    <a href={`#${t.id}`} className="hover:text-coral">
                      {i + 1}. {t.label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <section id="proof" className="scroll-mt-24">
              <h2 className="text-[1.4rem] font-extrabold text-ink">
                1. The announcement (primary source)
              </h2>
              <p className="mt-3 text-[15px] font-medium leading-relaxed text-muted">
                remove.bg states on its own site that background removal is
                moving to Canva and that the standalone website will no longer
                be available from 1 December 2026. We archive that banner so the
                date and wording are verifiable — this article is not affiliated
                with Canva or remove.bg.
              </p>
              <figure className="mt-5 overflow-hidden rounded-2xl border-2 border-ink bg-white shadow-[3px_3px_0_0_#1c1a17]">
                <Image
                  src="/technical/removebg-moving-to-canva.png"
                  alt="Screenshot of remove.bg announcing migration to Canva and standalone site shutdown on 1 December 2026"
                  width={1200}
                  height={420}
                  className="h-auto w-full"
                  priority
                />
                <figcaption className="border-t border-hairline bg-cream/40 px-4 py-2.5 text-[12px] font-medium text-muted">
                  Figure 1. remove.bg homepage banner — migration to Canva;
                  standalone site ends 1 December 2026 at 9:00am CET.
                </figcaption>
              </figure>
            </section>

            <section id="problem" className="scroll-mt-24">
              <h2 className="text-[1.4rem] font-extrabold text-ink">
                2. The product problem: infra and cost
              </h2>
              <p className="mt-3 text-[15px] font-medium leading-relaxed text-muted">
                High-quality background removal is usually a{" "}
                <strong className="text-ink">GPU-backed API</strong>: upload →
                rented accelerator → PNG. Excellent at scale — expensive at
                “free forever, no signup, unlimited.”
              </p>
              <p className="mt-3 text-[15px] font-medium leading-relaxed text-muted">
                Mentr Tools already ship browser-first PDF utilities on
                Vercel + a light API. We do not run a GPU fleet for tools today.
                A metered remove-bg-style API on every free visit would burn cash
                or force caps, login walls, or watermarks.
              </p>
              <p className="mt-3 text-[15px] font-medium leading-relaxed text-muted">
                Constraint:{" "}
                <strong className="text-ink">
                  inference must live on the user&apos;s device
                </strong>
                , under a commercial-friendly license, without freezing the tab.
              </p>
            </section>

            <section id="approach" className="scroll-mt-24">
              <h2 className="text-[1.4rem] font-extrabold text-ink">
                3. Technical approach (summary)
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  {
                    icon: Cpu,
                    title: "On-device ONNX",
                    body: "BiRefNet_lite @ 512² via Transformers.js / ORT Web — WebGPU first, WASM fallback.",
                  },
                  {
                    icon: Layers,
                    title: "Crop-and-refine",
                    body: "Second pass zooms the subject into the 512 window so edges/hair get more pixels.",
                  },
                  {
                    icon: Sparkles,
                    title: "Guided alpha stack",
                    body: "Soft matte + image-guided refine + hole fill + color decontamination — not a hard mask.",
                  },
                  {
                    icon: HardDrive,
                    title: "Cached weights",
                    body: "~94 MB fp16 from Mentr CDN once; browser cache on return visits.",
                  },
                ].map((c) => (
                  <div
                    key={c.title}
                    className="rounded-xl border border-hairline bg-cream/30 p-4"
                  >
                    <p className="inline-flex items-center gap-2 text-[13px] font-extrabold text-ink">
                      <c.icon className="h-4 w-4 text-coral" />
                      {c.title}
                    </p>
                    <p className="mt-1.5 text-[13px] font-medium leading-relaxed text-muted">
                      {c.body}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section id="specs" className="scroll-mt-24">
              <h2 className="text-[1.4rem] font-extrabold text-ink">
                4. Shipped specs (accurate as of this article)
              </h2>
              <p className="mt-2 text-[14px] font-medium text-muted">
                Configuration facts from production code — not marketing
                percentages.
              </p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {SPECS.map((s) => (
                  <li
                    key={s.k}
                    className="flex items-start justify-between gap-3 rounded-xl border border-hairline bg-cream/40 px-3.5 py-2.5"
                  >
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
                      {s.k}
                    </span>
                    <span className="max-w-[60%] text-right text-[12px] font-extrabold leading-snug text-ink break-all">
                      {s.v}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section id="flowchart" className="scroll-mt-24">
              <h2 className="text-[1.4rem] font-extrabold text-ink">
                5. System flowchart
              </h2>
              <p className="mt-3 text-[15px] font-medium leading-relaxed text-muted">
                Mode A (local) as shipped in {BG_REMOVAL.PIPELINE_VERSION}. HD /
                server Mode B stays out of scope until cost and privacy
                disclosure are separate decisions.
              </p>
              <div className="mt-5 overflow-x-auto rounded-2xl border-2 border-ink bg-[#1c1a17] p-4 sm:p-6">
                <BgFlowchart />
              </div>
              <p className="mt-2 text-[12px] font-medium text-muted">
                Figure 2. Local Mode A — including the detail (crop-refine) pass.
              </p>
            </section>

            <section id="pipeline" className="scroll-mt-24">
              <h2 className="text-[1.4rem] font-extrabold text-ink">
                6. Pipeline steps (technically accurate)
              </h2>
              <ol className="mt-4 space-y-4">
                {[
                  {
                    t: "Validate & normalize",
                    d: `Reject empty / oversized / undecodable files. Sniff JPEG/PNG/WEBP magic bytes. EXIF via createImageBitmap({ imageOrientation: "from-image" }). Cap longest side at ${BG_REMOVAL.MAX_PROCESS_SIDE}px while preserving aspect ratio.`,
                  },
                  {
                    t: "Web Worker handoff",
                    d: "UI thread only orchestrates. Worker loads Transformers.js, runs inference, returns Float32 alpha + RGBA with transferable buffers so the page stays interactive.",
                  },
                  {
                    t: "Load BiRefNet_lite 512 (cached)",
                    d: `Model id ${BG_REMOVAL.MODEL_ID} — browser ONNX export of ZhengPeng7/BiRefNet_lite (MIT). WebGPU + fp16 first; WASM + fp32 on failure or degenerate masks.`,
                  },
                  {
                    t: "Coarse segmentation → soft alpha",
                    d: "Processor → 512² ImageNet-normalized tensor. Logits → sigmoid → continuous α ∈ [0,1]. Smoothstep upsample to working resolution (not hard 0/1).",
                  },
                  {
                    t: "Crop-and-refine (detail pass)",
                    d: "Foreground bbox + padding. If the subject does not already fill most of the frame, crop and re-infer so 512² focuses on edges/hair. Feather paste back into the full matte.",
                  },
                  {
                    t: "Post-process on main thread",
                    d: "Remove tiny FG speckles, fill small interior holes, image-guided bilateral alpha refine, edge-aware contrast on strong photo edges, then color decontamination on semi-transparent fringes.",
                  },
                  {
                    t: "Compose & download",
                    d: "Alpha → PNG A channel. Object URLs revoked on reset. No watermark bytes injected.",
                  },
                ].map((s, i) => (
                  <li key={s.t} className="flex gap-3">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-coral text-[12px] font-extrabold text-white">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-[15px] font-extrabold text-ink">
                        {s.t}
                      </p>
                      <p className="mt-1 text-[14px] font-medium leading-relaxed text-muted">
                        {s.d}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section id="refine" className="scroll-mt-24">
              <h2 className="text-[1.4rem] font-extrabold text-ink">
                7. Why crop-and-refine matters
              </h2>
              <p className="mt-3 text-[15px] font-medium leading-relaxed text-muted">
                A single 512² pass on a full-frame photo spends most of its
                capacity on empty background. After a coarse matte, we locate the
                subject, pad ~12%, and run the{" "}
                <strong className="text-ink">same MIT model</strong> again on
                the crop. That is a real quality gain without switching to
                non-commercial weights or a paid GPU API.
              </p>
              <p className="mt-3 text-[15px] font-medium leading-relaxed text-muted">
                We skip the second pass when the subject already covers most of
                the frame (little to gain) or when the box is tiny (noise).
              </p>
            </section>

            <section id="caching" className="scroll-mt-24">
              <h2 className="text-[1.4rem] font-extrabold text-ink">
                8. Caching, mobile path, and first-load behavior
              </h2>
              <p className="mt-3 text-[15px] font-medium leading-relaxed text-muted">
                Weights are served same-origin from{" "}
                <code className="rounded bg-cream px-1.5 py-0.5 text-[13px] font-bold text-ink">
                  /models/birefnet-lite-512
                </code>{" "}
                (not Hugging Face live). ORT wasm lives under{" "}
                <code className="rounded bg-cream px-1.5 py-0.5 text-[13px] font-bold text-ink">
                  /ort/
                </code>
                . Browser cache + long Cache-Control keep return visits fast.
                Phones use WASM-first, skip the detail pass, and cap at{" "}
                {BG_REMOVAL.MAX_PROCESS_SIDE_MOBILE}px to avoid “Failed to create
                pipeline” OOMs.
              </p>
              <p className="mt-3 text-[15px] font-medium leading-relaxed text-muted">
                Desktop prefers WebGPU then WASM. Degenerate GPU masks trigger an
                automatic WASM retry. The model is{" "}
                <strong className="text-ink">
                  not loaded on the /tools hub
                </strong>{" "}
                — only on `/tools/background-remover` (warmed on page open). Work
                runs in a Web Worker, so switching tabs mid-run is safe — the
                job keeps going until you close the page.
              </p>
            </section>

            <section id="changelog" className="scroll-mt-24">
              <h2 className="text-[1.4rem] font-extrabold text-ink">
                9. Version log (what changed and why)
              </h2>
              <div className="mt-4 space-y-4">
                <div className="rounded-xl border border-hairline bg-cream/30 p-4">
                  <p className="text-[13px] font-extrabold text-ink">
                    {BG_REMOVAL.PIPELINE_VERSION}{" "}
                    <span className="font-semibold text-muted">
                      · September 2026 · mobile reliability
                    </span>
                  </p>
                  <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[14px] font-medium text-muted">
                    <li>
                      <strong className="text-ink">Same-origin weights</strong>{" "}
                      — production phones were timing out on Hugging Face (~94
                      MB) and then failing with “Failed to create pipeline.”
                      Model + ORT wasm now ship from Mentr CDN on build.
                    </li>
                    <li>
                      <strong className="text-ink">Mobile runtime path</strong>{" "}
                      — WASM-first (skip flaky phone WebGPU), working long side
                      ≤{BG_REMOVAL.MAX_PROCESS_SIDE_MOBILE}px, skip crop-and-refine
                      on phones, always fp16 (never the 192 MB fp32 graph).
                    </li>
                    <li>
                      <strong className="text-ink">
                        Same quality model on purpose
                      </strong>{" "}
                      — we evaluated a much smaller fallback (e.g. MODNet /
                      U²-NetP). Edge quality dropped enough that it was not “the
                      same cutout, just faster.” For free forever + reliable, we
                      keep BiRefNet_lite and make the{" "}
                      <em>runtime</em> lighter, not the weights weaker.
                    </li>
                    <li>
                      Warm-up on tool open, load retries + cache purge, and a
                      Retry control when setup fails mid-download.
                    </li>
                  </ul>
                </div>
                <div className="rounded-xl border border-hairline p-4">
                  <p className="text-[13px] font-extrabold text-ink">
                    bg-pipeline-0.2{" "}
                    <span className="font-semibold text-muted">
                      · crop-and-refine + guided alpha
                    </span>
                  </p>
                  <p className="mt-1.5 text-[14px] font-medium text-muted">
                    Second-pass subject crop, soft matte, guided refine, hole
                    fill, color decontamination — quality ceiling without
                    changing the MIT model.
                  </p>
                </div>
                <div className="rounded-xl border border-hairline p-4">
                  <p className="text-[13px] font-extrabold text-ink">
                    bg-pipeline-0.1{" "}
                    <span className="font-semibold text-muted">
                      · initial Mode A ship
                    </span>
                  </p>
                  <p className="mt-1.5 text-[14px] font-medium text-muted">
                    BiRefNet_lite 512 in a Web Worker, soft alpha export, no
                    watermark / no signup product path.
                  </p>
                </div>
              </div>
            </section>

            <section id="licensing" className="scroll-mt-24">
              <h2 className="text-[1.4rem] font-extrabold text-ink">
                10. Licensing choices
              </h2>
              <p className="mt-3 text-[15px] font-medium leading-relaxed text-muted">
                Mentr&apos;s product is MIT. An AGPL background-removal SDK in a
                hosted SaaS without a commercial grant is a copyleft risk we
                avoid. BRIA RMBG-2.0 self-host is{" "}
                <strong className="text-ink">CC BY-NC / paid API</strong> — fine
                for eval or future Mode B, not unpaid self-host.
              </p>
              <p className="mt-3 text-[15px] font-medium leading-relaxed text-muted">
                Production Mode A uses{" "}
                <strong className="text-ink">
                  BiRefNet_lite MIT ONNX ({BG_REMOVAL.MODEL_ID})
                </strong>
                . See{" "}
                <code className="rounded bg-cream px-1 text-[13px] font-bold">
                  docs/ml/MODEL-LICENSES.md
                </code>
                .
              </p>
            </section>

            <section id="limits" className="scroll-mt-24">
              <h2 className="text-[1.4rem] font-extrabold text-ink">
                11. Honest limits
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] font-medium text-muted">
                <li>
                  Base inference is 512² (plus a subject crop pass) — not a
                  1024 server GPU model.
                </li>
                <li>
                  Low-memory phones may use WASM and take longer; we show
                  friendly progress, not raw engine names.
                </li>
                <li>
                  We do not claim “same as remove.bg” or “better than Canva”
                  without a documented same-image study.
                </li>
                <li>
                  HD 2× upscaling is not enabled until a licensed, costed path
                  exists.
                </li>
              </ul>
            </section>

            <section id="try" className="scroll-mt-24">
              <h2 className="text-[1.4rem] font-extrabold text-ink">
                12. Try it — free forever
              </h2>
              <p className="mt-3 text-[15px] font-medium leading-relaxed text-muted">
                Need a dedicated cutout utility that is not folded into a full
                design suite? Upload, preview, download PNG — no watermark, no
                mandatory account, unlimited on-device use within your device
                limits.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/tools/background-remover"
                  className="inline-flex h-12 items-center gap-2 rounded-xl bg-coral px-5 text-[14px] font-extrabold text-white hover:brightness-95"
                >
                  <Zap className="h-4 w-4" />
                  Open Free Background Remover
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/tools"
                  className="inline-flex h-12 items-center rounded-xl border-2 border-ink/15 bg-white px-5 text-[14px] font-bold text-ink"
                >
                  All Mentr Tools
                </Link>
              </div>
            </section>

            <footer className="border-t border-hairline pt-6 text-[12px] font-medium text-muted">
              <p className="inline-flex flex-wrap items-center gap-2">
                <BadgeCheck className="h-3.5 w-3.5 text-sage" />
                Pipeline {BG_REMOVAL.PIPELINE_VERSION} · Model{" "}
                {BG_REMOVAL.MODEL_ID} ({BG_REMOVAL.LICENSE_TAG}) · Updated{" "}
                {published}. remove.bg / Canva names used for factual news
                context only.
              </p>
            </footer>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}

function BgFlowchart() {
  const nodes = [
    "Upload image",
    "Validate + EXIF\n(≤2560 long side)",
    "Web Worker",
    "Cache → BiRefNet_lite\nWebGPU / WASM @ 512²",
    "Coarse soft α",
    "Crop subject +\n2nd inference (detail)",
    "Guided refine +\ndecontaminate",
    "RGBA PNG download",
  ];

  return (
    <div className="min-w-[280px] font-sans text-white">
      <p className="mb-4 text-center text-[11px] font-bold uppercase tracking-[0.14em] text-white/45">
        Mode A · on-device · {BG_REMOVAL.PIPELINE_VERSION}
      </p>
      <div className="mx-auto grid max-w-3xl gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {nodes.map((label, i) => (
          <div key={label} className="relative flex flex-col">
            <div className="flex min-h-[72px] flex-1 items-center justify-center rounded-xl border border-white/20 bg-white/10 px-3 py-3 text-center text-[12px] font-bold leading-snug whitespace-pre-line">
              <span className="mr-1.5 text-coral">{i + 1}.</span>
              {label}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-5 text-center text-[11px] font-medium text-white/40">
        No Mentr upload · weights cached · soft alpha preserved · MIT weights
      </p>
    </div>
  );
}
