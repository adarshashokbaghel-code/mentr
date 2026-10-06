import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { PyCertificateVerify } from "@/components/learn-python/lms/py-certificate-verify";
import type { Metadata } from "next";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Verify certificate ${id} | Learn Python`,
    robots: { index: false, follow: false },
  };
}

export default async function LearnPythonCertificatePage({ params }: Props) {
  const { id } = await params;
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream">
        <PyCertificateVerify id={decodeURIComponent(id).toUpperCase()} />
      </main>
      <Footer />
    </>
  );
}
