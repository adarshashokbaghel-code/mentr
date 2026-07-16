import { redirect } from "next/navigation";

/** Youform-style /login alias → faculty auth */
export default function LoginAliasPage() {
  redirect("/faculty");
}
