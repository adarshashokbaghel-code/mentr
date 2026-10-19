import { PY_LMS_PATH_TEST } from "@/lib/python-lms";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Test to Intermediate | Learn Python",
  description: "Timed test to unlock Python Intermediate — inside the Mentr LMS.",
  alternates: { canonical: "/learnpython/placement" },
};

/** Marketing URL → in-app test (sidebar stays visible). */
export default function PlacementPage() {
  redirect(PY_LMS_PATH_TEST);
}
