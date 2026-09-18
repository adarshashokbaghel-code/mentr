import { MentrBrand } from "@/components/ui/mentr-brand";
import { PaprlyWordmark } from "@/components/ui/paprly-wordmark";
import { ProductHuntBadges } from "@/components/ui/product-hunt-badge";
import { getFooterColumns } from "@/lib/public-nav";
import {
  PARENT_COMPANY_NAME,
  PARENT_COMPANY_URL,
} from "@/lib/seo";

export function Footer() {
  const columns = getFooterColumns();

  return (
    <footer className="border-t border-hairline bg-ink text-white">
      <div className="mx-auto max-w-[1400px] px-4 py-10 sm:py-14 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:gap-12 lg:grid-cols-[1.2fr_2fr] lg:gap-16">
          <div>
            <MentrBrand variant="light" logoClassName="h-8" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/65">
              Free tutor &amp; mentor finder, classroom tools, and learning
              resources — a{" "}
              <PaprlyWordmark variant="light" className="align-middle" />{" "}
              product. Search locally or online, connect on WhatsApp after both
              sides accept — zero fees, zero commission.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-md bg-white/10 px-3 py-1.5 text-xs font-semibold text-butter">
                Worldwide
              </span>
              <span className="rounded-md bg-white/10 px-3 py-1.5 text-xs font-semibold text-butter">
                Verified tutors
              </span>
              <span className="rounded-md bg-white/10 px-3 py-1.5 text-xs font-semibold text-butter">
                Free tools
              </span>
              <span className="rounded-md bg-white/10 px-3 py-1.5 text-xs font-semibold text-butter">
                ₹0 forever
              </span>
            </div>
            <div className="mt-6">
              <ProductHuntBadges compact />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6">
            {Object.entries(columns).map(([title, links]) => (
              <div key={title}>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white/40">
                  {title}
                </h4>
                <ul className="mt-4 space-y-2.5">
                  {links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        {...(link.external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className="text-sm text-white/70 transition-colors hover:text-white"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-8 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()}{" "}
            <PaprlyWordmark variant="light" className="align-middle" />. Mentr
            is a {PARENT_COMPANY_NAME} product (
            <a
              href={PARENT_COMPANY_URL}
              className="text-white/60 underline-offset-2 hover:text-white hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              paprly.in
            </a>
            ).
          </p>
          <p>Parents find teachers. Faculty get found. Free.</p>
        </div>
      </div>
    </footer>
  );
}
