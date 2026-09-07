import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { TIMELINE_LABELS } from "@/components/requirements/parent-requirements";
import { Button } from "@/components/ui/button";
import { fetchSharedRequirement, type SharedRequirement } from "@/lib/api";
import { MapPin, Megaphone, MonitorSmartphone } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

const MODE_LABELS: Record<string, string> = {
  online: "Online",
  student_home: "At student's home",
  tutor_home: "At tutor's place",
};

function budgetLabel(post: SharedRequirement): string | null {
  if (post.budgetMin == null && post.budgetMax == null) return null;
  const parts = [
    post.budgetMin != null ? `₹${post.budgetMin}` : null,
    post.budgetMax != null ? `₹${post.budgetMax}` : null,
  ].filter(Boolean);
  return `${parts.join("–")}/hr indicative`;
}

export default async function LookingPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  let post: SharedRequirement;
  try {
    post = await fetchSharedRequirement(token);
  } catch {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-16">
        <div className="mx-auto max-w-lg px-4 py-10 sm:py-14">
          <div className="rounded-xl border border-hairline bg-white p-6 shadow-sm sm:p-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-coral">
              Family referral · Mentr
            </p>
            <h1 className="mt-2 text-xl font-bold leading-snug text-ink sm:text-2xl">
              {post.headline}
            </h1>
            <p className="mt-2 text-sm text-muted">
              A parent in {post.city} posted this on Mentr — tutors pitch for
              free; WhatsApp unlocks only when they accept.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-cream px-2.5 py-1 text-xs font-semibold text-ink">
                <MapPin className="h-3.5 w-3.5" />
                {post.area}
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-cream px-2.5 py-1 text-xs font-semibold text-ink">
                <MonitorSmartphone className="h-3.5 w-3.5" />
                {post.modes.map((m) => MODE_LABELS[m] ?? m).join(" · ")}
              </span>
              {budgetLabel(post) && (
                <span className="rounded-md bg-sage-wash px-2.5 py-1 text-xs font-bold text-sage">
                  {budgetLabel(post)}
                </span>
              )}
            </div>

            <p className="mt-4 rounded-lg bg-cream px-4 py-3 text-sm leading-relaxed text-ink/85">
              {post.details}
            </p>

            <p className="mt-3 text-xs text-muted">
              {TIMELINE_LABELS[post.startTimeline]} ·{" "}
              {post.interestCount > 0
                ? `${post.interestCount} tutor${post.interestCount === 1 ? "" : "s"} already interested`
                : "Be among the first tutors to pitch"}
            </p>

            <div className="mt-6 space-y-2">
              <Link href="/board" className="block">
                <Button className="h-11 w-full gap-2">
                  <Megaphone className="h-4 w-4" />
                  I&apos;m a tutor — view the board
                </Button>
              </Link>
              <Link href="/parent" className="block">
                <Button variant="secondary" className="h-11 w-full">
                  I&apos;m a parent — post a similar need
                </Button>
              </Link>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-muted">
            Mentr connects parents and verified tutors in Bengaluru — no platform
            fee on tuition.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
