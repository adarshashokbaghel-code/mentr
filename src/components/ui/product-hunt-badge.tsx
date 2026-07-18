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
    <a
      href={FEATURED_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label="Mentr on Product Hunt"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt={ALT}
        width={250}
        height={54}
        src={FEATURED_SRC}
        className={badgeImgClass(compact)}
      />
    </a>
  );
}

export function ProductHuntReviewBadge({ className, compact }: BadgeProps) {
  return (
    <a
      href={REVIEW_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label="Review Mentr on Product Hunt"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt={ALT}
        width={250}
        height={54}
        src={REVIEW_SRC}
        className={badgeImgClass(compact)}
      />
    </a>
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
