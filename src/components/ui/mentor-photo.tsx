"use client";

import { ProfilePlaceholder } from "@/components/ui/profile-placeholder";
import { cn } from "@/lib/utils";
import type { ProfilePlaceholderSize } from "@/components/ui/profile-placeholder";
import { useEffect, useState } from "react";

type MentorPhotoProps = {
  name?: string;
  initials?: string;
  kind?: "tutor" | "mentor";
  imageUrl?: string | null;
  size?: ProfilePlaceholderSize;
  showInitials?: boolean;
  rounded?: "md" | "lg" | "xl" | "2xl" | "full";
  className?: string;
  alt?: string;
};

const SIZE_BOX: Record<ProfilePlaceholderSize, string> = {
  xs: "h-8 w-8",
  sm: "h-11 w-11",
  md: "h-16 w-16",
  lg: "h-[72px] w-[72px]",
  xl: "h-28 w-28 sm:h-36 sm:w-36",
  fill: "absolute inset-0 h-full w-full",
};

const ROUND: Record<NonNullable<MentorPhotoProps["rounded"]>, string> = {
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  full: "rounded-full",
};

function cleanImageUrl(url?: string | null): string | null {
  if (typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed || trimmed === "null" || trimmed === "undefined") return null;
  return trimmed;
}

/** Real headshot when present; otherwise the themed placeholder. */
export function MentorPhoto({
  name = "",
  initials,
  kind = "tutor",
  imageUrl,
  size = "md",
  showInitials = true,
  rounded = "lg",
  className,
  alt,
}: MentorPhotoProps) {
  const src = cleanImageUrl(imageUrl);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (src && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt || name || "Mentor photo"}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className={cn(
          "shrink-0 bg-cream-band object-cover object-center",
          size !== "fill" && "ring-1 ring-ink/8",
          ROUND[rounded],
          SIZE_BOX[size],
          className,
        )}
      />
    );
  }

  return (
    <ProfilePlaceholder
      name={name}
      initials={initials}
      kind={kind}
      size={size}
      showInitials={showInitials}
      rounded={rounded === "full" ? "2xl" : rounded}
      className={cn(rounded === "full" && "!rounded-full", className)}
    />
  );
}
