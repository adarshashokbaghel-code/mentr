import { testimonialInitial } from "@/lib/demo-users";
import { cn } from "@/lib/utils";

/** Letter avatar for testimonials — no photos until we use real DB names. */
export function TestimonialAvatar({
  name,
  className,
}: {
  name?: string | null;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-md bg-white text-sm font-bold text-ink shadow-sm",
        className,
      )}
      aria-hidden
    >
      {testimonialInitial(name)}
    </div>
  );
}
