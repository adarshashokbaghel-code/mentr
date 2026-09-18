import { LEARN_PUBLIC } from "@/lib/learn-flags";
import { SITE_BRAND } from "@/lib/seo";
import {
  BookOpen,
  ClipboardList,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import Link from "next/link";

/**
 * Public content layer for the homepage — answers visitor questions
 * with complete paragraphs (AdSense / first-visit readiness), not keyword filler.
 */
export function PublicPlatformSections() {
  return (
    <section
      id="what-is-mentr"
      className="border-y border-hairline bg-white py-12 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold text-coral">What is Mentr?</p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink sm:text-3xl lg:text-[40px]">
            A free education platform — tutors, tools, and learning in one place
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
            {SITE_BRAND} helps parents and students find verified tutors and
            mentors nearby or online, without platform fees or commission. The
            same site also offers free classroom tools and, where available,
            structured learning paths — so you can discover help, prepare
            materials, and learn without signing up just to read public guides.
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <article>
            <div className="flex items-center gap-2 text-coral">
              <ShieldCheck className="h-5 w-5" />
              <h3 className="text-lg font-bold text-ink">
                Find verified tutors &amp; mentors
              </h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
              Looking for a Class 8 Maths tutor or a coding mentor? Browse
              verified profiles by subject, class, and teaching mode — in-person
              nearby or online across time zones. You send a connect request;
              WhatsApp contact unlocks only after the tutor accepts, so numbers
              stay private until both sides agree.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
              Verification means we check identity before a profile goes live.
              That does not guarantee teaching quality — you still review
              subjects, experience, and fit — but it reduces anonymous spam
              listings.
            </p>
            <Link
              href="/search"
              className="mt-4 inline-block text-sm font-semibold text-coral hover:underline"
            >
              Browse tutors →
            </Link>
          </article>

          <article>
            <div className="flex items-center gap-2 text-coral">
              <ClipboardList className="h-5 w-5" />
              <h3 className="text-lg font-bold text-ink">Requirements board</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
              Prefer tutors to come to you? Parents can post what they need —
              subject, class, area, and timing — and verified tutors pitch with
              why they fit. You review pitches and accept who to talk to.
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold">
              <Link href="/how-it-works" className="text-coral hover:underline">
                How connecting works →
              </Link>
            </div>
          </article>

          <article>
            <div className="flex items-center gap-2 text-coral">
              <Wrench className="h-5 w-5" />
              <h3 className="text-lg font-bold text-ink">Mentr Tools</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
              Teachers and tutors can generate worksheets, sample question
              papers, answer keys, and lesson plans. Students get study
              timetables and calculators. PDF merge and compress run in your
              browser so school documents stay on your device. Each tool page
              explains when to use it and how the output works — not just a
              blank form.
            </p>
            <Link
              href="/tools"
              className="mt-4 inline-block text-sm font-semibold text-coral hover:underline"
            >
              Open free tools →
            </Link>
          </article>

          {LEARN_PUBLIC ? (
            <article>
              <div className="flex items-center gap-2 text-coral">
                <GraduationCap className="h-5 w-5" />
                <h3 className="text-lg font-bold text-ink">Mentr Learn</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                Mentr Learn is a free path for Class 3–5 covering computer
                science ideas and age-appropriate AI literacy. Public pages
                describe the syllabus and goals before you enroll, so parents
                can decide if it fits without creating an account first.
              </p>
              <Link
                href="/learn"
                className="mt-4 inline-block text-sm font-semibold text-coral hover:underline"
              >
                Explore Mentr Learn →
              </Link>
            </article>
          ) : (
            <article>
              <div className="flex items-center gap-2 text-coral">
                <BookOpen className="h-5 w-5" />
                <h3 className="text-lg font-bold text-ink">
                  Educational resources
                </h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                Our blog publishes original guides for parents (how to hire a
                tutor, fee benchmarks), students (study plans, exam prep), and
                tutors (profiles, worksheets, responsible AI). Guides link to
                related tools and search when that helps you act on the advice.
              </p>
              <Link
                href="/blog"
                className="mt-4 inline-block text-sm font-semibold text-coral hover:underline"
              >
                Read guides →
              </Link>
            </article>
          )}
        </div>

        <div className="mt-12 grid gap-8 border-t border-hairline pt-12 sm:grid-cols-3">
          <div>
            <h3 className="flex items-center gap-2 text-base font-bold text-ink">
              <Sparkles className="h-4 w-4 text-coral" />
              For parents
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Search verified tutors, post a requirement, or use Instant
              Connect. You never pay Mentr to unlock a number or send a request.
            </p>
          </div>
          <div>
            <h3 className="text-base font-bold text-ink">For students</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Use free study tools and guides. When you need a person, find a
              tutor or mentor online or nearby through the same directory.
            </p>
          </div>
          <div>
            <h3 className="text-base font-bold text-ink">For tutors &amp; mentors</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              List for free, respond to connect requests, and keep 100% of
              tuition fees. No lead coins. Classroom tools are free without a
              paid plan.
            </p>
            <Link
              href="/for-faculty"
              className="mt-2 inline-block text-sm font-semibold text-coral hover:underline"
            >
              Become a tutor →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
