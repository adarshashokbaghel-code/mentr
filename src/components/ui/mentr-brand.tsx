import { MentrLogo } from "@/components/ui/mentr-logo";
import { PaprlyWordmark } from "@/components/ui/paprly-wordmark";
import { cn } from "@/lib/utils";
import Link from "next/link";

/**
 * Mentr wordmark with Paprly attribution on the right — parent brand lockup.
 */
export function MentrBrand({
  className,
  logoClassName,
  variant = "dark",
  priority = false,
  href = "/",
}: {
  className?: string;
  logoClassName?: string;
  variant?: "dark" | "light";
  priority?: boolean;
  href?: string;
}) {
  const isLight = variant === "light";

  return (
    <span
      className={cn(
        "inline-flex min-w-0 max-w-full items-center gap-2 sm:gap-3",
        className,
      )}
    >
      <Link href={href} className="inline-flex shrink-0">
        <MentrLogo
          className={logoClassName}
          variant={variant}
          priority={priority}
        />
      </Link>

      <span
        className={cn(
          "inline-flex items-center gap-1.5 border-l pl-2.5 sm:pl-3",
          isLight ? "border-[var(--paprly-blue-accent)]/30" : "border-hairline",
        )}
      >
        <span
          className={cn(
            "paprly-by",
            isLight && "paprly-by-light",
          )}
        >
          by
        </span>
        <PaprlyWordmark variant={variant} />
      </span>
    </span>
  );
}
