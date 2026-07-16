import { PARENT_COMPANY_URL } from "@/lib/seo";
import { cn } from "@/lib/utils";

/**
 * Paprly parent-company link — light yellow + sky blue (paprly.in).
 */
export function PaprlyWordmark({
  variant = "dark",
  className,
}: {
  variant?: "dark" | "light";
  className?: string;
}) {
  const isLight = variant === "light";

  return (
    <a
      href={PARENT_COMPANY_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "paprly-attribution group inline-flex items-center transition-opacity hover:opacity-85",
        className,
      )}
    >
      <span
        className={cn(
          "paprly-wordmark",
          isLight && "paprly-wordmark-light",
        )}
      >
        <span className="paprly-wordmark-papr">Papr</span>
        <span className="paprly-wordmark-ly">ly</span>
      </span>
    </a>
  );
}
