import {
  MENTR_PRICING_METADATA,
  MentrPricingRoute,
} from "@/components/mentr-pricing/mentr-pricing-route";
import type { Metadata } from "next";

export const metadata: Metadata = MENTR_PRICING_METADATA;

export default function MentrPricingRoutePage() {
  return <MentrPricingRoute />;
}
