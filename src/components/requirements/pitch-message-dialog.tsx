"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function PitchMessageDialog({
  open,
  onClose,
  teacherName,
  message,
  subtitle,
}: {
  open: boolean;
  onClose: () => void;
  teacherName: string;
  message: string;
  subtitle?: string;
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="gap-0 overflow-hidden border-hairline bg-white p-0 sm:max-w-lg">
        <DialogHeader className="border-b border-hairline bg-cream/30 px-6 py-5">
          <DialogTitle className="text-lg font-bold text-ink">
            Message from {teacherName}
          </DialogTitle>
          {subtitle && (
            <DialogDescription className="text-sm text-muted">
              {subtitle}
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="max-h-[50vh] overflow-y-auto px-6 py-5">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink">
            {message}
          </p>
        </div>
        <DialogFooter className="border-t border-hairline bg-cream/20 px-6 py-4">
          <Button className="w-full sm:w-auto" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
