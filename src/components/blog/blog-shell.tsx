import { cn } from "@/lib/utils";
import { BlogSidebar } from "./blog-sidebar";

type Props = {
  children: React.ReactNode;
  activePillar?: string;
  hideSidebar?: boolean;
  variant?: "index" | "article";
};

export function BlogShell({
  children,
  activePillar,
  hideSidebar,
  variant = "index",
}: Props) {
  if (variant === "article") {
    return (
      <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="mx-auto w-full max-w-3xl">{children}</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div
          className={cn(
            hideSidebar
              ? "w-full"
              : "grid gap-8 xl:grid-cols-[minmax(0,1fr)_260px] xl:gap-10",
          )}
        >
          <div className="min-w-0">{children}</div>
          {!hideSidebar && (
            <BlogSidebar
              activePillar={activePillar}
              className="hidden xl:sticky xl:top-24 xl:block xl:self-start"
            />
          )}
        </div>
      </div>
    </div>
  );
}
