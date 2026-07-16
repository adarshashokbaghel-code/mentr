import { redirect } from "next/navigation";

/** Legacy geo URL — faculty acquisition lives at /for-faculty */
export default function BecomeMentorBengaluruPage() {
  redirect("/for-faculty");
}
