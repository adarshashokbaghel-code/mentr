import { cn } from "@/lib/utils";

interface BrowserFrameProps {
  url?: string;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
}

/** Youform-style app chrome around product mockups */
export function BrowserFrame({
  url = "mentr.in / search",
  children,
  className,
  headerClassName,
}: BrowserFrameProps) {
  return (
    <div
      className={cn(
        "min-w-0 w-full max-w-full overflow-hidden rounded-lg border border-hairline bg-white shadow-[0_12px_40px_rgba(28,26,23,0.12)]",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center gap-3 border-b border-hairline px-4 py-3",
          headerClassName || "bg-cream",
        )}
      >
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
        </div>
        <div className="min-w-0 flex-1 truncate rounded-lg bg-white/80 px-3 py-1.5 text-center font-mono text-[11px] text-muted sm:text-xs">
          {url}
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}
