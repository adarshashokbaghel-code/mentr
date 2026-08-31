/** Authorised digital sellers for Google AdSense — required at /ads.txt */
export function GET() {
  return new Response(
    "google.com, pub-4918938808225819, DIRECT, f08c47fec0942fa0\n",
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=86400",
      },
    },
  );
}
