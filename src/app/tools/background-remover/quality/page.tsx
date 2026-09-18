import { permanentRedirect } from "next/navigation";

/** Legacy URL — quality narrative lives on the tool page + technical article. */
export default function BackgroundRemoverQualityRedirect() {
  permanentRedirect("/technical/bgremover");
}
