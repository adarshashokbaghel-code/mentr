import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { Skeleton } from "@/components/ui/skeleton";

export function SearchGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3.5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: 10 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-xl border border-hairline bg-white shadow-xs"
        >
          {/* Image placeholder */}
          <Skeleton className="aspect-[4/3] w-full" />

          {/* Card body */}
          <div className="p-3">
            <div className="flex items-center justify-between gap-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-8" />
            </div>
            <Skeleton className="mt-2 h-3 w-36" />

            {/* Badges / tags placeholder */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Skeleton className="h-5 w-14" />
              <Skeleton className="h-5 w-16" />
            </div>

            {/* Card bottom action */}
            <div className="mt-4 border-t border-hairline pt-3">
              <Skeleton className="h-8 w-full" />
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
