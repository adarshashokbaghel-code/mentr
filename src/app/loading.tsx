import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading page"
      className="min-h-screen bg-cream"
    >
      {/* Top navigation skeleton */}
      <header className="border-b border-hairline bg-cream/90 backdrop-blur-xs">
        <div className="mx-auto flex h-14 w-full max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            {/* Logo placeholder */}
            <Skeleton className="h-6 w-24 rounded-md" />
            <Skeleton className="hidden h-4 w-12 rounded-sm sm:inline-block" />
          </div>

          {/* Navigation link placeholders */}
          <div className="hidden items-center gap-6 md:flex">
            <Skeleton className="h-4 w-20 rounded-md" />
            <Skeleton className="h-4 w-24 rounded-md" />
            <Skeleton className="h-4 w-16 rounded-md" />
            <Skeleton className="h-4 w-28 rounded-md" />
          </div>

          {/* Right action button placeholder */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-20 rounded-lg" />
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
        </div>
      </header>

      {/* Main page skeleton mirroring Mentr landing page layout */}
      <main className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Hero section */}
        <div className="flex flex-col items-center text-center">
          {/* Tagline badge */}
          <Skeleton className="h-7 w-48 rounded-full" />

          {/* Big Hero Title */}
          <Skeleton className="mt-4 h-10 w-full max-w-xl rounded-xl sm:h-12" />
          <Skeleton className="mt-2.5 h-6 w-full max-w-md rounded-lg" />

          {/* Hero search bar input lockup */}
          <div className="mt-8 flex w-full max-w-2xl items-center gap-2 rounded-2xl border border-hairline bg-white/80 p-2 shadow-xs">
            <Skeleton className="h-10 flex-1 rounded-lg" />
            <Skeleton className="hidden h-10 w-36 rounded-lg sm:block" />
            <Skeleton className="h-10 w-28 rounded-lg" />
          </div>

          {/* 4 Stats band pills (Verified tutors, Platform fee, 2 ways to connect, Global) */}
          <div className="mt-8 grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex flex-col items-center rounded-xl border border-hairline bg-white/60 p-3 shadow-xs"
              >
                <Skeleton className="h-6 w-14 rounded-md" />
                <Skeleton className="mt-1.5 h-3 w-20 rounded-sm" />
              </div>
            ))}
          </div>
        </div>

        {/* Content cards section */}
        <div className="mt-14">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-40 rounded-md" />
            <Skeleton className="h-4 w-24 rounded-md" />
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-hairline bg-white/80 p-5 shadow-xs"
              >
                <div className="flex items-center gap-3.5">
                  <Skeleton className="h-12 w-12 shrink-0 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4 rounded-md" />
                    <Skeleton className="h-3 w-1/2 rounded-md" />
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <Skeleton className="h-3.5 w-full rounded-md" />
                  <Skeleton className="h-3.5 w-4/5 rounded-md" />
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-hairline pt-3.5">
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-8 w-24 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
