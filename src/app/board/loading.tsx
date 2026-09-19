import { Navbar } from "@/components/landing/navbar";
import { Skeleton } from "@/components/ui/skeleton";

export default function BoardLoading() {
  return (
    <>
      <Navbar />
      <main
        role="status"
        aria-label="Loading requirements board"
        className="min-h-screen pb-20 bg-cream"
      >
        <div className="mx-auto w-full max-w-[1400px] px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          <Skeleton className="h-14 rounded-lg border border-hairline bg-white" />
          <div className="mt-6 grid gap-6 2xl:grid-cols-[minmax(0,220px)_minmax(0,1fr)_minmax(0,260px)] xl:grid-cols-[minmax(0,1fr)_minmax(0,260px)]">
            <Skeleton className="hidden h-72 rounded-xl border border-hairline bg-white xl:block" />
            <Skeleton className="h-[520px] rounded-xl border border-hairline bg-white" />
            <Skeleton className="hidden h-72 rounded-xl border border-hairline bg-white lg:block" />
          </div>
        </div>
      </main>
    </>
  );
}
