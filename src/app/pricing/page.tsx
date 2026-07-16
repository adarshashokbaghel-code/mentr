import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { ZeroFees } from "@/components/landing/zero-fees";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentr by Paprly Pricing — Free Forever for Parents & Faculty",
  description:
    "Mentr by Paprly charges ₹0 platform fee. Free to search, free to list, free to contact. Faculty keep 100% of their earnings.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Pricing", path: "/pricing" },
        ])}
      />
      <Navbar />
      <main>
        <ZeroFees />
      </main>
      <Footer />
    </>
  );
}
