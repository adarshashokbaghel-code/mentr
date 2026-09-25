"use client";

import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

type LegalConsentCheckboxProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  id?: string;
  className?: string;
};

/**
 * Single required consent for signup (Terms + Privacy).
 * Unchecked by default — standard legal pattern; not shown on login.
 */
export function LegalConsentCheckbox({
  checked,
  onCheckedChange,
  id = "legal-consent",
  className,
}: LegalConsentCheckboxProps) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="flex cursor-pointer items-start gap-2.5 text-left text-[13px] leading-snug text-muted"
      >
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={(v) => onCheckedChange(v === true)}
          className="mt-0.5 border-[#c9c4bb] data-[state=checked]:border-ink data-[state=checked]:bg-ink"
          aria-required
        />
        <span>
          I agree to Mentr&apos;s{" "}
          <Link
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-ink underline underline-offset-2 hover:text-coral"
            onClick={(e) => e.stopPropagation()}
          >
            Terms of service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-ink underline underline-offset-2 hover:text-coral"
            onClick={(e) => e.stopPropagation()}
          >
            Privacy policy
          </Link>
          , including how my profile and contact details may be shown as
          described there.
        </span>
      </label>
    </div>
  );
}
