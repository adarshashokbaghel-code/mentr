import {
  MENTR_PRICING_METADATA,
  MentrPricingRoute,
} from "@/components/mentr-pricing/mentr-pricing-route";
import type { Metadata } from "next";

/** Same page as /mentrpricing; canonical points there so search engines index one URL. */
export const metadata: Metadata = MENTR_PRICING_METADATA;

export default function PricingPage() {
  return <MentrPricingRoute />;
}
