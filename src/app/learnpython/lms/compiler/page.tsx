import { PyCompiler } from "@/components/learn-python/compiler/py-compiler";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Python Compiler",
};

export default function LearnPythonCompilerPage() {
  return <PyCompiler />;
}
