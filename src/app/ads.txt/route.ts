/** Authorised digital sellers for Google AdSense — required at /ads.txt */
import { ADSENSE_PUBLISHER_ID } from "@/components/seo/google-verification";

export function GET() {
  return new Response(
    `google.com, ${ADSENSE_PUBLISHER_ID}, DIRECT, f08c47fec0942fa0\n`,
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=86400",
      },
    },
  );
}
