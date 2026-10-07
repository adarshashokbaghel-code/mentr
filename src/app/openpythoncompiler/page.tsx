import { CompilerLanding } from "@/components/compilers/compiler-landing";
import { Footer } from "@/components/landing/footer";
import { OpenPythonCompiler } from "@/components/learn-python/compiler/open-python-compiler";
import { JsonLd } from "@/components/seo/json-ld";
import { compilerJsonLd, compilerMetadata, getCompiler } from "@/lib/compilers";
import type { Metadata } from "next";

const def = getCompiler("python");

export const metadata: Metadata = compilerMetadata(def);

export default function OpenPythonCompilerPage() {
  return (
    <>
      <JsonLd data={compilerJsonLd(def)} />
      <main>
        <OpenPythonCompiler />
        <CompilerLanding def={def} />
      </main>
      <Footer />
    </>
  );
}
