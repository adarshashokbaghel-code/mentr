import { profilePlaceholderTint } from "@/components/ui/profile-placeholder";
import { testimonialInitial } from "@/lib/demo-users";
import { cn } from "@/lib/utils";
import { UserRound } from "lucide-react";

/** Themed letter avatar for testimonials — no photos until real headshots exist. */
export function TestimonialAvatar({
  name,
  className,
}: {
  name?: string | null;
  className?: string;
}) {
  const seed = name || "mentr";
  const tint = profilePlaceholderTint(seed);
  const initial = testimonialInitial(name);

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-md border border-hairline/80 shadow-sm",
        className,
      )}
      style={{
        background: `linear-gradient(145deg, ${tint.from} 0%, ${tint.to} 100%)`,
      }}
      aria-hidden
    >
      <UserRound
        className="h-[42%] w-[42%] opacity-35"
        style={{ color: tint.icon }}
        strokeWidth={2.25}
      />
      <span className="absolute bottom-0.5 right-0.5 rounded bg-white/90 px-1 text-[10px] font-bold leading-none text-ink/75">
        {initial}
      </span>
    </div>
  );
}
