import { PyFinalHome } from "@/components/learn-python/lms/py-final";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Final Challenge | Learn Python",
};

export default function LearnPythonFinalPage() {
  return <PyFinalHome />;
}
