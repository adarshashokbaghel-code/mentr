import Image from "next/image";
import { cn } from "@/lib/utils";

const RATIO = { width: 1169, height: 304 };

/**
 * The Mentr wordmark (transparent PNG). Size it with a height class,
 * e.g. `className="h-7"` — width follows automatically.
 * Use `variant="light"` on dark backgrounds.
 */
export function MentrLogo({
  className,
  variant = "dark",
  priority = false,
}: {
  className?: string;
  variant?: "dark" | "light";
  priority?: boolean;
}) {
  return (
    <Image
      src={variant === "light" ? "/mentr-logo-light.png" : "/mentr-logo.png"}
      alt="Mentr by Paprly"
      width={RATIO.width}
      height={RATIO.height}
      priority={priority}
      className={cn("h-7 w-auto select-none", className)}
    />
  );
}
