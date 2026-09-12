import {
  LEARN_DINO_ACTIONS,
  LEARN_DINO_SRC,
  type LearnDinoAction,
} from "@/lib/learn-assets";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function LearnDino({
  size = 40,
  className,
  priority = false,
  action = "still",
}: {
  size?: number;
  className?: string;
  priority?: boolean;
  action?: LearnDinoAction;
}) {
  return (
    <Image
      src={LEARN_DINO_SRC}
      alt=""
      width={size}
      height={size}
      className={cn(
        "bg-transparent object-contain",
        LEARN_DINO_ACTIONS[action],
        className,
      )}
      priority={priority}
      unoptimized
    />
  );
}
