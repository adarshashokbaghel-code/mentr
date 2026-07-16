import { redirect } from "next/navigation";

/** Legacy geo URL — parents landing lives at /parents */
export default function ParentsBengaluruPage() {
  redirect("/parents");
}
