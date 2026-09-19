import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { Button } from "@/components/ui/button";
import { hardShadowSm, LpGridBg } from "@/components/landing/lp/shared";
import { cn } from "@/lib/utils";
import { ArrowRight, Compass, HelpCircle, Home, Mail, Megaphone, Search } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
  description: "The page you are looking for does not exist or has been moved.",
  robots: {
    index: false,
    follow: false,
  },
};

const SUGGESTED_LINKS = [
  {
    title: "Find tutors & mentors",
    description: "Browse verified local and online educators worldwide with zero platform fee.",
    href: "/search",
    icon: Search,
    tint: "bg-sage-wash",
    iconColor: "text-sage",
  },
  {
    title: "Requirements board",
    description: "Check open student requests posted by parents or post your own need.",
    href: "/board",
    icon: Megaphone,
    tint: "bg-coral-wash",
    iconColor: "text-coral-dark",
  },
  {
    title: "Frequently asked questions",
    description: "Learn how connect requests, tutor verification, and free contacts work.",
    href: "/faq",
    icon: HelpCircle,
    tint: "bg-butter",
    iconColor: "text-ink",
  },
  {
    title: "Contact support",
    description: "Need help with your account or profile? Reach out to our support team.",
    href: "/contact",
    icon: Mail,
    tint: "bg-lavender",
    iconColor: "text-ink",
  },
];

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="relative flex min-h-[calc(100vh-4rem)] flex-col justify-center bg-cream px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <LpGridBg className="opacity-40" />

        <div className="relative mx-auto w-full max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-white/90 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-coral-dark shadow-xs backdrop-blur-sm">
            <Compass className="h-3.5 w-3.5" />
            404 · Page Not Found
          </span>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Lost your way in class?
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted sm:text-base">
            We couldn’t find the page you’re looking for. It may have been moved, renamed, or perhaps the link was mistyped.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link href="/">
              <Button size="lg" className={cn("gap-2", hardShadowSm)}>
                <Home className="h-4 w-4" />
                Back to home
              </Button>
            </Link>
            <Link href="/search">
              <Button
                variant="secondary"
                size="lg"
                className={cn("gap-2", hardShadowSm)}
              >
                <Search className="h-4 w-4" />
                Find tutors
              </Button>
            </Link>
          </div>
        </div>

        {/* Helpful navigation destinations */}
        <div className="relative mx-auto mt-12 w-full max-w-3xl">
          <div className="rounded-2xl border border-hairline bg-white/80 p-5 shadow-xs backdrop-blur-sm sm:p-6">
            <h2 className="text-center text-xs font-bold uppercase tracking-wider text-muted">
              Or try one of these destinations
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {SUGGESTED_LINKS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-start gap-3.5 rounded-xl border border-hairline bg-cream/70 p-3.5 text-left transition hover:-translate-y-0.5 hover:border-ink hover:bg-cream",
                      hardShadowSm,
                    )}
                  >
                    <span
                      className={cn(
                        "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-transform group-hover:scale-105",
                        item.tint,
                      )}
                    >
                      <Icon className={cn("h-5 w-5", item.iconColor)} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-sm font-bold text-ink group-hover:text-coral-dark">
                          {item.title}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-coral-dark" />
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
