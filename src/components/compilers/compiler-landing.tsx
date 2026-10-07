import { getBlogPost } from "@/lib/blog-posts";
import type { CompilerDef } from "@/lib/compilers";
import { ArrowRight, ArrowUp, Check, Cpu, FileCode2, X } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

function Block({ id, kicker, title, children }: { id?: string; kicker: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-6 border-t border-hairline pt-10">
      <p className="font-mono text-[11.5px] uppercase tracking-[0.16em] text-coral">{kicker}</p>
      <h2 className="mt-1.5 text-[24px] font-extrabold leading-tight tracking-tight sm:text-[28px]">{title}</h2>
      <div className="mt-4 space-y-4 text-[16px] leading-[1.75] text-ink/85">{children}</div>
    </section>
  );
}

const toTop = "#compiler";

/** Crawlable explainer under a full-screen compiler: features, how-to, FAQ and links. */
export function CompilerLanding({ def }: { def: CompilerDef }) {
  const { landing } = def;
  const guides = def.blogSlugs.map((s) => getBlogPost(s)).filter((p) => p !== undefined);

  return (
    <div className="bg-cream text-ink">
      <article id="about" className="mx-auto w-full max-w-[920px] scroll-mt-0 px-4 pb-20 pt-12 sm:px-6">
        <header>
          <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-coral">About this {def.language} compiler</p>
          <h2 className="mt-2 text-[30px] font-extrabold leading-[1.12] tracking-tight sm:text-[40px]">{landing.heading}</h2>
          <div className="mt-4 space-y-3 text-[17px] leading-relaxed text-muted">
            {landing.intro.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={toTop} className="inline-flex items-center gap-2 bg-[#2f9e6e] px-5 py-3 text-[15px] font-bold text-white transition hover:bg-[#278a5f]">
              <ArrowUp className="h-4 w-4" /> Open the compiler
            </a>
            <Link href={def.howItWorksPath} className="inline-flex items-center gap-2 border border-ink px-5 py-3 text-[15px] font-bold transition hover:bg-white">
              How we built it <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </header>

        <dl className="mt-10 grid grid-cols-2 gap-px border border-hairline bg-hairline md:grid-cols-4">
          {landing.facts.map(([value, label]) => (
            <div key={label} className="bg-white px-5 py-5">
              <dt className="sr-only">{label}</dt>
              <dd>
                <p className="text-[22px] font-extrabold leading-none sm:text-[26px]">{value}</p>
                <p className="mt-1.5 text-[13px] leading-snug text-muted">{label}</p>
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-12 space-y-12">
          <Block id="features" kicker="Features" title={`Everything you need to practise ${def.language}`}>
            <ul className="grid gap-px border border-hairline bg-hairline sm:grid-cols-2">
              {landing.features.map((f) => (
                <li key={f.title} className="bg-white px-5 py-4">
                  <p className="flex items-center gap-2 text-[15.5px] font-bold">
                    <Check className="h-4 w-4 shrink-0 text-[#2f9e6e]" /> {f.title}
                  </p>
                  <p className="mt-1 text-[14.5px] leading-relaxed text-muted">{f.text}</p>
                </li>
              ))}
            </ul>
          </Block>

          <Block id="how-to" kicker="How to use" title={`How to run ${def.language} code online`}>
            <ol className="border border-hairline bg-white">
              {landing.howTo.map((s, i) => (
                <li key={s.name} className="flex gap-3 border-b border-hairline px-4 py-3.5 last:border-b-0">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-ink font-mono text-[11px] font-bold text-white">{i + 1}</span>
                  <p className="min-w-0 text-[15px] leading-snug">
                    <b>{s.name}.</b> {s.text}
                  </p>
                </li>
              ))}
            </ol>
          </Block>

          {landing.sections.map((s) => (
            <Block key={s.id} id={s.id} kicker={s.kicker} title={s.heading}>
              {s.paragraphs.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
              {s.bullets && (
                <ul className="list-disc space-y-1 pl-5">
                  {s.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
            </Block>
          ))}

          <Block id="examples" kicker="Examples" title={`${def.language} examples to run right now`}>
            <p>These are in the Examples menu at the top of the compiler. Pick one and press Run.</p>
            <div className="grid gap-4">
              {landing.examples.map((e) => (
                <figure key={e.title} className="overflow-hidden border border-[#2a332d] bg-[#0f1411]">
                  <figcaption className="flex items-center gap-2 border-b border-white/10 px-4 py-2 font-mono text-[11px] text-white/50">
                    <FileCode2 className="h-3.5 w-3.5" /> {e.title}
                  </figcaption>
                  <pre className="overflow-x-auto px-4 py-3 font-mono text-[13px] leading-[1.7] text-[#e8ece9]">{e.code}</pre>
                </figure>
              ))}
            </div>
          </Block>

          <section className="border border-[#2a332d] bg-[#0f1612] px-6 py-7 text-white sm:px-8">
            <p className="flex items-center gap-2 font-mono text-[11.5px] uppercase tracking-[0.16em] text-[#5ee0a0]">
              <Cpu className="h-4 w-4" /> Engineering
            </p>
            <h2 className="mt-2 text-[24px] font-extrabold leading-tight sm:text-[28px]">How this {def.language} compiler runs in your browser</h2>
            <p className="mt-3 text-[15.5px] leading-relaxed text-white/70">
              {def.runtime.engine}, a background Web Worker, and a shared-memory trick that lets input() pause. We wrote up the whole
              architecture, step by step, with diagrams and the real numbers.
            </p>
            <Link
              href={def.howItWorksPath}
              className="mt-5 inline-flex items-center gap-2 bg-[#2f9e6e] px-5 py-3 text-[15px] font-bold text-white transition hover:bg-[#278a5f]"
            >
              Read how we built it <ArrowRight className="h-4 w-4" />
            </Link>
          </section>

          <Block id="limits" kicker="Honest limits" title="What it can't do (yet)">
            <ul className="space-y-2">
              {landing.limits.map((l) => (
                <li key={l} className="flex gap-2.5">
                  <X className="mt-1.5 h-4 w-4 shrink-0 text-[#c2410c]" /> <span>{l}</span>
                </li>
              ))}
            </ul>
          </Block>

          {landing.learnCta && (
            <section className="border border-hairline bg-white px-6 py-7 sm:px-8">
              <h2 className="text-[22px] font-extrabold leading-tight sm:text-[26px]">{landing.learnCta.title}</h2>
              <p className="mt-2 text-[15.5px] leading-relaxed text-muted">{landing.learnCta.text}</p>
              <Link href={landing.learnCta.href} className="mt-5 inline-flex items-center gap-2 bg-ink px-5 py-3 text-[15px] font-bold text-white transition hover:bg-black">
                {landing.learnCta.label} <ArrowRight className="h-4 w-4" />
              </Link>
            </section>
          )}

          <Block id="faq" kicker="FAQ" title={`${def.name}: frequently asked questions`}>
            <div className="border border-hairline bg-white">
              {def.faqs.map((f, i) => (
                <details key={f.question} open={i < 2} className="group border-b border-hairline px-5 py-4 last:border-b-0">
                  <summary className="cursor-pointer list-none text-[16px] font-bold marker:hidden">
                    <span className="mr-2 inline-block text-[#2f9e6e] transition group-open:rotate-45">+</span>
                    {f.question}
                  </summary>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{f.answer}</p>
                </details>
              ))}
            </div>
          </Block>

          {guides.length > 0 && (
            <Block id="guides" kicker="Guides" title={`More on ${def.language} compilers`}>
              <ul className="grid gap-3 sm:grid-cols-2">
                {guides.map((g) => (
                  <li key={g.slug}>
                    <Link href={`/blog/${g.slug}`} className="block h-full border border-hairline bg-white px-5 py-4 transition hover:border-ink">
                      <p className="text-[15.5px] font-bold leading-snug">{g.title}</p>
                      <p className="mt-1 line-clamp-2 text-[13.5px] leading-snug text-muted">{g.description}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </Block>
          )}
        </div>
      </article>
    </div>
  );
}
