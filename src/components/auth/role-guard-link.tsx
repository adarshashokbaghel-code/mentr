"use client";

import { useRoleAction } from "@/hooks/use-role-action";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ComponentProps } from "react";

type GuardLinkProps = ComponentProps<typeof Link>;

function GuardLink({
  href,
  onClick,
  className,
  children,
  guard,
  ...rest
}: GuardLinkProps & {
  guard: (opts: { href: string }) => boolean;
}) {
  const path = typeof href === "string" ? href : href.pathname || "/";

  return (
    <Link
      href={href}
      className={cn(className)}
      onClick={(e) => {
        if (!guard({ href: path })) {
          e.preventDefault();
          return;
        }
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}

/** Parent-only navigation — tutors see a toast instead. */
export function ParentActionLink(props: GuardLinkProps) {
  const { requireParent } = useRoleAction();
  return (
    <GuardLink
      {...props}
      guard={({ href }) => requireParent({ href })}
    />
  );
}

/** Faculty-only navigation — parents see a toast instead. */
export function FacultyActionLink(props: GuardLinkProps) {
  const { requireFaculty } = useRoleAction();
  return (
    <GuardLink
      {...props}
      guard={({ href }) => requireFaculty({ href })}
    />
  );
}
