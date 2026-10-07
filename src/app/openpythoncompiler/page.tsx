import { OpenPythonCompiler } from "@/components/learn-python/compiler/open-python-compiler";
import { hubOpenGraph } from "@/lib/seo";
import type { Metadata } from "next";

const PATH = "/openpythoncompiler";
const TITLE = "Online Python Compiler: Free, Runs in Your Browser";
const DESCRIPTION =
  "Write and run Python 3 online for free. Full-screen editor, real input(), clear error messages, examples, and file download. No sign-up, nothing to install.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: hubOpenGraph(TITLE, DESCRIPTION, PATH),
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function OpenPythonCompilerPage() {
  return <OpenPythonCompiler />;
}
