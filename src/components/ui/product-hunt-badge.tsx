"use client";

import { TrackedLink } from "@/components/marketing/tracked-link";

const FEATURED_URL =
  "https://www.producthunt.com/products/mentr?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-mentr";

const FEATURED_SRC =
  "https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1198086&theme=light";

const REVIEW_URL =
  "https://www.producthunt.com/products/mentr/reviews/new?utm_source=badge-product_review&utm_medium=badge&utm_campaign=badge-mentr";

const REVIEW_SRC =
  "https://api.producthunt.com/widgets/embed-image/v1/product_review.svg?product_id=1271062&theme=light";

const ALT =
  "Mentr — Find, compare, and hire verified tutors for free | Product Hunt";

type BadgeProps = {
  className?: string;
  compact?: boolean;
};

function badgeImgClass(compact?: boolean) {
  return compact
    ? "h-auto w-[200px] max-w-full sm:w-[250px]"
    : "h-auto w-[250px] max-w-full";
}

export function ProductHuntFeaturedBadge({ className, compact }: BadgeProps) {
  return (
    <TrackedLink
      href={FEATURED_URL}
      slug="product-hunt"
      kind="social"
      content="featured-badge"
      className={className}
      external
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt={ALT}
        width={250}
        height={54}
        src={FEATURED_SRC}
        className={badgeImgClass(compact)}
      />
    </TrackedLink>
  );
}

export function ProductHuntReviewBadge({ className, compact }: BadgeProps) {
  return (
    <TrackedLink
      href={REVIEW_URL}
      slug="product-hunt"
      kind="social"
      content="review-badge"
      className={className}
      external
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt={ALT}
        width={250}
        height={54}
        src={REVIEW_SRC}
        className={badgeImgClass(compact)}
      />
    </TrackedLink>
  );
}

/** Featured + review badges — used in hero and footer */
export function ProductHuntBadges({
  className,
  compact,
}: BadgeProps) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className ?? ""}`}>
      <ProductHuntFeaturedBadge compact={compact} />
      <ProductHuntReviewBadge compact={compact} />
    </div>
  );
}

/** @deprecated Use ProductHuntBadges or ProductHuntFeaturedBadge */
export function ProductHuntBadge(props: BadgeProps) {
  return <ProductHuntFeaturedBadge {...props} />;
}
