import { cn } from "@/lib/utils";
import { GraduationCap, Sparkles } from "lucide-react";

/** Theme-aligned tint pairs for deterministic profile placeholders. */
export const PROFILE_PLACEHOLDER_TINTS = [
  {
    from: "#fff1e4",
    to: "#fff3a3",
    icon: "#ff9a4d",
    label: "coral",
  },
  {
    from: "#e6f6ee",
    to: "#fffaf5",
    icon: "#2f9e6e",
    label: "sage",
  },
  {
    from: "#ebe4ff",
    to: "#f7f0e8",
    icon: "#6b756e",
    label: "lavender",
  },
  {
    from: "#dff3ff",
    to: "#fff1e4",
    icon: "#ef7a28",
    label: "sky",
  },
] as const;

export function profilePlaceholderTintIndex(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h + seed.charCodeAt(i) * (i + 1)) % PROFILE_PLACEHOLDER_TINTS.length;
  }
  return h;
}

export function profilePlaceholderTint(seed: string) {
  return PROFILE_PLACEHOLDER_TINTS[profilePlaceholderTintIndex(seed)];
}

const SIZE_CLASSES = {
  xs: { box: "h-8 w-8", icon: "h-3.5 w-3.5", text: "text-[10px]" },
  sm: { box: "h-11 w-11", icon: "h-4 w-4", text: "text-xs" },
  md: { box: "h-16 w-16", icon: "h-5 w-5", text: "text-sm" },
  lg: { box: "h-[72px] w-[72px]", icon: "h-6 w-6", text: "text-base" },
  xl: { box: "h-28 w-28 sm:h-36 sm:w-36", icon: "h-9 w-9 sm:h-10 sm:w-10", text: "text-lg" },
  fill: { box: "absolute inset-0", icon: "h-10 w-10 sm:h-12 sm:w-12", text: "text-xl" },
} as const;

export type ProfilePlaceholderSize = keyof typeof SIZE_CLASSES;

type ProfilePlaceholderProps = {
  /** Used to pick tint and as aria-label fallback */
  name?: string;
  initials?: string;
  kind?: "tutor" | "mentor";
  size?: ProfilePlaceholderSize;
  showInitials?: boolean;
  rounded?: "md" | "lg" | "xl" | "2xl";
  className?: string;
};

/** Themed avatar placeholder — no photos until profile images are enabled. */
export function ProfilePlaceholder({
  name = "",
  initials,
  kind = "tutor",
  size = "md",
  showInitials = true,
  rounded = "lg",
  className,
}: ProfilePlaceholderProps) {
  const seed = name || initials || "mentr";
  const tint = profilePlaceholderTint(seed);
  const sizes = SIZE_CLASSES[size];
  const Icon = kind === "mentor" ? Sparkles : GraduationCap;
  const letters = initials?.slice(0, 2).toUpperCase();

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden border border-hairline/80",
        rounded === "md" && "rounded-md",
        rounded === "lg" && "rounded-lg",
        rounded === "xl" && "rounded-xl",
        rounded === "2xl" && "rounded-2xl",
        sizes.box,
        className,
      )}
      style={{
        background: `linear-gradient(145deg, ${tint.from} 0%, ${tint.to} 100%)`,
      }}
      aria-hidden={!name}
      aria-label={name ? `${name} profile placeholder` : undefined}
    >
      <Icon
        className={cn(sizes.icon, "opacity-90")}
        style={{ color: tint.icon }}
        strokeWidth={2.25}
      />
      {showInitials && letters && size !== "xs" && (
        <span
          className={cn(
            "absolute bottom-0.5 right-0.5 rounded bg-white/90 px-1 font-bold leading-none text-ink/70 shadow-sm",
            sizes.text,
          )}
        >
          {letters}
        </span>
      )}
    </div>
  );
}

/** Inline HTML for Leaflet map popups (no React in popup strings). */
export function profilePlaceholderMapHtml(teacher: {
  name: string;
  initials: string;
  kind?: "tutor" | "mentor";
}) {
  const tint = profilePlaceholderTint(teacher.name || teacher.initials);
  const initials = escapeHtml(teacher.initials.slice(0, 2).toUpperCase());
  const iconPath =
    teacher.kind === "mentor"
      ? `<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>`
      : `<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12v5c0 1.7 1.3 3 3 3h6c1.7 0 3-1.3 3-3v-5"/>`;

  return `<div class="champs-pop-hero-img champs-pop-hero-placeholder" style="background:linear-gradient(145deg,${tint.from},${tint.to})">
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="${tint.icon}" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round">${iconPath}</svg>
    <span class="champs-pop-placeholder-initials">${initials}</span>
  </div>`;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
