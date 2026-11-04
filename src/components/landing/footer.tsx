import { MentrBrand } from "@/components/ui/mentr-brand";
import { ProductHuntBadges } from "@/components/ui/product-hunt-badge";
import { getFooterColumns } from "@/lib/public-nav";
import { SEO_CITIES } from "@/lib/seo-programmatic";

export function Footer() {
  const columns = getFooterColumns();

  return (
    <footer className="border-t border-hairline bg-ink text-white">
      <div className="mx-auto max-w-[1400px] px-4 py-10 sm:py-14 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:gap-12 lg:grid-cols-[1.2fr_2fr] lg:gap-16">
          <div>
            <MentrBrand variant="light" logoClassName="h-8" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/65">
              Free tutor and mentor finder, classroom tools, and learning
              resources. Search locally or online, connect on WhatsApp after
              both sides accept — zero fees, zero commission.
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

        <nav
          aria-label="Tutors by city"
          className="mt-10 flex flex-wrap gap-x-4 gap-y-2 border-t border-white/10 pt-8"
        >
          {SEO_CITIES.map((city) => (
            <a
              key={city.slug}
              href={`/tutors/${city.slug}`}
              className="text-sm text-white/70 transition-colors hover:text-white"
            >
              Tutors in {city.name}
            </a>
          ))}
        </nav>

        <div className="mt-8 flex flex-col gap-2 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Mentr.
          </p>
          <p>Parents find teachers. Faculty get found. Free.</p>
        </div>
      </div>
    </footer>
  );
}
