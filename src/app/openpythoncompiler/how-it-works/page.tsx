import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { CompilerArchitectureArticle } from "@/components/learn-python/compiler/compiler-architecture-article";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";
import { hubOpenGraph } from "@/lib/seo";
import type { Metadata } from "next";

const PATH = "/openpythoncompiler/how-it-works";
const TITLE = "How We Built a Python Compiler That Runs in Your Browser";
const DESCRIPTION =
  "The full architecture of Mentr's online Python compiler: Pyodide (CPython on WebAssembly), Web Workers, interactive input() with SharedArrayBuffer, safety limits, and one layout for phone and desktop.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: hubOpenGraph(TITLE, DESCRIPTION, PATH),
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function CompilerHowItWorksPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Online Python compiler", path: "/openpythoncompiler" },
            { name: "How it works", path: PATH },
          ]),
        ]}
      />
      <Navbar />
      <main className="min-h-screen bg-cream">
        <CompilerArchitectureArticle />
      </main>
      <Footer />
    </>
  );
}
