import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { CompilerArchitectureArticle } from "@/components/learn-python/compiler/compiler-architecture-article";
import { JsonLd } from "@/components/seo/json-ld";
import { getCompiler, howItWorksJsonLd, howItWorksMetadata } from "@/lib/compilers";
import type { Metadata } from "next";

const def = getCompiler("python");

export const metadata: Metadata = howItWorksMetadata(def);

export default function CompilerHowItWorksPage() {
  return (
    <>
      <JsonLd data={howItWorksJsonLd(def)} />
      <Navbar />
      <main className="min-h-screen bg-cream">
        <CompilerArchitectureArticle />
      </main>
      <Footer />
    </>
  );
}
