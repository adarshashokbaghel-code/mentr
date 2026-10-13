"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { openPostRequirement } from "@/components/requirements/post-requirement-host";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Megaphone } from "lucide-react";

type PostRequirementButtonProps = {
  label?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  showIcon?: boolean;
};

/** Post a learning need — parents and guests both go straight to the form. */
export function PostRequirementButton({
  label = "Post your requirement",
  size = "md",
  variant = "secondary",
  className,
  showIcon = true,
}: PostRequirementButtonProps) {
  const { loading } = useAuth();

  return (
    <Button
      type="button"
      size={size}
      variant={variant}
      className={cn(className)}
      onClick={() => openPostRequirement()}
      disabled={loading}
    >
      {showIcon && <Megaphone className="h-4 w-4" />}
      {label}
    </Button>
  );
}
