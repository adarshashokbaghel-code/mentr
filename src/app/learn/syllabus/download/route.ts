import { SYLLABUS_PDF_FILENAME } from "@/lib/learn-syllabus-doc";
import { buildSyllabusPdf } from "@/lib/learn-syllabus-pdf";

export const dynamic = "force-static";

export async function GET() {
  const pdf = buildSyllabusPdf();
  return new Response(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${SYLLABUS_PDF_FILENAME}"`,
      "Cache-Control": "no-cache",
    },
  });
}
