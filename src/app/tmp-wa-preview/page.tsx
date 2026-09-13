import { WhatsappGroupCard } from "@/components/dashboard/whatsapp-group-card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preview",
  robots: { index: false, follow: false },
};

export default function TmpWaPreviewPage() {
  return (
    <main className="min-h-screen bg-cream p-4 sm:p-8">
      <div className="mx-auto max-w-[1400px] space-y-6">
        <WhatsappGroupCard description="Dear parents and mentors — join our official group for daily updates, new tutor postings and quick answers from the Mentr team." />
        <div className="max-w-[420px]">
          <WhatsappGroupCard />
        </div>
      </div>
    </main>
  );
}
