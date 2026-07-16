import { redirect } from "next/navigation";

/** SEO-friendly slug — canonical faculty page is /for-faculty */
export default function BecomeMentorPage() {
  redirect("/for-faculty");
}
