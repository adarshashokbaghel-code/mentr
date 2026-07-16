import type { ArticleBlock, ArticleSection } from "@/lib/blog-content/types";
import { hardShadowSm } from "@/components/landing/lp/shared";
import { cn } from "@/lib/utils";
import Link from "next/link";

function Block({ block }: { block: ArticleBlock }) {
  if (block.type === "paragraph") {
    return <p>{block.text}</p>;
  }
  if (block.type === "list") {
    const Tag = block.ordered ? "ol" : "ul";
    return (
      <Tag className={block.ordered ? "list-decimal" : "list-disc"}>
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </Tag>
    );
  }
  return (
    <aside className="blog-callout">
      <p className="blog-callout-title">{block.title}</p>
      <p className="mt-1">{block.text}</p>
    </aside>
  );
}

export function ArticleProse({
  intro,
  sections,
}: {
  intro: string;
  sections: ArticleSection[];
}) {
  return (
    <div className="blog-prose">
      <p className="blog-lead">{intro}</p>
      {sections.map((section) => (
        <section key={section.heading}>
          <h2>{section.heading}</h2>
          {section.blocks.map((block, i) => (
            <Block key={`${section.heading}-${i}`} block={block} />
          ))}
        </section>
      ))}
    </div>
  );
}

export function ArticleFaqSection({
  faqs,
}: {
  faqs: { question: string; answer: string }[];
}) {
  return (
    <section className="mt-10 border-t-2 border-ink/10 pt-8 sm:mt-12 sm:pt-10">
      <h2 className="text-lg font-bold text-ink sm:text-xl">Common questions</h2>
      <dl className="mt-5 space-y-5 sm:mt-6 sm:space-y-6">
        {faqs.map((faq) => (
          <div key={faq.question}>
            <dt className="text-[15px] font-semibold leading-snug text-ink sm:text-base">
              {faq.question}
            </dt>
            <dd className="mt-2 text-sm leading-relaxed text-muted sm:text-[15px]">
              {faq.answer}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function ArticleCta({
  label,
  href,
  text,
}: {
  label: string;
  href: string;
  text: string;
}) {
  return (
    <aside
      className={cn(
        "my-8 rounded-2xl border-2 border-ink bg-cream-band px-4 py-4 sm:my-10 sm:px-6 sm:py-5",
        hardShadowSm,
      )}
    >
      <p className="text-sm leading-relaxed text-ink sm:text-[15px]">{text}</p>
      <Link
        href={href}
        className={cn(
          "mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-xl border-2 border-ink bg-coral px-5 text-sm font-bold text-white touch-manipulation active:scale-[0.98] hover:bg-coral-dark sm:w-auto",
          hardShadowSm,
        )}
      >
        {label} →
      </Link>
    </aside>
  );
}

export function ArticleBreadcrumb({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  const last = items[items.length - 1];

  return (
    <nav aria-label="Breadcrumb" className="mb-5 text-sm text-muted sm:mb-6">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
        {items.slice(0, -1).map((item, i) => (
          <li key={item.label} className="flex shrink-0 items-center gap-1.5">
            {i > 0 && <span aria-hidden className="text-hairline">/</span>}
            {item.href ? (
              <Link
                href={item.href}
                className="inline-flex min-h-11 items-center font-medium touch-manipulation hover:text-coral active:text-coral"
              >
                {item.label}
              </Link>
            ) : (
              <span>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
      {last && !last.href && (
        <p className="mt-2 line-clamp-2 text-xs font-medium text-ink/70 sm:line-clamp-none sm:text-sm">
          {last.label}
        </p>
      )}
    </nav>
  );
}
