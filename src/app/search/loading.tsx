import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { Skeleton } from "@/components/ui/skeleton";

export function SearchGridSkeleton() {
  return (
    <div className="flex w-full flex-col gap-2.5 sm:gap-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="w-full overflow-hidden rounded-xl border border-hairline bg-white p-3 sm:p-3.5 lg:p-4"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Skeleton className="h-[72px] w-[72px] shrink-0 rounded-xl sm:h-[88px] sm:w-[88px]" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-5 w-44" />
              <div className="flex gap-1.5">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-14 rounded-full" />
              </div>
              <Skeleton className="h-3.5 w-4/5 max-w-lg" />
              <Skeleton className="h-3 w-3/5 max-w-md" />
              <div className="flex gap-1.5">
                <Skeleton className="h-5 w-24 rounded-md" />
                <Skeleton className="h-5 w-28 rounded-md" />
                <Skeleton className="h-5 w-20 rounded-md" />
              </div>
            </div>
            <div className="hidden w-[148px] shrink-0 flex-col items-end gap-2 border-l border-hairline pl-4 sm:flex">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-9 w-full rounded-lg" />
              <Skeleton className="h-8 w-full rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SearchLoading() {
  return (
    <>
      <Navbar />
      <main
        role="status"
        aria-label="Loading search results"
        className="min-h-screen pb-24 bg-cream"
      >
        {/* Search header skeleton */}
        <div className="border-b border-hairline bg-white/70 backdrop-blur-xs">
          <div className="mx-auto max-w-[1400px] px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {/* Search bar input placeholder */}
              <Skeleton className="h-11 w-full max-w-md rounded-lg" />
              {/* Mode / Kind switch placeholders */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-24 rounded-lg" />
                <Skeleton className="h-9 w-24 rounded-lg" />
              </div>
            </div>

            {/* Filter pills skeleton */}
            <div className="mt-3 flex items-center gap-2 overflow-hidden">
              <Skeleton className="h-8 w-20 shrink-0 rounded-full" />
              <Skeleton className="h-8 w-28 shrink-0 rounded-full" />
              <Skeleton className="h-8 w-24 shrink-0 rounded-full" />
              <Skeleton className="h-8 w-32 shrink-0 rounded-full" />
              <Skeleton className="h-8 w-20 shrink-0 rounded-full" />
            </div>
          </div>
        </div>

        {/* Tutor cards grid skeleton */}
        <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
          <SearchGridSkeleton />
        </div>
      </main>
      <Footer />
    </>
  );
}
