import { BadgeCheck, Globe, Handshake, ShieldCheck } from "lucide-react";

const points = [
  {
    icon: ShieldCheck,
    title: "We verify every teacher",
    body: "Phone and identity checked before a profile goes live — so parents aren't messaging strangers from a raw directory.",
  },
  {
    icon: BadgeCheck,
    title: "Verified badge on profiles",
    body: "Look for the Verified mark on listings. It's a light but clear signal that this faculty cleared our checks.",
  },
  {
    icon: Globe,
    title: "Local or online — worldwide",
    body: `Find tutors near you or connect online from any country — availability shows in your time zone.`,
  },
  {
    icon: Handshake,
    title: "You arrange everything",
    body: "Search a tutor or post your requirement and review pitches — timing, fees, and location stay between you and the teacher. Mentr connects you, then steps back.",
  },
];

export function TrustSafety() {
  return (
    <section id="trust" className="border-y border-hairline bg-white py-10 sm:py-16">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 text-center lg:flex-row lg:items-end lg:justify-between lg:text-left">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <p className="text-sm font-semibold text-sage">Trust & safety</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl lg:text-[40px]">
              Handing your child to a tutor{" "}
              <span className="text-coral">shouldn&apos;t feel risky.</span>
            </h2>
          </div>
          <p className="mx-auto max-w-md text-base text-muted lg:mx-0 lg:text-right">
            We verify every teacher&apos;s phone and identity.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {points.map((p) => (
            <div
              key={p.title}
              className="rounded-lg border border-hairline bg-cream p-5 sm:p-6"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-sage-wash text-sage">
                <p.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-ink">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
