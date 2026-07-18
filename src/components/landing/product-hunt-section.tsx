import { ProductHuntBadges } from "@/components/ui/product-hunt-badge";

export function ProductHuntSection() {
  return (
    <section className="border-y border-hairline bg-white py-10 sm:py-12">
      <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-5 px-4 text-center sm:px-6 lg:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-coral">
            Product Hunt
          </p>
          <h2 className="mt-2 text-lg font-bold text-ink sm:text-xl">
            Find us on Product Hunt
          </h2>
          <p className="mt-1.5 max-w-md text-sm text-muted">
            Upvote Mentr or leave a review — it helps more parents and tutors
            discover a free way to connect.
          </p>
        </div>
        <ProductHuntBadges compact className="justify-center" />
      </div>
    </section>
  );
}
