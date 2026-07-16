import { TestimonialAvatar } from "@/components/ui/testimonial-avatar";
import { HOME_TESTIMONIALS, testimonialName } from "@/lib/demo-users";

export function Testimonials() {
  return (
    <section id="testimonials" className="bg-cream-band py-10 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-coral">
              Loved by parents & faculty
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-[40px]">
              Both sides.{" "}
              <span className="text-coral">Same free platform.</span>
            </h2>
          </div>
          <p className="max-w-md text-base text-muted lg:text-right">
            Parents search or post requirements. Faculty get contacted and pitch.
            Zero platform fees.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {HOME_TESTIMONIALS.map((item, i) => (
            <article
              key={i}
              className={`flex flex-col rounded-lg border border-hairline p-6 sm:p-7 ${item.tint}`}
            >
              <p className="flex-1 text-base leading-relaxed text-ink sm:text-lg">
                &ldquo;{item.quote}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3 border-t border-hairline/80 pt-5">
                <TestimonialAvatar name={item.name} className="h-11 w-11" />
                <div>
                  <p className="font-semibold text-ink">
                    {testimonialName(item.name)}
                  </p>
                  <p className="text-sm text-muted">{item.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
