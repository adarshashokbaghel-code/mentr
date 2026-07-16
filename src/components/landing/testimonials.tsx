const testimonials = [
  {
    quote:
      "I posted our maths requirement and got three pitches the same day. Picked one, connected on WhatsApp — no agent, no fees.",
    name: "Priya Sharma",
    role: "Parent · Online",
    initials: "PS",
    tint: "bg-lavender",
  },
  {
    quote:
      "I registered in minutes, listed my slots, and parents started messaging on WhatsApp. I update availability on the dashboard and keep every rupee.",
    name: "Dr. Aris Smith",
    role: "Faculty · Maths & Physics",
    initials: "AS",
    tint: "bg-butter",
  },
  {
    quote:
      "As a career mentor I don't want a platform taking a cut. Mentr lists me, parents reach out, and my dashboard stays simple.",
    name: "Prof. Meera Kapoor",
    role: "Mentor · Career Guidance",
    initials: "MK",
    tint: "bg-sage-wash",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="bg-cream-band py-16 sm:py-24">
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
          {testimonials.map((item) => (
            <article
              key={item.name}
              className={`flex flex-col rounded-lg border border-hairline p-6 sm:p-7 ${item.tint}`}
            >
              <p className="flex-1 text-base leading-relaxed text-ink sm:text-lg">
                &ldquo;{item.quote}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3 border-t border-hairline/80 pt-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-white text-sm font-bold shadow-sm">
                  {item.initials}
                </div>
                <div>
                  <p className="font-semibold text-ink">{item.name}</p>
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
