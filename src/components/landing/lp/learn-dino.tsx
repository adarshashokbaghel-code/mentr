import { LEARN_DINO_SRC } from "@/lib/learn-assets";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function LearnDino({
  size = 40,
  className,
  priority = false,
}: {
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={LEARN_DINO_SRC}
      alt=""
      width={size}
      height={size}
      className={cn("bg-transparent object-contain", className)}
      priority={priority}
      unoptimized
    />
  );
}
