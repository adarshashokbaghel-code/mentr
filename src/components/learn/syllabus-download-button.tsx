"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { LearnEnrollModal } from "@/components/learn/learn-enroll-modal";
import {
  fetchLearnEnrollment,
  readLearnEnrollmentLocal,
} from "@/lib/learn-enroll";
import { SYLLABUS_DOWNLOAD_HREF } from "@/lib/learn-syllabus-doc";
import { cn } from "@/lib/utils";
import { Download } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

function triggerSyllabusDownload() {
  window.location.assign(SYLLABUS_DOWNLOAD_HREF);
}

export function SyllabusDownloadButton({
  className,
  children,
  /** When true, opens enroll/download if URL has ?download=1 */
  honorDownloadQuery = false,
}: {
  className?: string;
  children?: ReactNode;
  honorDownloadQuery?: boolean;
}) {
  const { user, loading: authLoading } = useAuth();
  const [enrollOpen, setEnrollOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const queryHandled = useRef(false);

  const tryDownloadOrEnroll = useCallback(async () => {
    if (busy) return;
    setBusy(true);
    try {
      if (user?.role === "parent") {
        const local = readLearnEnrollmentLocal();
        if (local) {
          triggerSyllabusDownload();
          return;
        }
        const remote = await fetchLearnEnrollment();
        if (remote) {
          triggerSyllabusDownload();
          return;
        }
      }
      setEnrollOpen(true);
    } finally {
      setBusy(false);
    }
  }, [busy, user?.role]);

  useEffect(() => {
    if (!honorDownloadQuery || authLoading || queryHandled.current) return;
    if (typeof window === "undefined") return;
    const wants =
      new URLSearchParams(window.location.search).get("download") === "1";
    if (!wants) return;
    queryHandled.current = true;
    void tryDownloadOrEnroll();
  }, [honorDownloadQuery, authLoading, tryDownloadOrEnroll]);

  return (
    <>
      <button
        type="button"
        disabled={busy || authLoading}
        onClick={() => void tryDownloadOrEnroll()}
        className={cn(className)}
      >
        {children ?? (
          <>
            <Download className="h-4 w-4" />
            Download PDF
          </>
        )}
      </button>
      <LearnEnrollModal
        open={enrollOpen}
        onClose={() => setEnrollOpen(false)}
        onEnrolled={() => {
          setEnrollOpen(false);
          triggerSyllabusDownload();
        }}
      />
    </>
  );
}
